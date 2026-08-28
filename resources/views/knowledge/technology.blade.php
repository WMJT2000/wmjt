@extends('layouts.app')

@section('title', $technology->name)

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

            <div class="knowledge-breadcrumb">
                Tecnología
            </div>

            <h1>
                {{ $technology->name }}
            </h1>

            <p>
                {{ $technology->description }}
            </p>

        </div>

    </header>


    <section class="knowledge-section">

        <div class="knowledge-section-header">

            <div>

                <h2>
                    Categorías
                </h2>

                <p>
                    Explora los conceptos de esta tecnología.
                </p>

            </div>

            <span class="knowledge-count">
                {{ $technology->categories_count }}
            </span>

        </div>


        @if($technology->categories->count())

            <div class="category-grid">

                @foreach($technology->categories as $category)

                    <a
                        href="{{ route('knowledge.category', $category->id) }}"
                        class="category-card"
                    >

                        <div class="category-icon">
                            📁
                        </div>


                        <div class="category-content">

                            <h3>
                                {{ $category->name }}
                            </h3>

                            <p>
                                {{ $category->description }}
                            </p>

                            <span>
                                📚
                                {{ $category->concepts_count }}
                                conceptos
                            </span>

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
                    📁
                </div>

                <strong>
                    No hay categorías
                </strong>

                <span>
                    Esta tecnología todavía no tiene categorías.
                </span>

            </div>

        @endif

    </section>

</div>

@endsection