@extends('layouts.app')

@section('title', 'Conocimiento técnico')

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
                    Conocimiento técnico
                </h1>

                <p>
                    Administra las estructuras de tu base de conocimiento.
                </p>

            </div>

        </header>


        {{-- CONTENIDO --}}

        <section class="dashboard-content">


            {{-- BIENVENIDA --}}

            <div class="welcome-section">

                <div>

                    <h2>
                        Gestión del conocimiento técnico
                    </h2>

                    <p>
                        Selecciona qué información deseas administrar.
                    </p>

                </div>

            </div>


            {{-- OPCIONES --}}

            <div class="dashboard-panel">

                <div class="panel-header">

                    <div>

                        <h2>
                            Recursos
                        </h2>

                        <p>
                            Administra tecnologías, categorías y conceptos.
                        </p>

                    </div>

                </div>


                <div class="management-grid">


                    {{-- TECNOLOGÍAS --}}

                    <a
                        href="{{ route('technologies.index') }}"
                        class="management-card"
                    >

                        <div class="management-icon">
                            💻
                        </div>

                        <div>

                            <strong>
                                Tecnologías
                            </strong>

                            <span>
                                Gestionar tecnologías
                            </span>

                        </div>

                        <b>
                            →
                        </b>

                    </a>


                    {{-- CATEGORÍAS --}}

                    <a
                        href="{{ route('categories.index') }}"
                        class="management-card"
                    >

                        <div class="management-icon">
                            📁
                        </div>

                        <div>

                            <strong>
                                Categorías
                            </strong>

                            <span>
                                Organizar categorías
                            </span>

                        </div>

                        <b>
                            →
                        </b>

                    </a>


                    {{-- CONCEPTOS --}}

                    <a
                        href="{{ route('concepts.index') }}"
                        class="management-card"
                    >

                        <div class="management-icon">
                            📚
                        </div>

                        <div>

                            <strong>
                                Conceptos
                            </strong>

                            <span>
                                Gestionar conceptos
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