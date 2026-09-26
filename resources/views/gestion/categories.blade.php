@extends('layouts.app')

@section('title', 'Categorías de ' . $technology->name)

@section('content')

<div class="gestion-container">

    <div
        id="technologyContext"
        data-technology-id="{{ $technology->id }}"
    ></div>

    <div class="gestion-header">

        <div>

            <h1>
                Categorías de {{ $technology->name }}
            </h1>

            <p>
                Administrar categorías de esta tecnología
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

    @include('components.tabla-gestion', [

        'id' => 'categoriesTable',

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

            'concepts' => true,

            'delete' => true

        ]

    ])

</div>

@endsection