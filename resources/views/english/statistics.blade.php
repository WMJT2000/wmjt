@extends('layouts.app')

@section('content')

<div class="english-statistics-page">


{{-- ======================================================================
     CABECERA
======================================================================= --}}

<div class="english-statistics-header">

    <h1>
        📊 Mis estadísticas
    </h1>

    <p>
        Consulta tu progreso y rendimiento en inglés.
    </p>

</div>


{{-- ======================================================================
     ESTADÍSTICAS GENERALES
======================================================================= --}}

<div class="english-statistics-grid">

    {{-- PREGUNTAS RESPONDIDAS --}}
    <div class="english-statistics-card">

        <span class="english-statistics-card-icon">
            📝
        </span>

        <div>

            <span class="english-statistics-card-label">
                Preguntas respondidas
            </span>

            <strong>
                {{ $totalQuestions }}
            </strong>

        </div>

    </div>


    {{-- RESPUESTAS CORRECTAS --}}
    <div class="english-statistics-card">

        <span class="english-statistics-card-icon">
            ✅
        </span>

        <div>

            <span class="english-statistics-card-label">
                Respuestas correctas
            </span>

            <strong>
                {{ $correctAnswers }}
            </strong>

        </div>

    </div>


    {{-- RESPUESTAS INCORRECTAS --}}
    <div class="english-statistics-card">

        <span class="english-statistics-card-icon">
            ❌
        </span>

        <div>

            <span class="english-statistics-card-label">
                Respuestas incorrectas
            </span>

            <strong>
                {{ $incorrectAnswers }}
            </strong>

        </div>

    </div>


    {{-- PRECISIÓN --}}
    <div class="english-statistics-card">

        <span class="english-statistics-card-icon">
            🎯
        </span>

        <div>

            <span class="english-statistics-card-label">
                Precisión
            </span>

            <strong>
                {{ $accuracy }}%
            </strong>

        </div>

    </div>


    {{-- PRÁCTICAS COMPLETADAS --}}
    <div class="english-statistics-card">

        <span class="english-statistics-card-icon">
            🧠
        </span>

        <div>

            <span class="english-statistics-card-label">
                Prácticas completadas
            </span>

            <strong>
                {{ $totalPractices }}
            </strong>

        </div>

    </div>


    {{-- MEJOR PUNTUACIÓN --}}
    <div class="english-statistics-card">

        <span class="english-statistics-card-icon">
            🏆
        </span>

        <div>

            <span class="english-statistics-card-label">
                Mejor puntuación
            </span>

            <strong>
                {{ $bestScore }}%
            </strong>

        </div>

    </div>


    {{-- PALABRAS INCORRECTAS --}}
    <div class="english-statistics-card">

        <span class="english-statistics-card-icon">
            🔄
        </span>

        <div>

            <span class="english-statistics-card-label">
                Palabras incorrectas
            </span>

            <strong>
                {{ $incorrectWords }}
            </strong>

        </div>

    </div>

</div>


{{-- ======================================================================
     RACHA DE ESTUDIO
======================================================================= --}}

<div class="english-streak-section">

    {{-- RACHA ACTUAL --}}
    <div class="english-streak-card">

        <div class="english-streak-icon">
            🔥
        </div>

        <div class="english-streak-content">

            <span>
                Racha actual
            </span>

            <strong>
                {{ $currentStreak }}
                {{ $currentStreak === 1 ? 'día' : 'días' }}
            </strong>

            <small>
                Sigue practicando para mantener tu racha.
            </small>

        </div>

    </div>


    {{-- MEJOR RACHA --}}
    <div class="english-streak-card">

        <div class="english-streak-icon">
            🏆
        </div>

        <div class="english-streak-content">

            <span>
                Mejor racha
            </span>

            <strong>
                {{ $bestStreak }}
                {{ $bestStreak === 1 ? 'día' : 'días' }}
            </strong>

            <small>
                Tu récord personal de estudio.
            </small>

        </div>

    </div>


    {{-- DÍAS ESTUDIADOS --}}
    <div class="english-streak-card">

        <div class="english-streak-icon">
            📅
        </div>

        <div class="english-streak-content">

            <span>
                Días estudiados
            </span>

            <strong>
                {{ $totalStudyDays }}
            </strong>

            <small>
                Días diferentes en los que has practicado.
            </small>

        </div>

    </div>

</div>


{{-- ======================================================================
     ESTADÍSTICAS POR CATEGORÍA
======================================================================= --}}

<div class="english-statistics-section">

    <div class="english-statistics-section-header">

        <h2>
            📚 Rendimiento por categoría
        </h2>

    </div>


    @if($categoryStatistics->isEmpty())

        {{-- SIN ESTADÍSTICAS --}}
        <div class="english-statistics-empty">

            <p>
                Todavía no tienes estadísticas.
            </p>

            <a
                href="{{ route('english.index') }}"
                class="english-statistics-button"
            >
                Empezar a practicar
            </a>

        </div>

    @else

        {{-- LISTA DE CATEGORÍAS --}}
        <div class="english-statistics-categories">

            @foreach($categoryStatistics as $stat)

                <div class="english-statistics-category">

                    {{-- PARTE SUPERIOR --}}
                    <div class="english-statistics-category-top">

                        <div>

                            <strong>
                                {{ $stat['category']->name }}
                            </strong>

                            <span>
                                {{ $stat['total'] }}
                                {{ $stat['total'] === 1 ? 'pregunta' : 'preguntas' }}
                            </span>

                        </div>

                        <strong>
                            {{ $stat['accuracy'] }}%
                        </strong>

                    </div>


                    {{-- BARRA DE PROGRESO --}}
                    <div class="english-statistics-progress">

                        <div
                            class="english-statistics-progress-fill"
                            style="width: {{ $stat['accuracy'] }}%;"
                        ></div>

                    </div>


                    {{-- PARTE INFERIOR --}}
                    <div class="english-statistics-category-bottom">

                        <span>
                            ✅ {{ $stat['correct'] }} correctas
                        </span>

                        <span>
                            ❌ {{ $stat['incorrect'] }} incorrectas
                        </span>

                    </div>

                </div>

            @endforeach

        </div>

    @endif

</div>


</div>

@endsection
