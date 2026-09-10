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

        const result =
            document.getElementById(
                'practice-result'
            );

        const scoreElement =
            document.getElementById(
                'practice-score'
            );

        const resultMessage =
            document.getElementById(
                'practice-result-message'
            );

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

        modeOptions.forEach(
            option => {

                option.addEventListener(
                    'click',
                    () => {

                        modeOptions.forEach(
                            item => {
                                item.classList.remove(
                                    'selected'
                                );
                            }
                        );

                        option.classList.add(
                            'selected'
                        );

                        selectedPracticeMode =
                            option.dataset.practiceMode;

                        if (startButton) {
                            startButton.disabled =
                                false;
                        }

                    }
                );

            }
        );

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

            const palabras =
                obtenerPalabrasConSignificado();


            if (palabras.length === 0) {

                return [];

            }


            const palabrasSeleccionadas =
                mezclar(palabras)
                    .slice(
                        0,
                        TOTAL_QUESTIONS
                    );


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

            }


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


        /*
        |--------------------------------------------------------------------------
        | RESPONDER
        |--------------------------------------------------------------------------
        */

        function responder(
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

        function finalizarPractica() {

            questionType.style.display =
                'none';

            question.style.display =
                'none';

            options.style.display =
                'none';

            feedback.style.display =
                'none';

            nextButton.style.display =
                'none';

            result.style.display =
                'block';


            scoreElement.textContent =
                `${score} / ${questions.length}`;


            const porcentaje =
                Math.round(
                    (
                        score /
                        questions.length
                    ) * 100
                );


            if (porcentaje >= 90) {

                resultMessage.textContent =
                    '¡Excelente! Dominas muy bien estas palabras.';

            } else if (porcentaje >= 70) {

                resultMessage.textContent =
                    '¡Muy bien! Sigue practicando para mejorar.';

            } else if (porcentaje >= 50) {

                resultMessage.textContent =
                    'Buen comienzo. Te conviene repasar algunas palabras.';

            } else {

                resultMessage.textContent =
                    'No te preocupes. Repasa las palabras y vuelve a intentarlo.';

            }

        }
        /*
               |--------------------------------------------------------------------------
               | REINICIAR
               |--------------------------------------------------------------------------
               */

        function reiniciarPractica() {

            questions = generarPreguntas();

            currentQuestionIndex = 0;

            score = 0;

            answered = false;

            questionType.style.display = 'inline-flex';

            question.style.display = 'block';

            options.style.display = 'grid';

            result.style.display = 'none';

            feedback.style.display = 'none';

            nextButton.style.display = 'none';

            mostrarPregunta();
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

                result.style.display = 'none';

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
            if (!practiceSoundsEnabled) {
                return;
            }

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

            startButton.addEventListener(
                'click',
                () => {

                    if (!selectedPracticeMode) {
                        return;
                    }

                    practice.selectedMode =
                        selectedPracticeMode;

                    modeSelector.style.display =
                        'none';

                    questions =
                        generarPreguntas();

                    if (practiceCard) {
                        practiceCard.style.display = 'block';
                    }

                    if (
                        questions.length === 0
                    ) {

                        modeSelector.style.display =
                            'block';

                        question.textContent =
                            'No hay suficientes datos para crear preguntas.';

                        return;

                    }

                    currentQuestionIndex = 0;

                    score = 0;

                    answered = false;

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

                    result.style.display =
                        'none';

                    questionType.style.display =
                        'inline-flex';

                    question.style.display =
                        'block';

                    options.style.display =
                        'grid';

                    mostrarPregunta();

                }
            );

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