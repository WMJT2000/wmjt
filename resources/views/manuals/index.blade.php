@extends('layouts.app')

@section('title', 'Manuales')

@section('content')

    <div class="dashboard">

        {{-- SIDEBAR --}}

        <x-dashboard-sidebar />


        {{-- CONTENIDO --}}

        <div class="dashboard-main">

            {{-- HEADER --}}

            <header class="dashboard-topbar">

                <div>

                    <h1>
                        Manuales
                    </h1>

                    <p>
                        Aprende haciendo paso a paso.
                    </p>

                </div>


                <div class="dashboard-topbar-actions">

                    <div class="dashboard-search">

                        <span>
                            🔎
                        </span>

                        <input type="text" placeholder="Buscar manual...">

                    </div>


                    <button class="notification-button" type="button">
                        🔔
                    </button>


                    <div class="topbar-user">

                        <button type="button" class="profile-avatar" onclick="toggleTopbarUserMenu()">
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

                                    <span>
                                        🚪
                                    </span>

                                    Cerrar sesión

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </header>


            {{-- CONTENIDO --}}

            <section class="dashboard-content">

                <div class="welcome-section">

                    <div>

                        <h2>
                            Aprende haciendo
                        </h2>

                        <p>
                            Sigue manuales prácticos paso a paso
                            y registra tu progreso.
                        </p>

                    </div>

                </div>


                {{-- MANUALES --}}

                <div class="manuals-grid">

                    @forelse($manuals as $manual)

                        <article class="manual-card">

                            <div class="manual-card-icon">
                                📚
                            </div>


                            <div class="manual-card-content">

                                <h3>
                                    {{ $manual->title }}
                                </h3>


                                @if($manual->technology)

                                    <span class="manual-card-technology">

                                        {{ $manual->technology->name }}

                                    </span>

                                @endif


                                @if($manual->description)

                                    <p>
                                        {{ $manual->description }}
                                    </p>

                                @endif


                                @if($manual->difficulty)

                                    <span class="manual-card-difficulty">

                                        {{ ucfirst($manual->difficulty) }}

                                    </span>

                                @endif


                                {{-- PROGRESO DEL MANUAL --}}
                                @if($manual->user_execution)

                                    <div class="manual-card-progress">

                                        <div class="manual-card-progress-header">

                                            <span>
                                                Progreso
                                            </span>

                                            <strong>
                                                {{ $manual->progress_percentage }}%
                                            </strong>

                                        </div>

                                        <div class="manual-card-progress-bar">

                                            <div class="manual-card-progress-fill"
                                                style="width: {{ $manual->progress_percentage }}%;"></div>

                                        </div>

                                        <div class="manual-card-progress-steps">

                                            {{ $manual->completed_steps }}
                                            de
                                            {{ $manual->total_steps }}
                                            pasos

                                        </div>

                                    </div>


                                    @if($manual->user_execution->status === 'completed')

                                        <a href="{{ route('manuals.execution', $manual->id) }}" class="btn-primary">
                                            ✓ Ver manual
                                        </a>

                                    @else

                                        <a href="{{ route('manuals.execution', $manual->id) }}" class="btn-primary">
                                            Continuar manual →
                                        </a>

                                    @endif

                                @else

                                    <a href="{{ route('manuals.execution', $manual->id) }}" class="btn-primary">
                                        Comenzar manual →
                                    </a>

                                @endif

                            </div>

                        </article>

                    @empty

                        <div class="dashboard-panel">

                            <div class="empty-activity">

                                <div>
                                    📚
                                </div>

                                <strong>
                                    No hay manuales disponibles
                                </strong>

                                <span>
                                    Todavía no hay manuales publicados.
                                </span>

                            </div>

                        </div>

                    @endforelse

                </div>

            </section>

        </div>

    </div>

@endsection