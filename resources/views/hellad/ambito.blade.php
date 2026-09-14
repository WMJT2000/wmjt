@extends('layouts.app')

@section('title', $ambito->nombre)

@section('content')

<div class="hellad">

    <div class="hellad-breadcrumb">

        <a href="{{ route('hellad.index') }}">
            HELLAD
        </a>

        <span>›</span>

        <span>Ámbito</span>

        <span>›</span>

        <span>{{ $ambito->nombre }}</span>

    </div>

    <div class="hellad-header">

        <h1>
            {{ $ambito->nombre }}
        </h1>

        <div class="hellad-badges">

            @if ($ambito->{'0_3'})
            <span class="hellad-badge">
                Subnivel 0–3 años
            </span>
            @endif

            @if ($ambito->{'3_5'})
            <span class="hellad-badge">
                Subnivel 3–5 años
            </span>
            @endif

        </div>

    </div>

    <div class="hellad-section">

        <h2>
            Objetivos de aprendizaje
        </h2>

        <p>
            Selecciona un objetivo para consultar sus destrezas.
        </p>

    </div>

    <div class="hellad-list">

        @foreach ($ambito->objetivos as $index => $objetivo)

        <a href="{{ route('hellad.objetivo', $objetivo->id) }}" class="hellad-item">

            <div class="hellad-item-header">

                <span class="hellad-item-number">
                    OBJETIVO {{ $index + 1 }}
                </span>

                <span class="hellad-action">
                    Ver destrezas →
                </span>

            </div>

            <p class="hellad-item-text">
                {{ $objetivo->descripcion }}
            </p>

        </a>

        @endforeach

    </div>

</div>

@endsection