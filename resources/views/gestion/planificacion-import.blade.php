@extends('layouts.app')

@section('title', 'Importar planificaciones')

@section('content')

<div class="pi-import-container">

    <div class="pi-header">

        <div>

            <h1>
                Importar planificaciones
            </h1>

            <p class="pi-description">
                Importa planificaciones de forma completa o progresiva.
                Puedes crear una o varias planificaciones con sus
                actividades y subactividades, agregar actividades a una
                planificación existente o agregar subactividades a una
                actividad existente. Todo se guarda como borrador y
                pertenece al usuario autenticado.
            </p>

        </div>

        <a
            href="{{ route('gestion.planificacion.index') }}"
            class="pi-back"
        >
            ← Volver a planificaciones
        </a>

    </div>


    {{-- TIPO DE IMPORTACIÓN --}}

    <div class="pi-form-group">

        <label for="piImportType">
            ¿Qué deseas importar?
        </label>

        <select id="piImportType">
            <option value="">
                Selecciona una opción
            </option>

            <option value="complete">
                Una planificación completa
            </option>

            <option value="multiple">
                Varias planificaciones completas
            </option>

            <option value="actividades">
                Actividades en una planificación existente
            </option>

            <option value="subactividades">
                Subactividades en una actividad existente
            </option>

        </select>

    </div>


    {{-- PLANIFICACIÓN PADRE --}}

    <div
        class="pi-form-group"
        id="piPlanificacionGroup"
        style="display: none;"
    >

        <label for="piPlanificacionSelect">
            Planificación
        </label>

        <select id="piPlanificacionSelect">
            <option value="">
                Selecciona una planificación
            </option>

            @foreach($planificaciones as $planificacion)
                <option value="{{ $planificacion->id }}">
                    #{{ $planificacion->id }} -
                    {{ $planificacion->experiencia_aprendizaje }}
                    @if($planificacion->es_plantilla)
                        (plantilla)
                    @endif
                </option>
            @endforeach

        </select>

    </div>


    {{-- ACTIVIDAD PADRE --}}

    <div
        class="pi-form-group"
        id="piActividadGroup"
        style="display: none;"
    >

        <label for="piActividadSelect">
            Actividad
        </label>

        <select id="piActividadSelect" disabled>
            <option value="">
                Selecciona una actividad
            </option>

        </select>

    </div>


    {{-- ARCHIVO JSON --}}

    <div class="pi-form-group">

        <label for="piJsonFile">
            Archivo JSON
        </label>

        <input
            type="file"
            id="piJsonFile"
            accept=".json,application/json"
            disabled
        >

        <p class="pi-hint">
            Selecciona un archivo JSON con la estructura correspondiente
            al tipo de importación. Usa "Obtener formato JSON" para ver
            un ejemplo o "Generar prompt para IA" para crear un prompt
            que extraiga los datos de una foto de la planificación.
        </p>

    </div>


    {{-- ACCIONES --}}

    <div class="pi-actions">

        <button
            type="button"
            id="piFormatBtn"
            class="pi-btn pi-btn-copy"
        >
            Obtener formato JSON
        </button>

        <button
            type="button"
            id="piPromptBtn"
            class="pi-btn pi-btn-prompt"
        >
            Generar prompt para IA
        </button>

        <button
            type="button"
            id="piValidateBtn"
            class="pi-btn pi-btn-validate"
            disabled
        >
            Validar JSON
        </button>

        <button
            type="button"
            id="piImportBtn"
            class="pi-btn pi-btn-import"
            style="display: none;"
        >
            Importar
        </button>

    </div>


    {{-- VISTA PREVIA --}}

    <div id="piPreview"></div>


    {{-- MODAL DE FORMATO JSON --}}

    <div
        class="pi-modal-overlay"
        id="piFormatModal"
        style="display: none;"
    >

        <div
            class="pi-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="piFormatModalTitle"
        >

            <div class="pi-modal-header">

                <h2 id="piFormatModalTitle">
                    Obtener formato JSON
                </h2>

                <button
                    type="button"
                    class="pi-modal-close"
                    id="piCloseFormatModal"
                    aria-label="Cerrar"
                >
                    &times;
                </button>

            </div>


            <div class="pi-modal-body">

                <div class="pi-form-group">

                    <label for="piFormatType">
                        ¿Qué vas a importar?
                    </label>

                    <select id="piFormatType">
                        <option value="complete">
                            Una planificación completa
                        </option>

                        <option value="multiple">
                            Varias planificaciones completas
                        </option>

                        <option value="actividades">
                            Actividades en una planificación existente
                        </option>

                        <option value="subactividades">
                            Subactividades en una actividad existente
                        </option>

                    </select>

                </div>


                <label class="pi-checkbox-label">

                    <input
                        type="checkbox"
                        id="piFormatAliases"
                    >

                    Usar los nombres del formulario
                    (1_experiencia_prendizaje, 2_descripcion..., etc.)

                </label>


                <p class="pi-hint">
                    El importador acepta ambos estilos de nombres. Si un
                    campo aparece en los dos formatos, se usa el nombre
                    limpio del modelo. Las planificaciones importadas
                    siempre se crean como borrador.
                </p>


                <div class="pi-form-group">

                    <label>
                        Formato generado
                    </label>

                    <pre
                        id="piFormatPreview"
                        class="pi-format-preview"
                    ></pre>

                </div>

            </div>


            <div class="pi-modal-footer">

                <p
                    id="piFormatFeedback"
                    class="pi-copy-feedback"
                ></p>

                <button
                    type="button"
                    id="piCopyFormatBtn"
                    class="pi-btn pi-btn-copy"
                >
                    Copiar JSON
                </button>

                <button
                    type="button"
                    id="piCloseFormatModalFooter"
                    class="pi-btn pi-btn-close"
                >
                    Cerrar
                </button>

            </div>

        </div>

    </div>


    {{-- MODAL DE PROMPT PARA IA --}}

    <div
        class="pi-modal-overlay"
        id="piPromptModal"
        style="display: none;"
    >

        <div
            class="pi-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="piPromptModalTitle"
        >

            <div class="pi-modal-header">

                <h2 id="piPromptModalTitle">
                    Prompt para IA (desde una foto)
                </h2>

                <button
                    type="button"
                    class="pi-modal-close"
                    id="piClosePromptModal"
                    aria-label="Cerrar"
                >
                    &times;
                </button>

            </div>


            <div class="pi-modal-body">

                <p class="pi-hint pi-prompt-intro">
                    Copia este prompt, pégalo en tu IA y adjunta la foto
                    de la tabla de planificación. La IA devolverá el JSON
                    listo para validar e importar.
                </p>


                <div class="pi-prompt-options">

                    <div class="pi-form-group">

                        <label for="piPromptType">
                            Formato del JSON
                        </label>

                        <select id="piPromptType">
                            <option value="complete">
                                Una planificación completa
                            </option>

                            <option value="multiple">
                                Varias planificaciones completas
                            </option>

                            <option value="actividades">
                                Actividades en una planificación existente
                            </option>

                            <option value="subactividades">
                                Subactividades en una actividad existente
                            </option>

                        </select>

                    </div>


                    <label class="pi-checkbox-label">

                        <input
                            type="checkbox"
                            id="piPromptAliases"
                        >

                        Usar los nombres del formulario
                        (1_experiencia_prendizaje, 2_descripcion..., etc.)

                    </label>

                </div>


                <div class="pi-form-group">

                    <label for="piPromptText">
                        Prompt generado
                    </label>

                    <textarea
                        id="piPromptText"
                        class="pi-prompt-text"
                        rows="18"
                        readonly
                    ></textarea>

                </div>

            </div>


            <div class="pi-modal-footer">

                <p
                    id="piPromptFeedback"
                    class="pi-copy-feedback"
                ></p>

                <button
                    type="button"
                    id="piCopyPromptBtn"
                    class="pi-btn pi-btn-copy"
                >
                    Copiar prompt
                </button>

                <button
                    type="button"
                    id="piClosePromptModalFooter"
                    class="pi-btn pi-btn-close"
                >
                    Cerrar
                </button>

            </div>

        </div>

    </div>

</div>

@endsection


@push('scripts')
    <script>
        window.planificacionImportConfig = {
            routes: {
                complete: "{{ route('gestion.planificacion.import.store') }}",
                actividadesList: "{{ url('/gestion/planificaciones/importar/actividades') }}",
                actividadesBase: "{{ url('/gestion/planificaciones') }}",
                subactividadesBase: "{{ url('/gestion/actividades') }}"
            }
        };
    </script>
@endpush
