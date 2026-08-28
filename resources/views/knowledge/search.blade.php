@extends('layouts.app')

@section('title', 'Buscar conocimiento')

@section('content')

<div class="knowledge-page">

    <header class="knowledge-header">

        <div>

            <a
                href="{{ route('knowledge.index') }}"
                class="knowledge-back"
            >
                ← Base de conocimiento
            </a>

            <h1>
                Resultados de búsqueda
            </h1>

            <p>
                Resultados para:
                <strong>{{ $search }}</strong>
            </p>

        </div>

    </header>


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
                value="{{ $search }}"
                placeholder="Buscar..."
            >

            <button type="submit">
                Buscar
            </button>

        </form>

    </section>


    <section class="knowledge-section">

        @if($concepts->count())

            <div class="concept-list">

                @foreach($concepts as $concept)

                    <a
                        href="{{ route('knowledge.concept', $concept->id) }}"
                        class="concept-card"
                    >

                        <div class="concept-card-icon">
                            📚
                        </div>


                        <div class="concept-card-content">

                            <div class="concept-card-title">

                                <h3>
                                    {{ $concept->name }}
                                </h3>

                                <span>
                                    {{ $concept->category->technology->name }}
                                    /
                                    {{ $concept->category->name }}
                                </span>

                            </div>


                            <p>
                                {{ $concept->description }}
                            </p>

                        </div>


                        <b>
                            →
                        </b>

                    </a>

                @endforeach

            </div>

        @else

            <div class="knowledge-empty">

                <div>
                    🔎
                </div>

                <strong>
                    No encontramos resultados
                </strong>

                <span>
                    Intenta con otro término de búsqueda.
                </span>

            </div>

        @endif

    </section>

</div>

@endsection