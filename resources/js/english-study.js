const study = window.englishStudy;

if (study) {

    let currentIndex = 0;

    // Mezclar las palabras aleatoriamente
    study.words.sort(() => Math.random() - 0.5);

    const progress =
        document.getElementById('study-progress');

    const currentWordElement =
        document.getElementById('study-current-word');

    const pronunciationGuide =
        document.getElementById('study-pronunciation-guide');

    const pronunciationText =
        document.getElementById('study-pronunciation-text');

    const pronunciationButton =
        pronunciationGuide?.querySelector(
            '.btn-study-pronunciation'
        );

    const meanings =
        document.getElementById('study-meanings');

    const example =
        document.getElementById('study-example');

    const exampleText =
        document.getElementById('study-example-text');

    const examplePronunciationButton =
        example?.querySelector(
            '.btn-study-example-pronunciation'
        );

    const exampleTranslation =
        document.getElementById(
            'study-example-translation'
        );

    const previousButton =
        document.getElementById(
            'btn-previous-word'
        );

    const nextButton =
        document.getElementById(
            'btn-next-word'
        );

    const completed =
        document.getElementById(
            'study-completed'
        );


    /*
    |--------------------------------------------------------------------------
    | RENDERIZAR PALABRA
    |--------------------------------------------------------------------------
    */

    function renderWord() {

        const word =
            study.words[currentIndex];

        if (!word) {
            return;
        }


        /*
        |--------------------------------------------------------------------------
        | PROGRESO
        |--------------------------------------------------------------------------
        */

        if (progress) {

            progress.textContent =
                `${currentIndex + 1} / ${study.words.length}`;

        }


        /*
        |--------------------------------------------------------------------------
        | PALABRA
        |--------------------------------------------------------------------------
        */

        if (currentWordElement) {

            currentWordElement.textContent =
                word.word || '';

        }


        /*
        |--------------------------------------------------------------------------
        | PRONUNCIACIÓN
        |--------------------------------------------------------------------------
        */

        if (pronunciationGuide) {

            if (word.pronunciation_guide) {

                pronunciationGuide.style.display =
                    'flex';

                if (pronunciationText) {

                    pronunciationText.textContent =
                        word.pronunciation_guide;

                }

            } else {

                pronunciationGuide.style.display =
                    'none';

                if (pronunciationText) {

                    pronunciationText.textContent =
                        '';

                }

            }

        }


        /*
        |--------------------------------------------------------------------------
        | ACTUALIZAR TEXTO DEL BOTÓN DE PRONUNCIACIÓN
        |--------------------------------------------------------------------------
        */

        if (pronunciationButton) {

            pronunciationButton.dataset.word =
                word.word || '';

        }


        /*
        |--------------------------------------------------------------------------
        | SIGNIFICADOS
        |--------------------------------------------------------------------------
        */

        if (meanings) {

            meanings.innerHTML = '';

            if (word.meanings && Array.isArray(word.meanings)) {

                word.meanings.forEach(
                    meaning => {

                        const p =
                            document.createElement('p');

                        p.textContent =
                            meaning.meaning || '';

                        meanings.appendChild(p);

                    }
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | EJEMPLO
        |--------------------------------------------------------------------------
        */

        if (example) {

            if (word.example) {

                example.style.display =
                    'flex';

                if (exampleText) {

                    exampleText.textContent =
                        word.example;

                }

                /*
                |--------------------------------------------------------------------------
                | ACTUALIZAR TEXTO DEL BOTÓN DEL EJEMPLO
                |--------------------------------------------------------------------------
                */

                if (examplePronunciationButton) {

                    examplePronunciationButton.dataset.example =
                        word.example;

                }


                /*
                |--------------------------------------------------------------------------
                | TRADUCCIÓN DEL EJEMPLO
                |--------------------------------------------------------------------------
                */

                if (exampleTranslation) {

                    if (word.example_translation) {

                        exampleTranslation.style.display =
                            'block';

                        exampleTranslation.textContent =
                            word.example_translation;

                    } else {

                        exampleTranslation.style.display =
                            'none';

                        exampleTranslation.textContent =
                            '';

                    }

                }

            } else {

                example.style.display =
                    'none';

                if (exampleText) {

                    exampleText.textContent =
                        '';

                }

                if (examplePronunciationButton) {

                    examplePronunciationButton.dataset.example =
                        '';

                }

                if (exampleTranslation) {

                    exampleTranslation.style.display =
                        'none';

                    exampleTranslation.textContent =
                        '';

                }

            }

        }


        /*
        |--------------------------------------------------------------------------
        | BOTÓN ANTERIOR
        |--------------------------------------------------------------------------
        */

        if (previousButton) {

            previousButton.style.display =
                currentIndex > 0
                    ? 'inline-block'
                    : 'none';

        }


        /*
        |--------------------------------------------------------------------------
        | BOTÓN SIGUIENTE
        |--------------------------------------------------------------------------
        */

        if (nextButton) {

            nextButton.style.display =
                currentIndex < study.words.length - 1
                    ? 'inline-block'
                    : 'none';

        }


        /*
        |--------------------------------------------------------------------------
        | COMPLETADO
        |--------------------------------------------------------------------------
        */

        if (completed) {

            completed.style.display =
                currentIndex === study.words.length - 1
                    ? 'inline-block'
                    : 'none';

        }


        /*
        |--------------------------------------------------------------------------
        | GUARDAR ÍNDICE ACTUAL
        |--------------------------------------------------------------------------
        */

        study.currentIndex =
            currentIndex;

    }


    /*
    |--------------------------------------------------------------------------
    | BOTÓN ANTERIOR
    |--------------------------------------------------------------------------
    */

    previousButton?.addEventListener(
        'click',
        () => {

            if (currentIndex <= 0) {
                return;
            }

            currentIndex--;

            renderWord();

        }
    );


    /*
    |--------------------------------------------------------------------------
    | BOTÓN SIGUIENTE
    |--------------------------------------------------------------------------
    */

    nextButton?.addEventListener(
        'click',
        () => {

            if (
                currentIndex >=
                study.words.length - 1
            ) {
                return;
            }

            currentIndex++;

            renderWord();

        }
    );


    /*
    |--------------------------------------------------------------------------
    | MOSTRAR PALABRA INICIAL
    |--------------------------------------------------------------------------
    */

    renderWord();

}