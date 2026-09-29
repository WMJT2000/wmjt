document.addEventListener(
    'DOMContentLoaded',
    () => {

        const navigationButtons =
            document.querySelectorAll(
                '.grammar-lesson-nav'
            );

        const sections =
            document.querySelectorAll(
                '.grammar-lesson-section'
            );


        navigationButtons.forEach(
            (button) => {

                button.addEventListener(
                    'click',
                    () => {

                        const sectionName =
                            button.dataset.section;


                        navigationButtons.forEach(
                            (item) => {

                                item.classList.remove(
                                    'active'
                                );

                            }
                        );


                        sections.forEach(
                            (section) => {

                                section.classList.remove(
                                    'active'
                                );

                            }
                        );


                        button.classList.add(
                            'active'
                        );


                        const selectedSection =
                            document.getElementById(
                                `section-${sectionName}`
                            );


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