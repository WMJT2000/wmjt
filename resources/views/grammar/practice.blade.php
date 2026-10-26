@extends('layouts.app')

@section('title', 'Practicar ' . $category->name)

@section('content')

<div class="grammar-practice-page" id="grammar-practice-app">

    <nav class="grammar-breadcrumb" aria-label="Migas de pan">
        <a
            href="{{ route('grammar.index', ['level' => $category->level]) }}"
            class="grammar-breadcrumb-link"
        >
            <span class="grammar-breadcrumb-icon">←</span>
            Gramática
        </a>

        <span class="grammar-breadcrumb-separator">/</span>

        <a
            href="{{ route('grammar.category', $category->id) }}"
            class="grammar-breadcrumb-link"
        >
            {{ $category->name }}
        </a>

        <span class="grammar-breadcrumb-separator">/</span>

        <span class="grammar-breadcrumb-current">
            Practicar
        </span>
    </nav>

    <section class="grammar-practice-hero">
        <div class="grammar-practice-hero-content">
            <div class="grammar-practice-hero-badge">
                <span class="grammar-practice-hero-dot"></span>
                PRÁCTICA DE GRAMÁTICA
            </div>

            <h1>Practica {{ $category->name }}</h1>

            <p>
                Elige cómo quieres practicar. Prepararemos hasta 10 ejercicios
                repartidos entre los {{ $topicsCount }}
                {{ $topicsCount === 1 ? 'tema' : 'temas' }}
                de esta categoría.
            </p>

            <a
                href="{{ route('grammar.category', $category->id) }}"
                class="grammar-practice-hero-back"
            >
                <span>←</span>
                Volver a los temas
            </a>
        </div>

        <div class="grammar-practice-hero-stat">
            <span class="grammar-practice-hero-stat-number">10</span>
            <span class="grammar-practice-hero-stat-label">EJERCICIOS</span>
        </div>

        <div class="grammar-practice-hero-decoration">
            <span class="grammar-practice-hero-symbol symbol-one">A</span>
            <span class="grammar-practice-hero-symbol symbol-two">✓</span>
            <span class="grammar-practice-hero-symbol symbol-three">?</span>
        </div>
    </section>

    <section
        id="practice-selector"
        class="grammar-practice-selector"
    >
        <div class="grammar-practice-selector-header">
            <div class="grammar-practice-selector-title">
                <span class="grammar-practice-selector-icon">✦</span>

                <div>
                    <span class="grammar-practice-eyebrow">
                        TIPO DE EJERCICIO
                    </span>

                    <h2>¿Cómo quieres practicar?</h2>
                </div>
            </div>

            <p>
                Selecciona un tipo de ejercicio y pulsa
                <strong>Iniciar práctica</strong>.
            </p>
        </div>

        <div class="grammar-practice-types">
            @foreach($exerciseTypes as $type => $meta)
                @php
                    $count = $counts[$type] ?? 0;
                @endphp

                <button
                    type="button"
                    class="grammar-practice-type"
                    data-practice-type="{{ $type }}"
                    aria-pressed="false"
                    @if($count === 0) disabled @endif
                >
                    <span class="grammar-practice-type-icon">
                        {{ $meta['symbol'] }}
                    </span>

                    <span class="grammar-practice-type-content">
                        <strong>{{ $meta['label'] }}</strong>
                        <small>{{ $meta['description'] }}</small>
                    </span>

                    <span class="grammar-practice-type-count">
                        {{ $count }}
                        {{ $count === 1 ? 'ejercicio' : 'ejercicios' }}
                    </span>
                </button>
            @endforeach
        </div>

        <div class="grammar-practice-start">
            <div class="grammar-practice-start-copy">
                <span class="grammar-practice-start-label">
                    PRÁCTICA GUIADA
                </span>

                <h3>Resuelve, comprueba y aprende</h3>

                <p>
                    Verás la explicación después de cada respuesta y podrás
                    cambiar de tipo de ejercicio cuando quieras.
                </p>
            </div>

            <button
                type="button"
                id="btn-start-practice"
                class="grammar-practice-start-button"
                disabled
            >
                <span>Iniciar práctica</span>
                <strong>→</strong>
            </button>
        </div>

        <p
            id="practice-selector-message"
            class="grammar-practice-selector-message"
            role="alert"
            hidden
        ></p>

        @if(array_sum($counts) === 0)
            <div class="grammar-practice-empty-note">
                Todavía no hay ejercicios disponibles para esta categoría.
                Importa ejercicios desde el panel de administración para
                comenzar a practicar.
            </div>
        @endif
    </section>

    <section
        id="practice-card"
        class="grammar-practice-card"
        hidden
    >
        <div class="grammar-practice-toolbar">
            <div class="grammar-practice-progress-copy">
                <span>Pregunta</span>
                <strong id="practice-progress">1 / 10</strong>
            </div>

            <div class="grammar-practice-toolbar-actions">
                <button
                    type="button"
                    id="btn-toggle-feedback-sounds"
                    class="grammar-practice-sound"
                    aria-pressed="false"
                >
                    Silenciar feedback
                </button>

                <a
                    href="{{ route('grammar.category', $category->id) }}"
                    class="grammar-practice-exit grammar-practice-exit-link"
                >
                    ← Volver a temas
                </a>

                <button
                    type="button"
                    id="btn-exit-practice"
                    class="grammar-practice-exit"
                >
                    ← Cambiar tipo
                </button>
            </div>
        </div>

        <div class="grammar-practice-progress-track">
            <span id="practice-progress-bar"></span>
        </div>

        <div class="grammar-practice-question">
            <div class="grammar-practice-question-meta">
                <span
                    id="practice-question-type"
                    class="grammar-practice-question-type"
                ></span>

                <span
                    id="practice-question-topic"
                    class="grammar-practice-question-topic"
                ></span>
            </div>

            <h2 id="practice-question-text"></h2>

            <p
                id="practice-question-instruction"
                class="grammar-practice-question-instruction"
            ></p>

            <div
                id="practice-exercise-body"
                class="grammar-practice-exercise-body"
            ></div>
        </div>

        <div
            id="practice-feedback"
            class="grammar-practice-feedback"
            hidden
        >
            <strong id="practice-feedback-title"></strong>
            <p id="practice-feedback-answer"></p>
            <p id="practice-feedback-explanation"></p>
        </div>

        <div class="grammar-practice-actions">
            <button
                type="button"
                id="btn-check-practice"
                class="grammar-practice-check-button"
            >
                Comprobar respuesta
            </button>

            <button
                type="button"
                id="btn-next-practice"
                class="grammar-practice-next-button"
                hidden
            >
                Siguiente pregunta →
            </button>
        </div>
    </section>

    <section
        id="practice-result"
        class="grammar-practice-result"
        hidden
    >
        <div class="grammar-practice-result-icon">✓</div>

        <span class="grammar-practice-eyebrow">PRÁCTICA COMPLETADA</span>

        <h2>¡Buen trabajo!</h2>

        <p id="practice-result-message"></p>

        <div class="grammar-practice-result-grid">
            <div>
                <span>Correctas</span>
                <strong id="practice-correct-answers">0</strong>
            </div>

            <div>
                <span>Incorrectas</span>
                <strong id="practice-incorrect-answers">0</strong>
            </div>

            <div>
                <span>Puntaje</span>
                <strong id="practice-score">0%</strong>
            </div>
        </div>

        <div class="grammar-practice-result-actions">
            <button
                type="button"
                id="btn-retry-practice"
                class="grammar-practice-retry-button"
            >
                Intentar otra vez
            </button>

            <button
                type="button"
                id="btn-change-practice-type"
                class="grammar-practice-change-button"
            >
                Cambiar tipo de ejercicio
            </button>

            <a
                href="{{ route('grammar.category', $category->id) }}"
                class="grammar-practice-back-link"
            >
                Volver a la categoría
            </a>
        </div>
    </section>

</div>

<script>
    window.grammarPracticeData = {
        startUrl: @json(route('grammar.practice.start', $category->id)),
        checkUrl: @json(route('grammar.practice.check', $category->id)),
        categoryName: @json($category->name),
        types: @json($exerciseTypes),
        counts: @json($counts)
    };
</script>

@endsection
