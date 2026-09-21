
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

       1. NUEVA PLANIFICACIÓN
          planificacionId = null
          usarPlantilla = false

       2. EDITAR PLANIFICACIÓN
          planificacionId = ID
          usarPlantilla = false

       3. USAR PLANTILLA
          planificacionId = ID
          usarPlantilla = true

       IMPORTANTE:
       "Guardar como plantilla" SOLO aparece en el
       modo 1: nueva planificación desde cero.
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


    /*
    =========================================================
       IMPORTANTE

       Convertimos el botón guardar en BUTTON.

       Así el navegador NO ejecuta automáticamente los
       "required" antes de que nuestro JavaScript pueda
       decidir qué validación corresponde.

       Nosotros controlaremos la validación manualmente.
    =========================================================
    */

    if (saveButton) {
        saveButton.type = 'button';
    }

    if (templateButton) {
        templateButton.type = 'button';
    }


    /* =========================================================
       MOSTRAR / OCULTAR BOTÓN "GUARDAR COMO PLANTILLA"
    ========================================================== */

    if (templateButton) {

        if (nuevaPlanificacion) {

            // NUEVA DESDE CERO
            templateButton.style.display = '';

        } else {

            // EDITANDO PLANIFICACIÓN
            // EDITANDO PLANTILLA
            // USANDO PLANTILLA

            templateButton.style.display = 'none';
        }
    }


    /* =========================================================
       TEXTO DEL BOTÓN GUARDAR
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

    let agregandoPart1 = false;
    let agregandoPart2 = false;

    /*
    Esta variable se actualizará cuando carguemos el registro.

    Sirve para saber si estamos editando realmente una plantilla.
    */

    let editandoPlantillaExistente = false;
    let recuperandoBorrador = false;

    // =========================================================
    // AUTOGUARDADO
    // =========================================================

    let autoGuardando = false;
    let autoGuardadoPendiente = false;
    let planificacionCreadaPorAutoguardado = false;

    let cambiosPendientes = false;

    function marcarCambiosPendientes() {
        cambiosPendientes = true;
    }

    // =========================================================
    // GUARDAR AUTOMÁTICAMENTE
    // NO VALIDA CAMPOS
    // NO REDIRECCIONA
    // =========================================================

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

        const formData = new FormData(form);

        /*
        Si estamos creando desde una plantilla,
        guardamos de dónde salió.
        */
        if (usandoPlantilla && window.plantillaId) {
            formData.set(
                'plantilla_origen_id',
                window.plantillaId
            );
        }

        let url = '/planificaciones';

        /*
        NUEVA PLANIFICACIÓN
        -------------------
        No existe todavía un ID real.
    
        También aplica cuando estamos usando una plantilla,
        porque la plantilla NO es la planificación nueva.
        */
        if (
            !window.planificacionId ||
            usandoPlantilla
        ) {

            formData.set(
                'es_plantilla',
                '0'
            );

            url = '/planificaciones';

        }

        /*
        PLANIFICACIÓN YA CREADA
        -----------------------
        A partir de aquí actualizamos el ID real.
        */
        else {

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

            /*
            SI ACABAMOS DE CREAR LA PLANIFICACIÓN
            -------------------------------------
    
            El controller devuelve:
    
            data.planificacion_id
    
            Ese será desde ahora el ID REAL.
            */
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
            indice = cards.length - 1;
        }

        cards.forEach(
            function (card, index) {

                card.style.display =
                    index === indice
                        ? 'block'
                        : 'none';
            }
        );

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
       NAVEGACIÓN
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
           CARGAR DATOS DE ACTIVIDAD
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

    imagenExistente.type = 'hidden';

    imagenExistente.name =
        `${prefijo}[${numero - 1}][estrategias_metologicas_imagen_existente]`;

    imagenExistente.value =
        datos.estrategias_metologicas_imagen;

    card.appendChild(imagenExistente);
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
                marcarCambiosPendientes();
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


    /* =========================================================
       NUMERACIÓN
    ========================================================== */

    function actualizarNumeracion(container) {

        const cards =
            container.querySelectorAll(
                '.activity-card'
            );

        cards.forEach(
            function (card, index) {

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
                                /\[\d+\]/,
                                '[' + (numero - 1) + ']'
                            );

                        input.setAttribute(
                            'name',
                            nuevoName
                        );
                    }
                );
            }
        );


        const cardsActuales =
            obtenerCards(container);


        if (cardsActuales.length > 0) {

            let indiceActual;

            if (container === part1Container) {

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
       VALIDAR DATOS NORMALES
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
       GUARDAR PLANIFICACIÓN NORMAL

       CASOS:

       NUEVA:
       POST /planificaciones

       USANDO PLANTILLA:
       POST /planificaciones

       EDITANDO PLANIFICACIÓN:
       PUT /planificaciones/{id}

       EDITANDO PLANTILLA:
       PUT /planificaciones/{id}

       IMPORTANTE:
       Si es plantilla existente NO hacemos validación
       obligatoria.
    ========================================================== */

    async function guardarPlanificacion() {

        /*
        ---------------------------------------------------------
        SI ESTAMOS EDITANDO UNA PLANTILLA:

        NO VALIDAMOS CAMPOS OBLIGATORIOS.

        Esto permite guardar aunque la plantilla tenga
        campos vacíos.
        ---------------------------------------------------------
        */

        if (!editandoPlantillaExistente) {

            const valido =
                validarAntesDeGuardar();

            if (!valido) {
                return;
            }
        }


        const formData =
            new FormData(form);

        if (usandoPlantilla && window.plantillaId) {
            formData.set(
                'plantilla_origen_id',
                window.plantillaId
            );
        }


        /*
        ---------------------------------------------------------
        EDITANDO:

        PUT /planificaciones/{id}

        NUEVA / USANDO PLANTILLA:

        POST /planificaciones
        ---------------------------------------------------------
        */

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

            } else if (editandoPlantillaExistente) {

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

       SOLO NUEVA PLANIFICACIÓN DESDE CERO.
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


        /*
        ---------------------------------------------------------
        INDICAMOS AL CONTROLLER QUE ES UNA PLANTILLA
        ---------------------------------------------------------
        */

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



            const campo = event.target;

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



            const campo = event.target;

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
       CLICK GUARDAR PLANIFICACIÓN
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
       CLICK GUARDAR COMO PLANTILLA
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

       IMPORTANTE:

       El botón "Generar Word" sigue siendo submit.

       Como el botón Guardar planificación ahora es
       type="button", solamente este botón llegará
       al submit normal del formulario.
    ========================================================== */

    form.addEventListener(
        'submit',
        function (event) {

            /*
            -----------------------------------------------------
            SI ESTAMOS EDITANDO UNA PLANTILLA

            No bloqueamos por campos obligatorios.

            Pero este submit corresponde principalmente
            al botón Generar Word.
            -----------------------------------------------------
            */

            if (editandoPlantillaExistente) {
                return;
            }


            /*
            -----------------------------------------------------
            VALIDACIÓN NORMAL
            -----------------------------------------------------
            */

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


            /*
            -----------------------------------------------------
            VALIDAR ACTIVIDADES
            -----------------------------------------------------
            */

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

            /*
            =====================================================
            DETECTAR SI EL REGISTRO ES REALMENTE UNA PLANTILLA
            =====================================================
            */

            const esPlantillaExistente =
                Boolean(
                    planificacion.es_plantilla
                );

            /*
            =====================================================
            USANDO PLANTILLA
            =====================================================
    
            La plantilla SOLO sirve como origen de datos.
    
            Su ID NO se asigna a window.planificacionId.
            */

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

            /*
            =====================================================
            EDITANDO PLANIFICACIÓN EXISTENTE
            =====================================================
            */

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

            /*
            =====================================================
            EDITANDO PLANTILLA EXISTENTE
            =====================================================
            */

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

            /*
            =====================================================
            DATOS GENERALES
            =====================================================
            */

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

            /*
            =====================================================
            PROGRESO
            =====================================================
            */

            const progreso =
                Number(
                    planificacion.progreso ?? 0
                );

            /*
            Si usamos plantilla NO copiamos el progreso.
    
            La nueva planificación debe calcular su propio progreso.
            */

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

            /*
            =====================================================
            LIMPIAR ACTIVIDADES ACTUALES
            =====================================================
            */

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

            /*
            =====================================================
            OBTENER ACTIVIDADES
            =====================================================
            */

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

            /*
            =====================================================
            PARTE 1
            =====================================================
            */

            part1Actividades
                .sort(
                    function (a, b) {

                        return a.orden - b.orden;
                    }
                )
                .slice(
                    0,
                    MAX_ACTIVIDADES
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

            /*
            =====================================================
            PARTE 2
            =====================================================
            */

            part2Actividades
                .sort(
                    function (a, b) {

                        return a.orden - b.orden;
                    }
                )
                .slice(
                    0,
                    MAX_ACTIVIDADES
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

            /*
            =====================================================
            COMENZAR EN LA PRIMERA ACTIVIDAD
            =====================================================
            */

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

            /*
            =====================================================
            ACTUALIZAR ESTADO
            =====================================================
            */

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

    // =========================================================
    // AUTOGUARDADO CADA 30 SEGUNDOS
    // =========================================================

    setInterval(
        function () {

            autoguardarPlanificacion();

        },
        15000
    );
});