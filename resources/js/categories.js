import { TablaGestion } from './tabla-gestion.js';

document.addEventListener(
    'DOMContentLoaded',
    () => {
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

        const technologyContext =
            document.getElementById(
                'technologyContext'
            );

        const technologyId =
            technologyContext
                ? technologyContext.dataset.technologyId
                : null;

        if (
            !botonNueva ||
            !formularioContainer ||
            !formulario ||
            !tablaContainer ||
            !technologyId
        ) {
            console.error(
                'No se encontraron los elementos de categorías.'
            );
            return;
        }

        const API_URL =
            '/api/categories';

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
                    concepts: true,
                    delete: true
                },

                emptyMessage:
                    'No hay categorías.',

                loadingMessage:
                    'Cargando categorías.',

                errorMessage:
                    'Error cargando categorías.'
            });

        let campoTecnologia =
            formulario.querySelector(
                '[name="technology_id"]'
            );

        if (!campoTecnologia) {
            campoTecnologia =
                document.createElement('input');

            campoTecnologia.type =
                'hidden';

            campoTecnologia.name =
                'technology_id';

            formulario.appendChild(
                campoTecnologia
            );
        }

        campoTecnologia.value =
            technologyId;

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

        tablaContainer.addEventListener(
            'tabla-gestion:concepts',
            event => {
                const categoria =
                    event.detail;

                if (!categoria) {
                    return;
                }

                window.location.href =
                    `/gestion/categories/${categoria.id}/concepts`;
            }
        );

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

                    campoTecnologia.value =
                        technologyId;

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

        async function cargarCategorias() {
            tabla.mostrarCargando();

            try {
                const response =
                    await fetch(
                        `${API_URL}?technology_id=${technologyId}`,
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

        async function editarCategoria(
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

                campoTecnologia.value =
                    technologyId;

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

        async function eliminarCategoria(
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

                await cargarCategorias();
            } catch (error) {
                console.error(
                    'Error eliminando categoría:',
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
                await cargarCategorias();

                formulario.reset();

                campoTecnologia.value =
                    technologyId;

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