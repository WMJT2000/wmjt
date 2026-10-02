@extends('layouts.app')

@section('content')

<div class="grammar-page">


{{-- =====================================================
     MIGAS DE PAN
     ===================================================== --}}

<nav
    class="grammar-breadcrumb"
    aria-label="Navegación de ubicación"
>

    <a
        href="{{ route('grammar.index', ['level' => $category->level]) }}"
        class="grammar-breadcrumb-link"
    >

        <span class="grammar-breadcrumb-icon">
            ←
        </span>

        Gramática

    </a>


    <span class="grammar-breadcrumb-separator">
        /
    </span>


    <span class="grammar-breadcrumb-current">

        {{ $category->name }}

    </span>

</nav>


{{-- =====================================================
     HERO DE CATEGORÍA
     ===================================================== --}}

<section class="grammar-category-hero">

    <div class="grammar-category-hero-content">


        <div class="grammar-category-badge">

            <span class="grammar-category-badge-dot"></span>

            {{ $category->level }}

        </div>


        <h1>

            {{ $category->name }}

        </h1>


        @if($category->description)

            <p>

                {{ $category->description }}

            </p>

        @else

            <p>

                Explora los temas de gramática
                de esta categoría y apréndelos
                paso a paso.

            </p>

        @endif

    </div>


    <div class="grammar-category-hero-stat">

        <span class="grammar-category-stat-number">

            {{ $topics->count() }}

        </span>


        <span class="grammar-category-stat-label">

            {{ $topics->count() === 1 ? 'TEMA' : 'TEMAS' }}

        </span>

    </div>


    <div class="grammar-category-hero-decoration">

        <span class="grammar-hero-symbol symbol-one">

            Aa

        </span>


        <span class="grammar-hero-symbol symbol-two">

            ?

        </span>


        <span class="grammar-hero-symbol symbol-three">

            ✓

        </span>

    </div>

</section>


{{-- =====================================================
     ENCABEZADO DE TEMAS
     ===================================================== --}}

<section class="grammar-section-header">


    <div class="grammar-section-heading">


        <div class="grammar-section-icon">

            ✦

        </div>


        <div>


            <span class="grammar-section-label">

                TEMAS DE GRAMÁTICA

            </span>


            <h2>

                Comienza a aprender

            </h2>

        </div>

    </div>


    <div class="grammar-section-meta">


        <span class="grammar-section-meta-number">

            {{ $topics->count() }}

        </span>


        <span>

            {{ $topics->count() === 1
                ? 'tema disponible'
                : 'temas disponibles' }}

        </span>

    </div>

</section>


{{-- =====================================================
     TEMAS
     ===================================================== --}}

<main class="grammar-topics">


    @forelse($topics as $index => $topic)


        <a
            href="{{ route('grammar.topic', $topic->id) }}"
            class="grammar-topic-card"
        >


            {{-- ACENTO DE LA TARJETA --}}

            <div class="grammar-topic-accent"></div>


            {{-- NÚMERO --}}

            <div class="grammar-topic-number">

                <span>

                    {{ str_pad(
                        $index + 1,
                        2,
                        '0',
                        STR_PAD_LEFT
                    ) }}

                </span>

            </div>


            {{-- ICONO --}}

            <div class="grammar-topic-icon">


                @switch($index % 6)


                    @case(0)

                        Aa

                        @break


                    @case(1)

                        ✎

                        @break


                    @case(2)

                        ◈

                        @break


                    @case(3)

                        ∿

                        @break


                    @case(4)

                        ?

                        @break


                    @default

                        ✓


                @endswitch

            </div>


            {{-- CONTENIDO --}}

            <div class="grammar-topic-content">


                <div class="grammar-topic-title-row">


                    <h3>

                        {{ $topic->name }}

                    </h3>


                    <span class="grammar-topic-level">

                        {{ $topic->level }}

                    </span>

                </div>


                @if($topic->description)


                    <p>

                        {{ $topic->description }}

                    </p>


                @else


                    <p class="grammar-topic-no-description">

                        Aprende las reglas esenciales
                        y el uso de {{ $topic->name }}.

                    </p>


                @endif

            </div>


            {{-- ACCIÓN --}}

            <div class="grammar-topic-action">


                <span>

                    {{ $topic->lessons_count }}

                    {{ $topic->lessons_count === 1
                        ? 'lección'
                        : 'lecciones' }}

                </span>


                <span class="grammar-topic-arrow">

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

                No se encontraron temas

            </h3>


            <p>

                Esta categoría todavía no tiene
                temas disponibles.

            </p>

        </div>


    @endforelse

</main>


{{-- =====================================================
     NAVEGACIÓN INFERIOR
     ===================================================== --}}

<div class="grammar-bottom-navigation">


    <a
        href="{{ route('grammar.index', ['level' => $category->level]) }}"
        class="grammar-back-link"
    >


        <span>

            ←

        </span>


        Volver a Gramática {{ $category->level }}


    </a>

</div>


</div>

@endsection