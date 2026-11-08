@extends('layouts.app')

@section('title', 'Puntuar evaluación')

@section('content')

@php
    $completada = $aplicacion->estado === 'completada';

    $todasPuntuadas = $evaluacion->areas
        ->flatMap(function ($area) {
            return $area->subareas;
        })
        ->every(function ($subarea) use ($resultados) {
            return filled(
                old(
                    'resultados.'.$subarea->id.'.valoracion',
                    $resultados->get($subarea->id)?->valoracion
                )
            );
        });

    $promptData = [
        'evaluacion' => $evaluacion->nombre,
        'tipo' => $evaluacion->tipo_evaluacion,
        'proyecto' => $evaluacion->proyecto,
        'docente' => $evaluacion->docente,
        'periodo' => trim(
            ($evaluacion->fecha_inicio?->format('d/m/Y') ?? '')
            .' al '.
            ($evaluacion->fecha_fin?->format('d/m/Y') ?? '')
        ),
        'estudiante' => $aplicacion->estudiante->nombre_completo,
        'grupo' => $aplicacion->estudiante->grupo?->nombre,
    ];
@endphp

<div class="evaluacion-page">

    <script type="application/json" id="evaluacionPromptData">@json($promptData)</script>

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

        <div class="evaluacion-paginas" data-evaluacion-paginas>

            @foreach ($evaluacion->areas as $area)

                <section
                    class="evaluacion-datos evaluacion-pagina"
                    data-area-pagina="{{ $loop->index }}"
                    data-area-nombre="{{ $area->nombre }}"
                >

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
                            $tieneObservacion = filled($observacionActual);
                        @endphp

                        <article
                            class="evaluacion-score-subarea"
                            data-evaluacion-subarea="{{ $subarea->id }}"
                            data-area="{{ $area->nombre }}"
                            data-subarea="{{ $subarea->nombre }}"
                        >

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
                                            @if (isset($completada) && $completada) disabled @endif
                                        >

                                        <span>
                                            {{ $texto }}
                                        </span>

                                    </label>

                                @endforeach

                            </div>

                        <div class="evaluacion-observacion">

    <button
        type="button"
        class="evaluacion-observacion-toggle"
        data-observacion-toggle
        aria-expanded="{{ $tieneObservacion ? 'true' : 'false' }}"
        @disabled($completada)
    >
        <span data-observacion-toggle-texto>
            {{ $tieneObservacion ? '− Ocultar observación' : '+ Agregar observación' }}
        </span>
    </button>

    <div
        class="evaluacion-field"
        data-observacion-contenedor
        @if (!$tieneObservacion) hidden @endif
    >
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

        </div>

        <div class="evaluacion-paginacion" data-evaluacion-paginacion hidden>

            <button
                type="button"
                class="evaluacion-btn evaluacion-btn-secondary evaluacion-btn-small"
                data-pagina-anterior
            >
                ← Anterior
            </button>

            <div
                class="evaluacion-paginacion-numeros"
                data-pagina-numeros
            ></div>

            <span
                class="evaluacion-paginacion-info"
                data-pagina-info
            ></span>

            <button
                type="button"
                class="evaluacion-btn evaluacion-btn-secondary evaluacion-btn-small"
                data-pagina-siguiente
            >
                Siguiente →
            </button>

        </div>

        <div
            class="evaluacion-import-message evaluacion-import-message-error"
            data-pagina-mensaje
            role="alert"
            hidden
        ></div>


        <section class="evaluacion-datos">

            <h2 class="evaluacion-section-title">
                {{ $completada ? 'Observaciones generales' : 'Observaciones y recomendaciones' }}
            </h2>

            <div class="evaluacion-field">

                <label for="observaciones">
                    Observaciones
                </label>

                <textarea
                    id="observaciones"
                    name="observaciones"
                    rows="4"
                    maxlength="2000"
                    placeholder="Observaciones de la evaluación"
                    @if (isset($completada) && $completada) disabled @endif
                >{{ old('observaciones', $aplicacion->observaciones) }}</textarea>

            </div>

            @unless ($completada)

                <div class="evaluacion-field">

                    <label for="recomendaciones">
                        Recomendaciones
                    </label>

                    <textarea
                        id="recomendaciones"
                        name="recomendaciones"
                        rows="4"
                        maxlength="2000"
                        placeholder="Recomendaciones para el estudiante"
                        data-recomendaciones
                        @disabled(! $todasPuntuadas)
                    >{{ old('recomendaciones', $aplicacion->recomendaciones) }}</textarea>

                    <div class="evaluacion-prompt-row">

                        <button
                            type="button"
                            class="evaluacion-btn evaluacion-btn-secondary"
                            data-generar-prompt-recomendacion
                            data-prompt-requiere-puntaje
                            @disabled(! $todasPuntuadas)
                        >
                            ✨ Generar prompt para IA
                        </button>

                    </div>

                    <small class="evaluacion-muted" data-recomendaciones-aviso @if ($todasPuntuadas) hidden @endif>
                        Solo puedes ingresar recomendaciones cuando todas las subáreas estén puntuadas.
                    </small>

                </div>

            @endunless

        </section>


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
        <section class="evaluacion-datos">

            <h2 class="evaluacion-section-title">
                Recomendaciones
            </h2>

            <form
                action="{{ route('evaluaciones.aplicaciones.recomendaciones', [$evaluacion, $aplicacion]) }}"
                method="POST"
                class="evaluacion-form"
            >

                @csrf
                @method('PUT')

                <div class="evaluacion-field">

                    <label for="recomendaciones-completada">
                        Recomendaciones para el estudiante
                    </label>

                    <textarea
                        id="recomendaciones-completada"
                        name="recomendaciones"
                        rows="4"
                        maxlength="2000"
                        placeholder="Recomendaciones para el estudiante"
                    >{{ old('recomendaciones', $aplicacion->recomendaciones) }}</textarea>

                    <div class="evaluacion-prompt-row">

                        <button
                            type="button"
                            class="evaluacion-btn evaluacion-btn-secondary"
                            data-generar-prompt-recomendacion
                        >
                            ✨ Generar prompt para IA
                        </button>

                    </div>

                </div>

                <div class="evaluacion-form-actions">

                    <div></div>

                    <button
                        type="submit"
                        class="evaluacion-btn evaluacion-btn-secondary"
                    >
                        Guardar recomendaciones
                    </button>

                </div>

            </form>

        </section>
    @endif

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


    <div
        id="recomendacionIaModal"
        class="evaluacion-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recomendacionIaTitle"
        hidden
    >

        <div class="evaluacion-modal-content">

            <div class="evaluacion-modal-header">

                <h2 id="recomendacionIaTitle">
                    Generar recomendación con IA
                </h2>

                <button
                    type="button"
                    id="btnCerrarRecomendacionIa"
                    class="evaluacion-btn-remove"
                    title="Cerrar"
                    aria-label="Cerrar"
                >
                    ×
                </button>

            </div>

            <p class="evaluacion-muted">
                Se tomará toda la información de la evaluación y las valoraciones
                del estudiante para redactar una recomendación en el estilo
                indicado.
            </p>

            <div class="evaluacion-limites-grid">

                <div class="evaluacion-field">

                    <label for="recomendacionPalabrasMin">
                        Palabras mínimas
                    </label>

                    <input
                        type="number"
                        id="recomendacionPalabrasMin"
                        value="89"
                        min="1"
                        max="2000"
                    >

                </div>

                <div class="evaluacion-field">

                    <label for="recomendacionPalabrasMax">
                        Palabras máximas
                    </label>

                    <input
                        type="number"
                        id="recomendacionPalabrasMax"
                        value="100"
                        min="1"
                        max="2000"
                    >

                </div>

            </div>

            <div
                id="recomendacionIaMessage"
                class="evaluacion-import-message"
                role="status"
                aria-live="polite"
                hidden
            ></div>

            <div
                class="evaluacion-field"
                id="recomendacionPromptContenedor"
                hidden
            >

                <label for="recomendacionPromptTexto">
                    Prompt para IA
                </label>

                <textarea
                    id="recomendacionPromptTexto"
                    rows="14"
                    readonly
                ></textarea>

                <small class="evaluacion-import-help">
                    Copia el prompt, pégalo en tu IA y usa la recomendación
                    que te devuelva.
                </small>

            </div>

            <div class="evaluacion-modal-actions">

                <button
                    type="button"
                    id="btnGenerarRecomendacionPrompt"
                    class="evaluacion-btn"
                >
                    Generar prompt
                </button>

                <button
                    type="button"
                    id="btnCopiarRecomendacionPrompt"
                    class="evaluacion-btn evaluacion-btn-secondary"
                    hidden
                >
                    Copiar prompt
                </button>

                <button
                    type="button"
                    id="btnCerrarRecomendacionIaFooter"
                    class="evaluacion-btn evaluacion-btn-secondary"
                >
                    Cerrar
                </button>

            </div>

        </div>

    </div>

</div>

@endsection
