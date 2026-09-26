import { TablaGestion } from './tabla-gestion.js';

document.addEventListener(
    'DOMContentLoaded',
    () => {
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

        const categoryContext =
            document.getElementById(
                'categoryContext'
            );

        const categoryId =
            categoryContext
                ? categoryContext.dataset.categoryId
                : null;

        if (
            !botonNuevo ||
            !formularioContainer ||
            !formulario ||
            !tablaContainer ||
            !categoryId
        ) {
            console.error(
                'No se encontraron los elementos de conceptos.'
            );
            return;
        }

        const API_URL =
            '/api/concepts';

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

        let campoCategoria =
            formulario.querySelector(
                '[name="category_id"]'
            );

        if (!campoCategoria) {
            campoCategoria =
                document.createElement('input');

            campoCategoria.type =
                'hidden';

            campoCategoria.name =
                'category_id';

            formulario.appendChild(
                campoCategoria
            );
        }

        campoCategoria.value =
            categoryId;

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

        botonNuevo.addEventListener(
            'click',
            () => {
                const formularioEstaCerrado =
                    formularioContainer.style.display === 'none' ||
                    formularioContainer.style.display === '';

                if (formularioEstaCerrado) {
                    formularioContainer.style.display =
                        'block';

                    formulario.reset();

                    campoCategoria.value =
                        categoryId;

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
                    formularioContainer.style.display =
                        'none';

                    botonNuevo.textContent =
                        '+ Nuevo concepto';
                }
            }
        );

        async function cargarConceptos() {
            tabla.mostrarCargando();

            try {
                const response =
                    await fetch(
                        `${API_URL}?category_id=${categoryId}`,
                        {
                            method: 'GET',
                            credentials: 'same-origin',
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

        async function editarConcepto(
            id
        ) {
            try {
                const response =
                    await fetch(
                        `${API_URL}/${id}`,
                        {
                            method: 'GET',
                            credentials: 'same-origin',
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

                campoCategoria.value =
                    categoryId;

                const campoNombre =
                    formulario.querySelector(
                        '[name="name"]'
                    );

                if (campoNombre) {
                    campoNombre.value =
                        concepto.name ?? '';
                }

                const campoSlug =
                    formulario.querySelector(
                        '[name="slug"]'
                    );

                if (campoSlug) {
                    campoSlug.value =
                        concepto.slug ?? '';
                }

                const campoTipo =
                    formulario.querySelector(
                        '[name="type"]'
                    );

                if (campoTipo) {
                    campoTipo.value =
                        concepto.type ?? '';
                }

                const campoDescripcion =
                    formulario.querySelector(
                        '[name="description"]'
                    );

                if (campoDescripcion) {
                    campoDescripcion.value =
                        concepto.description ?? '';
                }

                const campoComoUsar =
                    formulario.querySelector(
                        '[name="how_to_use"]'
                    );

                if (campoComoUsar) {
                    campoComoUsar.value =
                        concepto.how_to_use ?? '';
                }

                const campoEjemplo =
                    formulario.querySelector(
                        '[name="example"]'
                    );

                if (campoEjemplo) {
                    campoEjemplo.value =
                        concepto.example ?? '';
                }

                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );

                if (titulo) {
                    titulo.textContent =
                        'Editar concepto';
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
                    'Error obteniendo concepto:',
                    error
                );

                alert(
                    error.message
                );
            }
        }

        async function eliminarConcepto(
            id
        ) {
            try {
                const response =
                    await fetch(
                        `${API_URL}/${id}`,
                        {
                            method: 'DELETE',
                            credentials: 'same-origin',
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

        formulario.addEventListener(
            'form:success',
            async () => {
                await cargarConceptos();

                formulario.reset();

                campoCategoria.value =
                    categoryId;

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

        cargarConceptos();
    }
);