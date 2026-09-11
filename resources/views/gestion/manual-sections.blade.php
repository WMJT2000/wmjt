@extends('layouts.app')

@section('title', 'Secciones del manual')

@section('content')

<div class="gestion-container">


{{-- 
|--------------------------------------------------------------------------
| HEADER
|--------------------------------------------------------------------------
--}}

<div class="gestion-header">

    <div>

        <h1>
            {{ $manual->title }}
        </h1>

        <p>
            Secciones del manual
            @if($manual->technology)
                · {{ $manual->technology->name }}
            @endif
        </p>

    </div>


    <a
        href="{{ route('gestion.manuals') }}"
        class="btn-primary"
    >
        ← Volver a manuales
    </a>

</div>



{{-- 
|--------------------------------------------------------------------------
| INFORMACIÓN DEL MANUAL
|--------------------------------------------------------------------------
--}}

<div class="gestion-info">

    <h2>
        {{ $manual->title }}
    </h2>

    @if($manual->description)

        <p>
            {{ $manual->description }}
        </p>

    @endif

    @if($manual->objective)

        <p>
            <strong>Objetivo:</strong>
            {{ $manual->objective }}
        </p>

    @endif

</div>



{{-- 
|--------------------------------------------------------------------------
| FORMULARIO
|--------------------------------------------------------------------------
--}}

<div
    id="manualSectionFormContainer"
    style="display: none;"
>

    @include('layouts.form', [

        'formId' => 'manualSectionForm',

        'title' => 'Nueva sección',

        'action' => '/api/manual-sections',

        'method' => 'POST',

        'buttonText' => 'Guardar',

        'fields' => [

            [
                'name' => 'manual_id',

                'label' => 'Manual',

                'type' => 'hidden',

                'value' => $manual->id
            ],

            [
                'name' => 'title',

                'label' => 'Título',

                'type' => 'text',

                'placeholder' =>
                    'Ej: Preparar el entorno',

                'required' => true,

                'maxlength' => 200
            ],

            [
                'name' => 'description',

                'label' => 'Descripción',

                'type' => 'textarea',

                'placeholder' =>
                    'Descripción de la sección',

                'required' => false
            ],

            [
                'name' => 'position',

                'label' => 'Posición',

                'type' => 'number',

                'placeholder' =>
                    'Ej: 1',

                'required' => true,

                'value' => 1
            ]

        ]

    ])

</div>



{{-- 
|--------------------------------------------------------------------------
| BOTÓN NUEVA SECCIÓN
|--------------------------------------------------------------------------
--}}

<div style="margin-bottom: 20px;">

    <button
        type="button"
        id="btnNuevaSeccion"
        class="btn-primary"
    >
        + Nueva sección
    </button>

</div>



{{-- 
|--------------------------------------------------------------------------
| TABLA
|--------------------------------------------------------------------------
--}}

@include('components.tabla-gestion', [

    'id' => 'manualSectionsTable',

    'columns' => [

        [
            'key' => 'id',

            'label' => 'ID'
        ],

        [
            'key' => 'title',

            'label' => 'Título'
        ],

        [
            'key' => 'description',

            'label' => 'Descripción'
        ],

        [
            'key' => 'position',

            'label' => 'Posición'
        ],

        [
            'key' => 'steps_count',

            'label' => 'Pasos'
        ]

    ],

    'actions' => [

        'edit' => true,

        'steps' => true,

        'delete' => true

    ]

])


</div>

@endsection