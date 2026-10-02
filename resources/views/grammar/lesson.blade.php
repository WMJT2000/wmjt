@extends('layouts.app')

@section('content')

@php

    /*
    |--------------------------------------------------------------------------
    | FORMATEADOR DE TEXTO
    |--------------------------------------------------------------------------
    |
    | El carácter "|" representa siempre un salto de línea.
    |
    */

    $formatGrammarText = function ($text) {

        if ($text === null || $text === '') {
            return '';
        }

        /*
        | Convertimos cualquier salto de línea normal
        | en el mismo separador "|".
        */
        $text = str_replace(
            ["\r\n", "\r", "\n"],
            '|',
            $text
        );

        /*
        | Dividimos el contenido por "|".
        */
        $parts = explode('|', $text);

        /*
        | Eliminamos espacios innecesarios.
        */
        $parts = array_map(
            'trim',
            $parts
        );

        /*
        | Eliminamos únicamente líneas vacías.
        */
        $parts = array_filter(
            $parts,
            function ($part) {
                return $part !== '';
            }
        );

        /*
        | Generamos un bloque HTML por cada línea.
        | e() protege el contenido contra HTML no deseado.
        */
        $html = '';

        foreach ($parts as $part) {

            $html .= '<div class="grammar-content-line">';
            $html .= e($part);
            $html .= '</div>';

        }

        return $html;
    };

@endphp


<div class="grammar-lesson-page">


{{-- =====================================================
     ENCABEZADO
     ===================================================== --}}

<header class="grammar-lesson-header">

    {{-- MIGAS DE PAN --}}

    <nav
        class="grammar-lesson-breadcrumb"
        aria-label="Navegación de ubicación"
    >

        <a
            href="{{ route(
                'grammar.index',
                ['level' => $lesson->topic->category->level]
            ) }}"
        >
            Gramática
        </a>

        <span>›</span>

        <a
            href="{{ route(
                'grammar.category',
                $lesson->topic->category->id
            ) }}"
        >
            {{ $lesson->topic->category->name }}
        </a>

        <span>›</span>

        <a
            href="{{ route(
                'grammar.topic',
                $lesson->topic->id
            ) }}"
        >
            {{ $lesson->topic->name }}
        </a>

        <span>›</span>

        <span class="grammar-breadcrumb-current">

            Lección

        </span>

    </nav>


    {{-- CONTENIDO DEL ENCABEZADO --}}

    <div class="grammar-lesson-heading">

        <div class="grammar-lesson-heading-content">

            <div class="grammar-lesson-level">

                <span></span>

                NIVEL {{ $lesson->topic->level }}

            </div>


            <h1>

                {{ $lesson->title }}

            </h1>


            <p>

                {{ $lesson->topic->name }}

            </p>

        </div>


        <div class="grammar-lesson-heading-mark">

            <span>

                Aa

            </span>

        </div>

    </div>

</header>


{{-- =====================================================
     ESTRUCTURA PRINCIPAL
     ===================================================== --}}

<div class="grammar-lesson-layout">


    {{-- =================================================
         BARRA LATERAL
         ================================================= --}}

    <aside class="grammar-lesson-sidebar">

        <div class="grammar-lesson-sidebar-inner">


            <div class="grammar-lesson-sidebar-header">

                <span>

                    CONTENIDO DE LA LECCIÓN

                </span>

            </div>


            @php

                $sectionNumber = 1;

            @endphp


            {{-- INTRODUCCIÓN --}}

            <button
                type="button"
                class="grammar-lesson-nav active"
                data-section="introduction"
            >

                <span class="grammar-nav-number">

                    {{ str_pad(
                        $sectionNumber++,
                        2,
                        '0',
                        STR_PAD_LEFT
                    ) }}

                </span>


                <span class="grammar-nav-icon">

                    ✦

                </span>


                <span class="grammar-nav-label">

                    Introducción

                </span>

            </button>


            {{-- USOS --}}

            @if($lesson->uses)

                <button
                    type="button"
                    class="grammar-lesson-nav"
                    data-section="uses"
                >

                    <span class="grammar-nav-number">

                        {{ str_pad(
                            $sectionNumber++,
                            2,
                            '0',
                            STR_PAD_LEFT
                        ) }}

                    </span>


                    <span class="grammar-nav-icon">

                        ?

                    </span>


                    <span class="grammar-nav-label">

                        Usos

                    </span>

                </button>

            @endif


            {{-- ESTRUCTURA --}}

            @if(
                $lesson->affirmative_structure ||
                $lesson->negative_structure ||
                $lesson->question_structure ||
                $lesson->short_answers
            )

                <button
                    type="button"
                    class="grammar-lesson-nav"
                    data-section="structure"
                >

                    <span class="grammar-nav-number">

                        {{ str_pad(
                            $sectionNumber++,
                            2,
                            '0',
                            STR_PAD_LEFT
                        ) }}

                    </span>


                    <span class="grammar-nav-icon">

                        ≡

                    </span>


                    <span class="grammar-nav-label">

                        Estructura

                    </span>

                </button>

            @endif


            {{-- REGLAS --}}

            @if($lesson->rules->count() > 0)

                <button
                    type="button"
                    class="grammar-lesson-nav"
                    data-section="rules"
                >

                    <span class="grammar-nav-number">

                        {{ str_pad(
                            $sectionNumber++,
                            2,
                            '0',
                            STR_PAD_LEFT
                        ) }}

                    </span>


                    <span class="grammar-nav-icon">

                        ✓

                    </span>


                    <span class="grammar-nav-label">

                        Reglas

                    </span>


                    <span class="grammar-nav-count">

                        {{ $lesson->rules->count() }}

                    </span>

                </button>

            @endif


            {{-- EJEMPLOS --}}

            @if($lesson->examples->count() > 0)

                <button
                    type="button"
                    class="grammar-lesson-nav"
                    data-section="examples"
                >

                    <span class="grammar-nav-number">

                        {{ str_pad(
                            $sectionNumber++,
                            2,
                            '0',
                            STR_PAD_LEFT
                        ) }}

                    </span>


                    <span class="grammar-nav-icon">

                        Aa

                    </span>


                    <span class="grammar-nav-label">

                        Ejemplos

                    </span>


                    <span class="grammar-nav-count">

                        {{ $lesson->examples->count() }}

                    </span>

                </button>

            @endif


            {{-- ERRORES COMUNES --}}

            @if($lesson->common_mistakes)

                <button
                    type="button"
                    class="grammar-lesson-nav"
                    data-section="mistakes"
                >

                    <span class="grammar-nav-number">

                        {{ str_pad(
                            $sectionNumber++,
                            2,
                            '0',
                            STR_PAD_LEFT
                        ) }}

                    </span>


                    <span class="grammar-nav-icon">

                        !

                    </span>


                    <span class="grammar-nav-label">

                        Errores comunes

                    </span>

                </button>

            @endif


            {{-- RESUMEN --}}

            @if($lesson->summary)

                <button
                    type="button"
                    class="grammar-lesson-nav"
                    data-section="summary"
                >

                    <span class="grammar-nav-number">

                        {{ str_pad(
                            $sectionNumber++,
                            2,
                            '0',
                            STR_PAD_LEFT
                        ) }}

                    </span>


                    <span class="grammar-nav-icon">

                        ✓

                    </span>


                    <span class="grammar-nav-label">

                        Resumen

                    </span>

                </button>

            @endif

        </div>

    </aside>


    {{-- =================================================
         CONTENIDO PRINCIPAL
         ================================================= --}}

    <main class="grammar-lesson-content">


        {{-- =================================================
             INTRODUCCIÓN
             ================================================= --}}

        <section
            id="section-introduction"
            class="grammar-lesson-section active"
        >

            <div class="grammar-section-heading">

                <span class="grammar-section-label">

                    01 · INTRODUCCIÓN

                </span>


                <h2>

                    Introducción

                </h2>

            </div>


            @if($lesson->introduction)

                <div class="grammar-introduction-card">

                    <div class="grammar-introduction-icon">

                        ✦

                    </div>


                    <div class="grammar-text">

                        {!! $formatGrammarText(
                            $lesson->introduction
                        ) !!}

                    </div>

                </div>

            @else

                <div class="grammar-empty-content">

                    No hay una introducción disponible todavía.

                </div>

            @endif

        </section>


        {{-- =================================================
             USOS
             ================================================= --}}

        @if($lesson->uses)

            <section
                id="section-uses"
                class="grammar-lesson-section"
            >

                <div class="grammar-section-heading">

                    <span class="grammar-section-label">

                        USOS

                    </span>


                    <h2>

                        ¿Cuándo se utiliza?

                    </h2>

                </div>


                <div class="grammar-use-card">

                    <div class="grammar-use-icon">

                        ?

                    </div>


                    <div class="grammar-text">

                        {!! $formatGrammarText(
                            $lesson->uses
                        ) !!}

                    </div>

                </div>

            </section>

        @endif


        {{-- =================================================
             ESTRUCTURA
             ================================================= --}}

        @if(
            $lesson->affirmative_structure ||
            $lesson->negative_structure ||
            $lesson->question_structure ||
            $lesson->short_answers
        )

            <section
                id="section-structure"
                class="grammar-lesson-section"
            >

                <div class="grammar-section-heading">

                    <span class="grammar-section-label">

                        ESTRUCTURA

                    </span>


                    <h2>

                        Estructura de las oraciones

                    </h2>

                </div>


                <div class="grammar-structure-list">


                    {{-- AFIRMATIVA --}}

                    @if($lesson->affirmative_structure)

                        <article
                            class="grammar-structure-card structure-affirmative"
                        >

                            <div class="grammar-structure-header">

                                <span class="grammar-structure-icon">

                                    +

                                </span>


                                <h3>

                                    Afirmativa

                                </h3>

                            </div>


                            <div class="grammar-structure-text">

                                {!! $formatGrammarText(
                                    $lesson->affirmative_structure
                                ) !!}

                            </div>

                        </article>

                    @endif


                    {{-- NEGATIVA --}}

                    @if($lesson->negative_structure)

                        <article
                            class="grammar-structure-card structure-negative"
                        >

                            <div class="grammar-structure-header">

                                <span class="grammar-structure-icon">

                                    −

                                </span>


                                <h3>

                                    Negativa

                                </h3>

                            </div>


                            <div class="grammar-structure-text">

                                {!! $formatGrammarText(
                                    $lesson->negative_structure
                                ) !!}

                            </div>

                        </article>

                    @endif


                    {{-- PREGUNTAS --}}

                    @if($lesson->question_structure)

                        <article
                            class="grammar-structure-card structure-question"
                        >

                            <div class="grammar-structure-header">

                                <span class="grammar-structure-icon">

                                    ?

                                </span>


                                <h3>

                                    Preguntas

                                </h3>

                            </div>


                            <div class="grammar-structure-text">

                                {!! $formatGrammarText(
                                    $lesson->question_structure
                                ) !!}

                            </div>

                        </article>

                    @endif


                    {{-- RESPUESTAS CORTAS --}}

                    @if($lesson->short_answers)

                        <article
                            class="grammar-structure-card structure-answer"
                        >

                            <div class="grammar-structure-header">

                                <span class="grammar-structure-icon">

                                    ✓

                                </span>


                                <h3>

                                    Respuestas cortas

                                </h3>

                            </div>


                            <div class="grammar-structure-text">

                                {!! $formatGrammarText(
                                    $lesson->short_answers
                                ) !!}

                            </div>

                        </article>

                    @endif

                </div>

            </section>

        @endif


        {{-- =================================================
             REGLAS
             ================================================= --}}

        @if($lesson->rules->count() > 0)

            <section
                id="section-rules"
                class="grammar-lesson-section"
            >

                <div class="grammar-section-heading">

                    <span class="grammar-section-label">

                        REGLAS · {{ $lesson->rules->count() }}

                    </span>


                    <h2>

                        Reglas gramaticales

                    </h2>

                </div>


                <div class="grammar-rules">

                    @foreach($lesson->rules as $index => $rule)

                        <article class="grammar-rule-card">

                            <div class="grammar-rule-number">

                                {{ str_pad(
                                    $index + 1,
                                    2,
                                    '0',
                                    STR_PAD_LEFT
                                ) }}

                            </div>


                            <div class="grammar-rule-content">


                                <h3>

                                    {{ $rule->title }}

                                </h3>


                                @if($rule->explanation)

                                    <div class="grammar-rule-explanation">

                                        {!! $formatGrammarText(
                                            $rule->explanation
                                        ) !!}

                                    </div>

                                @endif


                                @if($rule->examples)

                                    <div class="grammar-rule-examples">

                                        <div class="grammar-rule-examples-label">

                                            EJEMPLOS

                                        </div>


                                        <div class="grammar-rule-examples-text">

                                            {!! $formatGrammarText(
                                                $rule->examples
                                            ) !!}

                                        </div>

                                    </div>

                                @endif

                            </div>

                        </article>

                    @endforeach

                </div>

            </section>

        @endif


        {{-- =================================================
             EJEMPLOS
             ================================================= --}}

        @if($lesson->examples->count() > 0)

            <section
                id="section-examples"
                class="grammar-lesson-section"
            >

                <div class="grammar-section-heading">

                    <span class="grammar-section-label">

                        EJEMPLOS · {{ $lesson->examples->count() }}

                    </span>


                    <h2>

                        Ejemplos

                    </h2>

                </div>


                <div class="grammar-examples">

                    @foreach($lesson->examples as $index => $example)

                        <article class="grammar-example-card">

                            <div class="grammar-example-number">

                                {{ str_pad(
                                    $index + 1,
                                    2,
                                    '0',
                                    STR_PAD_LEFT
                                ) }}

                            </div>


                            <div class="grammar-example-content">


                                {{-- TIPO --}}

                                @if($example->type)

                                    <div class="grammar-example-type">

                                        {{ $example->type }}

                                    </div>

                                @endif


                                {{-- INGLÉS --}}

                                @if($example->english)

                                    <div class="grammar-example-english">

                                        {!! $formatGrammarText(
                                            $example->english
                                        ) !!}

                                    </div>

                                @endif


                                {{-- ESPAÑOL --}}

                                @if($example->spanish)

                                    <div class="grammar-example-spanish">

                                        {!! $formatGrammarText(
                                            $example->spanish
                                        ) !!}

                                    </div>

                                @endif


                                {{-- EXPLICACIÓN --}}

                                @if($example->explanation)

                                    <div class="grammar-example-explanation">

                                        {!! $formatGrammarText(
                                            $example->explanation
                                        ) !!}

                                    </div>

                                @endif

                            </div>

                        </article>

                    @endforeach

                </div>

            </section>

        @endif


        {{-- =================================================
             ERRORES COMUNES
             ================================================= --}}

        @if($lesson->common_mistakes)

            <section
                id="section-mistakes"
                class="grammar-lesson-section"
            >

                <div class="grammar-section-heading">

                    <span class="grammar-section-label">

                        ATENCIÓN

                    </span>


                    <h2>

                        Errores comunes

                    </h2>

                </div>


                <div class="grammar-mistakes-card">

                    <div class="grammar-mistakes-icon">

                        !

                    </div>


                    <div class="grammar-text">

                        {!! $formatGrammarText(
                            $lesson->common_mistakes
                        ) !!}

                    </div>

                </div>

            </section>

        @endif


        {{-- =================================================
             RESUMEN
             ================================================= --}}

        @if($lesson->summary)

            <section
                id="section-summary"
                class="grammar-lesson-section"
            >

                <div class="grammar-section-heading">

                    <span class="grammar-section-label">

                        REPASO FINAL

                    </span>


                    <h2>

                        Resumen

                    </h2>

                </div>


                <div class="grammar-summary-card">

                    <div class="grammar-summary-icon">

                        ✓

                    </div>


                    <div class="grammar-text">

                        {!! $formatGrammarText(
                            $lesson->summary
                        ) !!}

                    </div>

                </div>


                <div class="grammar-lesson-complete">

                    <div class="grammar-complete-icon">

                        ✓

                    </div>


                    <div>

                        <h3>

                            Lección completada

                        </h3>


                        <p>

                            Has terminado de aprender
                            {{ $lesson->title }}.

                        </p>

                    </div>

                </div>

            </section>

        @endif

    </main>

</div>


{{-- =====================================================
     NAVEGACIÓN INFERIOR
     ===================================================== --}}

<div class="grammar-lesson-bottom">

    <a
        href="{{ route(
            'grammar.topic',
            $lesson->topic->id
        ) }}"
        class="grammar-back-button"
    >

        <span>

            ←

        </span>

        Volver a {{ $lesson->topic->name }}

    </a>

</div>


</div>

@endsection