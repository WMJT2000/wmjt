@extends('layouts.app')

@section('content')

<div class="grammar-topic-page">


{{-- =====================================================
     MIGAS DE PAN
     ===================================================== --}}

<nav
    class="grammar-breadcrumb"
    aria-label="Migas de pan"
>

    <a
        href="{{ route('grammar.index', ['level' => $topic->level]) }}"
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


    <a
        href="{{ route('grammar.category', $topic->category->id) }}"
        class="grammar-breadcrumb-link"
    >

        {{ $topic->category->name }}

    </a>


    <span class="grammar-breadcrumb-separator">
        /
    </span>


    <span class="grammar-breadcrumb-current">

        {{ $topic->name }}

    </span>

</nav>


{{-- =====================================================
     HERO DEL TEMA
     ===================================================== --}}

<section class="grammar-topic-hero">

    <div class="grammar-topic-hero-glow grammar-topic-glow-one"></div>

    <div class="grammar-topic-hero-glow grammar-topic-glow-two"></div>


    <div class="grammar-topic-hero-content">

        <div class="grammar-topic-level">

            <span class="grammar-topic-level-dot"></span>

            NIVEL {{ $topic->level }}

        </div>


        <h1>

            {{ $topic->name }}

        </h1>


        @if($topic->description)

            <p class="grammar-topic-description">

                {{ $topic->description }}

            </p>

        @else

            <p class="grammar-topic-description">

                Aprende las reglas, estructuras y ejemplos
                esenciales de {{ $topic->name }}.

            </p>

        @endif

    </div>


    {{-- DECORACIÓN --}}

    <div class="grammar-topic-decoration">

        <div class="grammar-topic-circle circle-one"></div>

        <div class="grammar-topic-circle circle-two"></div>


        <span class="grammar-topic-floating floating-one">

            Aa

        </span>


        <span class="grammar-topic-floating floating-two">

            ✓

        </span>


        <span class="grammar-topic-floating floating-three">

            ?

        </span>

    </div>

</section>


{{-- =====================================================
     INTRODUCCIÓN AL APRENDIZAJE
     ===================================================== --}}

<section class="grammar-topic-learning">

    <div class="grammar-topic-learning-header">

        <div>

            <span class="grammar-overline">

                LO QUE APRENDERÁS

            </span>


            <h2>

                Aprende {{ $topic->name }}

            </h2>

        </div>


        <div class="grammar-learning-badge">

            <span>

                {{ str_pad(
                    $topic->lessons->count(),
                    2,
                    '0',
                    STR_PAD_LEFT
                ) }}

            </span>

            {{ $topic->lessons->count() === 1
                ? 'LECCIÓN'
                : 'LECCIONES' }}

        </div>

    </div>


    <p class="grammar-topic-learning-description">

        En estas lecciones explorarás las principales reglas,
        estructuras de oraciones y ejemplos reales en inglés
        relacionados con <strong>{{ $topic->name }}</strong>.

    </p>

</section>


{{-- =====================================================
     LECCIONES
     ===================================================== --}}

<section class="grammar-topic-lessons">

    <div class="grammar-section-header">

        <div class="grammar-section-heading">

            <div class="grammar-section-icon">

                ✦

            </div>


            <div>

                <span class="grammar-section-label">

                    LECCIONES DE GRAMÁTICA

                </span>


                <h2>

                    Aprende paso a paso

                </h2>

            </div>

        </div>


        <div class="grammar-section-meta">

            <span class="grammar-section-meta-number">

                {{ $topic->lessons->count() }}

            </span>


            <span>

                {{ $topic->lessons->count() === 1
                    ? 'lección disponible'
                    : 'lecciones disponibles' }}

            </span>

        </div>

    </div>


    @forelse($topic->lessons as $index => $lesson)

        <article class="grammar-topic-section">

            <div class="grammar-topic-section-top">

                <div class="grammar-topic-section-icon">

                    @switch($index % 4)

                        @case(0)

                            ✦

                            @break

                        @case(1)

                            ✓

                            @break

                        @case(2)

                            ≡

                            @break

                        @default

                            Aa

                    @endswitch

                </div>


                <span class="grammar-topic-section-number">

                    {{ str_pad(
                        $index + 1,
                        2,
                        '0',
                        STR_PAD_LEFT
                    ) }}

                </span>

            </div>


            <div class="grammar-topic-section-content">

                <h3>

                    {{ $lesson->title }}

                </h3>


                @if($lesson->introduction)

                    <p>

                        {{ \Illuminate\Support\Str::limit(
                            $lesson->introduction,
                            180
                        ) }}

                    </p>

                @else

                    <p>

                        Aprende esta lección de
                        {{ $topic->name }}
                        paso a paso con reglas,
                        estructuras y ejemplos.

                    </p>

                @endif

            </div>


            <div class="grammar-topic-section-action">

                <a
                    href="{{ route(
                        'grammar.lesson',
                        $lesson->id
                    ) }}"
                    class="grammar-start-button"
                >

                    <span>

                        Comenzar lección

                    </span>


                    <strong>

                        →

                    </strong>

                </a>

            </div>

        </article>

    @empty

        <div class="grammar-empty">

            <div class="grammar-empty-icon">

                ✦

            </div>


            <h3>

                No hay lecciones disponibles

            </h3>


            <p>

                Este tema todavía no tiene
                lecciones disponibles.

            </p>

        </div>

    @endforelse

</section>


{{-- =====================================================
     RESUMEN DE CONTENIDO
     ===================================================== --}}

<section class="grammar-topic-sections">


    {{-- REGLAS --}}

    <article class="grammar-topic-section grammar-section-rules">

        <div class="grammar-topic-section-top">

            <div class="grammar-topic-section-icon">

                ✓

            </div>


            <span class="grammar-topic-section-number">

                01

            </span>

        </div>


        <div class="grammar-topic-section-content">

            <h3>

                Reglas gramaticales

            </h3>


            <p>

                Comprende las reglas gramaticales esenciales
                incluidas en las lecciones de este tema.

            </p>

        </div>

    </article>


    {{-- ESTRUCTURAS --}}

    <article class="grammar-topic-section grammar-section-structures">

        <div class="grammar-topic-section-top">

            <div class="grammar-topic-section-icon">

                ≡

            </div>


            <span class="grammar-topic-section-number">

                02

            </span>

        </div>


        <div class="grammar-topic-section-content">

            <h3>

                Estructuras de oraciones

            </h3>


            <p>

                Aprende a construir oraciones afirmativas,
                negativas e interrogativas correctamente.

            </p>

        </div>

    </article>


    {{-- EJEMPLOS --}}

    <article class="grammar-topic-section grammar-section-examples">

        <div class="grammar-topic-section-top">

            <div class="grammar-topic-section-icon">

                Aa

            </div>


            <span class="grammar-topic-section-number">

                03

            </span>

        </div>


        <div class="grammar-topic-section-content">

            <h3>

                Ejemplos reales

            </h3>


            <p>

                Observa cómo se utiliza la gramática
                en oraciones naturales en inglés.

            </p>

        </div>

    </article>

</section>


{{-- =====================================================
     REGRESAR
     ===================================================== --}}

<div class="grammar-topic-back">

    <a
        href="{{ route(
            'grammar.category',
            $topic->category->id
        ) }}"
    >

        <span>

            ←

        </span>


        Volver a {{ $topic->category->name }}

    </a>

</div>


</div>

@endsection