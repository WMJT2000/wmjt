document.addEventListener('DOMContentLoaded', () => {

    const page =
        document.getElementById('grammar-practice-app');

    if (!page || !window.grammarPracticeData) {
        return;
    }

    const data = window.grammarPracticeData;

    const selector =
        document.getElementById('practice-selector');

    const typeCards =
        Array.from(
            document.querySelectorAll('[data-practice-type]')
        );

    const startButton =
        document.getElementById('btn-start-practice');

    const selectorMessage =
        document.getElementById('practice-selector-message');

    const practiceCard =
        document.getElementById('practice-card');

    const resultCard =
        document.getElementById('practice-result');

    const progressLabel =
        document.getElementById('practice-progress');

    const progressBar =
        document.getElementById('practice-progress-bar');

    const questionType =
        document.getElementById('practice-question-type');

    const questionTopic =
        document.getElementById('practice-question-topic');

    const questionText =
        document.getElementById('practice-question-text');

    const questionInstruction =
        document.getElementById('practice-question-instruction');

    const exerciseBody =
        document.getElementById('practice-exercise-body');

    const feedback =
        document.getElementById('practice-feedback');

    const feedbackTitle =
        document.getElementById('practice-feedback-title');

    const feedbackAnswer =
        document.getElementById('practice-feedback-answer');

    const feedbackExplanation =
        document.getElementById('practice-feedback-explanation');

    const checkButton =
        document.getElementById('btn-check-practice');

    const nextButton =
        document.getElementById('btn-next-practice');

    const soundButton =
        document.getElementById('btn-toggle-feedback-sounds');

    const exitButton =
        document.getElementById('btn-exit-practice');

    const retryButton =
        document.getElementById('btn-retry-practice');

    const changeTypeButton =
        document.getElementById('btn-change-practice-type');

    const correctAnswers =
        document.getElementById('practice-correct-answers');

    const incorrectAnswers =
        document.getElementById('practice-incorrect-answers');

    const scoreLabel =
        document.getElementById('practice-score');

    const resultMessage =
        document.getElementById('practice-result-message');

    const csrfToken =
        document.querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? '';

    let selectedType = null;
    let exercises = [];
    let currentIndex = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let answered = false;
    let feedbackSoundsEnabled = true;


    if (soundButton) {
        soundButton.addEventListener('click', () => {
            feedbackSoundsEnabled = !feedbackSoundsEnabled;

            soundButton.setAttribute(
                'aria-pressed',
                feedbackSoundsEnabled ? 'false' : 'true'
            );

            soundButton.classList.toggle(
                'is-muted',
                !feedbackSoundsEnabled
            );

            soundButton.textContent =
                feedbackSoundsEnabled
                    ? 'Silenciar feedback'
                    : 'Activar feedback';
        });
    }


    typeCards.forEach(card => {

        if (card.disabled) {
            return;
        }

        card.addEventListener('click', () => {

            selectedType = card.dataset.practiceType;

            typeCards.forEach(item => {
                item.setAttribute(
                    'aria-pressed',
                    item === card ? 'true' : 'false'
                );
            });

            startButton.disabled = false;

            hideSelectorMessage();
        });

    });


    startButton.addEventListener('click', () => {
        start(selectedType);
    });


    nextButton.addEventListener('click', () => {

        if (currentIndex >= exercises.length - 1) {
            showResult();
            return;
        }

        currentIndex++;
        renderQuestion();
    });


    exitButton.addEventListener('click', () => {
        showSelector();
    });


    changeTypeButton.addEventListener('click', () => {
        showSelector();
    });


    retryButton.addEventListener('click', () => {
        start(selectedType);
    });


    function start(type)
    {
        if (!type) {
            return;
        }

        const label =
            startButton.querySelector('span');

        startButton.disabled = true;

        if (label) {
            label.textContent = 'Preparando...';
        }

        hideSelectorMessage();

        requestJson(data.startUrl, {
            type: type
        })
            .then(payload => {

                exercises = payload.exercises ?? [];

                if (exercises.length === 0) {
                    throw new Error(
                        'No hay ejercicios disponibles para este tipo.'
                    );
                }

                selectedType = type;
                currentIndex = 0;
                correctCount = 0;
                incorrectCount = 0;
                answered = false;

                selector.hidden = true;
                resultCard.hidden = true;
                practiceCard.hidden = false;

                renderQuestion();

                practiceCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            })
            .catch(error => {

                selector.hidden = false;
                practiceCard.hidden = true;
                resultCard.hidden = true;

                showSelectorMessage(error.message);
            })
            .finally(() => {

                startButton.disabled = selectedType === null;

                if (label) {
                    label.textContent = 'Iniciar práctica';
                }
            });
    }


    function requestJson(url, body)
    {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify(body)
        }).then(async response => {

            let payload = {};

            try {
                payload = await response.json();
            } catch (error) {
                payload = {};
            }

            if (!response.ok) {
                throw new Error(
                    payload.message ||
                    'No se pudo completar la solicitud.'
                );
            }

            return payload;
        });
    }


    function checkAnswer(answer)
    {
        if (answered) {
            return;
        }

        const exercise = exercises[currentIndex];

        answered = true;
        checkButton.disabled = true;

        requestJson(data.checkUrl, {
            exercise_id: exercise.id,
            answer: answer
        })
            .then(result => {

                disableCurrentExercise();

                if (result.correct) {
                    correctCount++;
                } else {
                    incorrectCount++;
                }

                markResult(result);

                showFeedback(result);

                nextButton.hidden = false;

                nextButton.textContent =
                    currentIndex >= exercises.length - 1
                        ? 'Ver resultado →'
                        : 'Siguiente pregunta →';
            })
            .catch(error => {

                answered = false;
                checkButton.disabled = false;

                feedback.hidden = false;
                feedback.className =
                    'grammar-practice-feedback is-wrong';

                feedbackTitle.textContent =
                    'No se pudo comprobar la respuesta';

                feedbackAnswer.textContent = error.message;
                feedbackExplanation.textContent = '';
            });
    }


    function renderQuestion()
    {
        const exercise = exercises[currentIndex];

        if (!exercise) {
            showResult();
            return;
        }

        answered = false;

        feedback.hidden = true;
        feedback.className = 'grammar-practice-feedback';

        nextButton.hidden = true;

        checkButton.hidden = false;
        checkButton.disabled = false;
        checkButton.onclick = null;

        exerciseBody.innerHTML = '';

        progressLabel.textContent =
            `${currentIndex + 1} / ${exercises.length}`;

        progressBar.style.width =
            `${((currentIndex + 1) / exercises.length) * 100}%`;

        const typeData =
            data.types[exercise.type] ?? {};

        questionType.textContent =
            typeData.label ?? exercise.type;

        questionTopic.textContent =
            exercise.topic || data.categoryName;

        questionText.textContent =
            exercise.question ?? '';

        questionInstruction.textContent =
            exercise.instruction ?? '';

        if (exercise.type === 'multiple_choice') {
            renderMultipleChoice(exercise);
        } else if (exercise.type === 'fill_in_the_blank') {
            renderFillInTheBlank(exercise);
        } else if (exercise.type === 'word_order') {
            renderWordOrder(exercise);
        } else if (exercise.type === 'matching') {
            renderMatching(exercise);
        } else {
            renderFillInTheBlank(exercise);
        }

        reproducirPregunta(exercise);
    }


    function reproducirPregunta(exercise)
    {
        if (
            !exercise.question ||
            !window.speechSynthesis ||
            typeof SpeechSynthesisUtterance === 'undefined' ||
            typeof window.reproducirPronunciacionSegmentos !== 'function'
        ) {
            return;
        }

        const idioma =
            exercise.type === 'matching'
                ? 'es-ES'
                : 'en-US';

        const texto =
            prepararTextoPregunta(exercise.question, idioma);

        if (!texto) {
            return;
        }

        window.reproducirPronunciacionSegmentos([
            {
                texto: texto,
                idioma: idioma
            }
        ]);
    }


    function prepararTextoPregunta(question, idioma)
    {
        let texto =
            String(question || '')
                .replace(/\s*[\/|]\s*/g, ', ')
                .replace(/\s+/g, ' ')
                .trim();

        if (idioma === 'en-US') {
            texto = texto.replace(/_{2,}/g, ' blank ');
        }

        return texto.replace(/\s+/g, ' ').trim();
    }


    function renderMultipleChoice(exercise)
    {
        if (!exercise.options || exercise.options.length === 0) {
            renderFillInTheBlank(exercise, true);
            return;
        }

        checkButton.hidden = true;

        const options =
            document.createElement('div');

        options.className = 'grammar-practice-options';

        exercise.options.forEach(option => {

            const button =
                document.createElement('button');

            button.type = 'button';
            button.className = 'grammar-practice-option';
            button.dataset.answer = option.text;
            button.textContent = option.text;

            button.addEventListener('click', () => {

                if (answered) {
                    return;
                }

                options
                    .querySelectorAll('.grammar-practice-option')
                    .forEach(item => {
                        item.classList.remove('is-selected');
                    });

                button.classList.add('is-selected');

                checkAnswer(option.text);
            });

            options.appendChild(button);
        });

        exerciseBody.appendChild(options);
    }


    function renderFillInTheBlank(exercise, fallback = false)
    {
        checkButton.hidden = false;
        checkButton.disabled = true;

        const form =
            document.createElement('form');

        form.className = 'grammar-practice-fill';

        const input =
            document.createElement('input');

        input.type = 'text';
        input.className = 'grammar-practice-input';
        input.placeholder = 'Escribe tu respuesta';
        input.autocomplete = 'off';
        input.spellcheck = false;

        const hint =
            document.createElement('span');

        hint.className = 'grammar-practice-input-hint';

        hint.textContent = fallback
            ? 'Este ejercicio no tiene opciones. Escribe la respuesta correcta.'
            : 'Puedes comprobar tu respuesta cuando termines de escribir.';

        input.addEventListener('input', () => {
            checkButton.disabled =
                answered || input.value.trim() === '';
        });

        form.addEventListener('submit', event => {

            event.preventDefault();

            if (answered || input.value.trim() === '') {
                return;
            }

            checkAnswer(input.value.trim());
        });

        form.appendChild(input);
        form.appendChild(hint);

        exerciseBody.appendChild(form);

        checkButton.onclick = () => {
            if (input.value.trim() === '') {
                input.focus();
                return;
            }

            checkAnswer(input.value.trim());
        };

        input.focus();
    }


    function renderWordOrder(exercise)
    {
        checkButton.hidden = false;
        checkButton.disabled = true;

        const tokens =
            (exercise.tokens && exercise.tokens.length > 0)
                ? exercise.tokens
                : splitQuestion(exercise.question);

        const pool =
            tokens.map((text, index) => ({
                id: index,
                text: text,
                used: false
            }));

        const selected = [];

        const wrapper =
            document.createElement('div');

        wrapper.className = 'grammar-practice-word-order';

        const answerZone =
            document.createElement('div');

        answerZone.className = 'grammar-practice-answer-zone';

        const words =
            document.createElement('div');

        words.className = 'grammar-practice-words';

        wrapper.appendChild(answerZone);
        wrapper.appendChild(words);

        function paint()
        {
            answerZone.innerHTML = '';
            words.innerHTML = '';

            answerZone.classList.toggle(
                'is-filled',
                selected.length > 0
            );

            if (selected.length === 0) {
                const placeholder =
                    document.createElement('span');

                placeholder.className =
                    'grammar-practice-placeholder';

                placeholder.textContent =
                    'Pulsa las palabras para ordenarlas aquí.';

                answerZone.appendChild(placeholder);
            }

            selected.forEach(id => {

                const token =
                    pool.find(item => item.id === id);

                if (!token) {
                    return;
                }

                const button =
                    document.createElement('button');

                button.type = 'button';
                button.className = 'grammar-practice-word';
                button.textContent = token.text;
                button.disabled = answered;

                button.addEventListener('click', () => {
                    if (answered) {
                        return;
                    }

                    const position =
                        selected.indexOf(id);

                    if (position !== -1) {
                        selected.splice(position, 1);
                    }

                    token.used = false;

                    paint();
                });

                answerZone.appendChild(button);
            });

            pool.forEach(token => {

                const button =
                    document.createElement('button');

                button.type = 'button';
                button.className = 'grammar-practice-word';

                if (token.used) {
                    button.classList.add('is-used');
                }

                button.textContent = token.text;
                button.disabled = answered || token.used;

                button.addEventListener('click', () => {
                    if (answered || token.used) {
                        return;
                    }

                    token.used = true;
                    selected.push(token.id);

                    paint();
                });

                words.appendChild(button);
            });

            checkButton.disabled =
                answered || selected.length !== pool.length;
        }

        paint();

        exerciseBody.appendChild(wrapper);

        checkButton.onclick = () => {

            if (selected.length !== pool.length) {
                return;
            }

            checkAnswer(
                selected.map(id => {
                    const token =
                        pool.find(item => item.id === id);

                    return token ? token.text : '';
                })
            );
        };
    }


    function renderMatching(exercise)
    {
        const leftItems =
            exercise.left_items ?? [];

        const rightItems =
            exercise.right_items ?? [];

        if (leftItems.length === 0 || rightItems.length === 0) {
            checkButton.hidden = true;

            const message =
                document.createElement('p');

            message.className = 'grammar-practice-placeholder';
            message.textContent =
                'Este ejercicio de relación no tiene parejas configuradas.';

            exerciseBody.appendChild(message);

            return;
        }

        checkButton.hidden = false;
        checkButton.disabled = true;

        const leftColumn =
            document.createElement('div');

        const rightColumn =
            document.createElement('div');

        const leftTitle =
            document.createElement('span');

        const rightTitle =
            document.createElement('span');

        const leftList =
            document.createElement('div');

        const rightList =
            document.createElement('div');

        const pairsBox =
            document.createElement('div');

        const wrapper =
            document.createElement('div');

        wrapper.className = 'grammar-practice-matching';

        leftColumn.className =
            'grammar-practice-match-column';

        rightColumn.className =
            'grammar-practice-match-column';

        leftTitle.className =
            'grammar-practice-match-title';

        rightTitle.className =
            'grammar-practice-match-title';

        leftList.className =
            'grammar-practice-match-list';

        rightList.className =
            'grammar-practice-match-list';

        pairsBox.className =
            'grammar-practice-matches';

        leftTitle.textContent = 'COLUMNA A';
        rightTitle.textContent = 'COLUMNA B';

        let selectedLeft = null;
        const pairs = [];

        leftItems.forEach((text, index) => {

            const button =
                document.createElement('button');

            button.type = 'button';
            button.className = 'grammar-practice-match-item';
            button.dataset.leftIndex = String(index);
            button.textContent = text;

            button.addEventListener('click', () => {

                if (answered) {
                    return;
                }

                const pairIndex =
                    pairs.findIndex(pair => pair.leftIndex === index);

                if (pairIndex !== -1) {
                    pairs.splice(pairIndex, 1);
                    selectedLeft = null;

                    paint();
                    return;
                }

                selectedLeft =
                    selectedLeft === index ? null : index;

                paint();
            });

            leftList.appendChild(button);
        });

        rightItems.forEach((text, index) => {

            const button =
                document.createElement('button');

            button.type = 'button';
            button.className = 'grammar-practice-match-item';
            button.dataset.rightIndex = String(index);
            button.textContent = text;

            button.addEventListener('click', () => {

                if (
                    answered ||
                    selectedLeft === null ||
                    pairs.some(pair => pair.rightIndex === index)
                ) {
                    return;
                }

                pairs.push({
                    leftIndex: selectedLeft,
                    rightIndex: index
                });

                selectedLeft = null;

                paint();
            });

            rightList.appendChild(button);
        });

        leftColumn.appendChild(leftTitle);
        leftColumn.appendChild(leftList);

        rightColumn.appendChild(rightTitle);
        rightColumn.appendChild(rightList);

        wrapper.appendChild(leftColumn);
        wrapper.appendChild(rightColumn);
        wrapper.appendChild(pairsBox);

        function paint()
        {
            leftColumn
                .querySelectorAll('.grammar-practice-match-item')
                .forEach(button => {

                    const index =
                        Number(button.dataset.leftIndex);

                    button.classList.toggle(
                        'is-selected',
                        selectedLeft === index
                    );

                    button.classList.toggle(
                        'is-matched',
                        pairs.some(pair => pair.leftIndex === index)
                    );

                    button.disabled = answered;
                });

            rightColumn
                .querySelectorAll('.grammar-practice-match-item')
                .forEach(button => {

                    const index =
                        Number(button.dataset.rightIndex);

                    const isUsed =
                        pairs.some(pair => pair.rightIndex === index);

                    button.classList.toggle('is-used', isUsed);

                    button.disabled = answered || isUsed;
                });

            pairsBox.innerHTML = '';

            pairs.forEach(pair => {

                const row =
                    document.createElement('div');

                const text =
                    document.createElement('span');

                const remove =
                    document.createElement('button');

                row.className = 'grammar-practice-match-row';

                text.textContent =
                    `${leftItems[pair.leftIndex]} → ${rightItems[pair.rightIndex]}`;

                remove.type = 'button';
                remove.className = 'grammar-practice-unmatch';
                remove.textContent = 'Quitar';
                remove.disabled = answered;

                remove.addEventListener('click', () => {
                    if (answered) {
                        return;
                    }

                    const position =
                        pairs.findIndex(item =>
                            item.leftIndex === pair.leftIndex &&
                            item.rightIndex === pair.rightIndex
                        );

                    if (position !== -1) {
                        pairs.splice(position, 1);
                    }

                    paint();
                });

                row.appendChild(text);
                row.appendChild(remove);
                pairsBox.appendChild(row);
            });

            checkButton.disabled =
                answered || pairs.length !== leftItems.length;
        }

        paint();

        exerciseBody.appendChild(wrapper);

        checkButton.onclick = () => {

            if (pairs.length !== leftItems.length) {
                return;
            }

            checkAnswer(
                pairs.map(pair =>
                    `${leftItems[pair.leftIndex]}|||${rightItems[pair.rightIndex]}`
                )
            );
        };
    }


    function splitQuestion(question)
    {
        const value = String(question ?? '').trim();

        if (value === '') {
            return [];
        }

        if (/[\/|]/.test(value)) {
            return value
                .split(/\s*[\/|]\s*/)
                .map(token => token.trim())
                .filter(Boolean);
        }

        return value
            .split(/\s+/)
            .map(token => token.trim())
            .filter(Boolean);
    }


    function disableCurrentExercise()
    {
        exerciseBody
            .querySelectorAll('input, button')
            .forEach(element => {
                element.disabled = true;
            });
    }


    function markResult(result)
    {
        const exercise = exercises[currentIndex];

        if (exercise.type === 'multiple_choice') {
            const correctAnswers =
                String(result.correct_answer ?? '')
                    .split(' / ')
                    .map(item => item.trim())
                    .filter(Boolean);

            exerciseBody
                .querySelectorAll('.grammar-practice-option')
                .forEach(button => {

                    button.disabled = true;

                    const option =
                        String(button.dataset.answer ?? '').trim();

                    const isSelected =
                        button.classList.contains('is-selected');

                    const isCorrectOption =
                        correctAnswers.includes(option);

                    if (
                        result.correct &&
                        (isSelected || isCorrectOption)
                    ) {
                        button.classList.add('is-correct');
                    }

                    if (!result.correct && isSelected) {
                        button.classList.add('is-wrong');
                    }

                    if (!result.correct && isCorrectOption) {
                        button.classList.add('is-correct');
                    }
                });
        }

        const wordOrder =
            exerciseBody.querySelector('.grammar-practice-word-order');

        if (wordOrder) {
            wordOrder.classList.add(
                result.correct ? 'is-correct' : 'is-wrong'
            );
        }

        const matching =
            exerciseBody.querySelector('.grammar-practice-matching');

        if (matching) {
            matching.classList.add(
                result.correct ? 'is-correct' : 'is-wrong'
            );
        }
    }


    function showFeedback(result)
    {
        feedback.hidden = false;

        feedback.className =
            'grammar-practice-feedback ' +
            (result.correct ? 'is-correct' : 'is-wrong');

        feedbackTitle.textContent =
            result.correct
                ? '¡Correcto!'
                : 'Respuesta incorrecta';

        const answer =
            String(result.correct_answer || '').trim();

        feedbackAnswer.textContent =
            `Respuesta correcta: ${answer || 'No disponible'}`;

        feedbackExplanation.textContent =
            result.explanation || '';

        reproducirRespuestaFeedback(answer);
    }


    function reproducirRespuestaFeedback(answer)
    {
        if (
            !feedbackSoundsEnabled ||
            !answer ||
            !window.speechSynthesis ||
            typeof SpeechSynthesisUtterance === 'undefined' ||
            typeof window.reproducirPronunciacionSegmentos !== 'function'
        ) {
            return;
        }

        const exercise = exercises[currentIndex];

        const segments = [
            {
                texto: 'Respuesta correcta:',
                idioma: 'es-ES'
            }
        ];

        if (exercise.type === 'matching') {
            const pairs =
                answer
                    .split(';')
                    .map(pair => pair.split(/\s*(?:→|↔|->|=>|=|:)\s*/, 2))
                    .filter(pair => pair.length === 2);

            if (pairs.length > 0) {
                pairs.forEach(pair => {
                    segments.push({
                        texto: pair[0],
                        idioma: 'en-US'
                    });

                    segments.push({
                        texto: pair[1],
                        idioma: 'es-ES'
                    });
                });
            } else {
                segments.push({
                    texto: answer,
                    idioma: 'en-US'
                });
            }
        } else {
            segments.push({
                texto: answer,
                idioma: 'en-US'
            });
        }

        window.reproducirPronunciacionSegmentos(segments);
    }


    function showResult()
    {
        const total = exercises.length;

        const score = total > 0
            ? Math.round((correctCount / total) * 100)
            : 0;

        practiceCard.hidden = true;
        selector.hidden = true;
        resultCard.hidden = false;

        correctAnswers.textContent = String(correctCount);
        incorrectAnswers.textContent = String(incorrectCount);
        scoreLabel.textContent = `${score}%`;

        if (score >= 90) {
            resultMessage.textContent =
                'Dominas muy bien este contenido. Sigue practicando para mantener el nivel.';
        } else if (score >= 70) {
            resultMessage.textContent =
                'Buen trabajo. Repasa las respuestas incorrectas y vuelve a intentarlo.';
        } else if (score >= 50) {
            resultMessage.textContent =
                'Vas por buen camino. Repasa la lección y practica una vez más.';
        } else {
            resultMessage.textContent =
                'No te preocupes. Vuelve a la lección, revisa los ejemplos y practica de nuevo.';
        }

        resultCard.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }


    function showSelector()
    {
        practiceCard.hidden = true;
        resultCard.hidden = true;
        selector.hidden = false;

        feedback.hidden = true;
        exerciseBody.innerHTML = '';

        selector.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }


    function showSelectorMessage(message)
    {
        if (!selectorMessage) {
            return;
        }

        selectorMessage.textContent = message;
        selectorMessage.hidden = false;
    }


    function hideSelectorMessage()
    {
        if (!selectorMessage) {
            return;
        }

        selectorMessage.textContent = '';
        selectorMessage.hidden = true;
    }


});
