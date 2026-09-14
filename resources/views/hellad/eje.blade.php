@extends('layouts.app')

@section('title', $eje->nombre)

@section('content')

<div class="hellad">

    <div class="hellad-breadcrumb">

        <a href="{{ route('hellad.index') }}">
            HELLAD
        </a>

        <span>›</span>

        <span>{{ $eje->nombre }}</span>

    </div>

    <div class="hellad-header">

        <h1>
            {{ $eje->nombre }}
        </h1>

        <p>
            Selecciona un ámbito para continuar.
        </p>

    </div>

    <div class="hellad-grid">

        @foreach ($eje->ambitos as $index => $ambito)

        <a href="{{ route('hellad.ambito', $ambito->id) }}" class="hellad-card">

            <div class="hellad-number">
                {{ $index + 1 }}
            </div>

            <h3>
                {{ $ambito->nombre }}
            </h3>

            <div class="hellad-badges">

                @if ($ambito->{'0_3'})
                <span class="hellad-badge">
                    0–3 años
                </span>
                @endif

                @if ($ambito->{'3_5'})
                <span class="hellad-badge">
                    3–5 años
                </span>
                @endif

            </div>

            <div class="hellad-action">
                Ver objetivos →
            </div>

        </a>

        @endforeach

    </div>

</div>

@endsection