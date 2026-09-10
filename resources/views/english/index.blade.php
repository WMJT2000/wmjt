@extends('layouts.app')

@section('title', 'Inglés')

@section('content')

<div class="english-container">

    <div class="english-header">

        <div>

            <h1>
                🇬🇧 Inglés
            </h1>

            <p>
                Aprende vocabulario en inglés.
            </p>

        </div>

    </div>


    <div class="english-section">

        <div class="english-section-header">

            <div>

                <h2>
                    Categorías
                </h2>

                <p>
                    Selecciona una categoría para comenzar a aprender.
                </p>

            </div>

        </div>


        <div class="english-categories-grid">

            @forelse($categories as $category)

                <div class="english-category-card">

                    <div class="english-category-icon">
                        📚
                    </div>

                    <h3>
                        {{ $category->name }}
                    </h3>

                    @if($category->description)

                        <p>
                            {{ $category->description }}
                        </p>

                    @endif

                    <span>
                        {{ $category->words_count }}
                        {{ $category->words_count === 1 ? 'palabra' : 'palabras' }}
                    </span>

                <a href="{{ route('english.study', $category) }}">
    Estudiar →
</a>
                </div>

            @empty

                <div class="english-empty">

                    <strong>
                        No hay categorías disponibles.
                    </strong>

                    <span>
                        Primero debes crear categorías desde Gestión → Inglés.
                    </span>

                </div>

            @endforelse

        </div>

    </div>

</div>

@endsection