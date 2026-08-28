document.addEventListener('DOMContentLoaded', () => {


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


const tabla =
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
    !tabla
) {

    console.error(
        'No se encontraron los elementos de categorías.'
    );

    return;

}


/*
|--------------------------------------------------------------------------
| URLS
|--------------------------------------------------------------------------
*/

const API_URL =
    '/api/categories';


const TECHNOLOGIES_API_URL =
    '/api/technologies';


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
            | CERRAR FORMULARIO
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

    tabla.innerHTML = `

        <tr>

            <td colspan="5">
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
                data.message ||
                `HTTP ${response.status}`
            );

        }


        const categorias =
            Array.isArray(data)
                ? data
                : data.data ?? [];


        pintarTabla(
            categorias
        );


    } catch (error) {

        console.error(
            'Error cargando categorías:',
            error
        );


        tabla.innerHTML = `

            <tr>

                <td colspan="5">

                    Error cargando categorías.

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
    categorias
) {

    tabla.innerHTML = '';


    if (
        !categorias ||
        categorias.length === 0
    ) {

        tabla.innerHTML = `

            <tr>

                <td colspan="5">

                    No hay categorías.

                </td>

            </tr>

        `;

        return;

    }


    categorias.forEach(
        categoria => {

            const fila =
                document.createElement(
                    'tr'
                );


            fila.innerHTML = `

                <td>
                    ${categoria.id}
                </td>


                <td>
                    ${escapeHtml(
                        categoria.technology?.name ??
                        categoria.technology_name ??
                        ''
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        categoria.name ?? ''
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        categoria.description ?? ''
                    )}
                </td>


                <td>

                    <button
                        type="button"
                        class="btn-edit"
                        data-id="${categoria.id}"
                    >
                        Editar
                    </button>


                    <button
                        type="button"
                        class="btn-delete"
                        data-id="${categoria.id}"
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


        await editarCategoria(
            id
        );

    }
);


/*
|--------------------------------------------------------------------------
| OBTENER UNA CATEGORÍA
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
        | CARGAR CAMPOS
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
                categoria.name ?? '';

        }


        if (campoDescripcion) {

            campoDescripcion.value =
                categoria.description ?? '';

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
                'Editar categoría';

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
                '¿Seguro que deseas eliminar esta categoría?'
            );


        if (!confirmar) {

            return;

        }


        await eliminarCategoria(
            id
        );

    }
);


/*
|--------------------------------------------------------------------------
| DELETE
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

        await cargarCategorias();


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


        await cargarTecnologias();


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


/*
|--------------------------------------------------------------------------
| ESCAPAR HTML
|--------------------------------------------------------------------------
*/

function escapeHtml(
    text
) {

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

cargarCategorias();


});
