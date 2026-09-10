@extends('layouts.app')

@section('title', 'Palabras de inglés')

@section('content')

<div class="gestion-container">

    {{-- HEADER --}}

    <div class="gestion-header">

        <div>

            <h1>
                Palabras de inglés
            </h1>

            <p>
                Administrar palabras de inglés
            </p>

        </div>


        <button
            type="button"
            id="btnNuevaEnglishWord"
            class="btn-primary"
        >
            + Nueva palabra
        </button>

    </div>


    {{-- FORMULARIO --}}

    <div
        id="englishWordFormContainer"
        style="display: none;"
    >

        @include('layouts.form', [

            'formId' => 'englishWordForm',

            'title' => 'Nueva palabra',

            'action' => '/api/english/words',

            'method' => 'POST',

            'buttonText' => 'Guardar',

            'fields' => [

                [
                    'name' => 'english_category_id',
                    'label' => 'Categoría',
                    'type' => 'select',
                    'placeholder' => 'Selecciona una categoría',
                    'required' => true,
                    'options' => []
                ],

                [
                    'name' => 'word',
                    'label' => 'Palabra',
                    'type' => 'text',
                    'placeholder' => 'Ej: Apple',
                    'required' => true,
                    'maxlength' => 100
                ],


                [
                    'name' => 'pronunciation_guide',
                    'label' => 'Guía de pronunciación',
                    'type' => 'text',
                    'placeholder' => 'Ej: á-pol',
                    'required' => true,
                    'maxlength' => 100
                ],

                [
                    'name' => 'example',
                    'label' => 'Ejemplo',
                    'type' => 'textarea',
                    'placeholder' => 'Ej: I eat an apple every day.',
                    'required' => false
                ],

                [
                    'name' => 'example_translation',
                    'label' => 'Traducción del ejemplo',
                    'type' => 'textarea',
                    'placeholder' => 'Ej: Como una manzana todos los días.',
                    'required' => false
                ]

            ]

        ])

    </div>


    {{-- TABLA --}}

    @include('components.tabla-gestion', [

        'id' => 'englishWordsTable',

        'columns' => [

            [
                'key' => 'id',
                'label' => 'ID'
            ],

            [
                'key' => 'word',
                'label' => 'Palabra'
            ],

            [
                'key' => 'pronunciation_guide',
                'label' => 'Guía de pronunciación'
            ],

            [
                'key' => 'category.name',
                'label' => 'Categoría'
            ],

            [
                'key' => 'example',
                'label' => 'Ejemplo'
            ],

            [
                'key' => 'example_translation',
                'label' => 'Traducción'
            ]

        ],

        'actions' => [

            'edit' => true,

            'delete' => true

        ]

    ])


</div>

@endsection