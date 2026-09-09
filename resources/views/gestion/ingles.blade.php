@extends('layouts.app')

@section('title', 'Inglés')

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


    {{-- CONTENIDO PRINCIPAL --}}

    <div class="dashboard-main">


        {{-- HEADER --}}

        <header class="dashboard-topbar">

            <div>

                <h1>
                    Inglés
                </h1>

                <p>
                    Administra la información relacionada con el idioma inglés.
                </p>

            </div>

        </header>


        {{-- CONTENIDO --}}

        <section class="dashboard-content">


            {{-- BIENVENIDA --}}

            <div class="welcome-section">

                <div>

                    <h2>
                        Gestión de inglés
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
                            Gestiona categorías, palabras y significados.
                        </p>

                    </div>

                </div>


                <div class="management-grid">


                    {{-- CATEGORÍAS --}}

                    <a
                        href="{{ route('english.categories.index') }}"
                        class="management-card"
                    >

                        <div class="management-icon">
                            📂
                        </div>

                        <div>

                            <strong>
                                Categorías
                            </strong>

                            <span>
                                Organiza las palabras por categorías.
                            </span>

                        </div>

                        <b>
                            →
                        </b>

                    </a>


                    {{-- PALABRAS --}}

                    <a
                        href="{{ route('english.words.index') }}"
                        class="management-card"
                    >

                        <div class="management-icon">
                            📝
                        </div>

                        <div>

                            <strong>
                                Palabras
                            </strong>

                            <span>
                                Administra las palabras en inglés.
                            </span>

                        </div>

                        <b>
                            →
                        </b>

                    </a>


                    {{-- SIGNIFICADOS --}}

                    <a
                        href="{{ route('english.meanings.index') }}"
                        class="management-card"
                    >

                        <div class="management-icon">
                            💡
                        </div>

                        <div>

                            <strong>
                                Significados
                            </strong>

                            <span>
                                Administra los significados de las palabras.
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