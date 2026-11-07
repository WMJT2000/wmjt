@extends('layouts.app')

@section('title', 'Puntuar evaluación')

@section('content')

@php
    $completada = $aplicacion->estado === 'completada';
@endphp

<div class="evaluacion-page">

    <div class="evaluacion-header">

        <div>

            <h1>
                {{ $evaluacion->nombre }}
            </h1>

            <p>
                {{ $aplicacion->estudiante->nombre_completo }}
                ·
                {{ $aplicacion->estudiante->grupo?->nombre ?? 'Sin grupo' }}
            </p>

        </div>

        <div class="evaluacion-actions">

            <a
                href="{{ route('evaluaciones.show', $evaluacion) }}"
                class="evaluacion-btn evaluacion-btn-secondary"
            >
                ← Volver al detalle
            </a>

            <span class="evaluacion-badge evaluacion-badge-{{ $aplicacion->estado }}">
                {{ str_replace('_', ' ', ucfirst($aplicacion->estado)) }}
            </span>

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


    <form
        action="{{ route('evaluaciones.aplicaciones.update', [$evaluacion, $aplicacion]) }}"
        method="POST"
        class="evaluacion-form"
    >

        @csrf
        @method('PUT')

        <section class="evaluacion-datos">

            <h2 class="evaluacion-section-title">
                Observaciones generales
            </h2>

            <div class="evaluacion-field">

                <textarea
                    name="observaciones"
                    rows="4"
                    maxlength="2000"
                    placeholder="Observaciones de la evaluación"
                    @disabled($completada)
                >{{ old('observaciones', $aplicacion->observaciones) }}</textarea>

            </div>

        </section>


        @foreach ($evaluacion->areas as $area)

            <section class="evaluacion-datos">

                <h2 class="evaluacion-section-title">
                    {{ $area->nombre }}
                </h2>

                <div class="evaluacion-score-list">

                    @forelse ($area->subareas as $subarea)

                        @php
                            $resultado = $resultados->get($subarea->id);
                            $valorActual = old(
                                'resultados.'.$subarea->id.'.valoracion',
                                $resultado?->valoracion
                            );
                            $observacionActual = old(
                                'resultados.'.$subarea->id.'.observacion',
                                $resultado?->observacion
                            );
                        @endphp

                        <article class="evaluacion-score-subarea">

                            <div class="evaluacion-score-header">

                                <h3>
                                    {{ $subarea->nombre }}
                                </h3>

                                @if ($valorActual)
                                    <span class="evaluacion-valoracion-texto">
                                        {{ str_replace('_', ' ', ucfirst($valorActual)) }}
                                    </span>
                                @endif

                            </div>

                            <div
                                class="evaluacion-valoracion"
                                role="radiogroup"
                                aria-label="Valoración de {{ $subarea->nombre }}"
                            >

                                @foreach ([
                                    'excelente' => 'Excelente',
                                    'en_proceso' => 'En proceso',
                                    'debilitado' => 'Debilitado',
                                    'nulo' => 'Nulo',
                                ] as $valor => $texto)

                                    <label class="evaluacion-valoracion-opcion">

                                        <input
                                            type="radio"
                                            name="resultados[{{ $subarea->id }}][valoracion]"
                                            value="{{ $valor }}"
                                            @checked($valorActual === $valor)
                                            @disabled($completada)
                                        >

                                        <span>
                                            {{ $texto }}
                                        </span>

                                    </label>

                                @endforeach

                            </div>

                            <div class="evaluacion-field">

                                <label for="observacion-{{ $subarea->id }}">
                                    Observación
                                </label>

                                <input
                                    type="text"
                                    id="observacion-{{ $subarea->id }}"
                                    name="resultados[{{ $subarea->id }}][observacion]"
                                    value="{{ $observacionActual }}"
                                    maxlength="255"
                                    placeholder="Opcional"
                                    @disabled($completada)
                                >

                            </div>

                        </article>

                    @empty

                        <p class="evaluacion-muted">
                            Esta área no tiene subáreas.
                        </p>

                    @endforelse

                </div>

            </section>

        @endforeach


        <div class="evaluacion-form-actions">

            @if ($completada)

                <div></div>

            @else

                <button
                    type="submit"
                    name="accion"
                    value="borrador"
                    class="evaluacion-btn evaluacion-btn-secondary"
                >
                    Guardar borrador
                </button>

                <button
                    type="submit"
                    name="accion"
                    value="finalizar"
                    class="btn-generate"
                    onclick="return confirm('¿Finalizar la evaluación? Después no podrás modificarla.');"
                >
                    ✓ Finalizar evaluación
                </button>

            @endif

        </div>

    </form>

    @if ($completada)
        <div class="evaluacion-form-actions">

            <form
                action="{{ route('evaluaciones.aplicaciones.word', [$evaluacion, $aplicacion]) }}"
                method="GET"
                class="evaluacion-plantilla-form"
            >
                <label for="plantilla-word">
                    Plantilla
                </label>

                <select
                    id="plantilla-word"
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
                    class="btn-generate"
                >
                    ↓ Descargar Word
                </button>
            </form>

        </div>
    @endif

</div>

@endsection
