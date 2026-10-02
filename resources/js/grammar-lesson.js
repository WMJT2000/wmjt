document.addEventListener(
    'DOMContentLoaded',
    () => {

        /*
        |--------------------------------------------------------------------------
        | NAVEGACIÓN DE LA LECCIÓN DE GRAMÁTICA
        |--------------------------------------------------------------------------
        |
        | Este código controla el cambio entre las diferentes
        | secciones de una lección:
        |
        | Introducción
        | Usos
        | Estructura
        | Reglas
        | Ejemplos
        | Errores comunes
        | Resumen
        |
        */


        const navigationButtons =
            document.querySelectorAll(
                '.grammar-lesson-nav'
            );


        const sections =
            document.querySelectorAll(
                '.grammar-lesson-section'
            );


        /*
        |--------------------------------------------------------------------------
        | SALIR SI NO ESTAMOS EN UNA PÁGINA DE LECCIÓN
        |--------------------------------------------------------------------------
        */

        if (
            navigationButtons.length === 0 ||
            sections.length === 0
        ) {
            return;
        }


        /*
        |--------------------------------------------------------------------------
        | CAMBIAR DE SECCIÓN
        |--------------------------------------------------------------------------
        */

        navigationButtons.forEach(
            (button) => {

                button.addEventListener(
                    'click',
                    () => {

                        const sectionName =
                            button.dataset.section;


                        /*
                        | Quitamos "active" de todos los botones.
                        */

                        navigationButtons.forEach(
                            (item) => {

                                item.classList.remove(
                                    'active'
                                );

                            }
                        );


                        /*
                        | Ocultamos todas las secciones.
                        */

                        sections.forEach(
                            (section) => {

                                section.classList.remove(
                                    'active'
                                );

                            }
                        );


                        /*
                        | Activamos el botón seleccionado.
                        */

                        button.classList.add(
                            'active'
                        );


                        /*
                        | Buscamos la sección correspondiente.
                        |
                        | Ejemplo:
                        |
                        | data-section="rules"
                        |
                        | busca:
                        |
                        | id="section-rules"
                        */

                        const selectedSection =
                            document.getElementById(
                                `section-${sectionName}`
                            );


                        /*
                        | Mostramos la sección encontrada.
                        */

                        if (selectedSection) {

                            selectedSection.classList.add(
                                'active'
                            );

                        }

                    }
                );

            }
        );

    }
);