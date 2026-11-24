<?php

namespace App\Services;

use App\Models\Actividad;
use App\Models\Planificacion;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PlanificacionImportService
{
    /*
    |--------------------------------------------------------------------------
    | ALIASES DEL FORMULARIO
    |--------------------------------------------------------------------------
    |
    | El formulario de planificacion-crear.js envía las claves con el
    | prefijo 1_, 2_, ... El importador acepta ambos estilos y prefiere
    | el nombre limpio del modelo cuando los dos están presentes.
    |
    */

    private const ALIASES = [
        'experiencia_aprendizaje' =>
            '1_experiencia_prendizaje',

        'descripcion_general_experiencia' =>
            '2_descripcion_general_experiencia',

        'nombre_maestra' =>
            '3_nombre_maestra',

        'tiempo_estimado' =>
            '4_tiempo_estimado',

        'fecha' =>
            '5_fecha',

        'nivel_educativo' =>
            '6_nivel_educativo',

        'objetivo_aprendizaje' =>
            '7_objetivo_aprendizaje',

        'elemento_integrador' =>
            '8_elemento_integrador',

        'nocion_dia' =>
            '9_nocion_dia',
    ];

    /*
    |--------------------------------------------------------------------------
    | IMPORTACIÓN COMPLETA (UNA O VARIAS PLANIFICACIONES)
    |--------------------------------------------------------------------------
    */

    public function import(array $data): array
    {
        return DB::transaction(function () use ($data) {

            if (array_key_exists('planificaciones', $data)) {

                if (! is_array($data['planificaciones'])) {
                    throw ValidationException::withMessages([
                        'planificaciones' =>
                            'El bloque "planificaciones" debe ser un arreglo.',
                    ]);
                }

                return $this->importMultiple(
                    $data['planificaciones']
                );

            }

            return $this->createPlanificacionComplete($data);

        });
    }

    private function importMultiple(array $planificaciones): array
    {
        if (count($planificaciones) === 0) {
            throw ValidationException::withMessages([
                'planificaciones' =>
                    'Debe existir al menos una planificación.',
            ]);
        }

        $detalle = [];
        $actividadesCount = 0;
        $subactividadesCount = 0;

        foreach ($planificaciones as $index => $item) {

            if (! is_array($item)) {
                throw ValidationException::withMessages([
                    'planificaciones.'.$index =>
                        'Cada planificación debe ser un objeto.',
                ]);
            }

            $resultado = $this->createPlanificacionComplete($item);

            $detalle[] = $resultado;

            $actividadesCount +=
                $resultado['actividades'];

            $subactividadesCount +=
                $resultado['subactividades'];

        }

        return [
            'planificaciones' => count($detalle),
            'actividades' => $actividadesCount,
            'subactividades' => $subactividadesCount,
            'detalle' => $detalle,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR UNA PLANIFICACIÓN CON SU ÁRBOL COMPLETO
    |--------------------------------------------------------------------------
    */

    private function createPlanificacionComplete(array $data): array
    {
        $atributos = $this->normalizarPlanificacion($data);

        $planificacion = Planificacion::create(
            array_merge($atributos, [
                'user_id' => Auth::id(),
                'estado' => 'borrador',
                'progreso' => 0,
            ])
        );

        $conteo = $this->createActividades(
            $planificacion,
            $data
        );

        return [
            'id' => $planificacion->id,
            'titulo' => $planificacion->experiencia_aprendizaje,
            'es_plantilla' => $planificacion->es_plantilla,
            'actividades' => $conteo['actividades'],
            'subactividades' => $conteo['subactividades'],
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR ACTIVIDADES EN UNA PLANIFICACIÓN EXISTENTE
    |--------------------------------------------------------------------------
    */

    public function importActividades(
        Planificacion $planificacion,
        array $data
    ): array {
        return DB::transaction(function () use (
            $planificacion,
            $data
        ) {

            $part1 = $data['part1'] ?? [];
            $part2 = $data['part2'] ?? [];

            if (empty($part1) && empty($part2)) {
                throw ValidationException::withMessages([
                    'part1' =>
                        'Debe existir al menos una actividad en part1 o part2.',
                ]);
            }

            $conteo = $this->createActividades(
                $planificacion,
                [
                    'part1' => $part1,
                    'part2' => $part2,
                ]
            );

            return [
                'planificacion_id' => $planificacion->id,
                'actividades' => $conteo['actividades'],
                'subactividades' => $conteo['subactividades'],
            ];

        });
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR SUBACTIVIDADES EN UNA ACTIVIDAD EXISTENTE
    |--------------------------------------------------------------------------
    */

    public function importSubactividades(
        Actividad $actividad,
        array $data
    ): array {
        return DB::transaction(function () use (
            $actividad,
            $data
        ) {

            $subactividades = $data['subactividades'] ?? [];

            if (count($subactividades) === 0) {
                throw ValidationException::withMessages([
                    'subactividades' =>
                        'Debe existir al menos una subactividad.',
                ]);
            }

            $total = 0;

            foreach ($subactividades as $index => $subData) {

                if (! is_array($subData)) {
                    throw ValidationException::withMessages([
                        'subactividades.'.$index =>
                            'Cada subactividad debe ser un objeto.',
                    ]);
                }

                $actividad->subactividades()->create(
                    $this->atributosSubactividad(
                        $subData,
                        $index + 1
                    )
                );

                $total++;

            }

            return [
                'actividad_id' => $actividad->id,
                'subactividades' => $total,
            ];

        });
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR ACTIVIDADES DE UNA PLANIFICACIÓN
    |--------------------------------------------------------------------------
    */

    private function createActividades(
        Planificacion $planificacion,
        array $data
    ): array {
        $actividadesCount = 0;
        $subactividadesCount = 0;

        foreach (['part1', 'part2'] as $seccion) {

            $actividades = $data[$seccion] ?? [];

            if (! is_array($actividades)) {
                throw ValidationException::withMessages([
                    $seccion =>
                        'El bloque "'.$seccion.'" debe ser un arreglo.',
                ]);
            }

            foreach ($actividades as $index => $actividadData) {

                if (! is_array($actividadData)) {
                    throw ValidationException::withMessages([
                        $seccion.'.'.$index =>
                            'Cada actividad debe ser un objeto.',
                    ]);
                }

                $actividad = Actividad::create([
                    'planificacion_id' => $planificacion->id,
                    'seccion' => $seccion,
                    'orden' => $actividadData['orden'] ?? $index + 1,
                    'ambito' => $actividadData['ambito'] ?? null,
                    'destreza' => $actividadData['destreza'] ?? null,
                    'estrategias_metologicas' =>
                        $actividadData['estrategias_metologicas'] ?? null,
                    'recursos' => $actividadData['recursos'] ?? null,
                    'indicadores_logro' =>
                        $actividadData['indicadores_logro'] ?? null,
                ]);

                $actividadesCount++;

                $subactividades =
                    $actividadData['subactividades'] ?? [];

                if (! is_array($subactividades)) {
                    throw ValidationException::withMessages([
                        $seccion.'.'.$index.'.subactividades' =>
                            'El bloque "subactividades" debe ser un arreglo.',
                    ]);
                }

                foreach ($subactividades as $subIndex => $subData) {

                    if (! is_array($subData)) {
                        throw ValidationException::withMessages([
                            $seccion.'.'.$index.
                                '.subactividades.'.$subIndex =>
                                'Cada subactividad debe ser un objeto.',
                        ]);
                    }

                    $actividad->subactividades()->create(
                        $this->atributosSubactividad(
                            $subData,
                            $subIndex + 1
                        )
                    );

                    $subactividadesCount++;

                }

            }

        }

        return [
            'actividades' => $actividadesCount,
            'subactividades' => $subactividadesCount,
        ];
    }

    private function atributosSubactividad(
        array $data,
        int $orden
    ): array {
        return [
            'orden' => $data['orden'] ?? $orden,
            'destreza' => $data['destreza'] ?? null,
            'estrategias_metologicas' =>
                $data['estrategias_metologicas'] ?? null,
            'recursos' => $data['recursos'] ?? null,
            'indicadores_logro' =>
                $data['indicadores_logro'] ?? null,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | NORMALIZAR DATOS DE LA PLANIFICACIÓN
    |--------------------------------------------------------------------------
    */

    private function normalizarPlanificacion(array $data): array
    {
        $raw = isset($data['planificacion']) &&
            is_array($data['planificacion'])
                ? $data['planificacion']
                : $data;

        $atributos = [];

        foreach (self::ALIASES as $limpio => $alias) {

            $valor = $raw[$limpio] ?? $raw[$alias] ?? null;

            $atributos[$limpio] =
                is_string($valor) ? trim($valor) : $valor;

        }

        if (empty($atributos['experiencia_aprendizaje'])) {
            throw ValidationException::withMessages([
                'experiencia_aprendizaje' =>
                    'El campo "experiencia_aprendizaje" es obligatorio.',
            ]);
        }

        $atributos['tamano_letra_actividades'] =
            (int) ($raw['tamano_letra_actividades'] ?? 8);

        $atributos['es_plantilla'] = (bool) filter_var(
            $raw['es_plantilla'] ?? false,
            FILTER_VALIDATE_BOOLEAN
        );

        return $atributos;
    }
}
