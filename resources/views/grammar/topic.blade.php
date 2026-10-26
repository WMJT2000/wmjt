@extends('layouts.app')

@section('content')

<div class="grammar-topic-page">

    <nav class="grammar-breadcrumb" aria-label="Migas de pan">
        <a
            href="{{ route('grammar.index', ['level' => $topic->level]) }}"
            class="grammar-breadcrumb-link"
        >
            <span class="grammar-breadcrumb-icon">←</span>
            Gramática
        </a>

        <span class="grammar-breadcrumb-separator">/</span>

        <a
            href="{{ route('grammar.category', $topic->category->id) }}"
            class="grammar-breadcrumb-link"
        >
            {{ $topic->category->name }}
        </a>

        <span class="grammar-breadcrumb-separator">/</span>

        <span class="grammar-breadcrumb-current">
            {{ $topic->name }}
        </span>
    </nav>

    <section class="grammar-topic-hero">
        <div class="grammar-topic-hero-content">
            <div class="grammar-topic-level">
                <span class="grammar-topic-level-dot"></span>
                NIVEL {{ $topic->level }}
            </div>

            <h1>{{ $topic->name }}</h1>

            @if($topic->description)
                <p class="grammar-topic-description">
                    {{ $topic->description }}
                </p>
            @endif
        </div>

        <div class="grammar-topic-decoration">
            <div class="grammar-topic-circle circle-one"></div>
            <div class="grammar-topic-circle circle-two"></div>

            <span class="grammar-topic-floating floating-one">Aa</span>
            <span class="grammar-topic-floating floating-two">✓</span>
            <span class="grammar-topic-floating floating-three">?</span>
        </div>
    </section>

    <section class="grammar-topic-lessons">
        <div class="grammar-section-header">
            <div class="grammar-section-heading">
                <div class="grammar-section-icon">✦</div>

                <div>
                    <span class="grammar-section-label">
                        LECCIONES DE GRAMÁTICA
                    </span>

                    <h2>Aprende paso a paso</h2>
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
                        {{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}
                    </span>
                </div>

                <div class="grammar-topic-section-content">
                    <h3>{{ $lesson->title }}</h3>

                    @if($lesson->introduction)
                        <p>
                            {{ \Illuminate\Support\Str::limit($lesson->introduction, 180) }}
                        </p>
                    @endif
                </div>

                
                <a
                    href="{{ route('grammar.lesson', $lesson->id) }}"
                    class="grammar-start-button"
                >
                    <span>Comenzar lección</span>
                    <strong>→</strong>
                </a>
            </article>
        @empty
            <div class="grammar-empty">
                <div class="grammar-empty-icon">✦</div>

                <h3>No hay lecciones disponibles</h3>

                <p>
                    Este tema todavía no tiene lecciones disponibles.
                </p>
            </div>
        @endforelse
    </section>

    <div class="grammar-topic-back">
        <a href="{{ route('grammar.category', $topic->category->id) }}">
            <span>←</span>
            Volver a {{ $topic->category->name }}
        </a>
    </div>

</div>

@endsection
