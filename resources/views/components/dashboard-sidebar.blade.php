<aside class="dashboard-sidebar" id="dashboardSidebar">

    {{-- BOTÓN PARA ABRIR / CERRAR --}}

    <button
        type="button"
        class="sidebar-toggle"
        id="sidebarToggle"
        aria-label="Abrir menú"
    >
        ☰
    </button>


    {{-- MARCA --}}

    <div class="dashboard-brand">

        <div class="brand-icon">
            ⚡
        </div>

        <div class="sidebar-text">
            <strong>
                Tech Knowledge
            </strong>

            <span>
                Knowledge Base
            </span>
        </div>

    </div>


    {{-- NAVEGACIÓN --}}

    <nav class="dashboard-nav">

        {{-- DASHBOARD --}}

        <a
            href="/"
            class="dashboard-nav-item {{ request()->is('/') ? 'active' : '' }}"
            title="Dashboard"
        >
            <span>📊</span>

            <span class="sidebar-text">
                Dashboard
            </span>
        </a>


        {{-- CONOCIMIENTO --}}

        <div class="nav-title sidebar-text">
            CONOCIMIENTO
        </div>

        <a
            href="{{ route('knowledge.index') }}"
            class="dashboard-nav-item {{ request()->routeIs('knowledge.*') ? 'active' : '' }}"
            title="Explorar conocimiento"
        >
            <span>🔎</span>

            <span class="sidebar-text">
                Explorar conocimiento
            </span>
        </a>


        {{-- INGLÉS --}}

        <div class="nav-title sidebar-text">
            INGLÉS
        </div>

        <a
            href="{{ route('english.index') }}"
            class="dashboard-nav-item {{ request()->routeIs('english.*') ? 'active' : '' }}"
            title="Inglés"
        >
            <span>🇬🇧</span>

            <span class="sidebar-text">
                Inglés
            </span>
        </a>


        {{-- MANUALES --}}

        <div class="nav-title sidebar-text">
            MANUALES
        </div>

        <a
            href="{{ route('manuals.index') }}"
            class="dashboard-nav-item {{ request()->routeIs('manuals.index') ? 'active' : '' }}"
            title="Manuales"
        >
            <span>📚</span>

            <span class="sidebar-text">
                Manuales
            </span>
        </a>

        <a
            href="{{ route('manuals.my') }}"
            class="dashboard-nav-item {{ request()->routeIs('manuals.my') ? 'active' : '' }}"
            title="Mis manuales"
        >
            <span>🎯</span>

            <span class="sidebar-text">
                Mis manuales
            </span>
        </a>


        {{-- ADMINISTRACIÓN --}}

        <div class="nav-title sidebar-text">
            ADMINISTRACIÓN
        </div>

        <a
            href="{{ route('gestion.index') }}"
            class="dashboard-nav-item {{ request()->routeIs('gestion.*') ? 'active' : '' }}"
            title="Gestión"
        >
            <span>⚙️</span>

            <span class="sidebar-text">
                Gestión
            </span>
        </a>

    </nav>


    {{-- USUARIO --}}

    <div class="sidebar-user">
        <x-user-menu />
    </div>

</aside>