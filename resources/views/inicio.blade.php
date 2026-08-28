@extends('layouts.app')

@section('title', 'Inicio')

@section('content')

<div class="dashboard">

    <div class="dashboard-header">

        <h1>
            Base de conocimiento
        </h1>

        <p>
            Panel principal
        </p>

    </div>


    <div class="dashboard-grid">


        {{-- TECNOLOGÍAS --}}

        <a
            href="/gestion/technologies"
            class="dashboard-card"
        >

            <div class="dashboard-icon">
                💻
            </div>

            <h2>
                Tecnologías
            </h2>

            <p>
                Gestionar tecnologías.
            </p>

        </a>


        {{-- CATEGORÍAS --}}

        <a
            href="/gestion/categories"
            class="dashboard-card"
        >

            <div class="dashboard-icon">
                📁
            </div>

            <h2>
                Categorías
            </h2>

            <p>
                Gestionar categorías.
            </p>

        </a>


        {{-- CONCEPTOS --}}

        <a
            href="/gestion/concepts"
            class="dashboard-card"
        >

            <div class="dashboard-icon">
                📚
            </div>

            <h2>
                Conceptos
            </h2>

            <p>
                Gestionar conceptos.
            </p>

        </a>





    </div>

</div>

@endsection