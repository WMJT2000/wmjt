@extends('layouts.app')

@section('title', 'Significados de inglés')

@section('content')

<div class="gestion-container">

    <div class="gestion-header">

        <div>

            <h1>
                Significados de inglés
            </h1>

            <p>
                Administrar significados de palabras en inglés
            </p>

        </div>

        <button
            type="button"
            id="btnNuevoEnglishMeaning"
            class="btn-primary"
        >
            + Nuevo significado
        </button>

    </div>


    {{-- FORMULARIO --}}

    <div
        id="englishMeaningFormContainer"
        style="display: none;"
    >

        @include('layouts.form', [

            'formId' => 'englishMeaningForm',

            'title' => 'Nuevo significado',

            'action' => '/api/english/meanings',

            'method' => 'POST',

            'buttonText' => 'Guardar',

            'fields' => [

                [
                    'name' => 'english_category_id',

                    'label' => 'Categoría',

                    'type' => 'select',

                    'placeholder' =>
                        'Seleccione una categoría',

                    'required' => true,

                    'options' => []
                ],

                [
                    'name' => 'english_word_id',

                    'label' => 'Palabra',

                    'type' => 'select',

                    'placeholder' =>
                        'Seleccione primero una categoría',

                    'required' => true,

                    'options' => []
                ],

                [
                    'name' => 'meaning',

                    'label' => 'Significado',

                    'type' => 'text',

                    'placeholder' =>
                        'Ej: rápido, veloz',

                    'required' => true,

                    'maxlength' => 150
                ]

            ]

        ])

    </div>


    {{-- TABLA --}}

    @include('components.tabla-gestion', [

        'id' => 'englishMeaningsTable',

        'columns' => [

            [
                'key' => 'id',
                'label' => 'ID'
            ],

            [
                'key' => 'word.word',
                'label' => 'Palabra'
            ],

            [
                'key' => 'word.category.name',
                'label' => 'Categoría'
            ],

            [
                'key' => 'meaning',
                'label' => 'Significado'
            ]

        ],

        'actions' => [

            'edit' => true,

            'delete' => true

        ]

    ])

</div>

@endsection