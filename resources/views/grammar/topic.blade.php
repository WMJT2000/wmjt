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
                01
            </span>

            LECCIÓN

        </div>

    </div>


    <p class="grammar-topic-learning-description">

        En esta lección explorarás las principales reglas,
        estructuras de oraciones y ejemplos reales en inglés
        relacionados con <strong>{{ $topic->name }}</strong>.

    </p>

</section>


{{-- =====================================================
     CONTENIDO DEL APRENDIZAJE
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
                y cómo funcionan en oraciones reales.
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
     INICIAR LECCIÓN
     ===================================================== --}}

<section class="grammar-topic-start">

    <div class="grammar-topic-start-content">

        <span class="grammar-start-label">
            ¿LISTO PARA APRENDER?
        </span>

        <h2>
            Comienza tu lección
        </h2>

        <p>
            Recorre la lección paso a paso y construye
            una comprensión clara de
            {{ $topic->name }}.
        </p>

    </div>


    <a
        href="{{ route('grammar.lesson', $topic->id) }}"
        class="grammar-start-button"
    >

        <span>
            Comenzar lección
        </span>

        <strong>
            →
        </strong>

    </a>

</section>


{{-- =====================================================
     REGRESAR
     ===================================================== --}}

<div class="grammar-topic-back">

    <a
        href="{{ route('grammar.category', $topic->category->id) }}"
    >

        <span>
            ←
        </span>

        Volver a {{ $topic->category->name }}

    </a>

</div>


</div>

@endsection
