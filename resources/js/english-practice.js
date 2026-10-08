
(() => {
    const practice = window.englishPractice;
    if (!practice) return;
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let answered = false;
    let autoNextEnabled = true;
    let autoNextTimer = null;
    let selectedPracticeMode = null;
    let practiceSoundsEnabled = true;
    let audioContext = null;
    const practiceCard = document.getElementById('practice-card');
    const practiceResult = document.getElementById('practice-result');
    const modeSelector = document.getElementById('practice-mode-selector');
    const modeOptions = document.querySelectorAll('.english-practice-mode-option');
    const startButton = document.getElementById('btn-start-practice');
    const progress = document.getElementById('practice-progress');
    const questionType = document.getElementById('practice-question-type');
    const question = document.getElementById('practice-question');
    const listenContainer = document.getElementById('practice-listen');
    const options = document.getElementById('practice-options');
    const feedback = document.getElementById('practice-feedback');
    const feedbackTitle = document.getElementById('practice-feedback-title');
    const feedbackText = document.getElementById('practice-feedback-text');
    const nextButton = document.getElementById('btn-next-practice');
    const autoNextButton = document.getElementById('btn-toggle-auto-next');
    const soundToggle = document.getElementById('btn-toggle-practice-sounds');
    const retryButton = document.getElementById('btn-retry-practice');
    const changeModeButton = document.getElementById('btn-change-practice-mode');
    const exitPracticeButton = document.getElementById('btn-exit-practice');
    const scoreElement = document.getElementById('practice-score');
    const resultMessageElement = document.getElementById('practice-result-message');
    const resultCategoryElement = document.getElementById('practice-result-category');
    const correctAnswersElement = document.getElementById('practice-correct-answers');
    const incorrectAnswersElement = document.getElementById('practice-incorrect-answers');

    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (option.disabled) return;
            modeOptions.forEach(item => item.classList.remove('selected'));
            option.classList.add('selected');
            selectedPracticeMode = option.dataset.practiceMode;
            practice.selectedMode = selectedPracticeMode;
            if (startButton) startButton.disabled = false;
        });
    });

    const questionCountOptions = document.querySelectorAll('.english-practice-question-count-option');

    questionCountOptions.forEach(option => {
        option.addEventListener('click', () => {
            questionCountOptions.forEach(item => item.classList.remove('selected'));
            option.classList.add('selected');
            practice.questionCount = parseInt(option.dataset.questionCount, 10);
        });
    });

    function mezclar(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    function obtenerAudioContext() {
        if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') audioContext.resume();
        return audioContext;
    }

    function reproducirSonidoCorrecto() {
        if (!practiceSoundsEnabled) return;
        const context = obtenerAudioContext();
        const ahora = context.currentTime;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, ahora);
        oscillator.frequency.setValueAtTime(659.25, ahora + 0.10);
        oscillator.frequency.setValueAtTime(783.99, ahora + 0.20);
        gain.gain.setValueAtTime(0.0001, ahora);
        gain.gain.exponentialRampToValueAtTime(0.25, ahora + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.35);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(ahora);
        oscillator.stop(ahora + 0.35);
    }

    function reproducirSonidoIncorrecto() {
        if (!practiceSoundsEnabled) return;
        const context = obtenerAudioContext();
        const ahora = context.currentTime;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, ahora);
        oscillator.frequency.exponentialRampToValueAtTime(130, ahora + 0.25);
        gain.gain.setValueAtTime(0.0001, ahora);
        gain.gain.exponentialRampToValueAtTime(0.20, ahora + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.30);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(ahora);
        oscillator.stop(ahora + 0.30);
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            practiceSoundsEnabled = !practiceSoundsEnabled;
            soundToggle.setAttribute('aria-pressed', practiceSoundsEnabled ? 'false' : 'true');
            if (practiceSoundsEnabled) {
                soundToggle.textContent = '🔊 Sonidos';
                soundToggle.classList.remove('muted');
            } else {
                soundToggle.textContent = '🔇 Sonidos';
                soundToggle.classList.add('muted');
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            }
        });
    }

    function obtenerSignificado(word) {
        if (!word.meanings || word.meanings.length === 0) return null;
        return word.meanings[0].meaning;
    }

    function obtenerPalabrasConSignificado() {
        return practice.words.filter(word => word.meanings && word.meanings.length > 0);
    }

    function normalizarRespuesta(texto) {
        return String(texto || '').trim().toLowerCase().replace(/\s+/g, ' ');
    }

    function crearOracionIncompleta(oracion, palabra) {
        const palabraEscapada = palabra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const expresion = new RegExp(`\\b${palabraEscapada}\\b`, 'i');
        return oracion.replace(expresion, '____');
    }

    function crearOpciones(respuestaCorrecta, obtenerRespuesta) {
        const opciones = [respuestaCorrecta];
        const candidatos = mezclar(practice.words);
        for (const word of candidatos) {
            const respuesta = obtenerRespuesta(word);
            if (respuesta && !opciones.includes(respuesta)) opciones.push(respuesta);
            if (opciones.length === 4) break;
        }
        return mezclar(opciones);
    }

    function crearPregunta(word, tipo) {
        if (tipo === 'english-spanish') {
            const respuestaCorrecta = obtenerSignificado(word);
            if (!respuestaCorrecta) return null;
            return {
                type: 'english-spanish',
                typeLabel: 'Inglés → Español',
                question: word.word,
                pronunciationGuide: word.pronunciation_guide || '',
                correctAnswer: respuestaCorrecta,
                meaning: respuestaCorrecta,
                wordId: word.id,
                options: crearOpciones(respuestaCorrecta, obtenerSignificado)
            };
        }

        if (tipo === 'spanish-english') {
            const significado = obtenerSignificado(word);
            if (!significado) return null;
            const respuestaCorrecta = word.word;
            return {
                type: 'spanish-english',
                typeLabel: 'Español → Inglés',
                question: significado,
                correctAnswer: respuestaCorrecta,
                meaning: significado,
                wordId: word.id,
                options: crearOpciones(respuestaCorrecta, item => item.word)
            };
        }

        if (tipo === 'listening') {
            return {
                type: 'listening',
                typeLabel: 'Escucha → Escribe',
                question: 'Escucha la palabra y escríbela.',
                correctAnswer: word.word,
                meaning: obtenerSignificado(word),
                wordId: word.id
            };
        }

        if (tipo === 'english-meaning') {
            const significado = obtenerSignificado(word);
            if (!significado) return null;
            return {
                type: 'english-meaning',
                typeLabel: 'Inglés → Escribir significado',
                question: word.word,
                pronunciationGuide: word.pronunciation_guide || '',
                correctAnswer: significado,
                meaning: significado,
                wordId: word.id
            };
        }

        if (tipo === 'spanish-word') {
            const significado = obtenerSignificado(word);
            if (!significado) return null;
            return {
                type: 'spanish-word',
                typeLabel: 'Español → Escribir inglés',
                question: significado,
                correctAnswer: word.word,
                meaning: significado,
                wordId: word.id
            };
        }

        if (tipo === 'sentence' && word.example) {
            const oracionIncompleta = crearOracionIncompleta(word.example, word.word);
            if (oracionIncompleta === word.example) return null;
            return {
                type: 'sentence',
                typeLabel: 'Completar oración',
                question: oracionIncompleta,
                correctAnswer: word.word,
                wordId: word.id,
                options: crearOpciones(word.word, item => item.word)
            };
        }

        return null;
    }

function generarPreguntas() {
    let palabras = [...practice.words];

    if (selectedPracticeMode === 'incorrect') {
        const incorrectWordIds = practice.incorrectWordIds || [];
        palabras = palabras.filter(word => incorrectWordIds.includes(word.id));
    }

    if (selectedPracticeMode !== 'listening') {
        palabras = palabras.filter(word => word.meanings && word.meanings.length > 0);
    }

    if (palabras.length === 0) {
        console.warn('NO HAY PALABRAS DISPONIBLES');
        return [];
    }

    const totalQuestions = Math.min(practice.questionCount, palabras.length);

    function obtenerPeso(word) {
        const stats = practice.wordPracticeStats?.[word.id];
        if (!stats || stats.total === 0) return 3;
        if (stats.accuracy < 50) return 6;
        if (stats.accuracy < 80) return 4;
        if (stats.total < 5) return 3;
        return 1;
    }

    function seleccionarPalabrasPonderadas(palabrasDisponibles, cantidad) {
        const seleccionadas = [];
        const candidatos = [...palabrasDisponibles];

        while (candidatos.length > 0 && seleccionadas.length < cantidad) {
            let pesoTotal = 0;

            candidatos.forEach(word => {
                pesoTotal += obtenerPeso(word);
            });

            let objetivo = Math.random() * pesoTotal;
            let seleccionada = null;

            for (const word of candidatos) {
                objetivo -= obtenerPeso(word);

                if (objetivo <= 0) {
                    seleccionada = word;
                    break;
                }
            }

            if (!seleccionada) break;

            seleccionadas.push(seleccionada);

            const index = candidatos.indexOf(seleccionada);
            if (index !== -1) candidatos.splice(index, 1);
        }

        return seleccionadas;
    }

    const palabrasSeleccionadas = seleccionarPalabrasPonderadas(palabras, totalQuestions);

    let tipos = [];

    if (selectedPracticeMode === 'english-spanish') {
        tipos = ['english-spanish'];
    } else if (selectedPracticeMode === 'spanish-english') {
        tipos = ['spanish-english'];
    } else if (selectedPracticeMode === 'listening') {
        tipos = ['listening'];
    } else if (selectedPracticeMode === 'english-meaning') {
        tipos = ['english-meaning'];
    } else if (selectedPracticeMode === 'spanish-word') {
        tipos = ['spanish-word'];
    } else if (selectedPracticeMode === 'mixed') {
        tipos = ['english-spanish', 'spanish-english', 'listening', 'english-meaning', 'spanish-word'];
    } else if (selectedPracticeMode === 'incorrect') {
        tipos = ['english-spanish', 'spanish-english', 'listening', 'english-meaning', 'spanish-word'];
    }

    if (tipos.length === 0) {
        console.error('NO HAY TIPOS DE PREGUNTA PARA:', selectedPracticeMode);
        return [];
    }

    const resultado = [];

    palabrasSeleccionadas.forEach(word => {
        const tiposDisponibles = mezclar(tipos);
        let pregunta = null;

        for (const tipo of tiposDisponibles) {
            pregunta = crearPregunta(word, tipo);

            if (pregunta) break;
        }

        if (pregunta) resultado.push(pregunta);
    });

    return resultado;
}
    function mostrarPregunta() {
        const current = questions[currentQuestionIndex];

        if (!current) {
            finalizarPractica();
            return;
        }

        if (autoNextTimer) {
            clearTimeout(autoNextTimer);
            autoNextTimer = null;
        }

        if ('speechSynthesis' in window) window.speechSynthesis.cancel();

        answered = false;
        questionType.style.display = '';
        question.style.display = '';
        options.style.display = '';
        listenContainer.style.display = 'none';
        progress.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
        questionType.textContent = current.typeLabel;
        question.textContent = '';

        if (current.type === 'english-spanish' || current.type === 'english-meaning') {
            const questionContent = document.createElement('div');
            questionContent.className = 'english-practice-question-word';

            const wordText = document.createElement('span');
            wordText.textContent = current.question;

            const pronunciationButton = document.createElement('button');
            pronunciationButton.type = 'button';
            pronunciationButton.className = 'english-practice-pronunciation-button';
            pronunciationButton.textContent = '🔊';
            pronunciationButton.setAttribute('aria-label', 'Reproducir pronunciación');
            pronunciationButton.addEventListener('click', () => {
                reproducirPalabra(current.question);
            });

            const pronunciationToggle = document.createElement('button');
            pronunciationToggle.type = 'button';
            pronunciationToggle.className = 'english-practice-pronunciation-toggle';
            pronunciationToggle.textContent = '⌄';
            pronunciationToggle.setAttribute('aria-expanded', 'false');

            const pronunciationGuide = document.createElement('div');
            pronunciationGuide.className = 'english-practice-pronunciation-guide';

            const ipa = current.pronunciationGuide || '';

            if (typeof window.convertirPronunciacion === 'function') {
                const guia = window.convertirPronunciacion(current.question, ipa);
                pronunciationGuide.textContent = `${ipa} | ${guia.replace(/^\/|\/$/g, '')}`;
            } else {
                pronunciationGuide.textContent = ipa;
            }

            pronunciationGuide.style.display = 'none';

            pronunciationToggle.addEventListener('click', () => {
                const visible = pronunciationGuide.style.display !== 'none';
                pronunciationGuide.style.display = visible ? 'none' : 'block';
                pronunciationToggle.textContent = visible ? '⌄' : '⌃';
                pronunciationToggle.setAttribute('aria-expanded', visible ? 'false' : 'true');
            });

            const buttons = document.createElement('div');
            buttons.className = 'english-practice-pronunciation-actions';
            buttons.appendChild(pronunciationButton);
            buttons.appendChild(pronunciationToggle);

            questionContent.appendChild(wordText);
            questionContent.appendChild(buttons);
            question.appendChild(questionContent);
            question.appendChild(pronunciationGuide);
        } else {
            question.textContent = current.question;
        }

        options.innerHTML = '';

        if (current.type === 'listening' || current.type === 'english-meaning' || current.type === 'spanish-word') {
            options.style.display = 'block';

            const answerWrapper = document.createElement('div');
            answerWrapper.className = 'english-practice-listening-answer';

            if (current.type === 'listening') {
                const listenButton = document.createElement('button');
                listenButton.type = 'button';
                listenButton.className = 'english-practice-listen';
                listenButton.textContent = '🔊 Escuchar';
                listenButton.addEventListener('click', () => {
                    reproducirPalabra(current.correctAnswer);
                });
                answerWrapper.appendChild(listenButton);
            }

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'english-practice-answer-input';
            input.placeholder = current.type === 'english-meaning' ? 'Escribe el significado...' : current.type === 'spanish-word' ? 'Escribe la palabra en inglés...' : 'Escribe la palabra...';
            input.autocomplete = 'off';
            input.autocapitalize = 'none';
            input.spellcheck = false;
            input.setAttribute('aria-label', current.type === 'english-meaning' ? 'Escribe el significado' : current.type === 'spanish-word' ? 'Escribe la palabra en inglés' : 'Escribe la palabra que escuchaste');

            const answerButton = document.createElement('button');
            answerButton.type = 'button';
            answerButton.className = 'english-practice-submit-answer';
            answerButton.textContent = 'Responder';

            const enviarRespuesta = () => {
                if (answered) return;

                const respuesta = input.value.trim();

                if (!respuesta) {
                    input.focus();
                    return;
                }

                responder(respuesta, answerButton, current);
            };

            answerButton.addEventListener('click', enviarRespuesta);

            input.addEventListener('keydown', event => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    enviarRespuesta();
                }
            });

            answerWrapper.appendChild(input);
            answerWrapper.appendChild(answerButton);
            options.appendChild(answerWrapper);

            if (current.type === 'listening') {
                setTimeout(() => {
                    if (!answered) reproducirPalabra(current.correctAnswer);
                }, 300);
            } else if (current.type === 'english-meaning') {
                setTimeout(() => {
                    if (!answered) reproducirPalabra(current.question);
                }, 300);
            }

            setTimeout(() => {
                if (!answered) input.focus();
            }, 500);
        }

        if (current.type !== 'listening' && current.type !== 'english-meaning' && current.type !== 'spanish-word') {
            current.options.forEach(opcion => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'english-practice-option';
                button.textContent = opcion;
                button.addEventListener('click', () => {
                    responder(opcion, button, current);
                });
                options.appendChild(button);
            });
        }

        feedback.style.display = 'none';
        nextButton.style.display = 'none';

        if (current.type === 'english-spanish') {
            setTimeout(() => {
                if (!answered) reproducirPalabra(current.question);
            }, 300);
        }
    }

    async function iniciarSesion() {
        const response = await fetch(`/english/category/${practice.categoryId}/practice/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                practice_session_id: practice.sessionId,
                practice_mode: practice.selectedMode
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'No se pudo iniciar la práctica.');
        }

        return data;
    }

    async function guardarResultado(current, respuesta) {
        if (!current.wordId) {
            console.error('La pregunta no tiene wordId.');
            return;
        }

        const correcta = normalizarRespuesta(respuesta) === normalizarRespuesta(current.correctAnswer);

        const response = await fetch(`/english/category/${practice.categoryId}/practice/result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                english_word_id: current.wordId,
                practice_session_id: practice.sessionId,
                question_type: current.type,
                user_answer: respuesta,
                correct_answer: current.correctAnswer,
                is_correct: correcta
            })
        });

        if (!response.ok) throw new Error('No se pudo guardar la respuesta.');

        return response.json();
    }

async function responder(respuesta, button, current) {
    if (answered) return;

    answered = true;

    const correcta = normalizarRespuesta(respuesta) === normalizarRespuesta(current.correctAnswer);
    const significado = current.meaning || obtenerSignificado(practice.words.find(word => word.id === current.wordId)) || 'Sin significado disponible';

    try {
        await guardarResultado(current, respuesta);
    } catch (error) {
        console.error('ERROR GUARDANDO RESPUESTA:', error);
    }

    if (correcta) {
        score++;
        reproducirSonidoCorrecto();
    } else {
        reproducirSonidoIncorrecto();
    }

    const botones = options.querySelectorAll('button');

    botones.forEach(boton => {
        boton.disabled = true;

        if (boton.textContent === current.correctAnswer) {
            boton.classList.add('correct');
        }
    });

    const inputRespuesta = options.querySelector('.english-practice-answer-input');

    if (inputRespuesta) {
        inputRespuesta.disabled = true;
        inputRespuesta.classList.add(correcta ? 'correct' : 'incorrect');
    }

if (current.type === 'listening') {
    if (correcta) {
        feedbackTitle.textContent = '✅ ¡Correcto!';
        feedbackText.textContent = `¡Muy bien! La respuesta es: ${current.correctAnswer} — ${significado}`;
        reproducirFeedback(`¡Muy bien! La respuesta es ${current.correctAnswer}`);
    } else {
        feedbackTitle.textContent = '❌ Incorrecto';
        feedbackText.textContent = `Escribiste: ${respuesta} | Correcta: ${current.correctAnswer} — ${significado}`;
        reproducirFeedback(`Incorrecto. La respuesta correcta es ${current.correctAnswer}`);
    }
} else if (current.type === 'english-meaning') {
        if (correcta) {
            feedbackTitle.textContent = '✅ ¡Correcto!';
            feedbackText.textContent = `¡Muy bien! La respuesta es: ${current.correctAnswer}`;
            reproducirFeedback(`¡Muy bien! La respuesta es ${current.correctAnswer}`);
        } else {
            feedbackTitle.textContent = '❌ Incorrecto';
            feedbackText.textContent = `Escribiste: ${respuesta} | Correcta: ${current.correctAnswer}`;
            reproducirFeedback(`Incorrecto. La respuesta correcta es ${current.correctAnswer}`);
        }
    } else if (current.type === 'spanish-word') {
        if (correcta) {
            feedbackTitle.textContent = '✅ ¡Correcto!';
            feedbackText.textContent = `¡Muy bien! La respuesta es: ${current.correctAnswer}`;
            reproducirFeedback(`¡Muy bien! La respuesta es ${current.correctAnswer}`);
        } else {
            feedbackTitle.textContent = '❌ Incorrecto';
            feedbackText.textContent = `Escribiste: ${respuesta} | Correcta: ${current.correctAnswer}`;
            reproducirFeedback(`Incorrecto. La respuesta correcta es ${current.correctAnswer}`);
        }
    } else if (correcta) {
        if (button) button.classList.add('correct');

        feedbackTitle.textContent = '✅ ¡Correcto!';
        feedbackText.textContent = `¡Muy bien! La respuesta es: ${current.correctAnswer}`;
        reproducirFeedback(`¡Muy bien! La respuesta es ${current.correctAnswer}`);
    } else {
        if (button) button.classList.add('incorrect');

        feedbackTitle.textContent = '❌ Incorrecto';
        feedbackText.textContent = `La respuesta correcta es: ${current.correctAnswer}`;
        reproducirFeedback(`Incorrecto. La respuesta correcta es ${current.correctAnswer}`);
    }

    feedback.style.display = 'block';
    nextButton.style.display = 'inline-flex';

    if (autoNextEnabled) {
        const tiempoAutoNext = practiceSoundsEnabled ? 5000 : 1500;

        autoNextTimer = setTimeout(() => {
            avanzarSiguiente();
        }, tiempoAutoNext);
    }
}

    function avanzarSiguiente() {
        if (autoNextTimer) {
            clearTimeout(autoNextTimer);
            autoNextTimer = null;
        }

        if ('speechSynthesis' in window) window.speechSynthesis.cancel();

        currentQuestionIndex++;
        mostrarPregunta();
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            avanzarSiguiente();
        });
    }

    async function finalizarSesion() {
        const response = await fetch(`/english/category/${practice.categoryId}/practice/finish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                practice_session_id: practice.sessionId
            })
        });

        if (!response.ok) throw new Error('No se pudo finalizar la práctica.');

        return response.json();
    }

    async function finalizarPractica() {
        try {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();

            const resultado = await finalizarSesion();

            practiceCard.style.display = 'none';
            practiceResult.style.display = 'block';
            resultCategoryElement.textContent = practice.categoryName;
            correctAnswersElement.textContent = resultado.correct_answers;
            incorrectAnswersElement.textContent = resultado.incorrect_answers;
            scoreElement.textContent = `${resultado.score}%`;

            const percentage = resultado.score;

            if (percentage >= 90) {
                resultMessageElement.textContent = '🏆 ¡Excelente trabajo!';
            } else if (percentage >= 70) {
                resultMessageElement.textContent = '👏 ¡Muy bien! Sigue practicando.';
            } else if (percentage >= 50) {
                resultMessageElement.textContent = '💪 Vas por buen camino. Puedes mejorar.';
            } else {
                resultMessageElement.textContent = '📚 Sigue estudiando y vuelve a intentarlo.';
            }
        } catch (error) {
            console.error('ERROR DENTRO DE finalizarPractica:', error);
            alert('ERROR: ' + error.message);
        }
    }

    async function reiniciarPractica() {
        if (autoNextTimer) {
            clearTimeout(autoNextTimer);
            autoNextTimer = null;
        }

        if ('speechSynthesis' in window) window.speechSynthesis.cancel();

        practice.sessionId = crypto.randomUUID();
        currentQuestionIndex = 0;
        score = 0;
        answered = false;
        questions = generarPreguntas();

        if (questions.length === 0) {
            alert('No hay suficientes preguntas para practicar.');
            return;
        }

        try {
            await iniciarSesion();
            practiceResult.style.display = 'none';
            modeSelector.style.display = 'none';
            practiceCard.style.display = 'block';
            mostrarPregunta();
        } catch (error) {
            console.error(error);
            alert('No se pudo iniciar la nueva práctica.');
        }
    }

    if (retryButton) {
        retryButton.addEventListener('click', () => {
            reiniciarPractica();
        });
    }

    function volverAlSelector() {
        if (autoNextTimer) {
            clearTimeout(autoNextTimer);
            autoNextTimer = null;
        }

        if ('speechSynthesis' in window) window.speechSynthesis.cancel();

        questions = [];
        currentQuestionIndex = 0;
        score = 0;
        answered = false;

        if (practiceCard) practiceCard.style.display = 'none';
        if (practiceResult) practiceResult.style.display = 'none';
        if (modeSelector) modeSelector.style.display = 'block';

        if (questionType) {
            questionType.style.display = '';
            questionType.textContent = '';
        }

        if (question) {
            question.style.display = '';
            question.textContent = '';
        }

        if (options) {
            options.style.display = '';
            options.innerHTML = '';
        }

        if (listenContainer) {
            listenContainer.style.display = 'none';
            listenContainer.innerHTML = '';
        }

        if (feedback) feedback.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';

        practice.sessionId = crypto.randomUUID();
    }

    if (changeModeButton) {
        changeModeButton.addEventListener('click', () => {
            volverAlSelector();

            modeOptions.forEach(option => {
                option.classList.remove('selected');
            });

            selectedPracticeMode = null;
            practice.selectedMode = null;

            if (startButton) startButton.disabled = true;

            autoNextEnabled = true;

            if (autoNextButton) {
                autoNextButton.textContent = '⚡ Auto: ON';
                autoNextButton.setAttribute('aria-pressed', 'true');
                autoNextButton.classList.remove('disabled');
            }
        });
    }

    if (exitPracticeButton) {
        exitPracticeButton.addEventListener('click', () => {
            volverAlSelector();

            modeOptions.forEach(option => {
                option.classList.remove('selected');
            });

            selectedPracticeMode = null;
            practice.selectedMode = null;

            if (startButton) startButton.disabled = true;
        });
    }

    function reproducirPalabra(palabra) {
        if (!palabra || !practiceSoundsEnabled) return;

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        if (typeof window.reproducirPronunciacion === 'function') {
            setTimeout(() => {
                if (practiceSoundsEnabled) {
                    window.reproducirPronunciacion(palabra);
                }
            }, 100);
        }
    }

    function reproducirFeedback(texto) {
        if (!practiceSoundsEnabled || !texto) return;

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        if (typeof window.reproducirPronunciacion === 'function') {
            setTimeout(() => {
                if (practiceSoundsEnabled) {
                    window.reproducirPronunciacion(texto);
                }
            }, 150);
        }
    }

    if (startButton) {
        startButton.addEventListener('click', async () => {
            if (!practice.selectedMode) return;

            try {
                startButton.disabled = true;
                questions = generarPreguntas();

                if (questions.length === 0) {
                    alert('No hay suficientes preguntas para practicar.');
                    return;
                }

                practice.sessionId = crypto.randomUUID();
                await iniciarSesion();

                currentQuestionIndex = 0;
                score = 0;
                answered = false;
                modeSelector.style.display = 'none';
                practiceResult.style.display = 'none';
                practiceCard.style.display = 'block';
                questionType.style.display = '';
                question.style.display = '';
                options.style.display = '';
                mostrarPregunta();
            } catch (error) {
                console.error('ERROR AL INICIAR:', error);
                alert('No se pudo iniciar la práctica: ' + error.message);
            } finally {
                startButton.disabled = !practice.selectedMode;
            }
        });
    }

    if (autoNextButton) {
        autoNextButton.addEventListener('click', () => {
            autoNextEnabled = !autoNextEnabled;
            autoNextButton.setAttribute('aria-pressed', autoNextEnabled ? 'true' : 'false');

            if (autoNextEnabled) {
                autoNextButton.textContent = '⚡ Auto: ON';
                autoNextButton.classList.remove('disabled');
            } else {
                autoNextButton.textContent = '⏸ Auto: OFF';
                autoNextButton.classList.add('disabled');

                if (autoNextTimer) {
                    clearTimeout(autoNextTimer);
                    autoNextTimer = null;
                }
            }
        });
    }
})();

