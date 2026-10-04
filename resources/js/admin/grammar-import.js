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

const importType =
    document.getElementById('importType');

const parentGroup =
    document.getElementById('parentGroup');

const parentSelect =
    document.getElementById('parentSelect');

const fileInput =
    document.getElementById('jsonFile');

const validateBtn =
    document.getElementById('validateBtn');

const importBtn =
    document.getElementById('importBtn');

const preview =
    document.getElementById('preview');


/*
|--------------------------------------------------------------------------
| IDs seleccionados
|--------------------------------------------------------------------------
*/

let selectedCategoryId = null;

let selectedParentId = null;


/*
|--------------------------------------------------------------------------
| Estado inicial
|--------------------------------------------------------------------------
*/

function resetImportState()
{
    grammarData = null;

    selectedParentId = null;


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


        loadLessons();

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


        parentSelect.innerHTML = `
            <option value="">
                Selecciona un Topic
            </option>
        `;


        result.data.forEach(
            topic => {

                const option =
                    document.createElement(
                        'option'
                    );


                option.value =
                    topic.id;


                option.textContent =
                    topic.name;


                parentSelect.appendChild(
                    option
                );

            }
        );


    } catch (error) {

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
| Seleccionar elemento padre
|--------------------------------------------------------------------------
*/

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
| Preview completo
|--------------------------------------------------------------------------
*/

function showCompletePreview()
{
    let topics = 0;
    let lessons = 0;
    let rules = 0;
    let examples = 0;


    grammarData.topics.forEach(
        topic => {

            topics++;


            (
                topic.lessons ?? []
            ).forEach(
                lesson => {

                    lessons++;


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

        }
    );


    preview.innerHTML = `

        <div class="preview-box">

            <div class="success">

                <h2>
                    JSON completo válido
                </h2>

            </div>


            <div class="preview-stats">

                <p>
                    <strong>
                        Categoría:
                    </strong>

                    ${escapeHtml(
                        grammarData.category.name
                    )}

                </p>


                <p>
                    <strong>
                        Nivel:
                    </strong>

                    ${escapeHtml(
                        grammarData.category.level
                    )}

                </p>


                <p>
                    <strong>
                        Topics:
                    </strong>

                    ${topics}

                </p>


                <p>
                    <strong>
                        Lessons:
                    </strong>

                    ${lessons}

                </p>


                <p>
                    <strong>
                        Rules:
                    </strong>

                    ${rules}

                </p>


                <p>
                    <strong>
                        Examples:
                    </strong>

                    ${examples}

                </p>

            </div>

        </div>

    `;
}


/*
|--------------------------------------------------------------------------
| Preview Topics
|--------------------------------------------------------------------------
*/

function showTopicsPreview()
{
    let topics = 0;
    let lessons = 0;
    let rules = 0;
    let examples = 0;


    grammarData.topics.forEach(
        topic => {

            topics++;


            (
                topic.lessons ?? []
            ).forEach(
                lesson => {

                    lessons++;


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

        }
    );


    preview.innerHTML = `

        <div class="preview-box">

            <div class="success">

                <h2>
                    JSON válido
                </h2>

            </div>


            <div class="preview-stats">

                <p>

                    <strong>
                        Tipo:
                    </strong>

                    Topics

                </p>


                <p>

                    <strong>
                        Categoría ID:
                    </strong>

                    ${escapeHtml(
                        selectedCategoryId
                    )}

                </p>


                <p>

                    <strong>
                        Topics:
                    </strong>

                    ${topics}

                </p>


                <p>

                    <strong>
                        Lessons:
                    </strong>

                    ${lessons}

                </p>


                <p>

                    <strong>
                        Rules:
                    </strong>

                    ${rules}

                </p>


                <p>

                    <strong>
                        Examples:
                    </strong>

                    ${examples}

                </p>

            </div>

        </div>

    `;
}


/*
|--------------------------------------------------------------------------
| Preview Lessons
|--------------------------------------------------------------------------
*/

function showLessonsPreview()
{
    let lessons = 0;
    let rules = 0;
    let examples = 0;


    grammarData.lessons.forEach(
        lesson => {

            lessons++;


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


    preview.innerHTML = `

        <div class="preview-box">

            <div class="success">

                <h2>
                    JSON válido
                </h2>

            </div>


            <div class="preview-stats">

                <p>

                    <strong>
                        Lessons:
                    </strong>

                    ${lessons}

                </p>


                <p>

                    <strong>
                        Rules:
                    </strong>

                    ${rules}

                </p>


                <p>

                    <strong>
                        Examples:
                    </strong>

                    ${examples}

                </p>

            </div>

        </div>

    `;
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


    preview.innerHTML = `

        <div class="preview-box">

            <div class="success">

                <h2>
                    Lesson válida
                </h2>

            </div>


            <div class="preview-stats">

                <p>

                    <strong>
                        Lesson:
                    </strong>

                    ${escapeHtml(
                        lesson.title
                    )}

                </p>


                <p>

                    <strong>
                        Rules:
                    </strong>

                    ${rules}

                </p>


                <p>

                    <strong>
                        Examples:
                    </strong>

                    ${examples}

                </p>

            </div>

        </div>

    `;
}


/*
|--------------------------------------------------------------------------
| Preview Rules
|--------------------------------------------------------------------------
*/

function showRulesPreview()
{
    preview.innerHTML = `

        <div class="preview-box">

            <div class="success">

                <h2>
                    JSON válido
                </h2>

            </div>


            <p>

                <strong>
                    Rules:
                </strong>

                ${grammarData.rules.length}

            </p>

        </div>

    `;
}


/*
|--------------------------------------------------------------------------
| Preview Examples
|--------------------------------------------------------------------------
*/

function showExamplesPreview()
{
    preview.innerHTML = `

        <div class="preview-box">

            <div class="success">

                <h2>
                    JSON válido
                </h2>

            </div>


            <p>

                <strong>
                    Examples:
                </strong>

                ${grammarData.examples.length}

            </p>

        </div>

    `;
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