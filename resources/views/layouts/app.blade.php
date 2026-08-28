<!DOCTYPE html>

<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        @yield('title', 'Mi aplicación')
    </title>

    @vite([
        'resources/css/app.css',
        'resources/css/form.css',
        'resources/css/gestion.css',
        'resources/css/technologies.css',
        'resources/js/app.js',
        'resources/js/form.js',
        'resources/js/gestion.js',
        'resources/js/technologies.js'
    ])

</head>

<body>

    <main>

        @yield('content')

    </main>

</body>

</html>