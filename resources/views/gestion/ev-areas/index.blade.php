@extends('layouts.app')

@section('title', 'Áreas de evaluación')

@section('content')

<div class="evaluacion-page">

    <div class="evaluacion-header">

        <div>

            <h1>
                Áreas de evaluación
            </h1>

            <p>
                Catálogo de áreas usadas por las actividades de evaluación.
            </p>

        </div>

        <div class="evaluacion-actions">

            <a
                href="{{ route('gestion.index') }}"
                class="evaluacion-btn evaluacion-btn-secondary"
            >
                ← Gestión
            </a>

            <a
                href="{{ route('evaluaciones.actividades.index') }}"
                class="evaluacion-btn evaluacion-btn-secondary"
            >
                Actividades
            </a>

        </div>

    </div>


    @if (session('status'))
        <div class="evaluacion-alert evaluacion-alert-success">
            {{ session('status') }}
        </div>
    @endif

    @if (isset($errors) && $errors->any())
        <div class="evaluacion-alert evaluacion-alert-error">
            <strong>Revisa el formulario:</strong>

            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif


    <section class="evaluacion-datos">

        <h2 class="evaluacion-section-title">
            {{ $editar ? 'Editar área' : 'Nueva área' }}
        </h2>

        <form
            action="{{ $editar
                ? route('ev-areas.update', $editar)
                : route('ev-areas.store') }}"
            method="POST"
            class="evaluacion-form"
        >

            @csrf

            @if ($editar)
                @method('PUT')
            @endif

            <div class="evaluacion-grid">

                <div class="evaluacion-field evaluacion-field-wide">

                    <label for="nombre-area">
                        Nombre del área
                    </label>

                    <input
                        type="text"
                        id="nombre-area"
                        name="nombre"
                        value="{{ old('nombre', $editar?->nombre) }}"
                        placeholder="Ej. Comunicación"
                        maxlength="255"
                        required
                    >

                </div>


                <div class="evaluacion-field evaluacion-field-wide">

                    <label for="descripcion-area">
                        Descripción (opcional)
                    </label>

                    <textarea
                        id="descripcion-area"
                        name="descripcion"
                        rows="3"
                        placeholder="Describe el área..."
                    >{{ old('descripcion', $editar?->descripcion) }}</textarea>

                </div>

            </div>

            <div class="evaluacion-form-actions">

                @if ($editar)
                    <a
                        href="{{ route('ev-areas.index') }}"
                        class="evaluacion-btn evaluacion-btn-secondary"
                    >
                        Cancelar edición
                    </a>
                @else
                    <div></div>
                @endif

                <button type="submit" class="btn-primary">
                    {{ $editar ? 'Guardar cambios' : 'Crear área' }}
                </button>

            </div>

        </form>

    </section>


    <section class="evaluacion-datos">

        <h2 class="evaluacion-section-title">
            Listado de áreas
        </h2>

        @if ($areas->isEmpty())

            <p class="evaluacion-muted">
                Todavía no hay áreas registradas.
            </p>

        @else

            <div class="tabla-gestion-wrapper">
                <div class="tabla-gestion-container">

                    <table class="tabla-gestion">

                        <thead>
                            <tr>
                                <th>Área</th>
                                <th>Descripción</th>
                                <th>Actividades</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            @foreach ($areas as $area)

                                <tr>
                                    <td>
                                        {{ $area->nombre }}
                                    </td>

                                    <td>
                                        {{ \Illuminate\Support\Str::limit($area->descripcion, 90) ?: '—' }}
                                    </td>

                                    <td>
                                        {{ $area->actividades_count }}
                                    </td>

                                    <td>

                                        <div class="evaluacion-table-actions">

                                            <a
                                                href="{{ route('ev-areas.index', ['editar' => $area->id]) }}"
                                                class="evaluacion-btn evaluacion-btn-secondary evaluacion-btn-small"
                                            >
                                                Editar
                                            </a>

                                            <form
                                                action="{{ route('ev-areas.destroy', $area) }}"
                                                method="POST"
                                                onsubmit="return confirm('¿Eliminar esta área?{{ $area->actividades_count > 0 ? ' Sus actividades también se eliminarán.' : '' }}');"
                                            >
                                                @csrf
                                                @method('DELETE')

                                                <button
                                                    type="submit"
                                                    class="evaluacion-btn evaluacion-btn-danger evaluacion-btn-small"
                                                >
                                                    Eliminar
                                                </button>
                                            </form>

                                        </div>

                                    </td>
                                </tr>

                            @endforeach

                        </tbody>

                    </table>

                </div>
            </div>


            @if ($areas->hasPages())
                <div class="evaluacion-pagination">

                    @if ($areas->onFirstPage())
                        <span class="evaluacion-pagination-disabled">
                            ← Anterior
                        </span>
                    @else
                        <a href="{{ $areas->previousPageUrl() }}">
                            ← Anterior
                        </a>
                    @endif

                    <span>
                        Página {{ $areas->currentPage() }}
                        de
                        {{ $areas->lastPage() }}
                    </span>

                    @if ($areas->hasMorePages())
                        <a href="{{ $areas->nextPageUrl() }}">
                            Siguiente →
                        </a>
                    @else
                        <span class="evaluacion-pagination-disabled">
                            Siguiente →
                        </span>
                    @endif

                </div>
            @endif

        @endif

    </section>

</div>

@endsection
