@extends('layouts.app')

@section('title', 'Tecnologías')


@section('content')

<div class="gestion-container">


    {{-- HEADER --}}

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


    {{-- FORMULARIO --}}

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
                    'placeholder' => 'Ej: JavaScript',
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


    {{-- TABLA --}}

    <div class="table-container">

        <table>

            <thead>

                <tr>

                    <th>
                        ID
                    </th>

                    <th>
                        Nombre
                    </th>

                    <th>
                        Descripción
                    </th>

                    <th>
                        Acciones
                    </th>

                </tr>

            </thead>


            <tbody id="technologiesTable">

                <tr>

                    <td colspan="4">
                        Cargando...
                    </td>

                </tr>

            </tbody>

        </table>

    </div>


</div>



@endsection