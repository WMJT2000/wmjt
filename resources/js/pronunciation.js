
/*document.addEventListener('DOMContentLoaded', () => {

    const buttons = document.querySelectorAll('.btn-pronunciation');

    buttons.forEach(button => {

        button.addEventListener('click', async () => {

            const word = button.dataset.word;

            if (!word) {
                return;
            }

            const originalText = button.innerHTML;

            button.disabled = true;
            button.innerHTML = '⏳';

            try {

                const response = await fetch('/api/english/pronunciation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content')
                    },
                    body: JSON.stringify({
                        word: word
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error(data);

                    throw new Error(
                        data.message || 'Error al generar el audio.'
                    );
                }

                if (!data.audio) {
                    throw new Error('No se recibió el audio.');
                }

                const audioBytes = Uint8Array.from(
                    atob(data.audio),
                    character => character.charCodeAt(0)
                );

                const audioBlob = new Blob(
                    [audioBytes],
                    {
                        type: 'audio/wav'
                    }
                );

                const audioUrl = URL.createObjectURL(audioBlob);

                const audio = new Audio(audioUrl);

                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    button.disabled = false;
                    button.innerHTML = originalText;
                };

                audio.onerror = () => {
                    URL.revokeObjectURL(audioUrl);
                    button.disabled = false;
                    button.innerHTML = originalText;

                    alert('No se pudo reproducir el audio.');
                };

                await audio.play();

            } catch (error) {

                console.error(error);

                alert(
                    error.message || 'No se pudo reproducir la pronunciación.'
                );

                button.disabled = false;
                button.innerHTML = originalText;
            }

        });

    });

});

*/