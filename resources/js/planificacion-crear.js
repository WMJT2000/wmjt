document.addEventListener('DOMContentLoaded', async function () {

    const MAX_ACTIVIDADES = 10;

    /* =========================================================
       REFERENCIAS
    ========================================================== */

    const form =
        document.getElementById('planningForm');

    const saveButton =
        document.getElementById('btnGuardarPlanificacion');

    if (saveButton) {
        saveButton.textContent = window.planificacionId
            ? 'Actualizar planificación'
            : 'Guardar planificación';
    }

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
       ESTADO
    ========================================================== */

    let part1Count = 0;
    let part2Count = 0;

    // Índice de la actividad que se está mostrando
    let part1Actual = 0;
    let part2Actual = 0;

    // Evita doble clic / doble creación accidental
    let agregandoPart1 = false;
    let agregandoPart2 = false;


    /* =========================================================
       OBTENER CARDS
    ========================================================== */

    function obtenerCards(container) {

        return Array.from(
            container.querySelectorAll('.activity-card')
        );

    }


    /* =========================================================
       MOSTRAR UNA SOLA ACTIVIDAD
    ========================================================== */

    function mostrarActividad(container, indice) {

        const cards =
            obtenerCards(container);

        if (cards.length === 0) {
            return;
        }

        // Aseguramos que el índice sea válido
        if (indice < 0) {
            indice = 0;
        }

        if (indice >= cards.length) {
            indice = cards.length - 1;
        }

        cards.forEach(function (card, index) {

            card.style.display =
                index === indice
                    ? 'block'
                    : 'none';

        });

        // Guardar cuál estamos viendo
        if (container === part1Container) {
            part1Actual = indice;
        }

        if (container === part2Container) {
            part2Actual = indice;
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
       INDICADOR
       ACTIVIDAD X DE Y
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

        cards.forEach(function (card) {

            const indicador =
                card.querySelector(
                    '.activity-page-indicator'
                );

            if (indicador) {

                indicador.textContent =
                    `Actividad ${actual} de ${total}`;

            }

        });

    }


    /* =========================================================
       NAVEGACIÓN ANTERIOR / SIGUIENTE
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
           CARGAR DATOS SI ESTAMOS EDITANDO
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

            if (recursos) {

                recursos.value =
                    datos.recursos ?? '';

            }

            if (indicadores) {

                indicadores.value =
                    datos.indicadores_logro ?? '';

            }

        }


        configurarBotonesActividad(card);

        actualizarNumeracion(container);

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

    function configurarBotonesActividad(card) {

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


        /* =====================================================
           ELIMINAR
        ====================================================== */

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

                if (container === part1Container) {
                    indiceActual = part1Actual;
                } else {
                    indiceActual = part2Actual;
                }

                card.remove();

                actualizarNumeracion(
                    container
                );

                const cardsDespues =
                    obtenerCards(container);


                if (cardsDespues.length === 0) {

                    if (container === part1Container) {
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

            }
        );


        /* =====================================================
           CONTRAER
        ====================================================== */

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


        /* =====================================================
           ANTERIOR
        ====================================================== */

        previousButton.addEventListener(
            'click',
            function () {

                const container =
                    card.parentElement;

                let indiceActual;

                if (container === part1Container) {
                    indiceActual = part1Actual;
                } else {
                    indiceActual = part2Actual;
                }

                if (indiceActual > 0) {

                    mostrarActividad(
                        container,
                        indiceActual - 1
                    );

                }

            }
        );


        /* =====================================================
           SIGUIENTE
        ====================================================== */

        nextButton.addEventListener(
            'click',
            function () {

                const container =
                    card.parentElement;

                const cards =
                    obtenerCards(container);

                let indiceActual;

                if (container === part1Container) {
                    indiceActual = part1Actual;
                } else {
                    indiceActual = part2Actual;
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


    /* =========================================================
       NUMERACIÓN
    ========================================================== */

    function actualizarNumeracion(container) {

        const cards =
            container.querySelectorAll(
                '.activity-card'
            );

        cards.forEach(function (card, index) {

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


            const inputs =
                card.querySelectorAll(
                    'input, textarea'
                );


            inputs.forEach(function (input) {

                const name =
                    input.getAttribute(
                        'name'
                    );

                if (!name) {
                    return;
                }


                const nuevoName =
                    name.replace(
                        /\[\d+\]/,
                        '[' + (numero - 1) + ']'
                    );


                input.setAttribute(
                    'name',
                    nuevoName
                );

            });

        });


        // Actualizamos los indicadores
        // después de renumerar

        const cardsActuales =
            obtenerCards(container);

        if (cardsActuales.length > 0) {

            let indiceActual;

            if (container === part1Container) {
                indiceActual = part1Actual;
            } else {
                indiceActual = part2Actual;
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

                setTimeout(function () {
                    agregandoPart1 = false;
                }, 300);


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


                // Mostrar automáticamente
                // la nueva actividad

                mostrarActividad(
                    part1Container,
                    cantidad
                );


                actualizarEstado();

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

                setTimeout(function () {
                    agregandoPart2 = false;
                }, 300);


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


                // Mostrar automáticamente
                // la nueva actividad

                mostrarActividad(
                    part2Container,
                    cantidad
                );


                actualizarEstado();

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


        // Mantener siempre visible
        // una actividad válida

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


        campos.forEach(function (nombre) {

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

        });


        return completos;

    }


    /* =========================================================
       GUARDAR PLANIFICACIÓN
    ========================================================== */

    async function guardarPlanificacion() {

        const formData =
            new FormData(form);

        const editando =
            Boolean(window.planificacionId);

        const url =
            editando
                ? `/planificaciones/${window.planificacionId}`
                : saveButton.formAction;


        if (editando) {

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

            saveButton.innerHTML =
                editando
                    ? 'Actualizando...'
                    : 'Guardando...';


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
       ACTUALIZAR AL ESCRIBIR
    ========================================================== */

    form.querySelectorAll(
        'input, textarea, select'
    ).forEach(function (campo) {

        campo.addEventListener(
            'input',
            actualizarEstado
        );


        campo.addEventListener(
            'change',
            actualizarEstado
        );

    });


    /* =========================================================
       VALIDACIÓN ANTES DE ENVIAR
    ========================================================== */

    form.addEventListener(
        'submit',
        function (event) {

            const generalCompleto =
                verificarDatosGenerales();


            if (!generalCompleto) {

                event.preventDefault();


                alert(
                    'Completa todos los datos generales antes de guardar o generar el Word.'
                );


                const primerCampo =
                    form.querySelector(
                        'input:invalid, textarea:invalid, select:invalid'
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


            /* =================================================
               GUARDAR
            ================================================== */

            if (
                event.submitter ===
                saveButton
            ) {

                event.preventDefault();

                guardarPlanificacion();

                return;

            }


            /* =================================================
               GENERAR WORD

               Se deja el envío normal.
            ================================================== */

        }
    );


    /* =========================================================
       CARGAR PLANIFICACIÓN EN MODO EDICIÓN
    ========================================================== */

    if (window.planificacionId) {

        console.log(
            'Editando planificación:',
            window.planificacionId
        );


        try {

            const response =
                await fetch(
                    `/api/planificaciones/${window.planificacionId}`
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
                function ([nombre, valor]) {

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
               PROGRESO GUARDADO
            ================================================== */

            const progreso =
                Number(
                    planificacion.progreso ?? 0
                );


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


            /* =================================================
               LIMPIAR ACTIVIDADES EXISTENTES
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
               CARGAR ACTIVIDADES
            ================================================== */

            const actividades =
                planificacion.actividades ?? [];


            const part1Actividades =
                actividades.filter(
                    function (actividad) {

                        return actividad.seccion === 'part1';

                    }
                );


            const part2Actividades =
                actividades.filter(
                    function (actividad) {

                        return actividad.seccion === 'part2';

                    }
                );


            /* =================================================
               PARTE 1
            ================================================== */

            part1Actividades
                .sort(
                    function (a, b) {

                        return a.orden - b.orden;

                    }
                )
                .forEach(
                    function (actividad, index) {

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
                    function (a, b) {

                        return a.orden - b.orden;

                    }
                )
                .forEach(
                    function (actividad, index) {

                        crearActividad(
                            part2Container,
                            'part2',
                            index + 1,
                            actividad
                        );

                    }
                );


            /* =================================================
               COMENZAR EN LA PRIMERA ACTIVIDAD
            ================================================== */

            part1Actual = 0;
            part2Actual = 0;


            if (part1Actividades.length > 0) {

                mostrarActividad(
                    part1Container,
                    0
                );

            }


            if (part2Actividades.length > 0) {

                mostrarActividad(
                    part2Container,
                    0
                );

            }


            /* =================================================
               ACTUALIZAR TODO
            ================================================== */

            actualizarEstado();


            console.log(
                'Planificación cargada correctamente:',
                planificacion
            );


            console.log(
                'Actividades cargadas:',
                actividades
            );


        } catch (error) {

            console.error(
                'Error cargando planificación:',
                error
            );


            alert(
                'No se pudo cargar la planificación.'
            );

        }

    }


    /* =========================================================
       INICIALIZAR
    ========================================================== */

    actualizarEstado();

});