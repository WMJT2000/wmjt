<x-guest-layout>

    <div class="register-page">

        <div class="register-card">

            {{-- ENCABEZADO --}}

            <div class="register-header">

                <div class="register-logo">
                    WJ
                </div>

                <h1 class="register-title">
                    Crear usuario
                </h1>

                <p class="register-subtitle">
                    Crea una nueva cuenta para acceder a la base de conocimiento.
                </p>

            </div>


            {{-- FORMULARIO --}}

            <form
                method="POST"
                action="{{ route('register') }}"
                class="register-form"
            >

                @csrf


                {{-- NOMBRE --}}

                <div class="register-field">

                    <label
                        for="name"
                        class="register-label"
                    >
                        Nombre
                    </label>

                    <input
                        id="name"
                        class="register-input"
                        type="text"
                        name="name"
                        value="{{ old('name') }}"
                        required
                        autofocus
                        autocomplete="name"
                        placeholder="Nombre completo"
                    >

                    @if ($errors->get('name'))

                        <div class="register-error">
                            {{ $errors->first('name') }}
                        </div>

                    @endif

                </div>


                {{-- CORREO --}}

                <div class="register-field">

                    <label
                        for="email"
                        class="register-label"
                    >
                        Correo electrónico
                    </label>

                    <input
                        id="email"
                        class="register-input"
                        type="email"
                        name="email"
                        value="{{ old('email') }}"
                        required
                        autocomplete="username"
                        placeholder="tu@email.com"
                    >

                    @if ($errors->get('email'))

                        <div class="register-error">
                            {{ $errors->first('email') }}
                        </div>

                    @endif

                </div>


                {{-- CONTRASEÑA --}}

                <div class="register-field">

                    <label
                        for="password"
                        class="register-label"
                    >
                        Contraseña
                    </label>

                    <input
                        id="password"
                        class="register-input"
                        type="password"
                        name="password"
                        required
                        autocomplete="new-password"
                        placeholder="••••••••"
                    >

                    @if ($errors->get('password'))

                        <div class="register-error">
                            {{ $errors->first('password') }}
                        </div>

                    @endif

                </div>


                {{-- CONFIRMAR CONTRASEÑA --}}

                <div class="register-field">

                    <label
                        for="password_confirmation"
                        class="register-label"
                    >
                        Confirmar contraseña
                    </label>

                    <input
                        id="password_confirmation"
                        class="register-input"
                        type="password"
                        name="password_confirmation"
                        required
                        autocomplete="new-password"
                        placeholder="••••••••"
                    >

                    @if ($errors->get('password_confirmation'))

                        <div class="register-error">
                            {{ $errors->first('password_confirmation') }}
                        </div>

                    @endif

                </div>


                {{-- BOTÓN --}}

                <button
                    type="submit"
                    class="register-button"
                >
                    Crear usuario
                </button>


        

            </form>

        </div>

    </div>

</x-guest-layout>