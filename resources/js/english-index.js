document.addEventListener(
    'DOMContentLoaded',
    () => {

        const grid =
            document.querySelector(
                '.english-categories-grid'
            );

        const searchInput =
            document.getElementById(
                'englishCategorySearch'
            );

        const loadMoreButton =
            document.getElementById(
                'englishCategoriesLoadMore'
            );

        const searchEmpty =
            document.getElementById(
                'englishCategoriesSearchEmpty'
            );


        if (!grid) {

            return;

        }


        const cards =
            Array.from(
                grid.querySelectorAll(
                    '.english-category-card'
                )
            );


        if (cards.length === 0) {

            return;

        }


        const categoriesPerLoad = 6;

        let visibleCount = categoriesPerLoad;


        const normalizeText = (value) =>
            String(value)
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');


        const categoryNames =
            cards.map(
                (card) =>
                    normalizeText(
                        card.dataset.categoryName ||
                        card.textContent
                    )
            );


        function updateCategories() {

            const query =
                searchInput
                    ? normalizeText(
                        searchInput.value.trim()
                    )
                    : '';

            const isSearching =
                query.length > 0;

            let visibleCategories = 0;


            cards.forEach(
                (card, index) => {

                    const matches =
                        !isSearching ||
                        categoryNames[index].includes(
                            query
                        );

                    const withinLimit =
                        isSearching ||
                        index < visibleCount;

                    const shouldShow =
                        matches && withinLimit;


                    card.hidden = !shouldShow;


                    if (shouldShow) {

                        visibleCategories++;

                    }

                }
            );


            if (searchEmpty) {

                searchEmpty.hidden =
                    !isSearching ||
                    visibleCategories > 0;

            }


            if (loadMoreButton) {

                loadMoreButton.hidden =
                    isSearching ||
                    visibleCount >= cards.length;

            }

        }


        if (searchInput) {

            searchInput.addEventListener(
                'input',
                updateCategories
            );

        }


        if (loadMoreButton) {

            loadMoreButton.addEventListener(
                'click',
                () => {

                    visibleCount =
                        Math.min(
                            visibleCount +
                            categoriesPerLoad,
                            cards.length
                        );


                    updateCategories();

                }
            );

        }


        updateCategories();

    }
);
