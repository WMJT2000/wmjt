@extends('layouts.app')

@section('title', 'Pasos de la sección')

@section('content')

<div class="gestion-container">

    <div class="gestion-header">

        <div>

            <h1>
                {{ $section->title }}
            </h1>

            <p>
                Pasos de la sección

                @if($section->manual)
                    · {{ $section->manual->title }}
                @endif
            </p>

        </div>

        <a
            href="{{ route(
                'gestion.manual-sections',
                $section->manual_id
            ) }}"
            class="btn-primary"
        >
            ← Volver a secciones
        </a>

    </div>


    <div class="gestion-info">

        <h2>
            {{ $section->title }}
        </h2>

        @if($section->description)

            <p>
                {{ $section->description }}
            </p>

        @endif

    </div>


    <div style="margin-bottom: 20px;">

        <button
            type="button"
            id="btnNuevoPaso"
            class="btn-primary"
        >
            + Nuevo paso
        </button>

    </div>


    <div
        id="manualStepFormContainer"
        style="display: none;"
    >

        @include('layouts.form', [

            'formId' => 'manualStepForm',

            'title' => 'Nuevo paso',

            'action' => '/api/manual-steps',

            'method' => 'POST',

            'buttonText' => 'Guardar',

            'fields' => [

                [
                    'name' => 'section_id',
                    'label' => 'Sección',
                    'type' => 'hidden',
                    'value' => $section->id
                ],

                [
                    'name' => 'title',
                    'label' => 'Título',
                    'type' => 'text',
                    'placeholder' =>
                        'Ej: Instalar Node.js',
                    'required' => true,
                    'maxlength' => 200
                ],

                [
                    'name' => 'description',
                    'label' => 'Descripción',
                    'type' => 'textarea',
                    'placeholder' =>
                        'Descripción del paso',
                    'required' => false
                ],

                [
                    'name' => 'instructions',
                    'label' => 'Instrucciones',
                    'type' => 'textarea',
                    'placeholder' =>
                        'Explica qué debe hacer el usuario',
                    'required' => false
                ],

                [
                    'name' => 'command',
                    'label' => 'Comando',
                    'type' => 'textarea',
                    'placeholder' =>
                        'Ej: npm install -g @ionic/cli',
                    'required' => false
                ],

                [
                    'name' => 'code',
                    'label' => 'Código',
                    'type' => 'textarea',
                    'placeholder' =>
                        'Código que debe escribir el usuario',
                    'required' => false
                ],

                [
                    'name' => 'expected_result',
                    'label' => 'Resultado esperado',
                    'type' => 'textarea',
                    'placeholder' =>
                        '¿Qué debería ocurrir?',
                    'required' => false
                ],

                [
                    'name' => 'notes',
                    'label' => 'Notas',
                    'type' => 'textarea',
                    'placeholder' =>
                        'Notas adicionales',
                    'required' => false
                ],

                [
                    'name' => 'position',
                    'label' => 'Posición',
                    'type' => 'number',
                    'placeholder' => 'Ej: 1',
                    'required' => true,
                    'value' => 1
                ]

            ]

        ])

    </div>


    @include('components.tabla-gestion', [

        'id' => 'manualStepsTable',

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
                'key' => 'position',
                'label' => 'Posición'
            ]

        ],

        'actions' => [

            'edit' => true,

            'delete' => true

        ]

    ])


</div>

@endsection


@push('scripts')



@endpush