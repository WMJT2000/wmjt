@extends('layouts.app')

@section('title', 'Categorías de inglés')

@section('content')

<div class="gestion-container">

    {{-- HEADER --}}

    <div class="gestion-header">

        <div>

            <h1>
                Categorías de inglés
            </h1>

            <p>
                Administrar categorías de inglés
            </p>

        </div>


        <button
            type="button"
            id="btnNuevaEnglishCategory"
            class="btn-primary"
        >
            + Nueva categoría
        </button>

    </div>


    {{-- FORMULARIO --}}

    <div
        id="englishCategoryFormContainer"
        style="display: none;"
    >

        @include('layouts.form', [

            'formId' => 'englishCategoryForm',

            'title' => 'Nueva categoría',

            'action' => '/api/english/categories',

            'method' => 'POST',

            'buttonText' => 'Guardar',

            'fields' => [

                [
                    'name' => 'name',
                    'label' => 'Nombre',
                    'type' => 'text',
                    'placeholder' => 'Ej: Food',
                    'required' => true,
                    'maxlength' => 100
                ],

                [
                    'name' => 'description',
                    'label' => 'Descripción',
                    'type' => 'textarea',
                    'placeholder' => 'Descripción de la categoría',
                    'required' => false
                ]

            ]

        ])

    </div>


    {{-- TABLA --}}

    @include('components.tabla-gestion', [

        'id' => 'englishCategoriesTable',

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