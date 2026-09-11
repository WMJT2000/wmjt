@extends('layouts.app')

@section('title', 'Manuales')

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
            Manuales
        </h1>

        <p>
            Administrar manuales prácticos
        </p>

    </div>


    <button
        type="button"
        id="btnNuevoManual"
        class="btn-primary"
    >
        + Nuevo manual
    </button>

</div>



{{-- 
|--------------------------------------------------------------------------
| FORMULARIO
|--------------------------------------------------------------------------
--}}

<div
    id="manualFormContainer"
    style="display: none;"
>

    @include('layouts.form', [

        'formId' => 'manualForm',

        'title' => 'Nuevo manual',

        'action' => '/api/manuals',

        'method' => 'POST',

        'buttonText' => 'Guardar',

        'fields' => [

            [
                'name' => 'technology_id',

                'label' => 'Tecnología',

                'type' => 'select',

                'placeholder' =>
                    'Seleccione una tecnología',

                'required' => true,

                'options' => []
            ],

            [
                'name' => 'title',

                'label' => 'Título',

                'type' => 'text',

                'placeholder' =>
                    'Ej: Ionic desde cero',

                'required' => true,

                'maxlength' => 200
            ],

            [
                'name' => 'slug',

                'label' => 'Slug',

                'type' => 'text',

                'placeholder' =>
                    'Ej: ionic-desde-cero',

                'required' => false,

                'maxlength' => 200
            ],

            [
                'name' => 'description',

                'label' => 'Descripción',

                'type' => 'textarea',

                'placeholder' =>
                    'Descripción del manual',

                'required' => true
            ],

            [
                'name' => 'objective',

                'label' => 'Objetivo',

                'type' => 'textarea',

                'placeholder' =>
                    '¿Qué aprenderá el usuario al terminar este manual?',

                'required' => true
            ],

            [
                'name' => 'difficulty',

                'label' => 'Dificultad',

                'type' => 'select',

                'placeholder' =>
                    'Seleccione una dificultad',

                'required' => true,

                'options' => [

                    'beginner' =>
                        'Principiante',

                    'intermediate' =>
                        'Intermedio',

                    'advanced' =>
                        'Avanzado'

                ]
            ],

            [
                'name' => 'status',

                'label' => 'Estado',

                'type' => 'select',

                'placeholder' =>
                    'Seleccione un estado',

                'required' => true,

                'options' => [

                    'draft' =>
                        'Borrador',

                    'published' =>
                        'Publicado'

                ]
            ]

        ]

    ])

</div>



{{-- 
|--------------------------------------------------------------------------
| TABLA GESTIÓN
|--------------------------------------------------------------------------
--}}

@include('components.tabla-gestion', [

    'id' => 'manualsTable',

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
            'key' => 'technology.name',

            'label' => 'Tecnología'
        ],

        [
            'key' => 'difficulty',

            'label' => 'Dificultad'
        ],

        [
            'key' => 'status',

            'label' => 'Estado'
        ],

        [
            'key' => 'sections_count',

            'label' => 'Secciones'
        ]

    ],

    'actions' => [

        'edit' => true,

        'sections' => true,

        'delete' => true

    ]

])


</div>

@endsection