@extends('layouts.app')

@section('title', 'Planificaciones')

@section('content')

<div class="gestion-container">


{{-- =========================================================
 HEADER
========================================================== --}}

<div class="gestion-header">

    <div>

        <h1>
            Planificaciones
        </h1>

        <p>
            Administrar planificaciones
        </p>

        <a href="{{ route('gestion.index') }}" class="btn-primary" > ← Salir </a>

    </div>


    <button
        type="button"
        id="btnNuevaPlanificacion"
        class="btn-primary"
    >
        + Nueva planificación
    </button>

</div>


{{-- =========================================================
 TABLA DE PLANIFICACIONES
========================================================== --}}

@include('components.tabla-gestion', [

    'id' => 'planificacionesTable',

    'columns' => [

        [
            'key' => 'id',
            'label' => 'ID'
        ],

        [
            'key' => 'experiencia_aprendizaje',
            'label' => 'Experiencia'
        ],

        [
            'key' => 'nombre_maestra',
            'label' => 'Maestra'
        ],

        [
            'key' => 'fecha',
            'label' => 'Fecha'
        ],

        [
            'key' => 'nivel_educativo',
            'label' => 'Nivel'
        ],

        [
            'key' => 'estado',
            'label' => 'Estado'
        ],

        [
            'key' => 'progreso',
            'label' => 'Progreso'
        ]

    ],

    'actions' => [

        'edit' => true,

        'delete' => true

    ]

])


{{-- =========================================================
 TABLA DE PLANTILLAS
========================================================== --}}

<div class="gestion-section">

    <div class="gestion-section-header">

        <div>

            <h2>
                Plantillas
            </h2>

            <p>
                Planificaciones guardadas como plantilla
            </p>

        </div>

    </div>


    @include('components.tabla-gestion', [

        'id' => 'plantillasTable',

        'columns' => [

            [
                'key' => 'id',
                'label' => 'ID'
            ],

            [
                'key' => 'experiencia_aprendizaje',
                'label' => 'Experiencia'
            ],

            [
                'key' => 'nombre_maestra',
                'label' => 'Maestra'
            ],

            [
                'key' => 'nivel_educativo',
                'label' => 'Nivel'
            ],

            [
                'key' => 'estado',
                'label' => 'Estado'
            ]

        ],

        'actions' => [

            'edit' => true,

            'delete' => true

        ]

    ])

</div>


</div>

{{-- =========================================================
MODAL NUEVA PLANIFICACIÓN
========================================================== --}}

<div
    id="modalNuevaPlanificacion"
    class="gestion-modal"
    style="display: none;"
>


<div class="gestion-modal-content">

    <div class="gestion-modal-header">

        <div>

            <h2>
                Nueva planificación
            </h2>

            <p>
                Selecciona cómo deseas comenzar.
            </p>

        </div>


        <button
            type="button"
            id="cerrarModalNuevaPlanificacion"
            class="gestion-modal-close"
        >
            ×
        </button>

    </div>


    <div class="gestion-modal-body">

        <button
            type="button"
            id="btnCrearPlanificacionVacia"
            class="gestion-modal-option"
        >

            <strong>
                Crear planificación vacía
            </strong>

            <span>
                Comenzar una planificación desde cero.
            </span>

        </button>


        <button
            type="button"
            id="btnUsarPlantilla"
            class="gestion-modal-option"
        >

            <strong>
                Usar una plantilla
            </strong>

            <span>
                Seleccionar una plantilla existente y modificarla.
            </span>

        </button>

    </div>

</div>


</div>

{{-- =========================================================
MODAL SELECCIONAR PLANTILLA
========================================================== --}}

<div
    id="modalPlantillas"
    class="gestion-modal"
    style="display: none;"
>


<div class="gestion-modal-content">

    <div class="gestion-modal-header">

        <div>

            <h2>
                Seleccionar plantilla
            </h2>

            <p>
                Selecciona la plantilla que deseas utilizar.
            </p>

        </div>


        <button
            type="button"
            id="cerrarModalPlantillas"
            class="gestion-modal-close"
        >
            ×
        </button>

    </div>


    <div
        id="listaPlantillas"
        class="gestion-modal-body"
    >

        <p>
            Cargando plantillas...
        </p>

    </div>

</div>


</div>

@endsection
