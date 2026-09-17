import { TablaGestion } from './tabla-gestion.js';

document.addEventListener('DOMContentLoaded', () => {

    const formContainer = document.getElementById('manualStepFormContainer');
    const btnNuevoPaso = document.getElementById('btnNuevoPaso');
    const form = document.getElementById('manualStepForm');
    const tablaContainer = document.getElementById('manualStepsTable');

    if (!formContainer || !btnNuevoPaso || !form || !tablaContainer) {
        console.error('No se encontraron los elementos de pasos.');
        return;
    }

    const sectionId = form.querySelector('[name="section_id"]')?.value;

    if (!sectionId) {
        console.error('No se encontró el section_id del formulario.');
        return;
    }

    const API_URL = '/api/manual-steps';

    const tabla = new TablaGestion({
        container: tablaContainer,

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
                key: 'position',
                label: 'Posición'
            }
        ],

        actions: {
            edit: true,
            delete: true
        },

        emptyMessage: 'No hay pasos.',
        loadingMessage: 'Cargando pasos.',
        errorMessage: 'Error cargando pasos.'
    });


    // =========================================================
    // NUEVO PASO
    // =========================================================

    btnNuevoPaso.addEventListener('click', () => {

        const formularioEstaCerrado =
            formContainer.style.display === 'none' ||
            formContainer.style.display === '';

        if (formularioEstaCerrado) {

            formContainer.style.display = 'block';

            form.reset();

            const sectionInput =
                form.querySelector('[name="section_id"]');

            if (sectionInput) {
                sectionInput.value = sectionId;
            }

            const positionInput =
                form.querySelector('[name="position"]');

            if (positionInput) {
                positionInput.value = 1;
            }

            // Configurar formulario para CREAR
            form.setAttribute('action', API_URL);
            form.setAttribute('method', 'POST');

            const titulo =
                formContainer.querySelector('h2');

            if (titulo) {
                titulo.textContent = 'Nuevo paso';
            }

            const boton =
                form.querySelector('.form-button');

            if (boton) {
                boton.textContent = 'Guardar';
            }

            btnNuevoPaso.textContent = '− Cerrar formulario';

            form.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        } else {

            formContainer.style.display = 'none';

            btnNuevoPaso.textContent = '+ Nuevo paso';
        }
    });


    // =========================================================
    // CARGAR PASOS
    // =========================================================

    async function cargarPasos() {

        tabla.mostrarCargando();

        try {

            const response = await fetch(
                `${API_URL}/section/${sectionId}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `HTTP ${response.status}`
                );
            }

            const pasos =
                Array.isArray(result)
                    ? result
                    : result.data ?? [];

            tabla.establecerDatos(pasos);

        } catch (error) {

            console.error(
                'Error cargando pasos:',
                error
            );

            tabla.mostrarError(
                `Error cargando pasos: ${error.message}`
            );
        }
    }


    // =========================================================
    // EDITAR PASO
    // =========================================================

    tablaContainer.addEventListener(
        'tabla-gestion:edit',
        async (event) => {

            const paso = event.detail;

            if (!paso) {
                return;
            }

            await editarPaso(paso.id);
        }
    );


    async function editarPaso(id) {

        try {

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    'No se pudo obtener el paso.'
                );
            }

            const paso =
                result.data ?? result;


            // Mostrar formulario
            formContainer.style.display = 'block';

            btnNuevoPaso.textContent =
                '− Cerrar formulario';


            // IMPORTANTE:
            // Cambiar el formulario de CREAR a ACTUALIZAR

            form.setAttribute(
                'action',
                `${API_URL}/${id}`
            );

            form.setAttribute(
                'method',
                'PUT'
            );


            // =================================================
            // RELLENAR CAMPOS
            // =================================================

            const campos = [
                'title',
                'description',
                'instructions',
                'command',
                'code',
                'expected_result',
                'notes',
                'position'
            ];

            campos.forEach(nombre => {

                const input =
                    form.querySelector(
                        `[name="${nombre}"]`
                    );

                if (input) {
                    input.value =
                        paso[nombre] ?? '';
                }
            });


            // Mantener section_id

            const sectionInput =
                form.querySelector(
                    '[name="section_id"]'
                );

            if (sectionInput) {

                sectionInput.value =
                    paso.section_id ?? sectionId;
            }


            // =================================================
            // CAMBIAR TÍTULO DEL FORMULARIO
            // =================================================

            const titulo =
                formContainer.querySelector('h2');

            if (titulo) {
                titulo.textContent = 'Editar paso';
            }


            // =================================================
            // CAMBIAR BOTÓN
            // =================================================

            const boton =
                form.querySelector('.form-button');

            if (boton) {
                boton.textContent = 'Actualizar';
            }


            form.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        } catch (error) {

            console.error(
                'Error obteniendo paso:',
                error
            );

            alert(error.message);
        }
    }


    // =========================================================
    // ELIMINAR PASO
    // =========================================================

    tablaContainer.addEventListener(
        'tabla-gestion:delete',
        async (event) => {

            const paso = event.detail;

            if (!paso) {
                return;
            }

            const confirmar = confirm(
                `¿Seguro que deseas eliminar el paso "${paso.title}"?`
            );

            if (!confirmar) {
                return;
            }

            try {

                const response = await fetch(
                    `${API_URL}/${paso.id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json'
                        }
                    }
                );

                const result =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        'No se pudo eliminar el paso.'
                    );
                }

                await cargarPasos();

            } catch (error) {

                console.error(
                    'Error eliminando paso:',
                    error
                );

                alert(error.message);
            }
        }
    );


    // =========================================================
    // FORMULARIO GUARDADO CORRECTAMENTE
    // =========================================================

    form.addEventListener(
        'form:success',
        async (event) => {

            console.log(
                'Paso guardado:',
                event.detail
            );


            // Recargar tabla
            await cargarPasos();


            // Limpiar formulario
            form.reset();


            // Restaurar section_id

            const sectionInput =
                form.querySelector(
                    '[name="section_id"]'
                );

            if (sectionInput) {
                sectionInput.value = sectionId;
            }


            // =================================================
            // VOLVER A MODO CREAR
            // =================================================

            form.setAttribute(
                'action',
                API_URL
            );

            form.setAttribute(
                'method',
                'POST'
            );


            const titulo =
                formContainer.querySelector('h2');

            if (titulo) {
                titulo.textContent = 'Nuevo paso';
            }


            const boton =
                form.querySelector('.form-button');

            if (boton) {
                boton.textContent = 'Guardar';
            }


            // Ocultar formulario

            formContainer.style.display = 'none';

            btnNuevoPaso.textContent =
                '+ Nuevo paso';
        }
    );


    // =========================================================
    // INICIALIZAR
    // =========================================================

    cargarPasos();

});