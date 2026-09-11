@extends('layouts.app')

@section('title', 'Dominio - ' . $category->name)

@section('content')

<div class="english-mastery-page">

    {{-- CABECERA --}}

    <div class="english-mastery-page-header">

        <div>

            <h1>
                🎯 Dominio de palabras
            </h1>

            <p>
                {{ $category->name }}
            </p>

        </div>

        <div>

            <a
                href="{{ route('english.index') }}"
                class="english-mastery-back-button"
            >
                ← Volver a Inglés
            </a>

        </div>

  </div>

{{-- ACCIONES DE PRÁCTICA --}}

<div class="english-mastery-practice-actions">

    <a
        href="{{ route('english.practice', [
            'category' => $category,
            'focus' => 'not_started'
        ]) }}"
        class="english-mastery-practice-button english-mastery-practice-button-new"
    >
        <span>⚪</span>
        <span>
            <strong>Practicar palabras nuevas</strong>
            <small>Palabras sin practicar</small>
        </span>
    </a>

    <a
        href="{{ route('english.practice', [
            'category' => $category,
            'focus' => 'learning'
        ]) }}"
        class="english-mastery-practice-button english-mastery-practice-button-learning"
    >
        <span>🟡</span>
        <span>
            <strong>Practicar palabras en aprendizaje</strong>
            <small>Palabras que todavía estás aprendiendo</small>
        </span>
    </a>

    <a
        href="{{ route('english.practice', [
            'category' => $category,
            'focus' => 'needs_practice'
        ]) }}"
        class="english-mastery-practice-button english-mastery-practice-button-needs"
    >
        <span>🔴</span>
        <span>
            <strong>Practicar palabras difíciles</strong>
            <small>Palabras que necesitan más práctica</small>
        </span>
    </a>

</div>

{{-- LISTA DE PALABRAS --}}

<div class="english-mastery-word-list">

        @forelse($wordMastery as $item)

            <div class="english-mastery-word-card">

                {{-- PALABRA --}}

                <div class="english-mastery-word-main">

                    <div class="english-mastery-word-icon">
                        {{ $item['icon'] }}
                    </div>

                    <div class="english-mastery-word-info">

                        <strong>
                            {{ $item['word']->word }}
                        </strong>

                        <span>
                            {{ $item['label'] }}
                        </span>

                    </div>

                </div>


                {{-- PORCENTAJE --}}

                <div class="english-mastery-word-score">

                    <strong>
                        {{ $item['accuracy'] }}%
                    </strong>

                    <span>
                        {{ $item['correct'] }}/{{ $item['total'] }}
                        correctas
                    </span>

                </div>


                {{-- BARRA --}}

                <div class="english-mastery-word-progress">

                    <div
                        class="english-mastery-word-progress-fill"
                        style="width: {{ $item['accuracy'] }}%;"
                    ></div>

                </div>

            </div>

        @empty

            <div class="english-mastery-empty">

                <strong>
                    No hay palabras en esta categoría.
                </strong>

                <span>
                    Primero debes añadir palabras a esta categoría.
                </span>

            </div>

        @endforelse

    </div>

</div>

@endsection