import { TablaGestion } from './tabla-gestion.js';

document.addEventListener(
    'DOMContentLoaded',
    () => {

        const botonNuevo =
            document.getElementById(
                'btnNuevoEnglishMeaning'
            );

        const formularioContainer =
            document.getElementById(
                'englishMeaningFormContainer'
            );

        const formulario =
            document.getElementById(
                'englishMeaningForm'
            );

        const tablaContainer =
            document.getElementById(
                'englishMeaningsTable'
            );

        const wordContext =
            document.getElementById(
                'englishWordContext'
            );

        const wordId =
            wordContext
                ? wordContext.dataset.wordId
                : null;

        if (
            !botonNuevo ||
            !formularioContainer ||
            !formulario ||
            !tablaContainer ||
            !wordId
        ) {

            console.error(
                'No se encontraron los elementos de significados.'
            );

            return;
        }

        const API_URL =
            '/api/english/meanings';

        const tabla =
            new TablaGestion({

                container:
                    tablaContainer,

                columns: [

                    {
                        key: 'id',
                        label: 'ID'
                    },

                    {
                        key: 'word.word',
                        label: 'Palabra'
                    },

                    {
                        key: 'word.category.name',
                        label: 'Categoría'
                    },

                    {
                        key: 'meaning',
                        label: 'Significado'
                    }

                ],

                actions: {

                    edit: true,

                    delete: true

                },

                emptyMessage:
                    'No hay significados.',

                loadingMessage:
                    'Cargando significados.',

                errorMessage:
                    'Error cargando significados.'

            });

        let campoWord =
            formulario.querySelector(
                '[name="english_word_id"]'
            );

        if (!campoWord) {

            campoWord =
                document.createElement('input');

            campoWord.type =
                'hidden';

            campoWord.name =
                'english_word_id';

            formulario.appendChild(
                campoWord
            );
        }

        campoWord.value =
            wordId;

        botonNuevo.addEventListener(
            'click',
            () => {

                const cerrado =
                    formularioContainer.style.display === 'none' ||
                    formularioContainer.style.display === '';

                if (cerrado) {

                    formularioContainer.style.display =
                        'block';

                    formulario.reset();

                    campoWord.value =
                        wordId;

                    formulario.setAttribute(
                        'action',
                        API_URL
                    );

                    formulario.setAttribute(
                        'method',
                        'POST'
                    );

                    const titulo =
                        formularioContainer.querySelector(
                            'h2'
                        );

                    if (titulo) {

                        titulo.textContent =
                            'Nuevo significado';

                    }

                    const boton =
                        formulario.querySelector(
                            '.form-button'
                        );

                    if (boton) {

                        boton.textContent =
                            'Guardar';

                    }

                    botonNuevo.textContent =
                        '− Cerrar formulario';

                } else {

                    formularioContainer.style.display =
                        'none';

                    botonNuevo.textContent =
                        '+ Nuevo significado';

                }

            }
        );

        async function cargarSignificados() {

            tabla.mostrarCargando();

            try {

                const url =
                    `${API_URL}?english_word_id=${wordId}`;

                const response =
                    await fetch(
                        url,
                        {
                            method: 'GET',

                            credentials:
                                'same-origin',

                            headers: {
                                'Accept':
                                    'application/json'
                            }
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        `HTTP ${response.status}`
                    );

                }

                const significados =
                    Array.isArray(data)
                        ? data
                        : data.data ?? [];

                tabla.establecerDatos(
                    significados
                );

            } catch (error) {

                console.error(
                    'Error cargando significados:',
                    error
                );

                tabla.mostrarError(
                    `Error cargando significados: ${error.message}`
                );

            }

        }

        tablaContainer.addEventListener(
            'tabla-gestion:edit',
            async event => {

                const significado =
                    event.detail;

                if (!significado) {
                    return;
                }

                await editarSignificado(
                    significado.id
                );

            }
        );

        async function editarSignificado(
            id
        ) {

            try {

                const response =
                    await fetch(
                        `${API_URL}/${id}`,
                        {
                            method: 'GET',

                            credentials:
                                'same-origin',

                            headers: {
                                'Accept':
                                    'application/json'
                            }
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'No se pudo obtener el significado.'
                    );

                }

                const significado =
                    data.data ?? data;

                formularioContainer.style.display =
                    'block';

                botonNuevo.textContent =
                    '− Cerrar formulario';

                formulario.setAttribute(
                    'action',
                    `${API_URL}/${id}`
                );

                formulario.setAttribute(
                    'method',
                    'PUT'
                );

                campoWord.value =
                    significado.english_word_id ??
                    wordId;

                const campoMeaning =
                    formulario.querySelector(
                        '[name="meaning"]'
                    );

                if (campoMeaning) {

                    campoMeaning.value =
                        significado.meaning ?? '';

                }

                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );

                if (titulo) {

                    titulo.textContent =
                        'Editar significado';

                }

                const boton =
                    formulario.querySelector(
                        '.form-button'
                    );

                if (boton) {

                    boton.textContent =
                        'Actualizar';

                }

            } catch (error) {

                console.error(
                    'Error obteniendo significado:',
                    error
                );

                alert(
                    error.message
                );

            }

        }

        tablaContainer.addEventListener(
            'tabla-gestion:delete',
            async event => {

                const significado =
                    event.detail;

                if (!significado) {
                    return;
                }

                const confirmar =
                    confirm(
                        `¿Seguro que deseas eliminar el significado "${significado.meaning}"?`
                    );

                if (!confirmar) {
                    return;
                }

                await eliminarSignificado(
                    significado.id
                );

            }
        );

        async function eliminarSignificado(
            id
        ) {

            try {

                const response =
                    await fetch(
                        `${API_URL}/${id}`,
                        {
                            method: 'DELETE',

                            credentials:
                                'same-origin',

                            headers: {
                                'Accept':
                                    'application/json'
                            }
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        'No se pudo eliminar.'
                    );

                }

                await cargarSignificados();

            } catch (error) {

                console.error(
                    'Error eliminando significado:',
                    error
                );

                alert(
                    error.message
                );

            }

        }

        formulario.addEventListener(
            'form:success',
            async () => {

                await cargarSignificados();

                formulario.reset();

                campoWord.value =
                    wordId;

                formulario.setAttribute(
                    'action',
                    API_URL
                );

                formulario.setAttribute(
                    'method',
                    'POST'
                );

                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );

                if (titulo) {

                    titulo.textContent =
                        'Nuevo significado';

                }

                const boton =
                    formulario.querySelector(
                        '.form-button'
                    );

                if (boton) {

                    boton.textContent =
                        'Guardar';

                }

            }
        );

        cargarSignificados();

    }
);