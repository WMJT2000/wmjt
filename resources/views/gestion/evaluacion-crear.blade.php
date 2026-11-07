@extends('layouts.app')

@section('title', 'Nueva evaluación')

@section('content')

<div class="evaluacion-page">

    <div class="evaluacion-header">

        <div>

            <h1>
                Nueva evaluación
            </h1>

            <p>
                Registra los datos generales, las áreas y las subáreas.
            </p>

            <a
                href="{{ route('evaluaciones.index') }}"
                class="btn-primary"
            >
                ← Volver
            </a>

        </div>

    </div>


    <script type="application/json" id="areasIniciales">@json(old('areas', []))</script>


    @if (isset($errors) && $errors->any())
        <div class="evaluacion-alert evaluacion-alert-error">
            <strong>Revisa el formulario:</strong>

            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif


    <form
        action="{{ route('evaluaciones.store') }}"
        method="POST"
        id="evaluacionForm"
        class="evaluacion-form"
    >

        @csrf

        <section class="evaluacion-datos">

            <h2 class="evaluacion-section-title">
                Datos generales
            </h2>

            <div class="evaluacion-grid">

                <div class="evaluacion-field evaluacion-field-wide">

                    <label for="nombre">
                        Nombre de la evaluación
                    </label>

                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value="{{ old('nombre') }}"
                        placeholder="Ej. Evaluación de destrezas del primer periodo"
                        maxlength="255"
                        required
                    >

                </div>


                <div class="evaluacion-field">

                    <label for="tipo_evaluacion">
                        Tipo de evaluación
                    </label>

                    <input
                        type="text"
                        id="tipo_evaluacion"
                        name="tipo_evaluacion"
                        value="{{ old('tipo_evaluacion') }}"
                        placeholder="Ej. Evaluación de Destrezas"
                        maxlength="255"
                        required
                    >

                </div>


                <div class="evaluacion-field">

                    <label for="docente">
                        Docente
                    </label>

                    <input
                        type="text"
                        id="docente"
                        name="docente"
                        value="{{ old('docente', 'Tnlg. Juliana Coyago') }}"
                        maxlength="255"
                    >

                </div>


                <div class="evaluacion-field">

                    <label for="fecha_inicio">
                        Periodo
                    </label>

                    <div class="evaluacion-date-range">

                        <input
                            type="date"
                            id="fecha_inicio"
                            name="fecha_inicio"
                            value="{{ old('fecha_inicio') }}"
                            required
                        >

                        <span>
                            al
                        </span>

                        <input
                            type="date"
                            id="fecha_fin"
                            name="fecha_fin"
                            value="{{ old('fecha_fin') }}"
                            required
                        >

                    </div>

                </div>


                <div class="evaluacion-field evaluacion-field-wide">

                    <label for="proyecto">
                        Proyecto
                    </label>

                    <input
                        type="text"
                        id="proyecto"
                        name="proyecto"
                        value="{{ old('proyecto') }}"
                        maxlength="255"
                    >

                </div>

            </div>

        </section>


        <section class="evaluacion-datos">

            <h2 class="evaluacion-section-title">
                Áreas y subáreas
            </h2>

            <div class="evaluacion-import-toggle">

                <button
                    type="button"
                    id="btnToggleImportarJson"
                    class="evaluacion-btn evaluacion-btn-secondary"
                    aria-expanded="false"
                    aria-controls="panelImportarJson"
                >
                    <span
                        id="importToggleIcon"
                        class="evaluacion-import-toggle-icon"
                        aria-hidden="true"
                    >
                        ▸
                    </span>

                    Importar desde JSON
                </button>

            </div>

            <div
                id="panelImportarJson"
                class="evaluacion-import"
                hidden
            >

                <div class="evaluacion-field">

                    <label for="areasJson">
                        Importar desde JSON
                    </label>

                    <textarea
                        id="areasJson"
                        rows="6"
                        placeholder='Ejemplo: [{"nombre":"Comunicación","subareas":["Escucha","Habla"]}]'
                    ></textarea>

                    <small class="evaluacion-import-help">
                        Formato: un array de áreas o un objeto con la clave
                        <code>areas</code>. Cada área necesita
                        <code>nombre</code> y <code>subareas</code> (mínimo una,
                        sugerido: entre 3 y 6).
                        Las subáreas pueden ser textos u objetos con
                        <code>nombre</code>.
                    </small>

                </div>

                <div class="evaluacion-import-actions">

                    <button
                        type="button"
                        id="btnImportarReemplazar"
                        class="evaluacion-btn evaluacion-btn-secondary"
                    >
                        Importar y reemplazar
                    </button>

                    <button
                        type="button"
                        id="btnImportarAgregar"
                        class="evaluacion-btn evaluacion-btn-secondary"
                    >
                        Agregar a las actuales
                    </button>

                    <button
                        type="button"
                        id="btnGenerarPromptIa"
                        class="evaluacion-btn"
                    >
                        Generar prompt para IA
                    </button>

                    <button
                        type="button"
                        id="btnBorrarAreas"
                        class="evaluacion-btn evaluacion-btn-danger"
                    >
                        Borrar todas
                    </button>

                </div>

                <div
                    id="areasImportMessage"
                    class="evaluacion-import-message"
                    role="status"
                    aria-live="polite"
                    hidden
                ></div>

            </div>

        </section>


        <div
            id="areasContainer"
            class="areas-container"
        ></div>


        <div class="evaluacion-form-actions">

            <button
                type="button"
                id="btnAgregarArea"
                class="btn-primary"
            >
                + Agregar área
            </button>


            <button
                type="submit"
                class="btn-generate"
            >
                <span>
                    ✓
                </span>

                Guardar evaluación

            </button>

        </div>

    </form>


    <div
        id="temasIaModal"
        class="evaluacion-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="temasIaTitle"
        hidden
    >

        <div class="evaluacion-modal-content">

            <div class="evaluacion-modal-header">

                <h2 id="temasIaTitle">
                    Ingresa los temas
                </h2>

                <button
                    type="button"
                    id="btnCerrarTemasIa"
                    class="evaluacion-btn-remove"
                    title="Cerrar"
                    aria-label="Cerrar"
                >
                    ×
                </button>

            </div>

            <p class="evaluacion-muted">
                Escribe los temas separados por comas. Ejemplo:
                <br>
                <strong>familia, hogar, emociones, cuerpo, naturaleza</strong>
            </p>

            <div class="evaluacion-field">

                <label for="temasIaInput">
                    Temas
                </label>

                <textarea
                    id="temasIaInput"
                    name="temasIa"
                    placeholder="Ej. familia, hogar, emociones"
                    maxlength="500"
                    rows="4"
                    style="padding: 12px 16px; font-size: 15px; resize: vertical;"
                ></textarea>

                <small class="evaluacion-import-help">
                    Los temas se usarán para redactar las subáreas de cada
                    área del proyecto.
                </small>

            </div>

            <div class="evaluacion-limites-grid">

                <div class="evaluacion-field">

                    <label for="limiteSubareasMin">
                        Subáreas por área (mín.)
                    </label>

                    <input
                        type="number"
                        id="limiteSubareasMin"
                        name="limite_subareas_min"
                        value="3"
                        min="1"
                        max="20"
                    >

                </div>

                <div class="evaluacion-field">

                    <label for="limiteSubareasMax">
                        Subáreas por área (máx.)
                    </label>

                    <input
                        type="number"
                        id="limiteSubareasMax"
                        name="limite_subareas_max"
                        value="6"
                        min="1"
                        max="20"
                    >

                </div>

                <div class="evaluacion-field">

                    <label for="limitePalabrasMin">
                        Palabras por subárea (mín.)
                    </label>

                    <input
                        type="number"
                        id="limitePalabrasMin"
                        name="limite_palabras_min"
                        value="5"
                        min="1"
                        max="50"
                    >

                </div>

                <div class="evaluacion-field">

                    <label for="limitePalabrasMax">
                        Palabras por subárea (máx.)
                    </label>

                    <input
                        type="number"
                        id="limitePalabrasMax"
                        name="limite_palabras_max"
                        value="15"
                        min="1"
                        max="50"
                    >

                </div>

            </div>

            <small class="evaluacion-import-help">
                Estos límites se usan en la instrucción del prompt. Si un
                campo queda vacío o inválido se toma el valor por defecto.
            </small>

            <div id="temasIaMessage" class="evaluacion-import-message" role="status" aria-live="polite" hidden></div>

            <div class="evaluacion-modal-actions">

                <button
                    type="button"
                    id="btnAceptarTemasIa"
                    class="evaluacion-btn"
                >
                    Aceptar y generar prompt
                </button>

                <button
                    type="button"
                    id="btnCerrarTemasIaFooter"
                    class="evaluacion-btn evaluacion-btn-secondary"
                >
                    Cancelar
                </button>

            </div>

        </div>

    </div>

    <div
        id="promptIaModal"
        class="evaluacion-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="promptIaTitle"
        hidden
    >

        <div class="evaluacion-modal-content">

            <div class="evaluacion-modal-header">

                <h2 id="promptIaTitle">
                    Prompt para IA
                </h2>

                <button
                    type="button"
                    id="btnCerrarPromptIa"
                    class="evaluacion-btn-remove"
                    title="Cerrar"
                    aria-label="Cerrar"
                >
                    ×
                </button>

            </div>

            <p class="evaluacion-muted">
                Copia este prompt, pégalo en tu IA y luego importa el JSON
                que te devuelva en el campo de arriba.
            </p>

            <textarea
                id="promptIaTexto"
                rows="14"
                readonly
            ></textarea>

            <div class="evaluacion-modal-actions">

                <button
                    type="button"
                    id="btnCopiarPromptIa"
                    class="evaluacion-btn"
                >
                    Copiar prompt
                </button>

                <button
                    type="button"
                    id="btnCerrarPromptIaFooter"
                    class="evaluacion-btn evaluacion-btn-secondary"
                >
                    Cerrar
                </button>

            </div>

            <div
                id="promptIaMessage"
                class="evaluacion-import-message"
                role="status"
                aria-live="polite"
                hidden
            ></div>

        </div>

    </div>

</div>

@endsection
