<div class="dashboard-sidebar-footer">

    <button
        type="button"
        class="user-profile-button"
        onclick="toggleUserMenu()"
    >

        <div class="user-avatar">
            {{ strtoupper(substr(Auth::user()->name, 0, 1)) }}
        </div>

        <div class="user-profile-info">

            <strong>
                {{ Auth::user()->name }}
            </strong>

            <span>
                {{ Auth::user()->email }}
            </span>

        </div>

        <span class="user-profile-arrow">
            ▾
        </span>

    </button>


    <div
        id="user-menu"
        class="user-menu"
    >

        <a href="{{ route('profile.edit') }}">
            <span>👤</span>
            Mi perfil
        </a>

        <a href="{{ route('register') }}">
            <span>➕</span>
            Crear usuario
        </a>

        <div class="user-menu-divider"></div>

        <form
            method="POST"
            action="{{ route('logout') }}"
        >

            @csrf

            <button type="submit">
                <span>🚪</span>
                Cerrar sesión
            </button>

        </form>

    </div>

</div>