@extends('layouts.app')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/english-import.css') }}">
@endpush

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="card english-import-card">
                <div class="card-header">
                    <h4 class="mb-0">Importar vocabulario de inglés</h4>
                </div>

                <div class="card-body">

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label
                                    for="englishImportCategorySelect"
                                    class="form-label"
                                >
                                    Categoría
                                </label>

                                <select
                                    id="englishImportCategorySelect"
                                    class="form-select"
                                >
                                    <option value="">
                                        Seleccione una categoría
                                    </option>

                                    @foreach($categories as $category)
                                        <option value="{{ $category->id }}">
                                            {{ $category->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label
                                    for="englishImportType"
                                    class="form-label"
                                >
                                    Tipo de importación
                                </label>

                                <select
                                    id="englishImportType"
                                    class="form-select"
                                >
                                    <option value="">
                                        Seleccione un tipo
                                    </option>

                                    <option value="complete">
                                        Importación completa
                                    </option>

                                    <option value="words">
                                        Varias palabras
                                    </option>

                                    <option value="word">
                                        Una palabra
                                    </option>

                                    <option value="meanings">
                                        Significados
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div
                        id="englishImportParentGroup"
                        class="mb-3"
                        style="display: none;"
                    >
                        <label
                            id="englishImportParentLabel"
                            for="englishImportParentSelect"
                            class="form-label"
                        >
                            Seleccione
                        </label>

                        <select
                            id="englishImportParentSelect"
                            class="form-select"
                        >
                            <option value="">
                                Seleccione una opción
                            </option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label
                            for="englishImportJsonFile"
                            class="form-label"
                        >
                            Archivo JSON
                        </label>

                        <input
                            type="file"
                            id="englishImportJsonFile"
                            class="form-control"
                            accept=".json,application/json"
                            disabled
                        >

                        <div class="form-text">
                            Seleccione un archivo JSON con la estructura correspondiente
                            al tipo de importación.
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button
                            type="button"
                            id="englishImportValidateBtn"
                            class="btn btn-primary"
                            disabled
                        >
                            Validar JSON
                        </button>

                        <button
                            type="button"
                            id="englishImportImportBtn"
                            class="btn btn-success"
                            style="display: none;"
                        >
                            Importar
                        </button>
                    </div>

                    <div
                        id="englishImportPreview"
                        class="mt-4"
                        style="display: none;"
                    ></div>

                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
    <script>
        window.englishImportConfig = {
            routes: {
                importComplete: "{{ route('admin.english.import') }}",
                getWords: "{{ url('/admin/english/categories') }}",
                importWords: "{{ url('/admin/english/categories') }}",
                importWord: "{{ url('/admin/english/categories') }}",
                importMeanings: "{{ url('/admin/english/words') }}"
            }
        };
    </script>

@endpush
