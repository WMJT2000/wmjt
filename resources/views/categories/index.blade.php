@extends('layouts.app')

@section('title', 'Categorías')

@section('content')

<div class="gestion-container">

    <div class="gestion-header">

        <div>
            <h1>Categorías</h1>
            <p>Administrar categorías</p>
        </div>

        <button
            type="button"
            id="btnNuevaCategoria"
            class="btn-primary"
        >
            + Nueva categoría
        </button>

    </div>


    {{-- FORMULARIO DINÁMICO --}}

    <div
        id="categoryFormContainer"
        style="display: none;"
    >

        @include('layouts.form', [

            'title' => 'Nueva categoría',

            'action' => '/api/categories',

            'method' => 'POST',

            'buttonText' => 'Guardar',

            'fields' => [

                [
                    'name' => 'technology_id',
                    'label' => 'Tecnología',
                    'type' => 'select',
                    'placeholder' => 'Selecciona una tecnología',
                    'options' => [],
                    'required' => true
                ],

                [
                    'name' => 'name',
                    'label' => 'Nombre',
                    'type' => 'text',
                    'placeholder' => 'Ej: Variables',
                    'required' => true,
                    'maxlength' => 100
                ],

                [
                    'name' => 'description',
                    'label' => 'Descripción',
                    'type' => 'textarea',
                    'placeholder' => 'Descripción de la categoría',
                    'required' => true
                ]

            ]

        ])

    </div>


    {{-- LISTADO --}}

    <div class="table-container">

        <table>

            <thead>

                <tr>
                    <th>ID</th>
                    <th>Tecnología</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                </tr>

            </thead>

            <tbody id="categoriesTable">

                <tr>
                    <td colspan="5">
                        Cargando...
                    </td>
                </tr>

            </tbody>

        </table>

    </div>

</div>

@endsection