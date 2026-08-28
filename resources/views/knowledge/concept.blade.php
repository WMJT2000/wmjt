@extends('layouts.app')

@section('title', $concept->name)

@section('content')

<div class="knowledge-page">

    <header class="knowledge-header">

        <div>

            <a
                href="{{ route('knowledge.category', $concept->category->id) }}"
                class="knowledge-back"
            >
                ← {{ $concept->category->name }}
            </a>

            <div class="knowledge-breadcrumb">

                {{ $concept->category->technology->name }}

                /

                {{ $concept->category->name }}

            </div>

            <h1>
                {{ $concept->name }}
            </h1>

            @if($concept->type)

                <span class="concept-type">
                    {{ $concept->type }}
                </span>

            @endif

        </div>

    </header>


    <main class="concept-page">


        {{-- DESCRIPCIÓN --}}

        <article class="concept-section">

            <h2>
                Descripción
            </h2>

            <div class="concept-text">

                {!! nl2br(e($concept->description)) !!}

            </div>

        </article>


        {{-- COMO UTILIZAR --}}

        @if($concept->how_to_use)

            <article class="concept-section">

                <h2>
                    ¿Cómo utilizarlo?
                </h2>

                <div class="concept-text">

                    {!! nl2br(e($concept->how_to_use)) !!}

                </div>

            </article>

        @endif


        {{-- EJEMPLO --}}

        @if($concept->example)

            <article class="concept-section">

                <h2>
                    Ejemplo
                </h2>

                <pre class="concept-code"><code>{{ $concept->example }}</code></pre>

            </article>

        @endif


        {{-- NAVEGACIÓN --}}

        <div class="concept-navigation">

            <a
                href="{{ route('knowledge.category', $concept->category->id) }}"
                class="knowledge-button"
            >
                ← Ver más conceptos
            </a>

        </div>


    </main>

</div>

@endsection