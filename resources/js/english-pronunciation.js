let vozIngles = null;
let vozEspanol = null;



function cargarVoz() {

    const voices =
        window.speechSynthesis.getVoices();

    vozIngles =
        voices.find(voice =>
            voice.name === 'Google US English' &&
            voice.lang === 'en-US'
        ) ||
        voices.find(voice =>
            voice.lang === 'en-US'
        ) ||
        voices.find(voice =>
            voice.lang.startsWith('en')
        );

    vozEspanol =
        voices.find(voice =>
            voice.name === 'Google español' &&
            voice.lang === 'es-ES'
        ) ||
        voices.find(voice =>
            voice.lang === 'es-ES'
        ) ||
        voices.find(voice =>
            voice.lang.startsWith('es')
        );



    console.log(
        '🎙️ Voz inglés seleccionada:',
        vozIngles
    );

    console.log(
        '🎙️ Voz español seleccionada:',
        vozEspanol
    );
}



window.speechSynthesis.addEventListener(
    'voiceschanged',
    cargarVoz
);

cargarVoz();



function crearUtterance(texto, idioma = 'en-US') {

    const utterance =
        new SpeechSynthesisUtterance(
            texto.trim()
        );

    utterance.lang =
        idioma;

    utterance.rate =
        window.pronunciationSpeed || 1;

    utterance.volume =
        1;

    utterance.pitch =
        1;


    const voz =
        idioma.startsWith('es')
            ? vozEspanol
            : vozIngles;


    if (voz) {

        utterance.voice =
            voz;

    }


    return utterance;
}



function reproducirPronunciacion(texto, idioma = 'en-US') {

    if (
        !texto ||
        !texto.trim()
    ) {
        return;
    }

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
        crearUtterance(texto, idioma)
    );
}



function reproducirSegmentos(segmentos, onComplete) {

    if (!Array.isArray(segmentos)) {
        return false;
    }

    const segmentosValidos =
        segmentos.filter(segmento =>
            segmento &&
            segmento.texto &&
            String(segmento.texto).trim()
        );


    if (segmentosValidos.length === 0) {
        return false;
    }


    if (
        !window.speechSynthesis ||
        typeof SpeechSynthesisUtterance === 'undefined'
    ) {
        return false;
    }


    window.speechSynthesis.cancel();


    const utterances =
        segmentosValidos.map(segmento =>
            crearUtterance(
                String(segmento.texto),
                segmento.idioma || 'en-US'
            )
        );


    let completado = false;


    const finalizar = (exito = true) => {

        if (completado) {
            return;
        }

        completado = true;


        if (typeof onComplete === 'function') {
            onComplete(exito);
        }

    };


    if (typeof onComplete === 'function') {

        const ultimaUtterance =
            utterances[utterances.length - 1];

        ultimaUtterance.onend =
            () => finalizar(true);

        ultimaUtterance.onerror =
            () => finalizar(false);

    }


    utterances.forEach(utterance => {

        window.speechSynthesis.speak(
            utterance
        );

    });


    return true;
}



window.reproducirPronunciacion =
    reproducirPronunciacion;

window.reproducirPronunciacionSegmentos =
    reproducirSegmentos;



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
