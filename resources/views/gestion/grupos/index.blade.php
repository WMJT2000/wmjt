@extends('layouts.app')

@section('title', 'Grupos')

@section('content')

<div class="evaluacion-page">

    <div class="evaluacion-header">

        <div>

            <h1>
                Grupos
            </h1>

            <p>
                Organiza los estudiantes por grupo.
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
                href="{{ route('estudiantes.index') }}"
                class="evaluacion-btn evaluacion-btn-secondary"
            >
                Estudiantes
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
            {{ $editar ? 'Editar grupo' : 'Nuevo grupo' }}
        </h2>

        <form
            action="{{ $editar
                ? route('grupos.update', $editar)
                : route('grupos.store') }}"
            method="POST"
            class="evaluacion-form"
        >

            @csrf

            @if ($editar)
                @method('PUT')
            @endif

            <div class="evaluacion-grid">

                <div class="evaluacion-field">

                    <label for="nombre-grupo">
                        Nombre del grupo
                    </label>

                    <input
                        type="text"
                        id="nombre-grupo"
                        name="nombre"
                        value="{{ old('nombre', $editar?->nombre) }}"
                        maxlength="255"
                        required
                    >

                </div>

                <div class="evaluacion-field">

                    <input type="hidden" name="activo" value="0">

                    <label class="evaluacion-checkbox">
                        <input
                            type="checkbox"
                            name="activo"
                            value="1"
                            @checked(old('activo', $editar?->activo ?? true))
                        >

                        <span>
                            Grupo activo
                        </span>
                    </label>

                </div>

            </div>

            <div class="evaluacion-form-actions">

                @if ($editar)
                    <a
                        href="{{ route('grupos.index') }}"
                        class="evaluacion-btn evaluacion-btn-secondary"
                    >
                        Cancelar edición
                    </a>
                @else
                    <div></div>
                @endif

                <button type="submit" class="btn-primary">
                    {{ $editar ? 'Guardar cambios' : 'Crear grupo' }}
                </button>

            </div>

        </form>

    </section>


    <section class="evaluacion-datos">

        <h2 class="evaluacion-section-title">
            Listado de grupos
        </h2>

        @if ($grupos->isEmpty())

            <p class="evaluacion-muted">
                Todavía no hay grupos registrados.
            </p>

        @else

            <div class="tabla-gestion-wrapper">
                <div class="tabla-gestion-container">

                    <table class="tabla-gestion">

                        <thead>
                            <tr>
                                <th>Grupo</th>
                                <th>Estudiantes</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            @foreach ($grupos as $grupo)

                                <tr>
                                    <td>
                                        {{ $grupo->nombre }}
                                    </td>

                                    <td>
                                        {{ $grupo->estudiantes_count }}
                                    </td>

                                    <td>
                                        <span class="evaluacion-badge {{ $grupo->activo ? 'evaluacion-badge-success' : 'evaluacion-badge-muted' }}">
                                            {{ $grupo->activo ? 'Activo' : 'Inactivo' }}
                                        </span>
                                    </td>

                                    <td>

                                        <div class="evaluacion-table-actions">

                                            <a
                                                href="{{ route('grupos.index', ['editar' => $grupo->id]) }}"
                                                class="evaluacion-btn evaluacion-btn-secondary evaluacion-btn-small"
                                            >
                                                Editar
                                            </a>

                                            @if ($grupo->activo)
                                                <form
                                                    action="{{ route('grupos.destroy', $grupo) }}"
                                                    method="POST"
                                                    onsubmit="return confirm('¿Desactivar este grupo?');"
                                                >
                                                    @csrf
                                                    @method('DELETE')

                                                    <button
                                                        type="submit"
                                                        class="evaluacion-btn evaluacion-btn-danger evaluacion-btn-small"
                                                    >
                                                        Desactivar
                                                    </button>
                                                </form>
                                            @endif

                                        </div>

                                    </td>
                                </tr>

                            @endforeach

                        </tbody>

                    </table>

                </div>
            </div>


            @if ($grupos->hasPages())
                <div class="evaluacion-pagination">

                    @if ($grupos->onFirstPage())
                        <span class="evaluacion-pagination-disabled">
                            ← Anterior
                        </span>
                    @else
                        <a href="{{ $grupos->previousPageUrl() }}">
                            ← Anterior
                        </a>
                    @endif

                    <span>
                        Página {{ $grupos->currentPage() }}
                        de
                        {{ $grupos->lastPage() }}
                    </span>

                    @if ($grupos->hasMorePages())
                        <a href="{{ $grupos->nextPageUrl() }}">
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
