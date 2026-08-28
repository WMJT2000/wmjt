document.addEventListener('DOMContentLoaded', () => {

    const forms = document.querySelectorAll('.dynamic-form');


    forms.forEach(form => {

        form.addEventListener('submit', async (event) => {

            event.preventDefault();


            const button =
                form.querySelector('.form-button');


            const originalText =
                button
                    ? button.textContent
                    : 'Enviar';


            const action =
                form.getAttribute('action');


            let method =
                (
                    form.getAttribute('method')
                    || 'POST'
                ).toUpperCase();


            /*
            |--------------------------------------------------------------------------
            | DATOS
            |--------------------------------------------------------------------------
            */

            const formData =
                new FormData(form);


            /*
            |--------------------------------------------------------------------------
            | PUT
            |--------------------------------------------------------------------------
            |
            | Laravel puede recibir PUT mediante _method.
            |
            */

            if (method === 'PUT') {

                formData.append(
                    '_method',
                    'PUT'
                );

                method = 'POST';

            }


            /*
            |--------------------------------------------------------------------------
            | BOTÓN
            |--------------------------------------------------------------------------
            */

            if (button) {

                button.disabled = true;

                button.textContent =
                    'Guardando...';

            }


            try {

                const response =
                    await fetch(action, {

                        method: method,

                        headers: {

                            'Accept':
                                'application/json',

                            'X-Requested-With':
                                'XMLHttpRequest'

                        },

                        body: formData

                    });


                /*
                |--------------------------------------------------------------------------
                | RESPUESTA
                |--------------------------------------------------------------------------
                */

                const contentType =
                    response.headers.get(
                        'content-type'
                    );


                let data;


                if (
                    contentType &&
                    contentType.includes(
                        'application/json'
                    )
                ) {

                    data =
                        await response.json();

                } else {

                    const text =
                        await response.text();

                    data = {
                        message: text
                    };

                }


                console.log(
                    'Respuesta:',
                    data
                );


                /*
                |--------------------------------------------------------------------------
                | ERROR
                |--------------------------------------------------------------------------
                */

                if (!response.ok) {

                    mostrarError(
                        form,
                        data
                    );

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | ÉXITO
                |--------------------------------------------------------------------------
                */

                mostrarExito(
                    form,
                    data
                );


                /*
                |--------------------------------------------------------------------------
                | LIMPIAR
                |--------------------------------------------------------------------------
                */

                form.reset();


                /*
                |--------------------------------------------------------------------------
                | AVISAR AL CRUD
                |--------------------------------------------------------------------------
                */

                form.dispatchEvent(
                    new CustomEvent(
                        'form:success',
                        {
                            bubbles: true,

                            detail: {
                                data: data,
                                action: action,
                                method: method
                            }
                        }
                    )
                );


            } catch (error) {

                console.error(
                    'Error de conexión:',
                    error
                );


                mostrarError(
                    form,
                    {
                        message:
                            'No se pudo conectar con el servidor.'
                    }
                );


            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        originalText;

                }

            }

        });

    });


    /*
    |--------------------------------------------------------------------------
    | ÉXITO
    |--------------------------------------------------------------------------
    */

    function mostrarExito(form, data) {

        eliminarMensajes(form);


        const mensaje =
            document.createElement('div');


        mensaje.className =
            'form-success';


        mensaje.textContent =
            data?.message
            || 'Operación realizada correctamente.';


        form.prepend(mensaje);

    }


    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    function mostrarError(form, data) {

        eliminarMensajes(form);


        const mensaje =
            document.createElement('div');


        mensaje.className =
            'form-error';


        if (data?.errors) {

            const errores =
                Object.values(
                    data.errors
                ).flat();


            mensaje.innerHTML =
                errores
                    .map(error =>
                        `<p>${escapeHtml(error)}</p>`
                    )
                    .join('');

        } else {

            mensaje.textContent =
                data?.message
                || 'Ocurrió un error.';

        }


        form.prepend(mensaje);

    }


    /*
    |--------------------------------------------------------------------------
    | ELIMINAR MENSAJES
    |--------------------------------------------------------------------------
    */

    function eliminarMensajes(form) {

        form
            .querySelectorAll(
                '.form-success, .form-error'
            )
            .forEach(element => {

                element.remove();

            });

    }


    /*
    |--------------------------------------------------------------------------
    | ESCAPAR HTML
    |--------------------------------------------------------------------------
    */

    function escapeHtml(text) {

        const div =
            document.createElement('div');


        div.textContent =
            text;


        return div.innerHTML;

    }

});