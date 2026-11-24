
document.addEventListener('DOMContentLoaded', () => {

    /*
    |--------------------------------------------------------------------------
    | Datos
    |--------------------------------------------------------------------------
    */

    let importData = null;
    let importType = null;
    let selectedPlanificacionId = null;
    let selectedActividadId = null;


    /*
    |--------------------------------------------------------------------------
    | Elementos HTML
    |--------------------------------------------------------------------------
    */

    const importTypeSelect =
        document.getElementById('piImportType');

    const planificacionGroup =
        document.getElementById('piPlanificacionGroup');

    const planificacionSelect =
        document.getElementById('piPlanificacionSelect');

    const actividadGroup =
        document.getElementById('piActividadGroup');

    const actividadSelect =
        document.getElementById('piActividadSelect');

    const jsonFile =
        document.getElementById('piJsonFile');

    const validateBtn =
        document.getElementById('piValidateBtn');

    const importBtn =
        document.getElementById('piImportBtn');

    const formatBtn =
        document.getElementById('piFormatBtn');

    const preview =
        document.getElementById('piPreview');

    const formatModal =
        document.getElementById('piFormatModal');

    const formatTypeSelect =
        document.getElementById('piFormatType');

    const formatAliases =
        document.getElementById('piFormatAliases');

    const formatPreview =
        document.getElementById('piFormatPreview');

    const formatFeedback =
        document.getElementById('piFormatFeedback');

    const copyFormatBtn =
        document.getElementById('piCopyFormatBtn');

    const closeFormatModal =
        document.getElementById('piCloseFormatModal');

    const closeFormatModalFooter =
        document.getElementById('piCloseFormatModalFooter');

    const promptBtn =
        document.getElementById('piPromptBtn');

    const promptModal =
        document.getElementById('piPromptModal');

    const promptTypeSelect =
        document.getElementById('piPromptType');

    const promptAliases =
        document.getElementById('piPromptAliases');

    const promptText =
        document.getElementById('piPromptText');

    const promptFeedback =
        document.getElementById('piPromptFeedback');

    const copyPromptBtn =
        document.getElementById('piCopyPromptBtn');

    const closePromptModal =
        document.getElementById('piClosePromptModal');

    const closePromptModalFooter =
        document.getElementById('piClosePromptModalFooter');


    /*
    |--------------------------------------------------------------------------
    | Verificar elementos
    |--------------------------------------------------------------------------
    */

    if (
        !importTypeSelect ||
        !planificacionGroup ||
        !planificacionSelect ||
        !actividadGroup ||
        !actividadSelect ||
        !jsonFile ||
        !validateBtn ||
        !importBtn ||
        !formatBtn ||
        !preview ||
        !formatModal ||
        !formatTypeSelect ||
        !formatAliases ||
        !formatPreview ||
        !formatFeedback ||
        !copyFormatBtn ||
        !closeFormatModal ||
        !closeFormatModalFooter ||
        !promptBtn ||
        !promptModal ||
        !promptTypeSelect ||
        !promptAliases ||
        !promptText ||
        !promptFeedback ||
        !copyPromptBtn ||
        !closePromptModal ||
        !closePromptModalFooter
    ) {
        console.error(
            'Planificación Import: no se encontraron todos los elementos HTML.'
        );

        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Reiniciar estado
    |--------------------------------------------------------------------------
    */

    function resetState() {

        importData = null;
        selectedActividadId = null;

        jsonFile.value = '';
        jsonFile.disabled = true;

        validateBtn.disabled = true;

        importBtn.style.display = 'none';

        preview.innerHTML = '';
        preview.style.display = 'none';

        actividadSelect.innerHTML = `
            <option value="">
                Selecciona una actividad
            </option>
        `;
        actividadSelect.disabled = true;

    }


    /*
    |--------------------------------------------------------------------------
    | Seleccionar tipo de importación
    |--------------------------------------------------------------------------
    */

    importTypeSelect.addEventListener('change', async () => {

        importType = importTypeSelect.value;

        resetState();

        selectedPlanificacionId = null;

        planificacionGroup.style.display = 'none';
        actividadGroup.style.display = 'none';
        planificacionSelect.value = '';

        if (!importType) {
            return;
        }

        if (
            importType === 'actividades' ||
            importType === 'subactividades'
        ) {
            planificacionGroup.style.display = 'block';
            return;
        }

        jsonFile.disabled = false;
        validateBtn.disabled = false;

    });


    /*
    |--------------------------------------------------------------------------
    | Seleccionar planificación padre
    |--------------------------------------------------------------------------
    */

    planificacionSelect.addEventListener('change', async () => {

        selectedPlanificacionId =
            planificacionSelect.value || null;

        resetState();

        if (!selectedPlanificacionId) {
            return;
        }

        if (importType === 'actividades') {
            jsonFile.disabled = false;
            validateBtn.disabled = false;
            return;
        }

        if (importType === 'subactividades') {
            actividadGroup.style.display = 'block';
            await cargarActividades();
        }

    });


    /*
    |--------------------------------------------------------------------------
    | Seleccionar actividad padre
    |--------------------------------------------------------------------------
    */

    actividadSelect.addEventListener('change', () => {

        selectedActividadId =
            actividadSelect.value || null;

        importData = null;

        jsonFile.value = '';
        importBtn.style.display = 'none';

        preview.innerHTML = '';
        preview.style.display = 'none';

        validateBtn.disabled = !selectedActividadId;
        jsonFile.disabled = !selectedActividadId;

    });


    /*
    |--------------------------------------------------------------------------
    | Cargar actividades de la planificación seleccionada
    |--------------------------------------------------------------------------
    */

    async function cargarActividades() {

        actividadSelect.disabled = true;

        actividadSelect.innerHTML = `
            <option value="">
                Cargando actividades...
            </option>
        `;

        try {

            const response = await fetch(
                `${window.planificacionImportConfig.routes.actividadesList}/${selectedPlanificacionId}`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            const result =
                await parseJsonResponse(response);

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    'No se pudieron cargar las actividades.'
                );
            }

            actividadSelect.innerHTML = `
                <option value="">
                    Selecciona una actividad
                </option>
            `;

            result.data.forEach(actividad => {

                const option =
                    document.createElement('option');

                option.value = actividad.id;

                option.textContent =
                    `${actividad.seccion} #${actividad.orden}` +
                    (actividad.ambito
                        ? ` - ${actividad.ambito}`
                        : '') +
                    (actividad.destreza
                        ? ` - ${actividad.destreza}`
                        : '');

                actividadSelect.appendChild(option);

            });

            actividadSelect.disabled = false;

        } catch (error) {

            actividadSelect.innerHTML = `
                <option value="">
                    Error al cargar actividades
                </option>
            `;

            actividadSelect.disabled = true;

            alert(error.message);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Seleccionar archivo JSON
    |--------------------------------------------------------------------------
    */

    jsonFile.addEventListener('change', () => {

        importData = null;

        importBtn.style.display = 'none';

        preview.innerHTML = '';
        preview.style.display = 'none';

        validateBtn.disabled = !jsonFile.files.length;

    });


    /*
    |--------------------------------------------------------------------------
    | Validar JSON
    |--------------------------------------------------------------------------
    */

    validateBtn.addEventListener('click', async () => {

        if (!jsonFile.files.length) {
            alert('Seleccione un archivo JSON.');
            return;
        }

        const file = jsonFile.files[0];

        importData = null;

        importBtn.style.display = 'none';

        preview.innerHTML = '';
        preview.style.display = 'none';

        try {

            const text = await file.text();

            importData = JSON.parse(text);

            let result;

            switch (importType) {

                case 'complete':
                    result = validarCompleta(importData);
                    break;

                case 'multiple':
                    result = validarVarias(importData);
                    break;

                case 'actividades':
                    result = validarActividades(importData);
                    break;

                case 'subactividades':
                    result = validarSubactividades(importData);
                    break;

                default:
                    throw new Error(
                        'Tipo de importación no válido.'
                    );

            }

            if (!result.valid) {
                throw new Error(result.message);
            }

            mostrarPreview(importData);

            importBtn.style.display = 'inline-block';

        } catch (error) {

            importData = null;

            importBtn.style.display = 'none';

            preview.innerHTML = mensajeError(error.message);
            preview.style.display = 'block';

        }

    });


    /*
    |--------------------------------------------------------------------------
    | Importar datos
    |--------------------------------------------------------------------------
    */

    importBtn.addEventListener('click', async () => {

        if (!importData) {
            alert('Primero debe validar el archivo JSON.');
            return;
        }

        importBtn.disabled = true;

        try {

            const endpoint = getImportEndpoint();

            const response = await fetch(endpoint, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                },

                body: JSON.stringify(importData)

            });

            const result =
                await parseJsonResponse(response);

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    'No se pudo realizar la importación.'
                );
            }

            preview.innerHTML =
                mensajeExito(result);
            preview.style.display = 'block';

            importBtn.style.display = 'none';

        } catch (error) {

            preview.innerHTML = mensajeError(error.message);
            preview.style.display = 'block';

        } finally {

            importBtn.disabled = false;

        }

    });


    /*
    |--------------------------------------------------------------------------
    | Obtener endpoint de importación
    |--------------------------------------------------------------------------
    */

    function getImportEndpoint() {

        switch (importType) {

            case 'complete':
            case 'multiple':
                return window.planificacionImportConfig
                    .routes.complete;

            case 'actividades':

                if (!selectedPlanificacionId) {
                    throw new Error(
                        'Seleccione una planificación.'
                    );
                }

                return `${window.planificacionImportConfig.routes.actividadesBase}/${selectedPlanificacionId}/actividades/import`;

            case 'subactividades':

                if (!selectedActividadId) {
                    throw new Error(
                        'Seleccione una actividad.'
                    );
                }

                return `${window.planificacionImportConfig.routes.subactividadesBase}/${selectedActividadId}/subactividades/import`;

            default:
                throw new Error(
                    'Tipo de importación no válido.'
                );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Validaciones
    |--------------------------------------------------------------------------
    */

    function esObjeto(valor) {
        return valor !== null &&
            typeof valor === 'object' &&
            !Array.isArray(valor);
    }


    function validarCompleta(data) {

        if (!esObjeto(data)) {
            return {
                valid: false,
                message: 'El JSON debe contener un objeto.'
            };
        }

        const resultado = validarPlanificacion(data);

        if (!resultado.valid) {
            return resultado;
        }

        return validarBloquesActividades(data);

    }


    function validarVarias(data) {

        if (!esObjeto(data)) {
            return {
                valid: false,
                message: 'El JSON debe contener un objeto.'
            };
        }

        if (
            !Array.isArray(data.planificaciones) ||
            data.planificaciones.length === 0
        ) {
            return {
                valid: false,
                message: 'Debe existir al menos una planificación.'
            };
        }

        for (
            let i = 0;
            i < data.planificaciones.length;
            i++
        ) {

            const item = data.planificaciones[i];

            if (!esObjeto(item)) {
                return {
                    valid: false,
                    message: `Planificación ${i + 1}: estructura inválida.`
                };
            }

            const resultado =
                validarPlanificacion(item);

            if (!resultado.valid) {
                return {
                    valid: false,
                    message: `Planificación ${i + 1}: ${resultado.message}`
                };
            }

            const bloques =
                validarBloquesActividades(item);

            if (!bloques.valid) {
                return {
                    valid: false,
                    message: `Planificación ${i + 1}: ${bloques.message}`
                };
            }

        }

        return { valid: true };

    }


    function validarActividades(data) {

        if (!esObjeto(data)) {
            return {
                valid: false,
                message: 'El JSON debe contener un objeto.'
            };
        }

        const resultado =
            validarBloquesActividades(data);

        if (!resultado.valid) {
            return resultado;
        }

        const total =
            (data.part1?.length || 0) +
            (data.part2?.length || 0);

        if (total === 0) {
            return {
                valid: false,
                message: 'Debe existir al menos una actividad en part1 o part2.'
            };
        }

        return { valid: true };

    }


    function validarSubactividades(data) {

        if (!esObjeto(data)) {
            return {
                valid: false,
                message: 'El JSON debe contener un objeto.'
            };
        }

        if (
            !Array.isArray(data.subactividades) ||
            data.subactividades.length === 0
        ) {
            return {
                valid: false,
                message: 'Debe existir al menos una subactividad.'
            };
        }

        for (
            let i = 0;
            i < data.subactividades.length;
            i++
        ) {

            const resultado = validarSubactividad(
                data.subactividades[i],
                `Subactividad ${i + 1}`
            );

            if (!resultado.valid) {
                return resultado;
            }

        }

        return { valid: true };

    }


    function validarPlanificacion(data) {

        const raw = esObjeto(data.planificacion)
            ? data.planificacion
            : data;

        const experiencia =
            raw.experiencia_aprendizaje ??
            raw['1_experiencia_prendizaje'];

        if (
            typeof experiencia !== 'string' ||
            !experiencia.trim()
        ) {
            return {
                valid: false,
                message:
                    'El campo "experiencia_aprendizaje" es obligatorio.'
            };
        }

        const camposTexto = [
            'descripcion_general_experiencia',
            '2_descripcion_general_experiencia',
            'nombre_maestra',
            '3_nombre_maestra',
            'tiempo_estimado',
            '4_tiempo_estimado',
            'fecha',
            '5_fecha',
            'nivel_educativo',
            '6_nivel_educativo',
            'objetivo_aprendizaje',
            '7_objetivo_aprendizaje',
            'elemento_integrador',
            '8_elemento_integrador',
            'nocion_dia',
            '9_nocion_dia',
        ];

        for (const campo of camposTexto) {
            if (
                raw[campo] !== undefined &&
                typeof raw[campo] !== 'string'
            ) {
                return {
                    valid: false,
                    message: `"${campo}" debe ser un texto.`
                };
            }
        }

        if (
            raw.tamano_letra_actividades !== undefined &&
            !Number.isInteger(raw.tamano_letra_actividades)
        ) {
            return {
                valid: false,
                message:
                    '"tamano_letra_actividades" debe ser un número entero.'
            };
        }

        return { valid: true };

    }


    function validarBloquesActividades(data) {

        for (const seccion of ['part1', 'part2']) {

            const bloque = data[seccion];

            if (bloque === undefined) {
                continue;
            }

            if (!Array.isArray(bloque)) {
                return {
                    valid: false,
                    message: `"${seccion}" debe ser un arreglo.`
                };
            }

            for (let i = 0; i < bloque.length; i++) {

                const resultado = validarActividad(
                    bloque[i],
                    `${seccion} ${i + 1}`
                );

                if (!resultado.valid) {
                    return resultado;
                }

            }

        }

        return { valid: true };

    }


    function validarActividad(item, label) {

        if (!esObjeto(item)) {
            return {
                valid: false,
                message: `${label}: estructura inválida.`
            };
        }

        const camposTexto = [
            'ambito',
            'destreza',
            'estrategias_metologicas',
            'recursos',
            'indicadores_logro',
        ];

        for (const campo of camposTexto) {
            if (
                item[campo] !== undefined &&
                typeof item[campo] !== 'string'
            ) {
                return {
                    valid: false,
                    message: `${label}: "${campo}" debe ser un texto.`
                };
            }
        }

        if (
            item.orden !== undefined &&
            !Number.isInteger(item.orden)
        ) {
            return {
                valid: false,
                message: `${label}: "orden" debe ser un número entero.`
            };
        }

        if (item.subactividades !== undefined) {

            if (!Array.isArray(item.subactividades)) {
                return {
                    valid: false,
                    message: `${label}: "subactividades" debe ser un arreglo.`
                };
            }

            for (
                let i = 0;
                i < item.subactividades.length;
                i++
            ) {

                const resultado = validarSubactividad(
                    item.subactividades[i],
                    `${label} / subactividad ${i + 1}`
                );

                if (!resultado.valid) {
                    return resultado;
                }

            }

        }

        return { valid: true };

    }


    function validarSubactividad(item, label) {

        if (!esObjeto(item)) {
            return {
                valid: false,
                message: `${label}: estructura inválida.`
            };
        }

        const camposTexto = [
            'destreza',
            'estrategias_metologicas',
            'recursos',
            'indicadores_logro',
        ];

        for (const campo of camposTexto) {
            if (
                item[campo] !== undefined &&
                typeof item[campo] !== 'string'
            ) {
                return {
                    valid: false,
                    message: `${label}: "${campo}" debe ser un texto.`
                };
            }
        }

        if (
            item.orden !== undefined &&
            !Number.isInteger(item.orden)
        ) {
            return {
                valid: false,
                message: `${label}: "orden" debe ser un número entero.`
            };
        }

        return { valid: true };

    }


    /*
    |--------------------------------------------------------------------------
    | Vista previa
    |--------------------------------------------------------------------------
    */

    function contarActividades(data) {

        let actividades = 0;
        let subactividades = 0;

        for (const seccion of ['part1', 'part2']) {
            for (const actividad of (data[seccion] || [])) {
                actividades++;
                subactividades +=
                    (actividad.subactividades?.length || 0);
            }
        }

        return { actividades, subactividades };

    }


    function mostrarPreview(data) {

        let planes = 0;
        let actividades = 0;
        let subactividades = 0;
        let titulos = [];
        let padre = '';

        if (importType === 'multiple') {

            planes = data.planificaciones.length;

            data.planificaciones.forEach(item => {

                const raw = esObjeto(item.planificacion)
                    ? item.planificacion
                    : item;

                titulos.push(
                    raw.experiencia_aprendizaje ??
                    raw['1_experiencia_prendizaje']
                );

                const conteo = contarActividades(item);

                actividades += conteo.actividades;
                subactividades += conteo.subactividades;

            });

        } else if (importType === 'complete') {

            planes = 1;

            const raw = esObjeto(data.planificacion)
                ? data.planificacion
                : data;

            titulos.push(
                raw.experiencia_aprendizaje ??
                raw['1_experiencia_prendizaje']
            );

            const conteo = contarActividades(data);

            actividades = conteo.actividades;
            subactividades = conteo.subactividades;

        } else if (importType === 'actividades') {

            const conteo = contarActividades(data);

            actividades = conteo.actividades;
            subactividades = conteo.subactividades;

            padre = `Planificación: ${
                escapeHtml(
                    planificacionSelect.options[
                        planificacionSelect.selectedIndex
                    ].text
                )
            }`;

        } else if (importType === 'subactividades') {

            subactividades = data.subactividades.length;

            padre = `Actividad: ${
                escapeHtml(
                    actividadSelect.options[
                        actividadSelect.selectedIndex
                    ].text
                )
            }`;

        }

        const titulosHtml = titulos.length
            ? `<p class="pi-preview-empty">${titulos
                .map(t => escapeHtml(t))
                .join(' · ')}</p>`
            : '';

        preview.innerHTML = `
            <div class="pi-preview-box">
                <h5>Vista previa</h5>

                ${padre ? `<p>${padre}</p>` : ''}

                <div class="pi-preview-stats">
                    <div class="pi-preview-stat">
                        <span class="pi-preview-stat-value">${planes}</span>
                        <span class="pi-preview-stat-label">Planificaciones</span>
                    </div>
                    <div class="pi-preview-stat">
                        <span class="pi-preview-stat-value">${actividades}</span>
                        <span class="pi-preview-stat-label">Actividades</span>
                    </div>
                    <div class="pi-preview-stat">
                        <span class="pi-preview-stat-value">${subactividades}</span>
                        <span class="pi-preview-stat-label">Subactividades</span>
                    </div>
                </div>

                ${titulosHtml}

                <p class="pi-preview-empty">
                    Todas las planificaciones se crearán como borrador.
                </p>
            </div>
        `;

        preview.style.display = 'block';

    }


    function mensajeError(message) {
        return `
            <div class="pi-preview-box error">
                <h5>Error</h5>
                <p>${escapeHtml(message)}</p>
            </div>
        `;
    }


    function mensajeExito(result) {

        const data = result.data || {};

        let filas = '';

        if (data.planificaciones !== undefined) {
            filas += stat('Planificaciones', data.planificaciones);
        }

        if (data.actividades !== undefined) {
            filas += stat('Actividades', data.actividades);
        }

        if (data.subactividades !== undefined) {
            filas += stat('Subactividades', data.subactividades);
        }

        let detalle = '';

        if (Array.isArray(data.detalle) && data.detalle.length) {

            detalle = `
                <ul class="pi-preview-list">
                    ${data.detalle.map(item => `
                        <li>
                            #${escapeHtml(item.id)} -
                            ${escapeHtml(item.titulo)}
                            ${item.es_plantilla ? '(plantilla)' : ''}
                            · ${escapeHtml(item.actividades)} actividades
                            · ${escapeHtml(item.subactividades)} subactividades
                        </li>
                    `).join('')}
                </ul>
            `;

        }

        return `
            <div class="pi-preview-box success">
                <h5>Importación completada</h5>
                <p>${escapeHtml(
                    result.message ||
                    'Importación realizada correctamente.'
                )}</p>
                <div class="pi-preview-stats">${filas}</div>
                ${detalle}
            </div>
        `;

    }


    function stat(label, valor) {
        return `
            <div class="pi-preview-stat">
                <span class="pi-preview-stat-value">${escapeHtml(valor)}</span>
                <span class="pi-preview-stat-label">${escapeHtml(label)}</span>
            </div>
        `;
    }


    /*
    |--------------------------------------------------------------------------
    | Modal de formato JSON
    |--------------------------------------------------------------------------
    */

    formatBtn.addEventListener('click', () => {
        actualizarFormato();
        formatModal.style.display = 'flex';
        document.body.classList.add('pi-modal-open');
    });

    function cerrarModal() {
        formatModal.style.display = 'none';
        document.body.classList.remove('pi-modal-open');
    }

    closeFormatModal.addEventListener('click', cerrarModal);
    closeFormatModalFooter.addEventListener('click', cerrarModal);

    formatModal.addEventListener('click', (event) => {
        if (event.target === formatModal) {
            cerrarModal();
        }
    });

    formatTypeSelect.addEventListener('change', actualizarFormato);
    formatAliases.addEventListener('change', actualizarFormato);

    function actualizarFormato() {
        formatPreview.textContent =
            JSON.stringify(
                construirFormato(
                    formatTypeSelect.value,
                    formatAliases.checked
                ),
                null,
                4
            );

        formatFeedback.textContent = '';
        formatFeedback.className = 'pi-copy-feedback';
    }


    function construirFormato(tipo, aliases) {

        const actividadEjemplo = () => ({
            ambito: 'Ámbito de la actividad',
            destreza: 'Destreza',
            estrategias_metologicas: 'Estrategias metodológicas',
            recursos: 'Recursos',
            indicadores_logro: 'Indicadores de logro',
            subactividades: [
                subactividadEjemplo()
            ]
        });

        const subactividadEjemplo = () => ({
            destreza: 'Destreza de la subactividad',
            estrategias_metologicas: 'Estrategias metodológicas',
            recursos: 'Recursos',
            indicadores_logro: 'Indicadores de logro'
        });

        const campos = () => aliases
            ? {
                '1_experiencia_prendizaje':
                    'Nombre de la experiencia de aprendizaje',
                '2_descripcion_general_experiencia':
                    'Descripción general',
                '3_nombre_maestra': 'Nombre de la maestra',
                '4_tiempo_estimado': 'Tiempo estimado',
                '5_fecha': '2026-11-23',
                '6_nivel_educativo': 'Nivel educativo',
                '7_objetivo_aprendizaje': 'Objetivo de aprendizaje',
                '8_elemento_integrador': 'Elemento integrador',
                '9_nocion_dia': 'Noción del día'
            }
            : {
                experiencia_aprendizaje:
                    'Nombre de la experiencia de aprendizaje',
                descripcion_general_experiencia:
                    'Descripción general',
                nombre_maestra: 'Nombre de la maestra',
                tiempo_estimado: 'Tiempo estimado',
                fecha: '2026-11-23',
                nivel_educativo: 'Nivel educativo',
                objetivo_aprendizaje: 'Objetivo de aprendizaje',
                elemento_integrador: 'Elemento integrador',
                nocion_dia: 'Noción del día'
            };

        const planificacionEjemplo = () => ({
            planificacion: {
                ...campos(),
                tamano_letra_actividades: 8,
                es_plantilla: false
            },
            part1: [actividadEjemplo()],
            part2: []
        });

        switch (tipo) {

            case 'multiple':
                return {
                    planificaciones: [
                        planificacionEjemplo(),
                        planificacionEjemplo()
                    ]
                };

            case 'actividades':
                return {
                    part1: [actividadEjemplo()],
                    part2: []
                };

            case 'subactividades':
                return {
                    subactividades: [subactividadEjemplo()]
                };

            case 'complete':
            default:
                return planificacionEjemplo();

        }

    }


    copyFormatBtn.addEventListener('click', async () => {

        try {

            await navigator.clipboard.writeText(
                formatPreview.textContent
            );

            formatFeedback.textContent =
                'JSON copiado al portapapeles.';
            formatFeedback.className =
                'pi-copy-feedback success';

        } catch (error) {

            formatFeedback.textContent =
                'No se pudo copiar. Selecciona el texto manualmente.';
            formatFeedback.className =
                'pi-copy-feedback error';

        }

    });


    /*
    |--------------------------------------------------------------------------
    | Modal de prompt para IA (foto -> JSON)
    |--------------------------------------------------------------------------
    */

    promptBtn.addEventListener('click', () => {

        promptTypeSelect.value =
            importType || 'complete';

        promptAliases.checked =
            formatAliases.checked;

        actualizarPrompt();

        promptModal.style.display = 'flex';
        document.body.classList.add('pi-modal-open');

    });

    function cerrarPromptModal() {
        promptModal.style.display = 'none';
        document.body.classList.remove('pi-modal-open');
    }

    closePromptModal.addEventListener(
        'click',
        cerrarPromptModal
    );

    closePromptModalFooter.addEventListener(
        'click',
        cerrarPromptModal
    );

    promptModal.addEventListener('click', (event) => {
        if (event.target === promptModal) {
            cerrarPromptModal();
        }
    });

    promptTypeSelect.addEventListener(
        'change',
        actualizarPrompt
    );

    promptAliases.addEventListener(
        'change',
        actualizarPrompt
    );

    function actualizarPrompt() {

        promptText.value = construirPrompt(
            promptTypeSelect.value,
            promptAliases.checked
        );

        promptFeedback.textContent = '';
        promptFeedback.className = 'pi-copy-feedback';

    }


    function construirPrompt(tipo, aliases) {

        const esquema = JSON.stringify(
            construirFormato(tipo, aliases),
            null,
            4
        );

        const claves = aliases
            ? {
                experiencia_aprendizaje:
                    '1_experiencia_prendizaje',
                descripcion_general_experiencia:
                    '2_descripcion_general_experiencia',
                nombre_maestra:
                    '3_nombre_maestra',
                tiempo_estimado:
                    '4_tiempo_estimado',
                fecha:
                    '5_fecha',
                nivel_educativo:
                    '6_nivel_educativo',
                objetivo_aprendizaje:
                    '7_objetivo_aprendizaje',
                elemento_integrador:
                    '8_elemento_integrador',
                nocion_dia:
                    '9_nocion_dia',
            }
            : {
                experiencia_aprendizaje:
                    'experiencia_aprendizaje',
                descripcion_general_experiencia:
                    'descripcion_general_experiencia',
                nombre_maestra:
                    'nombre_maestra',
                tiempo_estimado:
                    'tiempo_estimado',
                fecha:
                    'fecha',
                nivel_educativo:
                    'nivel_educativo',
                objetivo_aprendizaje:
                    'objetivo_aprendizaje',
                elemento_integrador:
                    'elemento_integrador',
                nocion_dia:
                    'nocion_dia',
            };

        const k = (campo) => claves[campo];

        const lineas = [
            'Eres un asistente especializado en transcribir planificaciones de clases de educación inicial a partir de una imagen.',
            '',
            'TAREA',
            'Analiza la fotografía que te adjunto: es una tabla de planificación de clases. Extrae TODA la información visible y devuélvela como un único objeto JSON con la estructura exacta que se indica más abajo.',
            '',
            'CÓMO MAPEAR LA TABLA',
            `- Experiencia de aprendizaje / Experiencia → ${k('experiencia_aprendizaje')}`,
            `- Descripción general de la experiencia → ${k('descripcion_general_experiencia')}`,
            `- Nombre de la maestra → ${k('nombre_maestra')}`,
            `- Tiempo estimado → ${k('tiempo_estimado')}`,
            `- Fecha → ${k('fecha')} (formato AAAA-MM-DD)`,
            `- Nivel educativo → ${k('nivel_educativo')}`,
            `- Objetivo de aprendizaje → ${k('objetivo_aprendizaje')}`,
            `- Elemento integrador → ${k('elemento_integrador')}`,
            `- Noción del día → ${k('nocion_dia')}`,
            '- Actividades ANTES de la fila verde "Snack – momento de recreación" → part1',
            '- Actividades DESPUÉS de esa fila verde → part2',
            '- NO incluyas la fila Snack en el JSON: el documento Word la genera automáticamente',
            '- Cada actividad: Ámbito, Destreza, Estrategias metodológicas, Recursos e Indicadores de logro → ambito, destreza, estrategias_metologicas, recursos, indicadores_logro',
            '- Las filas o subniveles de cada actividad → subactividades (mismos campos, sin "ambito")',
            '- Es plantilla → es_plantilla (true solo si la tabla lo indica explícitamente)',
            '- Tamaño de letra → tamano_letra_actividades (por defecto 8)',
            '',
            'REGLAS DE FORMATO DEL TEXTO (RESPÉTALAS LITERALMENTE EN LOS VALORES DEL JSON)',
            '1. Negrita: un asterisco a cada lado: *palabra* o *frase*. Ejemplo: *Trabajo colaborativo*.',
            '2. Cursiva: dos asteriscos a cada lado: **palabra** o **frase**. Ejemplo: **observación dirigida**.',
            '3. Listas: cada elemento empieza con "+" y un espacio al inicio de la línea. Ejemplo: + Materiales didácticos. No uses "-", "•" ni números para las listas.',
            '4. Saltos de línea: usa "/n" (barra + n) o un salto de línea real dentro del texto. Ejemplo: "Primera línea/nSegunda línea".',
            '5. Conserva exactamente los marcadores *, **, + y /n que aparezcan en la foto. No los elimines, no los conviertas a HTML, Markdown ni a otros símbolos, y no inventes negritas, cursivas ni listas donde la foto no las muestre.',
            '6. Conserva tildes, mayúsculas, puntuación y el idioma español del original.',
            '7. Si un campo no es visible o no se puede leer, deja la cadena vacía "" (o [] en part1, part2 y subactividades). Nunca inventes datos.',
            '8. No agregues campos que no estén en el esquema. No incluyas ids, user_id, estado ni progreso.',
            '9. No incluyas la fila "Snack – momento de recreación" (10:00 a 10:55): el Word la agrega automáticamente. Las actividades anteriores van en part1 y las posteriores en part2.',
            '10. Conserva las comillas dobles que aparezcan en los valores del encabezado, por ejemplo "MI FAMILIA ES LA MEJOR".',
            '',
            'ESTRUCTURA JSON EXACTA',
            'Los valores de ejemplo son solo ilustrativos: reemplázalos por la información real de la imagen.',
            '',
            '```json',
            esquema,
            '```',
            '',
            'ENTREGA',
            'Devuelve únicamente el JSON dentro de un bloque de código json. No escribas explicaciones, saludos ni texto adicional fuera del bloque.',
        ];

        return lineas.join('\n');

    }


    copyPromptBtn.addEventListener('click', async () => {

        try {

            await navigator.clipboard.writeText(
                promptText.value
            );

            promptFeedback.textContent =
                'Prompt copiado al portapapeles.';
            promptFeedback.className =
                'pi-copy-feedback success';

        } catch (error) {

            promptFeedback.textContent =
                'No se pudo copiar. Selecciona el texto manualmente.';
            promptFeedback.className =
                'pi-copy-feedback error';

        }

    });


    /*
    |--------------------------------------------------------------------------
    | Utilidades
    |--------------------------------------------------------------------------
    */

    async function parseJsonResponse(response) {

        const contentType =
            response.headers.get('content-type') || '';

        if (!contentType.includes('application/json')) {
            await response.text();
            throw new Error(
                `El servidor devolvió una respuesta no válida. Código HTTP: ${response.status}`
            );
        }

        return await response.json();

    }


    function getCsrfToken() {

        const token =
            document.querySelector(
                'meta[name="csrf-token"]'
            );

        if (!token) {
            throw new Error(
                'No se encontró el token CSRF.'
            );
        }

        return token.getAttribute('content');

    }


    function escapeHtml(value) {

        const div =
            document.createElement('div');

        div.textContent = value ?? '';

        return div.innerHTML;

    }

});
