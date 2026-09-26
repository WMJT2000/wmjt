@extends('layouts.app')

@section('title', 'Significados de ' . $word->word)

@section('content')

<div class="gestion-container">

    <div
        id="englishWordContext"
        data-word-id="{{ $word->id }}"
    ></div>

    <div class="gestion-header">

        <div>

            <h1>
                Significados de {{ $word->word }}
            </h1>

            <p>
                Administrar significados de esta palabra
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
                    'name' => 'meaning',
                    'label' => 'Significado',
                    'type' => 'text',
                    'placeholder' => 'Ej: rápido, veloz',
                    'required' => true,
                    'maxlength' => 150
                ]

            ]

        ])

    </div>

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