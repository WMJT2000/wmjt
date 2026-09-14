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

        </div>


        <a href="{{ route('planificaciones.create') }}" class="btn-primary">
            + Nueva planificación
        </a>

    </div>


    {{-- =========================================================
         TABLA GESTIÓN
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

</div>

@endsection