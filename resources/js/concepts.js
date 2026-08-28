document.addEventListener('DOMContentLoaded', () => {


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


const tabla =
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
    !tabla
) {

    console.error(
        'No se encontraron los elementos de conceptos.'
    );

    return;

}


/*
|--------------------------------------------------------------------------
| URLS
|--------------------------------------------------------------------------
*/

const API_URL =
    '/api/concepts';

const CATEGORIES_API_URL =
    '/api/categories';


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


        if (formularioEstaCerrado) {

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


            await cargarCategorias();


            const titulo =
                formularioContainer.querySelector(
                    'h2'
                );


            if (titulo) {

                titulo.textContent =
                    'Nuevo concepto';

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

    tabla.innerHTML = `

        <tr>

            <td colspan="6">
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


        const conceptos =
            Array.isArray(data)
                ? data
                : data.data ?? [];


        pintarTabla(
            conceptos
        );


    } catch (error) {

        console.error(
            'Error cargando conceptos:',
            error
        );


        tabla.innerHTML = `

            <tr>

                <td colspan="6">

                    Error cargando conceptos.

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
    conceptos
) {

    tabla.innerHTML = '';


    if (
        !conceptos ||
        conceptos.length === 0
    ) {

        tabla.innerHTML = `

            <tr>

                <td colspan="6">

                    No hay conceptos.

                </td>

            </tr>

        `;

        return;

    }


    conceptos.forEach(
        concepto => {

            const fila =
                document.createElement(
                    'tr'
                );


            fila.innerHTML = `

                <td>
                    ${concepto.id}
                </td>

                <td>
                    ${escapeHtml(
                        concepto.name ?? ''
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        concepto.category?.name ??
                        concepto.category_name ??
                        ''
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        concepto.type ?? ''
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        concepto.description ?? ''
                    )}
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-edit"
                        data-id="${concepto.id}"
                    >
                        Editar
                    </button>


                    <button
                        type="button"
                        class="btn-delete"
                        data-id="${concepto.id}"
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


        await editarConcepto(
            id
        );

    }
);


/*
|--------------------------------------------------------------------------
| OBTENER UN CONCEPTO
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
        | CARGAR CAMPOS
        |------------------------------------------------------------------
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


        if (campoNombre) {

            campoNombre.value =
                concepto.name ?? '';

        }


        if (campoSlug) {

            campoSlug.value =
                concepto.slug ?? '';

        }


        if (campoTipo) {

            campoTipo.value =
                concepto.type ?? '';

        }


        if (campoDescripcion) {

            campoDescripcion.value =
                concepto.description ?? '';

        }


        if (campoComoUsar) {

            campoComoUsar.value =
                concepto.how_to_use ?? '';

        }


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
                '¿Seguro que deseas eliminar este concepto?'
            );


        if (!confirmar) {

            return;

        }


        await eliminarConcepto(
            id
        );

    }
);


/*
|--------------------------------------------------------------------------
| DELETE
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


        await cargarCategorias();


        const titulo =
            formularioContainer.querySelector(
                'h2'
            );


        if (titulo) {

            titulo.textContent =
                'Nuevo concepto';

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

cargarConceptos();


});
