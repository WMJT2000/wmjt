@extends('layouts.app')

@section('title', 'Conceptos')

@section('content')

<div class="gestion-container">

    <div class="gestion-header">

        <div>
            <h1>Conceptos</h1>
            <p>Administrar conceptos</p>
        </div>

        <button
            type="button"
            id="btnNuevoConcepto"
            class="btn-primary"
        >
            + Nuevo concepto
        </button>

    </div>


    {{-- FORMULARIO DINÁMICO --}}

    <div
        id="conceptFormContainer"
        style="display: none;"
    >

        @include('layouts.form', [

            'title' => 'Nuevo concepto',

            'action' => '/api/concepts',

            'method' => 'POST',

            'buttonText' => 'Guardar',

            'fields' => [

                [
                    'name' => 'category_id',
                    'label' => 'Categoría',
                    'type' => 'select',
                    'placeholder' => 'Selecciona una categoría',
                    'options' => [],
                    'required' => true
                ],

                [
                    'name' => 'name',
                    'label' => 'Nombre',
                    'type' => 'text',
                    'placeholder' => 'Ej: let',
                    'required' => true,
                    'maxlength' => 150
                ],

                [
                    'name' => 'slug',
                    'label' => 'Slug',
                    'type' => 'text',
                    'placeholder' => 'Ej: let',
                    'required' => true,
                    'maxlength' => 150
                ],

                [
                    'name' => 'type',
                    'label' => 'Tipo',
                    'type' => 'text',
                    'placeholder' => 'Ej: variable',
                    'required' => true,
                    'maxlength' => 50
                ],

                [
                    'name' => 'description',
                    'label' => 'Descripción',
                    'type' => 'textarea',
                    'placeholder' => 'Descripción del concepto',
                    'required' => true
                ],

                [
                    'name' => 'how_to_use',
                    'label' => 'Cómo utilizar',
                    'type' => 'textarea',
                    'placeholder' => 'Explica cómo utilizar este concepto',
                    'required' => true
                ],

                [
                    'name' => 'example',
                    'label' => 'Ejemplo',
                    'type' => 'textarea',
                    'placeholder' => 'Ejemplo de código',
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
                    <th>Categoría</th>
                    <th>Nombre</th>
                    <th>Slug</th>
                    <th>Tipo</th>
                    <th>Acciones</th>
                </tr>

            </thead>

            <tbody id="conceptsTable">

                <tr>
                    <td colspan="6">
                        Cargando...
                    </td>
                </tr>

            </tbody>

        </table>

    </div>

</div>

@endsection