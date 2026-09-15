import { TablaGestion } from './tabla-gestion.js';

document.addEventListener('DOMContentLoaded', async () => {


// ==========================================
// CONTENEDORES
// ==========================================

const tablaContainer =
    document.getElementById('planificacionesTable');

const plantillasContainer =
    document.getElementById('plantillasTable');

if (!tablaContainer) {
    return;
}


// ==========================================
// ELEMENTOS NUEVA PLANIFICACIÓN
// ==========================================

const btnNuevaPlanificacion =
    document.getElementById('btnNuevaPlanificacion');

const modalNuevaPlanificacion =
    document.getElementById('modalNuevaPlanificacion');

const cerrarModalNuevaPlanificacion =
    document.getElementById('cerrarModalNuevaPlanificacion');

const btnCrearPlanificacionVacia =
    document.getElementById('btnCrearPlanificacionVacia');

const btnUsarPlantilla =
    document.getElementById('btnUsarPlantilla');

const modalPlantillas =
    document.getElementById('modalPlantillas');

const cerrarModalPlantillas =
    document.getElementById('cerrarModalPlantillas');

const listaPlantillas =
    document.getElementById('listaPlantillas');


// ==========================================
// TABLA PLANIFICACIONES
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
        template: true,
        delete: true
    },

    emptyMessage: 'No hay planificaciones.',
    loadingMessage: 'Cargando planificaciones.',
    errorMessage: 'Error cargando planificaciones.'

});


// ==========================================
// TABLA PLANTILLAS
// ==========================================

let tablaPlantillas = null;

if (plantillasContainer) {

    tablaPlantillas = new TablaGestion({

        container: plantillasContainer,

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
                key: 'nivel_educativo',
                label: 'Nivel'
            },
            {
                key: 'estado',
                label: 'Estado'
            }
        ],

        actions: {
            edit: true,
            delete: true
        },

        emptyMessage: 'No hay plantillas.',
        loadingMessage: 'Cargando plantillas.',
        errorMessage: 'Error cargando plantillas.'

    });

}


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

    const result =
        await response.json();

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
// CARGAR PLANTILLAS EN TABLA
// ==========================================

if (tablaPlantillas) {

    try {

        const response = await fetch(
            '/api/plantillas'
        );

        if (!response.ok) {

            throw new Error(
                'Error en la petición'
            );

        }

        const result =
            await response.json();

        if (!result.success) {

            throw new Error(
                result.message ||
                'Error cargando plantillas'
            );

        }

        tablaPlantillas.establecerDatos(
            result.data
        );

    } catch (error) {

        console.error(
            'Error cargando plantillas:',
            error
        );

        plantillasContainer.innerHTML = `
            <div class="gestion-error">
                Error cargando plantillas.
            </div>
        `;

    }

}


// ==========================================
// NUEVA PLANIFICACIÓN
// ==========================================

if (btnNuevaPlanificacion && modalNuevaPlanificacion) {

    btnNuevaPlanificacion.addEventListener(
        'click',
        () => {

            modalNuevaPlanificacion.style.display =
                'flex';

        }
    );

}


// ==========================================
// CERRAR MODAL NUEVA PLANIFICACIÓN
// ==========================================

if (cerrarModalNuevaPlanificacion && modalNuevaPlanificacion) {

    cerrarModalNuevaPlanificacion.addEventListener(
        'click',
        () => {

            modalNuevaPlanificacion.style.display =
                'none';

        }
    );

}


// ==========================================
// CREAR PLANIFICACIÓN VACÍA
// ==========================================

if (btnCrearPlanificacionVacia) {

    btnCrearPlanificacionVacia.addEventListener(
        'click',
        () => {

            window.location.href =
                '/planificaciones/crear';

        }
    );

}


// ==========================================
// USAR PLANTILLA
// ==========================================

if (btnUsarPlantilla) {

    btnUsarPlantilla.addEventListener(
        'click',
        async () => {

            if (modalNuevaPlanificacion) {

                modalNuevaPlanificacion.style.display =
                    'none';

            }

            if (modalPlantillas) {

                modalPlantillas.style.display =
                    'flex';

            }

            if (!listaPlantillas) {
                return;
            }


            listaPlantillas.innerHTML = `
                <p>
                    Cargando plantillas...
                </p>
            `;


            try {

                const response = await fetch(
                    '/api/plantillas',
                    {
                        headers: {
                            'Accept':
                                'application/json',

                            'X-Requested-With':
                                'XMLHttpRequest'
                        }
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        'No se pudieron cargar las plantillas.'
                    );

                }


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        result.message ||
                        'Error cargando plantillas.'
                    );

                }


                const plantillas =
                    result.data || [];


                // ==================================
                // SIN PLANTILLAS
                // ==================================

                if (plantillas.length === 0) {

                    listaPlantillas.innerHTML = `
                        <p>
                            No tienes plantillas disponibles.
                        </p>
                    `;

                    return;

                }


                // ==================================
                // MOSTRAR PLANTILLAS
                // ==================================

                listaPlantillas.innerHTML = '';


                plantillas.forEach(
                    plantilla => {

                        const item =
                            document.createElement(
                                'div'
                            );

                        item.className =
                            'plantilla-selector-item';


                        item.innerHTML = `

                            <div
                                class="plantilla-selector-info"
                            >

                                <strong>
                                    ${
                                        plantilla.experiencia_aprendizaje ||
                                        'Sin experiencia'
                                    }
                                </strong>

                                <span>
                                    ID: ${plantilla.id}
                                </span>

                                <span>
                                    Maestra:
                                    ${
                                        plantilla.nombre_maestra ||
                                        'Sin especificar'
                                    }
                                </span>

                                <span>
                                    Nivel:
                                    ${
                                        plantilla.nivel_educativo ||
                                        'Sin especificar'
                                    }
                                </span>

                            </div>


                            <button
                                type="button"
                                class="btn-primary btn-usar-plantilla"
                                data-id="${plantilla.id}"
                            >
                                Usar
                            </button>

                        `;


                        listaPlantillas.appendChild(
                            item
                        );

                    }
                );


                // ==================================
                // BOTONES USAR
                // ==================================

                listaPlantillas
                    .querySelectorAll(
                        '.btn-usar-plantilla'
                    )
                    .forEach(
                        button => {

                            button.addEventListener(
                                'click',
                                () => {

                                    const id =
                                        button.dataset.id;


                                    window.location.href =
                                        `/planificaciones/crear?id=${id}&plantilla=1`;

                                }
                            );

                        }
                    );


            } catch (error) {

                console.error(
                    'Error cargando plantillas:',
                    error
                );


                listaPlantillas.innerHTML = `
                    <p>
                        Ocurrió un error al cargar
                        las plantillas.
                    </p>
                `;

            }

        }
    );

}


// ==========================================
// CERRAR MODAL PLANTILLAS
// ==========================================

if (cerrarModalPlantillas && modalPlantillas) {

    cerrarModalPlantillas.addEventListener(
        'click',
        () => {

            modalPlantillas.style.display =
                'none';

        }
    );

}


// ==========================================
// CERRAR MODAL NUEVA AL HACER CLICK FUERA
// ==========================================

if (modalNuevaPlanificacion) {

    modalNuevaPlanificacion.addEventListener(
        'click',
        event => {

            if (
                event.target ===
                modalNuevaPlanificacion
            ) {

                modalNuevaPlanificacion.style.display =
                    'none';

            }

        }
    );

}


// ==========================================
// CERRAR MODAL PLANTILLAS AL HACER CLICK FUERA
// ==========================================

if (modalPlantillas) {

    modalPlantillas.addEventListener(
        'click',
        event => {

            if (
                event.target ===
                modalPlantillas
            ) {

                modalPlantillas.style.display =
                    'none';

            }

        }
    );

}


// ==========================================
// EDITAR PLANIFICACIÓN
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
// CONVERTIR PLANIFICACIÓN EN PLANTILLA
// ==========================================

tablaContainer.addEventListener(
    'tabla-gestion:template',
    async event => {

        const id = event.detail.id;


        const confirmar = confirm(
            `¿Está seguro de convertir la planificación #${id} en plantilla?`
        );


        if (!confirmar) {
            return;
        }


        try {

            const response = await fetch(
                `/api/planificaciones/${id}/plantilla`,
                {
                    method: 'PUT',

                    headers: {

                        'X-CSRF-TOKEN':
                            document
                                .querySelector(
                                    'meta[name="csrf-token"]'
                                )
                                .getAttribute(
                                    'content'
                                ),

                        'X-Requested-With':
                            'XMLHttpRequest',

                        'Accept':
                            'application/json'

                    }

                }
            );


            if (!response.ok) {

                throw new Error(
                    'No se pudo convertir la planificación en plantilla.'
                );

            }


            const result =
                await response.json();


            if (!result.success) {

                throw new Error(
                    result.message ||
                    'No se pudo convertir la planificación en plantilla.'
                );

            }


            alert(
                result.message
            );


            window.location.reload();


        } catch (error) {

            console.error(
                'Error convirtiendo planificación en plantilla:',
                error
            );


            alert(
                'No se pudo convertir la planificación en plantilla.'
            );

        }

    }
);


// ==========================================
// EDITAR PLANTILLA
// ==========================================

if (plantillasContainer) {

    plantillasContainer.addEventListener(
        'tabla-gestion:edit',
        async event => {

            const id = event.detail.id;


            console.log(
                'Editando plantilla:',
                id
            );


            window.location.href =
                `/planificaciones/crear?id=${id}`;

        }
    );

}


// ==========================================
// ELIMINAR PLANIFICACIÓN
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

                        'X-CSRF-TOKEN':
                            document
                                .querySelector(
                                    'meta[name="csrf-token"]'
                                )
                                .getAttribute(
                                    'content'
                                ),

                        'X-Requested-With':
                            'XMLHttpRequest',

                        'Accept':
                            'application/json'

                    }

                }
            );


            if (!response.ok) {

                throw new Error(
                    'No se pudo eliminar la planificación.'
                );

            }


            const result =
                await response.json();


            if (!result.success) {

                throw new Error(
                    result.message ||
                    'No se pudo eliminar la planificación.'
                );

            }


            alert(
                result.message
            );


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


// ==========================================
// ELIMINAR PLANTILLA
// ==========================================

if (plantillasContainer) {

    plantillasContainer.addEventListener(
        'tabla-gestion:delete',
        async event => {

            const id = event.detail.id;


            const confirmar = confirm(
                `¿Está seguro de eliminar la plantilla #${id}?`
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

                            'X-CSRF-TOKEN':
                                document
                                    .querySelector(
                                        'meta[name="csrf-token"]'
                                    )
                                    .getAttribute(
                                        'content'
                                    ),

                            'X-Requested-With':
                                'XMLHttpRequest',

                            'Accept':
                                'application/json'

                        }

                    }
                );


                if (!response.ok) {

                    throw new Error(
                        'No se pudo eliminar la plantilla.'
                    );

                }


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        result.message ||
                        'No se pudo eliminar la plantilla.'
                    );

                }


                alert(
                    result.message
                );


                window.location.reload();


            } catch (error) {

                console.error(
                    'Error eliminando plantilla:',
                    error
                );


                alert(
                    'No se pudo eliminar la plantilla.'
                );

            }

        }
    );

}


});
