@extends('layouts.app')

@section('title', 'Conceptos')

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
                Conceptos
            </h1>

            <p>
                Administrar conceptos técnicos
            </p>

        </div>


        <button
            type="button"
            id="btnNuevoConcepto"
            class="btn-primary"
        >
            + Nuevo concepto
        </button>

    </div>



    {{-- 
    |--------------------------------------------------------------------------
    | FORMULARIO
    |--------------------------------------------------------------------------
    --}}

    <div
        id="conceptFormContainer"
        style="display: none;"
    >

        @include('layouts.form', [

            'formId' => 'conceptForm',

            'title' => 'Nuevo concepto',

            'action' => '/api/concepts',

            'method' => 'POST',

            'buttonText' => 'Guardar',

            'fields' => [

                [
                    'name' => 'category_id',

                    'label' => 'Categoría',

                    'type' => 'select',

                    'placeholder' =>
                        'Seleccione una categoría',

                    'required' => true,

                    'options' => []
                ],

                [
                    'name' => 'name',

                    'label' => 'Nombre',

                    'type' => 'text',

                    'placeholder' =>
                        'Ej: map()',

                    'required' => true,

                    'maxlength' => 150
                ],

                [
                    'name' => 'slug',

                    'label' => 'Slug',

                    'type' => 'text',

                    'placeholder' =>
                        'Ej: map',

                    'required' => true,

                    'maxlength' => 150
                ],

                [
                    'name' => 'type',

                    'label' => 'Tipo',

                    'type' => 'text',

                    'placeholder' =>
                        'Ej: metodo',

                    'required' => true,

                    'maxlength' => 50
                ],

                [
                    'name' => 'description',

                    'label' => 'Descripción',

                    'type' => 'textarea',

                    'placeholder' =>
                        'Descripción del concepto',

                    'required' => true
                ],

                [
                    'name' => 'how_to_use',

                    'label' => 'Cómo utilizarlo',

                    'type' => 'textarea',

                    'placeholder' =>
                        'Explica cuándo y cómo utilizar este concepto',

                    'required' => true
                ],

                [
                    'name' => 'example',

                    'label' => 'Ejemplo',

                    'type' => 'textarea',

                    'placeholder' =>
                        'Ejemplo de código',

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
    | Utilizamos exactamente el mismo componente
    | reutilizable que utiliza Tecnologías.
    |
    | La tabla NO conoce la lógica de conceptos.
    |
    --}}

    @include('components.tabla-gestion', [

        'id' => 'conceptsTable',

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
                'key' => 'category.name',

                'label' => 'Categoría'
            ],

            [
                'key' => 'type',

                'label' => 'Tipo'
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

