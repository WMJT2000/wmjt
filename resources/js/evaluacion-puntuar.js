const EJEMPLO_RECOMENDACION =
    'Hanna, eres una niña alegre, curiosa e inteligente, que demuestra ' +
    'conocer y comprender muchas cosas de su entorno. En el área del ' +
    'lenguaje, continuamos estimulando tu expresión verbal para que puedas ' +
    'comunicar tus ideas con mayor claridad. En el área cognitiva, ' +
    'seguiremos reforzando los colores, los números y las figuras mediante ' +
    'juegos. También fortaleceremos tu autonomía y motricidad fina con ' +
    'actividades cotidianas. En casita, recomendamos leer cuentos y cantar ' +
    'canciones. ¡Mi pequeña investigadora, sigue aprendiendo y creciendo ' +
    'cada día!';

document.addEventListener('DOMContentLoaded', () => {
    configurarRecomendaciones();
    configurarPromptRecomendacion();
    configurarPaginacionAreas();
    configurarObservaciones();
});

function configurarRecomendaciones() {
    const textarea = document.querySelector('[data-recomendaciones]');

    if (!textarea) {
        return;
    }

    const form = textarea.closest('form');

    if (!form) {
        return;
    }

    const aviso = form.querySelector('[data-recomendaciones-aviso]');

    const botonPrompt = form.querySelector('[data-prompt-requiere-puntaje]');

    const radios = Array.from(
        form.querySelectorAll(
            'input[type="radio"][name^="resultados["][name$="[valoracion]"]'
        )
    );

    const grupos = new Map();

    radios.forEach((radio) => {
        if (!grupos.has(radio.name)) {
            grupos.set(radio.name, []);
        }

        grupos.get(radio.name).push(radio);
    });

    const todasPuntuadas = () =>
        Array.from(grupos.values()).every((opciones) =>
            opciones.some((radio) => radio.checked)
        );

    const actualizar = () => {
        const completo = todasPuntuadas();

        textarea.disabled = !completo;

        if (botonPrompt) {
            botonPrompt.disabled = !completo;
        }

        if (aviso) {
            aviso.hidden = completo;
        }
    };

    form.addEventListener('change', (event) => {
        if (
            event.target instanceof HTMLInputElement &&
            event.target.type === 'radio' &&
            event.target.name.startsWith('resultados[')
        ) {
            actualizar();
        }
    });

    actualizar();
}

function configurarPaginacionAreas() {
    const paginas = Array.from(document.querySelectorAll('[data-area-pagina]'));

    if (paginas.length === 0) {
        return;
    }

    const contenedor = document.querySelector('[data-evaluacion-paginacion]');
    const btnAnterior = document.querySelector('[data-pagina-anterior]');
    const btnSiguiente = document.querySelector('[data-pagina-siguiente]');
    const numeros = document.querySelector('[data-pagina-numeros]');
    const info = document.querySelector('[data-pagina-info]');
    const mensaje = document.querySelector('[data-pagina-mensaje]');

    let actual = 0;

    const botonesNumero = [];

    const mostrarMensaje = (texto) => {
        if (!mensaje) {
            return;
        }

        mensaje.textContent = texto;
        mensaje.hidden = false;
    };

    const ocultarMensaje = () => {
        if (!mensaje) {
            return;
        }

        mensaje.textContent = '';
        mensaje.hidden = true;
    };

    const paginaIncompleta = (pagina) => {
        const grupos = new Map();

        pagina
            .querySelectorAll(
                'input[type="radio"][name$="[valoracion]"]'
            )
            .forEach((radio) => {
                if (!grupos.has(radio.name)) {
                    grupos.set(radio.name, []);
                }

                grupos.get(radio.name).push(radio);
            });

        return Array.from(grupos.values()).some(
            (opciones) => !opciones.some((radio) => radio.checked)
        );
    };

    const actualizarVista = () => {
        paginas.forEach((pagina, indice) => {
            pagina.hidden = indice !== actual;
        });

        if (btnAnterior) {
            btnAnterior.disabled = actual === 0;
        }

        if (btnSiguiente) {
            btnSiguiente.disabled = actual === paginas.length - 1;
        }

        if (info) {
            const nombre = paginas[actual].dataset.areaNombre || '';

            info.textContent =
                'Área ' +
                (actual + 1) +
                ' de ' +
                paginas.length +
                (nombre !== '' ? ' · ' + nombre : '');
        }

        botonesNumero.forEach((boton, indice) => {
            if (indice === actual) {
                boton.setAttribute('aria-current', 'page');
            } else {
                boton.removeAttribute('aria-current');
            }
        });
    };

    const irA = (indice, desplazar) => {
        const destino = Math.max(0, Math.min(indice, paginas.length - 1));

        if (destino > actual) {
            let bloqueo = -1;

            for (let i = actual; i < destino; i++) {
                if (paginaIncompleta(paginas[i])) {
                    bloqueo = i;

                    break;
                }
            }

            if (bloqueo >= 0) {
                actual = bloqueo;

                actualizarVista();

                mostrarMensaje(
                    'Primero valora todas las subáreas de esta área para poder pasar a la siguiente.'
                );

                return;
            }
        }

        ocultarMensaje();

        actual = destino;

        actualizarVista();

        if (desplazar && paginas[actual]) {
            paginas[actual].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    if (paginas.length === 1) {
        paginas[0].hidden = false;

        return;
    }

    if (contenedor) {
        contenedor.hidden = false;
    }

    if (numeros) {
        paginas.forEach((pagina, indice) => {
            const boton = document.createElement('button');

            boton.type = 'button';
            boton.className = 'evaluacion-pagina-numero';
            boton.textContent = String(indice + 1);
            boton.setAttribute(
                'aria-label',
                'Ir al área ' +
                    (indice + 1) +
                    ': ' +
                    (pagina.dataset.areaNombre || '')
            );

            boton.addEventListener('click', () => irA(indice, true));

            numeros.appendChild(boton);
            botonesNumero.push(boton);
        });
    }

    if (btnAnterior) {
        btnAnterior.addEventListener('click', () => irA(actual - 1, true));
    }

    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', () => irA(actual + 1, true));
    }

    document.addEventListener('change', (event) => {
        if (
            event.target instanceof HTMLInputElement &&
            event.target.type === 'radio' &&
            event.target.name.startsWith('resultados[')
        ) {
            ocultarMensaje();
        }
    });

    const primeraIncompleta = paginas.findIndex(paginaIncompleta);

    actual = primeraIncompleta >= 0 ? primeraIncompleta : 0;

    actualizarVista();
}


function configurarObservaciones() {
    document.querySelectorAll('[data-observacion-toggle]').forEach((boton) => {
        const bloque = boton.closest('.evaluacion-observacion');

        const contenedor = bloque?.querySelector(
            '[data-observacion-contenedor]'
        );

        const texto = boton.querySelector(
            '[data-observacion-toggle-texto]'
        );

        if (!contenedor || boton.dataset.configurado === 'true') {
            return;
        }

        boton.dataset.configurado = 'true';

        // Aplicar el estado inicial al cargar la página.
        if (contenedor.hasAttribute('hidden')) {
            contenedor.style.setProperty('display', 'none', 'important');
        } else {
            contenedor.style.removeProperty('display');
        }

        boton.addEventListener('click', () => {
            const mostrar =
                contenedor.style.display === 'none' ||
                contenedor.hasAttribute('hidden');

            if (mostrar) {
                // Mostrar el campo.
                contenedor.removeAttribute('hidden');
                contenedor.style.removeProperty('display');

                boton.setAttribute('aria-expanded', 'true');

                if (texto) {
                    texto.textContent = '− Ocultar observación';
                }

                contenedor.querySelector('input, textarea')?.focus();
            } else {
                // Ocultar el campo.
                contenedor.setAttribute('hidden', '');
                contenedor.style.setProperty('display', 'none', 'important');

                boton.setAttribute('aria-expanded', 'false');

                if (texto) {
                    texto.textContent = '+ Agregar observación';
                }
            }
        });
    });
}

function configurarPromptRecomendacion() {
    const modal = document.getElementById('recomendacionIaModal');

    if (!modal) {
        return;
    }

    const botonesAbrir = document.querySelectorAll(
        '[data-generar-prompt-recomendacion]'
    );
    const btnCerrar = document.getElementById('btnCerrarRecomendacionIa');
    const btnCerrarFooter = document.getElementById(
        'btnCerrarRecomendacionIaFooter'
    );
    const btnGenerar = document.getElementById(
        'btnGenerarRecomendacionPrompt'
    );
    const btnCopiar = document.getElementById(
        'btnCopiarRecomendacionPrompt'
    );
    const inputMinimo = document.getElementById('recomendacionPalabrasMin');
    const inputMaximo = document.getElementById('recomendacionPalabrasMax');
    const mensaje = document.getElementById('recomendacionIaMessage');
    const contenedor = document.getElementById('recomendacionPromptContenedor');
    const promptTexto = document.getElementById('recomendacionPromptTexto');

    const abrirModal = () => {
        modal.hidden = false;
        document.body.classList.add('evaluacion-modal-open');
    };

    const cerrarModal = () => {
        modal.hidden = true;
        document.body.classList.remove('evaluacion-modal-open');
    };

    const mostrarMensaje = (texto, tipo) => {
        if (!mensaje) {
            return;
        }

        mensaje.textContent = texto;
        mensaje.className =
            'evaluacion-import-message evaluacion-import-message-' +
            (tipo || 'info');
        mensaje.hidden = false;
    };

    const ocultarMensaje = () => {
        if (!mensaje) {
            return;
        }

        mensaje.textContent = '';
        mensaje.className = 'evaluacion-import-message';
        mensaje.hidden = true;
    };

    const reiniciar = () => {
        ocultarMensaje();

        if (contenedor) {
            contenedor.hidden = true;
        }

        if (promptTexto) {
            promptTexto.value = '';
        }

        if (btnCopiar) {
            btnCopiar.hidden = true;
        }
    };

    botonesAbrir.forEach((boton) => {
        boton.addEventListener('click', () => {
            reiniciar();
            abrirModal();
        });
    });

    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarModal);
    }

    if (btnCerrarFooter) {
        btnCerrarFooter.addEventListener('click', cerrarModal);
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                cerrarModal();
            }
        });
    }

    if (btnGenerar) {
        btnGenerar.addEventListener('click', () => {
            const minimo = inputMinimo
                ? parseInt(inputMinimo.value, 10)
                : 89;
            const maximo = inputMaximo
                ? parseInt(inputMaximo.value, 10)
                : 100;

            if (!Number.isInteger(minimo) || minimo < 1) {
                mostrarMensaje(
                    'El mínimo de palabras debe ser un número mayor a 0.',
                    'error'
                );
                return;
            }

            if (!Number.isInteger(maximo) || maximo < minimo) {
                mostrarMensaje(
                    'El máximo de palabras debe ser mayor o igual al mínimo.',
                    'error'
                );
                return;
            }

            const prompt = construirPromptRecomendacion(minimo, maximo);

            if (promptTexto) {
                promptTexto.value = prompt;
            }

            if (contenedor) {
                contenedor.hidden = false;
            }

            if (btnCopiar) {
                btnCopiar.hidden = false;
            }

            mostrarMensaje(
                'Prompt generado. Revísalo, cópialo y pégalo en tu IA.',
                'success'
            );

            if (promptTexto) {
                promptTexto.focus();
                promptTexto.setSelectionRange(0, 0);
                promptTexto.scrollTop = 0;
            }
        });
    }

    if (btnCopiar) {
        btnCopiar.addEventListener('click', () => {
            const texto = promptTexto ? promptTexto.value : '';

            if (texto.trim() === '') {
                mostrarMensaje('Primero genera el prompt.', 'error');
                return;
            }

            copiarAlPortapapeles(texto)
                .then(() => {
                    mostrarMensaje(
                        'Prompt copiado al portapapeles.',
                        'success'
                    );
                })
                .catch(() => {
                    mostrarMensaje(
                        'No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.',
                        'error'
                    );
                });
        });
    }
}

function construirPromptRecomendacion(minimo, maximo) {
    const datos = leerDatosEvaluacion();
    const resultados = recolectarResultados();
    const observaciones = leerValor('observaciones');
    const recomendaciones = leerValor('recomendaciones')
        || leerValor('recomendaciones-completada');

    const lineas = [];

    lineas.push(
        'Eres un asistente especializado en educación inicial. A continuación ' +
            'tienes la información completa de una evaluación y las ' +
            'valoraciones obtenidas por un estudiante.'
    );

    lineas.push('');
    lineas.push('INFORMACIÓN DE LA EVALUACIÓN');

    agregarDato(lineas, 'Evaluación', datos.evaluacion);
    agregarDato(lineas, 'Tipo de evaluación', datos.tipo);
    agregarDato(lineas, 'Proyecto', datos.proyecto);
    agregarDato(lineas, 'Docente', datos.docente);
    agregarDato(lineas, 'Periodo', datos.periodo);
    agregarDato(lineas, 'Estudiante', datos.estudiante);
    agregarDato(lineas, 'Grupo', datos.grupo);

    lineas.push('');
    lineas.push('RESULTADOS POR ÁREA Y SUBÁREA');

    if (resultados.length === 0) {
        lineas.push('- No hay subáreas registradas.');
    } else {
        agruparPorArea(resultados).forEach((items, area) => {
            lineas.push('');
            lineas.push('Área: ' + area);

            items.forEach((item) => {
                let linea = '- ' + item.subarea;
                linea += ' | Valoración: ' + formatearValoracion(item.valoracion);

                if (item.observacion !== '') {
                    linea += ' | Observación: ' + item.observacion;
                }

                lineas.push(linea);
            });
        });
    }

    lineas.push('');
    lineas.push('OBSERVACIONES GENERALES');
    lineas.push(observaciones === '' ? '- Sin observaciones.' : observaciones);

    if (recomendaciones !== '') {
        lineas.push('');
        lineas.push('RECOMENDACIÓN ACTUAL (puedes mejorarla o reescribirla)');
        lineas.push(recomendaciones);
    }

    lineas.push('');
    lineas.push('TAREA');
    lineas.push(
        'Redacta una recomendación para el estudiante en el mismo estilo del ' +
            'siguiente ejemplo:'
    );
    lineas.push('');
    lineas.push('"' + EJEMPLO_RECOMENDACION + '"');
    lineas.push('');
    lineas.push('Instrucciones:');
    lineas.push(
        '- Dirígete al estudiante por su nombre y usa un tono cálido, cercano ' +
            'y motivador, como en el ejemplo.'
    );
    lineas.push(
        '- Menciona de forma integrada las áreas evaluadas y lo observado en ' +
            'cada una, destacando los logros y los aspectos por reforzar.'
    );
    lineas.push(
        '- Incluye recomendaciones concretas para el hogar, con actividades ' +
            'sencillas y cotidianas.'
    );
    lineas.push(
        '- Redacta entre ' +
            minimo +
            ' y ' +
            maximo +
            ' palabras. Cumple estrictamente ese rango.'
    );
    lineas.push(
        '- Devuelve únicamente el texto de la recomendación, sin títulos, ' +
            'listas, comillas ni explicaciones.'
    );

    return lineas.join('\n');
}

function leerDatosEvaluacion() {
    const nodo = document.getElementById('evaluacionPromptData');

    if (!nodo) {
        return {};
    }

    try {
        return JSON.parse(nodo.textContent || '{}');
    } catch (error) {
        return {};
    }
}

function recolectarResultados() {
    return Array.from(
        document.querySelectorAll('[data-evaluacion-subarea]')
    ).map((articulo) => {
        const valoracion = articulo.querySelector(
            'input[type="radio"][name$="[valoracion]"]:checked'
        );
        const observacion = articulo.querySelector(
            'input[name$="[observacion]"]'
        );

        return {
            area: articulo.dataset.area || 'Sin área',
            subarea: articulo.dataset.subarea || 'Subárea',
            valoracion: valoracion ? valoracion.value : '',
            observacion: observacion ? observacion.value.trim() : '',
        };
    });
}

function agruparPorArea(resultados) {
    const areas = new Map();

    resultados.forEach((resultado) => {
        if (!areas.has(resultado.area)) {
            areas.set(resultado.area, []);
        }

        areas.get(resultado.area).push(resultado);
    });

    return areas;
}

function formatearValoracion(valoracion) {
    if (!valoracion) {
        return 'Sin valorar';
    }

    const texto = valoracion.replace(/_/g, ' ');

    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function agregarDato(lineas, etiqueta, valor) {
    if (valor === null || valor === undefined || String(valor).trim() === '') {
        return;
    }

    lineas.push('- ' + etiqueta + ': ' + String(valor).trim());
}

function leerValor(id) {
    const campo = document.getElementById(id);

    return campo ? campo.value.trim() : '';
}

function copiarAlPortapapeles(texto) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(texto);
    }

    return new Promise((resolve, reject) => {
        const auxiliar = document.createElement('textarea');

        auxiliar.value = texto;
        auxiliar.style.position = 'fixed';
        auxiliar.style.opacity = '0';

        document.body.appendChild(auxiliar);
        auxiliar.focus();
        auxiliar.select();

        try {
            document.execCommand('copy') ? resolve() : reject();
        } catch (error) {
            reject(error);
        } finally {
            document.body.removeChild(auxiliar);
        }
    });
}
