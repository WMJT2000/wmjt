@extends('layouts.app')

@section('title', 'Gestión')

@push('styles')
@endpush

@section('content')

<div class="dashboard">

    {{-- SIDEBAR --}}

    <aside class="dashboard-sidebar">

        <div class="dashboard-brand">

            <div class="brand-icon">
                ⚡
            </div>

            <div>
                <strong>Tech Knowledge</strong>
                <span>Knowledge Base</span>
            </div>

        </div>


        <nav class="dashboard-nav">

            <a
                href="{{ route('home') }}"
                class="dashboard-nav-item"
            >
                <span>📊</span>
                Dashboard
            </a>


            <div class="nav-title">
                CONOCIMIENTO
            </div>


            <a
                href="{{ route('knowledge.index') }}"
                class="dashboard-nav-item"
            >
                <span>🔎</span>
                Explorar conocimiento
            </a>


            <div class="nav-title">
                ADMINISTRACIÓN
            </div>


            <a
                href="{{ route('gestion.index') }}"
                class="dashboard-nav-item active"
            >
                <span>⚙️</span>
                Gestión
            </a>

        </nav>


        {{-- USUARIO --}}

        <x-user-menu />

    </aside>


    {{-- CONTENIDO --}}

    <div class="dashboard-main">


        {{-- HEADER --}}

        <header class="dashboard-topbar">

            <div>

                <h1>
                    Gestión
                </h1>

                <p>
                    Administra los diferentes módulos de la aplicación.
                </p>

            </div>

        </header>


        {{-- CONTENIDO --}}

        <section class="dashboard-content">


            {{-- BIENVENIDA --}}

            <div class="welcome-section">

                <div>

                    <h2>
                        Módulos de gestión
                    </h2>

                    <p>
                        Selecciona el área que deseas administrar.
                    </p>

                </div>

            </div>


            {{-- MÓDULOS --}}

            <div class="dashboard-panel">

                <div class="panel-header">

                    <div>

                        <h2>
                            Áreas disponibles
                        </h2>

                        <p>
                            Gestiona la información de cada módulo.
                        </p>

                    </div>

                </div>


          <div class="management-grid">


    {{-- CONOCIMIENTO TÉCNICO --}}

    <a
        href="{{ route('gestion.knowledge.index') }}"
        class="management-card"
    >

        <div class="management-icon">
            🔎
        </div>

        <div>

            <strong>
                Conocimiento técnico
            </strong>

            <span>
                Tecnologías, categorías y conceptos
            </span>

        </div>

        <b>
            →
        </b>

    </a>


    {{-- INGLÉS --}}

    <a
        href="{{ route('gestion.english.index') }}"
        class="management-card"
    >

        <div class="management-icon">
            🇬🇧
        </div>

        <div>

            <strong>
                Inglés
            </strong>

            <span>
                Categorías, palabras y significados
            </span>

        </div>

        <b>
            →
        </b>

    </a>


</div>

            </div>


        </section>

    </div>

</div>

@endsection