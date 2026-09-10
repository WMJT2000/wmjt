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
    INGLÉS
</div>

<a
    href="{{ route('english.index') }}"
    class="dashboard-nav-item"
>
    <span>🇬🇧</span>
    Inglés
</a>



<div class="nav-title">
    ADMINISTRACIÓN
</div>

<a
    href="{{ route('gestion.index') }}"
    class="dashboard-nav-item"
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

<div class="topbar-user">

    <button
        type="button"
        class="profile-avatar"
        onclick="toggleTopbarUserMenu()"
    >
        {{ strtoupper(substr(Auth::user()->name, 0, 1)) }}
    </button>

    <div id="topbar-user-menu" class="topbar-user-menu">

        <a href="{{ route('profile.edit') }}">
            <span>👤</span>
            Mi perfil
        </a>

        <a href="{{ route('register') }}">
            <span>➕</span>
            Crear usuario
        </a>

        <div class="user-menu-divider"></div>

        <form method="POST" action="{{ route('logout') }}">
            @csrf

            <button type="submit">
                <span>🚪</span>
                Cerrar sesión
            </button>
        </form>

    </div>

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