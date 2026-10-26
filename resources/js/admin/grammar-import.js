/*
|--------------------------------------------------------------------------
| Datos
|--------------------------------------------------------------------------
*/

let grammarData = null;


/*
|--------------------------------------------------------------------------
| Elementos
|--------------------------------------------------------------------------
*/

const categorySelect =
    document.getElementById('categorySelect');

const toggleEmptyCategoriesBtn =
    document.getElementById('toggleEmptyCategoriesBtn');

const importType =
    document.getElementById('importType');

const parentGroup =
    document.getElementById('parentGroup');

const parentSelect =
    document.getElementById('parentSelect');

const toggleEmptyTopicsBtn =
    document.getElementById('toggleEmptyTopicsBtn');

const fileInput =
    document.getElementById('jsonFile');

const validateBtn =
    document.getElementById('validateBtn');

const importBtn =
    document.getElementById('importBtn');

const preview =
    document.getElementById('preview');

const openFormatModalBtn =
    document.getElementById('openFormatModalBtn');

const formatModal =
    document.getElementById('formatModal');

const formatImportType =
    document.getElementById('formatImportType');

const formatExerciseTypeGroup =
    document.getElementById('formatExerciseTypeGroup');

const formatExerciseType =
    document.getElementById('formatExerciseType');

const formatLevelsGroup =
    document.getElementById('formatLevelsGroup');

const formatTopicsOption =
    document.getElementById('formatTopicsOption');

const formatLessonsOption =
    document.getElementById('formatLessonsOption');

const formatRulesOption =
    document.getElementById('formatRulesOption');

const formatExamplesOption =
    document.getElementById('formatExamplesOption');

const formatExercisesOption =
    document.getElementById('formatExercisesOption');

const formatOptionsOption =
    document.getElementById('formatOptionsOption');

const formatIncludeTopics =
    document.getElementById('formatIncludeTopics');

const formatIncludeLessons =
    document.getElementById('formatIncludeLessons');

const formatIncludeRules =
    document.getElementById('formatIncludeRules');

const formatIncludeExamples =
    document.getElementById('formatIncludeExamples');

const formatIncludeExercises =
    document.getElementById('formatIncludeExercises');

const formatIncludeOptions =
    document.getElementById('formatIncludeOptions');

const formatPreview =
    document.getElementById('formatPreview');

const copyFormatBtn =
    document.getElementById('copyFormatBtn');

const formatFeedback =
    document.getElementById('formatFeedback');

const closeFormatModalButtons =
    document.querySelectorAll(
        '.close-format-modal'
    );


/*
|--------------------------------------------------------------------------
| Plantillas JSON
|--------------------------------------------------------------------------
*/

function buildCategoryFormat()
{
    return {
        name: 'Nombre de la categoría',
        description: 'Descripción de la categoría',
        level: 'B1',
        sort_order: 1,
        status: 1
    };
}


function buildTopicFormat(selection)
{
    const topic = {
        name: 'Nombre del topic',
        description: 'Descripción del topic',
        level: 'B1',
        sort_order: 1,
        status: 1
    };


    if (selection.lessons) {

        topic.lessons = [
            buildLessonFormat(selection)
        ];

    }


    if (selection.exercises) {

        topic.exercises = [
            buildExerciseFormat(selection)
        ];

    }


    return topic;
}


function buildLessonFormat(selection)
{
    const lesson = {
        title: 'Título de la lesson',
        introduction: 'Introducción',
        uses: 'Usos',
        affirmative_structure: 'Estructura afirmativa',
        negative_structure: 'Estructura negativa',
        question_structure: 'Estructura interrogativa',
        short_answers: 'Respuestas cortas',
        common_mistakes: 'Errores comunes',
        summary: 'Resumen',
        sort_order: 1
    };


    if (selection.rules) {

        lesson.rules = [
            buildRuleFormat()
        ];

    }


    if (selection.examples) {

        lesson.examples = [
            buildExampleFormat()
        ];

    }


    return lesson;
}


function buildRuleFormat()
{
    return {
        title: 'Título de la regla',
        explanation: 'Explicación de la regla',
        examples: 'Ejemplos',
        sort_order: 1
    };
}


function buildExampleFormat()
{
    return {
        type: 'affirmative',
        english: 'English example',
        spanish: 'Ejemplo en español',
        explanation: 'Explicación',
        sort_order: 1
    };
}


function buildOptionFormat(
    optionText,
    isCorrect,
    sortOrder
)
{
    return {
        option_text:
            optionText ??
            'Texto de la opción',
        is_correct:
            isCorrect ??
            1,
        sort_order:
            sortOrder ??
            1
    };
}


function exerciseTypeHasOptions()
{
    const exerciseType =
        formatExerciseType
            ? formatExerciseType.value
            : 'multiple_choice';

    return (
        exerciseType === 'multiple_choice' ||
        exerciseType === 'matching'
    );
}


function buildExerciseFormat(selection)
{
    const exerciseType =
        selection.exerciseType ??
        'multiple_choice';

    const exercise = {
        type: exerciseType,
        question: 'Pregunta del exercise',
        instruction: 'Instrucción',
        correct_answer: 'Respuesta correcta',
        explanation: 'Explicación',
        difficulty: 'easy',
        points: 1,
        sort_order: 1,
        status: 1
    };


    /*
    |--------------------------------------------------------------------------
    | COMPLETAR ESPACIOS
    |--------------------------------------------------------------------------
    */

    if (exerciseType === 'fill_in_the_blank') {

        exercise.question =
            'She ___ a student.';

        exercise.instruction =
            'Completa el espacio con la palabra correcta.';

        exercise.correct_answer =
            'is';

        exercise.explanation =
            'Con "she" se usa "is".';

        return exercise;

    }


    /*
    |--------------------------------------------------------------------------
    | ORDENAR PALABRAS
    |--------------------------------------------------------------------------
    */

    if (exerciseType === 'word_order') {

        exercise.question =
            'student / is / She / a';

        exercise.instruction =
            'Ordena las palabras para formar la oración correcta.';

        exercise.correct_answer =
            'She is a student.';

        exercise.explanation =
            'El orden correcto es sujeto + verbo + artículo + sustantivo.';

        return exercise;

    }


    /*
    |--------------------------------------------------------------------------
    | RELACIONAR
    |--------------------------------------------------------------------------
    */

    if (exerciseType === 'matching') {

        exercise.question =
            'Relaciona cada palabra en inglés con su traducción.';

        exercise.instruction =
            'Une cada palabra con su significado correcto.';

        exercise.correct_answer =
            'Happy → Feliz; Sad → Triste; Angry → Enojado';

        exercise.explanation =
            'Cada palabra debe coincidir con su traducción.';


        if (selection.options) {

            exercise.options = [
                buildOptionFormat(
                    'Happy → Feliz',
                    1,
                    1
                ),
                buildOptionFormat(
                    'Sad → Triste',
                    1,
                    2
                ),
                buildOptionFormat(
                    'Angry → Enojado',
                    1,
                    3
                )
            ];

        }


        return exercise;

    }


    /*
    |--------------------------------------------------------------------------
    | OPCIÓN MÚLTIPLE
    |--------------------------------------------------------------------------
    */

    exercise.question =
        'She ___ happy.';

    exercise.instruction =
        'Selecciona la opción correcta.';

    exercise.correct_answer =
        'is';

    exercise.explanation =
        'Con "she" se usa "is".';


    if (selection.options) {

        exercise.options = [
            buildOptionFormat(
                'am',
                0,
                1
            ),
            buildOptionFormat(
                'is',
                1,
                2
            ),
            buildOptionFormat(
                'are',
                0,
                3
            )
        ];

    }


    return exercise;
}


function buildCategoryImportFormat(selection)
{
    const category =
        buildCategoryFormat();


    const categoryItem = selection.topics
        ? {
            category: category,
            topics: [
                buildTopicFormat(selection)
            ]
        }
        : {
            category: category
        };


    return {
        categories: [
            categoryItem
        ]
    };
}


function buildTopicsImportFormat(selection)
{
    return {
        topics: [
            buildTopicFormat(selection)
        ]
    };
}


function buildLessonsImportFormat(selection)
{
    return {
        lessons: [
            buildLessonFormat(selection)
        ]
    };
}


function buildLessonsByTopicImportFormat(selection)
{
    return {
        lessons: [
            {
                topic: 'Nombre del primer Topic existente',
                ...buildLessonFormat(selection)
            },
            {
                topic: 'Nombre del segundo Topic existente',
                ...buildLessonFormat(selection)
            }
        ]
    };
}


function buildLessonImportFormat(selection)
{
    return {
        lesson: buildLessonFormat(selection)
    };
}


function buildExercisesImportFormat(selection)
{
    return {
        exercises: [
            buildExerciseFormat(selection)
        ]
    };
}


function buildExercisesByTopicImportFormat(selection)
{
    return {
        exercises: [
            {
                topic: 'Nombre del primer Topic existente',
                ...buildExerciseFormat(selection)
            },
            {
                topic: 'Nombre del segundo Topic existente',
                ...buildExerciseFormat(selection)
            }
        ]
    };
}


function buildExerciseImportFormat(selection)
{
    return {
        exercise: buildExerciseFormat(selection)
    };
}


function buildOptionsImportFormat()
{
    return {
        options: [
            buildOptionFormat()
        ]
    };
}


/*
|--------------------------------------------------------------------------
| Selección del formato
|--------------------------------------------------------------------------
*/

function getFormatSelection()
{
    const type =
        formatImportType.value;


    const topics =
        type === 'complete'
            ? formatIncludeTopics.checked
            : true;


    let lessons =
        (
            type === 'complete' ||
            type === 'topics'
        )
            ? formatIncludeLessons.checked
            : true;


    if (!topics) {

        lessons = false;

    }


    let rules =
        (
            type === 'complete' ||
            type === 'topics' ||
            type === 'lessons' ||
            type === 'lessons_by_topic' ||
            type === 'lesson'
        )
            ? formatIncludeRules.checked
            : false;


    let examples =
        (
            type === 'complete' ||
            type === 'topics' ||
            type === 'lessons' ||
            type === 'lessons_by_topic' ||
            type === 'lesson'
        )
            ? formatIncludeExamples.checked
            : false;


    if (!lessons) {

        rules = false;
        examples = false;

    }


    let exercises =
        (
            type === 'complete' ||
            type === 'topics'
        )
            ? formatIncludeExercises.checked
            : (
                type === 'exercises' ||
                type === 'exercises_by_topic' ||
                type === 'exercise'
            );


    if (!topics) {

        exercises = false;

    }


    let options =
        (
            type === 'complete' ||
            type === 'topics'
        )
            ? formatIncludeOptions.checked
            : (
                type === 'exercises' ||
                type === 'exercises_by_topic' ||
                type === 'exercise'
            );


    if (!exercises) {

        options = false;

    }


    if (! exerciseTypeHasOptions()) {

        options = false;

    }


    return {
        type: type,
        exerciseType:
            formatExerciseType
                ? formatExerciseType.value
                : 'multiple_choice',
        topics: topics,
        lessons: lessons,
        rules: rules,
        examples: examples,
        exercises: exercises,
        options: options
    };
}


function updateFormatOptions()
{
    const type =
        formatImportType.value;


    const showTopics =
        type === 'complete';

    const showLessons =
        type === 'complete' ||
        type === 'topics';

    const showRules =
        type === 'complete' ||
        type === 'topics' ||
        type === 'lessons' ||
        type === 'lessons_by_topic' ||
        type === 'lesson';

    const showExercises =
        type === 'complete' ||
        type === 'topics' ||
        type === 'exercises' ||
        type === 'exercises_by_topic' ||
        type === 'exercise';


    setFormatOptionVisibility(
        formatTopicsOption,
        showTopics
    );

    setFormatOptionVisibility(
        formatLessonsOption,
        showLessons
    );

    setFormatOptionVisibility(
        formatRulesOption,
        showRules
    );

    setFormatOptionVisibility(
        formatExamplesOption,
        showRules
    );

    setFormatOptionVisibility(
        formatExercisesOption,
        showExercises
    );

    setFormatOptionVisibility(
        formatOptionsOption,
        showExercises &&
        exerciseTypeHasOptions()
    );


    if (formatExerciseTypeGroup) {

        formatExerciseTypeGroup.style.display =
            showExercises
                ? 'block'
                : 'none';

    }


    if (formatLevelsGroup) {

        formatLevelsGroup.style.display =
            (
                showRules ||
                showExercises
            )
                ? 'block'
                : 'none';

    }


    const topicsActive =
        type === 'complete'
            ? formatIncludeTopics.checked
            : true;


    const lessonsSelected =
        (
            type === 'complete' ||
            type === 'topics'
        )
            ? formatIncludeLessons.checked
            : true;


    const lessonsActive =
        topicsActive &&
        lessonsSelected;


    if (formatIncludeLessons) {

        formatIncludeLessons.disabled =
            !topicsActive;


        if (!topicsActive) {

            formatIncludeLessons.checked =
                false;

        }

    }


    if (formatIncludeRules) {

        formatIncludeRules.disabled =
            !lessonsActive;


        if (!lessonsActive) {

            formatIncludeRules.checked =
                false;

        }

    }


    if (formatIncludeExamples) {

        formatIncludeExamples.disabled =
            !lessonsActive;


        if (!lessonsActive) {

            formatIncludeExamples.checked =
                false;

        }

    }


    const exercisesSelected =
        (
            type === 'complete' ||
            type === 'topics'
        )
            ? formatIncludeExercises.checked
            : true;


    const exercisesActive =
        topicsActive &&
        exercisesSelected;


    if (formatIncludeExercises) {

        formatIncludeExercises.disabled =
            !topicsActive;


        if (!topicsActive) {

            formatIncludeExercises.checked =
                false;

        }

    }


    if (formatIncludeOptions) {

        formatIncludeOptions.disabled =
            !exercisesActive;


        if (!exercisesActive) {

            formatIncludeOptions.checked =
                false;

        }

    }
}


function setFormatOptionVisibility(
    element,
    visible
)
{
    if (!element) {

        return;

    }


    element.style.display =
        visible
            ? 'inline-flex'
            : 'none';
}


function renderFormatPreview()
{
    const selection =
        getFormatSelection();

    let format = null;


    if (selection.type === 'complete') {

        format =
            buildCategoryImportFormat(
                selection
            );

    } else if (selection.type === 'topics') {

        format =
            buildTopicsImportFormat(
                selection
            );

    } else if (selection.type === 'lessons') {

        format =
            buildLessonsImportFormat(
                selection
            );

    } else if (selection.type === 'lessons_by_topic') {

        format =
            buildLessonsByTopicImportFormat(
                selection
            );

    } else if (selection.type === 'lesson') {

        format =
            buildLessonImportFormat(
                selection
            );

    } else if (selection.type === 'rules') {

        format = {
            rules: [
                buildRuleFormat()
            ]
        };

    } else if (selection.type === 'examples') {

        format = {
            examples: [
                buildExampleFormat()
            ]
        };

    } else if (selection.type === 'exercises') {

        format =
            buildExercisesImportFormat(
                selection
            );

    } else if (selection.type === 'exercises_by_topic') {

        format =
            buildExercisesByTopicImportFormat(
                selection
            );

    } else if (selection.type === 'exercise') {

        format =
            buildExerciseImportFormat(
                selection
            );

    } else if (selection.type === 'options') {

        format =
            buildOptionsImportFormat();

    }


    if (formatPreview) {

        formatPreview.textContent =
            JSON.stringify(
                format,
                null,
                2
            );

    }
}


/*
|--------------------------------------------------------------------------
| Modal del formato
|--------------------------------------------------------------------------
*/

function openFormatModal()
{
    if (!formatModal) {

        return;

    }


    if (
        importType &&
        importType.value
    ) {

        formatImportType.value =
            importType.value;

    }


    formatModal.style.display =
        'flex';

    document.body.classList.add(
        'modal-open'
    );


    updateFormatOptions();

    renderFormatPreview();
}


function closeFormatModal()
{
    if (!formatModal) {

        return;

    }


    formatModal.style.display =
        'none';

    document.body.classList.remove(
        'modal-open'
    );
}


if (openFormatModalBtn) {

    openFormatModalBtn.addEventListener(
        'click',
        openFormatModal
    );

}


closeFormatModalButtons.forEach(
    function (button) {

        button.addEventListener(
            'click',
            closeFormatModal
        );

    }
);


if (formatModal) {

    formatModal.addEventListener(
        'click',
        function (event) {

            if (event.target === formatModal) {

                closeFormatModal();

            }

        }
    );

}


document.addEventListener(
    'keydown',
    function (event) {

        if (event.key === 'Escape') {

            closeFormatModal();

        }

    }
);


if (formatImportType) {

    formatImportType.addEventListener(
        'change',
        function () {

            updateFormatOptions();

            renderFormatPreview();

        }
    );

}


if (formatExerciseType) {

    formatExerciseType.addEventListener(
        'change',
        function () {

            updateFormatOptions();

            renderFormatPreview();

        }
    );

}


[
    formatIncludeTopics,
    formatIncludeLessons,
    formatIncludeRules,
    formatIncludeExamples,
    formatIncludeExercises,
    formatIncludeOptions
].forEach(
    function (checkbox) {

        if (!checkbox) {

            return;

        }


        checkbox.addEventListener(
            'change',
            function () {

                updateFormatOptions();

                renderFormatPreview();

            }
        );

    }
);


/*
|--------------------------------------------------------------------------
| Copiar formato JSON
|--------------------------------------------------------------------------
*/

if (copyFormatBtn) {

    copyFormatBtn.addEventListener(
        'click',
        async function () {

            try {

                if (!formatPreview) {

                    throw new Error(
                        'no hay un formato generado.'
                    );

                }


                await copyToClipboard(
                    formatPreview.textContent
                );

                showCopyFeedback(
                    'Formato JSON copiado al portapapeles.',
                    false
                );

            } catch (error) {

                showCopyFeedback(
                    `No se pudo copiar: ${error.message}`,
                    true
                );

            }

        }
    );

}


async function copyToClipboard(text)
{
    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        await navigator.clipboard.writeText(
            text
        );

        return;

    }


    const textarea =
        document.createElement(
            'textarea'
        );

    textarea.value = text;

    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';

    document.body.appendChild(
        textarea
    );

    textarea.focus();
    textarea.select();


    const copied =
        document.execCommand(
            'copy'
        );

    document.body.removeChild(
        textarea
    );


    if (!copied) {

        throw new Error(
            'el navegador bloqueó el portapapeles.'
        );

    }
}


let copyFeedbackTimeout = null;


function showCopyFeedback(
    message,
    isError
)
{
    if (!formatFeedback) {

        return;

    }


    formatFeedback.textContent =
        message;

    formatFeedback.className =
        isError
            ? 'copy-feedback error'
            : 'copy-feedback success';


    clearTimeout(
        copyFeedbackTimeout
    );


    copyFeedbackTimeout =
        setTimeout(
            function () {

                formatFeedback.textContent =
                    '';

                formatFeedback.className =
                    'copy-feedback';

            },
            3000
        );
}


/*
|--------------------------------------------------------------------------
| IDs seleccionados
|--------------------------------------------------------------------------
*/

let selectedCategoryId = null;

let selectedParentId = null;


/*
|--------------------------------------------------------------------------
| Topics cargados / filtro
|--------------------------------------------------------------------------
*/

let loadedTopics = [];

let showEmptyTopics = true;


/*
|--------------------------------------------------------------------------
| Categorías con topics sin lessons
|--------------------------------------------------------------------------
*/

let showCategoriesWithoutLessons = false;


function updateEmptyCategoriesButton()
{
    if (!toggleEmptyCategoriesBtn) {

        return;

    }


    toggleEmptyCategoriesBtn.classList.toggle(
        'active',
        showCategoriesWithoutLessons
    );

    toggleEmptyCategoriesBtn.setAttribute(
        'aria-pressed',
        showCategoriesWithoutLessons
            ? 'true'
            : 'false'
    );

    toggleEmptyCategoriesBtn.textContent =
        showCategoriesWithoutLessons
            ? 'Mostrar todas las categorías'
            : 'Ver categorías con topics sin lessons';
}


function applyCategoryFilter()
{
    if (!categorySelect) {

        return;

    }


    Array.from(
        categorySelect.options
    ).forEach(
        option => {

            if (option.value === '') {

                option.style.display = '';

                return;

            }


            const topicsCount =
                Number(
                    option.dataset.topicsCount ??
                    0
                );


            const lessonsCount =
                Number(
                    option.dataset.lessonsCount ??
                    0
                );


            option.style.display =
                showCategoriesWithoutLessons &&
                (
                    topicsCount === 0 ||
                    lessonsCount > 0
                )
                    ? 'none'
                    : '';

        }
    );


    const selectedOption =
        categorySelect.options[
            categorySelect.selectedIndex
        ];


    if (
        selectedOption &&
        selectedOption.style.display === 'none'
    ) {

        categorySelect.value = '';

        categorySelect.dispatchEvent(
            new Event('change')
        );

    }
}


function updateEmptyTopicsButton()
{
    if (!toggleEmptyTopicsBtn) {

        return;

    }


    toggleEmptyTopicsBtn.classList.toggle(
        'active',
        showEmptyTopics
    );

    toggleEmptyTopicsBtn.setAttribute(
        'aria-pressed',
        showEmptyTopics
            ? 'true'
            : 'false'
    );

    toggleEmptyTopicsBtn.textContent =
        showEmptyTopics
            ? 'Ocultar topics sin lessons'
            : 'Mostrar topics sin lessons';
}


function renderTopicOptions()
{
    if (!parentSelect) {

        return;

    }


    const visibleTopics =
        loadedTopics.filter(
            topic =>
                showEmptyTopics ||
                Number(topic.lessons_count) > 0
        );


    parentSelect.innerHTML = `
        <option value="">
            Selecciona un Topic
        </option>
    `;


    visibleTopics.forEach(
        topic => {

            const option =
                document.createElement(
                    'option'
                );


            option.value =
                topic.id;


            option.textContent =
                `${topic.name} · ${topic.lessons_count ?? 0} lessons`;


            parentSelect.appendChild(
                option
            );

        }
    );


    if (visibleTopics.length === 0) {

        parentSelect.innerHTML = `
            <option value="">
                No hay Topics disponibles
            </option>
        `;

    }


    const stillVisible =
        visibleTopics.some(
            topic =>
                String(topic.id) ===
                String(selectedParentId)
        );


    if (!stillVisible) {

        selectedParentId = null;

        parentSelect.value = '';


        if (fileInput) {

            fileInput.disabled = true;

        }


        if (validateBtn) {

            validateBtn.disabled = true;

        }


        if (importBtn) {

            importBtn.style.display = 'none';

        }

    } else {

        parentSelect.value =
            selectedParentId;

    }
}


/*
|--------------------------------------------------------------------------
| Estado inicial
|--------------------------------------------------------------------------
*/

function resetImportState()
{
    grammarData = null;

    selectedParentId = null;

    loadedTopics = [];

    showEmptyTopics = true;


    if (toggleEmptyTopicsBtn) {

        toggleEmptyTopicsBtn.style.display =
            'none';

        updateEmptyTopicsButton();

    }


    if (parentSelect) {

        parentSelect.innerHTML = `
            <option value="">
                Selecciona un elemento
            </option>
        `;

    }


    if (parentGroup) {

        parentGroup.style.display =
            'none';

    }


    if (fileInput) {

        fileInput.value = '';

        fileInput.disabled =
            true;

    }


    if (validateBtn) {

        validateBtn.disabled =
            true;

    }


    if (importBtn) {

        importBtn.style.display =
            'none';

    }


    if (preview) {

        preview.innerHTML =
            '';

    }
}


/*
|--------------------------------------------------------------------------
| Seleccionar categoría
|--------------------------------------------------------------------------
*/

if (toggleEmptyCategoriesBtn) {

    toggleEmptyCategoriesBtn.addEventListener(
        'click',
        function () {

            showCategoriesWithoutLessons =
                !showCategoriesWithoutLessons;


            updateEmptyCategoriesButton();

            applyCategoryFilter();

        }
    );

}


updateEmptyCategoriesButton();

applyCategoryFilter();


if (categorySelect) {

    categorySelect.addEventListener(
        'change',
        function () {

            selectedCategoryId =
                this.value || null;


            resetImportState();


            /*
            |--------------------------------------------------------------------------
            | Sin categoría existente
            |--------------------------------------------------------------------------
            |
            | Esto permite:
            |
            | Importación completa
            |
            */

            if (!selectedCategoryId) {

                if (importType) {

                    importType.disabled =
                        false;

                }

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | Categoría existente
            |--------------------------------------------------------------------------
            */

            if (importType) {

                importType.disabled =
                    false;

            }

        }
    );

}


/*
|--------------------------------------------------------------------------
| Seleccionar tipo de importación
|--------------------------------------------------------------------------
*/

if (importType) {

    importType.addEventListener(
        'change',
        function () {

            const type =
                this.value;


            grammarData =
                null;

            selectedParentId =
                null;


            if (preview) {

                preview.innerHTML =
                    '';

            }


            if (importBtn) {

                importBtn.style.display =
                    'none';

            }


            if (parentGroup) {

                parentGroup.style.display =
                    'none';

            }


            loadedTopics = [];

            showEmptyTopics = true;


            if (toggleEmptyTopicsBtn) {

                toggleEmptyTopicsBtn.style.display =
                    'none';

                updateEmptyTopicsButton();

            }


            if (parentSelect) {

                parentSelect.innerHTML = `
                    <option value="">
                        Selecciona un elemento
                    </option>
                `;

            }


            /*
            |--------------------------------------------------------------------------
            | Sin tipo
            |--------------------------------------------------------------------------
            */

            if (!type) {

                fileInput.disabled =
                    true;

                validateBtn.disabled =
                    true;

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | IMPORTACIÓN COMPLETA
            |--------------------------------------------------------------------------
            |
            | No necesita categoría existente.
            |
            */

            if (type === 'complete') {

                fileInput.disabled =
                    false;

                validateBtn.disabled =
                    false;

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | EXERCISES
            | EXERCISE
            |--------------------------------------------------------------------------
            |
            | Necesitan seleccionar un Topic.
            |
            */

            if (
                type === 'exercises' ||
                type === 'exercise'
            ) {

                if (!selectedCategoryId) {

                    preview.innerHTML = `
                        <p class="error">
                            Selecciona primero una categoría
                            para poder seleccionar un Topic.
                        </p>
                    `;

                    fileInput.disabled =
                        true;

                    validateBtn.disabled =
                        true;

                    return;

                }


                showParentSelector(
                    'topic'
                );


                fileInput.disabled =
                    true;

                validateBtn.disabled =
                    true;

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | OPTIONS
            |--------------------------------------------------------------------------
            |
            | Necesitan seleccionar un Exercise.
            |
            */

            if (type === 'options') {

                if (!selectedCategoryId) {

                    preview.innerHTML = `
                        <p class="error">
                            Selecciona primero una categoría
                            para poder seleccionar un Exercise.
                        </p>
                    `;

                    fileInput.disabled =
                        true;

                    validateBtn.disabled =
                        true;

                    return;

                }


                showParentSelector(
                    'exercise'
                );


                fileInput.disabled =
                    true;

                validateBtn.disabled =
                    true;

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | TOPICS
            |--------------------------------------------------------------------------
            |
            | Necesita categoría existente.
            |
            */

            if (type === 'topics') {

                if (!selectedCategoryId) {

                    preview.innerHTML = `
                        <p class="error">
                            Para importar Topics debes seleccionar
                            una categoría existente.
                        </p>
                    `;

                    fileInput.disabled =
                        true;

                    validateBtn.disabled =
                        true;

                    return;

                }


                selectedParentId =
                    selectedCategoryId;


                fileInput.disabled =
                    false;

                validateBtn.disabled =
                    false;

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | LESSONS EN VARIOS TOPICS (POR NOMBRE)
            |--------------------------------------------------------------------------
            |
            | Necesita categoría existente. El Topic se resuelve
            | por nombre desde el JSON.
            |
            */

            if (type === 'lessons_by_topic') {

                if (!selectedCategoryId) {

                    preview.innerHTML = `
                        <p class="error">
                            Para importar Lessons por nombre de Topic
                            debes seleccionar una categoría existente.
                        </p>
                    `;

                    fileInput.disabled =
                        true;

                    validateBtn.disabled =
                        true;

                    return;

                }


                fileInput.disabled =
                    false;

                validateBtn.disabled =
                    false;

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | EXERCISES EN VARIOS TOPICS (POR NOMBRE)
            |--------------------------------------------------------------------------
            |
            | Necesita categoría existente. El Topic se resuelve
            | por nombre desde el JSON.
            |
            */

            if (type === 'exercises_by_topic') {

                if (!selectedCategoryId) {

                    preview.innerHTML = `
                        <p class="error">
                            Para importar Exercises por nombre de Topic
                            debes seleccionar una categoría existente.
                        </p>
                    `;

                    fileInput.disabled =
                        true;

                    validateBtn.disabled =
                        true;

                    return;

                }


                fileInput.disabled =
                    false;

                validateBtn.disabled =
                    false;

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | LESSONS
            | LESSON
            |--------------------------------------------------------------------------
            |
            | Necesitan seleccionar un Topic.
            |
            */

            if (
                type === 'lessons' ||
                type === 'lesson'
            ) {

                if (!selectedCategoryId) {

                    preview.innerHTML = `
                        <p class="error">
                            Selecciona primero una categoría
                            para poder seleccionar un Topic.
                        </p>
                    `;

                    fileInput.disabled =
                        true;

                    validateBtn.disabled =
                        true;

                    return;

                }


                showParentSelector(
                    'topic'
                );


                fileInput.disabled =
                    true;

                validateBtn.disabled =
                    true;

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | RULES
            | EXAMPLES
            |--------------------------------------------------------------------------
            |
            | Necesitan seleccionar una Lesson.
            |
            */

            if (
                type === 'rules' ||
                type === 'examples'
            ) {

                if (!selectedCategoryId) {

                    preview.innerHTML = `
                        <p class="error">
                            Selecciona primero una categoría
                            para poder seleccionar una Lesson.
                        </p>
                    `;

                    fileInput.disabled =
                        true;

                    validateBtn.disabled =
                        true;

                    return;

                }


                showParentSelector(
                    'lesson'
                );


                fileInput.disabled =
                    true;

                validateBtn.disabled =
                    true;

                return;

            }

        }
    );

}


/*
|--------------------------------------------------------------------------
| Mostrar selector de padre
|--------------------------------------------------------------------------
*/

function showParentSelector(type)
{
    if (!parentGroup) {

        return;

    }


    parentGroup.style.display =
        'block';


    if (type === 'topic') {

        parentGroup
            .querySelector('label')
            .textContent =
                'Topic';


        loadTopics();

        return;

    }


    if (type === 'lesson') {

        parentGroup
            .querySelector('label')
            .textContent =
                'Lesson';


        if (toggleEmptyTopicsBtn) {

            toggleEmptyTopicsBtn.style.display =
                'none';

        }


        loadLessons();

        return;

    }


    if (type === 'exercise') {

        parentGroup
            .querySelector('label')
            .textContent =
                'Exercise';


        if (toggleEmptyTopicsBtn) {

            toggleEmptyTopicsBtn.style.display =
                'none';

        }


        loadExercises();

    }
}


/*
|--------------------------------------------------------------------------
| Cargar Topics
|--------------------------------------------------------------------------
*/

async function loadTopics()
{
    if (!selectedCategoryId) {

        return;

    }


    parentSelect.innerHTML = `
        <option value="">
            Cargando Topics...
        </option>
    `;


    try {

        const response =
            await fetch(
                `/admin/grammar/categories/${selectedCategoryId}/topics`,
                {
                    headers: {
                        'Accept':
                            'application/json'
                    }
                }
            );


        const result =
            await parseJsonResponse(
                response
            );


        if (!response.ok) {

            throw new Error(
                result.message ??
                'No se pudieron cargar los Topics.'
            );

        }


        loadedTopics =
            Array.isArray(result.data)
                ? result.data
                : [];


        renderTopicOptions();


        if (toggleEmptyTopicsBtn) {

            toggleEmptyTopicsBtn.style.display =
                'inline-block';

            updateEmptyTopicsButton();

        }


    } catch (error) {

        loadedTopics = [];


        if (toggleEmptyTopicsBtn) {

            toggleEmptyTopicsBtn.style.display =
                'none';

        }


        parentSelect.innerHTML = `
            <option value="">
                Error al cargar Topics
            </option>
        `;


        preview.innerHTML = `
            <p class="error">
                ${escapeHtml(
                    error.message
                )}
            </p>
        `;

    }
}


/*
|--------------------------------------------------------------------------
| Cargar Lessons
|--------------------------------------------------------------------------
*/

async function loadLessons()
{
    if (!selectedCategoryId) {

        return;

    }


    parentSelect.innerHTML = `
        <option value="">
            Cargando Lessons...
        </option>
    `;


    try {

        const response =
            await fetch(
                `/admin/grammar/categories/${selectedCategoryId}/lessons`,
                {
                    headers: {
                        'Accept':
                            'application/json'
                    }
                }
            );


        const result =
            await parseJsonResponse(
                response
            );


        if (!response.ok) {

            throw new Error(
                result.message ??
                'No se pudieron cargar las Lessons.'
            );

        }


        parentSelect.innerHTML = `
            <option value="">
                Selecciona una Lesson
            </option>
        `;


        result.data.forEach(
            lesson => {

                const option =
                    document.createElement(
                        'option'
                    );


                option.value =
                    lesson.id;


                option.textContent =
                    lesson.title;


                parentSelect.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        parentSelect.innerHTML = `
            <option value="">
                Error al cargar Lessons
            </option>
        `;


        preview.innerHTML = `
            <p class="error">
                ${escapeHtml(
                    error.message
                )}
            </p>
        `;

    }
}


/*
|--------------------------------------------------------------------------
| Cargar Exercises
|--------------------------------------------------------------------------
*/

async function loadExercises()
{
    if (!selectedCategoryId) {

        return;

    }


    parentSelect.innerHTML = `
        <option value="">
            Cargando Exercises...
        </option>
    `;


    try {

        const response =
            await fetch(
                `/admin/grammar/categories/${selectedCategoryId}/exercises`,
                {
                    headers: {
                        'Accept':
                            'application/json'
                    }
                }
            );


        const result =
            await parseJsonResponse(
                response
            );


        if (!response.ok) {

            throw new Error(
                result.message ??
                'No se pudieron cargar los Exercises.'
            );

        }


        parentSelect.innerHTML = `
            <option value="">
                Selecciona un Exercise
            </option>
        `;


        result.data.forEach(
            exercise => {

                const option =
                    document.createElement(
                        'option'
                    );


                option.value =
                    exercise.id;


                const topicName =
                    exercise.topic
                        ? exercise.topic.name
                        : '';


                option.textContent =
                    (
                        topicName !== ''
                            ? `[${topicName}] `
                            : ''
                    ) +
                    `[${exercise.type}] ` +
                    exercise.question;


                parentSelect.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        parentSelect.innerHTML = `
            <option value="">
                Error al cargar Exercises
            </option>
        `;


        preview.innerHTML = `
            <p class="error">
                ${escapeHtml(
                    error.message
                )}
            </p>
        `;

    }
}


/*
|--------------------------------------------------------------------------
| Seleccionar elemento padre
|--------------------------------------------------------------------------
*/

if (toggleEmptyTopicsBtn) {

    toggleEmptyTopicsBtn.addEventListener(
        'click',
        function () {

            showEmptyTopics =
                !showEmptyTopics;


            updateEmptyTopicsButton();

            renderTopicOptions();

        }
    );

}


if (parentSelect) {

    parentSelect.addEventListener(
        'change',
        function () {

            selectedParentId =
                this.value || null;


            grammarData =
                null;


            preview.innerHTML =
                '';


            importBtn.style.display =
                'none';


            if (selectedParentId) {

                fileInput.disabled =
                    false;

                validateBtn.disabled =
                    false;

            } else {

                fileInput.disabled =
                    true;

                validateBtn.disabled =
                    true;

            }

        }
    );

}


/*
|--------------------------------------------------------------------------
| Validar JSON
|--------------------------------------------------------------------------
*/

if (validateBtn) {

    validateBtn.addEventListener(
        'click',
        async function () {

            const file =
                fileInput.files[0];


            grammarData =
                null;


            importBtn.style.display =
                'none';


            if (!file) {

                preview.innerHTML = `
                    <p class="error">
                        Selecciona un archivo JSON.
                    </p>
                `;

                return;

            }


            try {

                const text =
                    await file.text();


                grammarData =
                    JSON.parse(text);


                const type =
                    importType.value;


                /*
                |--------------------------------------------------------------------------
                | IMPORTACIÓN COMPLETA
                |--------------------------------------------------------------------------
                */

                if (type === 'complete') {

                    validateCompleteJson();

                    showCompletePreview();

                    importBtn.style.display =
                        'inline-block';

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | TOPICS
                |--------------------------------------------------------------------------
                */

                if (type === 'topics') {

                    validateTopics();

                    showTopicsPreview();

                    importBtn.style.display =
                        'inline-block';

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | LESSONS EN VARIOS TOPICS (POR NOMBRE)
                |--------------------------------------------------------------------------
                */

                if (type === 'lessons_by_topic') {

                    validateLessonsByTopic();

                    await validateLessonsTopicsExist();

                    showLessonsByTopicPreview();

                    importBtn.style.display =
                        'inline-block';

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | LESSONS
                |--------------------------------------------------------------------------
                */

                if (type === 'lessons') {

                    validateLessons();

                    showLessonsPreview();

                    importBtn.style.display =
                        'inline-block';

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | LESSON
                |--------------------------------------------------------------------------
                */

                if (type === 'lesson') {

                    validateLesson();

                    showLessonPreview();

                    importBtn.style.display =
                        'inline-block';

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | RULES
                |--------------------------------------------------------------------------
                */

                if (type === 'rules') {

                    validateRules();

                    showRulesPreview();

                    importBtn.style.display =
                        'inline-block';

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | EXAMPLES
                |--------------------------------------------------------------------------
                */

                if (type === 'examples') {

                    validateExamples();

                    showExamplesPreview();

                    importBtn.style.display =
                        'inline-block';

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | EXERCISES
                |--------------------------------------------------------------------------
                */

                if (type === 'exercises') {

                    validateExercises();

                    showExercisesPreview();

                    importBtn.style.display =
                        'inline-block';

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | EXERCISES EN VARIOS TOPICS (POR NOMBRE)
                |--------------------------------------------------------------------------
                */

                if (type === 'exercises_by_topic') {

                    validateExercisesByTopic();

                    await validateExercisesTopicsExist();

                    showExercisesByTopicPreview();

                    importBtn.style.display =
                        'inline-block';

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | EXERCISE
                |--------------------------------------------------------------------------
                */

                if (type === 'exercise') {

                    validateExercise();

                    showExercisePreview();

                    importBtn.style.display =
                        'inline-block';

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | OPTIONS
                |--------------------------------------------------------------------------
                */

                if (type === 'options') {

                    validateOptions();

                    showOptionsPreview();

                    importBtn.style.display =
                        'inline-block';

                    return;

                }


                throw new Error(
                    'Selecciona un tipo de importación.'
                );


            } catch (error) {

                grammarData =
                    null;


                preview.innerHTML = `
                    <p class="error">
                        Error:
                        ${escapeHtml(
                            error.message
                        )}
                    </p>
                `;

            }

        }
    );

}


/*
|--------------------------------------------------------------------------
| Validar JSON completo
|--------------------------------------------------------------------------
*/

function validateCompleteJson()
{
    if (
        !grammarData ||
        typeof grammarData !== 'object'
    ) {

        throw new Error(
            'El JSON debe contener un objeto válido.'
        );

    }


    /*
    |--------------------------------------------------------------------------
    | VARIAS CATEGORÍAS
    |--------------------------------------------------------------------------
    */

    if (
        grammarData.categories !==
        undefined
    ) {

        if (
            !Array.isArray(
                grammarData.categories
            )
        ) {

            throw new Error(
                '"categories" debe ser un array.'
            );

        }


        validateMultipleCategoriesJson();

        return;

    }


    /*
    |--------------------------------------------------------------------------
    | CATEGORY
    |--------------------------------------------------------------------------
    */

    if (!grammarData.category) {

        throw new Error(
            'El JSON completo necesita "category".'
        );

    }


    if (!grammarData.category.name) {

        throw new Error(
            'La categoría necesita "name".'
        );

    }


    if (!grammarData.category.level) {

        throw new Error(
            'La categoría necesita "level".'
        );

    }


    if (
        grammarData.category.sort_order ===
        undefined ||
        grammarData.category.sort_order ===
        null
    ) {

        throw new Error(
            'La categoría necesita "sort_order".'
        );

    }


    if (
        grammarData.category.status ===
        undefined ||
        grammarData.category.status ===
        null
    ) {

        throw new Error(
            'La categoría necesita "status".'
        );

    }


    /*
    |--------------------------------------------------------------------------
    | TOPICS
    |--------------------------------------------------------------------------
    */

    if (
        !Array.isArray(
            grammarData.topics
        )
    ) {

        throw new Error(
            '"topics" debe ser un array.'
        );

    }


    if (
        grammarData.topics.length ===
        0
    ) {

        throw new Error(
            'El JSON no contiene ningún Topic.'
        );

    }


    grammarData.topics.forEach(
        (topic, topicIndex) => {

            validateTopicData(
                topic,
                `El Topic ${topicIndex + 1}`
            );

        }
    );
}


/*
|--------------------------------------------------------------------------
| Validar varias categorías
|--------------------------------------------------------------------------
|
| JSON:
|
| {
|     "categories": [
|         {
|             "category": {},
|             "topics": []
|         }
|     ]
| }
|
| También acepta los datos de la categoría directamente,
| sin el objeto "category".
|
*/

function validateMultipleCategoriesJson()
{
    if (
        grammarData.categories.length ===
        0
    ) {

        throw new Error(
            'El array "categories" está vacío.'
        );

    }


    grammarData.categories.forEach(
        (item, index) => {

            if (
                !item ||
                typeof item !== 'object' ||
                Array.isArray(item)
            ) {

                throw new Error(
                    `La categoría ${index + 1} debe ser un objeto.`
                );

            }


            if (
                item.category !== undefined &&
                (
                    !item.category ||
                    typeof item.category !==
                        'object' ||
                    Array.isArray(
                        item.category
                    )
                )
            ) {

                throw new Error(
                    `La categoría ${index + 1}: "category" debe ser un objeto.`
                );

            }


            const category =
                item.category ?? item;


            const prefix =
                `La categoría ${index + 1}`;


            if (!category.name) {

                throw new Error(
                    `${prefix} necesita "name".`
                );

            }


            if (!category.level) {

                throw new Error(
                    `${prefix} necesita "level".`
                );

            }


            if (
                category.sort_order ===
                undefined ||
                category.sort_order ===
                null
            ) {

                throw new Error(
                    `${prefix} necesita "sort_order".`
                );

            }


            if (
                category.status ===
                undefined ||
                category.status ===
                null
            ) {

                throw new Error(
                    `${prefix} necesita "status".`
                );

            }


            const topics =
                item.topics ?? [];


            if (!Array.isArray(topics)) {

                throw new Error(
                    `${prefix}: "topics" debe ser un array.`
                );

            }


            topics.forEach(
                (topic, topicIndex) => {

                    validateTopicData(
                        topic,
                        `${prefix} → Topic ${topicIndex + 1}`
                    );

                }
            );

        }
    );
}


/*
|--------------------------------------------------------------------------
| Obtener categorías para el preview
|--------------------------------------------------------------------------
*/

function getCompleteCategories()
{
    if (
        Array.isArray(
            grammarData.categories
        )
    ) {

        return grammarData.categories.map(
            item => ({

                category:
                    (
                        item.category &&
                        typeof item.category ===
                            'object'
                    )
                        ? item.category
                        : item,

                topics:
                    Array.isArray(item.topics)
                        ? item.topics
                        : [],

            })
        );

    }


    return [
        {

            category:
                grammarData.category,

            topics:
                Array.isArray(
                    grammarData.topics
                )
                    ? grammarData.topics
                    : [],

        }
    ];
}


/*
|--------------------------------------------------------------------------
| Validar Topics
|--------------------------------------------------------------------------
*/

function validateTopics()
{
    if (
        !grammarData ||
        typeof grammarData !== 'object'
    ) {

        throw new Error(
            'El JSON debe contener un objeto válido.'
        );

    }


    if (
        !Array.isArray(
            grammarData.topics
        )
    ) {

        throw new Error(
            '"topics" debe ser un array.'
        );

    }


    if (
        grammarData.topics.length ===
        0
    ) {

        throw new Error(
            'El array "topics" está vacío.'
        );

    }


    grammarData.topics.forEach(
        (topic, index) => {

            validateTopicData(
                topic,
                `El Topic ${index + 1}`
            );

        }
    );
}


/*
|--------------------------------------------------------------------------
| Validar Topic
|--------------------------------------------------------------------------
|
| Valida:
|
| Topic
|   └── Lessons
|       ├── Rules
|       └── Examples
|
*/

function validateTopicData(
    topic,
    prefix
)
{
    if (
        !topic ||
        typeof topic !== 'object'
    ) {

        throw new Error(
            `${prefix} debe ser un objeto.`
        );

    }


    /*
    |--------------------------------------------------------------------------
    | NAME
    |--------------------------------------------------------------------------
    */

    if (!topic.name) {

        throw new Error(
            `${prefix} necesita "name".`
        );

    }


    /*
    |--------------------------------------------------------------------------
    | LEVEL
    |--------------------------------------------------------------------------
    */

    if (!topic.level) {

        throw new Error(
            `${prefix} necesita "level".`
        );

    }


    /*
    |--------------------------------------------------------------------------
    | SORT ORDER
    |--------------------------------------------------------------------------
    */

    if (
        topic.sort_order ===
        undefined ||
        topic.sort_order ===
        null
    ) {

        throw new Error(
            `${prefix} necesita "sort_order".`
        );

    }


    /*
    |--------------------------------------------------------------------------
    | STATUS
    |--------------------------------------------------------------------------
    */

    if (
        topic.status ===
        undefined ||
        topic.status ===
        null
    ) {

        throw new Error(
            `${prefix} necesita "status".`
        );

    }


    /*
    |--------------------------------------------------------------------------
    | LESSONS
    |--------------------------------------------------------------------------
    */

    if (
        topic.lessons !== undefined &&
        !Array.isArray(
            topic.lessons
        )
    ) {

        throw new Error(
            `${prefix}: "lessons" debe ser un array.`
        );

    }


    (
        topic.lessons ?? []
    ).forEach(
        (lesson, lessonIndex) => {

            validateLessonData(
                lesson,
                `${prefix} → Lesson ${lessonIndex + 1}`
            );

        }
    );


    /*
    |--------------------------------------------------------------------------
    | EXERCISES
    |--------------------------------------------------------------------------
    */

    if (
        topic.exercises !== undefined &&
        !Array.isArray(
            topic.exercises
        )
    ) {

        throw new Error(
            `${prefix}: "exercises" debe ser un array.`
        );

    }


    (
        topic.exercises ?? []
    ).forEach(
        (exercise, exerciseIndex) => {

            validateExerciseData(
                exercise,
                `${prefix} → Exercise ${exerciseIndex + 1}`
            );

        }
    );
}


/*
|--------------------------------------------------------------------------
| Validar Lessons
|--------------------------------------------------------------------------
*/

function validateLessons()
{
    if (
        !grammarData ||
        typeof grammarData !== 'object'
    ) {

        throw new Error(
            'El JSON debe contener un objeto válido.'
        );

    }


    if (
        !Array.isArray(
            grammarData.lessons
        )
    ) {

        throw new Error(
            '"lessons" debe ser un array.'
        );

    }


    if (
        grammarData.lessons.length ===
        0
    ) {

        throw new Error(
            'El array "lessons" está vacío.'
        );

    }


    grammarData.lessons.forEach(
        (lesson, index) => {

            validateLessonData(
                lesson,
                `La Lesson ${index + 1}`
            );

        }
    );
}


/*
|--------------------------------------------------------------------------
| Validar Lessons en varios Topics
|--------------------------------------------------------------------------
|
| Cada lesson debe incluir "topic" o "topic_name".
|
*/

function validateLessonsByTopic()
{
    validateLessons();


    grammarData.lessons.forEach(
        (lesson, index) => {

            const topicName =
                String(
                    lesson.topic ??
                    lesson.topic_name ??
                    ''
                ).trim();


            if (!topicName) {

                throw new Error(
                    `La Lesson ${index + 1} necesita "topic" o "topic_name" con el nombre del Topic.`
                );

            }

        }
    );
}


/*
|--------------------------------------------------------------------------
| Validar Topics existentes en la base de datos
|--------------------------------------------------------------------------
*/

async function validateLessonsTopicsExist()
{
    await validateItemsTopicsExist(
        grammarData.lessons
    );
}


async function validateExercisesTopicsExist()
{
    await validateItemsTopicsExist(
        grammarData.exercises
    );
}


async function validateItemsTopicsExist(items)
{
    if (!selectedCategoryId) {

        throw new Error(
            'Selecciona una categoría existente.'
        );

    }


    const names = [];


    items.forEach(
        item => {

            const name =
                String(
                    item.topic ??
                    item.topic_name ??
                    ''
                ).trim();

            const key =
                name.toLowerCase();


            if (
                name !== '' &&
                !names.some(
                    existing =>
                        existing.toLowerCase() ===
                        key
                )
            ) {

                names.push(name);

            }

        }
    );


    if (names.length === 0) {

        throw new Error(
            'El JSON no contiene nombres de Topic.'
        );

    }


    const csrfElement =
        document.querySelector(
            'meta[name="csrf-token"]'
        );


    if (!csrfElement) {

        throw new Error(
            'No se encontró el token CSRF.'
        );

    }


    const response =
        await fetch(
            `/admin/grammar/categories/${selectedCategoryId}/topics/validate`,
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json',

                    'Accept':
                        'application/json',

                    'X-CSRF-TOKEN':
                        csrfElement.getAttribute(
                            'content'
                        )
                },

                body:
                    JSON.stringify({
                        names: names
                    })
            }
        );


    const result =
        await parseJsonResponse(
            response
        );


    if (!response.ok) {

        throw new Error(
            result.message ??
            'No se pudieron validar los Topics.'
        );

    }


    const missing =
        result.data?.missing ?? [];


    if (missing.length > 0) {

        throw new Error(
            `No existen estos Topics en la categoría seleccionada: ${missing.join(', ')}.`
        );

    }
}


/*
|--------------------------------------------------------------------------
| Validar Lesson completa
|--------------------------------------------------------------------------
|
| Valida:
|
| Lesson
|   ├── Rules
|   └── Examples
|
*/

function validateLesson()
{
    if (
        !grammarData ||
        typeof grammarData !== 'object'
    ) {

        throw new Error(
            'El JSON debe contener un objeto válido.'
        );

    }


    if (
        !grammarData.lesson ||
        typeof grammarData.lesson !==
            'object'
    ) {

        throw new Error(
            'El JSON necesita "lesson".'
        );

    }


    validateLessonData(
        grammarData.lesson,
        'La Lesson'
    );
}


/*
|--------------------------------------------------------------------------
| Validar datos de una Lesson
|--------------------------------------------------------------------------
*/

function validateLessonData(
    lesson,
    prefix
)
{
    if (
        !lesson ||
        typeof lesson !== 'object'
    ) {

        throw new Error(
            `${prefix} debe ser un objeto.`
        );

    }


    /*
    |--------------------------------------------------------------------------
    | TITLE
    |--------------------------------------------------------------------------
    */

    if (!lesson.title) {

        throw new Error(
            `${prefix} no tiene "title".`
        );

    }


    /*
    |--------------------------------------------------------------------------
    | SORT ORDER
    |--------------------------------------------------------------------------
    */

    if (
        lesson.sort_order ===
        undefined ||
        lesson.sort_order ===
        null
    ) {

        throw new Error(
            `${prefix} no tiene "sort_order".`
        );

    }


    /*
    |--------------------------------------------------------------------------
    | RULES
    |--------------------------------------------------------------------------
    */

    if (
        lesson.rules !== undefined &&
        !Array.isArray(
            lesson.rules
        )
    ) {

        throw new Error(
            `${prefix}: "rules" debe ser un array.`
        );

    }


    (
        lesson.rules ?? []
    ).forEach(
        (rule, ruleIndex) => {

            if (
                !rule ||
                typeof rule !== 'object'
            ) {

                throw new Error(
                    `${prefix}: la Rule ${ruleIndex + 1} debe ser un objeto.`
                );

            }


            if (!rule.title) {

                throw new Error(
                    `${prefix}: la Rule ${ruleIndex + 1} no tiene "title".`
                );

            }


            if (!rule.explanation) {

                throw new Error(
                    `${prefix}: la Rule ${ruleIndex + 1} no tiene "explanation".`
                );

            }


            if (
                rule.sort_order ===
                undefined ||
                rule.sort_order ===
                null
            ) {

                throw new Error(
                    `${prefix}: la Rule ${ruleIndex + 1} no tiene "sort_order".`
                );

            }

        }
    );


    /*
    |--------------------------------------------------------------------------
    | EXAMPLES
    |--------------------------------------------------------------------------
    */

    if (
        lesson.examples !== undefined &&
        !Array.isArray(
            lesson.examples
        )
    ) {

        throw new Error(
            `${prefix}: "examples" debe ser un array.`
        );

    }


    (
        lesson.examples ?? []
    ).forEach(
        (example, exampleIndex) => {

            if (
                !example ||
                typeof example !== 'object'
            ) {

                throw new Error(
                    `${prefix}: el Example ${exampleIndex + 1} debe ser un objeto.`
                );

            }


            if (!example.type) {

                throw new Error(
                    `${prefix}: el Example ${exampleIndex + 1} no tiene "type".`
                );

            }


            if (!example.english) {

                throw new Error(
                    `${prefix}: el Example ${exampleIndex + 1} no tiene "english".`
                );

            }


            if (
                example.sort_order ===
                undefined ||
                example.sort_order ===
                null
            ) {

                throw new Error(
                    `${prefix}: el Example ${exampleIndex + 1} no tiene "sort_order".`
                );

            }

        }
    );
}


/*
|--------------------------------------------------------------------------
| Validar Rules
|--------------------------------------------------------------------------
*/

function validateRules()
{
    if (
        !grammarData ||
        typeof grammarData !== 'object'
    ) {

        throw new Error(
            'El JSON debe contener un objeto válido.'
        );

    }


    if (
        !Array.isArray(
            grammarData.rules
        )
    ) {

        throw new Error(
            '"rules" debe ser un array.'
        );

    }


    if (
        grammarData.rules.length ===
        0
    ) {

        throw new Error(
            'El array "rules" está vacío.'
        );

    }


    grammarData.rules.forEach(
        (rule, index) => {

            if (
                !rule ||
                typeof rule !== 'object'
            ) {

                throw new Error(
                    `La Rule ${index + 1} debe ser un objeto.`
                );

            }


            if (!rule.title) {

                throw new Error(
                    `La Rule ${index + 1} no tiene "title".`
                );

            }


            if (!rule.explanation) {

                throw new Error(
                    `La Rule ${index + 1} no tiene "explanation".`
                );

            }


            if (
                rule.sort_order ===
                undefined ||
                rule.sort_order ===
                null
            ) {

                throw new Error(
                    `La Rule ${index + 1} no tiene "sort_order".`
                );

            }

        }
    );
}


/*
|--------------------------------------------------------------------------
| Validar Examples
|--------------------------------------------------------------------------
*/

function validateExamples()
{
    if (
        !grammarData ||
        typeof grammarData !== 'object'
    ) {

        throw new Error(
            'El JSON debe contener un objeto válido.'
        );

    }


    if (
        !Array.isArray(
            grammarData.examples
        )
    ) {

        throw new Error(
            '"examples" debe ser un array.'
        );

    }


    if (
        grammarData.examples.length ===
        0
    ) {

        throw new Error(
            'El array "examples" está vacío.'
        );

    }


    grammarData.examples.forEach(
        (example, index) => {

            if (
                !example ||
                typeof example !== 'object'
            ) {

                throw new Error(
                    `El Example ${index + 1} debe ser un objeto.`
                );

            }


            if (!example.type) {

                throw new Error(
                    `El Example ${index + 1} no tiene "type".`
                );

            }


            if (!example.english) {

                throw new Error(
                    `El Example ${index + 1} no tiene "english".`
                );

            }


            if (
                example.sort_order ===
                undefined ||
                example.sort_order ===
                null
            ) {

                throw new Error(
                    `El Example ${index + 1} no tiene "sort_order".`
                );

            }

        }
    );
}


/*
|--------------------------------------------------------------------------
| Validar Exercise
|--------------------------------------------------------------------------
|
| Valida:
|
| Exercise
|   └── Options
|
*/

function validateExerciseData(
    exercise,
    prefix
)
{
    if (
        !exercise ||
        typeof exercise !== 'object'
    ) {

        throw new Error(
            `${prefix} debe ser un objeto.`
        );

    }


    if (!exercise.type) {

        throw new Error(
            `${prefix} no tiene "type".`
        );

    }


    if (!exercise.question) {

        throw new Error(
            `${prefix} no tiene "question".`
        );

    }


    if (
        exercise.options !== undefined &&
        !Array.isArray(
            exercise.options
        )
    ) {

        throw new Error(
            `${prefix}: "options" debe ser un array.`
        );

    }


    (
        exercise.options ?? []
    ).forEach(
        (option, optionIndex) => {

            validateOptionData(
                option,
                `${prefix} → Option ${optionIndex + 1}`
            );

        }
    );
}


/*
|--------------------------------------------------------------------------
| Validar Option
|--------------------------------------------------------------------------
*/

function validateOptionData(
    option,
    prefix
)
{
    if (
        !option ||
        typeof option !== 'object'
    ) {

        throw new Error(
            `${prefix} debe ser un objeto.`
        );

    }


    if (!option.option_text) {

        throw new Error(
            `${prefix} no tiene "option_text".`
        );

    }
}


/*
|--------------------------------------------------------------------------
| Validar Exercises
|--------------------------------------------------------------------------
*/

function validateExercises()
{
    if (
        !grammarData ||
        typeof grammarData !== 'object'
    ) {

        throw new Error(
            'El JSON debe contener un objeto válido.'
        );

    }


    if (
        !Array.isArray(
            grammarData.exercises
        )
    ) {

        throw new Error(
            '"exercises" debe ser un array.'
        );

    }


    if (
        grammarData.exercises.length ===
        0
    ) {

        throw new Error(
            'El array "exercises" está vacío.'
        );

    }


    grammarData.exercises.forEach(
        (exercise, index) => {

            validateExerciseData(
                exercise,
                `El Exercise ${index + 1}`
            );

        }
    );
}


/*
|--------------------------------------------------------------------------
| Validar Exercises en varios Topics
|--------------------------------------------------------------------------
|
| Cada exercise debe incluir "topic" o "topic_name".
|
*/

function validateExercisesByTopic()
{
    validateExercises();


    grammarData.exercises.forEach(
        (exercise, index) => {

            const topicName =
                String(
                    exercise.topic ??
                    exercise.topic_name ??
                    ''
                ).trim();


            if (!topicName) {

                throw new Error(
                    `El Exercise ${index + 1} necesita "topic" o "topic_name" con el nombre del Topic.`
                );

            }

        }
    );
}


/*
|--------------------------------------------------------------------------
| Validar un Exercise completo
|--------------------------------------------------------------------------
*/

function validateExercise()
{
    if (
        !grammarData ||
        typeof grammarData !== 'object'
    ) {

        throw new Error(
            'El JSON debe contener un objeto válido.'
        );

    }


    if (
        !grammarData.exercise ||
        typeof grammarData.exercise !==
            'object'
    ) {

        throw new Error(
            'El JSON necesita "exercise".'
        );

    }


    validateExerciseData(
        grammarData.exercise,
        'El Exercise'
    );
}


/*
|--------------------------------------------------------------------------
| Validar Options
|--------------------------------------------------------------------------
*/

function validateOptions()
{
    if (
        !grammarData ||
        typeof grammarData !== 'object'
    ) {

        throw new Error(
            'El JSON debe contener un objeto válido.'
        );

    }


    if (
        !Array.isArray(
            grammarData.options
        )
    ) {

        throw new Error(
            '"options" debe ser un array.'
        );

    }


    if (
        grammarData.options.length ===
        0
    ) {

        throw new Error(
            'El array "options" está vacío.'
        );

    }


    grammarData.options.forEach(
        (option, index) => {

            validateOptionData(
                option,
                `La Option ${index + 1}`
            );

        }
    );
}


/*
|--------------------------------------------------------------------------
| Preview completo
|--------------------------------------------------------------------------
*/

function getHierarchyStats(topics)
{
    const stats = {
        topics: 0,
        lessons: 0,
        rules: 0,
        examples: 0,
        exercises: 0,
        options: 0,
    };


    (
        topics ?? []
    ).forEach(
        topic => {

            stats.topics++;


            (
                topic.lessons ?? []
            ).forEach(
                lesson => {

                    stats.lessons++;

                    stats.rules +=
                        (
                            lesson.rules ?? []
                        ).length;

                    stats.examples +=
                        (
                            lesson.examples ?? []
                        ).length;

                }
            );


            (
                topic.exercises ?? []
            ).forEach(
                exercise => {

                    stats.exercises++;

                    stats.options +=
                        (
                            exercise.options ?? []
                        ).length;

                }
            );

        }
    );


    return stats;
}


/*
|--------------------------------------------------------------------------
| Badges
|--------------------------------------------------------------------------
*/

function renderStatusBadge(status)
{
    const active =
        status === 1 ||
        status === '1' ||
        status === true;


    return `
        <span class="preview-badge ${active ? 'status-active' : 'status-inactive'}">
            ${active ? 'Activo' : 'Inactivo'}
        </span>
    `;
}


function renderLevelBadge(level)
{
    return `
        <span class="preview-badge level">
            ${escapeHtml(level)}
        </span>
    `;
}


function isCorrectOption(value)
{
    return (
        value === true ||
        value === 1 ||
        value === '1'
    );
}


/*
|--------------------------------------------------------------------------
| Estadísticas
|--------------------------------------------------------------------------
*/

function renderPreviewStat(
    label,
    value
)
{
    return `
        <div class="preview-stat">

            <span class="preview-stat-value">
                ${value}
            </span>

            <span class="preview-stat-label">
                ${label}
            </span>

        </div>
    `;
}


/*
|--------------------------------------------------------------------------
| Preview de una Lesson
|--------------------------------------------------------------------------
*/

function renderLessonPreview(
    lesson,
    index
)
{
    const rules =
        lesson.rules ?? [];

    const examples =
        lesson.examples ?? [];


    let rulesHtml =
        '';


    if (rules.length > 0) {

        rulesHtml = `

            <div class="preview-lesson-block">

                <p class="preview-subtitle">
                    Rules
                </p>

                <ul class="preview-list">

                    ${rules
                        .map(
                            rule => `

                                <li>
                                    <strong>
                                        ${escapeHtml(rule.title)}
                                    </strong>
                                </li>

                            `
                        )
                        .join('')}

                </ul>

            </div>

        `;

    }


    let examplesHtml =
        '';


    if (examples.length > 0) {

        examplesHtml = `

            <div class="preview-lesson-block">

                <p class="preview-subtitle">
                    Examples
                </p>

                <ul class="preview-list">

                    ${examples
                        .map(
                            example => `

                                <li>
                                    <span class="preview-badge example-type">
                                        ${escapeHtml(example.type)}
                                    </span>

                                    ${escapeHtml(example.english)}
                                </li>

                            `
                        )
                        .join('')}

                </ul>

            </div>

        `;

    }


    const body =
        rulesHtml === '' && examplesHtml === ''
            ? '<p class="preview-empty">Sin rules ni examples.</p>'
            : `${rulesHtml}${examplesHtml}`;


    return `

        <details class="preview-lesson">

            <summary>

                <span class="preview-node-title">

                    <span class="preview-node-number">
                        ${index + 1}
                    </span>

                    ${escapeHtml(lesson.title)}

                </span>


                <span class="preview-node-counts">

                    ${rules.length} rules
                    ·
                    ${examples.length} examples

                </span>

            </summary>


            <div class="preview-node-body">

                ${body}

            </div>

        </details>

    `;
}


/*
|--------------------------------------------------------------------------
| Preview de un Exercise
|--------------------------------------------------------------------------
*/

function renderExercisePreview(
    exercise,
    index
)
{
    const options =
        exercise.options ?? [];


    const fields = [];

    if (exercise.instruction) {
        fields.push([
            'Instrucción',
            exercise.instruction
        ]);
    }

    if (exercise.correct_answer) {
        fields.push([
            'Respuesta correcta',
            exercise.correct_answer
        ]);
    }

    if (exercise.explanation) {
        fields.push([
            'Explicación',
            exercise.explanation
        ]);
    }


    const fieldsHtml =
        fields.length > 0
            ? `
                <div class="preview-lesson-block">

                    <ul class="preview-list">

                        ${fields
                            .map(
                                ([label, value]) => `
                                    <li>
                                        <strong>
                                            ${escapeHtml(label)}:
                                        </strong>

                                        ${escapeHtml(value)}
                                    </li>
                                `
                            )
                            .join('')}

                    </ul>

                </div>
            `
            : '';


    const optionsHtml =
        options.length > 0
            ? `
                <div class="preview-lesson-block">

                    <p class="preview-subtitle">
                        Options
                    </p>

                    <ul class="preview-list">

                        ${options
                            .map(
                                option => `
                                    <li>
                                        ${isCorrectOption(option.is_correct)
                                            ? '<span class="preview-badge status-active">Correcta</span>'
                                            : ''}

                                        ${escapeHtml(option.option_text)}
                                    </li>
                                `
                            )
                            .join('')}

                    </ul>

                </div>
            `
            : (
                exercise.type === 'multiple_choice' ||
                exercise.type === 'matching'
            )
                ? '<p class="preview-empty">Este Exercise no contiene Options.</p>'
                : '';


    return `

        <details class="preview-lesson">

            <summary>

                <span class="preview-node-title">

                    <span class="preview-node-number">
                        ${index + 1}
                    </span>

                    ${escapeHtml(exercise.question)}

                    <span class="preview-badge example-type">
                        ${escapeHtml(exercise.type)}
                    </span>

                    ${exercise.difficulty
                        ? renderLevelBadge(exercise.difficulty)
                        : ''}

                </span>


                <span class="preview-node-counts">

                    ${options.length} options

                </span>

            </summary>


            <div class="preview-node-body">

                ${fieldsHtml}

                ${optionsHtml}

            </div>

        </details>

    `;
}


/*
|--------------------------------------------------------------------------
| Preview de un Topic
|--------------------------------------------------------------------------
*/

function renderTopicPreview(
    topic,
    index
)
{
    const lessons =
        topic.lessons ?? [];

    const exercises =
        topic.exercises ?? [];

    const stats =
        getHierarchyStats([
            topic
        ]);


    const lessonsHtml =
        lessons
            .map(
                (lesson, lessonIndex) =>
                    renderLessonPreview(
                        lesson,
                        lessonIndex
                    )
            )
            .join('');


    const exercisesHtml =
        exercises
            .map(
                (exercise, exerciseIndex) =>
                    renderExercisePreview(
                        exercise,
                        exerciseIndex
                    )
            )
            .join('');


    const body =
        lessonsHtml === '' && exercisesHtml === ''
            ? '<p class="preview-empty">Este Topic no contiene Lessons ni Exercises.</p>'
            : `
                ${lessonsHtml}

                ${exercisesHtml}
            `;


    return `

        <details class="preview-topic">

            <summary>

                <span class="preview-node-title">

                    <span class="preview-node-number">
                        ${index + 1}
                    </span>

                    ${escapeHtml(topic.name)}

                    ${renderLevelBadge(topic.level)}

                    ${renderStatusBadge(topic.status)}

                </span>


                <span class="preview-node-counts">

                    ${stats.lessons} lessons
                    ·
                    ${stats.rules} rules
                    ·
                    ${stats.examples} examples
                    ·
                    ${stats.exercises} exercises
                    ·
                    ${stats.options} options

                </span>

            </summary>


            <div class="preview-node-body">

                ${body}

            </div>

        </details>

    `;
}


/*
|--------------------------------------------------------------------------
| Preview de una Categoría
|--------------------------------------------------------------------------
*/

function renderCategoryPreview(
    item,
    index
)
{
    const category =
        item.category;

    const topics =
        item.topics ?? [];

    const stats =
        getHierarchyStats(topics);


    const topicsHtml =
        topics
            .map(
                (topic, topicIndex) =>
                    renderTopicPreview(
                        topic,
                        topicIndex
                    )
            )
            .join('');


    const description =
        category.description
            ? `
                <p class="preview-description">
                    ${escapeHtml(category.description)}
                </p>
            `
            : '';


    return `

        <details
            class="preview-category"
            ${index === 0 ? 'open' : ''}
        >

            <summary>

                <span class="preview-node-title">

                    <span class="preview-node-number">
                        ${index + 1}
                    </span>

                    ${escapeHtml(category.name)}

                    ${renderLevelBadge(category.level)}

                    ${renderStatusBadge(category.status)}

                </span>


                <span class="preview-node-counts">

                    ${stats.topics} topics
                    ·
                    ${stats.lessons} lessons
                    ·
                    ${stats.rules} rules
                    ·
                    ${stats.examples} examples
                    ·
                    ${stats.exercises} exercises
                    ·
                    ${stats.options} options

                </span>

            </summary>


            <div class="preview-node-body">

                ${description}

                ${topicsHtml || '<p class="preview-empty">Esta Categoría no contiene Topics.</p>'}

            </div>

        </details>

    `;
}


/*
|--------------------------------------------------------------------------
| Mostrar preview completo
|--------------------------------------------------------------------------
*/

function showCompletePreview()
{
    const categories =
        getCompleteCategories();


    const totals = {
        topics: 0,
        lessons: 0,
        rules: 0,
        examples: 0,
        exercises: 0,
        options: 0,
    };


    categories.forEach(
        item => {

            const stats =
                getHierarchyStats(
                    item.topics
                );


            totals.topics += stats.topics;
            totals.lessons += stats.lessons;
            totals.rules += stats.rules;
            totals.examples += stats.examples;
            totals.exercises += stats.exercises;
            totals.options += stats.options;

        }
    );


    const categoriesHtml =
        categories
            .map(
                (item, index) =>
                    renderCategoryPreview(
                        item,
                        index
                    )
            )
            .join('');


    const categoryCountText =
        categories.length === 1
            ? 'Se creará 1 categoría con el siguiente contenido.'
            : `Se crearán ${categories.length} categorías con el siguiente contenido.`;


    preview.innerHTML = `

        <div class="preview-box">

            <div class="success">

                <h2>
                    JSON completo válido
                </h2>

                <p class="preview-intro">
                    ${categoryCountText}
                </p>

            </div>


            <div class="preview-stats-grid">

                ${renderPreviewStat(
                    'Categorías',
                    categories.length
                )}

                ${renderPreviewStat(
                    'Topics',
                    totals.topics
                )}

                ${renderPreviewStat(
                    'Lessons',
                    totals.lessons
                )}

                ${renderPreviewStat(
                    'Rules',
                    totals.rules
                )}

                ${renderPreviewStat(
                    'Examples',
                    totals.examples
                )}

                ${renderPreviewStat(
                    'Exercises',
                    totals.exercises
                )}

                ${renderPreviewStat(
                    'Options',
                    totals.options
                )}

            </div>


            <h3 class="preview-tree-title">
                Contenido a importar
            </h3>


            <div class="preview-tree">

                ${categoriesHtml}

            </div>

        </div>

    `;
}


/*
|--------------------------------------------------------------------------
| Preview compartido
|--------------------------------------------------------------------------
*/

function buildPreviewBox(options)
{
    const statsHtml =
        options.stats
            .map(
                stat =>
                    renderPreviewStat(
                        stat.label,
                        stat.value
                    )
            )
            .join('');


    const introHtml =
        options.intro
            ? `
                <p class="preview-intro">
                    ${options.intro}
                </p>
            `
            : '';


    return `

        <div class="preview-box">

            <div class="success">

                <h2>
                    ${escapeHtml(options.title)}
                </h2>

                ${introHtml}

            </div>


            <div class="preview-stats-grid">

                ${statsHtml}

            </div>


            <h3 class="preview-tree-title">
                Contenido a importar
            </h3>


            <div class="preview-tree">

                ${options.treeHtml || '<p class="preview-empty">No hay contenido para importar.</p>'}

            </div>

        </div>

    `;
}


function renderRulesList(rules)
{
    return `
        <details class="preview-lesson" open>

            <summary>

                <span class="preview-node-title">

                    <span class="preview-node-number">
                        ${rules.length}
                    </span>

                    Rules

                </span>


                <span class="preview-node-counts">
                    ${rules.length} rules
                </span>

            </summary>


            <div class="preview-node-body">

                <ul class="preview-list">

                    ${rules
                        .map(
                            rule => `
                                <li>
                                    <strong>
                                        ${escapeHtml(rule.title)}
                                    </strong>
                                </li>
                            `
                        )
                        .join('')}

                </ul>

            </div>

        </details>
    `;
}


function renderExamplesList(examples)
{
    return `
        <details class="preview-lesson" open>

            <summary>

                <span class="preview-node-title">

                    <span class="preview-node-number">
                        ${examples.length}
                    </span>

                    Examples

                </span>


                <span class="preview-node-counts">
                    ${examples.length} examples
                </span>

            </summary>


            <div class="preview-node-body">

                <ul class="preview-list">

                    ${examples
                        .map(
                            example => `
                                <li>
                                    <span class="preview-badge example-type">
                                        ${escapeHtml(example.type)}
                                    </span>

                                    ${escapeHtml(example.english)}
                                </li>
                            `
                        )
                        .join('')}

                </ul>

            </div>

        </details>
    `;
}


function renderExercisesList(exercises)
{
    return `
        <details class="preview-lesson" open>

            <summary>

                <span class="preview-node-title">

                    <span class="preview-node-number">
                        ${exercises.length}
                    </span>

                    Exercises

                </span>


                <span class="preview-node-counts">
                    ${exercises.length} exercises
                </span>

            </summary>


            <div class="preview-node-body">

                ${exercises
                    .map(
                        (exercise, index) =>
                            renderExercisePreview(
                                exercise,
                                index
                            )
                    )
                    .join('')}

            </div>

        </details>
    `;
}


function renderOptionsList(options)
{
    return `
        <details class="preview-lesson" open>

            <summary>

                <span class="preview-node-title">

                    <span class="preview-node-number">
                        ${options.length}
                    </span>

                    Options

                </span>


                <span class="preview-node-counts">
                    ${options.length} options
                </span>

            </summary>


            <div class="preview-node-body">

                <ul class="preview-list">

                    ${options
                        .map(
                            option => `
                                <li>
                                    ${isCorrectOption(option.is_correct)
                                        ? '<span class="preview-badge status-active">Correcta</span>'
                                        : ''}

                                    ${escapeHtml(option.option_text)}
                                </li>
                            `
                        )
                        .join('')}

                </ul>

            </div>

        </details>
    `;
}


/*
|--------------------------------------------------------------------------
| Preview Topics
|--------------------------------------------------------------------------
*/

function showTopicsPreview()
{
    const topics =
        grammarData.topics;

    const stats =
        getHierarchyStats(topics);


    const topicsHtml =
        topics
            .map(
                (topic, index) =>
                    renderTopicPreview(
                        topic,
                        index
                    )
            )
            .join('');


    const intro =
        topics.length === 1
            ? 'Se importará 1 Topic en la categoría seleccionada.'
            : `Se importarán ${topics.length} Topics en la categoría seleccionada.`;


    preview.innerHTML = buildPreviewBox({
        title: 'JSON válido',
        intro: intro,
        stats: [
            {
                label: 'Topics',
                value: stats.topics
            },
            {
                label: 'Lessons',
                value: stats.lessons
            },
            {
                label: 'Rules',
                value: stats.rules
            },
            {
                label: 'Examples',
                value: stats.examples
            },
            {
                label: 'Exercises',
                value: stats.exercises
            },
            {
                label: 'Options',
                value: stats.options
            }
        ],
        treeHtml: topicsHtml
    });
}


/*
|--------------------------------------------------------------------------
| Preview Lessons
|--------------------------------------------------------------------------
*/

function showLessonsPreview()
{
    const lessons =
        grammarData.lessons;

    let rules = 0;
    let examples = 0;


    lessons.forEach(
        lesson => {

            rules +=
                (
                    lesson.rules ?? []
                ).length;


            examples +=
                (
                    lesson.examples ?? []
                ).length;

        }
    );


    const lessonsHtml =
        lessons
            .map(
                (lesson, index) =>
                    renderLessonPreview(
                        lesson,
                        index
                    )
            )
            .join('');


    const intro =
        lessons.length === 1
            ? 'Se importará 1 Lesson en el Topic seleccionado.'
            : `Se importarán ${lessons.length} Lessons en el Topic seleccionado.`;


    preview.innerHTML = buildPreviewBox({
        title: 'JSON válido',
        intro: intro,
        stats: [
            {
                label: 'Lessons',
                value: lessons.length
            },
            {
                label: 'Rules',
                value: rules
            },
            {
                label: 'Examples',
                value: examples
            }
        ],
        treeHtml: lessonsHtml
    });
}


/*
|--------------------------------------------------------------------------
| Preview Lessons en varios Topics
|--------------------------------------------------------------------------
*/

function showLessonsByTopicPreview()
{
    const lessons =
        grammarData.lessons;

    const groups = new Map();

    let rules = 0;
    let examples = 0;


    lessons.forEach(
        lesson => {

            const topicName =
                String(
                    lesson.topic ??
                    lesson.topic_name ??
                    ''
                ).trim();

            const key =
                topicName.toLowerCase();


            if (!groups.has(key)) {

                groups.set(
                    key,
                    {
                        name: topicName,
                        lessons: []
                    }
                );

            }


            groups
                .get(key)
                .lessons
                .push(lesson);


            rules +=
                (
                    lesson.rules ?? []
                ).length;


            examples +=
                (
                    lesson.examples ?? []
                ).length;

        }
    );


    const groupsHtml =
        Array.from(groups.values())
            .map(
                (group, index) => `
                    <details class="preview-topic" open>

                        <summary>

                            <span class="preview-node-title">

                                <span class="preview-node-number">
                                    ${index + 1}
                                </span>

                                ${escapeHtml(group.name)}

                            </span>


                            <span class="preview-node-counts">
                                ${group.lessons.length} lessons
                            </span>

                        </summary>


                        <div class="preview-node-body">

                            ${group.lessons
                                .map(
                                    (lesson, lessonIndex) =>
                                        renderLessonPreview(
                                            lesson,
                                            lessonIndex
                                        )
                                )
                                .join('')}

                        </div>

                    </details>
                `
            )
            .join('');


    const intro =
        groups.size === 1
            ? '1 Topic encontrado en la categoría seleccionada. Se importarán las lessons en él.'
            : `${groups.size} Topics encontrados en la categoría seleccionada. Se importarán las lessons en ellos.`;


    preview.innerHTML = buildPreviewBox({
        title: 'JSON válido',
        intro: intro,
        stats: [
            {
                label: 'Topics',
                value: groups.size
            },
            {
                label: 'Lessons',
                value: lessons.length
            },
            {
                label: 'Rules',
                value: rules
            },
            {
                label: 'Examples',
                value: examples
            }
        ],
        treeHtml: groupsHtml
    });
}


/*
|--------------------------------------------------------------------------
| Preview Lesson
|--------------------------------------------------------------------------
*/

function showLessonPreview()
{
    const lesson =
        grammarData.lesson;


    const rules =
        (
            lesson.rules ?? []
        ).length;


    const examples =
        (
            lesson.examples ?? []
        ).length;


    preview.innerHTML = buildPreviewBox({
        title: 'Lesson válida',
        intro: 'Se importará esta Lesson en el Topic seleccionado.',
        stats: [
            {
                label: 'Rules',
                value: rules
            },
            {
                label: 'Examples',
                value: examples
            }
        ],
        treeHtml:
            renderLessonPreview(
                lesson,
                0
            )
    });
}


/*
|--------------------------------------------------------------------------
| Preview Rules
|--------------------------------------------------------------------------
*/

function showRulesPreview()
{
    const rules =
        grammarData.rules;


    const intro =
        rules.length === 1
            ? 'Se importará 1 Rule en la Lesson seleccionada.'
            : `Se importarán ${rules.length} Rules en la Lesson seleccionada.`;


    preview.innerHTML = buildPreviewBox({
        title: 'JSON válido',
        intro: intro,
        stats: [
            {
                label: 'Rules',
                value: rules.length
            }
        ],
        treeHtml:
            renderRulesList(rules)
    });
}


/*
|--------------------------------------------------------------------------
| Preview Examples
|--------------------------------------------------------------------------
*/

function showExamplesPreview()
{
    const examples =
        grammarData.examples;


    const intro =
        examples.length === 1
            ? 'Se importará 1 Example en la Lesson seleccionada.'
            : `Se importarán ${examples.length} Examples en la Lesson seleccionada.`;


    preview.innerHTML = buildPreviewBox({
        title: 'JSON válido',
        intro: intro,
        stats: [
            {
                label: 'Examples',
                value: examples.length
            }
        ],
        treeHtml:
            renderExamplesList(examples)
    });
}


/*
|--------------------------------------------------------------------------
| Preview Exercises
|--------------------------------------------------------------------------
*/

function showExercisesPreview()
{
    const exercises =
        grammarData.exercises;

    let options = 0;


    exercises.forEach(
        exercise => {

            options +=
                (
                    exercise.options ?? []
                ).length;

        }
    );


    const intro =
        exercises.length === 1
            ? 'Se importará 1 Exercise en el Topic seleccionado.'
            : `Se importarán ${exercises.length} Exercises en el Topic seleccionado.`;


    preview.innerHTML = buildPreviewBox({
        title: 'JSON válido',
        intro: intro,
        stats: [
            {
                label: 'Exercises',
                value: exercises.length
            },
            {
                label: 'Options',
                value: options
            }
        ],
        treeHtml:
            renderExercisesList(exercises)
    });
}


/*
|--------------------------------------------------------------------------
| Preview Exercises en varios Topics
|--------------------------------------------------------------------------
*/

function showExercisesByTopicPreview()
{
    const exercises =
        grammarData.exercises;

    const groups = new Map();

    let options = 0;


    exercises.forEach(
        exercise => {

            const topicName =
                String(
                    exercise.topic ??
                    exercise.topic_name ??
                    ''
                ).trim();

            const key =
                topicName.toLowerCase();


            if (!groups.has(key)) {

                groups.set(
                    key,
                    {
                        name: topicName,
                        exercises: []
                    }
                );

            }


            groups
                .get(key)
                .exercises
                .push(exercise);


            options +=
                (
                    exercise.options ?? []
                ).length;

        }
    );


    const groupsHtml =
        Array.from(groups.values())
            .map(
                (group, index) => `
                    <details class="preview-topic" open>

                        <summary>

                            <span class="preview-node-title">

                                <span class="preview-node-number">
                                    ${index + 1}
                                </span>

                                ${escapeHtml(group.name)}

                            </span>


                            <span class="preview-node-counts">
                                ${group.exercises.length} exercises
                            </span>

                        </summary>


                        <div class="preview-node-body">

                            ${group.exercises
                                .map(
                                    (exercise, exerciseIndex) =>
                                        renderExercisePreview(
                                            exercise,
                                            exerciseIndex
                                        )
                                )
                                .join('')}

                        </div>

                    </details>
                `
            )
            .join('');


    const intro =
        groups.size === 1
            ? '1 Topic encontrado en la categoría seleccionada. Se importarán los exercises en él.'
            : `${groups.size} Topics encontrados en la categoría seleccionada. Se importarán los exercises en ellos.`;


    preview.innerHTML = buildPreviewBox({
        title: 'JSON válido',
        intro: intro,
        stats: [
            {
                label: 'Topics',
                value: groups.size
            },
            {
                label: 'Exercises',
                value: exercises.length
            },
            {
                label: 'Options',
                value: options
            }
        ],
        treeHtml: groupsHtml
    });
}


/*
|--------------------------------------------------------------------------
| Preview Exercise
|--------------------------------------------------------------------------
*/

function showExercisePreview()
{
    const exercise =
        grammarData.exercise;


    const options =
        (
            exercise.options ?? []
        ).length;


    preview.innerHTML = buildPreviewBox({
        title: 'Exercise válido',
        intro: 'Se importará este Exercise en el Topic seleccionado.',
        stats: [
            {
                label: 'Options',
                value: options
            }
        ],
        treeHtml:
            renderExercisePreview(
                exercise,
                0
            )
    });
}


/*
|--------------------------------------------------------------------------
| Preview Options
|--------------------------------------------------------------------------
*/

function showOptionsPreview()
{
    const options =
        grammarData.options;


    const intro =
        options.length === 1
            ? 'Se importará 1 Option en el Exercise seleccionado.'
            : `Se importarán ${options.length} Options en el Exercise seleccionado.`;


    preview.innerHTML = buildPreviewBox({
        title: 'JSON válido',
        intro: intro,
        stats: [
            {
                label: 'Options',
                value: options.length
            }
        ],
        treeHtml:
            renderOptionsList(options)
    });
}


/*
|--------------------------------------------------------------------------
| IMPORTAR
|--------------------------------------------------------------------------
*/

if (importBtn) {

    importBtn.addEventListener(
        'click',
        async function () {

            if (!grammarData) {

                return;

            }


            importBtn.disabled =
                true;


            importBtn.textContent =
                'Importando...';


            try {

                const csrfElement =
                    document.querySelector(
                        'meta[name="csrf-token"]'
                    );


                if (!csrfElement) {

                    throw new Error(
                        'No se encontró el token CSRF.'
                    );

                }


                const csrfToken =
                    csrfElement.getAttribute(
                        'content'
                    );


                const type =
                    importType.value;


                let url =
                    '';


                /*
                |--------------------------------------------------------------------------
                | IMPORTACIÓN COMPLETA
                |--------------------------------------------------------------------------
                */

                if (type === 'complete') {

                    url =
                        '/admin/grammar/import';

                }


                /*
                |--------------------------------------------------------------------------
                | TOPICS
                |--------------------------------------------------------------------------
                */

                else if (type === 'topics') {

                    if (!selectedCategoryId) {

                        throw new Error(
                            'Selecciona una categoría existente.'
                        );

                    }


                    url =
                        `/admin/grammar/categories/${selectedCategoryId}/topics/import`;

                }


                /*
                |--------------------------------------------------------------------------
                | LESSONS EN VARIOS TOPICS (POR NOMBRE)
                |--------------------------------------------------------------------------
                */

                else if (type === 'lessons_by_topic') {

                    if (!selectedCategoryId) {

                        throw new Error(
                            'Selecciona una categoría existente.'
                        );

                    }


                    url =
                        `/admin/grammar/categories/${selectedCategoryId}/lessons/by-topic/import`;

                }


                /*
                |--------------------------------------------------------------------------
                | LESSONS
                |--------------------------------------------------------------------------
                */

                else if (type === 'lessons') {

                    if (!selectedParentId) {

                        throw new Error(
                            'Selecciona un Topic.'
                        );

                    }


                    url =
                        `/admin/grammar/topics/${selectedParentId}/lessons/import`;

                }


                /*
                |--------------------------------------------------------------------------
                | LESSON
                |--------------------------------------------------------------------------
                */

                else if (type === 'lesson') {

                    if (!selectedParentId) {

                        throw new Error(
                            'Selecciona un Topic.'
                        );

                    }


                    url =
                        `/admin/grammar/topics/${selectedParentId}/lesson/import`;

                }


                /*
                |--------------------------------------------------------------------------
                | RULES
                |--------------------------------------------------------------------------
                */

                else if (type === 'rules') {

                    if (!selectedParentId) {

                        throw new Error(
                            'Selecciona una Lesson.'
                        );

                    }


                    url =
                        `/admin/grammar/lessons/${selectedParentId}/rules/import`;

                }


                /*
                |--------------------------------------------------------------------------
                | EXAMPLES
                |--------------------------------------------------------------------------
                */

                else if (type === 'examples') {

                    if (!selectedParentId) {

                        throw new Error(
                            'Selecciona una Lesson.'
                        );

                    }


                    url =
                        `/admin/grammar/lessons/${selectedParentId}/examples/import`;

                }


                /*
                |--------------------------------------------------------------------------
                | EXERCISES
                |--------------------------------------------------------------------------
                */

                else if (type === 'exercises') {

                    if (!selectedParentId) {

                        throw new Error(
                            'Selecciona un Topic.'
                        );

                    }


                    url =
                        `/admin/grammar/topics/${selectedParentId}/exercises/import`;

                }


                /*
                |--------------------------------------------------------------------------
                | EXERCISES EN VARIOS TOPICS (POR NOMBRE)
                |--------------------------------------------------------------------------
                */

                else if (type === 'exercises_by_topic') {

                    if (!selectedCategoryId) {

                        throw new Error(
                            'Selecciona una categoría existente.'
                        );

                    }


                    url =
                        `/admin/grammar/categories/${selectedCategoryId}/exercises/by-topic/import`;

                }


                /*
                |--------------------------------------------------------------------------
                | EXERCISE
                |--------------------------------------------------------------------------
                */

                else if (type === 'exercise') {

                    if (!selectedParentId) {

                        throw new Error(
                            'Selecciona un Topic.'
                        );

                    }


                    url =
                        `/admin/grammar/topics/${selectedParentId}/exercise/import`;

                }


                /*
                |--------------------------------------------------------------------------
                | OPTIONS
                |--------------------------------------------------------------------------
                */

                else if (type === 'options') {

                    if (!selectedParentId) {

                        throw new Error(
                            'Selecciona un Exercise.'
                        );

                    }


                    url =
                        `/admin/grammar/exercises/${selectedParentId}/options/import`;

                }


                else {

                    throw new Error(
                        'Selecciona un tipo de importación.'
                    );

                }


                /*
                |--------------------------------------------------------------------------
                | FETCH
                |--------------------------------------------------------------------------
                */

                const response =
                    await fetch(
                        url,
                        {

                            method:
                                'POST',

                            headers:
                                {

                                    'Content-Type':
                                        'application/json',

                                    'Accept':
                                        'application/json',

                                    'X-CSRF-TOKEN':
                                        csrfToken

                                },

                            body:
                                JSON.stringify(
                                    grammarData
                                )

                        }
                    );


                const result =
                    await parseJsonResponse(
                        response
                    );


                if (!response.ok) {

                    throw new Error(
                        result.message ??
                        'Error al importar.'
                    );

                }


                /*
                |--------------------------------------------------------------------------
                | RESULTADO
                |--------------------------------------------------------------------------
                */

                showImportResult(
                    result
                );


            } catch (error) {

                preview.innerHTML = `

                    <p class="error">

                        Error durante la importación:

                        ${escapeHtml(
                            error.message
                        )}

                    </p>

                `;

            } finally {

                importBtn.disabled =
                    false;


                importBtn.textContent =
                    'Importar';

            }

        }
    );

}


/*
|--------------------------------------------------------------------------
| Mostrar resultado de importación
|--------------------------------------------------------------------------
*/

function showImportResult(
    result
)
{
    const data =
        result.data ?? {};


    let details =
        '';


    if (
        data.category !== undefined
    ) {

        details += `
            <p>
                <strong>
                    Categoría:
                </strong>

                ${escapeHtml(
                    data.category
                )}
            </p>
        `;

    }


    if (
        data.categories !== undefined
    ) {

        details += `
            <p>
                <strong>
                    Categorías:
                </strong>

                ${data.categories}
            </p>
        `;

    }


    if (
        Array.isArray(
            data.category_list
        )
    ) {

        data.category_list.forEach(
            categoryResult => {

                details += `
                    <p>
                        <strong>
                            ${escapeHtml(
                                categoryResult.category
                            )}:
                        </strong>

                        ${categoryResult.topics} topics,
                        ${categoryResult.lessons} lessons,
                        ${categoryResult.rules} rules,
                        ${categoryResult.examples} examples,
                        ${categoryResult.exercises ?? 0} exercises,
                        ${categoryResult.options ?? 0} options
                    </p>
                `;

            }
        );

    }


    if (
        Array.isArray(
            data.topic_list
        )
    ) {

        data.topic_list.forEach(
            topicResult => {

                details += `
                    <p>
                        <strong>
                            ${escapeHtml(
                                topicResult.topic
                            )}:
                        </strong>

                        ${topicResult.lessons ?? 0} lessons,
                        ${topicResult.rules ?? 0} rules,
                        ${topicResult.examples ?? 0} examples,
                        ${topicResult.exercises ?? 0} exercises,
                        ${topicResult.options ?? 0} options
                    </p>
                `;

            }
        );

    }


    if (
        data.topic !== undefined
    ) {

        details += `
            <p>
                <strong>
                    Topic:
                </strong>

                ${escapeHtml(
                    data.topic
                )}
            </p>
        `;

    }


    if (
        data.lesson !== undefined
    ) {

        details += `
            <p>
                <strong>
                    Lesson:
                </strong>

                ${escapeHtml(
                    data.lesson
                )}
            </p>
        `;

    }


    if (
        data.topics !== undefined
    ) {

        details += `
            <p>
                <strong>
                    Topics:
                </strong>

                ${data.topics}
            </p>
        `;

    }


    if (
        data.lessons !== undefined
    ) {

        details += `
            <p>
                <strong>
                    Lessons:
                </strong>

                ${data.lessons}
            </p>
        `;

    }


    if (
        data.rules !== undefined
    ) {

        details += `
            <p>
                <strong>
                    Rules:
                </strong>

                ${data.rules}
            </p>
        `;

    }


    if (
        data.examples !== undefined
    ) {

        details += `
            <p>
                <strong>
                    Examples:
                </strong>

                ${data.examples}
            </p>
        `;

    }


    if (
        data.exercise !== undefined
    ) {

        details += `
            <p>
                <strong>
                    Exercise:
                </strong>

                ${escapeHtml(
                    data.exercise
                )}
            </p>
        `;

    }


    if (
        data.exercises !== undefined
    ) {

        details += `
            <p>
                <strong>
                    Exercises:
                </strong>

                ${data.exercises}
            </p>
        `;

    }


    if (
        data.options !== undefined
    ) {

        details += `
            <p>
                <strong>
                    Options:
                </strong>

                ${data.options}
            </p>
        `;

    }


    preview.innerHTML = `

        <div class="preview-box">

            <div class="success">

                <h2>
                    Importación completada
                </h2>

            </div>


            <div class="preview-stats">

                ${details}

            </div>

        </div>

    `;
}


/*
|--------------------------------------------------------------------------
| Parsear respuesta JSON
|--------------------------------------------------------------------------
|
| Evita errores como:
|
| Unexpected token '<'
|
| cuando Laravel devuelve HTML.
|--------------------------------------------------------------------------
*/

async function parseJsonResponse(
    response
)
{
    const contentType =
        response.headers.get(
            'content-type'
        ) || '';


    if (
        contentType.includes(
            'application/json'
        )
    ) {

        return await response.json();

    }


    const text =
        await response.text();


    return {

        message:
            text ||
            'El servidor devolvió una respuesta no válida.'

    };
}


/*
|--------------------------------------------------------------------------
| Escapar HTML
|--------------------------------------------------------------------------
*/

function escapeHtml(value)
{
    return String(value)
        .replaceAll(
            '&',
            '&amp;'
        )
        .replaceAll(
            '<',
            '&lt;'
        )
        .replaceAll(
            '>',
            '&gt;'
        )
        .replaceAll(
            '"',
            '&quot;'
        )
        .replaceAll(
            "'",
            '&#039;'
        );
}