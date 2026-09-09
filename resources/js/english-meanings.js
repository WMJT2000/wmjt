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


        if (
            !botonNuevo ||
            !formularioContainer ||
            !formulario ||
            !tablaContainer
        ) {

            console.error(
                'No se encontraron los elementos de significados.'
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | API
        |--------------------------------------------------------------------------
        */

        const API_URL =
            '/api/english/meanings';

        const CATEGORIES_API_URL =
            '/api/english/meanings/categories';

        const WORDS_BY_CATEGORY_API_URL =
            '/api/english/meanings/words';


        /*
        |--------------------------------------------------------------------------
        | TABLA
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | NUEVO
        |--------------------------------------------------------------------------
        */

        botonNuevo.addEventListener(
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

                    await cargarCategorias();

                    prepararPalabras();


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


        /*
        |--------------------------------------------------------------------------
        | CARGAR CATEGORÍAS
        |--------------------------------------------------------------------------
        */

        async function cargarCategorias(
            categoriaSeleccionada = null
        ) {

            const select =
                formulario.querySelector(
                    '[name="english_category_id"]'
                );

            if (!select) {
                return;
            }


            select.innerHTML = `
                <option value="">
                    Cargando categorías...
                </option>
            `;


            try {

                const response =
                    await fetch(
                        CATEGORIES_API_URL,
                        {
                            method: 'GET',

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


                select.innerHTML = `
                    <option value="">
                        Seleccione una categoría
                    </option>
                `;


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


                        if (
                            categoriaSeleccionada &&
                            Number(categoria.id) ===
                            Number(categoriaSeleccionada)
                        ) {

                            option.selected =
                                true;
                        }


                        select.appendChild(
                            option
                        );

                    }
                );


                select.disabled = false;


            } catch (error) {

                console.error(
                    'Error cargando categorías:',
                    error
                );


                select.innerHTML = `
                    <option value="">
                        Error cargando categorías
                    </option>
                `;

            }

        }


        /*
        |--------------------------------------------------------------------------
        | PREPARAR PALABRAS
        |--------------------------------------------------------------------------
        */

        function prepararPalabras() {

            const select =
                formulario.querySelector(
                    '[name="english_word_id"]'
                );

            if (!select) {
                return;
            }


            select.innerHTML = `
                <option value="">
                    Seleccione primero una categoría
                </option>
            `;

            select.disabled = true;
        }


        /*
        |--------------------------------------------------------------------------
        | CARGAR PALABRAS POR CATEGORÍA
        |--------------------------------------------------------------------------
        */

        async function cargarPalabras(
            categoryId,
            palabraSeleccionada = null
        ) {

            const select =
                formulario.querySelector(
                    '[name="english_word_id"]'
                );

            if (!select) {
                return;
            }


            if (!categoryId) {

                prepararPalabras();

                return;
            }


            select.disabled = true;

            select.innerHTML = `
                <option value="">
                    Cargando palabras...
                </option>
            `;


            try {

                const response =
                    await fetch(
                        `${WORDS_BY_CATEGORY_API_URL}/${categoryId}`,
                        {
                            method: 'GET',

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


                select.innerHTML = `
                    <option value="">
                        Seleccione una palabra
                    </option>
                `;


                palabras.forEach(
                    palabra => {

                        const option =
                            document.createElement(
                                'option'
                            );

                        option.value =
                            palabra.id;

                        option.textContent =
                            palabra.word;


                        if (
                            palabraSeleccionada &&
                            Number(palabra.id) ===
                            Number(palabraSeleccionada)
                        ) {

                            option.selected =
                                true;
                        }


                        select.appendChild(
                            option
                        );

                    }
                );


                select.disabled = false;


            } catch (error) {

                console.error(
                    'Error cargando palabras:',
                    error
                );


                select.innerHTML = `
                    <option value="">
                        Error cargando palabras
                    </option>
                `;

            }

        }


        /*
        |--------------------------------------------------------------------------
        | CAMBIO DE CATEGORÍA
        |--------------------------------------------------------------------------
        */

        const selectCategoria =
            formulario.querySelector(
                '[name="english_category_id"]'
            );


        if (selectCategoria) {

            selectCategoria.addEventListener(
                'change',
                async () => {

                    const categoryId =
                        selectCategoria.value;


                    await cargarPalabras(
                        categoryId
                    );

                }
            );

        }


        /*
        |--------------------------------------------------------------------------
        | CARGAR SIGNIFICADOS
        |--------------------------------------------------------------------------
        */

        async function cargarSignificados() {

            tabla.mostrarCargando();


            try {

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: 'GET',

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


        /*
        |--------------------------------------------------------------------------
        | EDITAR
        |--------------------------------------------------------------------------
        */

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


                /*
                |----------------------------------------------------------------------
                | MOSTRAR FORMULARIO
                |----------------------------------------------------------------------
                */

                formularioContainer.style.display =
                    'block';


                botonNuevo.textContent =
                    '− Cerrar formulario';


                /*
                |----------------------------------------------------------------------
                | CONFIGURAR FORMULARIO
                |----------------------------------------------------------------------
                */

                formulario.setAttribute(
                    'action',
                    `${API_URL}/${id}`
                );

                formulario.setAttribute(
                    'method',
                    'PUT'
                );


                /*
                |----------------------------------------------------------------------
                | CARGAR CATEGORÍAS
                |----------------------------------------------------------------------
                */

                await cargarCategorias(
                    significado.english_category_id
                );


                /*
                |----------------------------------------------------------------------
                | CARGAR PALABRAS DE LA CATEGORÍA
                |----------------------------------------------------------------------
                */

                await cargarPalabras(
                    significado.english_category_id,
                    significado.english_word_id
                );


                /*
                |----------------------------------------------------------------------
                | SIGNIFICADO
                |----------------------------------------------------------------------
                */

                const campoMeaning =
                    formulario.querySelector(
                        '[name="meaning"]'
                    );


                if (campoMeaning) {

                    campoMeaning.value =
                        significado.meaning ?? '';

                }


                /*
                |----------------------------------------------------------------------
                | TÍTULO
                |----------------------------------------------------------------------
                */

                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );


                if (titulo) {

                    titulo.textContent =
                        'Editar significado';

                }


                /*
                |----------------------------------------------------------------------
                | BOTÓN
                |----------------------------------------------------------------------
                */

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


        /*
        |--------------------------------------------------------------------------
        | ELIMINAR
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | FORM SUCCESS
        |--------------------------------------------------------------------------
        */

        formulario.addEventListener(
            'form:success',
            async () => {

                await cargarSignificados();


                formulario.reset();


                formulario.setAttribute(
                    'action',
                    API_URL
                );


                formulario.setAttribute(
                    'method',
                    'POST'
                );


                await cargarCategorias();

                prepararPalabras();


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


        /*
        |--------------------------------------------------------------------------
        | INICIAR
        |--------------------------------------------------------------------------
        */

        cargarSignificados();

    }
);