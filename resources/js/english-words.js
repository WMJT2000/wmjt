import { TablaGestion } from './tabla-gestion.js';

document.addEventListener(
    'DOMContentLoaded',
    () => {

        const botonNueva =
            document.getElementById(
                'btnNuevaEnglishWord'
            );

        const formularioContainer =
            document.getElementById(
                'englishWordFormContainer'
            );

        const formulario =
            document.getElementById(
                'englishWordForm'
            );

        const tablaContainer =
            document.getElementById(
                'englishWordsTable'
            );

        const categoryContext =
            document.getElementById(
                'englishCategoryContext'
            );

        const categoryId =
            categoryContext
                ? categoryContext.dataset.categoryId
                : null;

        if (
            !botonNueva ||
            !formularioContainer ||
            !formulario ||
            !tablaContainer ||
            !categoryId
        ) {
            return;
        }

        const API_URL =
            '/api/english/words';

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
                        key: 'word',
                        label: 'Palabra'
                    },

                    {
                        key: 'pronunciation_guide',
                        label: 'Guía de pronunciación'
                    },

                    {
                        key: 'category.name',
                        label: 'Categoría'
                    },

                    {
                        key: 'example',
                        label: 'Ejemplo'
                    },

                    {
                        key: 'example_translation',
                        label: 'Traducción'
                    }

                ],

                actions: {
                    edit: true,
                    meanings: true,
                    delete: true
                },

                emptyMessage:
                    'No hay palabras.',

                loadingMessage:
                    'Cargando palabras.',

                errorMessage:
                    'Error cargando palabras.'

            });

        let campoCategoria =
            formulario.querySelector(
                '[name="english_category_id"]'
            );

        if (!campoCategoria) {

            campoCategoria =
                document.createElement('input');

            campoCategoria.type =
                'hidden';

            campoCategoria.name =
                'english_category_id';

            formulario.appendChild(
                campoCategoria
            );
        }

        campoCategoria.value =
            categoryId;

        tablaContainer.addEventListener(
            'tabla-gestion:edit',
            async event => {

                const palabra =
                    event.detail;

                if (!palabra) {
                    return;
                }

                await editarPalabra(
                    palabra.id
                );

            }
        );

        tablaContainer.addEventListener(
            'tabla-gestion:meanings',
            event => {

                const palabra =
                    event.detail;

                if (!palabra) {
                    return;
                }

                window.location.href =
                    `/gestion/english/words/${palabra.id}/meanings`;

            }
        );

        tablaContainer.addEventListener(
            'tabla-gestion:delete',
            async event => {

                const palabra =
                    event.detail;

                if (!palabra) {
                    return;
                }

                const confirmar =
                    confirm(
                        `¿Seguro que deseas eliminar la palabra "${palabra.word}"?`
                    );

                if (!confirmar) {
                    return;
                }

                await eliminarPalabra(
                    palabra.id
                );

            }
        );

        botonNueva.addEventListener(
            'click',
            () => {

                const cerrado =
                    formularioContainer.style.display === 'none' ||
                    formularioContainer.style.display === '';

                if (cerrado) {

                    formularioContainer.style.display =
                        'block';

                    formulario.reset();

                    campoCategoria.value =
                        categoryId;

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
                            'Nueva palabra';

                    }

                    const boton =
                        formulario.querySelector(
                            '.form-button'
                        );

                    if (boton) {

                        boton.textContent =
                            'Guardar';

                    }

                    botonNueva.textContent =
                        '− Cerrar formulario';

                } else {

                    formularioContainer.style.display =
                        'none';

                    botonNueva.textContent =
                        '+ Nueva palabra';

                }

            }
        );

        async function cargarPalabras() {

            tabla.mostrarCargando();

            try {

                const url =
                    `${API_URL}?english_category_id=${categoryId}`;

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

                const palabras =
                    Array.isArray(data)
                        ? data
                        : data.data ?? [];

                tabla.establecerDatos(
                    palabras
                );

            } catch (error) {

                console.error(
                    'Error cargando palabras:',
                    error
                );

                tabla.mostrarError(
                    `Error cargando palabras: ${error.message}`
                );

            }

        }

        async function editarPalabra(id) {

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
                        'No se pudo obtener la palabra.'
                    );

                }

                const palabra =
                    data.data ?? data;

                formularioContainer.style.display =
                    'block';

                botonNueva.textContent =
                    '− Cerrar formulario';

                formulario.setAttribute(
                    'action',
                    `${API_URL}/${id}`
                );

                formulario.setAttribute(
                    'method',
                    'PUT'
                );

                campoCategoria.value =
                    palabra.english_category_id ??
                    categoryId;

                const campoPalabra =
                    formulario.querySelector(
                        '[name="word"]'
                    );

                if (campoPalabra) {

                    campoPalabra.value =
                        palabra.word ?? '';

                }

                const pronunciacion =
                    formulario.querySelector(
                        '[name="pronunciation_guide"]'
                    );

                if (pronunciacion) {

                    pronunciacion.value =
                        palabra.pronunciation_guide ?? '';

                }

                const ejemplo =
                    formulario.querySelector(
                        '[name="example"]'
                    );

                if (ejemplo) {

                    ejemplo.value =
                        palabra.example ?? '';

                }

                const traduccion =
                    formulario.querySelector(
                        '[name="example_translation"]'
                    );

                if (traduccion) {

                    traduccion.value =
                        palabra.example_translation ?? '';

                }

                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );

                if (titulo) {

                    titulo.textContent =
                        'Editar palabra';

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
                    'Error obteniendo palabra:',
                    error
                );

                alert(
                    error.message
                );

            }

        }

        async function eliminarPalabra(id) {

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

                await cargarPalabras();

            } catch (error) {

                console.error(
                    'Error eliminando:',
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

                await cargarPalabras();

                formulario.reset();

                campoCategoria.value =
                    categoryId;

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
                        'Nueva palabra';

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

        cargarPalabras();

    }
);