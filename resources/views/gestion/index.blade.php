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

                        <a href="{{ route('gestion.knowledge.index') }}" class="management-card">

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

                        <a href="{{ route('gestion.manuals') }}" class="management-card">

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

                        <a href="{{ route('gestion.english.index') }}" class="management-card">

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