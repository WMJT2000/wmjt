<!DOCTYPE html>

<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        @yield('title', 'Base de conocimiento')
    </title>

    @vite('resources/js/app.js')

    @stack('styles')

</head>

<body>

    <main>

        @yield('content')

    </main>

    @stack('scripts')

</body>

</html>