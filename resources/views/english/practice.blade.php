@extends('layouts.app')

@section('title', 'Practicar ' . $category->name)

@section('content')

<div class="english-container">

```
<div class="english-header">

    <div>

        <h1>
            🧠 Practicar {{ $category->name }}
        </h1>

        <p>
            Pon a prueba lo que has aprendido.
        </p>

    </div>

</div>


@if($words->count() > 0)

    {{-- BOTÓN DE SONIDOS --}}

    <button
        type="button"
        id="btn-toggle-practice-sounds"
        class="english-practice-sound-toggle"
        aria-pressed="false"
    >
        🔊 Sonidos
    </button>


    {{-- SELECCIÓN DEL MODO DE PRÁCTICA --}}

    <div
        id="practice-mode-selector"
        class="english-practice-mode-selector"
    >

        <div class="english-practice-mode-header">

            <h2>
                ¿Cómo quieres practicar?
            </h2>

            <p>
                Elige el tipo de ejercicio.
            </p>

        </div>


        <div class="english-practice-mode-options">

            {{-- INGLÉS → ESPAÑOL --}}

            <button
                type="button"
                class="english-practice-mode-option"
                data-practice-mode="english-spanish"
            >
                <span class="english-practice-mode-icon">
                    🇬🇧
                </span>

                <span class="english-practice-mode-content">

                    <strong>
                        Inglés → Español
                    </strong>

                    <small>
                        Mira la palabra en inglés y elige su significado.
                    </small>

                </span>

            </button>


            {{-- ESPAÑOL → INGLÉS --}}

            <button
                type="button"
                class="english-practice-mode-option"
                data-practice-mode="spanish-english"
            >
                <span class="english-practice-mode-icon">
                    🇪🇸
                </span>

                <span class="english-practice-mode-content">

                    <strong>
                        Español → Inglés
                    </strong>

                    <small>
                        Mira el significado en español y elige la palabra.
                    </small>

                </span>

            </button>


            {{-- ESCUCHAR → INGLÉS --}}

            <button
                type="button"
                class="english-practice-mode-option"
                data-practice-mode="listening"
            >
                <span class="english-practice-mode-icon">
                    🔊
                </span>

                <span class="english-practice-mode-content">

                    <strong>
                        Escuchar → Inglés
                    </strong>

                    <small>
                        Escucha la pronunciación y selecciona la palabra.
                    </small>

                </span>

            </button>


            {{-- MODO MEZCLADO --}}

            <button
                type="button"
                class="english-practice-mode-option"
                data-practice-mode="mixed"
            >
                <span class="english-practice-mode-icon">
                    🎲
                </span>

                <span class="english-practice-mode-content">

                    <strong>
                        Mezclado
                    </strong>

                    <small>
                        Combina los diferentes tipos de preguntas.
                    </small>

                </span>

            </button>

        </div>


        {{-- COMENZAR PRÁCTICA --}}

        <button
            type="button"
            id="btn-start-practice"
            class="english-practice-start-button"
            disabled
        >
            Comenzar práctica →
        </button>

    </div>


    {{-- =========================================================
         TARJETA DE LA PRÁCTICA
         ========================================================= --}}

    <div
        id="practice-card"
        class="english-practice-card"
        style="display: none;"
    >

        {{-- PROGRESO --}}

        <div class="english-practice-progress">

            <span>
                Pregunta
            </span>

            <strong id="practice-progress">
                1 / 10
            </strong>

        </div>


        {{-- PREGUNTA --}}

        <div class="english-practice-question">

            <span
                id="practice-question-type"
                class="english-practice-question-type"
            ></span>


            <h2 id="practice-question"></h2>


            {{-- CONTENEDOR DE AUDIO --}}

            <div
                id="practice-listen"
                class="english-practice-listen-container"
                style="display: none;"
            ></div>

        </div>


        {{-- OPCIONES DE RESPUESTA --}}

        <div
            id="practice-options"
            class="english-practice-options"
        ></div>


        {{-- FEEDBACK DE LA RESPUESTA --}}

        <div
            id="practice-feedback"
            class="english-practice-feedback"
            style="display: none;"
        >

            <strong id="practice-feedback-title"></strong>

            <p id="practice-feedback-text"></p>

        </div>


        {{-- ACCIONES DE LA PRÁCTICA --}}

        <div class="english-practice-actions">

            <button
                type="button"
                id="btn-toggle-auto-next"
                class="english-practice-auto-next-button"
                aria-pressed="true"
            >
                ⚡ Auto: ON
            </button>


            <button
                type="button"
                id="btn-next-practice"
                style="display: none;"
            >
                Siguiente →
            </button>

        </div>

    </div>


    {{-- =========================================================
         RESULTADO FINAL
         
         IMPORTANTE:
         ESTE BLOQUE ESTÁ FUERA DE practice-card.
         ========================================================= --}}

    <div
        id="practice-result"
        class="english-practice-result"
        style="display: none;"
    >

        <h2>
            🎉 ¡Práctica terminada!
        </h2>


        <div class="english-practice-summary">

            {{-- CATEGORÍA --}}

            <p>

                <strong>
                    Categoría:
                </strong>

                <span id="practice-result-category"></span>

            </p>


            {{-- CORRECTAS --}}

            <p>

                <strong>
                    Correctas:
                </strong>

                <span id="practice-correct-answers">
                    0
                </span>

            </p>


            {{-- INCORRECTAS --}}

            <p>

                <strong>
                    Incorrectas:
                </strong>

                <span id="practice-incorrect-answers">
                    0
                </span>

            </p>


            {{-- PUNTAJE --}}

            <p>

                <strong>
                    Puntaje:
                </strong>

                <span id="practice-score">
                    0%
                </span>

            </p>

        </div>


        {{-- MENSAJE FINAL --}}

        <p id="practice-result-message"></p>


        {{-- BOTONES DEL RESULTADO --}}

        <div class="english-practice-result-actions">

            <button
                type="button"
                id="btn-retry-practice"
                class="english-practice-retry-button"
            >
                🔄 Intentar nuevamente
            </button>


            <button
                type="button"
                id="btn-change-practice-mode"
                class="english-practice-change-mode-button"
            >
                🔄 Cambiar modo
            </button>


            <a
                href="{{ route('english.study', $category) }}"
                class="english-practice-study-link"
            >
                📚 Volver a estudiar
            </a>

        </div>

    </div>


@else

    {{-- SIN PALABRAS --}}

    <div class="english-empty">

        <strong>
            Esta categoría todavía no tiene palabras.
        </strong>

        <span>
            Agrega palabras antes de comenzar a practicar.
        </span>

    </div>

@endif
```

</div>

{{-- =========================================================
DATOS PARA JAVASCRIPT
========================================================= --}}

<script>

window.englishPractice = {

    words: @json($words),

    categoryId: {{ $category->id }},

    categoryName: @json($category->name),

    questionCount: 10,

    selectedMode: null,

    sessionId: crypto.randomUUID()

};

</script>

@endsection
