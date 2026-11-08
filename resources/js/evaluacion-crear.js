document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('evaluacionForm');
    const areasContainer = document.getElementById('areasContainer');
    const btnAgregarArea = document.getElementById('btnAgregarArea');
    const areasJson = document.getElementById('areasJson');
    const btnImportarReemplazar = document.getElementById('btnImportarReemplazar');
    const btnImportarAgregar = document.getElementById('btnImportarAgregar');
    const btnBorrarAreas = document.getElementById('btnBorrarAreas');
    const areasImportMessage = document.getElementById('areasImportMessage');
    const btnToggleImportarJson =
        document.getElementById('btnToggleImportarJson');
    const panelImportarJson = document.getElementById('panelImportarJson');
    const importToggleIcon = document.getElementById('importToggleIcon');
    const proyectoInput = document.getElementById('proyecto');
    const btnGenerarPromptIa = document.getElementById('btnGenerarPromptIa');
    const promptIaModal = document.getElementById('promptIaModal');
    const promptIaTexto = document.getElementById('promptIaTexto');
    const btnCopiarPromptIa = document.getElementById('btnCopiarPromptIa');
    const btnCerrarPromptIa = document.getElementById('btnCerrarPromptIa');
    const btnCerrarPromptIaFooter =
        document.getElementById('btnCerrarPromptIaFooter');
    const promptIaMessage = document.getElementById('promptIaMessage');

    const temasIaModal = document.getElementById('temasIaModal');
    const temasIaInput = document.getElementById('temasIaInput');
    const btnAceptarTemasIa = document.getElementById('btnAceptarTemasIa');
    const btnCerrarTemasIa = document.getElementById('btnCerrarTemasIa');
    const btnCerrarTemasIaFooter =
        document.getElementById('btnCerrarTemasIaFooter');
    const temasIaMessage = document.getElementById('temasIaMessage');

    const limiteSubareasMin =
        document.getElementById('limiteSubareasMin');
    const limiteSubareasMax =
        document.getElementById('limiteSubareasMax');
    const limitePalabrasMin =
        document.getElementById('limitePalabrasMin');
    const limitePalabrasMax =
        document.getElementById('limitePalabrasMax');

    const LIMITES_PROMPT_DEFECTO = {
        subareasMin: 3,
        subareasMax: 6,
        palabrasMin: 5,
        palabrasMax: 15,
    };

    if (!form || !areasContainer || !btnAgregarArea) {
        return;
    }

    const areasIniciales = document.getElementById('areasIniciales');
    let datosIniciales = [];

    if (areasIniciales) {
        try {
            datosIniciales = JSON.parse(areasIniciales.textContent);
        } catch (error) {
            datosIniciales = [];
        }
    }


    function crearSubarea(valor = '', id = null, tieneResultados = false) {

        const fila = document.createElement('div');
        fila.className = 'evaluacion-subarea';
        fila.dataset.subarea = '';
        fila.dataset.tieneResultados = tieneResultados ? '1' : '0';

        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.dataset.subareaId = '';
        idInput.value = id !== null && id !== undefined ? String(id) : '';

        const campo = document.createElement('div');
        campo.className = 'evaluacion-subarea-campo';

        const label = document.createElement('label');
        label.textContent = 'Subárea';

        const input = document.createElement('input');
        input.type = 'text';
        input.dataset.subareaNombre = '';
        input.placeholder = 'Ej. Comprensión oral';
        input.value = valor;
        input.required = true;
        input.maxLength = 255;

        campo.appendChild(label);
        campo.appendChild(input);

        const eliminar = document.createElement('button');
        eliminar.type = 'button';
        eliminar.className = 'evaluacion-btn-remove';
        eliminar.dataset.eliminarSubarea = '';
        eliminar.title = 'Eliminar subárea';
        eliminar.textContent = '×';

        fila.appendChild(idInput);
        fila.appendChild(campo);
        fila.appendChild(eliminar);

        return fila;
    }


    function crearArea(nombre = '', subareasIniciales = [], id = null) {

        const bloque = document.createElement('div');
        bloque.className = 'evaluacion-area';
        bloque.dataset.area = '';

        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.dataset.areaId = '';
        idInput.value = id !== null && id !== undefined ? String(id) : '';

        const header = document.createElement('div');
        header.className = 'evaluacion-area-header';

        const label = document.createElement('label');
        label.textContent = 'Área';

        const input = document.createElement('input');
        input.type = 'text';
        input.dataset.areaNombre = '';
        input.placeholder = 'Ej. Lenguaje';
        input.value = nombre;
        input.required = true;
        input.maxLength = 255;

        const eliminar = document.createElement('button');
        eliminar.type = 'button';
        eliminar.className = 'evaluacion-btn-remove';
        eliminar.dataset.eliminarArea = '';
        eliminar.title = 'Eliminar área';
        eliminar.textContent = '×';

        header.appendChild(label);
        header.appendChild(input);
        header.appendChild(eliminar);

        const subareas = document.createElement('div');
        subareas.className = 'evaluacion-subareas';
        subareas.dataset.subareas = '';

        const agregarSubarea = document.createElement('button');
        agregarSubarea.type = 'button';
        agregarSubarea.className = 'evaluacion-btn-add-subarea';
        agregarSubarea.dataset.agregarSubarea = '';
        agregarSubarea.textContent = '+ Agregar subárea';

        bloque.appendChild(idInput);
        bloque.appendChild(header);
        bloque.appendChild(subareas);
        bloque.appendChild(agregarSubarea);

        const subareasInicialesLista = Array.isArray(subareasIniciales)
            ? subareasIniciales
            : [];

        if (subareasInicialesLista.length > 0) {
            subareasInicialesLista.forEach(function (subarea) {
                const nombreSubarea = typeof subarea === 'string'
                    ? subarea
                    : (subarea && typeof subarea.nombre === 'string'
                        ? subarea.nombre
                        : '');

                const idSubarea = subarea && typeof subarea === 'object'
                    && subarea.id !== undefined && subarea.id !== null
                    ? subarea.id
                    : null;

                const tieneResultados = subarea && typeof subarea === 'object'
                    && (
                        subarea.tiene_resultados === true
                        || subarea.tiene_resultados === 1
                        || subarea.tiene_resultados === '1'
                    );

                subareas.appendChild(
                    crearSubarea(nombreSubarea, idSubarea, tieneResultados)
                );
            });
        } else {
            subareas.appendChild(crearSubarea());
        }

        return bloque;
    }


    function reindexar() {

        areasContainer
            .querySelectorAll('[data-area]')
            .forEach(function (area, indiceArea) {

                const areaIdInput =
                    area.querySelector('[data-area-id]');

                if (areaIdInput) {
                    areaIdInput.name =
                        'areas[' + indiceArea + '][id]';
                }

                const areaInput =
                    area.querySelector('[data-area-nombre]');

                if (areaInput) {
                    areaInput.name =
                        'areas[' + indiceArea + '][nombre]';
                }

                area
                    .querySelectorAll('[data-subarea]')
                    .forEach(function (subarea, indiceSubarea) {

                        const subareaIdInput =
                            subarea.querySelector('[data-subarea-id]');

                        if (subareaIdInput) {
                            subareaIdInput.name =
                                'areas[' + indiceArea + ']' +
                                '[subareas][' + indiceSubarea + '][id]';
                        }

                        const subareaInput =
                            subarea.querySelector('[data-subarea-nombre]');

                        if (subareaInput) {
                            subareaInput.name =
                                'areas[' + indiceArea + ']' +
                                '[subareas][' + indiceSubarea + '][nombre]';
                        }
                    });
            });
    }


    function agregarArea() {

        areasContainer.appendChild(crearArea());
        reindexar();

        const areas = areasContainer.querySelectorAll('[data-area]');
        const ultima = areas[areas.length - 1];

        if (ultima) {
            const input = ultima.querySelector('[data-area-nombre]');

            if (input) {
                input.focus();
            }
        }
    }


    function mostrarMensajeImportacion(texto, tipo) {

        if (!areasImportMessage) {
            return;
        }

        areasImportMessage.textContent = texto;
        areasImportMessage.className =
            'evaluacion-import-message evaluacion-import-message-' +
            (tipo || 'info');
        areasImportMessage.hidden = false;
    }


    function ocultarMensajeImportacion() {

        if (!areasImportMessage) {
            return;
        }

        areasImportMessage.textContent = '';
        areasImportMessage.className = 'evaluacion-import-message';
        areasImportMessage.hidden = true;
    }


    function normalizarAreasImportadas(datos) {

        if (!Array.isArray(datos) && datos && Array.isArray(datos.areas)) {
            datos = datos.areas;
        }

        if (!Array.isArray(datos)) {
            throw new Error(
                'El JSON debe ser un array de áreas o un objeto con la clave "areas".'
            );
        }

        if (datos.length === 0) {
            throw new Error('El JSON no contiene áreas para importar.');
        }

        return datos.map(function (area, indiceArea) {

            const numeroArea = indiceArea + 1;

            const nombreArea = typeof area === 'string'
                ? area.trim()
                : (area && typeof area.nombre === 'string'
                    ? area.nombre.trim()
                    : '');

            if (nombreArea === '') {
                throw new Error(
                    'El área #' + numeroArea + ' no tiene un nombre válido.'
                );
            }

            if (nombreArea.length > 255) {
                throw new Error(
                    'El nombre del área #' + numeroArea +
                    ' supera los 255 caracteres.'
                );
            }

            let subareasBrutas = [];

            if (area && Array.isArray(area.subareas)) {
                subareasBrutas = area.subareas;
            } else if (area && Array.isArray(area.subAreas)) {
                subareasBrutas = area.subAreas;
            }

            if (subareasBrutas.length === 0) {
                throw new Error(
                    'El área "' + nombreArea +
                    '" debe tener al menos una subárea.'
                );
            }

            const subareas = subareasBrutas.map(function (
                subarea,
                indiceSubarea
            ) {

                const numeroSubarea = indiceSubarea + 1;

                const nombreSubarea = typeof subarea === 'string'
                    ? subarea.trim()
                    : (subarea && typeof subarea.nombre === 'string'
                        ? subarea.nombre.trim()
                        : '');

                if (nombreSubarea === '') {
                    throw new Error(
                        'La subárea #' + numeroSubarea + ' del área "' +
                        nombreArea + '" no tiene un nombre válido.'
                    );
                }

                if (nombreSubarea.length > 255) {
                    throw new Error(
                        'El nombre de la subárea #' + numeroSubarea +
                        ' del área "' + nombreArea +
                        '" supera los 255 caracteres.'
                    );
                }

                return nombreSubarea;
            });

            return {
                nombre: nombreArea,
                subareas: subareas,
            };
        });
    }


    function leerAreasJson() {

        if (!areasJson) {
            throw new Error('No se encontró el campo JSON.');
        }

        const texto = areasJson.value.trim();

        if (texto === '') {
            throw new Error('Pega un JSON antes de importar.');
        }

        let datos;

        try {
            datos = JSON.parse(texto);
        } catch (error) {
            throw new Error('El JSON no es válido: ' + error.message);
        }

        return normalizarAreasImportadas(datos);
    }


    function agregarAreasAlFormulario(areas) {

        areas.forEach(function (area) {
            areasContainer.appendChild(
                crearArea(area.nombre, area.subareas, area.id ?? null)
            );
        });

        reindexar();
    }


    function limpiarAreasVacias() {

        areasContainer
            .querySelectorAll('[data-area]')
            .forEach(function (area) {

                const inputNombre =
                    area.querySelector('[data-area-nombre]');

                const tieneNombre = inputNombre
                    ? inputNombre.value.trim() !== ''
                    : false;

                const tieneSubareas = Array
                    .from(area.querySelectorAll('[data-subarea-nombre]'))
                    .some(function (input) {
                        return input.value.trim() !== '';
                    });

                if (!tieneNombre && !tieneSubareas) {
                    area.remove();
                }
            });
    }


    function manejarImportacion(reemplazar) {

        try {
            const areas = leerAreasJson();

            if (reemplazar) {
                const hayPuntuadas = areasContainer.querySelector(
                    '[data-subarea][data-tiene-resultados="1"]'
                );

                if (hayPuntuadas && !window.confirm(
                    'Al reemplazar las áreas se eliminarán las subáreas actuales y también sus puntuaciones registradas. ¿Continuar?'
                )) {
                    return;
                }

                areasContainer.innerHTML = '';
            } else {
                limpiarAreasVacias();
            }

            agregarAreasAlFormulario(areas);

            const totalSubareas = areas.reduce(function (total, area) {
                return total + area.subareas.length;
            }, 0);

            mostrarMensajeImportacion(
                'Se ' + (reemplazar ? 'reemplazaron' : 'agregaron') +
                ' ' + areas.length + ' área(s) y ' +
                totalSubareas + ' subárea(s).',
                'success'
            );

            if (areasJson) {
                areasJson.value = '';
            }
        } catch (error) {
            mostrarMensajeImportacion(error.message, 'error');
        }
    }


    function borrarTodasLasAreas() {

        const total = areasContainer.querySelectorAll('[data-area]').length;

        if (total === 0) {
            mostrarMensajeImportacion(
                'No hay áreas para borrar.',
                'info'
            );

            return;
        }

        const hayPuntuadas = areasContainer.querySelector(
            '[data-subarea][data-tiene-resultados="1"]'
        );

        const mensaje = hayPuntuadas
            ? '¿Borrar todas las áreas y subáreas? También se eliminarán las puntuaciones de las subáreas ya puntuadas.'
            : '¿Borrar todas las áreas y subáreas?';

        if (!window.confirm(mensaje)) {
            return;
        }

        areasContainer.innerHTML = '';
        reindexar();

        mostrarMensajeImportacion(
            'Se borraron todas las áreas y subáreas.',
            'success'
        );
    }


    btnAgregarArea.addEventListener('click', agregarArea);

    if (btnImportarReemplazar) {
        btnImportarReemplazar.addEventListener('click', function () {
            manejarImportacion(true);
        });
    }

    if (btnImportarAgregar) {
        btnImportarAgregar.addEventListener('click', function () {
            manejarImportacion(false);
        });
    }

    if (btnBorrarAreas) {
        btnBorrarAreas.addEventListener('click', borrarTodasLasAreas);
    }

    if (areasJson) {
        areasJson.addEventListener('input', ocultarMensajeImportacion);
    }

    if (btnToggleImportarJson && panelImportarJson) {

        btnToggleImportarJson.addEventListener('click', function () {

            const abierto = !panelImportarJson.hidden;

            panelImportarJson.hidden = abierto;
            btnToggleImportarJson.setAttribute(
                'aria-expanded',
                String(!abierto)
            );

            if (importToggleIcon) {
                importToggleIcon.classList.toggle(
                    'evaluacion-import-toggle-icon-open',
                    !abierto
                );
            }

            if (abierto) {
                ocultarMensajeImportacion();
            }
        });
    }


    areasContainer.addEventListener('click', function (event) {

        const botonEliminarArea =
            event.target.closest('[data-eliminar-area]');

        if (botonEliminarArea) {

            const areas = areasContainer.querySelectorAll('[data-area]');

            if (areas.length <= 1) {
                alert('Debe haber al menos un área.');
                return;
            }

            const bloque = botonEliminarArea.closest('[data-area]');

            if (bloque) {
                bloque.remove();
            }

            reindexar();

            return;
        }


        const botonAgregarSubarea =
            event.target.closest('[data-agregar-subarea]');

        if (botonAgregarSubarea) {

            const bloque = botonAgregarSubarea.closest('[data-area]');
            const subareas = bloque
                ? bloque.querySelector('[data-subareas]')
                : null;

            if (subareas) {
                const nueva = crearSubarea();
                subareas.appendChild(nueva);

                reindexar();

                const input = nueva.querySelector('[data-subarea-nombre]');

                if (input) {
                    input.focus();
                }
            }

            return;
        }


        const botonEliminarSubarea =
            event.target.closest('[data-eliminar-subarea]');

        if (botonEliminarSubarea) {

            const fila = botonEliminarSubarea.closest('[data-subarea]');

            if (!fila) {
                return;
            }

            const contenedor = fila.parentElement;
            const totalSubareas = contenedor
                ? contenedor.querySelectorAll('[data-subarea]').length
                : 0;

            if (totalSubareas <= 1) {
                alert('Debe haber al menos una subárea.');
                return;
            }

            if (fila.dataset.tieneResultados === '1' && !window.confirm(
                'Esta subárea ya tiene puntuaciones registradas. Si la eliminas, también se eliminarán sus puntuaciones. ¿Continuar?'
            )) {
                return;
            }

            fila.remove();

            reindexar();
        }
    });


    // ============================================================
    // PROMPT PARA IA (temas -> generar prompt -> copiar)
    // ============================================================

    const EJEMPLO_PROMPT = `[
  {
    "nombre": "Proyecto: “MI FAMILIA ES LA MEJOR”",
    "subareas": [
      "Escucha con atención la dramatización de la familia",
      "Reconoce las funciones que cumple los miembros de la familia dentro del hogar",
      "Identifica y nombra a los miembros de su familia",
      "Participa en la actividad de \"CAJA DE LOS RECUERDOS\"",
      "Se integra en la exposición de las dependencias del hogar",
      "Realiza el distintivo y reconoce los peligros del hogar"
    ]
  },
  {
    "nombre": "Identidad y autonomía",
    "subareas": [
      "Comunica sus nombres, edad y algunos datos sobre su familia y el lugar donde vive.",
      "Reconoce que pertenece a una familia y que es importante para ella.",
      "Reconoce peligros de su entorno y sabe cómo evitarlos."
    ]
  },
  {
    "nombre": "Convivencia",
    "subareas": [
      "Respeta las diferencias entre sus compañeros.",
      "Reconoce los trabajos y profesiones de su familia.",
      "Participa y colabora en actividades con niños y adultos.",
      "Cumple normas sencillas de convivencia en casa y en el centro infantil."
    ]
  },
  {
    "nombre": "Relaciones con el medio natural y cultural",
    "subareas": [
      "Reconoce características y cambios de las personas de su familia.",
      "Practica acciones para cuidar y proteger su entorno.",
      "Reconoce algunas costumbres y tradiciones de su familia y comunidad.",
      "Reconoce peligros en casa y propone cómo evitarlos."
    ]
  },
  {
    "nombre": "Relaciones lógico-matemáticas",
    "subareas": [
      "Ordena hasta cinco imágenes siguiendo una secuencia.",
      "Reconoce acciones que suceden antes, ahora y después.",
      "Ubica objetos usando nociones como entre, adelante, atrás, junto, cerca y lejos.",
      "Compara objetos por su forma, color y tamaño."
    ]
  },
  {
    "nombre": "Comprensión y expresión del lenguaje",
    "subareas": [
      "Usa palabras nuevas al hablar sobre sus experiencias.",
      "Participa en conversaciones y habla sobre el tema.",
      "Describe imágenes usando oraciones sencillas.",
      "Repite trabalenguas, adivinanzas, canciones y poemas cortos."
    ]
  },
  {
    "nombre": "Expresión artística",
    "subareas": [
      "Participa en dramatizaciones representando personajes.",
      "Realiza trabajos creativos con diferentes materiales.",
      "Expresa sus experiencias mediante dibujos.",
      "Participa en juegos, rondas y actividades musicales."
    ]
  },
  {
    "nombre": "Expresión corporal y motricidad",
    "subareas": [
      "Mantiene el equilibrio al realizar diferentes movimientos.",
      "Se desplaza siguiendo instrucciones y diferentes ritmos.",
      "Reconoce y señala las partes de su cuerpo.",
      "Coordina manos y dedos al recortar, pegar, modelar y realizar pinza."
    ]
  }
]`;

    function abrirModal(modal) {
        if (!modal) {
            return;
        }
        modal.hidden = false;
        document.body.classList.add('evaluacion-modal-open');
    }

    function cerrarModal(modal) {
        if (!modal) {
            return;
        }
        modal.hidden = true;
        document.body.classList.remove('evaluacion-modal-open');
    }

    function mostrarMensajeTemas(texto, tipo) {
        if (!temasIaMessage) {
            return;
        }
        temasIaMessage.textContent = texto;
        temasIaMessage.className =
            'evaluacion-import-message evaluacion-import-message-' +
            (tipo || 'info');
        temasIaMessage.hidden = false;
    }

    function ocultarMensajeTemas() {
        if (!temasIaMessage) {
            return;
        }
        temasIaMessage.textContent = '';
        temasIaMessage.className = 'evaluacion-import-message';
        temasIaMessage.hidden = true;
    }

    function generarPrompt(nombreProyecto, temas, limites) {
        const temasLista = temas
            .split(',')
            .map(function (t) {
                return t.trim();
            })
            .filter(function (t) {
                return t !== '';
            });

        const temasTexto = temasLista.length > 0
            ? temasLista.join(', ')
            : '(no se indicaron temas)';

        return (
            'Eres un asistente especializado en planeación educativa para educación inicial.\n' +
            '\n' +
            'A continuación tienes un ejemplo de estructura JSON con áreas y subáreas de una evaluación:\n' +
            '\n' +
            EJEMPLO_PROMPT +
            '\n' +
            '\n' +
            'Con base en este ejemplo, el nombre del proyecto "' +
            nombreProyecto +
            '" y los siguientes temas: ' +
            temasTexto +
            ', genera un nuevo arreglo JSON con las mismas áreas. La primera área debe llamarse "Proyecto: “' +
            nombreProyecto +
            '”" y sus subáreas deben redactarse acorde al nombre del proyecto y a los temas indicados. Acomoda las subáreas de las demás áreas al nombre del proyecto y a los temas. Cada área debe tener un mínimo de ' +
            limites.subareasMin +
            ' y un máximo de ' +
            limites.subareasMax +
            ' subáreas. Cada subárea debe redactarse con un mínimo de ' +
            limites.palabrasMin +
            ' y un máximo de ' +
            limites.palabrasMax +
            ' palabras.\n' +
            '\n' +
            'Devuelve el resultado en un bloque de código (formato código), listo para copiar y pegar:\n' +
            '\n' +
            '```json\n' +
            '[ ...el arreglo JSON... ]\n' +
            '```\n' +
            '\n' +
            'No incluyas texto adicional ni explicaciones fuera del bloque de código.'
        );
    }

    function leerEnteroLimitado(input, defecto) {
        if (! input) {
            return defecto;
        }

        const valor = parseInt(input.value, 10);

        if (! Number.isInteger(valor) || valor < 1) {
            return defecto;
        }

        return valor;
    }

    function leerLimitesPrompt() {
        const subareasMin = leerEnteroLimitado(
            limiteSubareasMin,
            LIMITES_PROMPT_DEFECTO.subareasMin
        );

        const subareasMax = leerEnteroLimitado(
            limiteSubareasMax,
            LIMITES_PROMPT_DEFECTO.subareasMax
        );

        const palabrasMin = leerEnteroLimitado(
            limitePalabrasMin,
            LIMITES_PROMPT_DEFECTO.palabrasMin
        );

        const palabrasMax = leerEnteroLimitado(
            limitePalabrasMax,
            LIMITES_PROMPT_DEFECTO.palabrasMax
        );

        if (subareasMin > subareasMax) {
            return {
                error: 'El mínimo de subáreas no puede ser mayor que el máximo.',
            };
        }

        if (palabrasMin > palabrasMax) {
            return {
                error: 'El mínimo de palabras no puede ser mayor que el máximo.',
            };
        }

        return {
            error: '',
            subareasMin: subareasMin,
            subareasMax: subareasMax,
            palabrasMin: palabrasMin,
            palabrasMax: palabrasMax,
        };
    }

    function copiarAlPortapapeles(texto) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(texto);
        }
        return Promise.resolve();
    }

    // Abrir modal de temas al hacer clic en "Generar prompt para IA"
    if (btnGenerarPromptIa) {
        btnGenerarPromptIa.addEventListener('click', function () {
            const proyectoInput = document.getElementById('proyecto');
            const nombreProyecto = proyectoInput
                ? proyectoInput.value.trim()
                : '';

            if (nombreProyecto === '') {
                if (areasImportMessage) {
                    areasImportMessage.textContent =
                        'Primero escribe el nombre del proyecto en el campo Proyecto.';
                    areasImportMessage.className =
                        'evaluacion-import-message evaluacion-import-message-error';
                    areasImportMessage.hidden = false;
                }
                return;
            }

            if (temasIaInput) {
                temasIaInput.value = '';
            }
            ocultarMensajeTemas();
            abrirModal(temasIaModal);

            if (temasIaInput) {
                temasIaInput.focus();
            }
        });
    }

    // Aceptar temas y generar prompt
    if (btnAceptarTemasIa) {
        btnAceptarTemasIa.addEventListener('click', function () {
            const proyectoInput = document.getElementById('proyecto');
            const nombreProyecto = proyectoInput
                ? proyectoInput.value.trim()
                : '';

            const temas = temasIaInput ? temasIaInput.value.trim() : '';

            if (nombreProyecto === '') {
                mostrarMensajeTemas(
                    'Primero escribe el nombre del proyecto.',
                    'error'
                );
                return;
            }

            if (temas === '') {
                mostrarMensajeTemas(
                    'Escribe al menos un tema.',
                    'error'
                );
                return;
            }

            const limites = leerLimitesPrompt();

            if (limites.error !== '') {
                mostrarMensajeTemas(
                    limites.error,
                    'error'
                );
                return;
            }

            const prompt = generarPrompt(nombreProyecto, temas, limites);

            if (promptIaTexto) {
                promptIaTexto.value = prompt;
            }

            ocultarMensajeTemas();
            cerrarModal(temasIaModal);
            abrirModal(promptIaModal);

            copiarAlPortapapeles(prompt).then(function () {
                if (promptIaMessage) {
                    promptIaMessage.textContent =
                        'Prompt generado y copiado al portapapeles.';
                    promptIaMessage.className =
                        'evaluacion-import-message evaluacion-import-message-success';
                    promptIaMessage.hidden = false;
                }
            });
        });
    }

    // Copiar prompt al portapapeles (modal de prompt)
    if (btnCopiarPromptIa) {
        btnCopiarPromptIa.addEventListener('click', function () {
            const texto = promptIaTexto ? promptIaTexto.value : '';
            if (texto === '') {
                return;
            }
            copiarAlPortapapeles(texto).then(function () {
                if (promptIaMessage) {
                    promptIaMessage.textContent = 'Prompt copiado al portapapeles.';
                    promptIaMessage.className =
                        'evaluacion-import-message evaluacion-import-message-success';
                    promptIaMessage.hidden = false;
                    setTimeout(function () {
                        promptIaMessage.hidden = true;
                    }, 2500);
                }
            });
        });
    }

    // Cerrar modal de temas (× y botón Cancelar)
    if (btnCerrarTemasIa) {
        btnCerrarTemasIa.addEventListener('click', function (event) {
            event.preventDefault();
            cerrarModal(temasIaModal);
        });
    }
    if (btnCerrarTemasIaFooter) {
        btnCerrarTemasIaFooter.addEventListener('click', function (event) {
            event.preventDefault();
            cerrarModal(temasIaModal);
        });
    }

    // Cerrar modal de prompt (× y botón Cerrar)
    if (btnCerrarPromptIa) {
        btnCerrarPromptIa.addEventListener('click', function (event) {
            event.preventDefault();
            cerrarModal(promptIaModal);
        });
    }
    if (btnCerrarPromptIaFooter) {
        btnCerrarPromptIaFooter.addEventListener('click', function (event) {
            event.preventDefault();
            cerrarModal(promptIaModal);
        });
    }

    // Cerrar cualquier modal abierto con la tecla ESC
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            if (!temasIaModal.hidden) {
                cerrarModal(temasIaModal);
            }
            if (!promptIaModal.hidden) {
                cerrarModal(promptIaModal);
            }
        }
    });

    form.addEventListener('submit', function () {
        reindexar();
    });


    if (Array.isArray(datosIniciales) && datosIniciales.length > 0) {
        datosIniciales.forEach(function (area) {
            areasContainer.appendChild(
                crearArea(
                    area && area.nombre ? area.nombre : '',
                    area && Array.isArray(area.subareas) ? area.subareas : [],
                    area && area.id !== undefined && area.id !== null
                        ? area.id
                        : null
                )
            );
        });

        reindexar();
    } else {
        agregarArea();
    }
});
