
import { TablaGestion } from './tabla-gestion.js';


document.addEventListener(
    'DOMContentLoaded',
    () => {


        /*
        |--------------------------------------------------------------------------
        | ELEMENTOS
        |--------------------------------------------------------------------------
        */

        const botonNueva =
            document.getElementById(
                'btnNuevaCategoria'
            );


        const formularioContainer =
            document.getElementById(
                'categoryFormContainer'
            );


        const formulario =
            document.getElementById(
                'categoryForm'
            );


        const tablaContainer =
            document.getElementById(
                'categoriesTable'
            );


        /*
        |--------------------------------------------------------------------------
        | VALIDAR
        |--------------------------------------------------------------------------
        */

        if (
            !botonNueva ||
            !formularioContainer ||
            !formulario ||
            !tablaContainer
        ) {

            console.error(
                'No se encontraron los elementos de categorías.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | API
        |--------------------------------------------------------------------------
        */

        const API_URL =
            '/api/categories';


        const TECHNOLOGIES_API_URL =
            '/api/technologies';



        /*
        |--------------------------------------------------------------------------
        | TABLA GESTIÓN
        |--------------------------------------------------------------------------
        |
        | La tabla NO sabe nada sobre categorías.
        |
        | Solamente recibe:
        |
        | - columnas
        | - datos
        | - acciones
        |
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
                        key: 'technology.name',

                        label: 'Tecnología'
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
        |--------------------------------------------------------------------------
        | EVENTO EDITAR
        |--------------------------------------------------------------------------
        |
        | TablaGestion NO sabe cómo editar.
        |
        | Solamente informa:
        |
        | tabla-gestion:edit
        |
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
        |--------------------------------------------------------------------------
        | EVENTO ELIMINAR
        |--------------------------------------------------------------------------
        |
        | TablaGestion NO elimina.
        |
        | categories.js decide qué hacer.
        |
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
        |--------------------------------------------------------------------------
        | NUEVA / CERRAR FORMULARIO
        |--------------------------------------------------------------------------
        */

        botonNueva.addEventListener(
            'click',
            async () => {

                const formularioEstaCerrado =
                    formularioContainer.style.display === 'none' ||
                    formularioContainer.style.display === '';


                if (
                    formularioEstaCerrado
                ) {

                    /*
                    |------------------------------------------------------------------
                    | ABRIR
                    |------------------------------------------------------------------
                    */

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


                    /*
                    |------------------------------------------------------------------
                    | CARGAR TECNOLOGÍAS
                    |------------------------------------------------------------------
                    */

                    await cargarTecnologias();



                    /*
                    |------------------------------------------------------------------
                    | TÍTULO
                    |------------------------------------------------------------------
                    */

                    const titulo =
                        formularioContainer.querySelector(
                            'h2'
                        );


                    if (titulo) {

                        titulo.textContent =
                            'Nueva categoría';

                    }



                    /*
                    |------------------------------------------------------------------
                    | BOTÓN
                    |------------------------------------------------------------------
                    */

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

                    /*
                    |------------------------------------------------------------------
                    | CERRAR
                    |------------------------------------------------------------------
                    */

                    formularioContainer.style.display =
                        'none';


                    botonNueva.textContent =
                        '+ Nueva categoría';

                }

            }
        );



        /*
        |--------------------------------------------------------------------------
        | CARGAR TECNOLOGÍAS
        |--------------------------------------------------------------------------
        */

        async function cargarTecnologias(
            tecnologiaSeleccionada = null
        ) {

            const select =
                formulario.querySelector(
                    '[name="technology_id"]'
                );


            if (!select) {

                return;

            }


            select.innerHTML = `

                <option value="">
                    Cargando tecnologías...
                </option>

            `;


            try {

                const response =
                    await fetch(
                        TECHNOLOGIES_API_URL,
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


                const tecnologias =
                    Array.isArray(data)
                        ? data
                        : data.data ?? [];


                select.innerHTML = `

                    <option value="">
                        Seleccione una tecnología
                    </option>

                `;


                tecnologias.forEach(
                    tecnologia => {

                        const option =
                            document.createElement(
                                'option'
                            );


                        option.value =
                            tecnologia.id;


                        option.textContent =
                            tecnologia.name;


                        if (
                            tecnologiaSeleccionada &&
                            Number(tecnologia.id) ===
                            Number(tecnologiaSeleccionada)
                        ) {

                            option.selected =
                                true;

                        }


                        select.appendChild(
                            option
                        );

                    }
                );


            } catch (error) {

                console.error(
                    'Error cargando tecnologías:',
                    error
                );


                select.innerHTML = `

                    <option value="">
                        Error cargando tecnologías
                    </option>

                `;

            }

        }



        /*
        |--------------------------------------------------------------------------
        | CARGAR CATEGORÍAS
        |--------------------------------------------------------------------------
        */

        async function cargarCategorias() {

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


                const categorias =
                    Array.isArray(data)
                        ? data
                        : data.data ?? [];


                /*
                |------------------------------------------------------------------
                | ENTREGAR DATOS A TablaGestion
                |------------------------------------------------------------------
                */

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
        |--------------------------------------------------------------------------
        | EDITAR CATEGORÍA
        |--------------------------------------------------------------------------
        */

        async function editarCategoria(
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
                        'No se pudo obtener la categoría.'
                    );

                }


                const categoria =
                    data.data ?? data;



                /*
                |------------------------------------------------------------------
                | MOSTRAR FORMULARIO
                |------------------------------------------------------------------
                */

                formularioContainer.style.display =
                    'block';


                botonNueva.textContent =
                    '− Cerrar formulario';



                /*
                |------------------------------------------------------------------
                | CONFIGURAR FORMULARIO
                |------------------------------------------------------------------
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
                |------------------------------------------------------------------
                | CARGAR TECNOLOGÍAS
                |------------------------------------------------------------------
                */

                await cargarTecnologias(
                    categoria.technology_id
                );



                /*
                |------------------------------------------------------------------
                | CAMPOS
                |--------------------------------------------------------------------------
                */

                const campoNombre =
                    formulario.querySelector(
                        '[name="name"]'
                    );


                const campoDescripcion =
                    formulario.querySelector(
                        '[name="description"]'
                    );



                /*
                |------------------------------------------------------------------
                | NOMBRE
                |--------------------------------------------------------------------------
                */

                if (campoNombre) {

                    campoNombre.value =
                        categoria.name ?? '';

                }



                /*
                |------------------------------------------------------------------
                | DESCRIPCIÓN
                |--------------------------------------------------------------------------
                */

                if (campoDescripcion) {

                    campoDescripcion.value =
                        categoria.description ?? '';

                }



                /*
                |------------------------------------------------------------------
                | TÍTULO
                |--------------------------------------------------------------------------
                */

                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );


                if (titulo) {

                    titulo.textContent =
                        'Editar categoría';

                }



                /*
                |------------------------------------------------------------------
                | BOTÓN
                |--------------------------------------------------------------------------
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
                    'Error obteniendo categoría:',
                    error
                );


                alert(
                    error.message
                );

            }

        }



        /*
        |--------------------------------------------------------------------------
        | ELIMINAR CATEGORÍA
        |--------------------------------------------------------------------------
        */

        async function eliminarCategoria(
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


                console.log(
                    'Eliminado:',
                    data
                );


                /*
                |------------------------------------------------------------------
                | RECARGAR TABLA
                |------------------------------------------------------------------
                */

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
        |--------------------------------------------------------------------------
        | FORM SUCCESS
        |--------------------------------------------------------------------------
        */

        formulario.addEventListener(
            'form:success',
            async () => {

                /*
                |------------------------------------------------------------------
                | RECARGAR CATEGORÍAS
                |------------------------------------------------------------------
                */

                await cargarCategorias();



                /*
                |------------------------------------------------------------------
                | VOLVER A MODO NUEVO
                |--------------------------------------------------------------------------
                */

                formulario.reset();


                formulario.setAttribute(
                    'action',
                    API_URL
                );


                formulario.setAttribute(
                    'method',
                    'POST'
                );


                /*
                |------------------------------------------------------------------
                | RECARGAR TECNOLOGÍAS
                |--------------------------------------------------------------------------
                */

                await cargarTecnologias();



                /*
                |------------------------------------------------------------------
                | TÍTULO
                |--------------------------------------------------------------------------
                */

                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );


                if (titulo) {

                    titulo.textContent =
                        'Nueva categoría';

                }



                /*
                |------------------------------------------------------------------
                | BOTÓN
                |--------------------------------------------------------------------------
                */

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

        cargarCategorias();

    }
);

