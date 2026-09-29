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
    | REPRODUCIR AUTOMÁTICAMENTE LA PALABRA
    |--------------------------------------------------------------------------
    */

    function reproducirPalabraAutomaticamente() {

        if (!pronunciationButton) {
            return;
        }

        const palabra =
            pronunciationButton.dataset.word;

        if (!palabra) {
            return;
        }

        /*
        |--------------------------------------------------------------
        | Pequeña espera para asegurarnos de que el contenido
        | ya fue actualizado en pantalla.
        |--------------------------------------------------------------
        */

        setTimeout(() => {

            pronunciationButton.click();

        }, 250);

    }


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

                    const ipa = word.pronunciation_guide;

                    const guia = convertirPronunciacion(ipa)
                        .replace(/^\/|\/$/g, '');

                    pronunciationText.textContent =
                        `${ipa} | ${guia}`;

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
        | ACTUALIZAR PALABRA DEL BOTÓN DE PRONUNCIACIÓN
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

            if (
                word.meanings &&
                Array.isArray(word.meanings)
            ) {

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
                | ACTUALIZAR BOTÓN DEL EJEMPLO
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


        /*
        |--------------------------------------------------------------------------
        | 🔊 REPRODUCCIÓN AUTOMÁTICA
        |--------------------------------------------------------------------------
        |
        | Cada vez que aparece una palabra nueva:
        | - Se muestra normalmente.
        | - Se actualiza su pronunciación.
        | - Se reproduce automáticamente una sola vez.
        |
        */

        reproducirPalabraAutomaticamente();

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



    /* 
|--------------------------------------------------------------------------
| CONVERTIR IPA A GUÍA DE PRONUNCIACIÓN
|--------------------------------------------------------------------------
*/




    function convertirPronunciacion(ipa) {

        if (!ipa) {
            return '';
        }

        const equivalencias = {

            // =========================================================
            // 3 O MÁS CARACTERES
            // =========================================================

            // Agrega aquí combinaciones de 3 o más si las tienes


            // =========================================================
            // COMBINACIONES CON DIACRÍTICOS
            // =========================================================

            't̬': 'd',
            'd̥': 't',
            's̬': 'z',
            'z̥': 's',


            // =========================================================
            // 2 CARACTERES
            // =========================================================

            'ɑː': 'aa',
            'iː': 'ii',
            'uː': 'uu',
            'ɔː': 'oo',
            'ɜː': 'er',
            'ɝː': 'er',

            'eɪ': 'ey',

            'tʃ': 'ch',
            'dʒ': 'jh',

            'əl': 'ol',
            'ɔɪ': 'oy',

            // ɪt solamente cuando la T es final de palabra
            'ɪt': 'et',


            // =========================================================
            // 1 CARÁCTER
            // =========================================================

            'ɛ': 'e',
            'j': 'y',
            'ʌ': 'o',
            'ŋ': 'nj',
            'ʊ': 'uo',
            'ɪ': 'ie',
            'æ': 'a',
            'ə': 'a',
            'θ': 'dh',
            'ð': 'dh',
            'ʃ': 'sh',
            'ɚ': 'er',
            'ʒ': 'zzh'
        };


        // =============================================================
        // DIACRÍTICOS COMBINABLES
        // =============================================================

        const diacriticos = new Set([
            '\u0300', // grave
            '\u0301', // acute
            '\u0302', // circumflex
            '\u0303', // tilde
            '\u0304', // macron
            '\u0306', // breve
            '\u0307', // dot above
            '\u0308', // diaeresis
            '\u030A', // ring above
            '\u030C', // caron
            '\u0310', // candrabindu
            '\u0311', // inverted breve
            '\u0312', // turned comma above
            '\u0313', // comma above
            '\u0314', // reversed comma above
            '\u0315', // comma above right
            '\u031B', // horn
            '\u0323', // dot below
            '\u0324', // diaeresis below
            '\u0325', // ring below
            '\u0329', // vertical line below
            '\u032A', // bridge below
            '\u032B', // arch below
            '\u032C', // inverted breve below
            '\u032D', // circumflex below
            '\u032E', // breve below
            '\u032F', // inverted breve below
            '\u0330', // tilde below
            '\u0331', // macron below
            '\u0332', // low line
            '\u0333'  // double low line
        ]);


        // =============================================================
        // CARACTERES QUE INDICAN FINAL DE PALABRA
        // =============================================================

        const finalesPalabra = new Set([
            '/',
            '.',
            '-',
            ' ',
            '\t',
            '\n',
            '\r'
        ]);


        // =============================================================
        // CLAVES MÁS LARGAS PRIMERO
        // =============================================================

        const simbolos = Object.keys(equivalencias)
            .sort((a, b) => b.length - a.length);


        let resultado = '';
        let i = 0;


        // =============================================================
        // BUSCAR COINCIDENCIAS
        // =============================================================

        while (i < ipa.length) {

            let reemplazado = false;


            for (const simbolo of simbolos) {

                if (!ipa.startsWith(simbolo, i)) {
                    continue;
                }


                const siguiente = i + simbolo.length;


                // =====================================================
                // ɪt SOLO SI LA T ES FINAL DE PALABRA
                // =====================================================

                if (simbolo === 'ɪt') {

                    // Si hay algo después de la T...
                    if (siguiente < ipa.length) {

                        const caracterSiguiente = ipa[siguiente];

                        // Si lo siguiente es un diacrítico,
                        // NO aplicar ɪt.
                        if (diacriticos.has(caracterSiguiente)) {
                            continue;
                        }

                        // Si lo siguiente no indica final de palabra,
                        // NO aplicar ɪt.
                        if (!finalesPalabra.has(caracterSiguiente)) {
                            continue;
                        }
                    }
                }


                // =====================================================
                // EVITAR COINCIDENCIAS PARCIALES ANTES DE UN DIACRÍTICO
                // =====================================================

                if (
                    siguiente < ipa.length &&
                    diacriticos.has(ipa[siguiente])
                ) {
                    continue;
                }


                // =====================================================
                // REEMPLAZAR
                // =====================================================

                resultado += equivalencias[simbolo];

                i += simbolo.length;

                reemplazado = true;

                break;
            }


            // =========================================================
            // SI NO ENCUENTRA NINGUNA EQUIVALENCIA
            // =========================================================

            if (!reemplazado) {

                resultado += ipa[i];

                i++;
            }
        }


        return resultado;
    }

    renderWord();

}