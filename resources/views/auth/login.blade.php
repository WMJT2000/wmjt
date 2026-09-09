<x-guest-layout>

    <div class="login-page">

        <div class="login-card">

            <div class="login-header">

                <div class="login-logo">
                    TK
                </div>

                <h1 class="login-title">
                    Iniciar sesión
                </h1>

                <p class="login-subtitle">
                    Accede a tu base de conocimiento
                </p>

            </div>


            <!-- Session Status -->

            <x-auth-session-status
                class="login-status"
                :status="session('status')"
            />


            <form
                method="POST"
                action="{{ route('login') }}"
                class="login-form"
            >

                @csrf


                <!-- Email -->

                <div class="login-field">

                    <label
                        for="email"
                        class="login-label"
                    >
                        Correo electrónico
                    </label>

                    <input
                        id="email"
                        class="login-input"
                        type="email"
                        name="email"
                        value="{{ old('email') }}"
                        required
                        autofocus
                        autocomplete="username"
                        placeholder="tu@email.com"
                    >

                    @if ($errors->get('email'))
                        <div class="login-error">
                            {{ $errors->first('email') }}
                        </div>
                    @endif

                </div>


                <!-- Password -->

                <div class="login-field">

                    <label
                        for="password"
                        class="login-label"
                    >
                        Contraseña
                    </label>

                    <input
                        id="password"
                        class="login-input"
                        type="password"
                        name="password"
                        required
                        autocomplete="current-password"
                        placeholder="••••••••"
                    >

                    @if ($errors->get('password'))
                        <div class="login-error">
                            {{ $errors->first('password') }}
                        </div>
                    @endif

                </div>


                <!-- Opciones -->

                <div class="login-options">

                    <label
                        for="remember_me"
                        class="login-remember"
                    >

                        <input
                            id="remember_me"
                            type="checkbox"
                            name="remember"
                        >

                        <span>
                            Recordarme
                        </span>

                    </label>


                    @if (Route::has('password.request'))

                        <a
                            href="{{ route('password.request') }}"
                            class="login-link"
                        >
                            ¿Olvidaste tu contraseña?
                        </a>

                    @endif

                </div>


                <!-- Botón -->

                <button
                    type="submit"
                    class="login-button"
                >
                    Iniciar sesión
                </button>

            </form>


            <!-- Footer -->

            <div class="login-footer">

                ¿No tienes una cuenta?

                @if (Route::has('register'))

                    <a href="{{ route('register') }}">
                        Crear cuenta
                    </a>

                @endif

            </div>

        </div>

    </div>

</x-guest-layout>