let grammarData = null;


const fileInput = document.getElementById('jsonFile');

const validateBtn = document.getElementById('validateBtn');

const importBtn = document.getElementById('importBtn');

const preview = document.getElementById('preview');


/*
|--------------------------------------------------------------------------
| Validar JSON
|--------------------------------------------------------------------------
*/

validateBtn.addEventListener('click', async function () {

    const file = fileInput.files[0];


    grammarData = null;

    importBtn.style.display = 'none';


    if (!file) {

        preview.innerHTML = `
            <p class="error">
                Selecciona un archivo JSON.
            </p>
        `;

        return;
    }


    try {

        const text = await file.text();

        grammarData = JSON.parse(text);


        /*
        |--------------------------------------------------------------------------
        | Validaciones básicas
        |--------------------------------------------------------------------------
        */

        if (!grammarData.category) {

            throw new Error(
                'El JSON no contiene "category".'
            );
        }


        if (!grammarData.topics) {

            throw new Error(
                'El JSON no contiene "topics".'
            );
        }


        if (!Array.isArray(grammarData.topics)) {

            throw new Error(
                '"topics" debe ser un array.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Contadores
        |--------------------------------------------------------------------------
        */

        let topics = 0;

        let lessons = 0;

        let rules = 0;

        let examples = 0;


        grammarData.topics.forEach(topic => {

            topics++;


            if (!Array.isArray(topic.lessons)) {
                return;
            }


            topic.lessons.forEach(lesson => {

                lessons++;


                if (Array.isArray(lesson.rules)) {

                    rules += lesson.rules.length;

                }


                if (Array.isArray(lesson.examples)) {

                    examples += lesson.examples.length;

                }

            });

        });


        /*
        |--------------------------------------------------------------------------
        | Mostrar preview
        |--------------------------------------------------------------------------
        */

        preview.innerHTML = `

            <div class="preview-box">

                <div class="success">

                    <h2>JSON válido</h2>

                </div>


                <div class="preview-stats">

                    <p>
                        <strong>Categoría:</strong>
                        ${grammarData.category.name ?? '-'}
                    </p>

                    <p>
                        <strong>Nivel:</strong>
                        ${grammarData.category.level ?? '-'}
                    </p>

                    <p>
                        <strong>Topics:</strong>
                        ${topics}
                    </p>

                    <p>
                        <strong>Lessons:</strong>
                        ${lessons}
                    </p>

                    <p>
                        <strong>Rules:</strong>
                        ${rules}
                    </p>

                    <p>
                        <strong>Examples:</strong>
                        ${examples}
                    </p>

                </div>

            </div>

        `;


        importBtn.style.display = 'inline-block';


    } catch (error) {

        preview.innerHTML = `

            <p class="error">

                Error:

                ${error.message}

            </p>

        `;

    }

});


/*
|--------------------------------------------------------------------------
| Importar a la base de datos
|--------------------------------------------------------------------------
*/

importBtn.addEventListener('click', async function () {

    if (!grammarData) {
        return;
    }


    importBtn.disabled = true;

    importBtn.textContent = 'Importando...';


    try {

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute('content');


        const response = await fetch(
            '/admin/grammar/import',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',

                    'Accept': 'application/json',

                    'X-CSRF-TOKEN': csrfToken
                },

                body: JSON.stringify(grammarData)
            }
        );


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ?? 'Error al importar.'
            );

        }


        preview.innerHTML = `

            <div class="preview-box">

                <div class="success">

                    <h2>
                        Importación completada
                    </h2>

                </div>


                <pre>
${JSON.stringify(result, null, 2)}
                </pre>

            </div>

        `;


    } catch (error) {

        preview.innerHTML = `

            <p class="error">

                Error durante la importación:

                ${error.message}

            </p>

        `;

    } finally {

        importBtn.disabled = false;

        importBtn.textContent =
            'Importar a la base de datos';

    }

});