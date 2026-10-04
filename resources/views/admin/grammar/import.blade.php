@extends('layouts.app')

@section('content')

<div class="grammar-import-container">

    <h1>
        Importar Grammar
    </h1>

    <p class="description">
        Importa contenido de Grammar de forma progresiva.
        Puedes crear una estructura completa desde cero
        o agregar contenido a elementos existentes.
    </p>


    {{-- CATEGORÍA --}}

    <div class="form-group">

        <label for="categorySelect">
            Categoría
        </label>

        <select id="categorySelect">

            <option value="">
                Sin categoría existente
            </option>

            @foreach($categories as $category)

                <option value="{{ $category->id }}">
                    {{ $category->level }}
                    -
                    {{ $category->name }}
                </option>

            @endforeach

        </select>

    </div>


    {{-- TIPO DE IMPORTACIÓN --}}

    <div class="form-group">

        <label for="importType">
            ¿Qué deseas importar?
        </label>

        <select id="importType">

            <option value="">
                Selecciona una opción
            </option>

            <option value="complete">
                Importación completa
            </option>

            <option value="topics">
                Topics
            </option>

            <option value="lessons">
                Lessons
            </option>

            <option value="lesson">
                Una Lesson
            </option>

            <option value="rules">
                Rules
            </option>

            <option value="examples">
                Examples
            </option>

        </select>

    </div>


    {{-- PADRE ESPECÍFICO --}}

    <div
        class="form-group"
        id="parentGroup"
        style="display: none;"
    >

        <label for="parentSelect">
            Elemento padre
        </label>

        <select id="parentSelect">

            <option value="">
                Selecciona un elemento
            </option>

        </select>

    </div>


    {{-- ARCHIVO --}}

    <div class="form-group">

        <label for="jsonFile">
            Archivo JSON
        </label>

        <input
            type="file"
            id="jsonFile"
            accept=".json,application/json"
            disabled
        >

    </div>


    {{-- ACCIONES --}}

    <div class="actions">

        <button
            type="button"
            id="validateBtn"
            disabled
        >
            Validar JSON
        </button>

        <button
            type="button"
            id="importBtn"
            class="btn-import"
            style="display: none;"
        >
            Importar
        </button>

    </div>


    {{-- PREVIEW --}}

    <div id="preview"></div>

</div>

@endsection