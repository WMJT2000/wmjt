@extends('layouts.app')

@section('title', 'Estudiantes')

@section('content')

<div class="evaluacion-page">

    <div class="evaluacion-header">

        <div>

            <h1>
                Estudiantes
            </h1>

            <p>
                Registra y administra los estudiantes que serán evaluados.
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
                href="{{ route('grupos.index') }}"
                class="evaluacion-btn evaluacion-btn-secondary"
            >
                Grupos
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
            {{ $editar ? 'Editar estudiante' : 'Nuevo estudiante' }}
        </h2>

        <form
            action="{{ $editar
                ? route('estudiantes.update', $editar)
                : route('estudiantes.store') }}"
            method="POST"
            class="evaluacion-form"
        >

            @csrf

            @if ($editar)
                @method('PUT')
            @endif

            <div class="evaluacion-grid">

                <div class="evaluacion-field">

                    <label for="nombres">
                        Nombres
                    </label>

                    <input
                        type="text"
                        id="nombres"
                        name="nombres"
                        value="{{ old('nombres', $editar?->nombres) }}"
                        maxlength="255"
                        required
                    >

                </div>

                <div class="evaluacion-field">

                    <label for="apellidos">
                        Apellidos
                    </label>

                    <input
                        type="text"
                        id="apellidos"
                        name="apellidos"
                        value="{{ old('apellidos', $editar?->apellidos) }}"
                        maxlength="255"
                        required
                    >

                </div>

                <div class="evaluacion-field">

                    <label for="codigo">
                        Código
                    </label>

                    <input
                        type="text"
                        id="codigo"
                        name="codigo"
                        value="{{ old('codigo', $editar?->codigo) }}"
                        maxlength="50"
                        placeholder="Opcional"
                    >

                </div>

                <div class="evaluacion-field">

                    <label for="grupo_id">
                        Grupo
                    </label>

                    <select id="grupo_id" name="grupo_id">

                        <option value="">
                            Sin grupo
                        </option>

                        @foreach ($grupos as $grupo)
                            <option
                                value="{{ $grupo->id }}"
                                @selected((string) old('grupo_id', $editar?->grupo_id) === (string) $grupo->id)
                            >
                                {{ $grupo->nombre }}
                                @if (! $grupo->activo)
                                    (inactivo)
                                @endif
                            </option>
                        @endforeach

                    </select>

                </div>

                <div class="evaluacion-field evaluacion-field-wide">

                    <input type="hidden" name="activo" value="0">

                    <label class="evaluacion-checkbox">
                        <input
                            type="checkbox"
                            name="activo"
                            value="1"
                            @checked(old('activo', $editar?->activo ?? true))
                        >

                        <span>
                            Estudiante activo
                        </span>
                    </label>

                </div>

            </div>

            <div class="evaluacion-form-actions">

                @if ($editar)
                    <a
                        href="{{ route('estudiantes.index') }}"
                        class="evaluacion-btn evaluacion-btn-secondary"
                    >
                        Cancelar edición
                    </a>
                @else
                    <div></div>
                @endif

                <button type="submit" class="btn-primary">
                    {{ $editar ? 'Guardar cambios' : 'Crear estudiante' }}
                </button>

            </div>

        </form>

    </section>


    <section class="evaluacion-datos">

        <h2 class="evaluacion-section-title">
            Listado de estudiantes
        </h2>

        <form method="GET" action="{{ route('estudiantes.index') }}" class="evaluacion-filters">

            <div class="evaluacion-field">

                <label for="buscar">
                    Buscar
                </label>

                <input
                    type="text"
                    id="buscar"
                    name="buscar"
                    value="{{ $buscar }}"
                    placeholder="Nombre, apellido o código"
                >

            </div>

            <div class="evaluacion-field">

                <label for="filtro-grupo">
                    Grupo
                </label>

                <select id="filtro-grupo" name="grupo_id">

                    <option value="">
                        Todos
                    </option>

                    @foreach ($grupos as $grupo)
                        <option
                            value="{{ $grupo->id }}"
                            @selected((string) request('grupo_id') === (string) $grupo->id)
                        >
                            {{ $grupo->nombre }}
                        </option>
                    @endforeach

                </select>

            </div>

            <div class="evaluacion-filters-actions">

                <button type="submit" class="btn-primary">
                    Filtrar
                </button>

                <a
                    href="{{ route('estudiantes.index') }}"
                    class="evaluacion-btn evaluacion-btn-secondary"
                >
                    Limpiar
                </a>

            </div>

        </form>


        @if ($estudiantes->isEmpty())

            <p class="evaluacion-muted">
                No hay estudiantes registrados con esos filtros.
            </p>

        @else

            <div class="tabla-gestion-wrapper">
                <div class="tabla-gestion-container">

                    <table class="tabla-gestion">

                        <thead>
                            <tr>
                                <th>Estudiante</th>
                                <th>Código</th>
                                <th>Grupo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            @foreach ($estudiantes as $estudiante)

                                <tr>
                                    <td>
                                        {{ $estudiante->nombre_completo }}
                                    </td>

                                    <td>
                                        {{ $estudiante->codigo ?: '—' }}
                                    </td>

                                    <td>
                                        {{ $estudiante->grupo?->nombre ?? 'Sin grupo' }}
                                    </td>

                                    <td>
                                        <span class="evaluacion-badge {{ $estudiante->activo ? 'evaluacion-badge-success' : 'evaluacion-badge-muted' }}">
                                            {{ $estudiante->activo ? 'Activo' : 'Inactivo' }}
                                        </span>
                                    </td>

                                    <td>

                                        <div class="evaluacion-table-actions">

                                            <a
                                                href="{{ route('estudiantes.index', ['editar' => $estudiante->id]) }}"
                                                class="evaluacion-btn evaluacion-btn-secondary evaluacion-btn-small"
                                            >
                                                Editar
                                            </a>

                                            <form
                                                action="{{ route('estudiantes.destroy', $estudiante) }}"
                                                method="POST"
                                                onsubmit="return confirm('¿Eliminar este estudiante?');"
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


            @if ($estudiantes->hasPages())
                <div class="evaluacion-pagination">

                    @if ($estudiantes->onFirstPage())
                        <span class="evaluacion-pagination-disabled">
                            ← Anterior
                        </span>
                    @else
                        <a href="{{ $estudiantes->previousPageUrl() }}">
                            ← Anterior
                        </a>
                    @endif

                    <span>
                        Página {{ $estudiantes->currentPage() }}
                        de
                        {{ $estudiantes->lastPage() }}
                    </span>

                    @if ($estudiantes->hasMorePages())
                        <a href="{{ $estudiantes->nextPageUrl() }}">
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
