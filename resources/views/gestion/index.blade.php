@extends('layouts.app')

@section('title', 'Gestión')

@push('styles')
@endpush

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
                        href="{{ route('technologies.index') }}"
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


                    {{-- MANUALES --}}

                    <a
                        href="{{ route('gestion.manuals') }}"
                        class="management-card"
                    >

                        <div class="management-icon">
                            📚
                        </div>

                        <div>

                            <strong>
                                Manuales
                            </strong>

                            <span>
                                Manuales, secciones y pasos prácticos
                            </span>

                        </div>

                        <b>
                            →
                        </b>

                    </a>


                    {{-- INGLÉS --}}

                    <a
                        href="{{ route('english.categories.index') }}"
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


                    {{-- PLANIFICACIONES --}}

                    <a
                        href="{{ route('gestion.planificacion.index') }}"
                        class="management-card"
                    >

                        <div class="management-icon">
                            📋
                        </div>

                        <div>

                            <strong>
                                Planificaciones
                            </strong>

                            <span>
                                Gestiona las planificaciones y sus configuraciones
                            </span>

                        </div>

                        <b>
                            →
                        </b>

                    </a>


                    {{-- EVALUACIONES --}}

                    <a
                        href="{{ route('evaluaciones.index') }}"
                        class="management-card"
                    >

                        <div class="management-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="8" y1="13" x2="16" y2="13"></line>
                                <line x1="8" y1="17" x2="16" y2="17"></line>
                            </svg>
                        </div>

                        <div>

                            <strong>
                                Evaluaciones
                            </strong>

                            <span>
                                Crea evaluaciones y registra los resultados de los estudiantes
                            </span>

                        </div>

                        <b>
                            →
                        </b>

                    </a>


                    <a
                        href="{{ route('estudiantes.index') }}"
                        class="management-card"
                    >

                        <div class="management-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>

                        <div>

                            <strong>
                                Estudiantes
                            </strong>

                            <span>
                                Registra los estudiantes que serán evaluados
                            </span>

                        </div>

                        <b>
                            →
                        </b>

                    </a>


                    <a
                        href="{{ route('grupos.index') }}"
                        class="management-card"
                    >

                        <div class="management-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M12 2 2 7l10 5 10-5-10-5z"></path>
                                <path d="m2 17 10 5 10-5"></path>
                                <path d="m2 12 10 5 10-5"></path>
                            </svg>
                        </div>

                        <div>

                            <strong>
                                Grupos
                            </strong>

                            <span>
                                Organiza los estudiantes por grupo
                            </span>

                        </div>

                        <b>
                            →
                        </b>

                    </a>


                    {{-- IMPORTAR GRAMMAR JSON --}}

                    <a
                        href="{{ route('admin.grammar.import') }}"
                        class="management-card"
                    >

                        <div class="management-icon">
                            📥
                        </div>

                        <div>

                            <strong>
                                Importar Grammar
                            </strong>

                            <span>
                                Importa categorías, topics, lessons, reglas y ejemplos desde JSON
                            </span>

                        </div>

                        <b>
                            →
                        </b>

                    </a>

                    <a
    href="{{ route('admin.english.import-word') }}"
    class="management-card"
>

    <div class="management-icon">
        📥
    </div>

    <div>

        <strong>
            Importar palabras
        </strong>

        <span>
            Importa categorías, palabras, significados y ejemplos desde JSON
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