@extends('layouts.app')

@section('content')

<div class="grammar-import-container">

    <h1>Importar Grammar JSON</h1>

    <p class="description">
        Selecciona un archivo JSON que contenga la categoría,
        topics, lessons, rules y examples.
    </p>

    <div class="form-group">

        <label for="jsonFile">
            Archivo JSON
        </label>

        <input
            type="file"
            id="jsonFile"
            accept=".json,application/json"
        >

    </div>

    <div class="actions">

        <button
            type="button"
            id="validateBtn"
        >
            Validar JSON
        </button>

        <button
            type="button"
            id="importBtn"
            class="btn-import"
            style="display: none;"
        >
            Importar a la base de datos
        </button>

    </div>

    <div id="preview"></div>

</div>

@endsection