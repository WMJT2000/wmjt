@extends('layouts.app')

@section('title', 'Mis manuales')

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
                        Mis manuales
                    </h1>

                    <p>
                        Continúa donde lo dejaste.
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
                            Continúa aprendiendo
                        </h2>

                        <p>
                            Aquí encontrarás los manuales que ya has comenzado
                            y podrás continuar desde donde los dejaste.
                        </p>

                    </div>

                </div>


                {{-- ESTADÍSTICAS --}}
                <div class="my-manuals-stats">

                    <div class="my-manual-stat">
                        <div class="my-manual-stat-icon">
                            📚
                        </div>

                        <div class="my-manual-stat-info">
                            <strong>
                                {{ $totalManuales }}
                            </strong>

                            <span>
                                Manuales iniciados
                            </span>
                        </div>
                    </div>


                    <div class="my-manual-stat">
                        <div class="my-manual-stat-icon">
                            🔄
                        </div>

                        <div class="my-manual-stat-info">
                            <strong>
                                {{ $manualesEnProgreso }}
                            </strong>

                            <span>
                                En progreso
                            </span>
                        </div>
                    </div>


                    <div class="my-manual-stat">
                        <div class="my-manual-stat-icon">
                            ✓
                        </div>

                        <div class="my-manual-stat-info">
                            <strong>
                                {{ $manualesCompletados }}
                            </strong>

                            <span>
                                Completados
                            </span>
                        </div>
                    </div>

                </div>



                {{-- MIS MANUALES --}}
                @if($executions->count())

                    {{-- FILTROS --}}
                    <div class="manuals-filters">

                        <button type="button" class="manual-filter-btn active" data-filter="all">
                            Todos
                        </button>

                        <button type="button" class="manual-filter-btn" data-filter="progress">
                            En progreso
                        </button>

                        <button type="button" class="manual-filter-btn" data-filter="completed">
                            Completados
                        </button>

                    </div>


                    <div class="manuals-grid" id="my-manuals-grid">

                        @foreach($executions as $execution)

                            @php
                                $manual = $execution->manual;
                                $filterStatus = $execution->status === 'completed'
                                    ? 'completed'
                                    : 'progress';
                            @endphp

                            <article class="manual-card my-manual-card" data-status="{{ $filterStatus }}">

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


                                    {{-- PROGRESO --}}
                                    <div class="manual-card-progress">

                                        <div class="manual-card-progress-header">

                                            <span>
                                                Progreso
                                            </span>

                                            <strong>
                                                {{ $execution->progress_percentage }}%
                                            </strong>

                                        </div>


                                        <div class="manual-card-progress-bar">

                                            <div class="manual-card-progress-fill"
                                                style="width: {{ $execution->progress_percentage }}%;"></div>

                                        </div>


                                        <div class="manual-card-progress-steps">

                                            {{ $execution->completed_steps }}
                                            de
                                            {{ $execution->total_steps }}
                                            pasos

                                        </div>

                                    </div>


                                    {{-- ESTADO --}}
                                    @if($execution->status === 'completed')

                                        <div class="manual-status-completed">
                                            ✓ Manual completado
                                        </div>


                                        <a href="{{ route('manuals.execution', $manual->id) }}" class="btn-primary">
                                            Ver manual
                                        </a>

                                    @else

                                        <div class="manual-status-progress">
                                            🔄 En progreso
                                        </div>


                                        <a href="{{ route('manuals.execution', $manual->id) }}" class="btn-primary">
                                            Continuar manual →
                                        </a>

                                    @endif

                                </div>

                            </article>

                        @endforeach

                    </div>


                    {{-- SIN RESULTADOS DEL FILTRO --}}
                    <div id="my-manuals-empty-filter" class="dashboard-panel" style="display: none;">

                        <div class="empty-activity">

                            <div>
                                🔎
                            </div>

                            <strong>
                                No hay manuales en esta categoría
                            </strong>

                            <span>
                                Prueba con otro filtro.
                            </span>

                        </div>

                    </div>

                @else



                    {{-- SIN MANUALES --}}
                    <div class="dashboard-panel">

                        <div class="empty-activity">

                            <div>
                                🎯
                            </div>

                            <strong>
                                Todavía no has comenzado ningún manual
                            </strong>

                            <span>
                                Explora los manuales disponibles y comienza
                                a aprender paso a paso.
                            </span>


                            <a href="{{ route('manuals.index') }}" class="btn-primary">
                                Explorar manuales →
                            </a>

                        </div>

                    </div>

                @endif

            </section>

        </div>

    </div>

@endsection