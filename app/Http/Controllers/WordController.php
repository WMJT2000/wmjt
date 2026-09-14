<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpWord\TemplateProcessor;
use ZipArchive;
use DOMDocument;
use DOMXPath;
use DOMElement;

class WordController extends Controller
{
    private const WORD_NS =
    'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

    private const XML_NS =
    'http://www.w3.org/XML/1998/namespace';

    public function crear()
    {
        return view('word.crear');
    }

    public function generar(Request $request)
    {
        $request->validate([
            '1_experiencia_prendizaje' =>
            'required',

            '2_descripcion_general_experiencia' =>
            'required',

            '3_nombre_maestra' =>
            'required',

            '4_tiempo_estimado' =>
            'required',

            '5_fecha' =>
            'required',

            '6_nivel_educativo' =>
            'required',

            '7_objetivo_aprendizaje' =>
            'required',

            '8_elemento_integrador' =>
            'required',

            '9_nocion_dia' =>
            'required',

            /*
            |--------------------------------------------------------------------------
            | TAMAÑO DE LETRA DE ACTIVIDADES
            |--------------------------------------------------------------------------
            */

            'tamano_letra_actividades' =>
            'nullable|integer|min:8|max:20',

            /*
            |--------------------------------------------------------------------------
            | ACTIVIDADES
            |--------------------------------------------------------------------------
            */

            'part1' =>
            'nullable|array|max:10',

            'part2' =>
            'nullable|array|max:10',

            'part1.*.ambito' =>
            'nullable|string',

            'part1.*.destreza' =>
            'nullable|string',

            'part1.*.estrategias_metologicas' =>
            'nullable|string',

            'part1.*.recursos' =>
            'nullable|string',

            'part1.*.indicadores_logro' =>
            'nullable|string',

            'part2.*.ambito' =>
            'nullable|string',

            'part2.*.destreza' =>
            'nullable|string',

            'part2.*.estrategias_metologicas' =>
            'nullable|string',

            'part2.*.recursos' =>
            'nullable|string',

            'part2.*.indicadores_logro' =>
            'nullable|string',
        ]);

        $part1 = $request->input(
            'part1',
            []
        );

        $part2 = $request->input(
            'part2',
            []
        );

        /*
        |--------------------------------------------------------------------------
        | TAMAÑO DE LETRA
        |--------------------------------------------------------------------------
        |
        | Si no viene desde Blade usamos 10 pt.
        |
        */

        $tamanoLetraActividades = (int) $request->input(
            'tamano_letra_actividades',
            8
        );

        /*
        |--------------------------------------------------------------------------
        | PLANTILLA
        |--------------------------------------------------------------------------
        */

        $plantilla = storage_path(
            'app/plantillas/planificacion.docx'
        );

        if (!file_exists($plantilla)) {
            throw new \Exception(
                'No existe la plantilla Word.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | ARCHIVO TEMPORAL
        |--------------------------------------------------------------------------
        */

        $temporal = storage_path(
            'app/plantillas/temporal_planificacion_' .
                uniqid() .
                '.docx'
        );

        copy(
            $plantilla,
            $temporal
        );

        try {

            /*
            |--------------------------------------------------------------------------
            | ABRIR WORD
            |--------------------------------------------------------------------------
            */

            $zip = new ZipArchive();

            if ($zip->open($temporal) !== true) {
                throw new \Exception(
                    'No se pudo abrir la plantilla Word.'
                );
            }

            $xml = $zip->getFromName(
                'word/document.xml'
            );

            if ($xml === false) {
                $zip->close();

                throw new \Exception(
                    'No se encontró word/document.xml.'
                );
            }

            /*
            |--------------------------------------------------------------------------
            | DOM
            |--------------------------------------------------------------------------
            */

            $dom = new DOMDocument();

            $dom->preserveWhiteSpace = true;
            $dom->formatOutput = false;

            libxml_use_internal_errors(true);

            $resultado = $dom->loadXML($xml);

            libxml_clear_errors();

            if (!$resultado) {
                $zip->close();

                throw new \Exception(
                    'No se pudo leer el XML del Word.'
                );
            }

            $xpath = new DOMXPath($dom);

            $xpath->registerNamespace(
                'w',
                self::WORD_NS
            );

            /*
            |--------------------------------------------------------------------------
            | CREAR LISTA REAL DE WORD
            |--------------------------------------------------------------------------
            */

            $numIdLista = $this->prepararListaWord(
                $zip
            );

            /*
            |--------------------------------------------------------------------------
            | BUSCAR FILA DE ACTIVIDAD
            |--------------------------------------------------------------------------
            */

            $filaActividad = $this->buscarFilaActividad(
                $xpath
            );

            if ($filaActividad === null) {
                $zip->close();

                throw new \Exception(
                    'No se encontró la fila de actividades en el Word.'
                );
            }

            /*
            |--------------------------------------------------------------------------
            | BUSCAR SNACK
            |--------------------------------------------------------------------------
            */

            $filaSnack = $this->buscarFilaSnack(
                $xpath
            );

            $padre = $filaActividad->parentNode;

            /*
            |--------------------------------------------------------------------------
            | ACTIVIDADES ANTES DEL SNACK
            |--------------------------------------------------------------------------
            */

            foreach ($part1 as $actividad) {

                $fila = $this->clonarFila(
                    $filaActividad
                );

                $this->rellenarActividad(
                    $dom,
                    $xpath,
                    $fila,
                    $actividad,
                    $numIdLista,
                    $tamanoLetraActividades
                );

                $padre->insertBefore(
                    $fila,
                    $filaActividad
                );
            }

            /*
            |--------------------------------------------------------------------------
            | SNACK
            |--------------------------------------------------------------------------
            */

            if ($filaSnack === null) {

                $filaSnack = $this->clonarFila(
                    $filaActividad
                );

                $this->rellenarSnack(
                    $dom,
                    $xpath,
                    $filaSnack,
                    $tamanoLetraActividades
                );

                $padre->insertBefore(
                    $filaSnack,
                    $filaActividad
                );
            }

            /*
            |--------------------------------------------------------------------------
            | ACTIVIDADES DESPUÉS DEL SNACK
            |--------------------------------------------------------------------------
            */

            foreach ($part2 as $actividad) {

                $fila = $this->clonarFila(
                    $filaActividad
                );

                $this->rellenarActividad(
                    $dom,
                    $xpath,
                    $fila,
                    $actividad,
                    $numIdLista,
                    $tamanoLetraActividades
                );

                $this->insertarDespues(
                    $filaSnack,
                    $fila
                );

                $filaSnack = $fila;
            }

            /*
            |--------------------------------------------------------------------------
            | ELIMINAR FILA ORIGINAL
            |--------------------------------------------------------------------------
            */

            $padre->removeChild(
                $filaActividad
            );

            /*
            |--------------------------------------------------------------------------
            | GUARDAR XML
            |--------------------------------------------------------------------------
            */

            $zip->addFromString(
                'word/document.xml',
                $dom->saveXML()
            );

            $zip->close();

            /*
            |--------------------------------------------------------------------------
            | DATOS GENERALES
            |--------------------------------------------------------------------------
            */

            $template = new TemplateProcessor(
                $temporal
            );

            $template->setValue(
                '1_experiencia_prendizaje',
                $request->input(
                    '1_experiencia_prendizaje'
                )
            );

            $template->setValue(
                '2_descripcion_general_experiencia',
                $request->input(
                    '2_descripcion_general_experiencia'
                )
            );

            $template->setValue(
                '3_nombre_maestra',
                $request->input(
                    '3_nombre_maestra'
                )
            );

            $template->setValue(
                '4_tiempo_estimado',
                $request->input(
                    '4_tiempo_estimado'
                )
            );

            $template->setValue(
                '5_fecha',
                $request->input(
                    '5_fecha'
                )
            );

            $template->setValue(
                '6_nivel_educativo',
                $request->input(
                    '6_nivel_educativo'
                )
            );

            $template->setValue(
                '7_objetivo_aprendizaje',
                $request->input(
                    '7_objetivo_aprendizaje'
                )
            );

            $template->setValue(
                '8_elemento_integrador',
                $request->input(
                    '8_elemento_integrador'
                )
            );

            $template->setValue(
                '9_nocion_dia',
                $request->input(
                    '9_nocion_dia'
                )
            );

            /*
            |--------------------------------------------------------------------------
            | ARCHIVO GENERADO
            |--------------------------------------------------------------------------
            */

            $archivo = storage_path(
                'app/planificacion_generada.docx'
            );

            $template->saveAs(
                $archivo
            );

            unset($template);

            /*
            |--------------------------------------------------------------------------
            | FORMATO GLOBAL
            |--------------------------------------------------------------------------
            |
            | NO enviamos el tamaño aquí.
            |
            | Esto es importante porque queremos que el tamaño elegido
            | afecte únicamente a las actividades dinámicas.
            |
            */

            $this->aplicarFormatoGlobal(
                $archivo,
                $numIdLista
            );

            /*
            |--------------------------------------------------------------------------
            | DESCARGA
            |--------------------------------------------------------------------------
            */

            return response()
                ->download(
                    $archivo,
                    'planificacion_generada.docx'
                )
                ->deleteFileAfterSend(true);
        } finally {

            if (isset($template)) {
                unset($template);
            }

            $this->eliminarTemporal(
                $temporal
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR DEFINICIÓN REAL DE LISTA DE WORD
    |--------------------------------------------------------------------------
    */

    private function prepararListaWord(
        ZipArchive $zip
    ): int {

        $numberingXml = $zip->getFromName(
            'word/numbering.xml'
        );

        if ($numberingXml === false) {

            $numberingXml =
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
'<w:numbering xmlns:w="' .
                self::WORD_NS .
                '"></w:numbering>';
}

$dom = new DOMDocument();

$dom->preserveWhiteSpace = true;
$dom->formatOutput = false;

libxml_use_internal_errors(true);

$dom->loadXML(
$numberingXml
);

libxml_clear_errors();

$xpath = new DOMXPath($dom);

$xpath->registerNamespace(
'w',
self::WORD_NS
);

/*
|--------------------------------------------------------------------------
| IDS EXISTENTES
|--------------------------------------------------------------------------
*/

$maxAbstractNumId = 0;
$maxNumId = 0;

$abstractNums = $xpath->query(
'//w:abstractNum'
);

foreach ($abstractNums as $abstractNum) {

$id = $abstractNum->getAttributeNS(
self::WORD_NS,
'abstractNumId'
);

if (is_numeric($id)) {

$maxAbstractNumId = max(
$maxAbstractNumId,
(int) $id
);
}
}

$nums = $xpath->query(
'//w:num'
);

foreach ($nums as $num) {

$id = $num->getAttributeNS(
self::WORD_NS,
'numId'
);

if (is_numeric($id)) {

$maxNumId = max(
$maxNumId,
(int) $id
);
}
}

$abstractNumId =
$maxAbstractNumId + 1;

$numId =
$maxNumId + 1;

/*
|--------------------------------------------------------------------------
| ABSTRACT NUM
|--------------------------------------------------------------------------
*/

$abstractNum =
$dom->createElementNS(
self::WORD_NS,
'w:abstractNum'
);

$abstractNum->setAttributeNS(
self::WORD_NS,
'w:abstractNumId',
(string) $abstractNumId
);

/*
|--------------------------------------------------------------------------
| NSID
|--------------------------------------------------------------------------
*/

$nsid =
$dom->createElementNS(
self::WORD_NS,
'w:nsid'
);

$nsid->setAttributeNS(
self::WORD_NS,
'w:val',
strtoupper(
substr(
md5(
uniqid(
'',
true
)
),
0,
8
)
)
);

$abstractNum->appendChild(
$nsid
);

/*
|--------------------------------------------------------------------------
| MULTILEVEL TYPE
|--------------------------------------------------------------------------
*/

$multiLevelType =
$dom->createElementNS(
self::WORD_NS,
'w:multiLevelType'
);

$multiLevelType->setAttributeNS(
self::WORD_NS,
'w:val',
'hybridMultilevel'
);

$abstractNum->appendChild(
$multiLevelType
);

/*
|--------------------------------------------------------------------------
| NIVEL 0
|--------------------------------------------------------------------------
*/

$lvl =
$dom->createElementNS(
self::WORD_NS,
'w:lvl'
);

$lvl->setAttributeNS(
self::WORD_NS,
'w:ilvl',
'0'
);

/*
|--------------------------------------------------------------------------
| START
|--------------------------------------------------------------------------
*/

$start =
$dom->createElementNS(
self::WORD_NS,
'w:start'
);

$start->setAttributeNS(
self::WORD_NS,
'w:val',
'1'
);

$lvl->appendChild(
$start
);

/*
|--------------------------------------------------------------------------
| NUM FORMAT BULLET
|--------------------------------------------------------------------------
*/

$numFmt =
$dom->createElementNS(
self::WORD_NS,
'w:numFmt'
);

$numFmt->setAttributeNS(
self::WORD_NS,
'w:val',
'bullet'
);

$lvl->appendChild(
$numFmt
);

/*
|--------------------------------------------------------------------------
| VIÑETA
|--------------------------------------------------------------------------
*/

$lvlText =
$dom->createElementNS(
self::WORD_NS,
'w:lvlText'
);

$lvlText->setAttributeNS(
self::WORD_NS,
'w:val',
'•'
);

$lvl->appendChild(
$lvlText
);

/*
|--------------------------------------------------------------------------
| JUSTIFICACIÓN
|--------------------------------------------------------------------------
*/

$lvlJc =
$dom->createElementNS(
self::WORD_NS,
'w:lvlJc'
);

$lvlJc->setAttributeNS(
self::WORD_NS,
'w:val',
'left'
);

$lvl->appendChild(
$lvlJc
);

/*
|--------------------------------------------------------------------------
| PROPIEDADES DE LA VIÑETA
|--------------------------------------------------------------------------
*/

$rPr =
$dom->createElementNS(
self::WORD_NS,
'w:rPr'
);

$rFonts =
$dom->createElementNS(
self::WORD_NS,
'w:rFonts'
);

$rFonts->setAttributeNS(
self::WORD_NS,
'w:ascii',
'Arial'
);

$rFonts->setAttributeNS(
self::WORD_NS,
'w:hAnsi',
'Arial'
);

$rFonts->setAttributeNS(
self::WORD_NS,
'w:hint',
'default'
);

$rPr->appendChild(
$rFonts
);

$lvl->appendChild(
$rPr
);

/*
|--------------------------------------------------------------------------
| AGREGAR NIVEL
|--------------------------------------------------------------------------
*/

$abstractNum->appendChild(
$lvl
);

/*
|--------------------------------------------------------------------------
| AGREGAR ABSTRACT NUM
|--------------------------------------------------------------------------
*/

$numbering =
$dom->documentElement;

$numbering->appendChild(
$abstractNum
);

/*
|--------------------------------------------------------------------------
| NUM
|--------------------------------------------------------------------------
*/

$num =
$dom->createElementNS(
self::WORD_NS,
'w:num'
);

$num->setAttributeNS(
self::WORD_NS,
'w:numId',
(string) $numId
);

$abstractNumIdNode =
$dom->createElementNS(
self::WORD_NS,
'w:abstractNumId'
);

$abstractNumIdNode->setAttributeNS(
self::WORD_NS,
'w:val',
(string) $abstractNumId
);

$num->appendChild(
$abstractNumIdNode
);

$numbering->appendChild(
$num
);

/*
|--------------------------------------------------------------------------
| GUARDAR
|--------------------------------------------------------------------------
*/

$zip->addFromString(
'word/numbering.xml',
$dom->saveXML()
);

return $numId;
}

/*
|--------------------------------------------------------------------------
| BUSCAR FILA ACTIVIDAD
|--------------------------------------------------------------------------
*/

private function buscarFilaActividad(
DOMXPath $xpath
): ?DOMElement {

$filas = $xpath->query(
'//w:tr'
);

foreach ($filas as $fila) {

$texto = $this->obtenerTexto(
$xpath,
$fila
);

if (
str_contains(
$texto,
'ambito'
) &&
str_contains(
$texto,
'destreza'
)
) {
return $fila;
}
}

return null;
}

/*
|--------------------------------------------------------------------------
| BUSCAR SNACK
|--------------------------------------------------------------------------
*/

private function buscarFilaSnack(
DOMXPath $xpath
): ?DOMElement {

$filas = $xpath->query(
'//w:tr'
);

foreach ($filas as $fila) {

$texto = $this->obtenerTexto(
$xpath,
$fila
);

if (
stripos(
$texto,
'Snack'
) !== false
) {
return $fila;
}
}

return null;
}

/*
|--------------------------------------------------------------------------
| OBTENER TEXTO
|--------------------------------------------------------------------------
*/

private function obtenerTexto(
DOMXPath $xpath,
DOMElement $elemento
): string {

$nodos = $xpath->query(
'.//w:t',
$elemento
);

$texto = '';

foreach ($nodos as $nodo) {
$texto .= $nodo->nodeValue;
}

return $texto;
}

/*
|--------------------------------------------------------------------------
| CLONAR FILA
|--------------------------------------------------------------------------
*/

private function clonarFila(
DOMElement $fila
): DOMElement {

$clon = $fila->cloneNode(
true
);

if (!$clon instanceof DOMElement) {
throw new \Exception(
'No se pudo clonar la fila.'
);
}

return $clon;
}

/*
|--------------------------------------------------------------------------
| RELLENAR ACTIVIDAD
|--------------------------------------------------------------------------
*/

private function rellenarActividad(
DOMDocument $dom,
DOMXPath $xpath,
DOMElement $fila,
array $actividad,
int $numIdLista,
int $tamanoLetraActividades
): void {

$datos = [

'${ambito}' =>
$actividad['ambito'] ?? '',

'${destreza}' =>
$actividad['destreza'] ?? '',

'${estrategias_metologicas}' =>
$actividad['estrategias_metologicas'] ?? '',

'${recursos}' =>
$actividad['recursos'] ?? '',

'${indicadores_logro}' =>
$actividad['indicadores_logro'] ?? '',
];

foreach (
$datos as $placeholder => $valor
) {

$this->reemplazarPlaceholder(
$dom,
$xpath,
$fila,
$placeholder,
$valor,
$numIdLista,
$tamanoLetraActividades
);
}
}

/*
|--------------------------------------------------------------------------
| RELLENAR SNACK
|--------------------------------------------------------------------------
*/

private function rellenarSnack(
DOMDocument $dom,
DOMXPath $xpath,
DOMElement $fila,
?int $tamanoLetraActividades = null
): void {

$this->reemplazarPlaceholder(
$dom,
$xpath,
$fila,
'${ambito}',
'(10:00 a 10:55)',
null,
$tamanoLetraActividades
);

$this->reemplazarPlaceholder(
$dom,
$xpath,
$fila,
'${destreza}',
'',
null,
$tamanoLetraActividades
);

$this->reemplazarPlaceholder(
$dom,
$xpath,
$fila,
'${estrategias_metologicas}',
'*Snack – momento de recreación*',
null,
$tamanoLetraActividades
);

$this->reemplazarPlaceholder(
$dom,
$xpath,
$fila,
'${recursos}',
'',
null,
$tamanoLetraActividades
);

$this->reemplazarPlaceholder(
$dom,
$xpath,
$fila,
'${indicadores_logro}',
'',
null,
$tamanoLetraActividades
);

/*
|--------------------------------------------------------------------------
| VERDE DEL SNACK
|--------------------------------------------------------------------------
*/

$celdas = $xpath->query(
'./w:tc',
$fila
);

foreach ($celdas as $celda) {

$tcPr = $xpath->query(
'./w:tcPr',
$celda
)->item(0);

if (!$tcPr) {

$tcPr = $dom->createElementNS(
self::WORD_NS,
'w:tcPr'
);

$celda->insertBefore(
$tcPr,
$celda->firstChild
);
}

$shd = $xpath->query(
'./w:shd',
$tcPr
)->item(0);

if (!$shd) {

$shd = $dom->createElementNS(
self::WORD_NS,
'w:shd'
);

$tcPr->appendChild(
$shd
);
}

$shd->setAttributeNS(
self::WORD_NS,
'w:fill',
'8DD873'
);

$shd->setAttributeNS(
self::WORD_NS,
'w:val',
'clear'
);
}

/*
|--------------------------------------------------------------------------
| ALTURA AUTOMÁTICA DEL SNACK
|--------------------------------------------------------------------------
*/

$trPr = $xpath->query(
'./w:trPr',
$fila
)->item(0);

if ($trPr) {

$alturas = $xpath->query(
'./w:trHeight',
$trPr
);

foreach ($alturas as $altura) {
$trPr->removeChild($altura);
}
}
}

/*
|--------------------------------------------------------------------------
| REEMPLAZAR PLACEHOLDER
|--------------------------------------------------------------------------
*/

private function reemplazarPlaceholder(
DOMDocument $dom,
DOMXPath $xpath,
DOMElement $fila,
string $placeholder,
string $valor,
?int $numIdLista = null,
?int $tamanoLetraActividades = null
): void {

$celdas = $xpath->query(
'./w:tc',
$fila
);

foreach ($celdas as $celda) {

$texto = $this->obtenerTexto(
$xpath,
$celda
);

if (
str_contains(
$texto,
$placeholder
)
) {

$this->ponerTexto(
$dom,
$xpath,
$celda,
$valor,
$numIdLista,
$tamanoLetraActividades
);

return;
}
}
}

/*
|--------------------------------------------------------------------------
| PONER TEXTO EN CELDA
|--------------------------------------------------------------------------
*/

private function ponerTexto(
DOMDocument $dom,
DOMXPath $xpath,
DOMElement $celda,
string $valor,
?int $numIdLista = null,
?int $tamanoLetraActividades = null
): void {

$textos = $xpath->query(
'.//w:t',
$celda
);

if ($textos->length === 0) {
return;
}

$primerTexto =
$textos->item(0);

$runOriginal =
$primerTexto->parentNode;

if (
!$runOriginal instanceof DOMElement
) {
return;
}

$parrafo =
$runOriginal->parentNode;

if (
!$parrafo instanceof DOMElement
) {
return;
}

/*
|--------------------------------------------------------------------------
| LIMPIAR CONTENIDO
|--------------------------------------------------------------------------
*/

$hijos = [];

foreach (
$parrafo->childNodes as $hijo
) {
$hijos[] = $hijo;
}

foreach ($hijos as $hijo) {

if (
$hijo instanceof DOMElement &&
$hijo->localName === 'pPr'
) {
continue;
}

$parrafo->removeChild(
$hijo
);
}

/*
|--------------------------------------------------------------------------
| CREAR CONTENIDO
|--------------------------------------------------------------------------
*/

$this->crearContenidoFormateado(
$dom,
$parrafo,
$valor,
$numIdLista,
$tamanoLetraActividades
);
}

/*
|--------------------------------------------------------------------------
| CREAR CONTENIDO FORMATEADO
|--------------------------------------------------------------------------
*/

private function crearContenidoFormateado(
DOMDocument $dom,
DOMElement $parrafo,
string $valor,
?int $numIdLista = null,
?int $tamanoLetraActividades = null
): void {

/*
|--------------------------------------------------------------------------
| NORMALIZAR SALTOS
|--------------------------------------------------------------------------
|
| Aceptamos:
|
| 1. Enter real
| 2. \n
| 3. /n
|
*/

$valor = str_replace(
[
"\r\n",
"\n",
"\r",
"/n"
],
"\n",
$valor
);

/*
|--------------------------------------------------------------------------
| DETECTAR LISTAS
|--------------------------------------------------------------------------
*/

$lineas = preg_split(
"/\r\n|\r|\n/",
$valor
);

$tieneLista = false;

foreach ($lineas as $linea) {

if (
preg_match(
'/^\s*\+/',
$linea
)
) {
$tieneLista = true;
break;
}
}

/*
|--------------------------------------------------------------------------
| SIN LISTA
|--------------------------------------------------------------------------
*/

if (!$tieneLista) {

$this->crearRunsConFormato(
$dom,
$parrafo,
$valor,
$numIdLista,
$tamanoLetraActividades
);

return;
}

/*
|--------------------------------------------------------------------------
| CON LISTA
|--------------------------------------------------------------------------
*/

$primerParrafo = true;

foreach ($lineas as $linea) {

/*
|--------------------------------------------------------------------------
| ELEMENTO DE LISTA
|--------------------------------------------------------------------------
*/

if (
preg_match(
'/^\s*\+(.*)$/',
$linea,
$match
)
) {

$textoLista =
ltrim(
$match[1]
);

if ($primerParrafo) {

$this->agregarListaAlParrafo(
$dom,
$parrafo,
$textoLista,
$numIdLista,
$tamanoLetraActividades
);

$primerParrafo = false;
} else {

$nuevoParrafo =
$dom->createElementNS(
self::WORD_NS,
'w:p'
);

$parrafo->parentNode->insertBefore(
$nuevoParrafo,
$parrafo->nextSibling
);

$this->agregarListaAlParrafo(
$dom,
$nuevoParrafo,
$textoLista,
$numIdLista,
$tamanoLetraActividades
);

$parrafo =
$nuevoParrafo;
}

continue;
}

/*
|--------------------------------------------------------------------------
| LÍNEA NORMAL
|--------------------------------------------------------------------------
*/

if ($linea !== '') {

if ($primerParrafo) {

$this->crearRunsConFormato(
$dom,
$parrafo,
$linea,
$numIdLista,
$tamanoLetraActividades
);

$primerParrafo = false;
} else {

$nuevoParrafo =
$dom->createElementNS(
self::WORD_NS,
'w:p'
);

$parrafo->parentNode->insertBefore(
$nuevoParrafo,
$parrafo->nextSibling
);

$this->crearRunsConFormato(
$dom,
$nuevoParrafo,
$linea,
$numIdLista,
$tamanoLetraActividades
);

$parrafo =
$nuevoParrafo;
}
}
}
}

/*
|--------------------------------------------------------------------------
| AGREGAR LISTA
|--------------------------------------------------------------------------
*/

private function agregarListaAlParrafo(
DOMDocument $dom,
DOMElement $parrafo,
string $texto,
?int $numIdLista,
?int $tamanoLetraActividades = null
): void {

if ($numIdLista === null) {

$this->crearRunsConFormato(
$dom,
$parrafo,
$texto,
null,
$tamanoLetraActividades
);

return;
}

/*
|--------------------------------------------------------------------------
| PROPIEDADES DEL PÁRRAFO
|--------------------------------------------------------------------------
*/

$pPr =
$dom->createElementNS(
self::WORD_NS,
'w:pPr'
);

$numPr =
$dom->createElementNS(
self::WORD_NS,
'w:numPr'
);

$ilvl =
$dom->createElementNS(
self::WORD_NS,
'w:ilvl'
);

$ilvl->setAttributeNS(
self::WORD_NS,
'w:val',
'0'
);

$numIdNode =
$dom->createElementNS(
self::WORD_NS,
'w:numId'
);

$numIdNode->setAttributeNS(
self::WORD_NS,
'w:val',
(string) $numIdLista
);

$numPr->appendChild(
$ilvl
);

$numPr->appendChild(
$numIdNode
);

$pPr->appendChild(
$numPr
);

/*
|--------------------------------------------------------------------------
| AJUSTAR ESPACIO DE LA VIÑETA
|--------------------------------------------------------------------------
*/

$ind =
$dom->createElementNS(
self::WORD_NS,
'w:ind'
);

$ind->setAttributeNS(
self::WORD_NS,
'w:left',
'180'
);

$ind->setAttributeNS(
self::WORD_NS,
'w:hanging',
'180'
);

$pPr->appendChild(
$ind
);

$parrafo->insertBefore(
$pPr,
$parrafo->firstChild
);

/*
|--------------------------------------------------------------------------
| TEXTO
|--------------------------------------------------------------------------
*/

$this->crearRunsConFormato(
$dom,
$parrafo,
$texto,
$numIdLista,
$tamanoLetraActividades
);
}

/*
|--------------------------------------------------------------------------
| CREAR RUNS CON FORMATO
|--------------------------------------------------------------------------
|
| *texto* = negrita
| **texto** = cursiva
|
*/

private function crearRunsConFormato(
DOMDocument $dom,
DOMElement $parrafo,
string $valor,
?int $numIdLista = null,
?int $tamanoLetraActividades = null
): void {

/*
|--------------------------------------------------------------------------
| SALTOS
|--------------------------------------------------------------------------
*/

$valor = str_replace(
[
"\r\n",
"\n",
"\r",
"/n"
],
"\n",
$valor
);

/*
|--------------------------------------------------------------------------
| FORMATO
|--------------------------------------------------------------------------
*/

$regex =
'/(\*\*.*?\*\*|\*.*?\*)/s';

preg_match_all(
$regex,
$valor,
$matches,
PREG_OFFSET_CAPTURE
);

/*
|--------------------------------------------------------------------------
| CREAR RUN
|--------------------------------------------------------------------------
*/

$crearRun =
function (
string $texto,
bool $negrita = false,
bool $cursiva = false
) use (
$dom,
$parrafo,
$tamanoLetraActividades
) {

$run =
$dom->createElementNS(
self::WORD_NS,
'w:r'
);

/*
|--------------------------------------------------------------------------
| PROPIEDADES
|--------------------------------------------------------------------------
*/

$rPr =
$dom->createElementNS(
self::WORD_NS,
'w:rPr'
);

/*
|--------------------------------------------------------------------------
| TIMES NEW ROMAN
|--------------------------------------------------------------------------
*/

$rFonts =
$dom->createElementNS(
self::WORD_NS,
'w:rFonts'
);

$rFonts->setAttributeNS(
self::WORD_NS,
'w:ascii',
'Times New Roman'
);

$rFonts->setAttributeNS(
self::WORD_NS,
'w:hAnsi',
'Times New Roman'
);

$rFonts->setAttributeNS(
self::WORD_NS,
'w:eastAsia',
'Times New Roman'
);

$rFonts->setAttributeNS(
self::WORD_NS,
'w:cs',
'Times New Roman'
);

$rPr->appendChild(
$rFonts
);

/*
|--------------------------------------------------------------------------
| TAMAÑO DE LETRA
|--------------------------------------------------------------------------
|
| Word utiliza half-points.
|
| 10 pt = 20
| 11 pt = 22
| 12 pt = 24
|
*/

if (
$tamanoLetraActividades !== null
) {

$tamanoWord =
(string) (
$tamanoLetraActividades * 2
);

$size =
$dom->createElementNS(
self::WORD_NS,
'w:sz'
);

$size->setAttributeNS(
self::WORD_NS,
'w:val',
$tamanoWord
);

$rPr->appendChild(
$size
);

$sizeCs =
$dom->createElementNS(
self::WORD_NS,
'w:szCs'
);

$sizeCs->setAttributeNS(
self::WORD_NS,
'w:val',
$tamanoWord
);

$rPr->appendChild(
$sizeCs
);
}

/*
|--------------------------------------------------------------------------
| NEGRITA
|--------------------------------------------------------------------------
*/

if ($negrita) {

$bold =
$dom->createElementNS(
self::WORD_NS,
'w:b'
);

$rPr->appendChild(
$bold
);
}

/*
|--------------------------------------------------------------------------
| CURSIVA
|--------------------------------------------------------------------------
*/

if ($cursiva) {

$italic =
$dom->createElementNS(
self::WORD_NS,
'w:i'
);

$rPr->appendChild(
$italic
);
}

$run->appendChild(
$rPr
);

/*
|--------------------------------------------------------------------------
| SALTOS DE LÍNEA
|--------------------------------------------------------------------------
*/

$lineas =
preg_split(
"/\r\n|\r|\n/",
$texto
);

foreach (
$lineas as $indice => $linea
) {

if ($linea !== '') {

$textoWord =
$dom->createElementNS(
self::WORD_NS,
'w:t'
);

$textoWord->setAttributeNS(
self::XML_NS,
'xml:space',
'preserve'
);

$textoWord->appendChild(
$dom->createTextNode(
$linea
)
);

$run->appendChild(
$textoWord
);
}

if (
$indice < count($lineas) - 1 ) { $salto=$dom->createElementNS(
    self::WORD_NS,
    'w:br'
    );

    $run->appendChild(
    $salto
    );
    }
    }

    $parrafo->appendChild(
    $run
    );
    };

    /*
    |--------------------------------------------------------------------------
    | RECORRER FORMATO
    |--------------------------------------------------------------------------
    */

    $posicionActual = 0;

    foreach (
    $matches[0] as $match
    ) {

    $parte =
    $match[0];

    $posicion =
    $match[1];

    /*
    |--------------------------------------------------------------------------
    | TEXTO NORMAL
    |--------------------------------------------------------------------------
    */

    if (
    $posicion >
    $posicionActual
    ) {

    $textoNormal =
    substr(
    $valor,
    $posicionActual,
    $posicion -
    $posicionActual
    );

    $crearRun(
    $textoNormal
    );
    }

    /*
    |--------------------------------------------------------------------------
    | CURSIVA
    |--------------------------------------------------------------------------
    */

    if (
    str_starts_with(
    $parte,
    '**'
    ) &&
    str_ends_with(
    $parte,
    '**'
    )
    ) {

    $textoCursiva =
    substr(
    $parte,
    2,
    -2
    );

    $crearRun(
    $textoCursiva,
    false,
    true
    );
    }

    /*
    |--------------------------------------------------------------------------
    | NEGRITA
    |--------------------------------------------------------------------------
    */ elseif (
    str_starts_with(
    $parte,
    '*'
    ) &&
    str_ends_with(
    $parte,
    '*'
    )
    ) {

    $textoNegrita =
    substr(
    $parte,
    1,
    -1
    );

    $crearRun(
    $textoNegrita,
    true,
    false
    );
    }

    $posicionActual =
    $posicion +
    strlen($parte);
    }

    /*
    |--------------------------------------------------------------------------
    | TEXTO FINAL
    |--------------------------------------------------------------------------
    */

    if (
    $posicionActual < strlen($valor) ) { $textoFinal=substr($valor, $posicionActual); $crearRun($textoFinal); } /*
        |-------------------------------------------------------------------------- | TEXTO VACÍO
        |-------------------------------------------------------------------------- */ if ($valor==='' ) {
        $crearRun(''); } } /* |-------------------------------------------------------------------------- | APLICAR
        FORMATO GLOBAL |-------------------------------------------------------------------------- */ private function
        aplicarFormatoGlobal(string $archivo, ?int $numIdLista=null): void { $zip=new ZipArchive(); if ( $zip->
        open($archivo) !== true
        ) {

        throw new \Exception(
        'No se pudo abrir el archivo generado.'
        );
        }

        $xml = $zip->getFromName(
        'word/document.xml'
        );

        if ($xml === false) {

        $zip->close();

        throw new \Exception(
        'No se encontró word/document.xml.'
        );
        }

        $dom = new DOMDocument();

        $dom->preserveWhiteSpace = true;
        $dom->formatOutput = false;

        libxml_use_internal_errors(true);

        $dom->loadXML($xml);

        libxml_clear_errors();

        $xpath = new DOMXPath($dom);

        $xpath->registerNamespace(
        'w',
        self::WORD_NS
        );

        $parrafos = $xpath->query(
        '//w:p'
        );

        foreach ($parrafos as $parrafo) {

        $this->procesarMarcadoresDelParrafo(
        $dom,
        $xpath,
        $parrafo,
        $numIdLista
        );
        }

        $zip->addFromString(
        'word/document.xml',
        $dom->saveXML()
        );

        $zip->close();
        }

        /*
        |--------------------------------------------------------------------------
        | PROCESAR MARCADORES
        |--------------------------------------------------------------------------
        */

        private function procesarMarcadoresDelParrafo(
        DOMDocument $dom,
        DOMXPath $xpath,
        DOMElement $parrafo,
        ?int $numIdLista = null
        ): void {

        $runs = $xpath->query(
        './w:r',
        $parrafo
        );

        foreach ($runs as $run) {

        $textos = $xpath->query(
        './w:t',
        $run
        );

        if ($textos->length === 0) {
        continue;
        }

        $textoCompleto = '';

        foreach ($textos as $texto) {

        $textoCompleto .=
        $texto->nodeValue;
        }

        /*
        |--------------------------------------------------------------------------
        | BUSCAR MARCADORES
        |--------------------------------------------------------------------------
        */

        if (
        !str_contains(
        $textoCompleto,
        '*'
        ) &&
        !str_contains(
        $textoCompleto,
        '+'
        ) &&
        !str_contains(
        $textoCompleto,
        "\n"
        ) &&
        !str_contains(
        $textoCompleto,
        '/n'
        )
        ) {
        continue;
        }

        $tieneFormato =
        preg_match(
        '/(\*\*.*?\*\*|\*.*?\*)/s',
        $textoCompleto
        );

        $tieneLista =
        preg_match(
        '/(^|\n)\s*\+/',
        $textoCompleto
        );

        $tieneSalto =
        str_contains(
        $textoCompleto,
        "\n"
        ) ||
        str_contains(
        $textoCompleto,
        '/n'
        );

        if (
        !$tieneFormato &&
        !$tieneLista &&
        !$tieneSalto
        ) {
        continue;
        }

        /*
        |--------------------------------------------------------------------------
        | GUARDAR FORMATO DEL RUN
        |--------------------------------------------------------------------------
        */

        $runReferencia =
        $run->cloneNode(
        true
        );

        /*
        |--------------------------------------------------------------------------
        | QUITAR TEXTO ORIGINAL
        |--------------------------------------------------------------------------
        */

        foreach ($textos as $texto) {

        $run->removeChild(
        $texto
        );
        }

        /*
        |--------------------------------------------------------------------------
        | CREAR NUEVO CONTENIDO
        |--------------------------------------------------------------------------
        */

        $this->agregarRunsFormateadosGlobal(
        $dom,
        $parrafo,
        $runReferencia,
        $textoCompleto,
        $numIdLista
        );

        /*
        |--------------------------------------------------------------------------
        | ELIMINAR RUN ORIGINAL
        |--------------------------------------------------------------------------
        */

        if (
        $run->parentNode === $parrafo
        ) {

        $parrafo->removeChild(
        $run
        );
        }
        }
        }

        /*
        |--------------------------------------------------------------------------
        | AGREGAR FORMATO GLOBAL
        |--------------------------------------------------------------------------
        */

        private function agregarRunsFormateadosGlobal(
        DOMDocument $dom,
        DOMElement $parrafo,
        DOMElement $runReferencia,
        string $valor,
        ?int $numIdLista = null
        ): void {

        /*
        |--------------------------------------------------------------------------
        | NORMALIZAR SALTOS
        |--------------------------------------------------------------------------
        */

        $valor = str_replace(
        [
        "\r\n",
        "\n",
        "\r",
        "/n"
        ],
        "\n",
        $valor
        );

        /*
        |--------------------------------------------------------------------------
        | DETECTAR LISTA
        |--------------------------------------------------------------------------
        */

        if (
        preg_match(
        '/(^|\n)\s*\+/',
        $valor
        )
        ) {

        $lineas =
        preg_split(
        "/\r\n|\r|\n/",
        $valor
        );

        $primera = true;

        foreach ($lineas as $linea) {

        /*
        |--------------------------------------------------------------------------
        | ELEMENTO CON +
        |--------------------------------------------------------------------------
        */

        if (
        preg_match(
        '/^\s*\+(.*)$/',
        $linea,
        $match
        )
        ) {

        $texto =
        ltrim(
        $match[1]
        );

        if ($primera) {

        $this->convertirParrafoEnLista(
        $dom,
        $parrafo,
        $numIdLista
        );

        $this->crearRunsGlobales(
        $dom,
        $parrafo,
        $texto,
        $runReferencia
        );

        $primera = false;
        } else {

        $nuevoParrafo =
        $dom->createElementNS(
        self::WORD_NS,
        'w:p'
        );

        $parrafo->parentNode->insertBefore(
        $nuevoParrafo,
        $parrafo->nextSibling
        );

        $this->convertirParrafoEnLista(
        $dom,
        $nuevoParrafo,
        $numIdLista
        );

        $this->crearRunsGlobales(
        $dom,
        $nuevoParrafo,
        $texto,
        $runReferencia
        );

        $parrafo =
        $nuevoParrafo;
        }
        } elseif (
        trim($linea) !== ''
        ) {

        if ($primera) {

        $this->crearRunsGlobales(
        $dom,
        $parrafo,
        $linea,
        $runReferencia
        );

        $primera = false;
        } else {

        $nuevoParrafo =
        $dom->createElementNS(
        self::WORD_NS,
        'w:p'
        );

        $parrafo->parentNode->insertBefore(
        $nuevoParrafo,
        $parrafo->nextSibling
        );

        $this->crearRunsGlobales(
        $dom,
        $nuevoParrafo,
        $linea,
        $runReferencia
        );

        $parrafo =
        $nuevoParrafo;
        }
        }
        }

        return;
        }

        /*
        |--------------------------------------------------------------------------
        | TEXTO NORMAL
        |--------------------------------------------------------------------------
        */

        $this->crearRunsGlobales(
        $dom,
        $parrafo,
        $valor,
        $runReferencia
        );
        }

        /*
        |--------------------------------------------------------------------------
        | CONVERTIR EN LISTA
        |--------------------------------------------------------------------------
        */

        private function convertirParrafoEnLista(
        DOMDocument $dom,
        DOMElement $parrafo,
        ?int $numIdLista
        ): void {

        if ($numIdLista === null) {
        return;
        }

        $pPr =
        $dom->createElementNS(
        self::WORD_NS,
        'w:pPr'
        );

        $numPr =
        $dom->createElementNS(
        self::WORD_NS,
        'w:numPr'
        );

        $ilvl =
        $dom->createElementNS(
        self::WORD_NS,
        'w:ilvl'
        );

        $ilvl->setAttributeNS(
        self::WORD_NS,
        'w:val',
        '0'
        );

        $numIdNode =
        $dom->createElementNS(
        self::WORD_NS,
        'w:numId'
        );

        $numIdNode->setAttributeNS(
        self::WORD_NS,
        'w:val',
        (string) $numIdLista
        );

        $numPr->appendChild(
        $ilvl
        );

        $numPr->appendChild(
        $numIdNode
        );

        $pPr->appendChild(
        $numPr
        );

        /*
        |--------------------------------------------------------------------------
        | AJUSTAR ESPACIO DE LA VIÑETA
        |--------------------------------------------------------------------------
        */

        $ind =
        $dom->createElementNS(
        self::WORD_NS,
        'w:ind'
        );

        $ind->setAttributeNS(
        self::WORD_NS,
        'w:left',
        '180'
        );

        $ind->setAttributeNS(
        self::WORD_NS,
        'w:hanging',
        '180'
        );

        $pPr->appendChild(
        $ind
        );

        $parrafo->insertBefore(
        $pPr,
        $parrafo->firstChild
        );
        }

        /*
        |--------------------------------------------------------------------------
        | CREAR RUNS GLOBALES
        |--------------------------------------------------------------------------
        */

        private function crearRunsGlobales(
        DOMDocument $dom,
        DOMElement $parrafo,
        string $valor,
        DOMElement $runReferencia
        ): void {

        /*
        |--------------------------------------------------------------------------
        | NORMALIZAR SALTOS
        |--------------------------------------------------------------------------
        */

        $valor = str_replace(
        [
        "\r\n",
        "\n",
        "\r",
        "/n"
        ],
        "\n",
        $valor
        );

        /*
        |--------------------------------------------------------------------------
        | FORMATO
        |--------------------------------------------------------------------------
        */

        $regex =
        '/(\*\*.*?\*\*|\*.*?\*)/s';

        preg_match_all(
        $regex,
        $valor,
        $matches,
        PREG_OFFSET_CAPTURE
        );

        /*
        |--------------------------------------------------------------------------
        | CREAR RUN
        |--------------------------------------------------------------------------
        */

        $crearRun =
        function (
        string $texto,
        bool $negrita = false,
        bool $cursiva = false
        ) use (
        $dom,
        $parrafo,
        $runReferencia
        ) {

        $run =
        $dom->createElementNS(
        self::WORD_NS,
        'w:r'
        );

        /*
        |--------------------------------------------------------------------------
        | PROPIEDADES ORIGINALES
        |--------------------------------------------------------------------------
        */

        $rPrOriginal = null;

        foreach (
        $runReferencia->childNodes
        as $hijo
        ) {

        if (
        $hijo instanceof DOMElement &&
        $hijo->localName === 'rPr'
        ) {

        $rPrOriginal =
        $hijo->cloneNode(
        true
        );

        break;
        }
        }

        if (
        $rPrOriginal instanceof DOMElement
        ) {

        $run->appendChild(
        $rPrOriginal
        );
        } else {

        $rPr =
        $dom->createElementNS(
        self::WORD_NS,
        'w:rPr'
        );

        $rFonts =
        $dom->createElementNS(
        self::WORD_NS,
        'w:rFonts'
        );

        $rFonts->setAttributeNS(
        self::WORD_NS,
        'w:ascii',
        'Times New Roman'
        );

        $rFonts->setAttributeNS(
        self::WORD_NS,
        'w:hAnsi',
        'Times New Roman'
        );

        $rFonts->setAttributeNS(
        self::WORD_NS,
        'w:eastAsia',
        'Times New Roman'
        );

        $rFonts->setAttributeNS(
        self::WORD_NS,
        'w:cs',
        'Times New Roman'
        );

        $rPr->appendChild(
        $rFonts
        );

        $run->appendChild(
        $rPr
        );
        }

        /*
        |--------------------------------------------------------------------------
        | NEGRITA
        |--------------------------------------------------------------------------
        */

        if ($negrita) {

        $rPr = null;

        foreach (
        $run->childNodes
        as $hijo
        ) {

        if (
        $hijo instanceof DOMElement &&
        $hijo->localName === 'rPr'
        ) {

        $rPr = $hijo;
        break;
        }
        }

        if ($rPr) {

        $bold =
        $dom->createElementNS(
        self::WORD_NS,
        'w:b'
        );

        $rPr->appendChild(
        $bold
        );
        }
        }

        /*
        |--------------------------------------------------------------------------
        | CURSIVA
        |--------------------------------------------------------------------------
        */

        if ($cursiva) {

        $rPr = null;

        foreach (
        $run->childNodes
        as $hijo
        ) {

        if (
        $hijo instanceof DOMElement &&
        $hijo->localName === 'rPr'
        ) {

        $rPr = $hijo;
        break;
        }
        }

        if ($rPr) {

        $italic =
        $dom->createElementNS(
        self::WORD_NS,
        'w:i'
        );

        $rPr->appendChild(
        $italic
        );
        }
        }

        /*
        |--------------------------------------------------------------------------
        | rPr VACÍO TEMPORAL
        |--------------------------------------------------------------------------
        */

        $run->appendChild(
        $dom->createElementNS(
        self::WORD_NS,
        'w:rPr'
        )
        );

        /*
        |--------------------------------------------------------------------------
        | TEXTO Y SALTOS
        |--------------------------------------------------------------------------
        */

        $lineas =
        preg_split(
        "/\r\n|\r|\n/",
        $texto
        );

        /*
        |--------------------------------------------------------------------------
        | ELIMINAR rPr VACÍO DUPLICADO
        |--------------------------------------------------------------------------
        */

        $rPrs = [];

        foreach (
        $run->childNodes as $hijo
        ) {

        if (
        $hijo instanceof DOMElement &&
        $hijo->localName === 'rPr'
        ) {

        $rPrs[] =
        $hijo;
        }
        }

        if (
        count($rPrs) > 1
        ) {

        for (
        $i = 1;
        $i < count($rPrs); $i++ ) { $run->removeChild(
            $rPrs[$i]
            );
            }
            }

            foreach (
            $lineas as $indice => $linea
            ) {

            if ($linea !== '') {

            $textoWord =
            $dom->createElementNS(
            self::WORD_NS,
            'w:t'
            );

            $textoWord->setAttributeNS(
            self::XML_NS,
            'xml:space',
            'preserve'
            );

            $textoWord->appendChild(
            $dom->createTextNode(
            $linea
            )
            );

            $run->appendChild(
            $textoWord
            );
            }

            if (
            $indice < count($lineas) - 1 ) { $br=$dom->createElementNS(
                self::WORD_NS,
                'w:br'
                );

                $run->appendChild(
                $br
                );
                }
                }

                $parrafo->insertBefore(
                $run,
                $runReferencia
                );
                };

                /*
                |--------------------------------------------------------------------------
                | RECORRER FORMATO
                |--------------------------------------------------------------------------
                */

                $posicionActual = 0;

                foreach (
                $matches[0] as $match
                ) {

                $parte =
                $match[0];

                $posicion =
                $match[1];

                /*
                |--------------------------------------------------------------------------
                | TEXTO NORMAL
                |--------------------------------------------------------------------------
                */

                if (
                $posicion >
                $posicionActual
                ) {

                $normal =
                substr(
                $valor,
                $posicionActual,
                $posicion -
                $posicionActual
                );

                $crearRun(
                $normal
                );
                }

                /*
                |--------------------------------------------------------------------------
                | CURSIVA
                |--------------------------------------------------------------------------
                */

                if (
                str_starts_with(
                $parte,
                '**'
                ) &&
                str_ends_with(
                $parte,
                '**'
                )
                ) {

                $texto =
                substr(
                $parte,
                2,
                -2
                );

                $crearRun(
                $texto,
                false,
                true
                );
                }

                /*
                |--------------------------------------------------------------------------
                | NEGRITA
                |--------------------------------------------------------------------------
                */ elseif (
                str_starts_with(
                $parte,
                '*'
                ) &&
                str_ends_with(
                $parte,
                '*'
                )
                ) {

                $texto =
                substr(
                $parte,
                1,
                -1
                );

                $crearRun(
                $texto,
                true,
                false
                );
                }

                $posicionActual =
                $posicion +
                strlen($parte);
                }

                /*
                |--------------------------------------------------------------------------
                | TEXTO FINAL
                |--------------------------------------------------------------------------
                */

                if (
                $posicionActual < strlen($valor) ) { $final=substr($valor, $posicionActual); $crearRun($final); } } /*
                    |-------------------------------------------------------------------------- | INSERTAR DESPUÉS
                    |-------------------------------------------------------------------------- */ private function
                    insertarDespues(DOMElement $referencia, DOMElement $nuevaFila): void { $padre=$referencia->
                    parentNode;

                    $siguiente =
                    $referencia->nextSibling;

                    if ($siguiente !== null) {

                    $padre->insertBefore(
                    $nuevaFila,
                    $siguiente
                    );
                    } else {

                    $padre->appendChild(
                    $nuevaFila
                    );
                    }
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | ELIMINAR TEMPORAL
                    |--------------------------------------------------------------------------
                    */

                    private function eliminarTemporal(
                    string $archivo
                    ): void {

                    if (!file_exists($archivo)) {
                    return;
                    }

                    for (
                    $i = 0;
                    $i < 10; $i++ ) { if (@unlink($archivo)) { return; } usleep(100000); } } }