@extends('layouts.app')

@section('title', 'Dashboard')

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
                href="/"
                class="dashboard-nav-item active"
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
                GESTIÓN
            </div>


            <a
                href="/gestion/technologies"
                class="dashboard-nav-item"
            >
                <span>💻</span>
                Tecnologías
            </a>


            <a
                href="/gestion/categories"
                class="dashboard-nav-item"
            >
                <span>📁</span>
                Categorías
            </a>


            <a
                href="/gestion/concepts"
                class="dashboard-nav-item"
            >
                <span>📚</span>
                Conceptos
            </a>

        </nav>


        <div class="dashboard-sidebar-footer">

            <div class="user-avatar">
                W
            </div>

            <div>
                <strong>Administrador</strong>
                <span>Base de conocimiento</span>
            </div>

        </div>

    </aside>


    {{-- CONTENIDO --}}

    <div class="dashboard-main">


        {{-- HEADER --}}

        <header class="dashboard-topbar">

            <div>

                <h1>
                    Dashboard
                </h1>

                <p>
                    Resumen de tu base de conocimiento técnico.
                </p>

            </div>


            <div class="dashboard-topbar-actions">

                <div class="dashboard-search">

                    <span>🔎</span>

                    <input
                        type="text"
                        placeholder="Buscar..."
                    >

                </div>


                <button class="notification-button">
                    🔔
                </button>


                <div class="profile-avatar">
                    W
                </div>

            </div>

        </header>


        {{-- CONTENIDO --}}

        <section class="dashboard-content">


            {{-- BIENVENIDA --}}

            <div class="welcome-section">

                <div>

                    <h2>
                        Base de conocimiento
                    </h2>

                    <p>
                        Administra y organiza tus conocimientos técnicos.
                    </p>

                </div>

            </div>


            {{-- ESTADÍSTICAS --}}

            <div class="stats-grid">


                <div class="stat-card">

                    <div class="stat-card-icon">
                        💻
                    </div>

                    <div>

                        <span>
                            Tecnologías
                        </span>

                       <strong>
    {{ $technologies }}
</strong>

                    </div>

                </div>


                <div class="stat-card">

                    <div class="stat-card-icon">
                        📁
                    </div>

                    <div>

                        <span>
                            Categorías
                        </span>

                        <strong>
    {{ $categories }}
</strong>

                    </div>

                </div>


                <div class="stat-card">

                    <div class="stat-card-icon">
                        📚
                    </div>

                    <div>

                        <span>
                            Conceptos
                        </span>

                        <strong>
    {{ $concepts }}
</strong>

                    </div>

                </div>


            </div>


            {{-- SECCIÓN PRINCIPAL --}}

            <div class="dashboard-grid">


                {{-- GESTIÓN --}}

                <div class="dashboard-panel">

                    <div class="panel-header">

                        <div>

                            <h2>
                                Gestión del conocimiento
                            </h2>

                            <p>
                                Accede rápidamente a tus recursos.
                            </p>

                        </div>

                    </div>


                    <div class="management-grid">


                        <a
                            href="/gestion/technologies"
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


                        <a
                            href="/gestion/categories"
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


                        <a
                            href="/gestion/concepts"
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


                {{-- ACTIVIDAD --}}

                <div class="dashboard-panel">

                    <div class="panel-header">

                        <div>

                            <h2>
                                Actividad reciente
                            </h2>

                            <p>
                                Últimos cambios realizados.
                            </p>

                        </div>

                    </div>


                    <div class="empty-activity">

                        <div>
                            📋
                        </div>

                        <strong>
                            Sin actividad reciente
                        </strong>

                        <span>
                            Aquí aparecerán tus últimos registros.
                        </span>

                    </div>

                </div>


            </div>


        </section>

    </div>

</div>

@endsection