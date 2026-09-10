@extends('layouts.app')

@section('title', 'Estudiar ' . $category->name)

@section('content')

<div class="english-container">

    <div class="english-header">

        <div>

            <h1>
                📚 {{ $category->name }}
            </h1>

            <p>
                Aprende una palabra a la vez.
            </p>

        </div>

    </div>


    @if($currentWord)

        <div class="english-study-card">


            {{-- =====================================================
                 PROGRESO
                 ===================================================== --}}

            <div class="english-study-progress">

                <span>
                    Palabra
                </span>

                <strong id="study-progress">
                    {{ $currentIndex + 1 }} / {{ $words->count() }}
                </strong>

            </div>


            {{-- =====================================================
                 CONTROL DE VELOCIDAD
                 ===================================================== --}}

            <div class="english-pronunciation-speed">

                <label for="pronunciation-speed">
                    🎚️ Velocidad de pronunciación
                </label>

                <div class="english-pronunciation-speed-control">

                    <span>
                        🐢
                    </span>

                    <input
                        type="range"
                        id="pronunciation-speed"
                        min="0.5"
                        max="1.5"
                        step="0.25"
                        value="1"
                    >

                    <span>
                        🐇
                    </span>

                </div>

                <strong id="pronunciation-speed-value">
                    1× Normal
                </strong>

            </div>


            {{-- =====================================================
                 PALABRA
                 ===================================================== --}}

            <div class="english-study-word">

                <h2 id="study-current-word">
                    {{ $currentWord->word }}
                </h2>


                {{-- =================================================
                     PRONUNCIACIÓN DE LA PALABRA
                     ================================================= --}}

                <div
                    id="study-pronunciation-guide"
                    class="english-study-pronunciation"

                    @if(!$currentWord->pronunciation_guide)
                        style="display: none;"
                    @endif
                >

                    <span>
                        Pronunciación:
                    </span>

                    <strong id="study-pronunciation-text">
                        {{ $currentWord->pronunciation_guide }}
                    </strong>

                    <button
                        type="button"
                        class="btn-pronunciation"
                        data-word="{{ $currentWord->word }}"
                        title="Escuchar pronunciación en inglés"
                    >
                        🔊
                    </button>

                </div>


                {{-- =================================================
                     SIGNIFICADOS
                     ================================================= --}}

                <div
                    id="study-meanings"
                    class="english-study-meanings"
                >

                    @foreach($currentWord->meanings as $meaning)

                        <p>
                            {{ $meaning->meaning }}
                        </p>

                    @endforeach

                </div>


                {{-- =================================================
                     EJEMPLO / ORACIÓN
                     ================================================= --}}

                <div
                    id="study-example"
                    class="english-study-example"

                    @if(!$currentWord->example)
                        style="display: none;"
                    @endif
                >

                    <div class="english-study-example-english">

                        <strong id="study-example-text">
                            {{ $currentWord->example }}
                        </strong>

                        <button
                            type="button"
                            class="btn-example-pronunciation"
                            data-example="{{ $currentWord->example }}"
                            title="Escuchar oración en inglés"
                        >
                            🔊
                        </button>

                    </div>


                    {{-- =================================================
                         TRADUCCIÓN DE LA ORACIÓN
                         ================================================= --}}

                    <span
                        id="study-example-translation"

                        @if(!$currentWord->example_translation)
                            style="display: none;"
                        @endif
                    >
                        {{ $currentWord->example_translation }}
                    </span>

                </div>

            </div>


            {{-- =====================================================
                 NAVEGACIÓN
                 ===================================================== --}}

            <div class="english-study-actions">

                <button
                    type="button"
                    id="btn-previous-word"

                    @if($currentIndex === 0)
                        style="display: none;"
                    @endif
                >
                    ← Anterior
                </button>


                <button
                    type="button"
                    id="btn-next-word"

                    @if($currentIndex >= $words->count() - 1)
                        style="display: none;"
                    @endif
                >
                    Siguiente →
                </button>


                <span
                    id="study-completed"

                    @if($currentIndex < $words->count() - 1)
                        style="display: none;"
                    @endif
                >
                    🎉 ¡Completado!
                </span>

            </div>

        </div>


    @else

        {{-- =========================================================
             SIN PALABRAS
             ========================================================= --}}

        <div class="english-empty">

            <strong>
                Esta categoría todavía no tiene palabras.
            </strong>

        </div>

    @endif


</div>


{{-- =============================================================
     DATOS PARA english-study.js
     ============================================================= --}}

<script>

    window.englishStudy = {

        words: @json($words),

        currentIndex: {{ $currentIndex }}

    };


    /*
    |--------------------------------------------------------------------------
    | VELOCIDAD DE PRONUNCIACIÓN
    |--------------------------------------------------------------------------
    */

    window.pronunciationSpeed = 1;


    const pronunciationSpeed =
        document.getElementById(
            'pronunciation-speed'
        );

    const pronunciationSpeedValue =
        document.getElementById(
            'pronunciation-speed-value'
        );


    if (
        pronunciationSpeed &&
        pronunciationSpeedValue
    ) {

        function actualizarVelocidad() {

            const velocidad =
                Number(
                    pronunciationSpeed.value
                );


            const etiquetas = {

                0.5: '0.5× Muy lento',

                0.75: '0.75× Lento',

                1: '1× Normal',

                1.25: '1.25× Rápido',

                1.5: '1.5× Muy rápido'

            };


            pronunciationSpeedValue.textContent =
                etiquetas[velocidad] ||
                `${velocidad}×`;


            window.pronunciationSpeed =
                velocidad;


            console.log(
                '🎚️ Velocidad:',
                velocidad
            );

        }


        pronunciationSpeed.addEventListener(
            'input',
            actualizarVelocidad
        );


        /*
        |--------------------------------------------------------------------------
        | VELOCIDAD INICIAL
        |--------------------------------------------------------------------------
        */

        actualizarVelocidad();

    }

</script>


@endsection