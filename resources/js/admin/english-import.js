document.addEventListener('DOMContentLoaded', () => {
    let englishData = null;
    let selectedCategoryId = null;
    let selectedWordId = null;
    let importType = null;

    const categorySelect = document.getElementById('categorySelect');
    const importTypeSelect = document.getElementById('importType');
    const parentGroup = document.getElementById('parentGroup');
    const parentLabel = document.getElementById('parentLabel');
    const parentSelect = document.getElementById('parentSelect');
    const jsonFile = document.getElementById('jsonFile');
    const validateBtn = document.getElementById('validateBtn');
    const importBtn = document.getElementById('importBtn');
    const preview = document.getElementById('preview');

    function resetImportState() {
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

    categorySelect.addEventListener('change', () => {
        selectedCategoryId = categorySelect.value || null;

        resetImportState();

        parentGroup.style.display = 'none';
        parentSelect.value = '';

        if (!selectedCategoryId) {
            importTypeSelect.disabled = false;
        }
    });

    importTypeSelect.addEventListener('change', async () => {
        importType = importTypeSelect.value;

        resetImportState();

        parentGroup.style.display = 'none';
        parentSelect.value = '';

        if (!importType) {
            return;
        }

        if (importType === 'complete') {
            jsonFile.disabled = false;
            validateBtn.disabled = false;
            return;
        }

        if (!selectedCategoryId) {
            alert('Debe seleccionar una categoría.');
            importTypeSelect.value = '';
            importType = null;
            return;
        }

        if (importType === 'words') {
            selectedWordId = null;

            jsonFile.disabled = false;
            validateBtn.disabled = false;

            return;
        }

        if (importType === 'word') {
            selectedWordId = null;

            jsonFile.disabled = false;
            validateBtn.disabled = false;

            return;
        }

        if (importType === 'meanings') {
            await showWordSelector();
        }
    });

    parentSelect.addEventListener('change', () => {
        selectedWordId = parentSelect.value || null;

        jsonFile.value = '';
        englishData = null;

        importBtn.style.display = 'none';

        preview.innerHTML = '';
        preview.style.display = 'none';

        validateBtn.disabled = !selectedWordId;
        jsonFile.disabled = !selectedWordId;
    });

    async function showWordSelector() {
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

            const result = await parseJsonResponse(response);

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'No se pudieron cargar las palabras.'
                );
            }

            parentSelect.innerHTML = `
                <option value="">
                    Seleccione una palabra
                </option>
            `;

            result.data.forEach(word => {
                const option = document.createElement('option');

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

            alert(error.message);
        }
    }

    jsonFile.addEventListener('change', () => {
        englishData = null;

        importBtn.style.display = 'none';

        preview.innerHTML = '';
        preview.style.display = 'none';

        validateBtn.disabled = !jsonFile.files.length;
    });

    validateBtn.addEventListener('click', async () => {
        if (!jsonFile.files.length) {
            alert('Seleccione un archivo JSON.');
            return;
        }

        const file = jsonFile.files[0];

        try {
            const text = await file.text();

            englishData = JSON.parse(text);

            let result;

            switch (importType) {
                case 'complete':
                    result = validateCompleteJson(englishData);
                    break;

                case 'words':
                    result = validateWords(englishData);
                    break;

                case 'word':
                    result = validateWord(englishData);
                    break;

                case 'meanings':
                    result = validateMeanings(englishData);
                    break;

                default:
                    throw new Error('Tipo de importación no válido.');
            }

            if (!result.valid) {
                throw new Error(result.message);
            }

            switch (importType) {
                case 'complete':
                    showCompletePreview(englishData);
                    break;

                case 'words':
                    showWordsPreview(englishData);
                    break;

                case 'word':
                    showWordPreview(englishData);
                    break;

                case 'meanings':
                    showMeaningsPreview(englishData);
                    break;
            }

            importBtn.style.display = 'inline-block';

        } catch (error) {
            englishData = null;

            importBtn.style.display = 'none';

            preview.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${escapeHtml(error.message)}
                </div>
            `;

            preview.style.display = 'block';
        }
    });

    importBtn.addEventListener('click', async () => {
        if (!englishData) {
            alert('Primero debe validar el archivo JSON.');
            return;
        }

        importBtn.disabled = true;

        try {
            const endpoint = getImportEndpoint();

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                },
                body: JSON.stringify(englishData)
            });

            const result = await parseJsonResponse(response);

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'No se pudo realizar la importación.'
                );
            }

            showImportResult(result);

            importBtn.style.display = 'none';

        } catch (error) {
            preview.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${escapeHtml(error.message)}
                </div>
            `;

            preview.style.display = 'block';

        } finally {
            importBtn.disabled = false;
        }
    });

    function getImportEndpoint() {
        switch (importType) {
            case 'complete':
                return window.englishImportConfig.routes.importComplete;

            case 'words':
                return `${window.englishImportConfig.routes.importWords}/${selectedCategoryId}/words/import`;

            case 'word':
                return `${window.englishImportConfig.routes.importWord}/${selectedCategoryId}/word/import`;

            case 'meanings':
                return `${window.englishImportConfig.routes.importMeanings}/${selectedWordId}/meanings/import`;

            default:
                throw new Error('Tipo de importación no válido.');
        }
    }

    function validateCompleteJson(data) {
        if (!data || typeof data !== 'object') {
            return {
                valid: false,
                message: 'El JSON debe contener un objeto.'
            };
        }

        if (!data.category || typeof data.category !== 'object') {
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

        if (!Array.isArray(data.words) || data.words.length === 0) {
            return {
                valid: false,
                message: 'Debe existir al menos una palabra.'
            };
        }

        for (let i = 0; i < data.words.length; i++) {
            const result = validateWordData(
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

    function validateWords(data) {
        if (!data || typeof data !== 'object') {
            return {
                valid: false,
                message: 'El JSON debe contener un objeto.'
            };
        }

        if (!Array.isArray(data.words) || data.words.length === 0) {
            return {
                valid: false,
                message: 'Debe existir al menos una palabra.'
            };
        }

        for (let i = 0; i < data.words.length; i++) {
            const result = validateWordData(
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

    function validateWord(data) {
        if (!data || typeof data !== 'object') {
            return {
                valid: false,
                message: 'El JSON debe contener un objeto.'
            };
        }

        if (!data.word || typeof data.word !== 'object') {
            return {
                valid: false,
                message: 'El JSON debe contener una palabra.'
            };
        }

        return validateWordData(data.word, 'Palabra');
    }

    function validateWordData(word, label) {
        if (!word || typeof word !== 'object') {
            return {
                valid: false,
                message: `${label}: estructura inválida.`
            };
        }

        if (!word.word) {
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
            for (let i = 0; i < word.meanings.length; i++) {
                if (
                    !word.meanings[i] ||
                    !word.meanings[i].meaning
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

    function validateMeanings(data) {
        if (!data || typeof data !== 'object') {
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

        for (let i = 0; i < data.meanings.length; i++) {
            const meaning = data.meanings[i];

            if (!meaning || !meaning.meaning) {
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

    function showCompletePreview(data) {
        const wordsCount = data.words.length;

        const meaningsCount = data.words.reduce(
            (total, word) => total + (word.meanings?.length || 0),
            0
        );

        preview.innerHTML = `
            <div class="alert alert-info">
                <h5>Vista previa</h5>

                <p class="mb-1">
                    <strong>Categoría:</strong>
                    ${escapeHtml(data.category.name)}
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

    function showWordsPreview(data) {
        const wordsCount = data.words.length;

        const meaningsCount = data.words.reduce(
            (total, word) => total + (word.meanings?.length || 0),
            0
        );

        preview.innerHTML = `
            <div class="alert alert-info">
                <h5>Vista previa</h5>

                <p class="mb-1">
                    <strong>Categoría:</strong>
                    ${escapeHtml(categorySelect.options[categorySelect.selectedIndex].text)}
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

    function showWordPreview(data) {
        const word = data.word;

        const meaningsCount = word.meanings?.length || 0;

        preview.innerHTML = `
            <div class="alert alert-info">
                <h5>Vista previa</h5>

                <p class="mb-1">
                    <strong>Categoría:</strong>
                    ${escapeHtml(categorySelect.options[categorySelect.selectedIndex].text)}
                </p>

                <p class="mb-1">
                    <strong>Palabra:</strong>
                    ${escapeHtml(word.word)}
                </p>

                <p class="mb-1">
                    <strong>Pronunciación:</strong>
                    ${escapeHtml(word.pronunciation_guide || '-')}
                </p>

                <p class="mb-1">
                    <strong>Ejemplo:</strong>
                    ${escapeHtml(word.example || '-')}
                </p>

                <p class="mb-0">
                    <strong>Significados:</strong>
                    ${meaningsCount}
                </p>
            </div>
        `;

        preview.style.display = 'block';
    }

    function showMeaningsPreview(data) {
        preview.innerHTML = `
            <div class="alert alert-info">
                <h5>Vista previa</h5>

                <p class="mb-1">
                    <strong>Palabra:</strong>
                    ${escapeHtml(
                        parentSelect.options[parentSelect.selectedIndex].text
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

    function showImportResult(result) {
        const data = result.data || {};

        let html = `
            <div class="alert alert-success">
                <h5>Importación completada</h5>

                <p class="mb-1">
                    ${escapeHtml(
                        result.message || 'Importación realizada correctamente.'
                    )}
                </p>
        `;

        if (data.category) {
            html += `
                <p class="mb-1">
                    <strong>Categoría:</strong>
                    ${escapeHtml(data.category.name)}
                </p>
            `;
        }

        if (data.word) {
            html += `
                <p class="mb-1">
                    <strong>Palabra:</strong>
                    ${escapeHtml(data.word.word)}
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

    async function parseJsonResponse(response) {
        const contentType = response.headers.get('content-type') || '';

        if (!contentType.includes('application/json')) {
            const text = await response.text();

            throw new Error(
                `El servidor devolvió una respuesta no válida. Código HTTP: ${response.status}`
            );
        }

        return await response.json();
    }

    function getCsrfToken() {
        const token = document.querySelector(
            'meta[name="csrf-token"]'
        );

        if (!token) {
            throw new Error('No se encontró el token CSRF.');
        }

        return token.getAttribute('content');
    }

    function escapeHtml(value) {
        const div = document.createElement('div');

        div.textContent = value ?? '';

        return div.innerHTML;
    }
});