(() => {
    const practice = window.englishPractice;

    if (practice) {

        const TOTAL_QUESTIONS =
            Math.min(
                practice.questionCount,
                practice.words.length
            );

        let questions = [];

        let currentQuestionIndex = 0;

        let score = 0;

        let answered = false;

        let autoNextEnabled = true;
        let autoNextTimer = null;
        const practiceCard =
            document.getElementById('practice-card');

        const progress =
            document.getElementById(
                'practice-progress'
            );

        const questionType =
            document.getElementById(
                'practice-question-type'
            );

        const question =
            document.getElementById(
                'practice-question'
            );

        const listenContainer =
            document.getElementById(
                'practice-listen'
            );

        const options =
            document.getElementById(
                'practice-options'
            );

        const feedback =
            document.getElementById(
                'practice-feedback'
            );

        const feedbackTitle =
            document.getElementById(
                'practice-feedback-title'
            );

        const feedbackText =
            document.getElementById(
                'practice-feedback-text'
            );

        const nextButton =
            document.getElementById(
                'btn-next-practice'
            );

        const autoNextButton =
            document.getElementById(
                'btn-toggle-auto-next'
            );



        const practiceResult =
            document.getElementById('practice-result');

        const scoreElement =
            document.getElementById(
                'practice-score'
            );

        const resultMessageElement =
            document.getElementById(
                'practice-result-message'
            );


        const resultCategoryElement =
            document.getElementById('practice-result-category');

        const correctAnswersElement =
            document.getElementById('practice-correct-answers');

        const incorrectAnswersElement =
            document.getElementById('practice-incorrect-answers');

        const retryButton =
            document.getElementById(
                'btn-retry-practice'
            );


        const changeModeButton =
            document.getElementById(
                'btn-change-practice-mode'
            );

        const modeSelector =
            document.getElementById(
                'practice-mode-selector'
            );

        const modeOptions =
            document.querySelectorAll(
                '.english-practice-mode-option'
            );

        const startButton =
            document.getElementById(
                'btn-start-practice'
            );

        let selectedPracticeMode = null;

        modeOptions.forEach(option => {
            option.addEventListener('click', () => {

                modeOptions.forEach(item => {
                    item.classList.remove('selected');
                });

                option.classList.add('selected');

                selectedPracticeMode =
                    option.dataset.practiceMode;

                // Guardamos también el modo en practice
                practice.selectedMode =
                    selectedPracticeMode;

                if (startButton) {
                    startButton.disabled = false;
                }
            });
        });
        const soundToggle =
            document.getElementById(
                'btn-toggle-practice-sounds'
            );

        let practiceSoundsEnabled = true;
        let audioContext = null;


        /*
        |--------------------------------------------------------------------------
        | UTILIDADES
        |--------------------------------------------------------------------------
        */



        async function iniciarSesion() {
            const response = await fetch(
                `/english/category/${practice.categoryId}/practice/start`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute('content'),
                    },
                    body: JSON.stringify({
                        practice_session_id: practice.sessionId,
                        practice_mode: practice.selectedMode,
                    }),
                }
            );

            const data = await response.json();

            console.log('INICIAR SESIÓN - STATUS:', response.status);
            console.log('INICIAR SESIÓN - RESPUESTA:', data);

            if (!response.ok) {
                throw new Error(
                    data.message || 'No se pudo iniciar la práctica.'
                );
            }

            return data;
        }




        function mezclar(array) {

            return [...array].sort(
                () => Math.random() - 0.5
            );

        }


        function obtenerAudioContext() {
            if (!audioContext) {
                audioContext =
                    new (
                        window.AudioContext ||
                        window.webkitAudioContext
                    )();
            }

            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            return audioContext;
        }


        function reproducirSonidoCorrecto() {
            if (!practiceSoundsEnabled) {
                return;
            }

            const context =
                obtenerAudioContext();

            const ahora =
                context.currentTime;

            const oscillator =
                context.createOscillator();

            const gain =
                context.createGain();

            oscillator.type = 'sine';

            oscillator.frequency.setValueAtTime(
                523.25,
                ahora
            );

            oscillator.frequency.setValueAtTime(
                659.25,
                ahora + 0.10
            );

            oscillator.frequency.setValueAtTime(
                783.99,
                ahora + 0.20
            );

            gain.gain.setValueAtTime(
                0.0001,
                ahora
            );

            gain.gain.exponentialRampToValueAtTime(
                0.25,
                ahora + 0.02
            );

            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                ahora + 0.35
            );

            oscillator.connect(gain);
            gain.connect(context.destination);

            oscillator.start(ahora);
            oscillator.stop(ahora + 0.35);
        }


        function reproducirSonidoIncorrecto() {
            if (!practiceSoundsEnabled) {
                return;
            }

            const context =
                obtenerAudioContext();

            const ahora =
                context.currentTime;

            const oscillator =
                context.createOscillator();

            const gain =
                context.createGain();

            oscillator.type = 'sine';

            oscillator.frequency.setValueAtTime(
                220,
                ahora
            );

            oscillator.frequency.exponentialRampToValueAtTime(
                130,
                ahora + 0.25
            );

            gain.gain.setValueAtTime(
                0.0001,
                ahora
            );

            gain.gain.exponentialRampToValueAtTime(
                0.20,
                ahora + 0.02
            );

            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                ahora + 0.30
            );

            oscillator.connect(gain);
            gain.connect(context.destination);

            oscillator.start(ahora);
            oscillator.stop(ahora + 0.30);
        }

        // AQUÍ VA EL BLOQUE DEL BOTÓN 🔊

        if (soundToggle) {

            soundToggle.addEventListener(
                'click',
                () => {

                    practiceSoundsEnabled =
                        !practiceSoundsEnabled;

                    soundToggle.setAttribute(
                        'aria-pressed',
                        practiceSoundsEnabled
                            ? 'false'
                            : 'true'
                    );

                    if (practiceSoundsEnabled) {

                        soundToggle.textContent =
                            '🔊 Sonidos';

                        soundToggle.classList.remove(
                            'muted'
                        );

                    } else {

                        soundToggle.textContent =
                            '🔇 Sonidos';

                        soundToggle.classList.add(
                            'muted'
                        );
                    }
                }
            );

        }


        function obtenerSignificado(word) {

            if (
                !word.meanings ||
                word.meanings.length === 0
            ) {
                return null;
            }

            return word.meanings[0].meaning;
        }


        function obtenerPalabrasConSignificado() {

            return practice.words.filter(
                word =>
                    word.meanings &&
                    word.meanings.length > 0
            );

        }


        /*
        |--------------------------------------------------------------------------
        | CREAR OPCIONES
        |--------------------------------------------------------------------------
        */


        function crearOracionIncompleta(oracion, palabra) {

            const palabraEscapada =
                palabra.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&'
                );

            const expresion =
                new RegExp(
                    `\\b${palabraEscapada}\\b`,
                    'i'
                );

            return oracion.replace(
                expresion,
                '____'
            );

        }

        function crearOpciones(
            respuestaCorrecta,
            obtenerRespuesta
        ) {

            const opciones = [
                respuestaCorrecta
            ];


            const candidatos =
                mezclar(practice.words);


            for (
                const word of candidatos
            ) {

                const respuesta =
                    obtenerRespuesta(word);


                if (
                    respuesta &&
                    !opciones.includes(respuesta)
                ) {

                    opciones.push(respuesta);

                }


                if (
                    opciones.length === 4
                ) {

                    break;

                }

            }


            return mezclar(opciones);

        }


        /*
        |--------------------------------------------------------------------------
        | CREAR PREGUNTA
        |--------------------------------------------------------------------------
        */

        function crearPregunta(word, tipo) {

            /*
            |----------------------------------------------------------------------
            | INGLÉS → ESPAÑOL
            |----------------------------------------------------------------------
            */

            if (tipo === 'english-spanish') {

                const respuestaCorrecta =
                    obtenerSignificado(word);


                return {

                    type: 'english-spanish',

                    typeLabel:
                        'Inglés → Español',

                    question:
                        word.word,

                    correctAnswer:
                        respuestaCorrecta,
                    wordId: word.id,

                    options:
                        crearOpciones(
                            respuestaCorrecta,
                            obtenerSignificado
                        )

                };

            }


            /*
            |----------------------------------------------------------------------
            | ESPAÑOL → INGLÉS
            |----------------------------------------------------------------------
            */

            if (tipo === 'spanish-english') {

                const significado =
                    obtenerSignificado(word);


                const respuestaCorrecta =
                    word.word;


                return {

                    type: 'spanish-english',

                    typeLabel:
                        'Español → Inglés',

                    question:
                        significado,

                    correctAnswer:
                        respuestaCorrecta,

                    wordId: word.id,

                    options:
                        crearOpciones(
                            respuestaCorrecta,
                            item => item.word
                        )

                };

            }


            /*
            |----------------------------------------------------------------------
            | ESCUCHAR → INGLÉS
            |----------------------------------------------------------------------
            */

            if (tipo === 'listening') {

                const respuestaCorrecta =
                    word.word;


                return {

                    type: 'listening',

                    typeLabel:
                        'Escucha → Inglés',

                    question:
                        'Escucha y selecciona la palabra correcta.',

                    correctAnswer:
                        respuestaCorrecta,

                    wordId: word.id,

                    options:
                        crearOpciones(
                            respuestaCorrecta,
                            item => item.word
                        )

                };

            }


            /*
            |----------------------------------------------------------------------
            | COMPLETAR ORACIÓN
            |----------------------------------------------------------------------
            */

            if (
                tipo === 'sentence' &&
                word.example
            ) {

                const oracionIncompleta =
                    crearOracionIncompleta(
                        word.example,
                        word.word
                    );

                if (
                    oracionIncompleta === word.example
                ) {

                    return null;

                }

                return {

                    type: 'sentence',

                    typeLabel:
                        'Completar oración',

                    question:
                        oracionIncompleta,

                    correctAnswer:
                        word.word,

                    options:
                        crearOpciones(
                            word.word,
                            item => item.word
                        )

                };

            }


            return null;

        }


        /*
        |--------------------------------------------------------------------------
        | GENERAR PREGUNTAS
        |--------------------------------------------------------------------------
        */

        function generarPreguntas() {

            let palabras =
                obtenerPalabrasConSignificado();

            /*
            |--------------------------------------------------------------------------
            | REPETIR PALABRAS INCORRECTAS
            |--------------------------------------------------------------------------
            */

            if (selectedPracticeMode === 'incorrect') {

                palabras = palabras.filter(word =>
                    practice.incorrectWordIds.includes(
                        word.id
                    )
                );
            }

            if (palabras.length === 0) {
                return [];
            }

            /*
            |--------------------------------------------------------------------------
            | PRIORIDAD SEGÚN DOMINIO
            |--------------------------------------------------------------------------
            |
            | Las palabras con peor rendimiento tienen más posibilidades
            | de aparecer en la práctica.
            |
            */

            function obtenerPeso(word) {

                const stats =
                    practice.wordPracticeStats?.[word.id];

                /*
                | Nunca practicada
                */

                if (!stats || stats.total === 0) {
                    return 3;
                }

                /*
                | Muy bajo rendimiento
                */

                if (stats.accuracy < 50) {
                    return 6;
                }

                /*
                | En aprendizaje
                */

                if (stats.accuracy < 80) {
                    return 4;
                }

                /*
                | Buen rendimiento pero todavía no dominada
                */

                if (stats.total < 5) {
                    return 3;
                }

                /*
                | Palabra dominada
                */

                return 1;
            }


            /*
            |--------------------------------------------------------------------------
            | SELECCIÓN PONDERADA
            |--------------------------------------------------------------------------
            */

            function seleccionarPalabrasPonderadas(
                palabrasDisponibles,
                cantidad
            ) {

                const seleccionadas = [];

                const candidatos = [
                    ...palabrasDisponibles
                ];

                while (
                    candidatos.length > 0 &&
                    seleccionadas.length < cantidad
                ) {

                    let pesoTotal = 0;

                    candidatos.forEach(word => {

                        pesoTotal +=
                            obtenerPeso(word);

                    });

                    let objetivo =
                        Math.random() * pesoTotal;

                    let seleccionada = null;

                    for (const word of candidatos) {

                        objetivo -=
                            obtenerPeso(word);

                        if (objetivo <= 0) {

                            seleccionada = word;

                            break;
                        }
                    }

                    if (!seleccionada) {
                        break;
                    }

                    seleccionadas.push(
                        seleccionada
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Evitamos repetir la misma palabra
                    | dentro de esta práctica.
                    |--------------------------------------------------------------------------
                    */

                    const index =
                        candidatos.indexOf(
                            seleccionada
                        );

                    if (index !== -1) {

                        candidatos.splice(
                            index,
                            1
                        );
                    }
                }

                return seleccionadas;
            }


            /*
            |--------------------------------------------------------------------------
            | SELECCIONAR PALABRAS
            |--------------------------------------------------------------------------
            */

            const palabrasSeleccionadas =
                seleccionarPalabrasPonderadas(
                    palabras,
                    TOTAL_QUESTIONS
                );


            /*
            |--------------------------------------------------------------------------
            | TIPOS DE PREGUNTA
            |--------------------------------------------------------------------------
            */

            let tipos = [];

            if (
                selectedPracticeMode ===
                'english-spanish'
            ) {

                tipos = [
                    'english-spanish'
                ];

            } else if (
                selectedPracticeMode ===
                'spanish-english'
            ) {

                tipos = [
                    'spanish-english'
                ];

            } else if (
                selectedPracticeMode ===
                'listening'
            ) {

                tipos = [
                    'listening'
                ];

            } else if (
                selectedPracticeMode ===
                'mixed'
            ) {

                tipos = [
                    'english-spanish',
                    'spanish-english',
                    'listening'
                ];

            } else if (
                selectedPracticeMode ===
                'incorrect'
            ) {

                tipos = [
                    'english-spanish',
                    'spanish-english',
                    'listening'
                ];
            }


            /*
            |--------------------------------------------------------------------------
            | CREAR PREGUNTAS
            |--------------------------------------------------------------------------
            */

            const resultado = [];

            palabrasSeleccionadas.forEach(
                word => {

                    let tiposDisponibles =
                        mezclar(tipos);

                    let pregunta = null;

                    for (
                        const tipo of tiposDisponibles
                    ) {

                        pregunta =
                            crearPregunta(
                                word,
                                tipo
                            );

                        if (pregunta) {
                            break;
                        }
                    }

                    if (pregunta) {

                        resultado.push(
                            pregunta
                        );
                    }
                }
            );

            return resultado;
        }


        /*
        |--------------------------------------------------------------------------
        | MOSTRAR PREGUNTA
        |--------------------------------------------------------------------------
        */

        function mostrarPregunta() {

            const current =
                questions[
                currentQuestionIndex
                ];

            if (!current) {
                finalizarPractica();
                return;
            }

            if (autoNextTimer) {

                clearTimeout(
                    autoNextTimer
                );

                autoNextTimer = null;
            }

            answered = false;


            progress.textContent =
                `${currentQuestionIndex + 1} / ${questions.length}`;


            questionType.textContent =
                current.typeLabel;


            question.textContent =
                current.question;


            options.innerHTML = '';


            if (current.type === 'listening') {

                const listenButton =
                    document.createElement('button');

                listenButton.type = 'button';

                listenButton.className =
                    'english-practice-listen';

                listenButton.textContent =
                    '🔊 Escuchar';

                listenButton.addEventListener(
                    'click',
                    () => {

                        reproducirPalabra(
                            current.correctAnswer
                        );

                    }
                );

                question.appendChild(
                    listenButton
                );

            }


            feedback.style.display =
                'none';


            nextButton.style.display =
                'none';


            current.options.forEach(
                opcion => {

                    const button =
                        document.createElement(
                            'button'
                        );


                    button.type =
                        'button';


                    button.className =
                        'english-practice-option';


                    button.textContent =
                        opcion;


                    button.addEventListener(
                        'click',
                        () => {

                            responder(
                                opcion,
                                button,
                                current
                            );

                        }
                    );


                    options.appendChild(
                        button
                    );

                }
            );


            /*
            |----------------------------------------------------------------------
            | REPRODUCCIÓN AUTOMÁTICA PARA LISTENING
            |----------------------------------------------------------------------
            */

            if (
                current.type === 'listening'
            ) {

                const word =
                    practice.words.find(
                        item =>
                            item.word ===
                            current.correctAnswer
                    );


                if (word) {

                    reproducirPalabra(
                        word.word
                    );

                }

            }

        }


        async function guardarResultado(current, respuesta) {

            if (!current.wordId) {
                console.error('La pregunta no tiene wordId.');
                return;
            }

            const correcta = respuesta === current.correctAnswer;

            const response = await fetch(
                `/english/category/${practice.categoryId}/practice/result`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute('content'),
                    },
                    body: JSON.stringify({
                        english_word_id: current.wordId,
                        practice_session_id: practice.sessionId,
                        question_type: current.type,
                        user_answer: respuesta,
                        correct_answer: current.correctAnswer,
                        is_correct: correcta,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('No se pudo guardar la respuesta.');
            }

            return response.json();
        }

        /*
        |--------------------------------------------------------------------------
        | RESPONDER
        |--------------------------------------------------------------------------
        */

        async function responder(
            respuesta,
            button,
            current
        ) {

            if (answered) {

                return;

            }


            answered = true;


            const correcta =
                respuesta ===
                current.correctAnswer;

            await guardarResultado(
                current,
                respuesta
            );

            if (correcta) {
                score++;
                reproducirSonidoCorrecto();

                reproducirFeedback(
                    `¡Muy bien! La respuesta es: ${current.correctAnswer}`
                );


            } else {
                reproducirSonidoIncorrecto();


                reproducirFeedback(
                    `La respuesta correcta es: ${current.correctAnswer}`
                );

            }

            const botones =
                options.querySelectorAll(
                    'button'
                );


            botones.forEach(
                boton => {

                    boton.disabled =
                        true;


                    if (
                        boton.textContent ===
                        current.correctAnswer
                    ) {

                        boton.classList.add(
                            'correct'
                        );

                    }

                }
            );


            if (correcta) {

                button.classList.add(
                    'correct'
                );


                feedbackTitle.textContent =
                    '✅ ¡Correcto!';


                feedbackText.textContent =
                    `¡Muy bien! La respuesta es: ${current.correctAnswer}`;
            } else {

                button.classList.add(
                    'incorrect'
                );


                feedbackTitle.textContent =
                    '❌ Incorrecto';


                feedbackText.textContent =
                    `La respuesta correcta es: ${current.correctAnswer}`;

            }


            feedback.style.display =
                'block';


            nextButton.style.display =
                'inline-flex';

            if (autoNextEnabled) {

                const tiempoAutoNext =
                    practiceSoundsEnabled
                        ? 5000
                        : 1500;

                autoNextTimer =
                    setTimeout(
                        () => {
                            avanzarSiguiente();
                        },
                        tiempoAutoNext
                    );
            }

        }



        async function finalizarSesion() {

            const response = await fetch(
                `/english/category/${practice.categoryId}/practice/finish`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute('content'),
                    },
                    body: JSON.stringify({
                        practice_session_id: practice.sessionId,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('No se pudo finalizar la práctica.');
            }

            const data = await response.json();

            console.log(
                'FINALIZAR PRÁCTICA - STATUS:',
                response.status
            );

            console.log(
                'FINALIZAR PRÁCTICA - RESPUESTA:',
                data
            );

            return data;
        }


        function avanzarSiguiente() {

            if (autoNextTimer) {

                clearTimeout(
                    autoNextTimer
                );

                autoNextTimer = null;
            }

            currentQuestionIndex++;

            mostrarPregunta();
        }


        /*
        |--------------------------------------------------------------------------
        | SIGUIENTE
        |--------------------------------------------------------------------------
        */

        nextButton.addEventListener(
            'click',
            () => {
                avanzarSiguiente();
            }
        );

        /*
        |--------------------------------------------------------------------------
        | FINALIZAR
        |--------------------------------------------------------------------------
        */

        async function finalizarPractica() {
            try {
                const resultado = await finalizarSesion();

                console.log(
                    'RESULTADO RECIBIDO EN finalizarPractica:',
                    resultado
                );

                console.log(
                    'practiceCard:',
                    practiceCard
                );

                console.log(
                    'practiceResult:',
                    practiceResult
                );

                console.log(
                    'resultCategoryElement:',
                    resultCategoryElement
                );

                console.log(
                    'correctAnswersElement:',
                    correctAnswersElement
                );

                console.log(
                    'incorrectAnswersElement:',
                    incorrectAnswersElement
                );

                console.log(
                    'scoreElement:',
                    scoreElement
                );

                console.log(
                    'resultMessageElement:',
                    resultMessageElement
                );

                practiceCard.style.display = 'none';

                practiceResult.style.display = 'block';

                resultCategoryElement.textContent =
                    practice.categoryName;

                correctAnswersElement.textContent =
                    resultado.correct_answers;

                incorrectAnswersElement.textContent =
                    resultado.incorrect_answers;

                scoreElement.textContent =
                    `${resultado.score}%`;

                const percentage = resultado.score;

                if (percentage >= 90) {
                    resultMessageElement.textContent =
                        '🏆 ¡Excelente trabajo!';
                } else if (percentage >= 70) {
                    resultMessageElement.textContent =
                        '👏 ¡Muy bien! Sigue practicando.';
                } else if (percentage >= 50) {
                    resultMessageElement.textContent =
                        '💪 Vas por buen camino. Puedes mejorar.';
                } else {
                    resultMessageElement.textContent =
                        '📚 Sigue estudiando y vuelve a intentarlo.';
                }

            } catch (error) {
                console.error(
                    'ERROR DENTRO DE finalizarPractica:',
                    error
                );

                alert(
                    'ERROR: ' + error.message
                );
            }
        }
        /*
               |--------------------------------------------------------------------------
               | REINICIAR
               |--------------------------------------------------------------------------
               */

        async function reiniciarPractica() {

            practice.sessionId = crypto.randomUUID();

            practiceResult.style.display = 'none';
            practiceCard.style.display = 'block';

            currentQuestionIndex = 0;
            score = 0;
            answered = false;

            questions = generarPreguntas();

            try {

                await iniciarSesion();

                mostrarPregunta();

            } catch (error) {

                console.error(error);

                alert(
                    'No se pudo iniciar la nueva práctica.'
                );
            }
        }


        if (retryButton) {

            retryButton.addEventListener(
                'click',
                () => {
                    reiniciarPractica();
                }
            );

        }


        if (changeModeButton) {
            changeModeButton.addEventListener('click', () => {

                practice.sessionId = crypto.randomUUID();

                practiceResult.style.display = 'none';

                modeSelector.style.display = 'block';

                if (practiceCard) {
                    practiceCard.style.display = 'none';
                }

                questionType.style.display = 'none';
                question.style.display = 'none';
                options.style.display = 'none';
                listenContainer.style.display = 'none';
                feedback.style.display = 'none';
                nextButton.style.display = 'none';

                modeOptions.forEach(option => {
                    option.classList.remove('selected');
                });

                selectedPracticeMode = null;

                autoNextEnabled = true;

                if (autoNextButton) {

                    autoNextButton.textContent =
                        '⚡ Auto: ON';

                    autoNextButton.setAttribute(
                        'aria-pressed',
                        'true'
                    );

                    autoNextButton.classList.remove(
                        'disabled'
                    );
                }

                if (startButton) {
                    startButton.disabled = true;
                }
            });
        }


        /*
        |--------------------------------------------------------------------------
        | PRONUNCIACIÓN
        |--------------------------------------------------------------------------
        */

        function reproducirPalabra(palabra) {

            if (typeof pronunciarEnIngles === 'function') {
                pronunciarEnIngles(palabra, 'ingles');
            }
        }

        function reproducirFeedback(texto) {
            if (!practiceSoundsEnabled) {
                return;
            }

            if (typeof pronunciarEnIngles === 'function') {
                pronunciarEnIngles(texto, 'feedback');
            }
        }

        /*
        |--------------------------------------------------------------------------
        | INICIAR
        |--------------------------------------------------------------------------
        */

        if (startButton) {

            startButton.addEventListener('click', async () => {

                if (!practice.selectedMode) {
                    return;
                }

                try {

                    startButton.disabled = true;

                    await iniciarSesion();

                    modeSelector.style.display = 'none';

                    questions = generarPreguntas();

                    if (questions.length === 0) {
                        alert('No hay suficientes preguntas para practicar.');
                        return;
                    }

                    currentQuestionIndex = 0;
                    score = 0;
                    answered = false;

                    practiceCard.style.display = 'block';
                    practiceResult.style.display = 'none';

                    mostrarPregunta();

                } catch (error) {

                    console.error(error);

                    alert('No se pudo iniciar la práctica.');

                    console.error('ERROR AL INICIAR:', error);

                    alert(
                        'ERROR: ' + error.message
                    );

                } finally {

                    startButton.disabled = false;
                }
            });

        }



        if (autoNextButton) {

            autoNextButton.addEventListener(
                'click',
                () => {

                    autoNextEnabled =
                        !autoNextEnabled;

                    autoNextButton.setAttribute(
                        'aria-pressed',
                        autoNextEnabled
                            ? 'true'
                            : 'false'
                    );

                    if (autoNextEnabled) {

                        autoNextButton.textContent =
                            '⚡ Auto: ON';

                        autoNextButton.classList.remove(
                            'disabled'
                        );

                    } else {

                        autoNextButton.textContent =
                            '⏸ Auto: OFF';

                        autoNextButton.classList.add(
                            'disabled'
                        );

                        if (autoNextTimer) {

                            clearTimeout(
                                autoNextTimer
                            );

                            autoNextTimer = null;
                        }
                    }
                }
            );
        }







    }


})();