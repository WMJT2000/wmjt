
import { TablaGestion } from './tabla-gestion.js';


document.addEventListener('DOMContentLoaded', () => {

    const formContainer =
        document.getElementById('manualStepFormContainer');

    const btnNuevoPaso =
        document.getElementById('btnNuevoPaso');

    const form =
        document.getElementById('manualStepForm');

    const tablaContainer =
        document.getElementById('manualStepsTable');

    if (!form || !tablaContainer) {
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | ID de la sección
    |--------------------------------------------------------------------------
    */

    const sectionId =
        form.querySelector('[name="section_id"]')?.value;

    if (!sectionId) {
        console.error(
            'No se encontró el section_id del formulario.'
        );

        return;
    }

    /*
    |--------------------------------------------------------------------------
    | Tabla
    |--------------------------------------------------------------------------
    */

    const tabla =
        new TablaGestion({
            container: tablaContainer,
            data: [],
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
            }
        });

    /*
    |--------------------------------------------------------------------------
    | Mostrar formulario
    |--------------------------------------------------------------------------
    */

    if (btnNuevoPaso) {

        btnNuevoPaso.addEventListener(
            'click',
            () => {

                formContainer.style.display = 'block';

                form.reset();

                const sectionInput =
                    form.querySelector(
                        '[name="section_id"]'
                    );

                if (sectionInput) {
                    sectionInput.value = sectionId;
                }

                const positionInput =
                    form.querySelector(
                        '[name="position"]'
                    );

                if (positionInput) {
                    positionInput.value = 1;
                }

                form.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

            }
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Cargar pasos
    |--------------------------------------------------------------------------
    */

    async function cargarPasos() {

        try {

            const response =
                await fetch(
                    `/api/manual-steps/section/${sectionId}`,
                    {
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
                    'No se pudieron cargar los pasos.'
                );

            }

            tabla.establecerDatos(
                result.data || []
            );

        } catch (error) {

            console.error(
                'Error cargando pasos:',
                error
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Crear / editar
    |--------------------------------------------------------------------------
    */

    form.addEventListener(
        'form:success',
        async event => {

            const result =
                event.detail;

            console.log(
                'Paso guardado:',
                result
            );

            formContainer.style.display = 'none';

            await cargarPasos();

        }
    );

    /*
    |--------------------------------------------------------------------------
    | Editar
    |--------------------------------------------------------------------------
    */

    tablaContainer.addEventListener(
        'tabla-gestion:edit',
        event => {

            const paso =
                event.detail;

            if (!paso) {
                return;
            }

            formContainer.style.display = 'block';

            /*
            | Cargar datos en el formulario
            */

            Object.keys(paso).forEach(
                key => {

                    const input =
                        form.querySelector(
                            `[name="${key}"]`
                        );

                    if (input) {

                        input.value =
                            paso[key] ?? '';

                    }

                }
            );

            /*
            | Asegurar section_id
            */

            const sectionInput =
                form.querySelector(
                    '[name="section_id"]'
                );

            if (sectionInput) {
                sectionInput.value = sectionId;
            }

            /*
            | Cambiar configuración para UPDATE
            */

            form.dataset.editingId =
                paso.id;

            form.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        }
    );

    /*
    |--------------------------------------------------------------------------
    | Antes de enviar el formulario
    |--------------------------------------------------------------------------
    |
    | Si estamos editando:
    |
    | PUT /api/manual-steps/{id}
    |
    | Si estamos creando:
    |
    | POST /api/manual-steps
    |
    */

    form.addEventListener(
        'submit',
        async event => {

            const editingId =
                form.dataset.editingId;

            if (!editingId) {
                return;
            }

            event.preventDefault();

            const formData =
                new FormData(form);

            const data =
                Object.fromEntries(
                    formData.entries()
                );

            try {

                const response =
                    await fetch(
                        `/api/manual-steps/${editingId}`,
                        {
                            method: 'PUT',

                            headers: {
                                'Content-Type':
                                    'application/json',

                                'Accept':
                                    'application/json'
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        'Error actualizando el paso.'
                    );

                }

                /*
                | Limpiar modo edición
                */

                delete form.dataset.editingId;

                form.reset();

                const sectionInput =
                    form.querySelector(
                        '[name="section_id"]'
                    );

                if (sectionInput) {
                    sectionInput.value =
                        sectionId;
                }

                formContainer.style.display =
                    'none';

                await cargarPasos();

            } catch (error) {

                console.error(
                    'Error actualizando paso:',
                    error
                );

                alert(
                    error.message
                );

            }

        }
    );

    /*
    |--------------------------------------------------------------------------
    | Eliminar
    |--------------------------------------------------------------------------
    */

    tablaContainer.addEventListener(
        'tabla-gestion:delete',
        async event => {

            const paso =
                event.detail;

            if (!paso) {
                return;
            }

            const confirmar =
                confirm(
                    `¿Deseas eliminar el paso "${paso.title}"?`
                );

            if (!confirmar) {
                return;
            }

            try {

                const response =
                    await fetch(
                        `/api/manual-steps/${paso.id}`,
                        {
                            method: 'DELETE',

                            headers: {
                                'Accept':
                                    'application/json'
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

                alert(
                    error.message
                );

            }

        }
    );

    /*
    |--------------------------------------------------------------------------
    | Carga inicial
    |--------------------------------------------------------------------------
    */

    cargarPasos();

});