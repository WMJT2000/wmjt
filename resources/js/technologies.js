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
                'btnNuevaTecnologia'
            );


        const formularioContainer =
            document.getElementById(
                'technologyFormContainer'
            );


        const formulario =
            document.getElementById(
                'technologyForm'
            );


        const tablaContainer =
            document.getElementById(
                'technologiesTable'
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
                'No se encontraron los elementos de tecnologías.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | API
        |--------------------------------------------------------------------------
        */

        const API_URL =
            '/api/technologies';


        /*
        |--------------------------------------------------------------------------
        | TABLA GESTIÓN
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
                    'No hay tecnologías.',

                loadingMessage:
                    'Cargando tecnologías.',

                errorMessage:
                    'Error cargando tecnologías.'

            });


        /*
        |--------------------------------------------------------------------------
        | EVENTO EDITAR
        |--------------------------------------------------------------------------
        |
        | TablaGestion NO sabe cómo editar.
        |
        | Solamente notifica:
        |
        | tabla-gestion:edit
        |
        |--------------------------------------------------------------------------
        */

        tablaContainer.addEventListener(
            'tabla-gestion:edit',
            async event => {

                const tecnologia =
                    event.detail;


                if (!tecnologia) {

                    return;

                }


                await editarTecnologia(
                    tecnologia.id
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
        | technologies.js decide qué hacer.
        |
        |--------------------------------------------------------------------------
        */

        tablaContainer.addEventListener(
            'tabla-gestion:delete',
            async event => {

                const tecnologia =
                    event.detail;


                if (!tecnologia) {

                    return;

                }


                const confirmar =
                    confirm(
                        `¿Seguro que deseas eliminar la tecnología "${tecnologia.name}"?`
                    );


                if (!confirmar) {

                    return;

                }


                await eliminarTecnologia(
                    tecnologia.id
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
            () => {

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


                    const titulo =
                        formularioContainer.querySelector(
                            'h2'
                        );


                    if (titulo) {

                        titulo.textContent =
                            'Nueva tecnología';

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

                    /*
                    |------------------------------------------------------------------
                    | CERRAR
                    |------------------------------------------------------------------
                    */

                    formularioContainer.style.display =
                        'none';


                    botonNueva.textContent =
                        '+ Nueva tecnología';

                }

            }
        );


        /*
        |--------------------------------------------------------------------------
        | CARGAR TECNOLOGÍAS
        |--------------------------------------------------------------------------
        */

        async function cargarTecnologias() {

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
                        data.message
                        || `HTTP ${response.status}`
                    );

                }


                const tecnologias =
                    Array.isArray(data)
                        ? data
                        : data.data ?? [];


                /*
                |--------------------------------------------------------------------------
                | ENTREGAR DATOS AL COMPONENTE
                |--------------------------------------------------------------------------
                */

                tabla.establecerDatos(
                    tecnologias
                );


            } catch (error) {

                console.error(
                    'Error cargando tecnologías:',
                    error
                );


                tabla.mostrarError(
                    `Error cargando tecnologías: ${error.message}`
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | EDITAR TECNOLOGÍA
        |--------------------------------------------------------------------------
        */

        async function editarTecnologia(
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
                        data.message
                        || 'No se pudo obtener la tecnología.'
                    );

                }


                const tecnologia =
                    data.data ?? data;


                /*
                |--------------------------------------------------------------------------
                | MOSTRAR FORMULARIO
                |--------------------------------------------------------------------------
                */

                formularioContainer.style.display =
                    'block';


                botonNueva.textContent =
                    '− Cerrar formulario';


                /*
                |--------------------------------------------------------------------------
                | CONFIGURAR FORMULARIO
                |--------------------------------------------------------------------------
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
                |--------------------------------------------------------------------------
                | CARGAR NOMBRE
                |--------------------------------------------------------------------------
                */

                const campoNombre =
                    formulario.querySelector(
                        '[name="name"]'
                    );


                if (campoNombre) {

                    campoNombre.value =
                        tecnologia.name ?? '';

                }


                /*
                |--------------------------------------------------------------------------
                | CARGAR DESCRIPCIÓN
                |--------------------------------------------------------------------------
                */

                const campoDescripcion =
                    formulario.querySelector(
                        '[name="description"]'
                    );


                if (campoDescripcion) {

                    campoDescripcion.value =
                        tecnologia.description ?? '';

                }


                /*
                |--------------------------------------------------------------------------
                | CAMBIAR TÍTULO
                |--------------------------------------------------------------------------
                */

                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );


                if (titulo) {

                    titulo.textContent =
                        'Editar tecnología';

                }


                /*
                |--------------------------------------------------------------------------
                | CAMBIAR BOTÓN
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
                    'Error obteniendo tecnología:',
                    error
                );


                alert(
                    error.message
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | ELIMINAR TECNOLOGÍA
        |--------------------------------------------------------------------------
        */

        async function eliminarTecnologia(
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
                        data.message
                        || 'No se pudo eliminar.'
                    );

                }


                console.log(
                    'Eliminado:',
                    data
                );


                /*
                |--------------------------------------------------------------------------
                | RECARGAR
                |--------------------------------------------------------------------------
                */

                await cargarTecnologias();


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
        | FORM.JS TERMINÓ POST / PUT
        |--------------------------------------------------------------------------
        */

        formulario.addEventListener(
            'form:success',
            async () => {

                await cargarTecnologias();


                /*
                |--------------------------------------------------------------------------
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


                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );


                if (titulo) {

                    titulo.textContent =
                        'Nueva tecnología';

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

        cargarTecnologias();

    }
);