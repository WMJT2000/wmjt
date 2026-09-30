window.convertirPronunciacion = function (
    palabra,
    ipa
) {
        console.log(palabra,ipa)

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
            'aɪ': 'ai',

            'tʃ': 'ch',
            'dʒ': 'jh',

            'əl': 'ol',
            'ɔɪ': 'oy',

            // ət solamente cuando la T es final de palabra
            'ət': 'et',

            // ɪt solamente cuando la T es final de palabra
            'ɪt': 'et',

            'ən': 'en',
            'oʊ': 'ou',
            'aʊ': 'au',
            'ɪŋ': 'ing',
            'ɪk': 'ik',
            'æn': 'en',




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
        // POSICIÓN DEL INICIO REAL DEL IPA
        //
        // Si viene como /ɪm.../, el inicio real es después de "/".
        // Si viene como ɪm..., el inicio real es 0.
        // =============================================================

        const inicioIPA = ipa.startsWith('/') ? 1 : 0;


        // =============================================================
        // REGLA ESPECIAL:
        // emb + IPA INICIAL ɪm
        //
        // SOLO se aplica si:
        // 1. La palabra empieza por "emb"
        // 2. El IPA empieza por "ɪm"
        //
        // Ejemplo:
        //
        // embarrassed
        // /ɪmˈber.əst/
        //
        // ɪ → e
        //
        // Resultado:
        // /emˈber.ast/
        // =============================================================

        const esEmbConImInicial =
            typeof palabra === 'string' &&
            palabra.toLowerCase().startsWith('emb') &&
            ipa.startsWith('ɪm', inicioIPA);


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


            // =========================================================
            // REGLA ESPECIAL:
            // ɪ → e
            //
            // SOLO para:
            // palabra empieza "emb"
            // +
            // IPA empieza "ɪm"
            //
            // Importante:
            // NO consumimos la "m".
            // Solo cambiamos ɪ por e.
            // =========================================================

            if (
                esEmbConImInicial &&
                i === inicioIPA &&
                ipa.startsWith('ɪ', i)
            ) {

                resultado += 'e';

                i++;

                continue;
            }


            // =========================================================
            // BUSCAR EQUIVALENCIAS
            // =========================================================

            for (const simbolo of simbolos) {

                if (!ipa.startsWith(simbolo, i)) {
                    continue;
                }


                const siguiente = i + simbolo.length;


                // =====================================================
                // ɪt Y ət SOLO SI LA T ES FINAL DE PALABRA
                // =====================================================

                if (simbolo === 'ɪt' || simbolo === 'ət') {

                    if (siguiente < ipa.length) {

                        const caracterSiguiente = ipa[siguiente];

                        // Si lo siguiente es un diacrítico,
                        // NO aplicar ɪt ni ət.
                        if (diacriticos.has(caracterSiguiente)) {
                            continue;
                        }

                        // Si lo siguiente no indica final de palabra,
                        // NO aplicar ɪt ni ət.
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
