import { TablaGestion } from './tabla-gestion.js';


document.addEventListener(
    'DOMContentLoaded',
    () => {


        /*
        |--------------------------------------------------------------------------
        | ELEMENTOS
        |--------------------------------------------------------------------------
        */

        const botonNuevo =
            document.getElementById(
                'btnNuevoManual'
            );


        const formularioContainer =
            document.getElementById(
                'manualFormContainer'
            );


        const formulario =
            document.getElementById(
                'manualForm'
            );


        const tablaContainer =
            document.getElementById(
                'manualsTable'
            );


        /*
        |--------------------------------------------------------------------------
        | VALIDAR
        |--------------------------------------------------------------------------
        */

        if (
            !botonNuevo ||
            !formularioContainer ||
            !formulario ||
            !tablaContainer
        ) {

            console.error(
                'No se encontraron los elementos de manuales.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | API
        |--------------------------------------------------------------------------
        */

        const API_URL =
            '/api/manuals';

        const TECHNOLOGIES_API_URL =
            '/api/technologies';



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
                        key: 'technology.name',

                        label: 'Tecnología'
                    },

                    {
                        key: 'difficulty',

                        label: 'Dificultad'
                    },

                    {
                        key: 'status',

                        label: 'Estado'
                    },

                    {
                        key: 'sections_count',

                        label: 'Secciones'
                    }

                ],
                actions: {

                    edit: true,

                    sections: true,

                    delete: true

                },

                emptyMessage:
                    'No hay manuales.',

                loadingMessage:
                    'Cargando manuales.',

                errorMessage:
                    'Error cargando manuales.'

            });



        tablaContainer.addEventListener(
            'tabla-gestion:sections',
            event => {

                const manual =
                    event.detail;

                if (!manual) {

                    return;

                }

                window.location.href =
                    `/gestion/manuals/${manual.id}/sections`;

            }
        );


        /*
        |--------------------------------------------------------------------------
        | EDITAR
        |--------------------------------------------------------------------------
        */

        tablaContainer.addEventListener(
            'tabla-gestion:edit',
            async event => {

                const manual =
                    event.detail;


                if (!manual) {

                    return;

                }


                await editarManual(
                    manual.id
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

                const manual =
                    event.detail;


                if (!manual) {

                    return;

                }


                const confirmar =
                    confirm(
                        `¿Seguro que deseas eliminar el manual "${manual.title}"?`
                    );


                if (!confirmar) {

                    return;

                }


                await eliminarManual(
                    manual.id
                );

            }
        );



        /*
        |--------------------------------------------------------------------------
        | NUEVO / CERRAR
        |--------------------------------------------------------------------------
        */

        botonNuevo.addEventListener(
            'click',
            async () => {

                const formularioEstaCerrado =
                    formularioContainer.style.display === 'none' ||
                    formularioContainer.style.display === '';


                if (
                    formularioEstaCerrado
                ) {

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


                    await cargarTecnologias();


                    const titulo =
                        formularioContainer.querySelector(
                            'h2'
                        );


                    if (titulo) {

                        titulo.textContent =
                            'Nuevo manual';

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
                        '+ Nuevo manual';

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
        | CARGAR MANUALES
        |--------------------------------------------------------------------------
        */

        async function cargarManuales() {

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


                const manuales =
                    Array.isArray(data)
                        ? data
                        : data.data ?? [];


                tabla.establecerDatos(
                    manuales
                );


            } catch (error) {

                console.error(
                    'Error cargando manuales:',
                    error
                );


                tabla.mostrarError(
                    `Error cargando manuales: ${error.message}`
                );

            }

        }



        /*
        |--------------------------------------------------------------------------
        | EDITAR MANUAL
        |--------------------------------------------------------------------------
        */

        async function editarManual(
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
                        'No se pudo obtener el manual.'
                    );

                }


                const manual =
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


                await cargarTecnologias(
                    manual.technology_id
                );


                /*
                |--------------------------------------------------------------------------
                | CAMPOS
                |--------------------------------------------------------------------------
                */

                const campos = [
                    'title',
                    'slug',
                    'description',
                    'objective',
                    'difficulty',
                    'status'
                ];


                campos.forEach(
                    nombre => {

                        const campo =
                            formulario.querySelector(
                                `[name="${nombre}"]`
                            );


                        if (campo) {

                            campo.value =
                                manual[nombre] ?? '';

                        }

                    }
                );


                /*
                |--------------------------------------------------------------------------
                | TÍTULO
                |--------------------------------------------------------------------------
                */

                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );


                if (titulo) {

                    titulo.textContent =
                        'Editar manual';

                }


                /*
                |--------------------------------------------------------------------------
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
                    'Error obteniendo manual:',
                    error
                );


                alert(
                    error.message
                );

            }

        }



        /*
        |--------------------------------------------------------------------------
        | ELIMINAR MANUAL
        |--------------------------------------------------------------------------
        */

        async function eliminarManual(
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


                await cargarManuales();


            } catch (error) {

                console.error(
                    'Error eliminando manual:',
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

                await cargarManuales();


                formulario.reset();


                formulario.setAttribute(
                    'action',
                    API_URL
                );


                formulario.setAttribute(
                    'method',
                    'POST'
                );


                await cargarTecnologias();


                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );


                if (titulo) {

                    titulo.textContent =
                        'Nuevo manual';

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

        cargarManuales();

    }
);