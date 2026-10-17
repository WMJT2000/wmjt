
document.addEventListener('DOMContentLoaded', () => {

    /*
    |--------------------------------------------------------------------------
    | Datos
    |--------------------------------------------------------------------------
    */

    let englishData = null;
    let selectedCategoryId = null;
    let selectedWordId = null;
    let importType = null;


    /*
    |--------------------------------------------------------------------------
    | Elementos HTML
    |--------------------------------------------------------------------------
    */

    const categorySelect =
        document.getElementById('englishImportCategorySelect');

    const importTypeSelect =
        document.getElementById('englishImportType');

    const parentGroup =
        document.getElementById('englishImportParentGroup');

    const parentLabel =
        document.getElementById('englishImportParentLabel');

    const parentSelect =
        document.getElementById('englishImportParentSelect');

    const jsonFile =
        document.getElementById('englishImportJsonFile');

    const validateBtn =
        document.getElementById('englishImportValidateBtn');

    const importBtn =
        document.getElementById('englishImportImportBtn');

    const preview =
        document.getElementById('englishImportPreview');


    /*
    |--------------------------------------------------------------------------
    | Verificar elementos
    |--------------------------------------------------------------------------
    */

    if (
        !categorySelect ||
        !importTypeSelect ||
        !parentGroup ||
        !parentLabel ||
        !parentSelect ||
        !jsonFile ||
        !validateBtn ||
        !importBtn ||
        !preview
    ) {
        console.error(
            'English Import: no se encontraron todos los elementos HTML.'
        );

        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Reiniciar estado
    |--------------------------------------------------------------------------
    */

    function englishResetImportState() {

        englishData = null;
        selectedWordId = null;

        jsonFile.value = '';
        jsonFile.disabled = true;

        validateBtn.disabled = true;

        importBtn.style.display = 'none';

        preview.innerHTML = '';
        preview.style.display = 'none';

        parentSelect.innerHTML = `
            <option value="">
                Seleccione una opción
            </option>
        `;

    }


    /*
    |--------------------------------------------------------------------------
    | Seleccionar categoría
    |--------------------------------------------------------------------------
    */

    categorySelect.addEventListener('change', () => {

        selectedCategoryId =
            categorySelect.value || null;

        englishResetImportState();

        parentGroup.style.display = 'none';
        parentSelect.value = '';

        importTypeSelect.disabled = false;

        importTypeSelect.value = '';
        importType = null;

    });


    /*
    |--------------------------------------------------------------------------
    | Seleccionar tipo de importación
    |--------------------------------------------------------------------------
    */

    importTypeSelect.addEventListener('change', async () => {

        importType = importTypeSelect.value;

        englishResetImportState();

        parentGroup.style.display = 'none';
        parentSelect.value = '';

        if (!importType) {
            return;
        }


        /*
        |--------------------------------------------------------------------------
        | IMPORTACIÓN COMPLETA
        |--------------------------------------------------------------------------
        */

        if (importType === 'complete') {

            jsonFile.disabled = false;
            validateBtn.disabled = false;

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | Verificar categoría
        |--------------------------------------------------------------------------
        */

        if (!selectedCategoryId) {

            alert(
                'Debe seleccionar una categoría.'
            );

            importTypeSelect.value = '';
            importType = null;

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | VARIAS PALABRAS
        |--------------------------------------------------------------------------
        */

        if (importType === 'words') {

            selectedWordId = null;

            jsonFile.disabled = false;
            validateBtn.disabled = false;

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | UNA PALABRA
        |--------------------------------------------------------------------------
        */

        if (importType === 'word') {

            selectedWordId = null;

            jsonFile.disabled = false;
            validateBtn.disabled = false;

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | SIGNIFICADOS
        |--------------------------------------------------------------------------
        */

        if (importType === 'meanings') {

            await englishShowWordSelector();

        }

    });


    /*
    |--------------------------------------------------------------------------
    | Seleccionar palabra
    |--------------------------------------------------------------------------
    */

    parentSelect.addEventListener('change', () => {

        selectedWordId =
            parentSelect.value || null;

        jsonFile.value = '';

        englishData = null;

        importBtn.style.display = 'none';

        preview.innerHTML = '';
        preview.style.display = 'none';

        validateBtn.disabled = !selectedWordId;
        jsonFile.disabled = !selectedWordId;

    });


    /*
    |--------------------------------------------------------------------------
    | Mostrar selector de palabras
    |--------------------------------------------------------------------------
    */

    async function englishShowWordSelector() {

        parentGroup.style.display = 'block';

        parentLabel.textContent = 'Palabra';

        parentSelect.disabled = true;

        parentSelect.innerHTML = `
            <option value="">
                Cargando palabras...
            </option>
        `;

        try {

            const response = await fetch(
                `${window.englishImportConfig.routes.getWords}/${selectedCategoryId}/words`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            const result =
                await englishParseJsonResponse(response);

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    'No se pudieron cargar las palabras.'
                );

            }

            parentSelect.innerHTML = `
                <option value="">
                    Seleccione una palabra
                </option>
            `;

            result.data.forEach(word => {

                const option =
                    document.createElement('option');

                option.value = word.id;
                option.textContent = word.word;

                parentSelect.appendChild(option);

            });

            parentSelect.disabled = false;

        } catch (error) {

            parentSelect.innerHTML = `
                <option value="">
                    Error al cargar palabras
                </option>
            `;

            parentSelect.disabled = true;

            alert(error.message);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Seleccionar archivo JSON
    |--------------------------------------------------------------------------
    */

    jsonFile.addEventListener('change', () => {

        englishData = null;

        importBtn.style.display = 'none';

        preview.innerHTML = '';
        preview.style.display = 'none';

        validateBtn.disabled =
            !jsonFile.files.length;

    });


    /*
    |--------------------------------------------------------------------------
    | Validar JSON
    |--------------------------------------------------------------------------
    */

    validateBtn.addEventListener('click', async () => {

        if (!jsonFile.files.length) {

            alert(
                'Seleccione un archivo JSON.'
            );

            return;

        }

        const file = jsonFile.files[0];

        englishData = null;

        importBtn.style.display = 'none';

        preview.innerHTML = '';
        preview.style.display = 'none';

        try {

            const text = await file.text();

            englishData = JSON.parse(text);

            let result;


            /*
            |--------------------------------------------------------------------------
            | Ejecutar validación correspondiente
            |--------------------------------------------------------------------------
            */

            switch (importType) {

                case 'complete':

                    result =
                        englishValidateCompleteJson(englishData);

                    break;

                case 'words':

                    result =
                        englishValidateWords(englishData);

                    break;

                case 'word':

                    result =
                        englishValidateWord(englishData);

                    break;

                case 'meanings':

                    result =
                        englishValidateMeanings(englishData);

                    break;

                default:

                    throw new Error(
                        'Tipo de importación no válido.'
                    );

            }


            if (!result.valid) {

                throw new Error(
                    result.message
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Mostrar vista previa
            |--------------------------------------------------------------------------
            */

            switch (importType) {

                case 'complete':

                    englishShowCompletePreview(englishData);

                    break;

                case 'words':

                    englishShowWordsPreview(englishData);

                    break;

                case 'word':

                    englishShowWordPreview(englishData);

                    break;

                case 'meanings':

                    englishShowMeaningsPreview(englishData);

                    break;

            }

            importBtn.style.display = 'inline-block';

        } catch (error) {

            englishData = null;

            importBtn.style.display = 'none';

            preview.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong>
                    ${englishEscapeHtml(error.message)}
                </div>
            `;

            preview.style.display = 'block';

        }

    });


    /*
    |--------------------------------------------------------------------------
    | Importar datos
    |--------------------------------------------------------------------------
    */

    importBtn.addEventListener('click', async () => {

        if (!englishData) {

            alert(
                'Primero debe validar el archivo JSON.'
            );

            return;

        }

        importBtn.disabled = true;

        try {

            const endpoint =
                englishGetImportEndpoint();

            const response = await fetch(endpoint, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': englishGetCsrfToken()
                },

                body: JSON.stringify(englishData)

            });

            const result =
                await englishParseJsonResponse(response);

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    'No se pudo realizar la importación.'
                );

            }

            englishShowImportResult(result);

            importBtn.style.display = 'none';

        } catch (error) {

            preview.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong>
                    ${englishEscapeHtml(error.message)}
                </div>
            `;

            preview.style.display = 'block';

        } finally {

            importBtn.disabled = false;

        }

    });


    /*
    |--------------------------------------------------------------------------
    | Obtener endpoint de importación
    |--------------------------------------------------------------------------
    */

    function englishGetImportEndpoint() {

        switch (importType) {

            case 'complete':

                return window.englishImportConfig
                    .routes.importComplete;

            case 'words':

                return `${window.englishImportConfig.routes.importWords}/${selectedCategoryId}/words/import`;

            case 'word':

                return `${window.englishImportConfig.routes.importWord}/${selectedCategoryId}/word/import`;

            case 'meanings':

                if (!selectedWordId) {

                    throw new Error(
                        'Seleccione una palabra.'
                    );

                }

                return `${window.englishImportConfig.routes.importMeanings}/${selectedWordId}/meanings/import`;

            default:

                throw new Error(
                    'Tipo de importación no válido.'
                );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Validar importación completa
    |--------------------------------------------------------------------------
    */

    function englishValidateCompleteJson(data) {

    

        if (
            !data ||
            typeof data !== 'object' ||
            Array.isArray(data)
        ) {

            return {
                valid: false,
                message: 'El JSON debe contener un objeto.'
            };

        }

        if (
            !data.category ||
            typeof data.category !== 'object' ||
            Array.isArray(data.category)
        ) {

            return {
                valid: false,
                message: 'El JSON debe contener una categoría.'
            };

        }

        if (!data.category.name) {

            return {
                valid: false,
                message: 'La categoría debe tener un nombre.'
            };

        }

        if (
            !Array.isArray(data.words) ||
            data.words.length === 0
        ) {

            return {
                valid: false,
                message: 'Debe existir al menos una palabra.'
            };

        }

        for (
            let i = 0;
            i < data.words.length;
            i++
        ) {

            const result =
                englishValidateWordData(
                    data.words[i],
                    `Palabra ${i + 1}`
                );

            if (!result.valid) {
                return result;
            }

        }

        return {
            valid: true
        };

    }


    /*
    |--------------------------------------------------------------------------
    | Validar varias palabras
    |--------------------------------------------------------------------------
    */

    function englishValidateWords(data) {

    

        if (
            !data ||
            typeof data !== 'object' ||
            Array.isArray(data)
        ) {

            return {
                valid: false,
                message: 'El JSON debe contener un objeto.'
            };

        }

        if (
            !Array.isArray(data.words) ||
            data.words.length === 0
        ) {

            return {
                valid: false,
                message: 'Debe existir al menos una palabra.'
            };

        }

        for (
            let i = 0;
            i < data.words.length;
            i++
        ) {

            const result =
                englishValidateWordData(
                    data.words[i],
                    `Palabra ${i + 1}`
                );

            if (!result.valid) {
                return result;
            }

        }

        return {
            valid: true
        };

    }


    /*
    |--------------------------------------------------------------------------
    | Validar una palabra
    |--------------------------------------------------------------------------
    */

    function englishValidateWord(data) {

        if (
            !data ||
            typeof data !== 'object' ||
            Array.isArray(data)
        ) {

            return {
                valid: false,
                message: 'El JSON debe contener un objeto.'
            };

        }

        if (
            !data.word ||
            typeof data.word !== 'object' ||
            Array.isArray(data.word)
        ) {

            return {
                valid: false,
                message: 'El JSON debe contener una palabra.'
            };

        }

        return englishValidateWordData(
            data.word,
            'Palabra'
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Validar datos de una palabra
    |--------------------------------------------------------------------------
    */

    function englishValidateWordData(word, label) {

        if (
            !word ||
            typeof word !== 'object' ||
            Array.isArray(word)
        ) {

            return {
                valid: false,
                message: `${label}: estructura inválida.`
            };

        }

        if (
            typeof word.word !== 'string' ||
            !word.word.trim()
        ) {

            return {
                valid: false,
                message: `${label}: el campo "word" es obligatorio.`
            };

        }

        if (
            word.meanings !== undefined &&
            !Array.isArray(word.meanings)
        ) {

            return {
                valid: false,
                message: `${label}: "meanings" debe ser un arreglo.`
            };

        }

        if (Array.isArray(word.meanings)) {

            for (
                let i = 0;
                i < word.meanings.length;
                i++
            ) {

                if (
                    !word.meanings[i] ||
                    typeof word.meanings[i] !== 'object' ||
                    typeof word.meanings[i].meaning !== 'string' ||
                    !word.meanings[i].meaning.trim()
                ) {

                    return {
                        valid: false,
                        message:
                            `${label}: el significado ${i + 1} debe contener "meaning".`
                    };

                }

            }

        }

        return {
            valid: true
        };

    }


    /*
    |--------------------------------------------------------------------------
    | Validar significados
    |--------------------------------------------------------------------------
    */

    function englishValidateMeanings(data) {

        if (
            !data ||
            typeof data !== 'object' ||
            Array.isArray(data)
        ) {

            return {
                valid: false,
                message: 'El JSON debe contener un objeto.'
            };

        }

        if (
            !Array.isArray(data.meanings) ||
            data.meanings.length === 0
        ) {

            return {
                valid: false,
                message: 'Debe existir al menos un significado.'
            };

        }

        for (
            let i = 0;
            i < data.meanings.length;
            i++
        ) {

            const meaning = data.meanings[i];

            if (
                !meaning ||
                typeof meaning !== 'object' ||
                typeof meaning.meaning !== 'string' ||
                !meaning.meaning.trim()
            ) {

                return {
                    valid: false,
                    message:
                        `El significado ${i + 1} debe contener "meaning".`
                };

            }

        }

        return {
            valid: true
        };

    }


    /*
    |--------------------------------------------------------------------------
    | Vista previa de importación completa
    |--------------------------------------------------------------------------
    */

    function englishShowCompletePreview(data) {

        const wordsCount =
            data.words.length;

        const meaningsCount =
            data.words.reduce(
                (total, word) =>
                    total + (word.meanings?.length || 0),
                0
            );

        preview.innerHTML = `
            <div class="alert alert-info">
                <h5>Vista previa</h5>

                <p class="mb-1">
                    <strong>Categoría:</strong>
                    ${englishEscapeHtml(data.category.name)}
                </p>

                <p class="mb-1">
                    <strong>Palabras:</strong>
                    ${wordsCount}
                </p>

                <p class="mb-0">
                    <strong>Significados:</strong>
                    ${meaningsCount}
                </p>
            </div>
        `;

        preview.style.display = 'block';

    }


    /*
    |--------------------------------------------------------------------------
    | Vista previa de varias palabras
    |--------------------------------------------------------------------------
    */

    function englishShowWordsPreview(data) {

        const wordsCount =
            data.words.length;

        const meaningsCount =
            data.words.reduce(
                (total, word) =>
                    total + (word.meanings?.length || 0),
                0
            );

        preview.innerHTML = `
            <div class="alert alert-info">
                <h5>Vista previa</h5>

                <p class="mb-1">
                    <strong>Categoría:</strong>
                    ${englishEscapeHtml(
                        categorySelect.options[
                            categorySelect.selectedIndex
                        ].text
                    )}
                </p>

                <p class="mb-1">
                    <strong>Palabras:</strong>
                    ${wordsCount}
                </p>

                <p class="mb-0">
                    <strong>Significados:</strong>
                    ${meaningsCount}
                </p>
            </div>
        `;

        preview.style.display = 'block';

    }


    /*
    |--------------------------------------------------------------------------
    | Vista previa de una palabra
    |--------------------------------------------------------------------------
    */

    function englishShowWordPreview(data) {

        const word =
            data.word;

        const meaningsCount =
            word.meanings?.length || 0;

        preview.innerHTML = `
            <div class="alert alert-info">
                <h5>Vista previa</h5>

                <p class="mb-1">
                    <strong>Categoría:</strong>
                    ${englishEscapeHtml(
                        categorySelect.options[
                            categorySelect.selectedIndex
                        ].text
                    )}
                </p>

                <p class="mb-1">
                    <strong>Palabra:</strong>
                    ${englishEscapeHtml(word.word)}
                </p>

                <p class="mb-1">
                    <strong>Pronunciación:</strong>
                    ${englishEscapeHtml(
                        word.pronunciation_guide || '-'
                    )}
                </p>

                <p class="mb-1">
                    <strong>Ejemplo:</strong>
                    ${englishEscapeHtml(
                        word.example || '-'
                    )}
                </p>

                <p class="mb-0">
                    <strong>Significados:</strong>
                    ${meaningsCount}
                </p>
            </div>
        `;

        preview.style.display = 'block';

    }


    /*
    |--------------------------------------------------------------------------
    | Vista previa de significados
    |--------------------------------------------------------------------------
    */

    function englishShowMeaningsPreview(data) {

        preview.innerHTML = `
            <div class="alert alert-info">
                <h5>Vista previa</h5>

                <p class="mb-1">
                    <strong>Palabra:</strong>
                    ${englishEscapeHtml(
                        parentSelect.options[
                            parentSelect.selectedIndex
                        ].text
                    )}
                </p>

                <p class="mb-0">
                    <strong>Significados:</strong>
                    ${data.meanings.length}
                </p>
            </div>
        `;

        preview.style.display = 'block';

    }


    /*
    |--------------------------------------------------------------------------
    | Mostrar resultado de importación
    |--------------------------------------------------------------------------
    */

    function englishShowImportResult(result) {

        const data =
            result.data || {};

        let html = `
            <div class="alert alert-success">
                <h5>Importación completada</h5>

                <p class="mb-1">
                    ${englishEscapeHtml(
                        result.message ||
                        'Importación realizada correctamente.'
                    )}
                </p>
        `;

        if (data.category) {

            html += `
                <p class="mb-1">
                    <strong>Categoría:</strong>
                    ${englishEscapeHtml(
                        data.category.name ?? data.category
                    )}
                </p>
            `;

        }

        if (data.word) {

            html += `
                <p class="mb-1">
                    <strong>Palabra:</strong>
                    ${englishEscapeHtml(
                        data.word.word ?? data.word
                    )}
                </p>
            `;

        }

        if (data.words_count !== undefined) {

            html += `
                <p class="mb-1">
                    <strong>Palabras importadas:</strong>
                    ${data.words_count}
                </p>
            `;

        }

        if (data.meanings_count !== undefined) {

            html += `
                <p class="mb-0">
                    <strong>Significados importados:</strong>
                    ${data.meanings_count}
                </p>
            `;

        }

        html += '</div>';

        preview.innerHTML = html;
        preview.style.display = 'block';

    }


    /*
    |--------------------------------------------------------------------------
    | Procesar respuesta JSON
    |--------------------------------------------------------------------------
    */

    async function englishParseJsonResponse(response) {

        const contentType =
            response.headers.get('content-type') || '';

        if (!contentType.includes('application/json')) {

            await response.text();

            throw new Error(
                `El servidor devolvió una respuesta no válida. Código HTTP: ${response.status}`
            );

        }

        return await response.json();

    }


    /*
    |--------------------------------------------------------------------------
    | Obtener token CSRF
    |--------------------------------------------------------------------------
    */

    function englishGetCsrfToken() {

        const token =
            document.querySelector(
                'meta[name="csrf-token"]'
            );

        if (!token) {

            throw new Error(
                'No se encontró el token CSRF.'
            );

        }

        return token.getAttribute('content');

    }


    /*
    |--------------------------------------------------------------------------
    | Escapar HTML
    |--------------------------------------------------------------------------
    */

    function englishEscapeHtml(value) {

        const div =
            document.createElement('div');

        div.textContent = value ?? '';

        return div.innerHTML;

    }

});
