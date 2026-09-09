@extends('layouts.app')

@section('title', 'Tecnologías')


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
                Tecnologías
            </h1>

            <p>
                Administrar tecnologías
            </p>

        </div>


        <button
            type="button"
            id="btnNuevaTecnologia"
            class="btn-primary"
        >
            + Nueva tecnología
        </button>

    </div>



    {{-- 
    |--------------------------------------------------------------------------
    | FORMULARIO
    |--------------------------------------------------------------------------
    --}}

    <div
        id="technologyFormContainer"
        style="display: none;"
    >

        @include('layouts.form', [

            'formId' => 'technologyForm',

            'title' => 'Nueva tecnología',

            'action' => '/api/technologies',

            'method' => 'POST',

            'buttonText' => 'Guardar',

            'fields' => [

                [
                    'name' => 'name',

                    'label' => 'Nombre',

                    'type' => 'text',

                    'placeholder' =>
                        'Ej: JavaScript',

                    'required' => true,

                    'maxlength' => 100
                ],

                [
                    'name' => 'description',

                    'label' => 'Descripción',

                    'type' => 'textarea',

                    'placeholder' =>
                        'Descripción de la tecnología',

                    'required' => true
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

        'id' => 'technologiesTable',

        'columns' => [

            [
                'key' => 'id',

                'label' => 'ID'
            ],

            [
                'key' => 'name',

                'label' => 'Nombre'
            ],

            [
                'key' => 'description',

                'label' => 'Descripción'
            ]

        ],

        'actions' => [

            'edit' => true,

            'delete' => true

        ]

    ])


</div>


@endsection