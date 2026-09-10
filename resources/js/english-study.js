const study = window.englishStudy;

if (study) {

    let currentIndex = study.currentIndex;

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
            '.btn-pronunciation'
        );

    const meanings =
        document.getElementById('study-meanings');

    const example =
        document.getElementById('study-example');

    const exampleText =
        document.getElementById('study-example-text');

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

        progress.textContent =
            `${currentIndex + 1} / ${study.words.length}`;


        /*
        |--------------------------------------------------------------------------
        | PALABRA
        |--------------------------------------------------------------------------
        */

        currentWordElement.textContent =
            word.word;


        /*
        |--------------------------------------------------------------------------
        | PRONUNCIACIÓN
        |--------------------------------------------------------------------------
        */

        if (word.pronunciation_guide) {

            pronunciationGuide.style.display =
                'flex';

            pronunciationText.textContent =
                word.pronunciation_guide;

        } else {

            pronunciationGuide.style.display =
                'none';
        }


        if (pronunciationButton) {

            pronunciationButton.dataset.word =
                word.word;
        }


        /*
        |--------------------------------------------------------------------------
        | SIGNIFICADOS
        |--------------------------------------------------------------------------
        */

        meanings.innerHTML = '';


        if (word.meanings) {

            word.meanings.forEach(
                meaning => {

                    const p =
                        document.createElement('p');

                    p.textContent =
                        meaning.meaning;

                    meanings.appendChild(p);
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | EJEMPLO
        |--------------------------------------------------------------------------
        */

        if (word.example) {

            example.style.display =
                'flex';

            exampleText.textContent =
                word.example;


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

        } else {

            example.style.display =
                'none';

            exampleText.textContent =
                '';

            exampleTranslation.style.display =
                'none';

            exampleTranslation.textContent =
                '';
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
                currentIndex <
                study.words.length - 1
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
                currentIndex ===
                study.words.length - 1
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
    | ANTERIOR
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
    | SIGUIENTE
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