<!DOCTYPE html>
<html>
<head>
    <title>{{ $categoria->nombre }}</title>
</head>
<body>

    <h1>{{ $categoria->nombre }}</h1>

    <p>
        {{ $categoria->descripcion }}
    </p>

    <p>
        Vistas: {{ $categoria->vistas }}
    </p>

    <p>
        Estado: {{ $categoria->status }}
    </p>

</body>
</html>