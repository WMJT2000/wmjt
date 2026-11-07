@extends('layouts.app')

@section('title', $evaluacion->nombre)

@section('content')

<div class="evaluacion-page">

    <div class="evaluacion-header">

        <div>

            <h1>
                {{ $evaluacion->nombre }}
            </h1>

            <p>
                {{ $evaluacion->tipo_evaluacion }}
            </p>

        </div>

        <div class="evaluacion-actions">

            <a
                href="{{ route('evaluaciones.index') }}"
                class="evaluacion-btn evaluacion-btn-secondary"
            >
                ← Evaluaciones
            </a>

            @if ($evaluacion->aplicaciones->contains('estado', 'completada'))
                <form
                    action="{{ route('evaluaciones.aplicaciones.word-todas', $evaluacion) }}"
                    method="GET"
                    class="evaluacion-plantilla-form"
                >
                    <label for="plantilla-word-todas">
                        Plantilla
                    </label>

                    <select
                        id="plantilla-word-todas"
                        name="plantilla"
                    >
                        <option value="vertical">
                            Word vertical
                        </option>

                        <option value="horizontal">
                            Word horizontal
                        </option>
                    </select>

                    <button
                        type="submit"
                        class="evaluacion-btn"
                    >
                        ↓ Word (todas las evaluaciones)
                    </button>
                </form>
            @endif

            @if ($evaluacion->estado === 'activa')
                <a
                    href="{{ route('evaluaciones.aplicaciones.create', $evaluacion) }}"
                    class="btn-primary"
                >
                    Evaluar estudiante
                </a>
            @endif

        </div>

    </div>


    @if (session('status'))
        <div class="evaluacion-alert evaluacion-alert-success">
            {{ session('status') }}
        </div>
    @endif

    @if (session('error'))
        <div class="evaluacion-alert evaluacion-alert-error">
            {{ session('error') }}
        </div>
    @endif


    <section class="evaluacion-datos">

        <div class="evaluacion-detail-header">

            <h2 class="evaluacion-section-title">
                Datos generales
            </h2>

            <span class="evaluacion-badge evaluacion-badge-{{ $evaluacion->estado }}">
                {{ ucfirst($evaluacion->estado) }}
            </span>

        </div>

        <div class="evaluacion-detail-grid">

            <div>
                <span>Docente</span>
                <strong>{{ $evaluacion->docente ?: 'Sin docente' }}</strong>
            </div>

            <div>
                <span>Proyecto</span>
                <strong>{{ $evaluacion->proyecto ?: 'Sin proyecto' }}</strong>
            </div>

            <div>
                <span>Periodo</span>
                <strong>
                    {{ $evaluacion->fecha_inicio->format('d/m/Y') }}
                    al
                    {{ $evaluacion->fecha_fin->format('d/m/Y') }}
                </strong>
            </div>

            <div>
                <span>Subáreas</span>
                <strong>{{ $totalSubareas }}</strong>
            </div>

            <div>
                <span>Estudiantes evaluados</span>
                <strong>
                    {{ $evaluacion->aplicaciones->where('estado', 'completada')->count() }}
                    de
                    {{ $evaluacion->aplicaciones->count() }}
                </strong>
            </div>

        </div>

        @if ($evaluacion->estado !== 'archivada')
            <form
                action="{{ route('evaluaciones.archivar', $evaluacion) }}"
                method="POST"
                class="evaluacion-archive-form"
                onsubmit="return confirm('¿Archivar esta evaluación?');"
            >
                @csrf
                @method('PATCH')

                <button
                    type="submit"
                    class="evaluacion-btn evaluacion-btn-danger"
                >
                    Archivar evaluación
                </button>
            </form>
        @endif

    </section>


    <section class="evaluacion-datos">

        <h2 class="evaluacion-section-title">
            Áreas y subáreas
        </h2>

        <div class="evaluacion-area-list">

            @foreach ($evaluacion->areas as $area)

                <article class="evaluacion-detail-card">

                    <h3>
                        {{ $area->nombre }}
                    </h3>

                    <ul class="evaluacion-subarea-list">

                        @forelse ($area->subareas as $subarea)
                            <li>
                                {{ $subarea->nombre }}
                            </li>
                        @empty
                            <li class="evaluacion-muted">
                                Sin subáreas
                            </li>
                        @endforelse

                    </ul>

                </article>

            @endforeach

        </div>

    </section>


    <section class="evaluacion-datos">

        <div class="evaluacion-detail-header">

            <h2 class="evaluacion-section-title">
                Estudiantes evaluados
            </h2>

            @if ($evaluacion->estado === 'activa')
                <a
                    href="{{ route('evaluaciones.aplicaciones.create', $evaluacion) }}"
                    class="evaluacion-btn evaluacion-btn-secondary"
                >
                    + Evaluar estudiante
                </a>
            @endif

        </div>

        @if ($evaluacion->aplicaciones->isEmpty())

            <p class="evaluacion-muted">
                Todavía no hay estudiantes evaluados en esta evaluación.
            </p>

        @else

            <div class="tabla-gestion-wrapper">
                <div class="tabla-gestion-container">

                    <table class="tabla-gestion">

                        <thead>
                            <tr>
                                <th>Estudiante</th>
                                <th>Grupo</th>
                                <th>Estado</th>
                                <th>Avance</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            @foreach ($evaluacion->aplicaciones->sortBy(fn ($aplicacion) => $aplicacion->estudiante->apellidos) as $aplicacion)

                                <tr>
                                    <td>
                                        {{ $aplicacion->estudiante->nombre_completo }}
                                    </td>

                                    <td>
                                        {{ $aplicacion->estudiante->grupo?->nombre ?? 'Sin grupo' }}
                                    </td>

                                    <td>
                                        <span class="evaluacion-badge evaluacion-badge-{{ $aplicacion->estado }}">
                                            {{ str_replace('_', ' ', ucfirst($aplicacion->estado)) }}
                                        </span>
                                    </td>

                                    <td>
                                        {{ $aplicacion->resultados->count() }}
                                        de
                                        {{ $totalSubareas }}
                                    </td>

                                    <td>

                                        <div class="evaluacion-table-actions">

                                            <a
                                                href="{{ route('evaluaciones.aplicaciones.edit', [$evaluacion, $aplicacion]) }}"
                                                class="evaluacion-btn evaluacion-btn-secondary evaluacion-btn-small"
                                            >
                                                {{ $aplicacion->estado === 'completada' ? 'Ver' : 'Puntuar' }}
                                            </a>

                                            @if ($aplicacion->estado === 'completada')
                                                <a
                                                    href="{{ route('evaluaciones.aplicaciones.word', [$evaluacion, $aplicacion]) }}"
                                                    class="evaluacion-btn evaluacion-btn-small"
                                                >
                                                    Word
                                                </a>

                                                <a
                                                    href="{{ route('evaluaciones.aplicaciones.word', [$evaluacion, $aplicacion, 'plantilla' => 'horizontal']) }}"
                                                    class="evaluacion-btn evaluacion-btn-secondary evaluacion-btn-small"
                                                >
                                                    Word H
                                                </a>
                                            @endif

                                        </div>

                                    </td>
                                </tr>

                            @endforeach

                        </tbody>

                    </table>

                </div>
            </div>

        @endif

    </section>

</div>

@endsection
