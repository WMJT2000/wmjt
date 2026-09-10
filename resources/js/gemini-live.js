// resources/js/gemini-live.js

import { GoogleGenAI, Modality } from '@google/genai';

const MODEL = 'gemini-3.1-flash-live-preview';

let ai = null;
let session = null;

let audioContext = null;
let audioQueue = [];
let reproduciendo = false;

let sesionConectando = null;

let solicitudActual = 0;
let velocidadPronunciacion = 1;



document.addEventListener('change', (event) => {

    if (
        event.target.id !==
        'pronunciation-speed'
    ) {
        return;
    }

    velocidadPronunciacion =
        Number(event.target.value);

    console.log(
        '🎚️ Velocidad:',
        velocidadPronunciacion
    );

});


/*
|--------------------------------------------------------------------------
| INICIAR SESIÓN
|--------------------------------------------------------------------------
*/

async function iniciarSesion() {

    if (session) {

        console.log(
            '♻️ Gemini Live ya está conectado'
        );

        return session;

    }

    if (sesionConectando) {

        console.log(
            '⏳ Gemini Live ya se está conectando'
        );

        return sesionConectando;

    }

    sesionConectando = (async () => {

        try {

            console.log(
                '🔌 Conectando a Gemini Live...'
            );


            ai = new GoogleGenAI({

                apiKey:
                    import.meta.env.VITE_GEMINI_API_KEY,

            });


            const config = {

                responseModalities: [

                    Modality.AUDIO

                ],


                speechConfig: {

                    voiceConfig: {

                        prebuiltVoiceConfig: {

                            voiceName: 'Zephyr',

                        },

                    },

                },


                systemInstruction: {

                    parts: [

                        {

                            text: `
You are a pronunciation assistant.

Every user message is a completely independent pronunciation request.

Follow the instructions contained in the latest user message.

Do not use previous messages as the pronunciation target.

Do not repeat previous words.

Do not repeat previous sentences.

Do not continue previous requests.

When the instruction says to pronounce English text, pronounce only that English text.

When the instruction says to speak complete feedback, speak the complete feedback exactly as provided.

Do not invent additional content.

Return only the requested speech as audio.
`.trim(),
                        },

                    ],

                },

            };


            session = await ai.live.connect({

                model: MODEL,

                config,

                callbacks: {

                    onopen() {

                        console.log(
                            '✅ GEMINI LIVE CONECTADO'
                        );

                    },


                    onmessage(message) {

                        console.log(
                            '📩 MENSAJE RECIBIDO DE GEMINI'
                        );

                        procesarRespuestaAudio(
                            message
                        );

                    },


                    onerror(error) {

                        console.error(
                            '❌ ERROR GEMINI LIVE:',
                            error
                        );

                    },


                    onclose(event) {

                        console.log(
                            '🔌 GEMINI LIVE CERRADO'
                        );

                        console.log(event);

                        session = null;

                    },

                },

            });


            console.log(
                '✅ SESSION CREADA'
            );


            return session;


        } catch (error) {

            console.error(
                '❌ ERROR CONECTANDO GEMINI:',
                error
            );

            session = null;

            throw error;

        } finally {

            sesionConectando = null;

        }

    })();


    return sesionConectando;

}


/*
|--------------------------------------------------------------------------
| PRONUNCIAR EN INGLÉS
|--------------------------------------------------------------------------
*/

export async function pronunciarEnIngles(
    texto,
    modo = 'ingles'
) {

    if (
        !texto ||
        !texto.trim()
    ) {

        console.warn(
            '⚠️ No hay texto para pronunciar'
        );

        return;

    }


    texto = texto.trim();



    let instruccion;

    if (modo === 'feedback') {

        instruccion = `
Speak the complete text exactly as provided.

Read every word of the text.

Do not shorten the text.

Do not remove any words.

Do not replace any words.

Do not add any words.

Keep the original language of each word.

If the text is in Spanish, speak it in Spanish.

If the text contains English words, pronounce those English words naturally.

Text:
${texto}
    `.trim();

    } else {

        instruccion = `
Pronounce ONLY the exact English text provided.

Do not translate.

Do not explain.

Do not add any words.

Do not remove any words.

Text:
${texto}
    `.trim();

    }


    /*
    |--------------------------------------------------------------------------
    | CREAR ID DE SOLICITUD
    |--------------------------------------------------------------------------
    */

    solicitudActual++;

    const idSolicitud =
        solicitudActual;


    console.log(
        '🆕 SOLICITUD:',
        idSolicitud
    );


    console.log(
        '📤 TEXTO:',
        texto
    );


    try {

        /*
        |--------------------------------------------------------------------------
        | AUDIO CONTEXT
        |--------------------------------------------------------------------------
        */

        if (!audioContext) {

            audioContext =
                new AudioContext({

                    sampleRate: 24000,

                });


            console.log(
                '🎧 AudioContext creado'
            );

        }


        if (
            audioContext.state ===
            'suspended'
        ) {

            await audioContext.resume();

        }


        /*
        |--------------------------------------------------------------------------
        | LIMPIAR AUDIO ANTERIOR
        |--------------------------------------------------------------------------
        */

        audioQueue = [];


        /*
        |--------------------------------------------------------------------------
        | OBTENER SESIÓN
        |--------------------------------------------------------------------------
        */

        const conexion =
            await iniciarSesion();


        if (!conexion) {

            console.error(
                '❌ No existe sesión Gemini'
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | VERIFICAR QUE SIGA SIENDO LA SOLICITUD ACTUAL
        |--------------------------------------------------------------------------
        */

        if (
            idSolicitud !== solicitudActual
        ) {

            console.log(
                '⚠️ Solicitud cancelada:',
                idSolicitud
            );

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | ENVIAR TEXTO ACTUAL
        |--------------------------------------------------------------------------
        */

        console.log(
            '📤 ENVIANDO A GEMINI:',
            texto
        );


        conexion.sendRealtimeInput({
            text: `
${instruccion}

Speed: ${velocidadPronunciacion}x
    `.trim(),
        });


        console.log(
            '✅ TEXTO ENVIADO:',
            texto
        );


    } catch (error) {

        console.error(
            '❌ ERROR PRONUNCIANDO:',
            error
        );

        throw error;

    }

}


/*
|--------------------------------------------------------------------------
| PROCESAR RESPUESTA DE GEMINI
|--------------------------------------------------------------------------
*/

function procesarRespuestaAudio(
    message
) {

    const serverContent =
        message?.serverContent;


    if (!serverContent) {

        console.log(
            '⚠️ El mensaje no tiene serverContent'
        );

        return;

    }


    const parts =
        serverContent.modelTurn?.parts || [];


    for (
        const part of parts
    ) {

        if (!part.inlineData) {

            continue;

        }


        const mimeType =
            part.inlineData.mimeType;


        const base64Audio =
            part.inlineData.data;


        if (
            !mimeType ||
            !mimeType.startsWith('audio/')
        ) {

            continue;

        }


        console.log(
            '🎵 AUDIO RECIBIDO:',
            mimeType
        );


        const audioBytes =
            base64ToUint8Array(
                base64Audio
            );


        console.log(
            '🔊 PCM:',
            audioBytes.byteLength,
            'bytes'
        );


        audioQueue.push(
            audioBytes
        );


        reproducirColaAudio();

    }


    if (
        serverContent.turnComplete
    ) {

        console.log(
            '✅ TURNO DE AUDIO TERMINADO'
        );

    }

}


/*
|--------------------------------------------------------------------------
| BASE64 → UINT8ARRAY
|--------------------------------------------------------------------------
*/

function base64ToUint8Array(
    base64
) {

    const binaryString =
        atob(base64);


    const bytes =
        new Uint8Array(
            binaryString.length
        );


    for (
        let i = 0;
        i < binaryString.length;
        i++
    ) {

        bytes[i] =
            binaryString.charCodeAt(i);

    }


    return bytes;

}


/*
|--------------------------------------------------------------------------
| REPRODUCIR COLA DE AUDIO
|--------------------------------------------------------------------------
*/

async function reproducirColaAudio() {

    if (reproduciendo) {

        return;

    }


    reproduciendo = true;


    try {

        if (!audioContext) {

            audioContext =
                new AudioContext({

                    sampleRate: 24000,

                });

        }


        if (
            audioContext.state ===
            'suspended'
        ) {

            await audioContext.resume();

        }


        while (
            audioQueue.length > 0
        ) {

            const pcmBytes =
                audioQueue.shift();


            console.log(
                '▶️ Reproduciendo:',
                pcmBytes.byteLength,
                'bytes'
            );


            await reproducirPCM(
                pcmBytes
            );

        }


    } catch (error) {

        console.error(
            '❌ Error reproduciendo:',
            error
        );


    } finally {

        reproduciendo = false;

    }

}


/*
|--------------------------------------------------------------------------
| REPRODUCIR PCM
|--------------------------------------------------------------------------
*/

async function reproducirPCM(
    bytes
) {

    if (!audioContext) {

        return;

    }


    const samples =
        new Int16Array(

            bytes.buffer,

            bytes.byteOffset,

            Math.floor(
                bytes.byteLength / 2
            )

        );


    const audioBuffer =
        audioContext.createBuffer(

            1,

            samples.length,

            24000

        );


    const channelData =
        audioBuffer.getChannelData(0);


    for (
        let i = 0;
        i < samples.length;
        i++
    ) {

        channelData[i] =
            samples[i] / 32768;

    }


    const source =
        audioContext.createBufferSource();


    source.buffer =
        audioBuffer;


    source.connect(
        audioContext.destination
    );


    return new Promise(
        (resolve) => {

            source.onended =
                resolve;


            source.start();

        }
    );

}


/*
|--------------------------------------------------------------------------
| BOTÓN — PALABRA
|--------------------------------------------------------------------------
*/

document.addEventListener(
    'click',
    async (event) => {

        const button =
            event.target.closest(
                '.btn-pronunciation'
            );


        if (!button) {

            return;

        }


        const palabra =
            button.dataset.word;


        if (!palabra) {

            console.warn(
                '⚠️ El botón no tiene data-word'
            );

            return;

        }


        console.log(
            '🔘 PRONUNCIAR PALABRA:',
            palabra
        );


        try {

            button.disabled = true;

            button.textContent = '⏳';


            await pronunciarEnIngles(
                palabra
            );


        } catch (error) {

            console.error(
                '❌ Error pronunciando palabra:',
                error
            );

        } finally {

            button.disabled = false;

            button.textContent = '🔊';

        }

    }
);


/*
|--------------------------------------------------------------------------
| BOTÓN — ORACIÓN
|--------------------------------------------------------------------------
*/

document.addEventListener(
    'click',
    async (event) => {

        const button =
            event.target.closest(
                '.btn-example-pronunciation'
            );


        if (!button) {

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | OBTENER LA ORACIÓN VISIBLE ACTUAL
        |--------------------------------------------------------------------------
        |
        | NO usamos data-example.
        |
        | Tomamos directamente el texto que está
        | mostrando actualmente la interfaz.
        |
        */

        const exampleElement =
            document.getElementById(
                'study-example-text'
            );


        if (!exampleElement) {

            console.warn(
                '⚠️ No existe #study-example-text'
            );

            return;

        }


        const oracion =
            exampleElement.textContent.trim();


        if (!oracion) {

            console.warn(
                '⚠️ No existe una oración actual'
            );

            return;

        }


        console.log(
            '🔘 PRONUNCIAR ORACIÓN:',
            oracion
        );


        try {

            button.disabled = true;

            button.textContent = '⏳';


            await pronunciarEnIngles(
                oracion
            );


        } catch (error) {

            console.error(
                '❌ ERROR PRONUNCIANDO ORACIÓN:',
                error
            );

        } finally {

            button.disabled = false;

            button.textContent = '🔊';

        }

    }
);

/*
|--------------------------------------------------------------------------
| CERRAR GEMINI LIVE
|--------------------------------------------------------------------------
*/

export function cerrarGeminiLive() {

    console.log(
        '🔒 Cerrando Gemini Live...'
    );


    /*
    |--------------------------------------------------------------------------
    | INVALIDAR SOLICITUDES
    |--------------------------------------------------------------------------
    */

    solicitudActual++;


    /*
    |--------------------------------------------------------------------------
    | CERRAR SESIÓN
    |--------------------------------------------------------------------------
    */

    if (session) {

        try {

            session.close();

            console.log(
                '✅ Gemini Live cerrado'
            );

        } catch (error) {

            console.error(
                '❌ Error cerrando Gemini Live:',
                error
            );

        }

        session = null;

    }


    /*
    |--------------------------------------------------------------------------
    | LIMPIAR AUDIO
    |--------------------------------------------------------------------------
    */

    audioQueue = [];


    /*
    |--------------------------------------------------------------------------
    | CERRAR AUDIO CONTEXT
    |--------------------------------------------------------------------------
    */

    if (audioContext) {

        try {

            audioContext.close();

        } catch (error) {

            console.warn(
                '⚠️ Error cerrando AudioContext:',
                error
            );

        }

        audioContext = null;

    }


    /*
    |--------------------------------------------------------------------------
    | RESETEAR VARIABLES
    |--------------------------------------------------------------------------
    */

    reproduciendo = false;

    ai = null;

    sesionConectando = null;

}


/*
|--------------------------------------------------------------------------
| AL ABANDONAR LA PÁGINA
|--------------------------------------------------------------------------
*/

window.addEventListener(
    'beforeunload',
    () => {

        cerrarGeminiLive();

    }
);


/*
|--------------------------------------------------------------------------
| CIERRE GLOBAL
|--------------------------------------------------------------------------
*/

window.cerrarGeminiLive =
    cerrarGeminiLive;

window.pronunciarEnIngles =
    pronunciarEnIngles;