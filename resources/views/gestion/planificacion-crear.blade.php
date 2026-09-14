@extends('layouts.app')

@section('title', 'Generar planificación')

@section('content')

<script>
window.planificacionId = @json($planificacionId);
</script>


<div class="planning-page">

    {{-- =====================================================
         ENCABEZADO
    ====================================================== --}}

    <div class="planning-header">

        <div>

            <h1>
                Generar planificación
            </h1>

            <p>
                Complete la información para crear su planificación.
            </p>

        </div>

    </div>


    <div class="planning-layout">


        {{-- =================================================
             SIDEBAR
        ================================================== --}}

        <aside class="planning-sidebar">


            {{-- PROGRESO --}}

            <div class="progress-container">

                <div class="progress-header">

                    <span>
                        Progreso
                    </span>

                    <span id="progressPercent">
                        0%
                    </span>

                </div>


                <div class="progress-bar">

                    <div class="progress-fill" id="progressValue" style="width: 0%;"></div>

                </div>

            </div>


            {{-- SECCIONES --}}

            <div class="sidebar-sections">


                {{-- INFORMACIÓN GENERAL --}}

                <div class="sidebar-section" id="sidebarGeneral">

                    <span class="sidebar-section-number">
                        1
                    </span>

                    <div>

                        <strong>
                            Información general
                        </strong>

                    </div>

                </div>


                {{-- ACTIVIDADES INICIALES --}}

                <div class="sidebar-section" id="sidebarPart1">

                    <span class="sidebar-section-number">
                        2
                    </span>

                    <div>

                        <strong>
                            Actividades iniciales
                        </strong>

                        <small id="sidebarPart1Text">
                            0 actividades
                        </small>

                    </div>

                </div>


                {{-- ACTIVIDADES FINALES --}}

                <div class="sidebar-section" id="sidebarPart2">

                    <span class="sidebar-section-number">
                        3
                    </span>

                    <div>

                        <strong>
                            Actividades finales
                        </strong>

                        <small id="sidebarPart2Text">
                            0 actividades
                        </small>

                    </div>

                </div>

            </div>

        </aside>


        {{-- =================================================
             CONTENIDO PRINCIPAL
        ================================================== --}}

        <main class="planning-content">


            <form action="{{ route('word.generar') }}" method="POST" id="planningForm">

                @csrf

                <input type="hidden" name="progreso" id="progresoInput" value="0">


                {{-- =================================================
                     INFORMACIÓN GENERAL
                ================================================== --}}

                <section class="planning-section">


                    <div class="section-header">

                        <div>

                            <h2>
                                Información general
                            </h2>

                            <p>
                                Complete los datos generales de la planificación.
                            </p>

                        </div>

                    </div>


                    <div class="planning-grid">


                        {{-- EXPERIENCIA --}}

                        <div class="planning-field">

                            <label>
                                Experiencia de aprendizaje
                            </label>

                            <input type="text" name="1_experiencia_prendizaje" class="planning-input" required>

                        </div>


                        {{-- DESCRIPCIÓN --}}

                        <div class="planning-field planning-field-full">

                            <label>
                                Descripción general de la experiencia
                            </label>

                            <textarea name="2_descripcion_general_experiencia" class="planning-input"
                                required></textarea>

                        </div>


                        {{-- MAESTRA --}}

                        <div class="planning-field">

                            <label>
                                Nombre de la maestra
                            </label>

                            <input type="text" name="3_nombre_maestra" class="planning-input" required>

                        </div>


                        {{-- TIEMPO --}}

                        <div class="planning-field">

                            <label>
                                Tiempo estimado
                            </label>

                            <input type="text" name="4_tiempo_estimado" class="planning-input" required>

                        </div>


                        {{-- FECHA --}}

                        <div class="planning-field">

                            <label>
                                Fecha
                            </label>

                            <input type="date" name="5_fecha" class="planning-input" required>

                        </div>


                        {{-- NIVEL --}}

                        <div class="planning-field">

                            <label>
                                Nivel educativo
                            </label>

                            <input type="text" name="6_nivel_educativo" class="planning-input" required>

                        </div>


                        {{-- OBJETIVO --}}

                        <div class="planning-field planning-field-full">

                            <label>
                                Objetivo de aprendizaje
                            </label>

                            <textarea name="7_objetivo_aprendizaje" class="planning-input" required></textarea>

                        </div>


                        {{-- ELEMENTO INTEGRADOR --}}

                        <div class="planning-field planning-field-full">

                            <label>
                                Elemento integrador
                            </label>

                            <textarea name="8_elemento_integrador" class="planning-input" required></textarea>

                        </div>


                        {{-- NOCIÓN DEL DÍA --}}

                        <div class="planning-field">

                            <label>
                                Noción del día
                            </label>

                            <input type="text" name="9_nocion_dia" class="planning-input" required>

                        </div>


                        {{-- TAMAÑO DE LETRA --}}

                        <div class="planning-field">

                            <label>
                                Tamaño de letra de actividades
                            </label>

                            <select id="tamano_letra_actividades" name="tamano_letra_actividades"
                                class="planning-input">

                                <option value="8" selected>
                                    8 pt
                                </option>

                                <option value="9">
                                    9 pt
                                </option>

                                <option value="10">
                                    10 pt
                                </option>

                                <option value="11">
                                    11 pt
                                </option>

                                <option value="12">
                                    12 pt
                                </option>

                            </select>

                        </div>


                    </div>

                </section>


                {{-- =================================================
                     ACTIVIDADES INICIALES
                ================================================== --}}

                <section class="planning-section">


                    <div class="section-header">


                        <div>

                            <div style="
                                    display:flex;
                                    align-items:center;
                                    gap:12px;
                                    flex-wrap:wrap;
                                ">

                                <h2>
                                    Actividades iniciales
                                </h2>

                                <span id="part1Counter" class="activity-counter">
                                    0 / 10
                                </span>

                            </div>


                            <p>
                                Agregue las actividades correspondientes.
                            </p>

                        </div>


                        <button type="button" id="addPart1" class="btn-add-activity">

                            + Agregar actividad

                        </button>


                    </div>


                    <div id="part1_container" class="activities-container">

                        <div id="part1Empty" class="empty-activities">

                            <div>

                                <strong>
                                    No hay actividades agregadas
                                </strong>

                                <span>
                                    Presione «Agregar actividad» para comenzar.
                                </span>

                            </div>

                        </div>

                    </div>


                </section>


                {{-- =================================================
                     ACTIVIDADES FINALES
                ================================================== --}}

                <section class="planning-section">


                    <div class="section-header">


                        <div>

                            <div style="
                                    display:flex;
                                    align-items:center;
                                    gap:12px;
                                    flex-wrap:wrap;
                                ">

                                <h2>
                                    Actividades finales
                                </h2>

                                <span id="part2Counter" class="activity-counter">
                                    0 / 10
                                </span>

                            </div>


                            <p>
                                Agregue las actividades correspondientes.
                            </p>

                        </div>


                        <button type="button" id="addPart2" class="btn-add-activity">

                            + Agregar actividad

                        </button>


                    </div>


                    <div id="part2_container" class="activities-container">

                        <div id="part2Empty" class="empty-activities">

                            <div>

                                <strong>
                                    No hay actividades agregadas
                                </strong>

                                <span>
                                    Presione «Agregar actividad» para comenzar.
                                </span>

                            </div>

                        </div>

                    </div>


                </section>


                {{-- =================================================
                     BOTONES FINALES
                ================================================== --}}

                <div class="planning-actions">


                    {{-- GUARDAR / ACTUALIZAR --}}

                    <button type="submit" id="btnGuardarPlanificacion" formaction="{{ route('planificaciones.store') }}"
                        class="btn-save">

                        Guardar planificación

                    </button>


                    {{-- GENERAR WORD --}}

                    <button type="submit" class="btn-generate">

                        <span>
                            ↓
                        </span>

                        Generar Word

                    </button>


                </div>


            </form>


        </main>

    </div>

</div>

@endsection