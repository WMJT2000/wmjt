@extends('layouts.app')

@section('title', 'Evaluaciones')

@section('content')

<div class="evaluacion-page">

    <div class="evaluacion-header">

        <div>

            <h1>
                Evaluaciones
            </h1>

            <p>
                Crea evaluaciones y registra los resultados de cada estudiante.
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
                href="{{ route('evaluaciones.create') }}"
                class="btn-primary"
            >
                + Nueva evaluación
            </a>

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


    @if ($evaluaciones->isEmpty())

        <div class="evaluacion-empty">
            <strong>
                Todavía no hay evaluaciones.
            </strong>

            <p>
                Crea la primera evaluación para comenzar a registrar resultados.
            </p>
        </div>

    @else

        <div class="evaluacion-list">

            @foreach ($evaluaciones as $evaluacion)

                <article class="evaluacion-list-card">

                    <div class="evaluacion-list-card-header">

                        <div>

                            <h2>
                                {{ $evaluacion->nombre }}
                            </h2>

                            <p>
                                {{ $evaluacion->tipo_evaluacion }}
                            </p>

                        </div>

                        <span class="evaluacion-badge evaluacion-badge-{{ $evaluacion->estado }}">
                            {{ ucfirst($evaluacion->estado) }}
                        </span>

                    </div>


                    <div class="evaluacion-meta">

                        <span>
                            <strong>Periodo:</strong>
                            {{ $evaluacion->fecha_inicio->format('d/m/Y') }}
                            al
                            {{ $evaluacion->fecha_fin->format('d/m/Y') }}
                        </span>

                        <span>
                            <strong>Áreas:</strong>
                            {{ $evaluacion->areas_count }}
                        </span>

                        <span>
                            <strong>Evaluados:</strong>
                            {{ $evaluacion->aplicaciones_completadas_count }}
                            de
                            {{ $evaluacion->aplicaciones_count }}
                        </span>

                    </div>


                    <div class="evaluacion-actions">

                        <a
                            href="{{ route('evaluaciones.show', $evaluacion) }}"
                            class="evaluacion-btn evaluacion-btn-secondary"
                        >
                            Ver detalle
                        </a>

                        @if ($evaluacion->puedeEditarse())
                            <a
                                href="{{ route('evaluaciones.edit', $evaluacion) }}"
                                class="evaluacion-btn evaluacion-btn-secondary"
                            >
                                Editar
                            </a>
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

                </article>

            @endforeach

        </div>


        @if ($evaluaciones->hasPages())
            <div class="evaluacion-pagination">

                @if ($evaluaciones->onFirstPage())
                    <span class="evaluacion-pagination-disabled">
                        ← Anterior
                    </span>
                @else
                    <a href="{{ $evaluaciones->previousPageUrl() }}">
                        ← Anterior
                    </a>
                @endif

                <span>
                    Página {{ $evaluaciones->currentPage() }}
                    de
                    {{ $evaluaciones->lastPage() }}
                </span>

                @if ($evaluaciones->hasMorePages())
                    <a href="{{ $evaluaciones->nextPageUrl() }}">
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

</div>

@endsection
