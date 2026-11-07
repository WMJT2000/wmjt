@extends('layouts.app')

@section('title', 'Evaluar estudiante')

@section('content')

<div class="evaluacion-page">

    <div class="evaluacion-header">

        <div>

            <h1>
                Evaluar estudiante
            </h1>

            <p>
                {{ $evaluacion->nombre }}
                ·
                {{ $evaluacion->tipo_evaluacion }}
            </p>

        </div>

        <div class="evaluacion-actions">

            <a
                href="{{ route('evaluaciones.show', $evaluacion) }}"
                class="evaluacion-btn evaluacion-btn-secondary"
            >
                ← Volver al detalle
            </a>

        </div>

    </div>


    @if (session('error'))
        <div class="evaluacion-alert evaluacion-alert-error">
            {{ session('error') }}
        </div>
    @endif


    <section class="evaluacion-datos">

        <div class="evaluacion-detail-header">

            <div>

                <h2 class="evaluacion-section-title">
                    Selecciona un estudiante
                </h2>

                <p class="evaluacion-muted">
                    Se usará el grupo registrado para el estudiante.
                </p>

            </div>

        </div>


        @if ($estudiantes->isEmpty())

            <div class="evaluacion-empty">

                <strong>
                    No hay estudiantes disponibles.
                </strong>

                <p>
                    Registra estudiantes para poder evaluarlos.
                </p>

                <a
                    href="{{ route('estudiantes.index') }}"
                    class="btn-primary"
                >
                    Ir a estudiantes
                </a>

            </div>

        @else

            <div class="evaluacion-student-list">

                @foreach ($estudiantes as $estudiante)

                    @php
                        $aplicacion = $aplicaciones->get($estudiante->id);
                    @endphp

                    <article class="evaluacion-student-card">

                        <div>

                            <h3>
                                {{ $estudiante->nombre_completo }}
                            </h3>

                            <p>
                                {{ $estudiante->grupo?->nombre ?? 'Sin grupo' }}

                                @if ($estudiante->codigo)
                                    · Código: {{ $estudiante->codigo }}
                                @endif
                            </p>

                            @if ($aplicacion)
                                <span class="evaluacion-badge evaluacion-badge-{{ $aplicacion->estado }}">
                                    {{ str_replace('_', ' ', ucfirst($aplicacion->estado)) }}
                                </span>
                            @endif

                        </div>

                        <form
                            action="{{ route('evaluaciones.aplicaciones.store', $evaluacion) }}"
                            method="POST"
                        >
                            @csrf

                            <input
                                type="hidden"
                                name="estudiante_id"
                                value="{{ $estudiante->id }}"
                            >

                            <button
                                type="submit"
                                class="{{ $aplicacion ? 'evaluacion-btn evaluacion-btn-secondary' : 'btn-primary' }}"
                            >
                                @if ($aplicacion?->estado === 'completada')
                                    Ver evaluación
                                @elseif ($aplicacion)
                                    Continuar
                                @else
                                    Comenzar evaluación
                                @endif
                            </button>

                        </form>

                    </article>

                @endforeach

            </div>

        @endif

    </section>

</div>

@endsection
