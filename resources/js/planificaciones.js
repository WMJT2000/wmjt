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
    // ELEMENTOS GENERAR WORD
    // ==========================================

    const btnGenerarWord =
        document.getElementById('btnGenerarWord');

    const modalGenerarWord =
        document.getElementById('modalGenerarWord');

    const cerrarModalGenerarWord =
        document.getElementById('cerrarModalGenerarWord');

    const cancelarGenerarWord =
        document.getElementById('cancelarGenerarWord');

    const btnConfirmarGenerarWord =
        document.getElementById('btnConfirmarGenerarWord');

    const radioSeleccionManual =
        document.getElementById('radioSeleccionManual');

    const radioSeleccionFechas =
        document.getElementById('radioSeleccionFechas');

    const contenedorSeleccionManual =
        document.getElementById('contenedorSeleccionManual');

    const contenedorSeleccionFechas =
        document.getElementById('contenedorSeleccionFechas');

    const listaPlanificacionesWord =
        document.getElementById('listaPlanificacionesWord');

    const contadorPlanificacionesSeleccionadas =
        document.getElementById('contadorPlanificacionesSeleccionadas');

    const fechaWordDesde =
        document.getElementById('fechaWordDesde');

    const fechaWordHasta =
        document.getElementById('fechaWordHasta');

    const btnBuscarPorFechas =
        document.getElementById('btnBuscarPorFechas');

    const resultadoPlanificacionesFechas =
        document.getElementById('resultadoPlanificacionesFechas');

    const listaPlanificacionesFechas =
        document.getElementById('listaPlanificacionesFechas');

    const contadorPlanificacionesFechas =
        document.getElementById('contadorPlanificacionesFechas');


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
        selectable: true,

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
                                    ${plantilla.experiencia_aprendizaje ||
                                'Sin experiencia'
                                }
                                </strong>

                                <span>
                                    ID: ${plantilla.id}
                                </span>

                                <span>
                                    Maestra:
                                    ${plantilla.nombre_maestra ||
                                'Sin especificar'
                                }
                                </span>

                                <span>
                                    Nivel:
                                    ${plantilla.nivel_educativo ||
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


    // ==========================================
    // GENERAR WORD
    // ==========================================

    let planificacionesPorFechas = [];


    // ==========================================
    // MOSTRAR MODAL GENERAR WORD
    // ==========================================

    if (btnGenerarWord && modalGenerarWord) {

        btnGenerarWord.addEventListener(
            'click',
            () => {

                modalGenerarWord.style.display =
                    'flex';

                // Seleccionar modo manual
                if (radioSeleccionManual) {
                    radioSeleccionManual.checked = true;
                }

                if (radioSeleccionFechas) {
                    radioSeleccionFechas.checked = false;
                }

                mostrarModoManual();

                actualizarPlanificacionesManuales();

            }
        );

    }


    // ==========================================
    // CERRAR MODAL
    // ==========================================

    if (cerrarModalGenerarWord && modalGenerarWord) {

        cerrarModalGenerarWord.addEventListener(
            'click',
            () => {

                modalGenerarWord.style.display =
                    'none';

            }
        );

    }


    if (cancelarGenerarWord && modalGenerarWord) {

        cancelarGenerarWord.addEventListener(
            'click',
            () => {

                modalGenerarWord.style.display =
                    'none';

            }
        );

    }


    // ==========================================
    // CERRAR AL HACER CLICK FUERA
    // ==========================================

    if (modalGenerarWord) {

        modalGenerarWord.addEventListener(
            'click',
            event => {

                if (
                    event.target ===
                    modalGenerarWord
                ) {

                    modalGenerarWord.style.display =
                        'none';

                }

            }
        );

    }


    // ==========================================
    // CAMBIAR A MODO MANUAL
    // ==========================================

    if (radioSeleccionManual) {

        radioSeleccionManual.addEventListener(
            'change',
            () => {

                if (
                    !radioSeleccionManual.checked
                ) {
                    return;
                }

                mostrarModoManual();

                actualizarPlanificacionesManuales();

            }
        );

    }


    // ==========================================
    // CAMBIAR A MODO FECHAS
    // ==========================================

    if (radioSeleccionFechas) {

        radioSeleccionFechas.addEventListener(
            'change',
            () => {

                if (
                    !radioSeleccionFechas.checked
                ) {
                    return;
                }

                mostrarModoFechas();

            }
        );

    }


    // ==========================================
    // MOSTRAR MODO MANUAL
    // ==========================================

    function mostrarModoManual() {

        if (contenedorSeleccionManual) {

            contenedorSeleccionManual.style.display =
                'block';

        }

        if (contenedorSeleccionFechas) {

            contenedorSeleccionFechas.style.display =
                'none';

        }

    }


    // ==========================================
    // MOSTRAR MODO FECHAS
    // ==========================================

    function mostrarModoFechas() {

        if (contenedorSeleccionManual) {

            contenedorSeleccionManual.style.display =
                'none';

        }

        if (contenedorSeleccionFechas) {

            contenedorSeleccionFechas.style.display =
                'block';

        }

    }


    // ==========================================
    // ACTUALIZAR LISTA MANUAL
    // ==========================================

    function actualizarPlanificacionesManuales() {

        if (!listaPlanificacionesWord) {
            return;
        }

        const checkboxes =
            document.querySelectorAll(
                '#planificacionesTable .planificacion-checkbox'
            );

        listaPlanificacionesWord.innerHTML = '';


        if (checkboxes.length === 0) {

            listaPlanificacionesWord.innerHTML = `
            <p>
                No hay planificaciones disponibles.
            </p>
        `;

            actualizarContadorManual();

            return;
        }


        checkboxes.forEach(
            checkbox => {

                const id =
                    checkbox.dataset.id;

                const registro =
                    tabla.datos.find(
                        item =>
                            String(item.id) ===
                            String(id)
                    );

                if (!registro) {
                    return;
                }


                const item =
                    document.createElement('label');

                item.className =
                    'planificacion-word-item';


                item.innerHTML = `

                <input
                    type="checkbox"
                    class="modal-planificacion-checkbox"
                    data-id="${registro.id}"
                    ${checkbox.checked ? 'checked' : ''}
                >

                <div>

                    <strong>
                        ${registro.experiencia_aprendizaje ||
                    'Sin experiencia'
                    }
                    </strong>

                    <span>
                        ID: ${registro.id}
                    </span>

                    <span>
                        Fecha:
                        ${registro.fecha ||
                    'Sin fecha'
                    }
                    </span>

                </div>

            `;


                const modalCheckbox =
                    item.querySelector(
                        '.modal-planificacion-checkbox'
                    );


                modalCheckbox.addEventListener(
                    'change',
                    () => {

                        checkbox.checked =
                            modalCheckbox.checked;

                        actualizarContadorManual();

                    }
                );


                listaPlanificacionesWord.appendChild(
                    item
                );

            }
        );


        actualizarContadorManual();

    }


    // ==========================================
    // ACTUALIZAR CONTADOR MANUAL
    // ==========================================

    function actualizarContadorManual() {

        if (!contadorPlanificacionesSeleccionadas) {
            return;
        }


        const seleccionadas =
            document.querySelectorAll(
                '#planificacionesTable .planificacion-checkbox:checked'
            );


        contadorPlanificacionesSeleccionadas.textContent =
            `Seleccionadas: ${seleccionadas.length}`;

    }


    // ==========================================
    // DETECTAR CAMBIOS EN CHECKBOX DE TABLA
    // ==========================================

    tablaContainer.addEventListener(
        'change',
        event => {

            if (
                !event.target.classList.contains(
                    'planificacion-checkbox'
                )
            ) {
                return;
            }


            const id =
                event.target.dataset.id;


            const modalCheckbox =
                listaPlanificacionesWord
                    ?.querySelector(
                        `.modal-planificacion-checkbox[data-id="${id}"]`
                    );


            if (modalCheckbox) {

                modalCheckbox.checked =
                    event.target.checked;

            }


            actualizarContadorManual();

        }
    );


    // ==========================================
    // BUSCAR POR RANGO DE FECHAS
    // ==========================================

    if (btnBuscarPorFechas) {

        btnBuscarPorFechas.addEventListener(
            'click',
            async () => {

                const desde =
                    fechaWordDesde?.value;

                const hasta =
                    fechaWordHasta?.value;


                if (!desde || !hasta) {

                    alert(
                        'Selecciona la fecha inicial y la fecha final.'
                    );

                    return;

                }


                if (desde > hasta) {

                    alert(
                        'La fecha inicial no puede ser mayor que la fecha final.'
                    );

                    return;

                }


                btnBuscarPorFechas.disabled =
                    true;

                btnBuscarPorFechas.textContent =
                    'Buscando...';


                if (resultadoPlanificacionesFechas) {

                    resultadoPlanificacionesFechas.style.display =
                        'block';

                }


                if (listaPlanificacionesFechas) {

                    listaPlanificacionesFechas.innerHTML = `
                    <p>
                        Buscando planificaciones...
                    </p>
                `;

                }


                try {

                    const response =
                        await fetch(
                            `/api/planificaciones/por-fechas?desde=${encodeURIComponent(desde)}&hasta=${encodeURIComponent(hasta)}`,
                            {
                                headers: {
                                    'Accept':
                                        'application/json',

                                    'X-Requested-With':
                                        'XMLHttpRequest'
                                }
                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok || !result.success) {

                        throw new Error(
                            result.message ||
                            'No se pudieron buscar las planificaciones.'
                        );

                    }


                    planificacionesPorFechas =
                        result.data || [];


                    mostrarPlanificacionesPorFechas();


                } catch (error) {

                    console.error(
                        'Error buscando planificaciones por fechas:',
                        error
                    );


                    planificacionesPorFechas =
                        [];


                    if (listaPlanificacionesFechas) {

                        listaPlanificacionesFechas.innerHTML = `
                        <p>
                            No se pudieron buscar las planificaciones.
                        </p>
                    `;

                    }


                    if (contadorPlanificacionesFechas) {

                        contadorPlanificacionesFechas.textContent =
                            'Encontradas: 0';

                    }

                } finally {

                    btnBuscarPorFechas.disabled =
                        false;

                    btnBuscarPorFechas.textContent =
                        'Buscar planificaciones';

                }

            }
        );

    }


    // ==========================================
    // MOSTRAR RESULTADOS POR FECHAS
    // ==========================================

    function mostrarPlanificacionesPorFechas() {

        if (!listaPlanificacionesFechas) {
            return;
        }


        listaPlanificacionesFechas.innerHTML = '';


        if (planificacionesPorFechas.length === 0) {

            listaPlanificacionesFechas.innerHTML = `
            <p>
                No se encontraron planificaciones
                dentro del rango seleccionado.
            </p>
        `;


            if (contadorPlanificacionesFechas) {

                contadorPlanificacionesFechas.textContent =
                    'Encontradas: 0';

            }

            return;

        }


        planificacionesPorFechas.forEach(
            planificacion => {

                const item =
                    document.createElement('label');

                item.className =
                    'planificacion-word-item';


                item.innerHTML = `

                <input
                    type="checkbox"
                    class="fecha-planificacion-checkbox"
                    data-id="${planificacion.id}"
                    checked
                >

                <div>

                    <strong>
                        ${planificacion.experiencia_aprendizaje ||
                    'Sin experiencia'
                    }
                    </strong>

                    <span>
                        ID: ${planificacion.id}
                    </span>

                    <span>
                        Fecha:
                        ${planificacion.fecha ||
                    'Sin fecha'
                    }
                    </span>

                    <span>
                        Maestra:
                        ${planificacion.nombre_maestra ||
                    'Sin especificar'
                    }
                    </span>

                </div>

            `;


                listaPlanificacionesFechas.appendChild(
                    item
                );

            }
        );


        actualizarContadorFechas();

    }


    // ==========================================
    // CONTADOR FECHAS
    // ==========================================

    function actualizarContadorFechas() {

        if (!contadorPlanificacionesFechas) {
            return;
        }


        const seleccionadas =
            document.querySelectorAll(
                '.fecha-planificacion-checkbox:checked'
            );


        contadorPlanificacionesFechas.textContent =
            `Encontradas: ${seleccionadas.length}`;

    }


    // ==========================================
    // CAMBIO CHECKBOX FECHAS
    // ==========================================

    if (listaPlanificacionesFechas) {

        listaPlanificacionesFechas.addEventListener(
            'change',
            event => {

                if (
                    event.target.classList.contains(
                        'fecha-planificacion-checkbox'
                    )
                ) {

                    actualizarContadorFechas();

                }

            }
        );

    }


    // ==========================================
    // CONFIRMAR GENERACIÓN WORD
    // ==========================================

    if (btnConfirmarGenerarWord) {

        btnConfirmarGenerarWord.addEventListener(
            'click',
            async () => {

                let ids = [];


                // ==================================
                // MODO MANUAL
                // ==================================

                if (
                    radioSeleccionManual &&
                    radioSeleccionManual.checked
                ) {

                    ids =
                        Array.from(
                            document.querySelectorAll(
                                '#planificacionesTable .planificacion-checkbox:checked'
                            )
                        )
                            .map(
                                checkbox =>
                                    Number(
                                        checkbox.dataset.id
                                    )
                            );

                }


                // ==================================
                // MODO FECHAS
                // ==================================

                if (
                    radioSeleccionFechas &&
                    radioSeleccionFechas.checked
                ) {

                    ids =
                        Array.from(
                            document.querySelectorAll(
                                '.fecha-planificacion-checkbox:checked'
                            )
                        )
                            .map(
                                checkbox =>
                                    Number(
                                        checkbox.dataset.id
                                    )
                            );

                }


                // ==================================
                // VALIDAR SELECCIÓN
                // ==================================

                if (ids.length === 0) {

                    alert(
                        'Selecciona al menos una planificación.'
                    );

                    return;

                }


                btnConfirmarGenerarWord.disabled =
                    true;

                btnConfirmarGenerarWord.textContent =
                    'Generando Word...';


                try {

                    const csrfToken =
                        document
                            .querySelector(
                                'meta[name="csrf-token"]'
                            )
                            ?.getAttribute(
                                'content'
                            );


                    const response =
                        await fetch(
                            '/planificaciones/generar-multiples',
                            {
                                method: 'POST',

                                headers: {

                                    'Content-Type':
                                        'application/json',

                                    'X-CSRF-TOKEN':
                                        csrfToken,

                                    'X-Requested-With':
                                        'XMLHttpRequest',

                                    'Accept':
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

                                },

                                body: JSON.stringify({
                                    planificaciones:
                                        ids
                                })

                            }
                        );


                    if (!response.ok) {

                        let mensaje =
                            'No se pudo generar el documento Word.';


                        try {

                            const errorData =
                                await response.json();


                            if (errorData.message) {

                                mensaje =
                                    errorData.message;

                            }

                        } catch (e) {
                            // La respuesta no era JSON.
                        }


                        throw new Error(
                            mensaje
                        );

                    }

                    const blob =
                        await response.blob();


                    // ==================================
                    // OBTENER NOMBRE ENVIADO POR LARAVEL
                    // ==================================

                    const contentDisposition =
                        response.headers.get(
                            'Content-Disposition'
                        );

                    let nombreArchivo =
                        'planificaciones.docx';


                    if (contentDisposition) {

                        const coincidencia =
                            contentDisposition.match(
                                /filename="([^"]+)"/i
                            );

                        if (coincidencia) {

                            nombreArchivo =
                                coincidencia[1];

                        }

                    }


                    // ==================================
                    // DESCARGAR ARCHIVO
                    // ==================================

                    const url =
                        window.URL.createObjectURL(
                            blob
                        );


                    const enlace =
                        document.createElement('a');


                    enlace.href =
                        url;

                    enlace.download =
                        nombreArchivo;


                    document.body.appendChild(
                        enlace
                    );


                    enlace.click();


                    enlace.remove();


                    window.URL.revokeObjectURL(
                        url
                    );


                    if (modalGenerarWord) {

                        modalGenerarWord.style.display =
                            'none';

                    }


                } catch (error) {

                    console.error(
                        'Error generando Word:',
                        error
                    );


                    alert(
                        error.message ||
                        'No se pudo generar el documento Word.'
                    );

                } finally {

                    btnConfirmarGenerarWord.disabled =
                        false;

                    btnConfirmarGenerarWord.textContent =
                        'Generar Word';

                }

            }
        );

    }


});
