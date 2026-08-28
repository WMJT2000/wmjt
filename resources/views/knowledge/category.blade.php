@extends('layouts.app')

@section('title', $category->name)

@section('content')

<div class="knowledge-page">

    <header class="knowledge-header">

        <div>

            <a
                href="{{ route('knowledge.technology', $category->technology->id) }}"
                class="knowledge-back"
            >
                ← {{ $category->technology->name }}
            </a>

            <div class="knowledge-breadcrumb">
                Categoría
            </div>

            <h1>
                {{ $category->name }}
            </h1>

            <p>
                {{ $category->description }}
            </p>

        </div>

    </header>


    <section class="knowledge-section">

        <div class="knowledge-section-header">

            <div>

                <h2>
                    Conceptos
                </h2>

                <p>
                    Aprende sobre los conceptos de esta categoría.
                </p>

            </div>

            <span class="knowledge-count">
                {{ $category->concepts_count }}
            </span>

        </div>


        @if($category->concepts->count())

            <div class="concept-list">

                @foreach($category->concepts as $concept)

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

                                @if($concept->type)

                                    <span>
                                        {{ $concept->type }}
                                    </span>

                                @endif

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
                    📚
                </div>

                <strong>
                    No hay conceptos
                </strong>

                <span>
                    Esta categoría todavía no tiene conceptos.
                </span>

            </div>

        @endif

    </section>

</div>

@endsection