@extends('layouts.app')

@section('content')

<div class="grammar-page">

    {{-- =====================================================
         HERO
         ===================================================== --}}

    <section class="grammar-hero">

        <div class="grammar-hero-glow grammar-hero-glow-one"></div>
        <div class="grammar-hero-glow grammar-hero-glow-two"></div>

        <div class="grammar-hero-content">

            <div class="grammar-hero-badge">

                <span class="grammar-hero-badge-dot"></span>

                GRAMÁTICA DE INGLÉS

            </div>

            <h1>

                Domina la

                <span>Gramática.</span>

            </h1>

            <p>

                Aprende gramática paso a paso,
                desde los conceptos básicos
                hasta las estructuras avanzadas.

            </p>

        </div>


        <div class="grammar-hero-decoration">

            <div class="grammar-hero-orbit grammar-orbit-one"></div>

            <div class="grammar-hero-orbit grammar-orbit-two"></div>


            <span class="grammar-floating-word word-one">

                Gramática

            </span>


            <span class="grammar-floating-word word-two">

                Aprende

            </span>


            <span class="grammar-floating-word word-three">

                Practica

            </span>

        </div>

    </section>


    {{-- =====================================================
         SELECTOR DE NIVEL
         ===================================================== --}}

    <section class="grammar-level-section">

        <div class="grammar-level-header">

            <div>

                <span class="grammar-overline">

                    ELIGE TU NIVEL

                </span>

                <h2>

                    ¿Dónde quieres comenzar?

                </h2>

            </div>


            <div class="grammar-level-info">

                <span class="grammar-level-info-number">

                    {{ $categories->count() }}

                </span>

                <span>

                    {{ $categories->count() === 1 ? 'categoría' : 'categorías' }}

                </span>

            </div>

        </div>


        <nav
            class="grammar-levels"
            aria-label="Niveles de inglés"
        >

            @foreach(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as $itemLevel)

                <a
                    href="{{ route('grammar.index', ['level' => $itemLevel]) }}"
                    class="grammar-level
                    {{ $level === $itemLevel ? 'active' : '' }}"
                    aria-current="{{ $level === $itemLevel ? 'page' : 'false' }}"
                >

                    <span class="grammar-level-code">

                        {{ $itemLevel }}

                    </span>


                    <span class="grammar-level-name">

                        @switch($itemLevel)

                            @case('A1')

                                Principiante

                                @break

                            @case('A2')

                                Elemental

                                @break

                            @case('B1')

                                Intermedio

                                @break

                            @case('B2')

                                Intermedio alto

                                @break

                            @case('C1')

                                Avanzado

                                @break

                            @case('C2')

                                Dominio avanzado

                                @break

                        @endswitch

                    </span>


                    @if($level === $itemLevel)

                        <span class="grammar-level-check">

                            ✓

                        </span>

                    @endif

                </a>

            @endforeach

        </nav>

    </section>


    {{-- =====================================================
         ENCABEZADO DE CATEGORÍAS
         ===================================================== --}}

    <section class="grammar-content-header">

        <div class="grammar-content-heading">

            <div class="grammar-content-icon">

                ✦

            </div>


            <div>

                <span class="grammar-overline">

                    NIVEL ACTUAL

                </span>

                <h2>

                    Gramática {{ $level }}

                </h2>

            </div>

        </div>


        <div class="grammar-content-summary">

            <span class="grammar-summary-number">

                {{ $categories->count() }}

            </span>


            <span>

                {{ $categories->count() === 1
                    ? 'categoría de aprendizaje'
                    : 'categorías de aprendizaje' }}

            </span>

        </div>

    </section>


    {{-- =====================================================
         CATEGORÍAS
         ===================================================== --}}

    <main class="grammar-categories">

        @forelse($categories as $category)

            <a
                href="{{ route('grammar.category', $category->id) }}"
                class="grammar-category-card"
            >

                <div class="grammar-card-shine"></div>


                {{-- TOP --}}

                <div class="grammar-category-top">

                    <div class="grammar-category-number">

                        {{ str_pad(
                            $loop->iteration,
                            2,
                            '0',
                            STR_PAD_LEFT
                        ) }}

                    </div>


                    <div class="grammar-category-level">

                        {{ $category->level }}

                    </div>

                </div>


                {{-- ICONO --}}

                <div class="grammar-category-icon">

                    @switch($loop->iteration % 6)

                        @case(1)

                            Aa

                            @break

                        @case(2)

                            ✎

                            @break

                        @case(3)

                            ◈

                            @break

                        @case(4)

                            ✦

                            @break

                        @case(5)

                            ∿

                            @break

                        @default

                            ✓

                    @endswitch

                </div>


                {{-- CONTENIDO --}}

                <div class="grammar-category-content">

                    <h3>

                        {{ $category->name }}

                    </h3>


                    @if($category->description)

                        <p>

                            {{ $category->description }}

                        </p>

                    @else

                        <p class="grammar-no-description">

                            Explora esta categoría de gramática
                            y aprende sus conceptos principales.

                        </p>

                    @endif

                </div>


                {{-- FOOTER --}}

                <div class="grammar-category-footer">

                    <div class="grammar-topic-count">

                        <span class="grammar-topic-count-icon">

                            ●

                        </span>


                        <span>

                            <strong>

                                {{ $category->topics_count }}

                            </strong>


                            {{ $category->topics_count === 1
                                ? 'tema'
                                : 'temas' }}

                        </span>

                    </div>


                    <span
                        class="grammar-arrow"
                        aria-hidden="true"
                    >

                        →

                    </span>

                </div>

            </a>

        @empty

            <div class="grammar-empty">

                <div class="grammar-empty-icon">

                    ✦

                </div>


                <h3>

                    Aún no hay categorías de gramática

                </h3>


                <p>

                    No hay categorías disponibles
                    para este nivel.

                </p>

            </div>

        @endforelse

    </main>

</div>

@endsection