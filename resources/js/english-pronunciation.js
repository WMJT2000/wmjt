let vozIngles = null;



function cargarVoz() {

    const voices =
        window.speechSynthesis.getVoices();

    vozIngles =
        voices.find(voice =>
            voice.name === 'Google US English' &&
            voice.lang === 'en-US'
        );

        

    console.log(
        '🎙️ Voz seleccionada:',
        vozIngles
    );
}



window.speechSynthesis.addEventListener(
    'voiceschanged',
    cargarVoz
);

cargarVoz();



function reproducirPronunciacion(texto) {

    if (
        !texto ||
        !texto.trim()
    ) {
        return;
    }

    window.speechSynthesis.cancel();

    const utterance =
        new SpeechSynthesisUtterance(
            texto.trim()
        );

    utterance.lang =
        'en-US';

    utterance.rate =
        window.pronunciationSpeed || 1;

    utterance.volume =
        1;

    utterance.pitch =
        1;


    if (vozIngles) {

        utterance.voice =
            vozIngles;

    }


    window.speechSynthesis.speak(
        utterance
    );
}



window.reproducirPronunciacion =
    reproducirPronunciacion;



document.addEventListener(
    'click',
    event => {

        const wordButton =
            event.target.closest(
                '.btn-study-pronunciation'
            );

        const exampleButton =
            event.target.closest(
                '.btn-study-example-pronunciation'
            );


        if (wordButton) {

            reproducirPronunciacion(
                wordButton.dataset.word
            );

        }


        if (exampleButton) {

            reproducirPronunciacion(
                exampleButton.dataset.example
            );

        }

    }
);