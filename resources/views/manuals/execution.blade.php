@extends('layouts.app')

@section('title', 'Ejecutar manual')

@section('content')

    <div class="gestion-container">

        {{-- HEADER --}}
        <div class="gestion-header">

            <div>

                <h1>
                    {{ $manual->title }}
                </h1>

                <p>
                    Ejecución del manual

                    @if($manual->technology)
                        · {{ $manual->technology->name }}
                    @endif
                </p>

            </div>

            <a href="{{ route('manuals.index') }}" class="btn-primary">
                ← Volver a manuales
            </a>

        </div>


        {{-- INFORMACIÓN DEL MANUAL --}}
        <div class="gestion-info">

            @if($manual->description)

                <p>
                    {{ $manual->description }}
                </p>

            @endif

            @if($manual->objective)

                <h3>
                    Objetivo
                </h3>

                <p>
                    {{ $manual->objective }}
                </p>

            @endif

        </div>


        {{-- PROGRESO --}}
        <div class="manual-progress-card">

            <div class="manual-progress-header">

                <strong>
                    Progreso
                </strong>

                <span id="progressText">
                    0%
                </span>

            </div>

            <div class="manual-progress-bar">

                <div id="progressBar" class="manual-progress-fill" style="width: 0%;"></div>

            </div>

        </div>


        {{-- RESUMEN DE MANUAL COMPLETADO --}}
        <div id="manualCompletedSummary" class="manual-completed-summary" style="display: none;">

            <div class="manual-completed-icon">
                🎉
            </div>

            <div class="manual-completed-content">

                <span class="manual-completed-label">
                    Manual completado
                </span>

                <h2>
                    ¡Excelente trabajo!
                </h2>

                <p>
                    Has completado todos los pasos de
                    <strong>{{ $manual->title }}</strong>.
                </p>

                <div class="manual-completed-stats">

                    <div class="manual-completed-stat">

                        <strong id="completedSummarySteps">
                            0
                        </strong>

                        <span>
                            pasos completados
                        </span>

                    </div>


                    <div class="manual-completed-stat">

                        <strong id="completedSummaryPercentage">
                            100%
                        </strong>

                        <span>
                            progreso
                        </span>

                    </div>

                </div>


                <div class="manual-completed-actions">

                    <button type="button" id="btnRestartManual" class="btn-primary">
                        ↻ Volver a realizar
                    </button>

                    <a href="{{ route('manuals.my') }}" class="btn-secondary">
                        Ver mis manuales
                    </a>

                    <a href="{{ route('manuals.my') }}" class="btn-secondary">
                        ← Mis manuales
                    </a>

                </div>
            </div>

        </div>



        {{-- EJECUCIÓN --}}
        <div id="manualExecutionContainer" data-manual-id="{{ $manual->id }}">

            @php
                $globalStepNumber = 0;

                $totalSteps = $manual->sections->sum(
                    fn($section) => $section->steps->count()
                );
            @endphp


            @if($totalSteps > 0)

                <div class="manual-execution-layout">


                    {{-- ===================================================== --}}
                    {{-- NAVEGACIÓN DE PASOS --}}
                    {{-- ===================================================== --}}

                    <aside class="manual-steps-navigation">

                        <div class="manual-steps-navigation-header">

                            <strong>
                                Pasos
                            </strong>

                            <span id="stepCounter">
                                0 / {{ $totalSteps }}
                            </span>

                        </div>


                        <div class="manual-steps-list">

                            @foreach($manual->sections as $section)

                                @foreach($section->steps as $step)

                                    @php
                                        $globalStepNumber++;
                                    @endphp

                                    <button type="button" class="manual-step-nav-item" data-step-id="{{ $step->id }}"
                                        data-step-index="{{ $globalStepNumber - 1 }}">

                                        <span class="manual-step-nav-status">
                                            ○
                                        </span>

                                        <span class="manual-step-nav-number">
                                            {{ $globalStepNumber }}
                                        </span>

                                        <span class="manual-step-nav-title">
                                            {{ $step->title }}
                                        </span>

                                    </button>

                                @endforeach

                            @endforeach

                        </div>

                    </aside>


                    {{-- ===================================================== --}}
                    {{-- CONTENIDO DEL PASO ACTUAL --}}
                    {{-- ===================================================== --}}

                    <main class="manual-current-step-container">


                        @php
                            $globalStepNumber = 0;
                        @endphp


                        @foreach($manual->sections as $section)

                            @foreach($section->steps as $step)

                                @php
                                    $globalStepNumber++;
                                @endphp


                                <article class="manual-execution-step" data-step-id="{{ $step->id }}"
                                    data-step-index="{{ $globalStepNumber - 1 }}" data-section-id="{{ $section->id }}">

                                    {{-- CABECERA DEL PASO --}}

                                    <div class="manual-current-step-header">

                                        <div>

                                            <span class="manual-current-step-label">
                                                Paso {{ $globalStepNumber }} de {{ $totalSteps }}
                                            </span>

                                            <h2>
                                                {{ $step->title }}
                                            </h2>

                                        </div>

                                        <div class="manual-current-step-section">

                                            {{ $section->title }}

                                        </div>

                                    </div>


                                    {{-- DESCRIPCIÓN --}}

                                    @if($step->description)

                                        <div class="manual-step-description">

                                            <p>
                                                {{ $step->description }}
                                            </p>

                                        </div>

                                    @endif


                                    {{-- INSTRUCCIONES --}}

                                    @if($step->instructions)

                                        <div class="manual-step-block">

                                            <strong>
                                                Instrucciones
                                            </strong>

                                            <p>
                                                {{ $step->instructions }}
                                            </p>

                                        </div>

                                    @endif


                                    {{-- COMANDO --}}

                                    @if($step->command)

                                        <div class="manual-step-block">

                                            <strong>
                                                Comando
                                            </strong>

                                            <pre><code>{{ $step->command }}</code></pre>

                                        </div>

                                    @endif


                                    {{-- CÓDIGO --}}

                                    @if($step->code)

                                        <div class="manual-step-block">

                                            <strong>
                                                Código
                                            </strong>

                                            <pre><code>{{ $step->code }}</code></pre>

                                        </div>

                                    @endif


                                    {{-- RESULTADO ESPERADO --}}

                                    @if($step->expected_result)

                                        <div class="manual-step-block">

                                            <strong>
                                                Resultado esperado
                                            </strong>

                                            <p>
                                                {{ $step->expected_result }}
                                            </p>

                                        </div>

                                    @endif


                                    {{-- NOTAS DEL MANUAL --}}

                                    @if($step->notes)

                                        <div class="manual-step-block">

                                            <strong>
                                                Notas
                                            </strong>

                                            <p>
                                                {{ $step->notes }}
                                            </p>

                                        </div>

                                    @endif


                                    {{-- ===================================================== --}}
                                    {{-- NOTAS PERSONALES DEL USUARIO --}}
                                    {{-- ===================================================== --}}

                                    <div class="manual-step-block manual-user-notes-block">

                                        <div class="manual-step-block-title">

                                            <span class="manual-step-block-icon">
                                                📝
                                            </span>

                                            <strong>
                                                Mis notas
                                            </strong>

                                        </div>


                                        <textarea class="manual-step-user-notes" data-step-id="{{ $step->id }}"
                                            placeholder="Escribe aquí tus notas, observaciones, comandos realizados o problemas encontrados..."></textarea>


                                        <div class="manual-step-notes-actions">

                                            <button type="button" class="btn-save-step-note" data-step-id="{{ $step->id }}">
                                                Guardar nota
                                            </button>

                                            <span class="manual-step-note-status"></span>

                                        </div>

                                    </div>


                                    {{-- ACCIÓN DEL PASO --}}

                                    <div class="manual-step-actions">

                                        <button type="button" class="btn-primary btn-complete-step" data-step-id="{{ $step->id }}">
                                            ✓ Completar paso
                                        </button>

                                    </div>


                                    {{-- NAVEGACIÓN --}}

                                    <div class="manual-step-navigation-buttons">

                                        <button type="button" class="btn-secondary btn-previous-step">
                                            ← Anterior
                                        </button>


                                        <button type="button" class="btn-secondary btn-next-step">
                                            Siguiente →
                                        </button>

                                    </div>


                                </article>

                            @endforeach

                        @endforeach

                    </main>

                </div>

            @else

                <div class="gestion-info">

                    <h2>
                        Este manual todavía no tiene contenido.
                    </h2>

                    <p>
                        Agrega secciones y pasos antes de ejecutarlo.
                    </p>

                </div>

            @endif

        </div>

    </div>

@endsection


@push('scripts')

    @vite('resources/js/manual-execution.js')

@endpush