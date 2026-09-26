/*
|--------------------------------------------------------------------------
| TABLA GESTIÓN
|--------------------------------------------------------------------------
|
| Componente reutilizable para tablas.
|
| RESPONSABILIDADES:
|
| - Recibir datos
| - Mostrar datos
| - Mostrar loading
| - Mostrar errores
| - Mostrar tabla vacía
| - Generar botones Editar / Secciones / Pasos / Plantilla / Eliminar
| - Emitir eventos
|
| NO RESPONSABILIDADES:
|
| - Fetch
| - API
| - PUT
| - DELETE
| - Confirmaciones
| - Formularios
| - Lógica de tecnologías
| - Lógica de categorías
|
|--------------------------------------------------------------------------
*/


export class TablaGestion {


    /*
    |--------------------------------------------------------------------------
    | CONSTRUCTOR
    |--------------------------------------------------------------------------
    */

    constructor(config = {}) {

        this.container =
            typeof config.container === 'string'
                ? document.querySelector(config.container)
                : config.container;


        this.columns =
            config.columns ?? [];


        this.actions =
            config.actions ?? {
                edit: true,
                words: false,
                meanings: false,
                sections: false,
                steps: false,
                template: false,
                delete: true
            };

        this.selectable =
            config.selectable ?? false;


        this.emptyMessage =
            config.emptyMessage ??
            'No hay registros.';


        this.loadingMessage =
            config.loadingMessage ??
            'Cargando...';


        this.errorMessage =
            config.errorMessage ??
            'Error cargando registros.';


        /*
        |--------------------------------------------------------------------------
        | VALIDACIÓN
        |--------------------------------------------------------------------------
        */

        if (!this.container) {

            console.error(
                'TablaGestion: no se encontró el contenedor.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | OBTENER TBODY DE LA VISTA BLADE
        |--------------------------------------------------------------------------
        */

        this.tbody =
            this.container.querySelector(
                'tbody'
            );


        if (!this.tbody) {

            console.error(
                'TablaGestion: no se encontró el tbody.'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | CONFIGURAR EVENTOS
        |--------------------------------------------------------------------------
        */

        this.configurarEventos();

    }


    /*
    |--------------------------------------------------------------------------
    | ESTABLECER DATOS
    |--------------------------------------------------------------------------
    */

    establecerDatos(datos = []) {

        this.datos =
            Array.isArray(datos)
                ? datos
                : [];


        this.pintar();

    }


    /*
    |--------------------------------------------------------------------------
    | PINTAR
    |--------------------------------------------------------------------------
    */

    pintar() {

        this.tbody.innerHTML = '';


        /*
        |--------------------------------------------------------------------------
        | SIN REGISTROS
        |--------------------------------------------------------------------------
        */

        if (
            this.datos.length === 0
        ) {

            const fila =
                document.createElement('tr');


            const celda =
                document.createElement('td');


            celda.colSpan =
                this.obtenerCantidadColumnas();


            celda.className =
                'tabla-gestion-empty';


            celda.textContent =
                this.emptyMessage;


            fila.appendChild(
                celda
            );


            this.tbody.appendChild(
                fila
            );


            return;

        }


        /*
        |--------------------------------------------------------------------------
        | GENERAR FILAS
        |--------------------------------------------------------------------------
        */

        this.datos.forEach(
            registro => {

                const fila =
                    document.createElement('tr');


                /*
|--------------------------------------------------------------------------
| SELECCIÓN
|--------------------------------------------------------------------------
*/

                if (this.selectable) {

                    const celdaSeleccion =
                        document.createElement('td');


                    celdaSeleccion.className =
                        'tabla-gestion-select';


                    const checkbox =
                        document.createElement('input');


                    checkbox.type =
                        'checkbox';


                    checkbox.className =
                        'planificacion-checkbox';


                    checkbox.value =
                        registro.id;


                    checkbox.dataset.id =
                        registro.id;


                    celdaSeleccion.appendChild(
                        checkbox
                    );


                    fila.appendChild(
                        celdaSeleccion
                    );

                }


                /*
                |--------------------------------------------------------------------------
                | COLUMNAS
                |--------------------------------------------------------------------------
                */

                this.columns.forEach(
                    columna => {

                        const celda =
                            document.createElement('td');


                        const valor =
                            this.obtenerValor(
                                registro,
                                columna.key
                            );


                        /*
                        |--------------------------------------------------------------------------
                        | RENDER PERSONALIZADO
                        |--------------------------------------------------------------------------
                        */

                        if (
                            typeof columna.render ===
                            'function'
                        ) {

                            const resultado =
                                columna.render(
                                    valor,
                                    registro
                                );


                            if (
                                resultado instanceof Node
                            ) {

                                celda.appendChild(
                                    resultado
                                );

                            } else {

                                celda.textContent =
                                    resultado ?? '';

                            }

                        } else {

                            celda.textContent =
                                valor ?? '';

                        }


                        fila.appendChild(
                            celda
                        );

                    }
                );


                /*
                |--------------------------------------------------------------------------
                | ACCIONES
                |--------------------------------------------------------------------------
                */

                if (
                    this.actions.edit ||
                    this.actions.words ||
                    this.actions.sections ||
                    this.actions.steps ||
                    this.actions.template ||
                    this.actions.delete
                ) {

                    const celdaAcciones =
                        document.createElement('td');


                    celdaAcciones.className =
                        'tabla-gestion-actions';


                    /*
                    |--------------------------------------------------------------------------
                    | PASOS
                    |--------------------------------------------------------------------------
                    */

                    if (
                        this.actions.steps
                    ) {

                        const botonPasos =
                            document.createElement('button');


                        botonPasos.type =
                            'button';


                        botonPasos.className =
                            'tabla-gestion-btn tabla-gestion-btn-steps';


                        botonPasos.dataset.action =
                            'steps';


                        botonPasos.dataset.id =
                            registro.id;


                        botonPasos.textContent =
                            'Pasos';


                        celdaAcciones.appendChild(
                            botonPasos
                        );

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | EDITAR
                    |--------------------------------------------------------------------------
                    */

                    if (
                        this.actions.edit
                    ) {

                        const botonEditar =
                            document.createElement('button');


                        botonEditar.type =
                            'button';


                        botonEditar.className =
                            'tabla-gestion-btn tabla-gestion-btn-edit';


                        botonEditar.dataset.action =
                            'edit';


                        botonEditar.dataset.id =
                            registro.id;


                        botonEditar.textContent =
                            'Editar';


                        celdaAcciones.appendChild(
                            botonEditar
                        );

                    }


                    /*
|--------------------------------------------------------------------------
| PALABRAS
|--------------------------------------------------------------------------
*/

                    if (
                        this.actions.words
                    ) {

                        const botonPalabras =
                            document.createElement('button');


                        botonPalabras.type =
                            'button';


                        botonPalabras.className =
                            'tabla-gestion-btn tabla-gestion-btn-words';


                        botonPalabras.dataset.action =
                            'words';


                        botonPalabras.dataset.id =
                            registro.id;


                        botonPalabras.textContent =
                            'Ver palabras';


                        celdaAcciones.appendChild(
                            botonPalabras
                        );

                    }



                    if (this.actions.meanings) {
                        const botonSignificados = document.createElement('button');

                        botonSignificados.type = 'button';

                        botonSignificados.className =
                            'tabla-gestion-btn tabla-gestion-btn-meanings';

                        botonSignificados.dataset.action = 'meanings';

                        botonSignificados.dataset.id = registro.id;

                        botonSignificados.textContent = 'Ver significados';

                        celdaAcciones.appendChild(botonSignificados);
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | SECCIONES
                    |--------------------------------------------------------------------------
                    */

                    if (
                        this.actions.sections
                    ) {

                        const botonSecciones =
                            document.createElement('button');


                        botonSecciones.type =
                            'button';


                        botonSecciones.className =
                            'tabla-gestion-btn tabla-gestion-btn-sections';


                        botonSecciones.dataset.action =
                            'sections';


                        botonSecciones.dataset.id =
                            registro.id;


                        botonSecciones.textContent =
                            'Secciones';


                        celdaAcciones.appendChild(
                            botonSecciones
                        );

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | CONVERTIR EN PLANTILLA
                    |--------------------------------------------------------------------------
                    */

                    if (
                        this.actions.template
                    ) {

                        const botonPlantilla =
                            document.createElement('button');


                        botonPlantilla.type =
                            'button';


                        botonPlantilla.className =
                            'tabla-gestion-btn tabla-gestion-btn-template';


                        botonPlantilla.dataset.action =
                            'template';


                        botonPlantilla.dataset.id =
                            registro.id;


                        botonPlantilla.textContent =
                            'Convertir en plantilla';


                        celdaAcciones.appendChild(
                            botonPlantilla
                        );

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | ELIMINAR
                    |--------------------------------------------------------------------------
                    */

                    if (
                        this.actions.delete
                    ) {

                        const botonEliminar =
                            document.createElement('button');


                        botonEliminar.type =
                            'button';


                        botonEliminar.className =
                            'tabla-gestion-btn tabla-gestion-btn-delete';


                        botonEliminar.dataset.action =
                            'delete';


                        botonEliminar.dataset.id =
                            registro.id;


                        botonEliminar.textContent =
                            'Eliminar';


                        celdaAcciones.appendChild(
                            botonEliminar
                        );

                    }


                    fila.appendChild(
                        celdaAcciones
                    );

                }


                this.tbody.appendChild(
                    fila
                );

            }
        );

    }


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    mostrarCargando() {

        this.tbody.innerHTML = '';


        const fila =
            document.createElement('tr');


        const celda =
            document.createElement('td');


        celda.colSpan =
            this.obtenerCantidadColumnas();


        celda.className =
            'tabla-gestion-loading';


        celda.textContent =
            this.loadingMessage;


        fila.appendChild(
            celda
        );


        this.tbody.appendChild(
            fila
        );

    }


    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    mostrarError(
        mensaje = null
    ) {

        this.tbody.innerHTML = '';


        const fila =
            document.createElement('tr');


        const celda =
            document.createElement('td');


        celda.colSpan =
            this.obtenerCantidadColumnas();


        celda.className =
            'tabla-gestion-error';


        celda.textContent =
            mensaje ??
            this.errorMessage;


        fila.appendChild(
            celda
        );


        this.tbody.appendChild(
            fila
        );

    }


    /*
    |--------------------------------------------------------------------------
    | OBTENER VALOR
    |--------------------------------------------------------------------------
    */

    obtenerValor(
        objeto,
        ruta
    ) {

        return ruta
            .split('.')
            .reduce(
                (valor, propiedad) =>
                    valor?.[propiedad],
                objeto
            );

    }


    /*
    |--------------------------------------------------------------------------
    | BUSCAR REGISTRO
    |--------------------------------------------------------------------------
    */

    obtenerRegistroPorId(
        id
    ) {

        return this.datos.find(
            registro =>
                String(registro.id) ===
                String(id)
        );

    }


    /*
    |--------------------------------------------------------------------------
    | COLUMNAS
    |--------------------------------------------------------------------------
    */

    obtenerCantidadColumnas() {

        let cantidad =
            this.columns.length;


        if (this.selectable) {

            cantidad++;

        }


        if (
            this.actions.edit ||
            this.actions.words ||
            this.actions.sections ||
            this.actions.steps ||
            this.actions.template ||
            this.actions.delete
        ) {

            cantidad++;

        }


        return cantidad;

    }

    /*
    |--------------------------------------------------------------------------
    | EVENTOS
    |--------------------------------------------------------------------------
    */

    configurarEventos() {

        this.tbody.addEventListener(
            'click',
            event => {

                /*
                |--------------------------------------------------------------------------
                | EDITAR
                |--------------------------------------------------------------------------
                */

                const botonEditar =
                    event.target.closest(
                        '[data-action="edit"]'
                    );


                if (botonEditar) {

                    const id =
                        botonEditar.dataset.id;


                    const registro =
                        this.obtenerRegistroPorId(
                            id
                        );


                    this.emitir(
                        'edit',
                        registro
                    );


                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | PASOS
                |--------------------------------------------------------------------------
                */

                const botonPasos =
                    event.target.closest(
                        '[data-action="steps"]'
                    );


                if (botonPasos) {

                    const id =
                        botonPasos.dataset.id;


                    const registro =
                        this.obtenerRegistroPorId(
                            id
                        );


                    this.emitir(
                        'steps',
                        registro
                    );


                    return;

                }


                /*
|--------------------------------------------------------------------------
| PALABRAS
|--------------------------------------------------------------------------
*/

                const botonPalabras =
                    event.target.closest(
                        '[data-action="words"]'
                    );


                if (botonPalabras) {

                    const id =
                        botonPalabras.dataset.id;


                    const registro =
                        this.obtenerRegistroPorId(
                            id
                        );


                    this.emitir(
                        'words',
                        registro
                    );


                    return;

                }



                const botonSignificados =
                    event.target.closest('[data-action="meanings"]');

                if (botonSignificados) {
                    const id = botonSignificados.dataset.id;
                    const registro = this.obtenerRegistroPorId(id);
                    this.emitir('meanings', registro);
                    return;
                }


                /*
                |--------------------------------------------------------------------------
                | SECCIONES
                |--------------------------------------------------------------------------
                */

                const botonSecciones =
                    event.target.closest(
                        '[data-action="sections"]'
                    );


                if (botonSecciones) {

                    const id =
                        botonSecciones.dataset.id;


                    const registro =
                        this.obtenerRegistroPorId(
                            id
                        );


                    this.emitir(
                        'sections',
                        registro
                    );


                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | CONVERTIR EN PLANTILLA
                |--------------------------------------------------------------------------
                */

                const botonPlantilla =
                    event.target.closest(
                        '[data-action="template"]'
                    );


                if (botonPlantilla) {

                    const id =
                        botonPlantilla.dataset.id;


                    const registro =
                        this.obtenerRegistroPorId(
                            id
                        );


                    this.emitir(
                        'template',
                        registro
                    );


                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | ELIMINAR
                |--------------------------------------------------------------------------
                */

                const botonEliminar =
                    event.target.closest(
                        '[data-action="delete"]'
                    );


                if (botonEliminar) {

                    const id =
                        botonEliminar.dataset.id;


                    const registro =
                        this.obtenerRegistroPorId(
                            id
                        );


                    this.emitir(
                        'delete',
                        registro
                    );

                }

            }
        );

    }


    /*
    |--------------------------------------------------------------------------
    | EMITIR EVENTO
    |--------------------------------------------------------------------------
    */

    emitir(
        accion,
        registro
    ) {

        const evento =
            new CustomEvent(
                `tabla-gestion:${accion}`,
                {
                    detail: registro
                }
            );


        this.container.dispatchEvent(
            evento
        );

    }

}