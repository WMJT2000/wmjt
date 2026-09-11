@extends('layouts.app')

@section('title', 'Inglés')

@section('content')

    <div class="english-container">


        {{-- =====================================================
     CABECERA
     ===================================================== --}}

        <div class="english-header">

            <div>

                <h1>
                    🇬🇧 Inglés
                </h1>

                <p>
                    Aprende vocabulario en inglés.
                </p>

            </div>


            {{-- ACCESO A ESTADÍSTICAS --}}

            <div class="english-header-actions">

                <a href="{{ route('english.statistics') }}" class="english-statistics-button">
                    📊 Mis estadísticas
                </a>

            </div>

        </div>


        {{-- =====================================================
     CATEGORÍAS
     ===================================================== --}}

        <div class="english-section">

            <div class="english-section-header">

                <div>

                    <h2>
                        Categorías
                    </h2>

                    <p>
                        Selecciona una categoría para comenzar a aprender.
                    </p>

                </div>

            </div>


            <div class="english-categories-grid">

                @forelse($categories as $category)
                    <div class="english-category-card">

                        <div class="english-category-icon">
                            📚
                        </div>

                        <h3>
                            {{ $category->name }}
                        </h3>

                        @if ($category->description)
                            <p>
                                {{ $category->description }}
                            </p>
                        @endif

                        <span>
                            {{ $category->words_count }}
                            {{ $category->words_count === 1 ? 'palabra' : 'palabras' }}
                        </span>


                        <a href="{{ route('english.study', $category) }}">
                            📚 Estudiar
                        </a>


                        <a href="{{ route('english.practice', $category) }}">
                            🧠 Practicar
                        </a>

                        <a href="{{ route('english.mastery', $category) }}">
                            🎯 Ver dominio
                        </a>

                    </div>

                @empty

                    <div class="english-empty">

                        <strong>
                            No hay categorías disponibles.
                        </strong>

                        <span>
                            Primero debes crear categorías desde Gestión → Inglés.
                        </span>

                    </div>
                @endforelse

            </div>

        </div>


        {{-- =====================================================
     MI PROGRESO EN INGLÉS
     ===================================================== --}}

        <div class="english-progress-section">

            <div class="english-section-header">

                <div>

                    <h2>
                        📊 Mi progreso en inglés
                    </h2>

                    <p>
                        Mira cómo estás avanzando en cada categoría.
                    </p>

                </div>

            </div>


            <div class="english-progress-list">

                @forelse($progressByCategory as $progress)
                    @php

                        $category = $progress['category'];

                        $percentage = $progress['percentage'];

                    @endphp


                    <div class="english-progress-item">

                        <div class="english-progress-top">

                            <strong>
                                {{ $category->name }}
                            </strong>

                            <span>
                                {{ $percentage }}%
                            </span>

                        </div>


                        <div class="english-progress-bar">

                            <div class="english-progress-fill" style="width: {{ $percentage }}%;"></div>

                        </div>

                    </div>

                @empty

                    <p class="english-progress-empty">
                        Todavía no tienes progreso registrado.
                    </p>
                @endforelse

            </div>

        </div>

        <div class="english-mastery-section">

            <div class="english-section-header">

                <div>
                    <h2>🎯 Dominio de palabras</h2>

                    <p>
                        Mira qué palabras dominas y cuáles necesitan más práctica.
                    </p>
                </div>

            </div>

            <div class="english-mastery-categories">

                @foreach ($categories as $category)
                    @php

                        $mastery = $wordMasteryByCategory[$category->id] ?? [];

                        $totalWords = count($mastery);

                        $masteredWords = collect($mastery)->where('level', 'mastered')->count();

                        $learningWords = collect($mastery)->where('level', 'learning')->count();

                        $needsPracticeWords = collect($mastery)->where('level', 'needs_practice')->count();

                        $masteryPercentage = $totalWords > 0 ? (int) round(($masteredWords / $totalWords) * 100) : 0;
                    @endphp

                    <div class="english-mastery-category">

                        <div class="english-mastery-category-top">

                            <div>

                                <strong>
                                    {{ $category->name }}
                                </strong>

                                <span>
                                    {{ $masteredWords }}/{{ $totalWords }}
                                    palabras dominadas
                                </span>

                            </div>

                            <strong>
                                {{ $masteryPercentage }}%
                            </strong>

                        </div>

                        <div class="english-mastery-progress">

                            <div class="english-mastery-progress-fill" style="width: {{ $masteryPercentage }}%;"></div>

                        </div>

                        <div class="english-mastery-summary">

                            <span>
                                🟢 {{ $masteredWords }} dominadas
                            </span>

                            <span>
                                🟡 {{ $learningWords }} aprendiendo
                            </span>

                            <span>
                                🔴 {{ $needsPracticeWords }} por practicar
                            </span>

                        </div>

                    </div>
                @endforeach

            </div>

        </div>



        {{-- =====================================================
     ÚLTIMAS PRÁCTICAS
     ===================================================== --}}

        <div class="english-latest-practices-section">

            <div class="english-section-header">

                <div>

                    <h2>
                        📝 Últimas prácticas
                    </h2>

                    <p>
                        Revisa tus resultados más recientes.
                    </p>

                </div>

            </div>


            @if ($latestPractices->count() > 0)

                <div class="english-practice-history">

                    <div class="english-practice-history-header">

                        <span>
                            Fecha
                        </span>

                        <span>
                            Categoría
                        </span>

                        <span>
                            Resultado
                        </span>

                    </div>


                    @foreach ($latestPractices as $practice)
                        <div class="english-practice-history-row">

                            <span>
                                {{ $practice->completed_at->format('d/m/Y') }}
                            </span>


                            <span>
                                {{ $practice->category->name ?? 'Sin categoría' }}
                            </span>


                            <span class="english-practice-history-score">

                                {{ $practice->correct_answers }}/{{ $practice->total_questions }}

                                <small>
                                    ({{ $practice->score }}%)
                                </small>

                            </span>

                        </div>
                    @endforeach

                </div>
            @else
                <div class="english-history-empty">

                    <strong>
                        Todavía no tienes prácticas.
                    </strong>

                    <span>
                        Completa una práctica para comenzar tu historial.
                    </span>

                </div>

            @endif

        </div>


    </div>

@endsection
