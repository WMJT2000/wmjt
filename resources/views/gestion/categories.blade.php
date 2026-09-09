
@extends('layouts.app')

@section('title', 'Categorías')

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
                Categorías
            </h1>

            <p>
                Administrar categorías
            </p>

        </div>


        <button
            type="button"
            id="btnNuevaCategoria"
            class="btn-primary"
        >
            + Nueva categoría
        </button>

    </div>



    {{-- 
    |--------------------------------------------------------------------------
    | FORMULARIO
    |--------------------------------------------------------------------------
    --}}

    <div
        id="categoryFormContainer"
        style="display: none;"
    >

        @include('layouts.form', [

            'formId' => 'categoryForm',

            'title' => 'Nueva categoría',

            'action' => '/api/categories',

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
                    'name' => 'name',

                    'label' => 'Nombre',

                    'type' => 'text',

                    'placeholder' =>
                        'Ej: Variables',

                    'required' => true,

                    'maxlength' => 100
                ],

                [
                    'name' => 'description',

                    'label' => 'Descripción',

                    'type' => 'textarea',

                    'placeholder' =>
                        'Descripción de la categoría',

                    'required' => true
                ]

            ]

        ])

    </div>



    {{-- 
    |--------------------------------------------------------------------------
    | TABLA GESTIÓN
    |--------------------------------------------------------------------------
    |
    | La tabla es reutilizable.
    |
    | categories.js solamente proporciona:
    |
    | - datos
    | - columnas
    | - acciones
    |
    | TablaGestion se encarga del renderizado.
    |
    --}}

    @include('components.tabla-gestion', [

        'id' => 'categoriesTable',

        'columns' => [

            [
                'key' => 'id',

                'label' => 'ID'
            ],

            [
                'key' => 'technology.name',

                'label' => 'Tecnología'
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

