@extends('layouts.app')

@section('title', 'Actividades de áreas')

@section('content')

<div class="evaluacion-page">

    <div class="evaluacion-header">

        <div>

            <h1>
                Actividades de áreas
            </h1>

            <p>
                Registra las actividades de cada área de tus evaluaciones.
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
                href="{{ route('ev-areas.index') }}"
                class="evaluacion-btn evaluacion-btn-secondary"
            >
                Administrar áreas
            </a>

            <a
                href="{{ route('evaluaciones.index') }}"
                class="evaluacion-btn evaluacion-btn-secondary"
            >
                Evaluaciones
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


    @if ($areas->isEmpty())

        <div class="evaluacion-alert evaluacion-alert-warning">
            Todavía no hay áreas disponibles. Créalas en
            <a href="{{ route('ev-areas.index') }}">Áreas de evaluación</a>
            antes de registrar actividades.
        </div>

    @else

        <section class="evaluacion-datos">

            <h2 class="evaluacion-section-title">
                {{ $editar ? 'Editar actividad' : 'Nueva actividad' }}
            </h2>

            <form
                action="{{ $editar
                    ? route('evaluaciones.actividades.update', $editar)
                    : route('evaluaciones.actividades.store') }}"
                method="POST"
                class="evaluacion-form"
            >

                @csrf

                @if ($editar)
                    @method('PUT')
                @endif

                <div class="evaluacion-grid">

                    <div class="evaluacion-field evaluacion-field-wide">

                        <label for="ev_area_id">
                            Área
                        </label>

                        <select
                            id="ev_area_id"
                            name="ev_area_id"
                            required
                        >
                            <option value="">
                                Selecciona un área
                            </option>

                            @foreach ($areas as $area)
                                <option
                                    value="{{ $area->id }}"
                                    @selected(old('ev_area_id', $editar?->ev_area_id) == $area->id)
                                >
                                    {{ $area->nombre }}
                                </option>
                            @endforeach
                        </select>

                    </div>


                    <div class="evaluacion-field evaluacion-field-wide">

                        <label for="titulo">
                            Título
                        </label>

                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            value="{{ old('titulo', $editar?->titulo) }}"
                            placeholder="Ej. Presentación de la unidad"
                            maxlength="255"
                            required
                        >

                    </div>


                    <div class="evaluacion-field evaluacion-field-wide">

                        <label for="descripcion">
                            Descripción
                        </label>

                        <textarea
                            id="descripcion"
                            name="descripcion"
                            rows="3"
                            placeholder="Describe la actividad..."
                        >{{ old('descripcion', $editar?->descripcion) }}</textarea>

                    </div>


                    <div class="evaluacion-field">

                        <label for="fecha">
                            Fecha
                        </label>

                        <input
                            type="date"
                            id="fecha"
                            name="fecha"
                            value="{{ old('fecha', $editar?->fecha?->format('Y-m-d')) }}"
                        >

                    </div>

                </div>

                <div class="evaluacion-form-actions">

                    @if ($editar)
                        <a
                            href="{{ route('evaluaciones.actividades.index') }}"
                            class="evaluacion-btn evaluacion-btn-secondary"
                        >
                            Cancelar edición
                        </a>
                    @else
                        <div></div>
                    @endif

                    <button type="submit" class="btn-primary">
                        {{ $editar ? 'Guardar cambios' : 'Crear actividad' }}
                    </button>

                </div>

            </form>

        </section>

    @endif


    <section class="evaluacion-datos">

        <h2 class="evaluacion-section-title">
            Listado de actividades
        </h2>

        <form
            method="GET"
            action="{{ route('evaluaciones.actividades.index') }}"
            class="evaluacion-form"
        >

            <div class="evaluacion-grid">

                <div class="evaluacion-field evaluacion-field-wide">

                    <label for="filtro-area">
                        Filtrar por área
                    </label>

                    <select id="filtro-area" name="area">
                        <option value="">
                            Todas las áreas
                        </option>

                        @foreach ($areas as $area)
                            <option
                                value="{{ $area->id }}"
                                @selected(request()->input('area') == $area->id)
                            >
                                {{ $area->nombre }}
                            </option>
                        @endforeach
                    </select>

                </div>

            </div>

            <div class="evaluacion-form-actions">

                <button
                    type="submit"
                    class="evaluacion-btn evaluacion-btn-secondary"
                >
                    Filtrar
                </button>

                @if (request()->filled('area'))
                    <a
                        href="{{ route('evaluaciones.actividades.index') }}"
                        class="evaluacion-btn evaluacion-btn-secondary"
                    >
                        Quitar filtro
                    </a>
                @endif

            </div>

        </form>


        @if ($actividades->isEmpty())

            <p class="evaluacion-muted">
                Todavía no hay actividades registradas.
            </p>

        @else

            <div class="tabla-gestion-wrapper">
                <div class="tabla-gestion-container">

                    <table class="tabla-gestion">

                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Descripción</th>
                                <th>Área</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            @foreach ($actividades as $actividad)

                                <tr>
                                    <td>
                                        {{ $actividad->titulo }}
                                    </td>

                                    <td>
                                        {{ \Illuminate\Support\Str::limit($actividad->descripcion, 90) ?: '—' }}
                                    </td>

                                    <td>
                                        {{ $actividad->evArea?->nombre }}
                                    </td>

                                    <td>
                                        {{ $actividad->fecha?->format('d/m/Y') ?? '—' }}
                                    </td>

                                    <td>

                                        <div class="evaluacion-table-actions">

                                            <a
                                                href="{{ route('evaluaciones.actividades.index', ['editar' => $actividad->id]) }}"
                                                class="evaluacion-btn evaluacion-btn-secondary evaluacion-btn-small"
                                            >
                                                Editar
                                            </a>

                                            <form
                                                action="{{ route('evaluaciones.actividades.destroy', $actividad) }}"
                                                method="POST"
                                                onsubmit="return confirm('¿Eliminar esta actividad?');"
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


            @if ($actividades->hasPages())
                <div class="evaluacion-pagination">

                    @if ($actividades->onFirstPage())
                        <span class="evaluacion-pagination-disabled">
                            ← Anterior
                        </span>
                    @else
                        <a href="{{ $actividades->previousPageUrl() }}">
                            ← Anterior
                        </a>
                    @endif

                    <span>
                        Página {{ $actividades->currentPage() }}
                        de
                        {{ $actividades->lastPage() }}
                    </span>

                    @if ($actividades->hasMorePages())
                        <a href="{{ $actividades->nextPageUrl() }}">
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
