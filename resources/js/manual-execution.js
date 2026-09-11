document.addEventListener('DOMContentLoaded', async () => {

    const container = document.getElementById(
        'manualExecutionContainer'
    );

    if (!container) {
        return;
    }

    const manualId = container.dataset.manualId;

    let execution = null;

    /*
    |--------------------------------------------------------------------------
    | Elementos
    |--------------------------------------------------------------------------
    */

    const progressBar = document.getElementById(
        'progressBar'
    );

    const progressText = document.getElementById(
        'progressText'
    );

    const stepCounter = document.getElementById(
        'stepCounter'
    );

    const steps = Array.from(
        container.querySelectorAll(
            '.manual-execution-step'
        )
    );

    const navigationItems = Array.from(
        container.querySelectorAll(
            '.manual-step-nav-item'
        )
    );

    let currentStepIndex = 0;


    /*
    |--------------------------------------------------------------------------
    | Cargar ejecución existente
    |--------------------------------------------------------------------------
    */

    async function cargarEjecucion() {

        try {

            const response = await fetch(
                `/api/manuals/${manualId}/my-execution`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {

                throw new Error(
                    'No se pudo consultar la ejecución'
                );
            }

            const result = await response.json();

            console.log(
                'Ejecución cargada:',
                result.data
            );


            /*
             * Si ya existe una ejecución,
             * usamos esa misma.
             */

            if (result.data) {

                execution = result.data;

            } else {

                /*
                 * Solo creamos una ejecución
                 * cuando realmente no existe.
                 */

                execution = await iniciarEjecucion();
            }


            actualizarInterfaz();


            /*
             * Restaurar el último paso visitado.
             *
             * Primero intentamos recuperar el paso
             * guardado en el navegador.
             */

            if (execution.current_step_id) {

                const savedIndex = steps.findIndex(
                    step =>
                        Number(step.dataset.stepId) ===
                        Number(execution.current_step_id)
                );

                if (savedIndex !== -1) {

                    currentStepIndex = savedIndex;

                } else {

                    currentStepIndex = 0;
                }

            } else {

                const primerPasoPendiente =
                    encontrarPrimerPasoPendiente();

                if (primerPasoPendiente !== -1) {

                    currentStepIndex =
                        primerPasoPendiente;

                } else {

                    currentStepIndex = 0;
                }
            }


            mostrarPasoActual();

        } catch (error) {

            console.error(
                'Error cargando ejecución:',
                error
            );

            alert(
                'No se pudo cargar la ejecución del manual.'
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Iniciar ejecución
    |--------------------------------------------------------------------------
    */

    async function iniciarEjecucion() {

        const response = await fetch(
            '/api/manual-executions',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },

                credentials: 'same-origin',

                body: JSON.stringify({
                    manual_id: manualId
                })
            }
        );


        if (!response.ok) {

            throw new Error(
                'No se pudo iniciar el manual'
            );
        }


        const result = await response.json();


        console.log(
            'Nueva ejecución creada:',
            result.data
        );


        return result.data;
    }


    async function reiniciarManual() {

        try {

            const response = await fetch(
                `/api/manual-executions/${manualId}/restart`,
                {
                    method: 'POST',

                    headers: {
                        'Accept': 'application/json'
                    },

                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {

                throw new Error(
                    'No se pudo crear una nueva ejecución'
                );
            }

            const result = await response.json();

            console.log(
                'Nueva ejecución:',
                result.data
            );

            // Usar la nueva ejecución
            execution = result.data;

            // Empezar desde el primer paso
            currentStepIndex = 0;

            // Actualizar la interfaz
            actualizarInterfaz();

            // Mostrar el primer paso
            mostrarPasoActual();

        } catch (error) {

            console.error(
                'Error reiniciando manual:',
                error
            );

            alert(
                'No se pudo volver a realizar el manual.'
            );
        }
    }


    const restartButton =
        document.getElementById(
            'btnRestartManual'
        );

    if (restartButton) {

        restartButton.addEventListener(
            'click',
            () => {
                reiniciarManual();
            }
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Obtener progreso de un paso
    |--------------------------------------------------------------------------
    */

    function obtenerProgreso(stepId) {

        if (
            !execution ||
            !Array.isArray(
                execution.step_progress
            )
        ) {
            return null;
        }


        return execution.step_progress.find(
            progress =>
                Number(progress.step_id) ===
                Number(stepId)
        );
    }


    /*
|--------------------------------------------------------------------------
| Cargar nota del paso
|--------------------------------------------------------------------------
*/

    function cargarNotaPaso(stepElement) {

        const stepId =
            stepElement.dataset.stepId;

        const progress =
            obtenerProgreso(stepId);

        const textarea =
            stepElement.querySelector(
                '.manual-step-user-notes'
            );

        if (!textarea) {
            return;
        }

        textarea.value =
            progress?.notes ?? '';
    }


    /*
    |--------------------------------------------------------------------------
    | Buscar primer paso pendiente
    |--------------------------------------------------------------------------
    */

    function encontrarPrimerPasoPendiente() {

        for (
            let index = 0;
            index < steps.length;
            index++
        ) {

            const stepElement =
                steps[index];

            const stepId =
                stepElement.dataset.stepId;

            const progress =
                obtenerProgreso(stepId);


            const completado =
                progress &&
                String(progress.status).toLowerCase() ===
                'completed';


            if (!completado) {

                return index;
            }
        }


        return -1;
    }


    /*
    |--------------------------------------------------------------------------
    | Actualizar interfaz
    |--------------------------------------------------------------------------
    */

    function actualizarInterfaz() {

        if (!execution) {
            return;
        }


        let completed = 0;
        let total = steps.length;


        /*
         * Revisar todos los pasos
         */

        steps.forEach(
            stepElement => {

                const stepId =
                    stepElement.dataset.stepId;

                const progress =
                    obtenerProgreso(stepId);

                const button =
                    stepElement.querySelector(
                        '.btn-complete-step'
                    );


                const estaCompletado =
                    progress &&
                    String(progress.status).toLowerCase() ===
                    'completed';


                if (estaCompletado) {

                    completed++;


                    stepElement.classList.add(
                        'completed'
                    );


                    if (button) {

                        button.textContent =
                            '↩ Marcar como pendiente';

                        button.classList.add(
                            'step-completed'
                        );
                    }

                } else {

                    stepElement.classList.remove(
                        'completed'
                    );


                    if (button) {

                        button.textContent =
                            '✓ Completar paso';

                        button.classList.remove(
                            'step-completed'
                        );
                    }
                }

            }
        );


        /*
        |--------------------------------------------------------------------------
        | Calcular porcentaje
        |--------------------------------------------------------------------------
        */

        const percentage =
            total > 0
                ? Math.round(
                    (completed / total) * 100
                )
                : 0;


        /*
|--------------------------------------------------------------------------
| Resumen de manual completado
|--------------------------------------------------------------------------
*/

        actualizarResumenCompletado(
            completed,
            total,
            percentage
        );


        /*
        |--------------------------------------------------------------------------
        | Barra de progreso
        |--------------------------------------------------------------------------
        */

        if (progressBar) {

            progressBar.style.width =
                `${percentage}%`;
        }


        /*
        |--------------------------------------------------------------------------
        | Texto de progreso
        |--------------------------------------------------------------------------
        */

        if (progressText) {

            if (
                total > 0 &&
                completed === total
            ) {

                progressText.textContent =
                    '100% · ¡Completado!';

            } else {

                progressText.textContent =
                    `${percentage}%`;
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Actualizar navegación lateral
        |--------------------------------------------------------------------------
        */

        navigationItems.forEach(
            navItem => {

                const stepId =
                    navItem.dataset.stepId;

                const progress =
                    obtenerProgreso(stepId);

                const status =
                    navItem.querySelector(
                        '.manual-step-nav-status'
                    );


                const estaCompletado =
                    progress &&
                    String(progress.status).toLowerCase() ===
                    'completed';


                if (estaCompletado) {

                    navItem.classList.add(
                        'completed'
                    );


                    if (status) {

                        status.textContent =
                            '✓';
                    }

                } else {

                    navItem.classList.remove(
                        'completed'
                    );


                    if (status) {

                        status.textContent =
                            '○';
                    }
                }

            }
        );

    }


    /*
|--------------------------------------------------------------------------
| Actualizar resumen de manual completado
|--------------------------------------------------------------------------
*/

    function actualizarResumenCompletado(completed, total, percentage) {

        const summary =
            document.getElementById(
                'manualCompletedSummary'
            );

        const completedSteps =
            document.getElementById(
                'completedSummarySteps'
            );

        const completedPercentage =
            document.getElementById(
                'completedSummaryPercentage'
            );


        if (!summary) {
            return;
        }


        /*
         * Actualizar estadísticas del resumen
         */

        if (completedSteps) {

            completedSteps.textContent =
                completed;
        }


        if (completedPercentage) {

            completedPercentage.textContent =
                `${percentage}%`;
        }


        /*
         * Mostrar u ocultar resumen
         */

        if (
            total > 0 &&
            completed === total
        ) {

            summary.style.display =
                'flex';

        } else {

            summary.style.display =
                'none';
        }

    }



    async function guardarPasoActual() {
        if (!execution) {
            return;
        }

        const step = steps[currentStepIndex];

        if (!step) {
            return;
        }

        const stepId = step.dataset.stepId;

        try {
            await fetch(
                `/api/manual-executions/${execution.id}/current-step/${stepId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content')
                    }
                }
            );
        } catch (error) {
            console.error(
                'Error al guardar el paso actual:',
                error
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Mostrar paso actual
    |--------------------------------------------------------------------------
    */

    async function mostrarPasoActual() {

        if (steps.length === 0) {
            return;
        }


        /*
         * Evitar índices inválidos
         */

        if (currentStepIndex < 0) {

            currentStepIndex = 0;
        }


        if (
            currentStepIndex >= steps.length
        ) {

            currentStepIndex =
                steps.length - 1;
        }


        /*
         * Ocultar todos los pasos
         */

        steps.forEach(
            (stepElement, index) => {

                if (
                    index === currentStepIndex
                ) {

                    stepElement.classList.add(
                        'active'
                    );

                } else {

                    stepElement.classList.remove(
                        'active'
                    );
                }

            }
        );


        /*
         * Actualizar navegación lateral
         */

        navigationItems.forEach(
            (navItem, index) => {

                if (
                    index === currentStepIndex
                ) {

                    navItem.classList.add(
                        'active'
                    );

                } else {

                    navItem.classList.remove(
                        'active'
                    );
                }

            }
        );


        /*
         * Actualizar contador
         */

        if (stepCounter) {

            stepCounter.textContent =
                `${currentStepIndex + 1} / ${steps.length}`;
        }


        /*
|--------------------------------------------------------------------------
| Mostrar / ocultar botón siguiente
|--------------------------------------------------------------------------
*/

        const currentStep =
            steps[currentStepIndex];

        if (currentStep) {

            const nextButton =
                currentStep.querySelector(
                    '.btn-next-step'
                );

            if (nextButton) {

                if (
                    currentStepIndex >=
                    steps.length - 1
                ) {

                    nextButton.style.display = 'none';

                } else {

                    nextButton.style.display = '';
                }

            }

        }


        /*
|--------------------------------------------------------------------------
| Mostrar / ocultar botón siguiente
|--------------------------------------------------------------------------
*/

        const nextButton = document.querySelector(
            '.btn-next-step'
        );

        if (nextButton) {

            if (currentStepIndex >= steps.length - 1) {

                nextButton.style.display = 'none';

            } else {

                nextButton.style.display = '';
            }
        }


        /*
         * Guardar posición actual
         */




        /*
 * Cargar las notas del paso actual
 */



        if (currentStep) {

            cargarNotaPaso(currentStep);

        }


        /*
         * Volver arriba del contenido
         */



        if (currentStep) {

            currentStep.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        await guardarPasoActual();
    }


    /*
    |--------------------------------------------------------------------------
    | Ir a un paso
    |--------------------------------------------------------------------------
    */

    function irAlPaso(index) {

        if (
            index < 0 ||
            index >= steps.length
        ) {
            return;
        }


        currentStepIndex = index;

        mostrarPasoActual();

    }


    /*
    |--------------------------------------------------------------------------
    | Paso anterior
    |--------------------------------------------------------------------------
    */

    function pasoAnterior() {

        if (
            currentStepIndex <= 0
        ) {
            return;
        }


        currentStepIndex--;

        mostrarPasoActual();

    }


    /*
    |--------------------------------------------------------------------------
    | Paso siguiente
    |--------------------------------------------------------------------------
    */

    function pasoSiguiente() {

        if (
            currentStepIndex >=
            steps.length - 1
        ) {
            return;
        }


        currentStepIndex++;

        mostrarPasoActual();

    }


    /*
    |--------------------------------------------------------------------------
    | Completar / descompletar paso
    |--------------------------------------------------------------------------
    */

    async function cambiarEstadoPaso(
        stepId,
        completar
    ) {

        if (!execution) {
            return;
        }


        const action =
            completar
                ? 'complete'
                : 'uncomplete';


        try {

            const response = await fetch(
                `/api/manual-executions/${execution.id}/steps/${stepId}/${action}`,
                {
                    method: 'POST',

                    headers: {
                        'Accept': 'application/json'
                    },

                    credentials: 'same-origin'
                }
            );


            if (!response.ok) {

                throw new Error(
                    'No se pudo actualizar el paso'
                );
            }


            /*
             * Volver a cargar la ejecución
             * completa desde Laravel.
             */

            const executionResponse =
                await fetch(
                    `/api/manual-executions/${execution.id}`,
                    {
                        method: 'GET',

                        headers: {
                            'Accept': 'application/json'
                        },

                        credentials: 'same-origin'
                    }
                );


            if (!executionResponse.ok) {

                throw new Error(
                    'No se pudo recargar la ejecución'
                );
            }


            const executionResult =
                await executionResponse.json();


            execution =
                executionResult.data;


            console.log(
                'Ejecución actualizada:',
                execution
            );


            /*
             * Actualizar progreso,
             * botones y navegación.
             */

            actualizarInterfaz();


            /*
       * Si acabamos de completar el paso,
       * avanzar automáticamente al siguiente.
       */

            if (
                completar &&
                currentStepIndex < steps.length - 1
            ) {
                currentStepIndex++;
            }


            /*
             * Mostrar el paso actual
             */

            mostrarPasoActual();


        } catch (error) {

            console.error(
                'Error actualizando paso:',
                error
            );


            alert(
                'No se pudo actualizar el paso.'
            );
        }

    }



    /*
|--------------------------------------------------------------------------
| Guardar nota de un paso
|--------------------------------------------------------------------------
*/

    async function guardarNotaPaso(stepElement) {

        if (!execution) {
            return;
        }

        const stepId =
            stepElement.dataset.stepId;

        const textarea =
            stepElement.querySelector(
                '.manual-step-user-notes'
            );

        const status =
            stepElement.querySelector(
                '.manual-step-note-status'
            );

        if (!textarea) {
            return;
        }

        try {

            if (status) {

                status.textContent =
                    'Guardando...';

                status.classList.remove(
                    'error'
                );
            }


            const response =
                await fetch(
                    `/api/manual-executions/${execution.id}/steps/${stepId}/notes`,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },

                        credentials: 'same-origin',

                        body: JSON.stringify({
                            notes: textarea.value
                        })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    'No se pudo guardar la nota'
                );
            }


            const result =
                await response.json();


            if (!result.success) {

                throw new Error(
                    result.message ||
                    'No se pudo guardar la nota'
                );
            }


            /*
             * Actualizar también el objeto
             * de ejecución que tenemos en memoria.
             */

            const progress =
                obtenerProgreso(stepId);

            if (progress) {

                progress.notes =
                    textarea.value;
            }


            if (status) {

                status.textContent =
                    '✓ Guardado';

                setTimeout(() => {

                    status.textContent = '';

                }, 2000);

            }

        } catch (error) {

            console.error(
                'Error guardando nota:',
                error
            );


            if (status) {

                status.textContent =
                    'Error al guardar';

                status.classList.add(
                    'error'
                );

            } else {

                alert(
                    'No se pudo guardar la nota.'
                );
            }

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Clicks
    |--------------------------------------------------------------------------
    */

    container.addEventListener(
        'click',
        event => {





            /*
 * Guardar nota
 */

            const saveNoteButton =
                event.target.closest(
                    '.btn-save-step-note'
                );

            if (saveNoteButton) {

                const stepId =
                    saveNoteButton.dataset.stepId;

                const stepElement =
                    container.querySelector(
                        `.manual-execution-step[data-step-id="${stepId}"]`
                    );

                if (stepElement) {

                    guardarNotaPaso(
                        stepElement
                    );

                }

                return;
            }


            /*
             * Completar / descompletar
             */

            const completeButton =
                event.target.closest(
                    '.btn-complete-step'
                );


            if (completeButton) {

                const stepId =
                    completeButton.dataset.stepId;


                const progress =
                    obtenerProgreso(stepId);


                const estaCompletado =
                    progress &&
                    String(progress.status).toLowerCase() ===
                    'completed';


                cambiarEstadoPaso(
                    stepId,
                    !estaCompletado
                );


                return;
            }


            /*
             * Paso anterior
             */

            const previousButton =
                event.target.closest(
                    '.btn-previous-step'
                );


            if (previousButton) {

                pasoAnterior();

                return;
            }


            /*
             * Paso siguiente
             */

            const nextButton =
                event.target.closest(
                    '.btn-next-step'
                );


            if (nextButton) {

                pasoSiguiente();

                return;
            }


            /*
             * Navegación lateral
             */

            const navigationButton =
                event.target.closest(
                    '.manual-step-nav-item'
                );


            if (navigationButton) {

                const index =
                    Number(
                        navigationButton.dataset.stepIndex
                    );


                if (
                    Number.isInteger(index)
                ) {

                    irAlPaso(index);
                }

            }

        }
    );


    /*
    |--------------------------------------------------------------------------
    | Inicializar
    |--------------------------------------------------------------------------
    */

    await cargarEjecucion();

});