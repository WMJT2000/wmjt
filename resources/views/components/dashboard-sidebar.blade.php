
<aside class="dashboard-sidebar">

    <div class="dashboard-brand">

        <div class="brand-icon">
            ⚡
        </div>

        <div>
            <strong>
                Tech Knowledge
            </strong>

            <span>
                Knowledge Base
            </span>
        </div>

    </div>


    <nav class="dashboard-nav">

        {{-- DASHBOARD --}}

        <a
            href="/"
            class="dashboard-nav-item {{ request()->is('/') ? 'active' : '' }}"
        >
            <span>📊</span>
            Dashboard
        </a>


        {{-- CONOCIMIENTO --}}

        <div class="nav-title">
            CONOCIMIENTO
        </div>

        <a
            href="{{ route('knowledge.index') }}"
            class="dashboard-nav-item {{ request()->routeIs('knowledge.*') ? 'active' : '' }}"
        >
            <span>🔎</span>
            Explorar conocimiento
        </a>


        {{-- INGLÉS --}}

        <div class="nav-title">
            INGLÉS
        </div>

        <a
            href="{{ route('english.index') }}"
            class="dashboard-nav-item {{ request()->routeIs('english.*') ? 'active' : '' }}"
        >
            <span>🇬🇧</span>
            Inglés
        </a>


        {{-- MANUALES --}}

        <div class="nav-title">
            MANUALES
        </div>

        <a
            href="{{ route('manuals.index') }}"
            class="dashboard-nav-item {{ request()->routeIs('manuals.index') ? 'active' : '' }}"
        >
            <span>📚</span>
            Manuales
        </a>

        <a
            href="{{ route('manuals.my') }}"
            class="dashboard-nav-item {{ request()->routeIs('manuals.my') ? 'active' : '' }}"
        >
            <span>🎯</span>
            Mis manuales
        </a>


        {{-- ADMINISTRACIÓN --}}

        <div class="nav-title">
            ADMINISTRACIÓN
        </div>

        <a
            href="{{ route('gestion.index') }}"
            class="dashboard-nav-item {{ request()->routeIs('gestion.*') ? 'active' : '' }}"
        >
            <span>⚙️</span>
            Gestión
        </a>

    </nav>


    {{-- USUARIO --}}

    <x-user-menu />

</aside>

