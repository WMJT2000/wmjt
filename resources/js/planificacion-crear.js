document.addEventListener('DOMContentLoaded', async function () {

    const MAX_ACTIVIDADES = 10;

    /* =========================================================
       REFERENCIAS
    ========================================================== */

    const form =
        document.getElementById('planningForm');

    const saveButton =
        document.getElementById('btnGuardarPlanificacion');

    const templateButton =
        document.getElementById('btnGuardarComoPlantilla');

    const part1Container =
        document.getElementById('part1_container');

    const part2Container =
        document.getElementById('part2_container');

    const addPart1 =
        document.getElementById('addPart1');

    const addPart2 =
        document.getElementById('addPart2');

    const part1Counter =
        document.getElementById('part1Counter');

    const part2Counter =
        document.getElementById('part2Counter');

    const part1Empty =
        document.getElementById('part1Empty');

    const part2Empty =
        document.getElementById('part2Empty');

    const sidebarPart1Text =
        document.getElementById('sidebarPart1Text');

    const sidebarPart2Text =
        document.getElementById('sidebarPart2Text');

    const progressValue =
        document.getElementById('progressValue');

    const progressPercent =
        document.getElementById('progressPercent');

    const sidebarGeneral =
        document.getElementById('sidebarGeneral');

    const sidebarPart1 =
        document.getElementById('sidebarPart1');

    const sidebarPart2 =
        document.getElementById('sidebarPart2');

    const progresoInput =
        document.getElementById('progresoInput');


    /* =========================================================
       VALIDACIÓN BÁSICA
    ========================================================== */

    if (!form) {
        return;
    }


    /* =========================================================
       MODOS
    ========================================================== */

    const tieneId =
        window.planificacionId !== null &&
        window.planificacionId !== undefined &&
        window.planificacionId !== '';

    const tienePlantillaId =
        window.plantillaId !== null &&
        window.plantillaId !== undefined &&
        window.plantillaId !== '';

    let usandoPlantilla =
        tienePlantillaId &&
        Boolean(window.usarPlantilla);

    const editando =
        tieneId &&
        !usandoPlantilla;

    const nuevaPlanificacion =
        !tieneId;


    /* =========================================================
       BOTONES
    ========================================================== */

    if (saveButton) {
        saveButton.type = 'button';
    }

    if (templateButton) {
        templateButton.type = 'button';
    }


    /* =========================================================
       MOSTRAR / OCULTAR BOTÓN PLANTILLA
    ========================================================== */

    if (templateButton) {

        if (nuevaPlanificacion) {
            templateButton.style.display = '';
        } else {
            templateButton.style.display = 'none';
        }
    }


    /* =========================================================
       TEXTO BOTÓN GUARDAR
    ========================================================== */

    if (saveButton) {

        if (usandoPlantilla) {

            saveButton.textContent =
                'Guardar nueva planificación';

        } else if (editando) {

            saveButton.textContent =
                'Actualizar planificación';

        } else {

            saveButton.textContent =
                'Guardar planificación';
        }
    }


    /* =========================================================
       ESTADO
    ========================================================== */

    let part1Count = 0;
    let part2Count = 0;

    let part1Actual = 0;
    let part2Actual = 0;

    /*
     * Guarda la subactividad visible de cada actividad.
     *
     * Cada activity-card tiene su propio índice.
     */
    let subactividadActual =
        new WeakMap();

    let agregandoPart1 = false;
    let agregandoPart2 = false;

    let editandoPlantillaExistente = false;
    let recuperandoBorrador = false;

    let autoGuardando = false;
    let autoGuardadoPendiente = false;
    let planificacionCreadaPorAutoguardado = false;
    let cambiosPendientes = false;


    function marcarCambiosPendientes() {
        cambiosPendientes = true;
    }


    /* =========================================================
       AUTOGUARDADO
    ========================================================== */

    async function autoguardarPlanificacion() {

        if (autoGuardando) {

            autoGuardadoPendiente = true;
            return;
        }

        if (!cambiosPendientes) {
            return;
        }

        autoGuardando = true;
        autoGuardadoPendiente = false;

        const formData =
            new FormData(form);

        if (usandoPlantilla && window.plantillaId) {

            formData.set(
                'plantilla_origen_id',
                window.plantillaId
            );
        }

        let url = '/planificaciones';

        if (
            !window.planificacionId ||
            usandoPlantilla
        ) {

            formData.set(
                'es_plantilla',
                '0'
            );

            url = '/planificaciones';

        } else {

            url =
                `/planificaciones/${window.planificacionId}`;

            formData.append(
                '_method',
                'PUT'
            );
        }

        try {

            const response =
                await fetch(
                    url,
                    {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-Requested-With':
                                'XMLHttpRequest',
                            'Accept':
                                'application/json'
                        }
                    }
                );

            if (!response.ok) {

                const texto =
                    await response.text();

                console.error(
                    'Respuesta del servidor:',
                    texto
                );

                throw new Error(
                    'Error al autoguardar.'
                );
            }

            const data =
                await response.json();

            if (!data.success) {

                throw new Error(
                    data.message ||
                    'No se pudo autoguardar.'
                );
            }

            if (
                !window.planificacionId ||
                usandoPlantilla
            ) {

                window.planificacionId =
                    data.planificacion_id;

                planificacionCreadaPorAutoguardado =
                    true;

                usandoPlantilla = false;
            }

            cambiosPendientes = false;

        } catch (error) {

            console.error(
                'Error en autoguardado:',
                error
            );

        } finally {

            autoGuardando = false;

            if (autoGuardadoPendiente) {

                autoGuardadoPendiente = false;

                setTimeout(
                    function () {
                        autoguardarPlanificacion();
                    },
                    500
                );
            }
        }
    }


    /* =========================================================
       OBTENER CARDS
    ========================================================== */

    function obtenerCards(container) {

        return Array.from(
            container.querySelectorAll(
                '.activity-card'
            )
        );
    }


    /* =========================================================
       OBTENER SUBACTIVIDADES
    ========================================================== */

    function obtenerSubactividades(card) {

        return Array.from(
            card.querySelectorAll(
                '.subactivity-card'
            )
        );
    }


    /* =========================================================
       MOSTRAR UNA SOLA SUBACTIVIDAD
    ========================================================== */

    function mostrarSubactividad(
        card,
        indice
    ) {

        const subCards =
            obtenerSubactividades(card);

        if (subCards.length === 0) {

            subactividadActual.delete(
                card
            );

            return;
        }


        if (indice < 0) {
            indice = 0;
        }


        if (indice >= subCards.length) {

            indice =
                subCards.length - 1;
        }


        subCards.forEach(
            function (
                subCard,
                index
            ) {

                subCard.style.display =
                    index === indice
                        ? 'block'
                        : 'none';
            }
        );


        subactividadActual.set(
            card,
            indice
        );


        actualizarBotonesSubactividad(
            card,
            indice
        );
    }


    /* =========================================================
       ACTUALIZAR BOTONES SUBACTIVIDAD
    ========================================================== */

    function actualizarBotonesSubactividad(
        card,
        indice
    ) {

        const subCards =
            obtenerSubactividades(card);

        if (subCards.length === 0) {
            return;
        }


        const actual =
            subCards[indice];

        if (!actual) {
            return;
        }


        const anterior =
            actual.querySelector(
                '.subactivity-prev'
            );

        const siguiente =
            actual.querySelector(
                '.subactivity-next'
            );


        if (anterior) {

            anterior.disabled =
                indice === 0;
        }


        if (siguiente) {

            siguiente.disabled =
                indice ===
                subCards.length - 1;
        }
    }


    /* =========================================================
       CREAR SUBACTIVIDAD
       
       IMPORTANTE:
       La subactividad NO tiene ámbito propio.
       Hereda el ámbito de la actividad padre.
    ========================================================== */

    function crearSubactividad(
        card,
        prefijo,
        actividadIndex,
        numero,
        datos = null
    ) {

        const container =
            card.querySelector(
                '.subactivities-container'
            );

        if (!container) {
            return;
        }


        const subCard =
            document.createElement('div');

        subCard.className =
            'subactivity-card';

        subCard.dataset.numero =
            numero;


        subCard.innerHTML = `

            <div class="subactivity-card-header">

                <div class="subactivity-card-title">

                    <span class="subactivity-number">
                        ${numero}
                    </span>

                    <strong>
                        Subactividad ${numero}
                    </strong>

                </div>

                <button
                    type="button"
                    class="subactivity-delete delete"
                    title="Eliminar subactividad"
                >
                    ×
                </button>

            </div>


            <div class="subactivity-card-body">

                <div class="activity-field">

                    <label>
                        Destreza
                    </label>

                    <textarea
                        name="${prefijo}[${actividadIndex}][subactividades][${numero - 1}][destreza]"
                        rows="3"
                        placeholder="Escribe la destreza..."
                    ></textarea>

                </div>


                <div class="activity-field activity-field-full">

                    <label>
                        Estrategias metodológicas
                    </label>

                    <textarea
                        name="${prefijo}[${actividadIndex}][subactividades][${numero - 1}][estrategias_metologicas]"
                        rows="4"
                        placeholder="Describe las estrategias metodológicas..."
                    ></textarea>


                    <label style="margin-top: 10px;">
                        Imagen de estrategias metodológicas
                    </label>

                    <input
                        type="file"
                        name="${prefijo}[${actividadIndex}][subactividades][${numero - 1}][estrategias_metologicas_imagen]"
                        accept="image/*"
                    >

                </div>


                <div class="activity-field">

                    <label>
                        Recursos
                    </label>

                    <textarea
                        name="${prefijo}[${actividadIndex}][subactividades][${numero - 1}][recursos]"
                        rows="3"
                        placeholder="Recursos necesarios..."
                    ></textarea>

                </div>


                <div class="activity-field">

                    <label>
                        Indicadores de logro
                    </label>

                    <textarea
                        name="${prefijo}[${actividadIndex}][subactividades][${numero - 1}][indicadores_logro]"
                        rows="3"
                        placeholder="Indicadores de logro..."
                    ></textarea>

                </div>


                <!-- ============================================
                     NAVEGACIÓN DE SUBACTIVIDADES
                ============================================= -->

                <div class="subactivity-navigation">

                    <button
                        type="button"
                        class="subactivity-nav-button subactivity-prev"
                    >
                        ← Anterior
                    </button>

                    <button
                        type="button"
                        class="subactivity-nav-button subactivity-next"
                    >
                        Siguiente →
                    </button>

                </div>

            </div>
        `;


        container.appendChild(
            subCard
        );


        /* =====================================================
           CARGAR DATOS
        ====================================================== */

        if (datos) {

            const destreza =
                subCard.querySelector(
                    '[name$="[destreza]"]'
                );

            const estrategias =
                subCard.querySelector(
                    '[name$="[estrategias_metologicas]"]'
                );

            const recursos =
                subCard.querySelector(
                    '[name$="[recursos]"]'
                );

            const indicadores =
                subCard.querySelector(
                    '[name$="[indicadores_logro]"]'
                );


            if (destreza) {

                destreza.value =
                    datos.destreza ?? '';
            }


            if (estrategias) {

                estrategias.value =
                    datos.estrategias_metologicas ?? '';
            }


            if (datos.estrategias_metologicas_imagen) {

                const imagenExistente =
                    document.createElement('input');

                imagenExistente.type =
                    'hidden';

                imagenExistente.name =
                    `${prefijo}[${actividadIndex}][subactividades][${numero - 1}][estrategias_metologicas_imagen_existente]`;

                imagenExistente.value =
                    datos.estrategias_metologicas_imagen;

                subCard.appendChild(
                    imagenExistente
                );
            }


            if (recursos) {

                recursos.value =
                    datos.recursos ?? '';
            }


            if (indicadores) {

                indicadores.value =
                    datos.indicadores_logro ?? '';
            }
        }


        configurarBotonesSubactividad(
            subCard
        );


        actualizarNumeracionSubactividades(
            card
        );


        /*
         * La subactividad recién creada pasa
         * a ser la visible.
         */
        const subCards =
            obtenerSubactividades(card);

        const nuevoIndice =
            subCards.length - 1;

        mostrarSubactividad(
            card,
            nuevoIndice
        );
    }


    /* =========================================================
       BOTONES SUBACTIVIDAD
    ========================================================== */

    function configurarBotonesSubactividad(
        subCard
    ) {

        const deleteButton =
            subCard.querySelector(
                '.subactivity-delete'
            );

        const previousButton =
            subCard.querySelector(
                '.subactivity-prev'
            );

        const nextButton =
            subCard.querySelector(
                '.subactivity-next'
            );


        /* =====================================================
           ELIMINAR SUBACTIVIDAD
        ====================================================== */

        if (deleteButton) {

            deleteButton.addEventListener(
                'click',
                function () {

                    const card =
                        subCard.closest(
                            '.activity-card'
                        );

                    if (!card) {
                        return;
                    }


                    const subCardsAntes =
                        obtenerSubactividades(
                            card
                        );


                    const indiceEliminado =
                        subCardsAntes.indexOf(
                            subCard
                        );


                    let indiceActual =
                        subactividadActual.get(
                            card
                        ) ?? 0;


                    subCard.remove();


                    actualizarNumeracionSubactividades(
                        card
                    );


                    const subCardsDespues =
                        obtenerSubactividades(
                            card
                        );


                    if (
                        subCardsDespues.length === 0
                    ) {

                        subactividadActual.delete(
                            card
                        );

                    } else {

                        if (
                            indiceEliminado <
                            indiceActual
                        ) {

                            indiceActual--;
                        }


                        if (
                            indiceActual >=
                            subCardsDespues.length
                        ) {

                            indiceActual =
                                subCardsDespues.length - 1;
                        }


                        mostrarSubactividad(
                            card,
                            indiceActual
                        );
                    }


                    marcarCambiosPendientes();
                    actualizarEstado();
                }
            );
        }


        /* =====================================================
           SUBACTIVIDAD ANTERIOR
        ====================================================== */

        if (previousButton) {

            previousButton.addEventListener(
                'click',
                function () {

                    const card =
                        subCard.closest(
                            '.activity-card'
                        );

                    if (!card) {
                        return;
                    }


                    const indiceActual =
                        subactividadActual.get(
                            card
                        ) ?? 0;


                    if (
                        indiceActual > 0
                    ) {

                        mostrarSubactividad(
                            card,
                            indiceActual - 1
                        );
                    }
                }
            );
        }


        /* =====================================================
           SUBACTIVIDAD SIGUIENTE
        ====================================================== */

        if (nextButton) {

            nextButton.addEventListener(
                'click',
                function () {

                    const card =
                        subCard.closest(
                            '.activity-card'
                        );

                    if (!card) {
                        return;
                    }


                    const subCards =
                        obtenerSubactividades(
                            card
                        );


                    const indiceActual =
                        subactividadActual.get(
                            card
                        ) ?? 0;


                    if (
                        indiceActual <
                        subCards.length - 1
                    ) {

                        mostrarSubactividad(
                            card,
                            indiceActual + 1
                        );
                    }
                }
            );
        }
    }


    /* =========================================================
       NUMERACIÓN SUBACTIVIDADES
    ========================================================== */

    function actualizarNumeracionSubactividades(
        card
    ) {

        const container =
            card.querySelector(
                '.subactivities-container'
            );

        if (!container) {
            return;
        }


        const subCards =
            obtenerSubactividades(card);


        subCards.forEach(
            function (
                subCard,
                index
            ) {

                const numero =
                    index + 1;


                subCard.dataset.numero =
                    numero;


                const number =
                    subCard.querySelector(
                        '.subactivity-number'
                    );


                if (number) {

                    number.textContent =
                        numero;
                }


                const title =
                    subCard.querySelector(
                        '.subactivity-card-title strong'
                    );


                if (title) {

                    title.textContent =
                        'Subactividad ' + numero;
                }


                const inputs =
                    subCard.querySelectorAll(
                        'input, textarea'
                    );


                inputs.forEach(
                    function (input) {

                        const name =
                            input.getAttribute(
                                'name'
                            );


                        if (!name) {
                            return;
                        }


                        const nuevoName =
                            name.replace(
                                /(\[subactividades\])\[\d+\]/,
                                '$1[' +
                                (numero - 1) +
                                ']'
                            );


                        input.setAttribute(
                            'name',
                            nuevoName
                        );
                    }
                );
            }
        );
    }


    /* =========================================================
       MOSTRAR UNA SOLA ACTIVIDAD
    ========================================================== */

    function mostrarActividad(
        container,
        indice
    ) {

        const cards =
            obtenerCards(container);


        if (cards.length === 0) {
            return;
        }


        if (indice < 0) {
            indice = 0;
        }


        if (indice >= cards.length) {

            indice =
                cards.length - 1;
        }


        cards.forEach(
            function (
                card,
                index
            ) {

                card.style.display =
                    index === indice
                        ? 'block'
                        : 'none';
            }
        );


        if (container === part1Container) {

            part1Actual =
                indice;
        }


        if (container === part2Container) {

            part2Actual =
                indice;
        }


        actualizarIndicadorActividad(
            container,
            indice
        );


        actualizarBotonesNavegacion(
            container,
            indice
        );
    }


    /* =========================================================
       INDICADOR ACTIVIDAD
    ========================================================== */

    function actualizarIndicadorActividad(
        container,
        indice
    ) {

        const cards =
            obtenerCards(container);


        if (cards.length === 0) {
            return;
        }


        const actual =
            indice + 1;


        const total =
            cards.length;


        cards.forEach(
            function (card) {

                const indicador =
                    card.querySelector(
                        '.activity-page-indicator'
                    );


                if (indicador) {

                    indicador.textContent =
                        `Actividad ${actual} de ${total}`;
                }
            }
        );
    }


    /* =========================================================
       NAVEGACIÓN ACTIVIDADES
    ========================================================== */

    function actualizarBotonesNavegacion(
        container,
        indice
    ) {

        const cards =
            obtenerCards(container);


        if (cards.length === 0) {
            return;
        }


        const actual =
            cards[indice];


        if (!actual) {
            return;
        }


        const anterior =
            actual.querySelector(
                '.activity-prev'
            );


        const siguiente =
            actual.querySelector(
                '.activity-next'
            );


        if (anterior) {

            anterior.disabled =
                indice === 0;
        }


        if (siguiente) {

            siguiente.disabled =
                indice === cards.length - 1;
        }
    }


    /* =========================================================
       CREAR ACTIVIDAD
    ========================================================== */

    function crearActividad(
        container,
        prefijo,
        numero,
        datos = null
    ) {

        const card =
            document.createElement('div');


        card.className =
            'activity-card';


        card.dataset.numero =
            numero;


        card.dataset.prefijo =
            prefijo;


        card.innerHTML = `

            <div class="activity-card-header">

                <div class="activity-card-title">

                    <div class="activity-number">
                        ${numero}
                    </div>

                    <strong>
                        Actividad ${numero}
                    </strong>

                </div>


                <div class="activity-card-actions">

                    <button
                        type="button"
                        class="activity-action collapse-activity"
                        title="Contraer"
                    >
                        −
                    </button>


                    <button
                        type="button"
                        class="activity-action delete delete-activity"
                        title="Eliminar"
                    >
                        ×
                    </button>

                </div>

            </div>


            <div class="activity-page-indicator">
                Actividad ${numero} de ${numero}
            </div>


            <div class="activity-card-body">

                <div class="activity-field">

                    <label>
                        Ámbito
                    </label>

                    <textarea
                        name="${prefijo}[${numero - 1}][ambito]"
                        rows="4"
                        placeholder="Escribe el ámbito..."
                    ></textarea>

                </div>


                <div class="activity-field">

                    <label>
                        Destreza
                    </label>

                    <textarea
                        name="${prefijo}[${numero - 1}][destreza]"
                        placeholder="Escribe la destreza..."
                    ></textarea>

                </div>


                <div class="activity-field activity-field-full">

                    <label>
                        Estrategias metodológicas
                    </label>

                    <textarea
                        name="${prefijo}[${numero - 1}][estrategias_metologicas]"
                        placeholder="Describe las estrategias metodológicas..."
                    ></textarea>


                    <label style="margin-top: 10px;">
                        Imagen de estrategias metodológicas
                    </label>


                    <input
                        type="file"
                        name="${prefijo}[${numero - 1}][estrategias_metologicas_imagen]"
                        accept="image/*"
                    >

                </div>


                <div class="activity-field">

                    <label>
                        Recursos
                    </label>

                    <textarea
                        name="${prefijo}[${numero - 1}][recursos]"
                        placeholder="Recursos necesarios..."
                    ></textarea>

                </div>


                <div class="activity-field">

                    <label>
                        Indicadores de logro
                    </label>

                    <textarea
                        name="${prefijo}[${numero - 1}][indicadores_logro]"
                        placeholder="Indicadores de logro..."
                    ></textarea>

                </div>


                <!-- =================================================
                     SUBACTIVIDADES
                ================================================== -->

                <div class="activity-field activity-field-full">

                    <div class="subactivities-header">

                        <strong>
                            Subactividades
                        </strong>


                        <button
                            type="button"
                            class="add-subactivity"
                        >
                            + Agregar subactividad
                        </button>

                    </div>


                    <div class="subactivities-container">
                    </div>

                </div>


                <div class="activity-navigation">

                    <button
                        type="button"
                        class="activity-nav-button activity-prev"
                    >
                        ← Anterior
                    </button>


                    <button
                        type="button"
                        class="activity-nav-button activity-next"
                    >
                        Siguiente →
                    </button>

                </div>

            </div>
        `;


        container.appendChild(card);


        /* =====================================================
           CARGAR DATOS ACTIVIDAD
        ====================================================== */

        if (datos) {

            const ambito =
                card.querySelector(
                    '[name$="[ambito]"]'
                );


            const destreza =
                card.querySelector(
                    '[name$="[destreza]"]'
                );


            const estrategias =
                card.querySelector(
                    '[name$="[estrategias_metologicas]"]'
                );


            const recursos =
                card.querySelector(
                    '[name$="[recursos]"]'
                );


            const indicadores =
                card.querySelector(
                    '[name$="[indicadores_logro]"]'
                );


            if (ambito) {

                ambito.value =
                    datos.ambito ?? '';
            }


            if (destreza) {

                destreza.value =
                    datos.destreza ?? '';
            }


            if (estrategias) {

                estrategias.value =
                    datos.estrategias_metologicas ?? '';
            }


            if (datos.estrategias_metologicas_imagen) {

                const imagenExistente =
                    document.createElement('input');


                imagenExistente.type =
                    'hidden';


                imagenExistente.name =
                    `${prefijo}[${numero - 1}][estrategias_metologicas_imagen_existente]`;


                imagenExistente.value =
                    datos.estrategias_metologicas_imagen;


                card.appendChild(
                    imagenExistente
                );
            }


            if (recursos) {

                recursos.value =
                    datos.recursos ?? '';
            }


            if (indicadores) {

                indicadores.value =
                    datos.indicadores_logro ?? '';
            }


            /* =================================================
               CARGAR SUBACTIVIDADES EXISTENTES
            ================================================== */

            const subactividades =
                Array.isArray(
                    datos.subactividades
                )
                    ? datos.subactividades
                    : [];


            subactividades
                .sort(
                    function (a, b) {

                        return (
                            Number(a.orden ?? 0) -
                            Number(b.orden ?? 0)
                        );
                    }
                )
                .forEach(
                    function (
                        subactividad,
                        subIndex
                    ) {

                        crearSubactividad(
                            card,
                            prefijo,
                            numero - 1,
                            subIndex + 1,
                            subactividad
                        );
                    }
                );


            /*
             * Al terminar de cargar todas las subactividades,
             * dejamos visible solamente la primera.
             */
            if (
                subactividades.length > 0
            ) {

                mostrarSubactividad(
                    card,
                    0
                );
            }
        }


        configurarBotonesActividad(
            card
        );


        actualizarNumeracion(
            container
        );


        actualizarIndicadorActividad(
            container,
            container.querySelectorAll(
                '.activity-card'
            ).length - 1
        );
    }


    /* =========================================================
       BOTONES DE ACTIVIDAD
    ========================================================== */

    function configurarBotonesActividad(
        card
    ) {

        const deleteButton =
            card.querySelector(
                '.delete-activity'
            );


        const collapseButton =
            card.querySelector(
                '.collapse-activity'
            );


        const previousButton =
            card.querySelector(
                '.activity-prev'
            );


        const nextButton =
            card.querySelector(
                '.activity-next'
            );


        const addSubactivityButton =
            card.querySelector(
                '.add-subactivity'
            );


        /* =====================================================
           AGREGAR SUBACTIVIDAD
        ====================================================== */

        if (addSubactivityButton) {

            addSubactivityButton.addEventListener(
                'click',
                function () {

                    const prefijo =
                        card.dataset.prefijo;


                    const actividadNumero =
                        Number(
                            card.dataset.numero || 1
                        );


                    const actividadIndex =
                        actividadNumero - 1;


                    const cantidad =
                        obtenerSubactividades(
                            card
                        ).length;


                    crearSubactividad(
                        card,
                        prefijo,
                        actividadIndex,
                        cantidad + 1
                    );


                    marcarCambiosPendientes();
                    actualizarEstado();
                }
            );
        }


        /* =====================================================
           ELIMINAR ACTIVIDAD
        ====================================================== */

        if (deleteButton) {

            deleteButton.addEventListener(
                'click',
                function () {

                    const container =
                        card.parentElement;


                    const cardsAntes =
                        obtenerCards(container);


                    const indiceEliminado =
                        cardsAntes.indexOf(card);


                    let indiceActual;


                    if (
                        container ===
                        part1Container
                    ) {

                        indiceActual =
                            part1Actual;

                    } else {

                        indiceActual =
                            part2Actual;
                    }


                    card.remove();


                    actualizarNumeracion(
                        container
                    );


                    const cardsDespues =
                        obtenerCards(container);


                    if (
                        cardsDespues.length === 0
                    ) {

                        if (
                            container ===
                            part1Container
                        ) {

                            part1Actual = 0;

                        } else {

                            part2Actual = 0;
                        }

                    } else {

                        if (
                            indiceEliminado <
                            indiceActual
                        ) {

                            indiceActual--;
                        }


                        if (
                            indiceActual >=
                            cardsDespues.length
                        ) {

                            indiceActual =
                                cardsDespues.length - 1;
                        }


                        mostrarActividad(
                            container,
                            indiceActual
                        );
                    }


                    actualizarEstado();
                    marcarCambiosPendientes();
                }
            );
        }


        /* =====================================================
           CONTRAER
        ====================================================== */

        if (collapseButton) {

            collapseButton.addEventListener(
                'click',
                function () {

                    const body =
                        card.querySelector(
                            '.activity-card-body'
                        );


                    const visible =
                        body.style.display !== 'none';


                    body.style.display =
                        visible
                            ? 'none'
                            : 'grid';


                    collapseButton.textContent =
                        visible
                            ? '+'
                            : '−';


                    collapseButton.title =
                        visible
                            ? 'Expandir'
                            : 'Contraer';
                }
            );
        }


        /* =====================================================
           ANTERIOR
        ====================================================== */

        if (previousButton) {

            previousButton.addEventListener(
                'click',
                function () {

                    const container =
                        card.parentElement;


                    let indiceActual;


                    if (
                        container ===
                        part1Container
                    ) {

                        indiceActual =
                            part1Actual;

                    } else {

                        indiceActual =
                            part2Actual;
                    }


                    if (indiceActual > 0) {

                        mostrarActividad(
                            container,
                            indiceActual - 1
                        );
                    }
                }
            );
        }


        /* =====================================================
           SIGUIENTE
        ====================================================== */

        if (nextButton) {

            nextButton.addEventListener(
                'click',
                function () {

                    const container =
                        card.parentElement;


                    const cards =
                        obtenerCards(
                            container
                        );


                    let indiceActual;


                    if (
                        container ===
                        part1Container
                    ) {

                        indiceActual =
                            part1Actual;

                    } else {

                        indiceActual =
                            part2Actual;
                    }


                    if (
                        indiceActual <
                        cards.length - 1
                    ) {

                        mostrarActividad(
                            container,
                            indiceActual + 1
                        );
                    }
                }
            );
        }
    }


    /* =========================================================
       NUMERACIÓN ACTIVIDADES
    ========================================================== */

    function actualizarNumeracion(
        container
    ) {

        const cards =
            container.querySelectorAll(
                '.activity-card'
            );


        cards.forEach(
            function (
                card,
                index
            ) {

                const numero =
                    index + 1;


                card.dataset.numero =
                    numero;


                const number =
                    card.querySelector(
                        '.activity-number'
                    );


                if (number) {

                    number.textContent =
                        numero;
                }


                const title =
                    card.querySelector(
                        '.activity-card-title strong'
                    );


                if (title) {

                    title.textContent =
                        'Actividad ' + numero;
                }


                const prefijo =
                    card.dataset.prefijo;


                /* =================================================
                   ACTUALIZAR NOMBRES ACTIVIDAD
                ================================================== */

                const inputs =
                    card.querySelectorAll(
                        ':scope > .activity-card-body input, :scope > .activity-card-body textarea'
                    );


                inputs.forEach(
                    function (input) {

                        const name =
                            input.getAttribute(
                                'name'
                            );


                        if (!name) {
                            return;
                        }


                        const nuevoName =
                            name.replace(
                                new RegExp(
                                    '^' +
                                    prefijo +
                                    '\\[\\d+\\]'
                                ),
                                prefijo +
                                '[' +
                                (numero - 1) +
                                ']'
                            );


                        input.setAttribute(
                            'name',
                            nuevoName
                        );
                    }
                );


                actualizarNumeracionSubactividades(
                    card
                );
            }
        );


        const cardsActuales =
            obtenerCards(container);


        if (
            cardsActuales.length > 0
        ) {

            let indiceActual;


            if (
                container ===
                part1Container
            ) {

                indiceActual =
                    part1Actual;

            } else {

                indiceActual =
                    part2Actual;
            }


            if (
                indiceActual >=
                cardsActuales.length
            ) {

                indiceActual =
                    cardsActuales.length - 1;
            }


            actualizarIndicadorActividad(
                container,
                indiceActual
            );


            actualizarBotonesNavegacion(
                container,
                indiceActual
            );
        }
    }


    /* =========================================================
       AGREGAR ACTIVIDAD PARTE 1
    ========================================================== */

    if (addPart1) {

        addPart1.addEventListener(
            'click',
            function () {

                if (agregandoPart1) {
                    return;
                }


                agregandoPart1 = true;


                setTimeout(
                    function () {
                        agregandoPart1 = false;
                    },
                    300
                );


                const cantidad =
                    part1Container.querySelectorAll(
                        '.activity-card'
                    ).length;


                if (
                    cantidad >=
                    MAX_ACTIVIDADES
                ) {

                    alert(
                        'Puedes agregar máximo 10 actividades antes del Snack.'
                    );


                    return;
                }


                crearActividad(
                    part1Container,
                    'part1',
                    cantidad + 1
                );


                mostrarActividad(
                    part1Container,
                    cantidad
                );


                actualizarEstado();
                marcarCambiosPendientes();
            }
        );
    }


    /* =========================================================
       AGREGAR ACTIVIDAD PARTE 2
    ========================================================== */

    if (addPart2) {

        addPart2.addEventListener(
            'click',
            function () {

                if (agregandoPart2) {
                    return;
                }


                agregandoPart2 = true;


                setTimeout(
                    function () {
                        agregandoPart2 = false;
                    },
                    300
                );


                const cantidad =
                    part2Container.querySelectorAll(
                        '.activity-card'
                    ).length;


                if (
                    cantidad >=
                    MAX_ACTIVIDADES
                ) {

                    alert(
                        'Puedes agregar máximo 10 actividades después del Snack.'
                    );


                    return;
                }


                crearActividad(
                    part2Container,
                    'part2',
                    cantidad + 1
                );


                mostrarActividad(
                    part2Container,
                    cantidad
                );


                actualizarEstado();
                marcarCambiosPendientes();
            }
        );
    }


    /* =========================================================
       ACTUALIZAR ESTADO
    ========================================================== */

    function actualizarEstado() {

        part1Count =
            part1Container.querySelectorAll(
                '.activity-card'
            ).length;


        part2Count =
            part2Container.querySelectorAll(
                '.activity-card'
            ).length;


        actualizarContadores();
        actualizarVacios();
        actualizarSidebar();
        actualizarProgreso();


        if (part1Count > 0) {

            if (
                part1Actual >=
                part1Count
            ) {

                part1Actual =
                    part1Count - 1;
            }


            mostrarActividad(
                part1Container,
                part1Actual
            );
        }


        if (part2Count > 0) {

            if (
                part2Actual >=
                part2Count
            ) {

                part2Actual =
                    part2Count - 1;
            }


            mostrarActividad(
                part2Container,
                part2Actual
            );
        }
    }


    /* =========================================================
       CONTADORES
    ========================================================== */

    function actualizarContadores() {

        if (part1Counter) {

            part1Counter.textContent =
                part1Count +
                ' / ' +
                MAX_ACTIVIDADES;
        }


        if (part2Counter) {

            part2Counter.textContent =
                part2Count +
                ' / ' +
                MAX_ACTIVIDADES;
        }


        if (sidebarPart1Text) {

            sidebarPart1Text.textContent =
                part1Count +
                (
                    part1Count === 1
                        ? ' actividad'
                        : ' actividades'
                );
        }


        if (sidebarPart2Text) {

            sidebarPart2Text.textContent =
                part2Count +
                (
                    part2Count === 1
                        ? ' actividad'
                        : ' actividades'
                );
        }
    }


    /* =========================================================
       ESTADOS VACÍOS
    ========================================================== */

    function actualizarVacios() {

        if (part1Empty) {

            part1Empty.style.display =
                part1Count === 0
                    ? 'flex'
                    : 'none';
        }


        if (part2Empty) {

            part2Empty.style.display =
                part2Count === 0
                    ? 'flex'
                    : 'none';
        }
    }


    /* =========================================================
       SIDEBAR
    ========================================================== */

    function actualizarSidebar() {

        if (sidebarPart1) {

            sidebarPart1.classList.toggle(
                'complete',
                part1Count > 0
            );
        }


        if (sidebarPart2) {

            sidebarPart2.classList.toggle(
                'complete',
                part2Count > 0
            );
        }


        const generalCompleto =
            verificarDatosGenerales();


        if (sidebarGeneral) {

            sidebarGeneral.classList.toggle(
                'complete',
                generalCompleto
            );
        }
    }


    /* =========================================================
       PROGRESO
    ========================================================== */

    function actualizarProgreso() {

        let progreso = 0;


        if (verificarDatosGenerales()) {
            progreso += 40;
        }


        if (part1Count > 0) {
            progreso += 30;
        }


        if (part2Count > 0) {
            progreso += 30;
        }


        if (progressValue) {

            progressValue.style.width =
                progreso + '%';
        }


        if (progressPercent) {

            progressPercent.textContent =
                progreso + '%';
        }


        if (progresoInput) {

            progresoInput.value =
                progreso;
        }
    }


    /* =========================================================
       DATOS GENERALES
    ========================================================== */

    function verificarDatosGenerales() {

        const campos = [

            '1_experiencia_prendizaje',
            '2_descripcion_general_experiencia',
            '3_nombre_maestra',
            '4_tiempo_estimado',
            '5_fecha',
            '6_nivel_educativo',
            '7_objetivo_aprendizaje',
            '8_elemento_integrador',
            '9_nocion_dia'

        ];


        let completos = true;


        campos.forEach(
            function (nombre) {

                const campo =
                    form.querySelector(
                        `[name="${nombre}"]`
                    );


                if (
                    !campo ||
                    campo.value.trim() === ''
                ) {

                    completos = false;
                }
            }
        );


        return completos;
    }


    /* =========================================================
       VALIDAR DATOS
    ========================================================== */

    function validarAntesDeGuardar() {

        const generalCompleto =
            verificarDatosGenerales();


        if (!generalCompleto) {

            alert(
                'Completa todos los datos generales antes de guardar o generar el Word.'
            );


            const primerCampo =
                form.querySelector(
                    'input[required]:invalid, textarea[required]:invalid, select[required]:invalid'
                );


            if (primerCampo) {

                primerCampo.focus();
            }


            return false;
        }


        if (
            part1Count === 0 &&
            part2Count === 0
        ) {

            const continuar =
                confirm(
                    'No has agregado ninguna actividad. ¿Deseas continuar?'
                );


            if (!continuar) {
                return false;
            }
        }


        return true;
    }


    /* =========================================================
       GUARDAR PLANIFICACIÓN
    ========================================================== */

    async function guardarPlanificacion() {

        if (!editandoPlantillaExistente) {

            const valido =
                validarAntesDeGuardar();


            if (!valido) {
                return;
            }
        }


        const formData =
            new FormData(form);


        if (
            usandoPlantilla &&
            window.plantillaId
        ) {

            formData.set(
                'plantilla_origen_id',
                window.plantillaId
            );
        }


        const tienePlanificacionGuardada =
            window.planificacionId !== null &&
            window.planificacionId !== undefined &&
            window.planificacionId !== '';


        const url =
            tienePlanificacionGuardada
                ? `/planificaciones/${window.planificacionId}`
                : '/planificaciones';


        if (tienePlanificacionGuardada) {

            formData.append(
                '_method',
                'PUT'
            );
        }


        const textoOriginal =
            saveButton.innerHTML;


        try {

            saveButton.disabled =
                true;


            if (usandoPlantilla) {

                saveButton.innerHTML =
                    'Creando planificación...';

            } else if (
                editandoPlantillaExistente
            ) {

                saveButton.innerHTML =
                    'Actualizando plantilla...';

            } else if (editando) {

                saveButton.innerHTML =
                    'Actualizando...';

            } else {

                saveButton.innerHTML =
                    'Guardando...';
            }


            const response =
                await fetch(
                    url,
                    {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-Requested-With':
                                'XMLHttpRequest',
                            'Accept':
                                'application/json'
                        }
                    }
                );


            if (!response.ok) {

                const texto =
                    await response.text();


                console.error(
                    'Respuesta del servidor:',
                    texto
                );


                throw new Error(
                    'Error al guardar la planificación.'
                );
            }


            const data =
                await response.json();


            if (data.success) {

                window.location.href =
                    '/planificaciones';

            } else {

                alert(
                    data.message ||
                    'No se pudo guardar la planificación.'
                );
            }

        } catch (error) {

            console.error(
                'Error guardando planificación:',
                error
            );


            alert(
                'Ocurrió un error al guardar la planificación.'
            );

        } finally {

            saveButton.disabled =
                false;


            saveButton.innerHTML =
                textoOriginal;
        }
    }


    /* =========================================================
       GUARDAR COMO PLANTILLA
    ========================================================== */

    async function guardarComoPlantilla() {

        if (!templateButton) {
            return;
        }


        if (!nuevaPlanificacion) {

            console.warn(
                'Guardar como plantilla solo está disponible para nuevas planificaciones.'
            );


            return;
        }


        const formData =
            new FormData(form);


        formData.set(
            'es_plantilla',
            '1'
        );


        formData.set(
            'progreso',
            '0'
        );


        const textoOriginal =
            templateButton.innerHTML;


        try {

            templateButton.disabled =
                true;


            templateButton.innerHTML =
                'Guardando plantilla...';


            const response =
                await fetch(
                    '/planificaciones',
                    {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-Requested-With':
                                'XMLHttpRequest',
                            'Accept':
                                'application/json'
                        }
                    }
                );


            if (!response.ok) {

                const texto =
                    await response.text();


                console.error(
                    'Respuesta del servidor:',
                    texto
                );


                throw new Error(
                    'Error al guardar la plantilla.'
                );
            }


            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.message ||
                    'No se pudo guardar la plantilla.'
                );
            }


            alert(
                'Plantilla guardada correctamente.'
            );


            window.location.href =
                '/planificaciones';


        } catch (error) {

            console.error(
                'Error guardando plantilla:',
                error
            );


            alert(
                'Ocurrió un error al guardar la plantilla.'
            );

        } finally {

            templateButton.disabled =
                false;


            templateButton.innerHTML =
                textoOriginal;
        }
    }


    /* =========================================================
       ACTUALIZAR AL ESCRIBIR
    ========================================================== */

    form.addEventListener(
        'input',
        function (event) {

            const campo =
                event.target;


            if (
                campo.matches(
                    'input, textarea, select'
                )
            ) {

                actualizarEstado();
                marcarCambiosPendientes();
            }
        }
    );


    form.addEventListener(
        'change',
        function (event) {

            const campo =
                event.target;


            if (
                campo.matches(
                    'input, textarea, select'
                )
            ) {

                actualizarEstado();
                marcarCambiosPendientes();
            }
        }
    );


    /* =========================================================
       CLICK GUARDAR
    ========================================================== */

    if (saveButton) {

        saveButton.addEventListener(
            'click',
            function (event) {

                event.preventDefault();


                guardarPlanificacion();
            }
        );
    }


    /* =========================================================
       CLICK GUARDAR PLANTILLA
    ========================================================== */

    if (templateButton) {

        templateButton.addEventListener(
            'click',
            function (event) {

                event.preventDefault();


                guardarComoPlantilla();
            }
        );
    }


    /* =========================================================
       GENERAR WORD
    ========================================================== */

    form.addEventListener(
        'submit',
        function (event) {

            if (editandoPlantillaExistente) {
                return;
            }


            const generalCompleto =
                verificarDatosGenerales();


            if (!generalCompleto) {

                event.preventDefault();


                alert(
                    'Completa todos los datos generales antes de generar el Word.'
                );


                const primerCampo =
                    form.querySelector(
                        'input[required]:invalid, textarea[required]:invalid, select[required]:invalid'
                    );


                if (primerCampo) {

                    primerCampo.focus();
                }


                return;
            }


            if (
                part1Count === 0 &&
                part2Count === 0
            ) {

                const continuar =
                    confirm(
                        'No has agregado ninguna actividad. ¿Deseas continuar?'
                    );


                if (!continuar) {

                    event.preventDefault();


                    return;
                }
            }
        }
    );


    /* =========================================================
       CARGAR PLANIFICACIÓN / PLANTILLA
    ========================================================== */

    const idParaCargar =
        tienePlantillaId
            ? window.plantillaId
            : window.planificacionId;


    if (idParaCargar) {

        try {

            const response =
                await fetch(
                    `/api/planificaciones/${idParaCargar}`
                );


            if (!response.ok) {

                throw new Error(
                    'No se pudo cargar la planificación.'
                );
            }


            const result =
                await response.json();


            if (!result.success) {

                throw new Error(
                    result.message ||
                    'No se pudo cargar la planificación.'
                );
            }


            const planificacion =
                result.data;


            /* =================================================
               DETECTAR PLANTILLA
            ================================================== */

            const esPlantillaExistente =
                Boolean(
                    planificacion.es_plantilla
                );


            /* =================================================
               USANDO PLANTILLA
            ================================================== */

            if (usandoPlantilla) {

                if (!esPlantillaExistente) {

                    throw new Error(
                        'El registro seleccionado no es una plantilla.'
                    );
                }


                if (templateButton) {

                    templateButton.style.display =
                        'none';
                }


                if (saveButton) {

                    saveButton.textContent =
                        'Guardar nueva planificación';


                    saveButton.type =
                        'button';
                }
            }


            /* =================================================
               EDITANDO PLANIFICACIÓN
            ================================================== */

            if (
                editando &&
                !esPlantillaExistente
            ) {

                editandoPlantillaExistente =
                    false;


                if (templateButton) {

                    templateButton.style.display =
                        'none';
                }


                if (saveButton) {

                    saveButton.textContent =
                        'Actualizar planificación';


                    saveButton.type =
                        'button';
                }
            }


            /* =================================================
               EDITANDO PLANTILLA
            ================================================== */

            if (
                editando &&
                esPlantillaExistente
            ) {

                editandoPlantillaExistente =
                    true;


                if (templateButton) {

                    templateButton.style.display =
                        'none';
                }


                if (saveButton) {

                    saveButton.textContent =
                        'Actualizar plantilla';


                    saveButton.type =
                        'button';
                }
            }


            /* =================================================
               DATOS GENERALES
            ================================================== */

            const campos = {

                '1_experiencia_prendizaje':
                    planificacion.experiencia_aprendizaje,

                '2_descripcion_general_experiencia':
                    planificacion.descripcion_general_experiencia,

                '3_nombre_maestra':
                    planificacion.nombre_maestra,

                '4_tiempo_estimado':
                    planificacion.tiempo_estimado,

                '5_fecha':
                    planificacion.fecha,

                '6_nivel_educativo':
                    planificacion.nivel_educativo,

                '7_objetivo_aprendizaje':
                    planificacion.objetivo_aprendizaje,

                '8_elemento_integrador':
                    planificacion.elemento_integrador,

                '9_nocion_dia':
                    planificacion.nocion_dia,

                'tamano_letra_actividades':
                    planificacion.tamano_letra_actividades ?? 8
            };


            Object.entries(campos).forEach(
                function (
                    [
                        nombre,
                        valor
                    ]
                ) {

                    const campo =
                        form.querySelector(
                            `[name="${nombre}"]`
                        );


                    if (campo) {

                        campo.value =
                            valor ?? '';
                    }
                }
            );


            /* =================================================
               PROGRESO
            ================================================== */

            const progreso =
                Number(
                    planificacion.progreso ?? 0
                );


            if (!usandoPlantilla) {

                if (progresoInput) {

                    progresoInput.value =
                        progreso;
                }


                if (progressPercent) {

                    progressPercent.textContent =
                        progreso + '%';
                }


                if (progressValue) {

                    progressValue.style.width =
                        progreso + '%';
                }
            }


            /* =================================================
               LIMPIAR ACTIVIDADES
            ================================================== */

            part1Container
                .querySelectorAll(
                    '.activity-card'
                )
                .forEach(
                    function (card) {

                        card.remove();
                    }
                );


            part2Container
                .querySelectorAll(
                    '.activity-card'
                )
                .forEach(
                    function (card) {

                        card.remove();
                    }
                );


            /* =================================================
               OBTENER ACTIVIDADES
            ================================================== */

            const actividades =
                planificacion.actividades ?? [];


            const part1Actividades =
                actividades.filter(
                    function (actividad) {

                        return (
                            actividad.seccion ===
                            'part1'
                        );
                    }
                );


            const part2Actividades =
                actividades.filter(
                    function (actividad) {

                        return (
                            actividad.seccion ===
                            'part2'
                        );
                    }
                );


            /* =================================================
               PARTE 1
            ================================================== */

            part1Actividades
                .sort(
                    function (
                        a,
                        b
                    ) {

                        return (
                            Number(a.orden ?? 0) -
                            Number(b.orden ?? 0)
                        );
                    }
                )
                .slice(
                    0,
                    MAX_ACTIVIDADES
                )
                .forEach(
                    function (
                        actividad,
                        index
                    ) {

                        crearActividad(
                            part1Container,
                            'part1',
                            index + 1,
                            actividad
                        );
                    }
                );


            /* =================================================
               PARTE 2
            ================================================== */

            part2Actividades
                .sort(
                    function (
                        a,
                        b
                    ) {

                        return (
                            Number(a.orden ?? 0) -
                            Number(b.orden ?? 0)
                        );
                    }
                )
                .slice(
                    0,
                    MAX_ACTIVIDADES
                )
                .forEach(
                    function (
                        actividad,
                        index
                    ) {

                        crearActividad(
                            part2Container,
                            'part2',
                            index + 1,
                            actividad
                        );
                    }
                );


            /* =================================================
               COMENZAR PRIMERA ACTIVIDAD
            ================================================== */

            part1Actual = 0;
            part2Actual = 0;


            if (
                part1Actividades.length > 0
            ) {

                mostrarActividad(
                    part1Container,
                    0
                );
            }


            if (
                part2Actividades.length > 0
            ) {

                mostrarActividad(
                    part2Container,
                    0
                );
            }


            /* =================================================
               ACTUALIZAR ESTADO
            ================================================== */

            actualizarEstado();


        } catch (error) {

            console.error(
                'Error cargando planificación:',
                error
            );


            alert(
                usandoPlantilla
                    ? 'No se pudo cargar la plantilla.'
                    : 'No se pudo cargar la planificación.'
            );
        }
    }


    /* =========================================================
       INICIALIZAR
    ========================================================== */

    actualizarEstado();


    /* =========================================================
       AUTOGUARDADO CADA 15 SEGUNDOS
    ========================================================== */

    setInterval(
        function () {

            autoguardarPlanificacion();

        },
        15000
    );

});