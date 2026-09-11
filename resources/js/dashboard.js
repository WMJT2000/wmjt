window.toggleUserMenu = function () {
    const menu = document.getElementById('user-menu');

    if (!menu) {
        return;
    }

    menu.classList.toggle('show');
};


document.addEventListener('DOMContentLoaded', () => {
           
    const sidebar =
        document.getElementById('dashboardSidebar');

    const toggle =
        document.getElementById('sidebarToggle');

    if (!sidebar || !toggle) {
        return;
    }


    toggle.addEventListener('click', () => {

        console.log(
            'TOGGLE SIDEBAR')

        sidebar.classList.toggle('collapsed');

    });

});

document.addEventListener('click', function (event) {

    const menu = document.getElementById('user-menu');

    const sidebarButton = document.querySelector('.user-profile-button');

    const topbarButton = document.querySelector('.profile-avatar');

    if (!menu) {
        return;
    }

    const clickedSidebar =
        sidebarButton && sidebarButton.contains(event.target);

    const clickedTopbar =
        topbarButton && topbarButton.contains(event.target);

    const clickedMenu =
        menu.contains(event.target);

    if (
        !clickedSidebar &&
        !clickedTopbar &&
        !clickedMenu
    ) {
        menu.classList.remove('show');
    }

});


window.toggleTopbarUserMenu = function () {

    const menu = document.getElementById('topbar-user-menu');

    if (!menu) {
        return;
    }

    menu.classList.toggle('show');

};

document.addEventListener('click', function (event) {

    const menu = document.getElementById('topbar-user-menu');
    const button = document.querySelector('.profile-avatar');

    if (!menu || !button) {
        return;
    }

    if (
        !menu.contains(event.target) &&
        !button.contains(event.target)
    ) {
        menu.classList.remove('show');
    }

});