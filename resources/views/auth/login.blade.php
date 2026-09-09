<x-guest-layout>

    <div class="login-page">

        <div class="login-card">

            <div class="login-header">

                <div class="login-logo">
                    WJ
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




                <!-- Botón -->

                <button
                    type="submit"
                    class="login-button"
                >
                    Iniciar sesión
                </button>

            </form>


           

        </div>

    </div>

</x-guest-layout>