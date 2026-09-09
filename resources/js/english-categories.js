import { TablaGestion } from './tabla-gestion.js';


document.addEventListener(
    'DOMContentLoaded',
    () => {


        const botonNueva =
            document.getElementById(
                'btnNuevaEnglishCategory'
            );


        const formularioContainer =
            document.getElementById(
                'englishCategoryFormContainer'
            );


        const formulario =
            document.getElementById(
                'englishCategoryForm'
            );


        const tablaContainer =
            document.getElementById(
                'englishCategoriesTable'
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
            '/api/english/categories';


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
                        key: 'name',
                        label: 'Nombre'
                    },

                    {
                        key: 'description',
                        label: 'Descripción'
                    }

                ],

                actions: {

                    edit: true,

                    delete: true

                },

                emptyMessage:
                    'No hay categorías.',

                loadingMessage:
                    'Cargando categorías.',

                errorMessage:
                    'Error cargando categorías.'

            });


        /*
        |----------------------------------------------------------------------
        | EDITAR
        |----------------------------------------------------------------------
        */

        tablaContainer.addEventListener(
            'tabla-gestion:edit',
            async event => {

                const categoria =
                    event.detail;


                if (!categoria) {

                    return;

                }


                await editarCategoria(
                    categoria.id
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

                const categoria =
                    event.detail;


                if (!categoria) {

                    return;

                }


                const confirmar =
                    confirm(
                        `¿Seguro que deseas eliminar la categoría "${categoria.name}"?`
                    );


                if (!confirmar) {

                    return;

                }


                await eliminarCategoria(
                    categoria.id
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
            () => {

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
                            'Nueva categoría';

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
                        '+ Nueva categoría';

                }

            }
        );


        /*
        |----------------------------------------------------------------------
        | CARGAR
        |----------------------------------------------------------------------
        */

        async function cargarCategorias() {

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


                const categorias =
                    Array.isArray(data)
                        ? data
                        : data.data ?? [];


                tabla.establecerDatos(
                    categorias
                );


            } catch (error) {

                console.error(
                    'Error cargando categorías:',
                    error
                );


                tabla.mostrarError(
                    `Error cargando categorías: ${error.message}`
                );

            }

        }


        /*
        |----------------------------------------------------------------------
        | EDITAR
        |----------------------------------------------------------------------
        */

        async function editarCategoria(id) {

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
                        'No se pudo obtener la categoría.'
                    );

                }


                const categoria =
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


                const campoNombre =
                    formulario.querySelector(
                        '[name="name"]'
                    );


                if (campoNombre) {

                    campoNombre.value =
                        categoria.name ?? '';

                }


                const campoDescripcion =
                    formulario.querySelector(
                        '[name="description"]'
                    );


                if (campoDescripcion) {

                    campoDescripcion.value =
                        categoria.description ?? '';

                }


                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );


                if (titulo) {

                    titulo.textContent =
                        'Editar categoría';

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
                    'Error obteniendo categoría:',
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

        async function eliminarCategoria(id) {

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


                await cargarCategorias();


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

                await cargarCategorias();


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
                        'Nueva categoría';

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

    }
);