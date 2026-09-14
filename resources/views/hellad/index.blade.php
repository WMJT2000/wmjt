@extends('layouts.app')

@section('title', 'HELLAD')

@section('content')

<div class="hellad">

    <div class="hellad-header">

        <h1>
            {{ $version->nombre }}
        </h1>

        <p>
            Currículo educativo · {{ $version->anio }}
        </p>

    </div>

    <div class="hellad-section">

        <h2>
            Ejes de Desarrollo y Aprendizaje
        </h2>

        <p>
            Selecciona un eje para explorar sus ámbitos.
        </p>

    </div>

    <div class="hellad-grid">

        @foreach ($version->ejes as $index => $eje)

        <a href="{{ route('hellad.eje', $eje->id) }}" class="hellad-card">

            <div class="hellad-number">
                {{ $index + 1 }}
            </div>

            <h3>
                {{ $eje->nombre }}
            </h3>

            <div class="hellad-action">
                Explorar eje →
            </div>

        </a>

        @endforeach

    </div>

</div>

@endsection