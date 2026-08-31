
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
                'btnNuevoConcepto'
            );


        const formularioContainer =
            document.getElementById(
                'conceptFormContainer'
            );


        const formulario =
            document.getElementById(
                'conceptForm'
            );


        const tablaContainer =
            document.getElementById(
                'conceptsTable'
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
                'No se encontraron los elementos de conceptos.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | API
        |--------------------------------------------------------------------------
        */

        const API_URL =
            '/api/concepts';


        const CATEGORIES_API_URL =
            '/api/categories';



        /*
        |--------------------------------------------------------------------------
        | TABLA GESTIÓN
        |--------------------------------------------------------------------------
        |
        | Exactamente la misma arquitectura utilizada
        | en technologies.js.
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
                        key: 'name',

                        label: 'Nombre'
                    },

                    {
                        key: 'category.name',

                        label: 'Categoría'
                    },

                    {
                        key: 'type',

                        label: 'Tipo'
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
                    'No hay conceptos.',

                loadingMessage:
                    'Cargando conceptos.',

                errorMessage:
                    'Error cargando conceptos.'

            });



        /*
        |--------------------------------------------------------------------------
        | EVENTO EDITAR
        |--------------------------------------------------------------------------
        |
        | TablaGestion solamente notifica.
        |
        | concepts.js decide qué hacer.
        |
        */

        tablaContainer.addEventListener(
            'tabla-gestion:edit',
            async event => {

                const concepto =
                    event.detail;


                if (!concepto) {

                    return;

                }


                await editarConcepto(
                    concepto.id
                );

            }
        );



        /*
        |--------------------------------------------------------------------------
        | EVENTO ELIMINAR
        |--------------------------------------------------------------------------
        |
        | TablaGestion solamente notifica.
        |
        | concepts.js decide qué hacer.
        |
        */

        tablaContainer.addEventListener(
            'tabla-gestion:delete',
            async event => {

                const concepto =
                    event.detail;


                if (!concepto) {

                    return;

                }


                const confirmar =
                    confirm(
                        `¿Seguro que deseas eliminar el concepto "${concepto.name}"?`
                    );


                if (!confirmar) {

                    return;

                }


                await eliminarConcepto(
                    concepto.id
                );

            }
        );



        /*
        |--------------------------------------------------------------------------
        | NUEVO / CERRAR FORMULARIO
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
                    | CARGAR CATEGORÍAS
                    |------------------------------------------------------------------
                    */

                    await cargarCategorias();


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
                            'Nuevo concepto';

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


                    botonNuevo.textContent =
                        '− Cerrar formulario';


                } else {

                    /*
                    |------------------------------------------------------------------
                    | CERRAR
                    |------------------------------------------------------------------
                    */

                    formularioContainer.style.display =
                        'none';


                    botonNuevo.textContent =
                        '+ Nuevo concepto';

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
                    '[name="category_id"]'
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
        | CARGAR CONCEPTOS
        |--------------------------------------------------------------------------
        */

        async function cargarConceptos() {

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


                const conceptos =
                    Array.isArray(data)
                        ? data
                        : data.data ?? [];


                /*
                |------------------------------------------------------------------
                | ENTREGAR DATOS AL COMPONENTE
                |------------------------------------------------------------------
                */

                tabla.establecerDatos(
                    conceptos
                );


            } catch (error) {

                console.error(
                    'Error cargando conceptos:',
                    error
                );


                tabla.mostrarError(
                    `Error cargando conceptos: ${error.message}`
                );

            }

        }



        /*
        |--------------------------------------------------------------------------
        | EDITAR CONCEPTO
        |--------------------------------------------------------------------------
        */

        async function editarConcepto(
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
                        'No se pudo obtener el concepto.'
                    );

                }


                const concepto =
                    data.data ?? data;


                /*
                |------------------------------------------------------------------
                | MOSTRAR FORMULARIO
                |------------------------------------------------------------------
                */

                formularioContainer.style.display =
                    'block';


                botonNuevo.textContent =
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
                | CARGAR CATEGORÍAS
                |------------------------------------------------------------------
                */

                await cargarCategorias(
                    concepto.category_id
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


                const campoSlug =
                    formulario.querySelector(
                        '[name="slug"]'
                    );


                const campoTipo =
                    formulario.querySelector(
                        '[name="type"]'
                    );


                const campoDescripcion =
                    formulario.querySelector(
                        '[name="description"]'
                    );


                const campoComoUsar =
                    formulario.querySelector(
                        '[name="how_to_use"]'
                    );


                const campoEjemplo =
                    formulario.querySelector(
                        '[name="example"]'
                    );



                /*
                |------------------------------------------------------------------
                | NOMBRE
                |------------------------------------------------------------------
                */

                if (campoNombre) {

                    campoNombre.value =
                        concepto.name ?? '';

                }



                /*
                |------------------------------------------------------------------
                | SLUG
                |------------------------------------------------------------------
                */

                if (campoSlug) {

                    campoSlug.value =
                        concepto.slug ?? '';

                }



                /*
                |------------------------------------------------------------------
                | TIPO
                |------------------------------------------------------------------
                */

                if (campoTipo) {

                    campoTipo.value =
                        concepto.type ?? '';

                }



                /*
                |------------------------------------------------------------------
                | DESCRIPCIÓN
                |------------------------------------------------------------------
                */

                if (campoDescripcion) {

                    campoDescripcion.value =
                        concepto.description ?? '';

                }



                /*
                |------------------------------------------------------------------
                | CÓMO UTILIZAR
                |------------------------------------------------------------------
                */

                if (campoComoUsar) {

                    campoComoUsar.value =
                        concepto.how_to_use ?? '';

                }



                /*
                |------------------------------------------------------------------
                | EJEMPLO
                |------------------------------------------------------------------
                */

                if (campoEjemplo) {

                    campoEjemplo.value =
                        concepto.example ?? '';

                }



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
                        'Editar concepto';

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
                        'Actualizar';

                }


            } catch (error) {

                console.error(
                    'Error obteniendo concepto:',
                    error
                );


                alert(
                    error.message
                );

            }

        }



        /*
        |--------------------------------------------------------------------------
        | ELIMINAR CONCEPTO
        |--------------------------------------------------------------------------
        */

        async function eliminarConcepto(
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

                await cargarConceptos();


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
                | RECARGAR TABLA
                |------------------------------------------------------------------
                */

                await cargarConceptos();



                /*
                |------------------------------------------------------------------
                | VOLVER A MODO NUEVO
                |------------------------------------------------------------------
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
                | RECARGAR CATEGORÍAS
                |------------------------------------------------------------------
                */

                await cargarCategorias();



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
                        'Nuevo concepto';

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

        cargarConceptos();

    }
);

