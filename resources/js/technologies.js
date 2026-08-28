
document.addEventListener('DOMContentLoaded', () => {


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


    const tabla =
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
        !tabla
    ) {

        console.error(
            'No se encontraron los elementos de tecnologías.'
        );

        return;

    }


    /*
    |--------------------------------------------------------------------------
    | URL BASE
    |--------------------------------------------------------------------------
    */

    const API_URL =
        '/api/technologies';


    /*
    |--------------------------------------------------------------------------
    | NUEVA / CERRAR FORMULARIO
    |--------------------------------------------------------------------------
    |
    | Un solo clic:
    |
    | Cerrado -> abre
    | Abierto -> cierra
    |
    |--------------------------------------------------------------------------
    */

    botonNueva.addEventListener(
        'click',
        () => {

            const formularioEstaCerrado =
                formularioContainer.style.display === 'none' ||
                formularioContainer.style.display === '';


            if (formularioEstaCerrado) {

                /*
                |------------------------------------------------------------------
                | ABRIR FORMULARIO
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
                | CERRAR FORMULARIO
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

        tabla.innerHTML = `

            <tr>

                <td colspan="4">
                    Cargando...
                </td>

            </tr>

        `;


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


            pintarTabla(
                tecnologias
            );


        } catch (error) {

            console.error(
                'Error cargando tecnologías:',
                error
            );


            tabla.innerHTML = `

                <tr>

                    <td colspan="4">

                        Error cargando tecnologías.

                        <br>

                        ${escapeHtml(
                            error.message
                        )}

                    </td>

                </tr>

            `;

        }

    }


    /*
    |--------------------------------------------------------------------------
    | PINTAR TABLA
    |--------------------------------------------------------------------------
    */

    function pintarTabla(
        tecnologias
    ) {

        tabla.innerHTML = '';


        if (
            !tecnologias ||
            tecnologias.length === 0
        ) {

            tabla.innerHTML = `

                <tr>

                    <td colspan="4">

                        No hay tecnologías.

                    </td>

                </tr>

            `;

            return;

        }


        tecnologias.forEach(
            tecnologia => {

                const fila =
                    document.createElement(
                        'tr'
                    );


                fila.innerHTML = `

                    <td>
                        ${tecnologia.id}
                    </td>

                    <td>
                        ${escapeHtml(
                            tecnologia.name
                            ?? ''
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            tecnologia.description
                            ?? ''
                        )}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn-edit"
                            data-id="${tecnologia.id}"
                        >
                            Editar
                        </button>


                        <button
                            type="button"
                            class="btn-delete"
                            data-id="${tecnologia.id}"
                        >
                            Eliminar
                        </button>

                    </td>

                `;


                tabla.appendChild(
                    fila
                );

            }
        );

    }


    /*
    |--------------------------------------------------------------------------
    | EDITAR
    |--------------------------------------------------------------------------
    */

    tabla.addEventListener(
        'click',
        async event => {

            const boton =
                event.target.closest(
                    '.btn-edit'
                );


            if (!boton) {

                return;

            }


            const id =
                boton.dataset.id;


            await editarTecnologia(
                id
            );

        }
    );


    /*
    |--------------------------------------------------------------------------
    | OBTENER UNA TECNOLOGÍA
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
            | CARGAR VALORES
            |------------------------------------------------------------------
            */

            const campoNombre =
                formulario.querySelector(
                    '[name="name"]'
                );


            const campoDescripcion =
                formulario.querySelector(
                    '[name="description"]'
                );


            if (campoNombre) {

                campoNombre.value =
                    tecnologia.name ?? '';

            }


            if (campoDescripcion) {

                campoDescripcion.value =
                    tecnologia.description ?? '';

            }


            /*
            |------------------------------------------------------------------
            | CAMBIAR TÍTULO
            |------------------------------------------------------------------
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
            |------------------------------------------------------------------
            | CAMBIAR BOTÓN
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
    | ELIMINAR
    |--------------------------------------------------------------------------
    */

    tabla.addEventListener(
        'click',
        async event => {

            const boton =
                event.target.closest(
                    '.btn-delete'
                );


            if (!boton) {

                return;

            }


            const id =
                boton.dataset.id;


            const confirmar =
                confirm(
                    '¿Seguro que deseas eliminar esta tecnología?'
                );


            if (!confirmar) {

                return;

            }


            await eliminarTecnologia(
                id
            );

        }
    );


    /*
    |--------------------------------------------------------------------------
    | DELETE
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
    | CUANDO FORM.JS TERMINA UN POST / PUT
    |--------------------------------------------------------------------------
    */

    formulario.addEventListener(
        'form:success',
        async () => {

            await cargarTecnologias();


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
    | ESCAPAR HTML
    |--------------------------------------------------------------------------
    */

    function escapeHtml(text) {

        const div =
            document.createElement(
                'div'
            );


        div.textContent =
            text;


        return div.innerHTML;

    }


    /*
    |--------------------------------------------------------------------------
    | CARGAR AL INICIAR
    |--------------------------------------------------------------------------
    */

    cargarTecnologias();

});

