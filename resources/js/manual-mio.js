
document.addEventListener('DOMContentLoaded', function () {

    const filterButtons = document.querySelectorAll('.manual-filter-btn');
    const manualCards = document.querySelectorAll('.my-manual-card');
    const emptyFilter = document.getElementById('my-manuals-empty-filter');

    if (!filterButtons.length || !manualCards.length) {
        return;
    }

    filterButtons.forEach(function (button) {

        button.addEventListener('click', function () {

            const filter = this.dataset.filter;

            // Cambiar botón activo
            filterButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });

            this.classList.add('active');

            let visibleCards = 0;

            // Filtrar manuales
            manualCards.forEach(function (card) {

                const status = card.dataset.status;

                if (filter === 'all' || status === filter) {

                    card.style.display = '';

                    visibleCards++;

                } else {

                    card.style.display = 'none';

                }

            });

            // Mostrar mensaje si no hay resultados
            if (emptyFilter) {

                emptyFilter.style.display =
                    visibleCards === 0 ? 'block' : 'none';

            }

        });

    });

});

