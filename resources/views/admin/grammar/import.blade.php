@extends('layouts.app')

@section('content')

<div class="grammar-import-container">

    <h1>
        Importar Grammar
    </h1>

    <p class="description">
        Importa contenido de Grammar de forma progresiva.
        Puedes crear una estructura completa desde cero
        o agregar contenido a elementos existentes.
        La importación completa acepta una categoría
        o varias usando el bloque "categories".
        Cada Topic puede incluir Lessons y Exercises,
        y cada Exercise puede incluir sus Options.
    </p>


    {{-- CATEGORÍA --}}

    <div class="form-group">

        <label for="categorySelect">
            Categoría
        </label>

        <select id="categorySelect">

            <option value="">
                Sin categoría existente
            </option>

            @foreach($categories as $category)

                <option
                    value="{{ $category->id }}"
                    data-topics-count="{{ $category->topics_count }}"
                    data-lessons-count="{{ $category->lessons_count }}"
                >
                    {{ $category->level }}
                    -
                    {{ $category->name }}
                    ({{ $category->topics_count }} {{ $category->topics_count == 1 ? 'topic' : 'topics' }})
                </option>

            @endforeach

        </select>

        <button
            type="button"
            id="toggleEmptyCategoriesBtn"
            class="btn-toggle-empty"
            aria-pressed="false"
        >
            Ver categorías con topics sin lessons
        </button>

    </div>


    {{-- TIPO DE IMPORTACIÓN --}}

    <div class="form-group">

        <label for="importType">
            ¿Qué deseas importar?
        </label>

        <select id="importType">

            <option value="">
                Selecciona una opción
            </option>

            <option value="complete">
                Importación completa
            </option>

            <option value="topics">
                Topics
            </option>

            <option value="lessons">
                Lessons
            </option>

            <option value="lessons_by_topic">
                Lessons en varios Topics (por nombre)
            </option>

            <option value="lesson">
                Una Lesson
            </option>

            <option value="rules">
                Rules
            </option>

            <option value="examples">
                Examples
            </option>

            <option value="exercises">
                Exercises en un Topic
            </option>

            <option value="exercises_by_topic">
                Exercises en varios Topics (por nombre)
            </option>

            <option value="exercise">
                Un Exercise en un Topic
            </option>

            <option value="options">
                Options en un Exercise
            </option>

        </select>

    </div>


    {{-- PADRE ESPECÍFICO --}}

    <div
        class="form-group"
        id="parentGroup"
        style="display: none;"
    >

        <label for="parentSelect">
            Elemento padre
        </label>

        <select id="parentSelect">

            <option value="">
                Selecciona un elemento
            </option>

        </select>

        <button
            type="button"
            id="toggleEmptyTopicsBtn"
            class="btn-toggle-empty active"
            aria-pressed="true"
            style="display: none;"
        >
            Ocultar topics sin lessons
        </button>

    </div>


    {{-- ARCHIVO --}}

    <div class="form-group">

        <label for="jsonFile">
            Archivo JSON
        </label>

        <input
            type="file"
            id="jsonFile"
            accept=".json,application/json"
            disabled
        >

    </div>


    {{-- ACCIONES --}}

    <div class="actions">

        <button
            type="button"
            id="openFormatModalBtn"
            class="btn-copy"
        >
            Obtener formato JSON
        </button>

        <button
            type="button"
            id="validateBtn"
            disabled
        >
            Validar JSON
        </button>

        <button
            type="button"
            id="importBtn"
            class="btn-import"
            style="display: none;"
        >
            Importar
        </button>

    </div>


    {{-- PREVIEW --}}

    <div id="preview"></div>


    {{-- MODAL FORMATO JSON --}}

    <div
        class="modal-overlay"
        id="formatModal"
        style="display: none;"
    >

        <div
            class="modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="formatModalTitle"
        >

            <div class="modal-header">

                <h2 id="formatModalTitle">
                    Obtener formato JSON
                </h2>

                <button
                    type="button"
                    class="modal-close close-format-modal"
                    aria-label="Cerrar"
                >
                    &times;
                </button>

            </div>


            <div class="modal-body">

                <div class="form-group">

                    <label for="formatImportType">
                        ¿Qué vas a importar?
                    </label>

                    <select id="formatImportType">

                        <option value="complete">
                            Categoría completa
                        </option>

                        <option value="topics">
                            Topics en una categoría existente
                        </option>

                        <option value="lessons">
                            Lessons en un Topic existente
                        </option>

                        <option value="lessons_by_topic">
                            Lessons en varios Topics (por nombre)
                        </option>

                        <option value="lesson">
                            Una Lesson en un Topic existente
                        </option>

                        <option value="rules">
                            Rules en una Lesson existente
                        </option>

                        <option value="examples">
                            Examples en una Lesson existente
                        </option>

                        <option value="exercises">
                            Exercises en un Topic existente
                        </option>

                        <option value="exercises_by_topic">
                            Exercises en varios Topics (por nombre)
                        </option>

                        <option value="exercise">
                            Un Exercise en un Topic existente
                        </option>

                        <option value="options">
                            Options en un Exercise existente
                        </option>

                    </select>

                </div>


                <div
                    class="form-group"
                    id="formatExerciseTypeGroup"
                    style="display: none;"
                >

                    <label for="formatExerciseType">
                        Tipo de exercise
                    </label>

                    <select id="formatExerciseType">

                        <option value="multiple_choice">
                            Opción múltiple (multiple_choice)
                        </option>

                        <option value="fill_in_the_blank">
                            Completar espacios (fill_in_the_blank)
                        </option>

                        <option value="word_order">
                            Ordenar palabras (word_order)
                        </option>

                        <option value="matching">
                            Relacionar (matching)
                        </option>

                    </select>

                </div>


                <div
                    class="form-group"
                    id="formatLevelsGroup"
                >

                    <label>
                        Incluir en el JSON
                    </label>

                    <div class="format-options">

                        <label
                            class="format-option"
                            id="formatTopicsOption"
                        >
                            <input
                                type="checkbox"
                                id="formatIncludeTopics"
                                checked
                            >
                            Topics
                        </label>

                        <label
                            class="format-option"
                            id="formatLessonsOption"
                        >
                            <input
                                type="checkbox"
                                id="formatIncludeLessons"
                                checked
                            >
                            Lessons
                        </label>

                        <label
                            class="format-option"
                            id="formatRulesOption"
                        >
                            <input
                                type="checkbox"
                                id="formatIncludeRules"
                                checked
                            >
                            Rules
                        </label>

                        <label
                            class="format-option"
                            id="formatExamplesOption"
                        >
                            <input
                                type="checkbox"
                                id="formatIncludeExamples"
                                checked
                            >
                            Examples
                        </label>

                        <label
                            class="format-option"
                            id="formatExercisesOption"
                        >
                            <input
                                type="checkbox"
                                id="formatIncludeExercises"
                                checked
                            >
                            Exercises
                        </label>

                        <label
                            class="format-option"
                            id="formatOptionsOption"
                        >
                            <input
                                type="checkbox"
                                id="formatIncludeOptions"
                                checked
                            >
                            Options
                        </label>

                    </div>

                </div>


                <div class="form-group">

                    <label>
                        Formato generado
                    </label>

                    <pre
                        id="formatPreview"
                        class="format-preview"
                    ></pre>

                </div>

            </div>


            <div class="modal-footer">

                <p
                    id="formatFeedback"
                    class="copy-feedback"
                ></p>

                <button
                    type="button"
                    id="copyFormatBtn"
                    class="btn-copy"
                >
                    Copiar JSON
                </button>

                <button
                    type="button"
                    class="btn-close close-format-modal"
                >
                    Cerrar
                </button>

            </div>

        </div>

    </div>

</div>

@endsection