<?php

namespace App\Services;

use App\Models\EvaluacionAplicacion;
use DOMDocument;
use DOMElement;
use DOMXPath;
use Illuminate\Support\Collection;
use PhpOffice\PhpWord\Settings;
use PhpOffice\PhpWord\TemplateProcessor;
use ZipArchive;

class EvaluacionWordService
{
    private const WORD_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

    private const XML_NS = 'http://www.w3.org/XML/1998/namespace';

    private const PLANTILLAS = [
        'vertical' => 'evaluacion.docx',
        'horizontal' => 'evaluacion_horizontal.docx',
    ];

    public function generar(
        EvaluacionAplicacion $aplicacion,
        string $codigo = 'vertical'
    ): string {
        $aplicacion->loadMissing([
            'evaluacion.areas.subareas',
            'estudiante.grupo',
            'resultados',
        ]);

        $evaluacion = $aplicacion->evaluacion;

        $tmpDir = storage_path('app/tmp');

        if (! is_dir($tmpDir)) {
            mkdir($tmpDir, 0775, true);
        }

        if (! is_writable($tmpDir)) {
            throw new \Exception(
                'El directorio temporal no tiene permisos de escritura: '.$tmpDir
            );
        }

        Settings::setTempDir($tmpDir);

        putenv('TMPDIR='.$tmpDir);
        putenv('TMP='.$tmpDir);
        putenv('TEMP='.$tmpDir);
        @ini_set('sys_temp_dir', $tmpDir);

        if (! isset(self::PLANTILLAS[$codigo])) {
            throw new \Exception(
                'La plantilla Word no está disponible: '.$codigo
            );
        }

        $archivoPlantilla = storage_path(
            'app/plantillas/'.self::PLANTILLAS[$codigo]
        );

        if (! file_exists($archivoPlantilla)) {
            throw new \Exception('No existe la plantilla Word de evaluación.');
        }

        $temporal = $tmpDir.'/evaluacion_'.uniqid('', true).'.docx';

        if (! copy($archivoPlantilla, $temporal)) {
            throw new \Exception('No se pudo crear el archivo temporal de Word.');
        }

        $archivoFinal = null;

        try {
            $zip = new ZipArchive;

            if ($zip->open($temporal) !== true) {
                throw new \Exception('No se pudo abrir la plantilla Word.');
            }

            $xml = $zip->getFromName('word/document.xml');

            if ($xml === false) {
                $zip->close();

                throw new \Exception('No se encontró word/document.xml.');
            }

            $dom = new DOMDocument;
            $dom->preserveWhiteSpace = true;
            $dom->formatOutput = false;

            libxml_use_internal_errors(true);
            $resultado = $dom->loadXML($xml);
            libxml_clear_errors();

            if (! $resultado) {
                $zip->close();

                throw new \Exception('No se pudo leer el XML del Word.');
            }

            $xpath = new DOMXPath($dom);
            $xpath->registerNamespace('w', self::WORD_NS);

            $filaArea = $this->buscarFilaPorTexto($xpath, '${area}');
            $filaSubarea = $this->buscarFilaPorTexto($xpath, '${subarea}');

            if ($filaArea === null) {
                $zip->close();

                throw new \Exception('No se encontró la fila de áreas en el Word.');
            }

            if ($filaSubarea === null) {
                $zip->close();

                throw new \Exception('No se encontró la fila de subáreas en el Word.');
            }

            $padre = $filaArea->parentNode;

            if (! $padre instanceof DOMElement) {
                $zip->close();

                throw new \Exception('No se pudo ubicar la tabla de áreas en el Word.');
            }

            $resultados = $aplicacion->resultados->keyBy('evaluacion_subarea_id');

            foreach ($evaluacion->areas as $area) {
                $filaAreaNueva = $this->clonarFila($filaArea);
                $this->establecerTextoPrimeraCelda($filaAreaNueva, $area->nombre);

                $padre->insertBefore($filaAreaNueva, $filaArea);

                foreach ($area->subareas as $subarea) {
                    $filaSubareaNueva = $this->clonarFila($filaSubarea);
                    $this->establecerTextoPrimeraCelda($filaSubareaNueva, $subarea->nombre);

                    $valoracion = $resultados->get($subarea->id)?->valoracion;

                    if ($valoracion !== null) {
                        $this->marcarValoracion($filaSubareaNueva, $valoracion);
                    }

                    $padre->insertBefore($filaSubareaNueva, $filaArea);
                }
            }

            if ($filaArea->parentNode) {
                $filaArea->parentNode->removeChild($filaArea);
            }

            if ($filaSubarea->parentNode) {
                $filaSubarea->parentNode->removeChild($filaSubarea);
            }

            $zip->addFromString('word/document.xml', $dom->saveXML());
            $zip->close();

            $archivoFinal = $tmpDir.'/evaluacion_final_'.uniqid('', true).'.docx';

            $template = new TemplateProcessor($temporal);

            $template->setValue('type_evaluation', $evaluacion->tipo_evaluacion);
            $template->setValue('name_student', $aplicacion->estudiante->nombre_completo);
            $template->setValue('name_grupo', $aplicacion->estudiante->grupo?->nombre ?? '');
            $template->setValue('name_teacher', $evaluacion->docente ?? '');
            $template->setValue(
                'date',
                $this->formatearPeriodo($evaluacion->fecha_inicio, $evaluacion->fecha_fin)
            );
            $template->setValue('name_proyect', $evaluacion->proyecto ?? '');

            $template->saveAs($archivoFinal);

            unset($template);

            $this->eliminarTemporal($temporal);

            return $archivoFinal;
        } catch (\Throwable $e) {
            $this->eliminarTemporal($temporal);

            if ($archivoFinal !== null) {
                $this->eliminarTemporal($archivoFinal);
            }

            throw $e;
        }
    }

    public function generarTodas(
        Collection $aplicaciones,
        string $codigo = 'vertical'
    ): string {
        if ($aplicaciones->isEmpty()) {
            throw new \Exception(
                'No hay evaluaciones completadas para generar el Word.'
            );
        }

        if (! isset(self::PLANTILLAS[$codigo])) {
            throw new \Exception(
                'La plantilla Word no está disponible: '.$codigo
            );
        }

        $archivos = [];

        try {
            foreach ($aplicaciones as $aplicacion) {
                $archivos[] = $this->generar($aplicacion, $codigo);
            }

            if (count($archivos) === 1) {
                return $archivos[0];
            }

            return $this->fusionarDocumentos($archivos);
        } catch (\Throwable $e) {
            foreach ($archivos as $archivo) {
                $this->eliminarTemporal($archivo);
            }

            throw $e;
        }
    }

    private function fusionarDocumentos(array $archivos): string
    {
        $base = array_shift($archivos);

        $zip = new ZipArchive;

        if ($zip->open($base) !== true) {
            throw new \Exception(
                'No se pudo abrir el Word base para unir las evaluaciones.'
            );
        }

        $zipAbierto = true;

        $xmlBase = $zip->getFromName('word/document.xml');

        if ($xmlBase === false) {
            $zip->close();

            throw new \Exception('No se encontró word/document.xml.');
        }

        $domBase = $this->cargarDocumentXml($xmlBase);

        $xpathBase = new DOMXPath($domBase);
        $xpathBase->registerNamespace('w', self::WORD_NS);

        $bodyBase = $xpathBase->query('//w:body')->item(0);

        if (! $bodyBase instanceof DOMElement) {
            $zip->close();

            throw new \Exception('No se pudo ubicar el cuerpo del Word base.');
        }

        $referencia = $xpathBase->query('./w:sectPr', $bodyBase)->item(0);

        if (! $referencia instanceof DOMElement) {
            $referencia = null;
        }

        try {
            foreach ($archivos as $archivoExtra) {
                $zipExtra = new ZipArchive;

                if ($zipExtra->open($archivoExtra) !== true) {
                    throw new \Exception(
                        'No se pudo abrir un Word para unir las evaluaciones.'
                    );
                }

                $xmlExtra = $zipExtra->getFromName('word/document.xml');
                $zipExtra->close();

                if ($xmlExtra === false) {
                    throw new \Exception(
                        'No se encontró word/document.xml en un documento a unir.'
                    );
                }

                $domExtra = $this->cargarDocumentXml($xmlExtra);

                $xpathExtra = new DOMXPath($domExtra);
                $xpathExtra->registerNamespace('w', self::WORD_NS);

                $bodyExtra = $xpathExtra->query('//w:body')->item(0);

                if (! $bodyExtra instanceof DOMElement) {
                    throw new \Exception(
                        'No se pudo ubicar el cuerpo de un documento a unir.'
                    );
                }

                $bodyBase->insertBefore(
                    $this->crearSaltoDePagina($domBase),
                    $referencia
                );

                foreach ($bodyExtra->childNodes as $nodo) {
                    if ($nodo instanceof DOMElement
                        && $nodo->localName === 'sectPr') {
                        continue;
                    }

                    $bodyBase->insertBefore(
                        $domBase->importNode($nodo, true),
                        $referencia
                    );
                }

                $this->eliminarTemporal($archivoExtra);
            }

            $zip->addFromString('word/document.xml', $domBase->saveXML());
            $zip->close();

            $zipAbierto = false;

            return $base;
        } catch (\Throwable $e) {
            if ($zipAbierto) {
                $zip->close();
            }

            throw $e;
        }
    }

    private function crearSaltoDePagina(DOMDocument $dom): DOMElement
    {
        $parrafo = $dom->createElementNS(self::WORD_NS, 'w:p');
        $run = $dom->createElementNS(self::WORD_NS, 'w:r');
        $salto = $dom->createElementNS(self::WORD_NS, 'w:br');

        $salto->setAttributeNS(self::WORD_NS, 'w:type', 'page');

        $run->appendChild($salto);
        $parrafo->appendChild($run);

        return $parrafo;
    }

    private function cargarDocumentXml(string $xml): DOMDocument
    {
        $dom = new DOMDocument;
        $dom->preserveWhiteSpace = true;
        $dom->formatOutput = false;

        libxml_use_internal_errors(true);
        $resultado = $dom->loadXML($xml);
        libxml_clear_errors();

        if (! $resultado) {
            throw new \Exception('No se pudo leer el XML del Word.');
        }

        return $dom;
    }

    private function formatearPeriodo($inicio, $fin): string
    {
        $fechaInicio = \Carbon\Carbon::parse($inicio)->locale('es');
        $fechaFin = \Carbon\Carbon::parse($fin)->locale('es');

        if ($fechaInicio->isSameDay($fechaFin)) {
            return $fechaInicio->translatedFormat('l d \d\e F');
        }

        $diaSemana = $fechaInicio->translatedFormat('l');
        $diaInicio = $fechaInicio->format('d');
        $diaFin = $fechaFin->format('d');
        $mesInicio = $fechaInicio->translatedFormat('F');
        $mesFin = $fechaFin->translatedFormat('F');

        if ($fechaInicio->isSameMonth($fechaFin)) {
            return $diaSemana.' '.$diaInicio.' al '.$diaFin.' de '.$mesFin;
        }

        return $diaSemana.' '.$diaInicio.' de '.$mesInicio.' al '.$diaFin.' de '.$mesFin;
    }

    private function buscarFilaPorTexto(
        DOMXPath $xpath,
        string $textoBuscado
    ): ?DOMElement {
        foreach ($xpath->query('//w:tr') as $fila) {
            if (! $fila instanceof DOMElement) {
                continue;
            }

            $texto = '';

            foreach ($xpath->query('.//w:t', $fila) as $nodoTexto) {
                $texto .= $nodoTexto->nodeValue;
            }

            if (str_contains($texto, $textoBuscado)) {
                return $fila;
            }
        }

        return null;
    }

    private function clonarFila(DOMElement $fila): DOMElement
    {
        return $fila->cloneNode(true);
    }

    private function establecerTextoPrimeraCelda(
        DOMElement $fila,
        string $texto
    ): void {
        $xpath = new DOMXPath($fila->ownerDocument);
        $xpath->registerNamespace('w', self::WORD_NS);

        $celda = $xpath->query('./w:tc', $fila)->item(0);

        if (! $celda instanceof DOMElement) {
            return;
        }

        $parrafos = $xpath->query('./w:p', $celda);
        $parrafo = $parrafos->item(0);

        if (! $parrafo instanceof DOMElement) {
            $parrafo = $fila->ownerDocument->createElementNS(self::WORD_NS, 'w:p');
            $celda->appendChild($parrafo);
        }

        $pPr = $xpath->query('./w:pPr', $parrafo)->item(0);
        $runReferencia = $xpath->query('./w:r', $parrafo)->item(0);

        foreach (iterator_to_array($parrafo->childNodes) as $hijo) {
            if ($pPr && $hijo === $pPr) {
                continue;
            }

            $parrafo->removeChild($hijo);
        }

        foreach (iterator_to_array($celda->childNodes) as $hijo) {
            if ($hijo === $parrafo) {
                continue;
            }

            if ($hijo instanceof DOMElement && $hijo->localName === 'p') {
                $celda->removeChild($hijo);
            }
        }

        $run = $runReferencia instanceof DOMElement
            ? $runReferencia->cloneNode(true)
            : $fila->ownerDocument->createElementNS(self::WORD_NS, 'w:r');

        foreach (iterator_to_array($run->childNodes) as $hijo) {
            if ($hijo instanceof DOMElement && $hijo->localName === 'rPr') {
                continue;
            }

            $run->removeChild($hijo);
        }

        $textoWord = $fila->ownerDocument->createElementNS(self::WORD_NS, 'w:t');
        $textoWord->setAttributeNS(self::XML_NS, 'xml:space', 'preserve');
        $textoWord->appendChild($fila->ownerDocument->createTextNode($texto));
        $run->appendChild($textoWord);

        $parrafo->appendChild($run);
    }

    private function marcarValoracion(
        DOMElement $fila,
        string $valoracion
    ): void {
        $celdas = [
            'excelente' => 1,
            'en_proceso' => 2,
            'debilitado' => 3,
            'nulo' => 4,
        ];

        if (! isset($celdas[$valoracion])) {
            return;
        }

        $xpath = new DOMXPath($fila->ownerDocument);
        $xpath->registerNamespace('w', self::WORD_NS);

        $celda = $xpath->query('./w:tc', $fila)->item($celdas[$valoracion]);

        if (! $celda instanceof DOMElement) {
            return;
        }

        $parrafo = $xpath->query('./w:p', $celda)->item(0);

        if (! $parrafo instanceof DOMElement) {
            $parrafo = $fila->ownerDocument->createElementNS(self::WORD_NS, 'w:p');
            $celda->appendChild($parrafo);
        }

        $run = $fila->ownerDocument->createElementNS(self::WORD_NS, 'w:r');

        $runReferencia = $xpath->query('.//w:r', $fila)->item(0);

        if ($runReferencia instanceof DOMElement) {
            $rPrReferencia = $xpath->query('./w:rPr', $runReferencia)->item(0);

            if ($rPrReferencia instanceof DOMElement) {
                $rPrMarca = $rPrReferencia->cloneNode(true);

                $rFontsMarca = $xpath->query('./w:rFonts', $rPrMarca)->item(0);

                if ($rFontsMarca instanceof DOMElement) {
                    $rFontsMarca->setAttributeNS(self::WORD_NS, 'w:ascii', 'Wingdings');
                    $rFontsMarca->setAttributeNS(self::WORD_NS, 'w:hAnsi', 'Wingdings');
                    $rFontsMarca->setAttributeNS(self::WORD_NS, 'w:cs', 'Wingdings');
                }

                $run->appendChild($rPrMarca);
            }
        }

        $marca = $fila->ownerDocument->createElementNS(self::WORD_NS, 'w:sym');

        $marca->setAttributeNS(self::WORD_NS, 'w:font', 'Wingdings');
        $marca->setAttributeNS(self::WORD_NS, 'w:char', 'F0FC');

        $run->appendChild($marca);

        $parrafo->appendChild($run);
    }

    private function eliminarTemporal(string $archivo): void
    {
        if (! file_exists($archivo)) {
            return;
        }

        for ($i = 0; $i < 10; $i++) {
            if (@unlink($archivo)) {
                return;
            }

            usleep(100000);
        }
    }
}
