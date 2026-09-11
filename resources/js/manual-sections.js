
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
                'btnNuevaSeccion'
            );

        const formularioContainer =
            document.getElementById(
                'manualSectionFormContainer'
            );

        const formulario =
            document.getElementById(
                'manualSectionForm'
            );

        const tablaContainer =
            document.getElementById(
                'manualSectionsTable'
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
                'No se encontraron los elementos de secciones.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | DATOS DEL MANUAL
        |--------------------------------------------------------------------------
        */

        const manualId =
            formulario.querySelector(
                '[name="manual_id"]'
            )?.value;


        if (!manualId) {

            console.error(
                'No se encontró el manual_id.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | API
        |--------------------------------------------------------------------------
        */

        const API_URL =
            '/api/manual-sections';


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
                        key: 'title',
                        label: 'Título'
                    },

                    {
                        key: 'description',
                        label: 'Descripción'
                    },

                    {
                        key: 'position',
                        label: 'Posición'
                    },

                    {
                        key: 'steps_count',
                        label: 'Pasos'
                    }

                ],

                actions: {

                    edit: true,

                    steps: true,

                    delete: true

                },

                emptyMessage:
                    'No hay secciones.',

                loadingMessage:
                    'Cargando secciones.',

                errorMessage:
                    'Error cargando secciones.'

            });


        /*
        |--------------------------------------------------------------------------
        | EDITAR
        |--------------------------------------------------------------------------
        */


        tablaContainer.addEventListener(
            'tabla-gestion:steps',
            event => {

                const section =
                    event.detail;

                if (!section) {

                    return;

                }

                window.location.href =
                    `/gestion/manuals/${manualId}/sections/${section.id}/steps`;

            }
        );


        tablaContainer.addEventListener(
            'tabla-gestion:edit',
            async event => {

                const section =
                    event.detail;

                if (!section) {

                    return;

                }

                await editarSeccion(
                    section.id
                );

            }
        );


        /*
        |--------------------------------------------------------------------------
        | ELIMINAR
        |--------------------------------------------------------------------------
        */

        tablaContainer.addEventListener(
            'tabla-gestion:delete',
            async event => {

                const section =
                    event.detail;

                if (!section) {

                    return;

                }

                const confirmar =
                    confirm(
                        `¿Seguro que deseas eliminar la sección "${section.title}"?`
                    );

                if (!confirmar) {

                    return;

                }

                await eliminarSeccion(
                    section.id
                );

            }
        );


        /*
        |--------------------------------------------------------------------------
        | NUEVA SECCIÓN / CERRAR
        |--------------------------------------------------------------------------
        */

        botonNueva.addEventListener(
            'click',
            () => {

                const formularioEstaCerrado =
                    formularioContainer.style.display === 'none' ||
                    formularioContainer.style.display === '';


                if (formularioEstaCerrado) {

                    formularioContainer.style.display =
                        'block';


                    formulario.reset();


                    /*
                    |--------------------------------------------------------------
                    | Restaurar manual
                    |--------------------------------------------------------------
                    */

                    const campoManual =
                        formulario.querySelector(
                            '[name="manual_id"]'
                        );

                    if (campoManual) {

                        campoManual.value =
                            manualId;

                    }


                    /*
                    |--------------------------------------------------------------
                    | Valores iniciales
                    |--------------------------------------------------------------
                    */

                    const campoPosition =
                        formulario.querySelector(
                            '[name="position"]'
                        );

                    if (campoPosition) {

                        campoPosition.value =
                            1;

                    }


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
                            'Nueva sección';

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
                        '+ Nueva sección';

                }

            }
        );


        /*
        |--------------------------------------------------------------------------
        | CARGAR SECCIONES
        |--------------------------------------------------------------------------
        */

        async function cargarSecciones() {

            tabla.mostrarCargando();


            try {

                const response =
                    await fetch(
                        `${API_URL}/manual/${manualId}`,
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


                const secciones =
                    Array.isArray(data)
                        ? data
                        : data.data ?? [];


                tabla.establecerDatos(
                    secciones
                );


            } catch (error) {

                console.error(
                    'Error cargando secciones:',
                    error
                );


                tabla.mostrarError(
                    `Error cargando secciones: ${error.message}`
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | EDITAR SECCIÓN
        |--------------------------------------------------------------------------
        */

        async function editarSeccion(
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
                        'No se pudo obtener la sección.'
                    );

                }


                const section =
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


                /*
                |--------------------------------------------------------------
                | CAMPOS
                |--------------------------------------------------------------
                */

                const campos = [

                    'title',
                    'description',
                    'position'

                ];


                campos.forEach(
                    nombre => {

                        const campo =
                            formulario.querySelector(
                                `[name="${nombre}"]`
                            );


                        if (campo) {

                            campo.value =
                                section[nombre] ?? '';

                        }

                    }
                );


                /*
                |--------------------------------------------------------------
                | Manual
                |--------------------------------------------------------------
                */

                const campoManual =
                    formulario.querySelector(
                        '[name="manual_id"]'
                    );


                if (campoManual) {

                    campoManual.value =
                        section.manual_id ??
                        manualId;

                }


                /*
                |--------------------------------------------------------------
                | TÍTULO
                |--------------------------------------------------------------
                */

                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );


                if (titulo) {

                    titulo.textContent =
                        'Editar sección';

                }


                /*
                |--------------------------------------------------------------
                | BOTÓN
                |--------------------------------------------------------------
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
                    'Error obteniendo sección:',
                    error
                );


                alert(
                    error.message
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | ELIMINAR SECCIÓN
        |--------------------------------------------------------------------------
        */

        async function eliminarSeccion(
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
                        'No se pudo eliminar la sección.'
                    );

                }


                await cargarSecciones();


            } catch (error) {

                console.error(
                    'Error eliminando sección:',
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

                await cargarSecciones();


                formulario.reset();


                /*
                |--------------------------------------------------------------
                | Restaurar manual
                |--------------------------------------------------------------
                */

                const campoManual =
                    formulario.querySelector(
                        '[name="manual_id"]'
                    );

                if (campoManual) {

                    campoManual.value =
                        manualId;

                }


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
                        'Nueva sección';

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

        cargarSecciones();

    }
);

