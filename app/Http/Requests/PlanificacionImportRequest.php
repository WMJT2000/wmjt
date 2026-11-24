<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlanificacionImportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [

            /*
            |--------------------------------------------------------------------------
            | IMPORTACIÓN COMPLETA (UNA O VARIAS PLANIFICACIONES)
            |--------------------------------------------------------------------------
            */

            'planificacion' => [
                'sometimes',
                'array',
            ],

            'planificaciones' => [
                'sometimes',
                'array',
                'min:1',
            ],

            'planificaciones.*' => [
                'array',
            ],

            'planificaciones.*.planificacion' => [
                'sometimes',
                'array',
            ],

            /*
            |--------------------------------------------------------------------------
            | CAMPOS DE LA PLANIFICACIÓN (NOMBRES LIMPIOS Y ALIASES)
            |--------------------------------------------------------------------------
            */

        ];

        foreach ($this->prefijosPlanificacion() as $prefijo) {

            foreach ($this->camposTexto() as $limpio => $alias) {

                $rules[$prefijo.$limpio] = [
                    'nullable',
                    'string',
                    'max:255',
                ];

                $rules[$prefijo.$alias] = [
                    'nullable',
                    'string',
                    'max:255',
                ];

            }

            $rules[$prefijo.'fecha'] = [
                'nullable',
                'date',
            ];

            $rules[$prefijo.'5_fecha'] = [
                'nullable',
                'date',
            ];

            $rules[$prefijo.'tamano_letra_actividades'] = [
                'nullable',
                'integer',
            ];

            $rules[$prefijo.'es_plantilla'] = [
                'nullable',
                'boolean',
            ];

            $rules[$prefijo.'estado'] = [
                'nullable',
                'string',
                'max:50',
            ];

            $rules[$prefijo.'progreso'] = [
                'nullable',
                'integer',
            ];

        }

        /*
        |--------------------------------------------------------------------------
        | CAMPOS QUE SE IGNORAN PERO SE ACEPTAN (COMPATIBILIDAD)
        |--------------------------------------------------------------------------
        */

        $rules['finalizar'] = [
            'nullable',
            'boolean',
        ];

        $rules['plantilla_origen_id'] = [
            'nullable',
            'integer',
        ];

        /*
        |--------------------------------------------------------------------------
        | ACTIVIDADES (PART1 / PART2) Y SUS SUBACTIVIDADES
        |--------------------------------------------------------------------------
        */

        foreach ($this->prefijosActividades() as $prefijo) {

            $rules[$prefijo.'part1'] = [
                'nullable',
                'array',
            ];

            $rules[$prefijo.'part2'] = [
                'nullable',
                'array',
            ];

            foreach (['part1', 'part2'] as $seccion) {

                $rules[$prefijo.$seccion.'.*'] = [
                    'array',
                ];

                $rules[$prefijo.$seccion.'.*.orden'] = [
                    'nullable',
                    'integer',
                ];

                $rules[$prefijo.$seccion.'.*.ambito'] = [
                    'nullable',
                    'string',
                    'max:255',
                ];

                $rules[$prefijo.$seccion.'.*.destreza'] = [
                    'nullable',
                    'string',
                ];

                $rules[$prefijo.$seccion.'.*.estrategias_metologicas'] = [
                    'nullable',
                    'string',
                ];

                $rules[$prefijo.$seccion.'.*.recursos'] = [
                    'nullable',
                    'string',
                ];

                $rules[$prefijo.$seccion.'.*.indicadores_logro'] = [
                    'nullable',
                    'string',
                ];

                $rules[$prefijo.$seccion.'.*.subactividades'] = [
                    'nullable',
                    'array',
                ];

                $rules[$prefijo.$seccion.'.*.subactividades.*'] = [
                    'array',
                ];

                $rules[$prefijo.$seccion.'.*.subactividades.*.orden'] = [
                    'nullable',
                    'integer',
                ];

                $rules[
                    $prefijo.$seccion.
                    '.*.subactividades.*.destreza'
                ] = [
                    'nullable',
                    'string',
                ];

                $rules[
                    $prefijo.$seccion.
                    '.*.subactividades.*.estrategias_metologicas'
                ] = [
                    'nullable',
                    'string',
                ];

                $rules[
                    $prefijo.$seccion.
                    '.*.subactividades.*.recursos'
                ] = [
                    'nullable',
                    'string',
                ];

                $rules[
                    $prefijo.$seccion.
                    '.*.subactividades.*.indicadores_logro'
                ] = [
                    'nullable',
                    'string',
                ];

            }

        }

        /*
        |--------------------------------------------------------------------------
        | SUBACTIVIDADES SUELTAS (IMPORTACIÓN PROGRESIVA)
        |--------------------------------------------------------------------------
        */

        $rules['subactividades'] = [
            'nullable',
            'array',
            'min:1',
        ];

        $rules['subactividades.*'] = [
            'array',
        ];

        $rules['subactividades.*.orden'] = [
            'nullable',
            'integer',
        ];

        $rules['subactividades.*.destreza'] = [
            'nullable',
            'string',
        ];

        $rules['subactividades.*.estrategias_metologicas'] = [
            'nullable',
            'string',
        ];

        $rules['subactividades.*.recursos'] = [
            'nullable',
            'string',
        ];

        $rules['subactividades.*.indicadores_logro'] = [
            'nullable',
            'string',
        ];

        return $rules;
    }

    private function camposTexto(): array
    {
        return [
            'experiencia_aprendizaje' =>
                '1_experiencia_prendizaje',

            'descripcion_general_experiencia' =>
                '2_descripcion_general_experiencia',

            'nombre_maestra' =>
                '3_nombre_maestra',

            'tiempo_estimado' =>
                '4_tiempo_estimado',

            'nivel_educativo' =>
                '6_nivel_educativo',

            'objetivo_aprendizaje' =>
                '7_objetivo_aprendizaje',

            'elemento_integrador' =>
                '8_elemento_integrador',

            'nocion_dia' =>
                '9_nocion_dia',
        ];
    }

    private function prefijosPlanificacion(): array
    {
        return [
            '',
            'planificacion.',
            'planificaciones.*.',
            'planificaciones.*.planificacion.',
        ];
    }

    private function prefijosActividades(): array
    {
        return [
            '',
            'planificaciones.*.',
        ];
    }
}
