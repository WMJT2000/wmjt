@extends('layouts.app')

@section('title', 'Explorar conocimiento')

@section('content')

<div class="knowledge-page">

    {{-- HEADER --}}

    <header class="knowledge-header">

        <div>

            <a
                href="/"
                class="knowledge-back"
            >
                ← Dashboard
            </a>

            <h1>
                Base de conocimiento
            </h1>

            <p>
                Explora todos tus conocimientos técnicos.
            </p>

        </div>

    </header>


    {{-- BUSCADOR --}}

    <section class="knowledge-search-section">

        <form
            action="{{ route('knowledge.search') }}"
            method="GET"
            class="knowledge-search"
        >

            <span>
                🔎
            </span>

            <input
                type="text"
                name="q"
                placeholder="Buscar conceptos, tecnologías..."
            >

            <button type="submit">
                Buscar
            </button>

        </form>

    </section>


    {{-- TECNOLOGÍAS --}}

    <section class="knowledge-section">

        <div class="knowledge-section-header">

            <div>

                <h2>
                    Tecnologías
                </h2>

                <p>
                    Selecciona una tecnología para explorar
                    sus categorías y conceptos.
                </p>

            </div>

            <span class="knowledge-count">
                {{ $technologies->count() }}
            </span>

        </div>


        @if($technologies->count())

            <div class="technology-grid">

                @foreach($technologies as $technology)

                    <a
                        href="{{ route('knowledge.technology', $technology->id) }}"
                        class="technology-card"
                    >

                        <div class="technology-card-icon">
                            💻
                        </div>


                        <div class="technology-card-content">

                            <h3>
                                {{ $technology->name }}
                            </h3>

                            <p>
                                {{ $technology->description }}
                            </p>


                            <div class="technology-card-meta">

                                <span>
                                    📁
                                    {{ $technology->categories_count }}
                                    categorías
                                </span>

                            </div>

                        </div>


                        <div class="technology-card-arrow">
                            →
                        </div>

                    </a>

                @endforeach

            </div>

        @else

            <div class="knowledge-empty">

                <div>
                    📚
                </div>

                <strong>
                    No hay tecnologías registradas
                </strong>

                <span>
                    Agrega tecnologías desde el panel de gestión.
                </span>

            </div>

        @endif

    </section>

</div>

@endsection