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

        <a
            href="{{ route('gestion.index') }}"
            class="btn-primary"
        >
            ← Salir
        </a>

    </div>


    <div class="gestion-header-actions">

        {{-- ================================================
        GENERAR WORD
        ================================================= --}}

        <button
            type="button"
            id="btnGenerarWord"
            class="btn-primary"
        >
            Generar Word
        </button>


        {{-- ================================================
        NUEVA PLANIFICACIÓN
        ================================================= --}}

        <button
            type="button"
            id="btnNuevaPlanificacion"
            class="btn-primary"
        >
            + Nueva planificación
        </button>

    </div>

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

    ],
    'selectable' => true

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
MODAL GENERAR WORD
========================================================== --}}

<div
    id="modalGenerarWord"
    class="gestion-modal"
    style="display: none;"
>


<div class="gestion-modal-content">


    {{-- =====================================================
    HEADER
    ====================================================== --}}

    <div class="gestion-modal-header">

        <div>

            <h2>
                Generar Word
            </h2>

            <p>
                Selecciona las planificaciones que deseas incluir.
            </p>

        </div>


        <button
            type="button"
            id="cerrarModalGenerarWord"
            class="gestion-modal-close"
        >
            ×
        </button>

    </div>


    {{-- =====================================================
    BODY
    ====================================================== --}}

    <div class="gestion-modal-body">


        {{-- =================================================
        OPCIÓN MANUAL
        ================================================== --}}

        <div class="generar-word-opcion">

            <label>

                <input
                    type="radio"
                    name="tipoSeleccionWord"
                    value="manual"
                    id="radioSeleccionManual"
                    checked
                >

                <strong>
                    Seleccionar manualmente
                </strong>

            </label>


            <p>
                Selecciona directamente las planificaciones
                que deseas incluir en el documento.
            </p>

        </div>


        {{-- =================================================
        OPCIÓN POR FECHAS
        ================================================== --}}

        <div class="generar-word-opcion">

            <label>

                <input
                    type="radio"
                    name="tipoSeleccionWord"
                    value="fechas"
                    id="radioSeleccionFechas"
                >

                <strong>
                    Seleccionar por rango de fechas
                </strong>

            </label>


            <p>
                Incluye todas las planificaciones que estén
                dentro del rango de fechas seleccionado.
            </p>

        </div>


        {{-- =================================================
        CONTENEDOR SELECCIÓN MANUAL
        ================================================== --}}

        <div
            id="contenedorSeleccionManual"
            style="display: none;"
        >

            <hr>


            <h3>
                Planificaciones seleccionadas
            </h3>


            <p>
                Marca las planificaciones que deseas incluir.
            </p>


            <div
                id="listaPlanificacionesWord"
                class="lista-planificaciones-word"
            >

                <p>
                    Cargando planificaciones...
                </p>

            </div>


            <div
                id="contadorPlanificacionesSeleccionadas"
            >
                Seleccionadas: 0
            </div>

        </div>


        {{-- =================================================
        CONTENEDOR SELECCIÓN POR FECHAS
        ================================================== --}}

        <div
            id="contenedorSeleccionFechas"
            style="display: none;"
        >

            <hr>


            <h3>
                Seleccionar por fechas
            </h3>


            <div class="generar-word-fechas">


                {{-- FECHA INICIAL --}}

                <div>

                    <label
                        for="fechaWordDesde"
                    >
                        Fecha inicial
                    </label>

                    <input
                        type="date"
                        id="fechaWordDesde"
                        class="form-control"
                    >

                </div>


                {{-- FECHA FINAL --}}

                <div>

                    <label
                        for="fechaWordHasta"
                    >
                        Fecha final
                    </label>

                    <input
                        type="date"
                        id="fechaWordHasta"
                        class="form-control"
                    >

                </div>

            </div>


            <button
                type="button"
                id="btnBuscarPorFechas"
                class="btn-primary"
            >
                Buscar planificaciones
            </button>


            <div
                id="resultadoPlanificacionesFechas"
                style="display: none;"
            >

                <hr>


                <h3>
                    Planificaciones encontradas
                </h3>


                <div
                    id="listaPlanificacionesFechas"
                    class="lista-planificaciones-word"
                >
                </div>


                <div
                    id="contadorPlanificacionesFechas"
                >
                    Encontradas: 0
                </div>

            </div>


        </div>


    </div>


    {{-- =====================================================
    FOOTER
    ====================================================== --}}

    <div class="gestion-modal-footer">

        <button
            type="button"
            id="cancelarGenerarWord"
            class="btn-secondary"
        >
            Cancelar
        </button>


        <button
            type="button"
            id="btnConfirmarGenerarWord"
            class="btn-primary"
        >
            Generar Word
        </button>

    </div>


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