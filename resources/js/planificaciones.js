import { TablaGestion } from './tabla-gestion.js';

document.addEventListener('DOMContentLoaded', async () => {

    const tablaContainer =
        document.getElementById('planificacionesTable');

    if (!tablaContainer) {
        return;
    }


    // ==========================================
    // TABLA
    // ==========================================

    const tabla = new TablaGestion({

        container: tablaContainer,

        columns: [
            {
                key: 'id',
                label: 'ID'
            },
            {
                key: 'experiencia_aprendizaje',
                label: 'Experiencia'
            },
            {
                key: 'nombre_maestra',
                label: 'Maestra'
            },
            {
                key: 'fecha',
                label: 'Fecha'
            },
            {
                key: 'nivel_educativo',
                label: 'Nivel'
            },
            {
                key: 'estado',
                label: 'Estado'
            },
            {
                key: 'progreso',
                label: 'Progreso'
            }
        ],

        actions: {
            edit: true,
            delete: true
        },

        emptyMessage: 'No hay planificaciones.',
        loadingMessage: 'Cargando planificaciones.',
        errorMessage: 'Error cargando planificaciones.'
    });


    // ==========================================
    // CARGAR PLANIFICACIONES
    // ==========================================

    try {

        const response = await fetch(
            '/api/planificaciones'
        );

        if (!response.ok) {
            throw new Error(
                'Error en la petición'
            );
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(
                result.message ||
                'Error cargando planificaciones'
            );
        }

        tabla.establecerDatos(
            result.data
        );

    } catch (error) {

        console.error(
            'Error cargando planificaciones:',
            error
        );

        tablaContainer.innerHTML = `
            <div class="gestion-error">
                Error cargando planificaciones.
            </div>
        `;
    }


    // ==========================================
    // EDITAR
    // ==========================================

    tablaContainer.addEventListener(
        'tabla-gestion:edit',
        async event => {

            const id = event.detail.id;

            console.log(
                'Editando planificación:',
                id
            );


            try {

                const response = await fetch(
                    `/api/planificaciones/${id}`
                );

                if (!response.ok) {
                    throw new Error(
                        'No se pudo obtener la planificación.'
                    );
                }

                const result =
                    await response.json();

                if (!result.success) {
                    throw new Error(
                        result.message ||
                        'Error obteniendo planificación.'
                    );
                }


                console.log(
                    'Planificación seleccionada:',
                    result.data
                );


                // ==================================
                // IR AL FORMULARIO
                // ==================================

                window.location.href =
                    `/planificaciones/crear?id=${id}`;


            } catch (error) {

                console.error(
                    'Error obteniendo planificación:',
                    error
                );

                alert(
                    'No se pudo cargar la planificación.'
                );
            }

        }
    );


    // ==========================================
    // ELIMINAR
    // ==========================================

    tablaContainer.addEventListener(
        'tabla-gestion:delete',
        async event => {

            const id = event.detail.id;

            const confirmar = confirm(
                `¿Está seguro de eliminar la planificación #${id}?`
            );

            if (!confirmar) {
                return;
            }

            try {

                const response = await fetch(
                    `/planificaciones/${id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document
                                .querySelector('meta[name="csrf-token"]')
                                .getAttribute('content'),

                            'X-Requested-With': 'XMLHttpRequest',

                            'Accept': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        'No se pudo eliminar la planificación.'
                    );
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(
                        result.message ||
                        'No se pudo eliminar la planificación.'
                    );
                }

                alert(result.message);

                // Recargar la página para volver a consultar
                // todas las planificaciones.
                window.location.reload();

            } catch (error) {

                console.error(
                    'Error eliminando planificación:',
                    error
                );

                alert(
                    'No se pudo eliminar la planificación.'
                );
            }
        }
    );
});