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


        if (
            !botonNueva ||
            !formularioContainer ||
            !formulario ||
            !tablaContainer
        ) {

            return;

        }


        const API_URL =
            '/api/english/words';


        const CATEGORIES_URL =
            '/api/english/words/categories';


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

                    delete: true

                },

                emptyMessage:
                    'No hay palabras.',

                loadingMessage:
                    'Cargando palabras.',

                errorMessage:
                    'Error cargando palabras.'

            });


        /*
        |----------------------------------------------------------------------
        | CARGAR CATEGORÍAS
        |----------------------------------------------------------------------
        */

        async function cargarCategorias() {

            try {

                const response =
                    await fetch(
                        CATEGORIES_URL,
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


                const categorias =
                    Array.isArray(data)
                        ? data
                        : data.data ?? [];


                const select =
                    formulario.querySelector(
                        '[name="english_category_id"]'
                    );


                if (!select) {

                    return;

                }


                select.innerHTML =
                    '<option value="">Selecciona una categoría</option>';


                categorias.forEach(
                    categoria => {

                        const option =
                            document.createElement(
                                'option'
                            );


                        option.value =
                            categoria.id;


                        option.textContent =
                            categoria.name;


                        select.appendChild(
                            option
                        );

                    }
                );


            } catch (error) {

                console.error(
                    'Error cargando categorías:',
                    error
                );

            }

        }


        /*
        |----------------------------------------------------------------------
        | EDITAR
        |----------------------------------------------------------------------
        */

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


        /*
        |----------------------------------------------------------------------
        | ELIMINAR
        |----------------------------------------------------------------------
        */

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


        /*
        |----------------------------------------------------------------------
        | NUEVA / CERRAR
        |----------------------------------------------------------------------
        */

        botonNueva.addEventListener(
            'click',
            async () => {

                const cerrado =
                    formularioContainer.style.display === 'none' ||
                    formularioContainer.style.display === '';


                if (cerrado) {

                    formularioContainer.style.display =
                        'block';


                    formulario.reset();


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


                    await cargarCategorias();

                } else {

                    formularioContainer.style.display =
                        'none';


                    botonNueva.textContent =
                        '+ Nueva palabra';

                }

            }
        );


        /*
        |----------------------------------------------------------------------
        | CARGAR PALABRAS
        |----------------------------------------------------------------------
        */

        async function cargarPalabras() {

            tabla.mostrarCargando();


            try {

                const response =
                    await fetch(
                        API_URL,
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


        /*
        |----------------------------------------------------------------------
        | EDITAR PALABRA
        |----------------------------------------------------------------------
        */

        async function editarPalabra(id) {

            try {

                await cargarCategorias();


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


                const categoria =
                    formulario.querySelector(
                        '[name="english_category_id"]'
                    );


                if (categoria) {

                    categoria.value =
                        palabra.english_category_id ?? '';

                }


                const campoPalabra =
                    formulario.querySelector(
                        '[name="word"]'
                    );


                if (campoPalabra) {

                    campoPalabra.value =
                        palabra.word ?? '';

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


        /*
        |----------------------------------------------------------------------
        | ELIMINAR
        |----------------------------------------------------------------------
        */

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


        /*
        |----------------------------------------------------------------------
        | FORM.JS
        |----------------------------------------------------------------------
        */

        formulario.addEventListener(
            'form:success',
            async () => {

                await cargarPalabras();


                formulario.reset();


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


        cargarCategorias();

        cargarPalabras();

    }
);