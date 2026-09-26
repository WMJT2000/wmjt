import { TablaGestion } from './tabla-gestion.js';

document.addEventListener(
    'DOMContentLoaded',
    () => {
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

        const API_URL =
            '/api/technologies';

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
                    categories: true,
                    delete: true
                },

                emptyMessage:
                    'No hay tecnologías.',

                loadingMessage:
                    'Cargando tecnologías.',

                errorMessage:
                    'Error cargando tecnologías.'
            });

        tablaContainer.addEventListener(
            'tabla-gestion:categories',
            event => {
                const tecnologia =
                    event.detail;

                if (!tecnologia) {
                    return;
                }

                window.location.href =
                    `/gestion/technologies/${tecnologia.id}/categories`;
            }
        );

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
                    formularioContainer.style.display =
                        'none';

                    botonNueva.textContent =
                        '+ Nueva tecnología';
                }
            }
        );

        async function cargarTecnologias() {
            tabla.mostrarCargando();

            try {
                const response =
                    await fetch(
                        API_URL,
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
                        data.message
                        || `HTTP ${response.status}`
                    );
                }

                const tecnologias =
                    Array.isArray(data)
                        ? data
                        : data.data ?? [];

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

        async function editarTecnologia(
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
                        data.message
                        || 'No se pudo obtener la tecnología.'
                    );
                }

                const tecnologia =
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

                const campoNombre =
                    formulario.querySelector(
                        '[name="name"]'
                    );

                if (campoNombre) {
                    campoNombre.value =
                        tecnologia.name ?? '';
                }

                const campoDescripcion =
                    formulario.querySelector(
                        '[name="description"]'
                    );

                if (campoDescripcion) {
                    campoDescripcion.value =
                        tecnologia.description ?? '';
                }

                const titulo =
                    formularioContainer.querySelector(
                        'h2'
                    );

                if (titulo) {
                    titulo.textContent =
                        'Editar tecnología';
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
                    'Error obteniendo tecnología:',
                    error
                );

                alert(
                    error.message
                );
            }
        }

        async function eliminarTecnologia(
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
                        data.message
                        || 'No se pudo eliminar.'
                    );
                }

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

        formulario.addEventListener(
            'form:success',
            async () => {
                await cargarTecnologias();

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

        cargarTecnologias();
    }
);