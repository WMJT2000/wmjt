<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Categorías</title>

    <style>
        body{
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            margin: 0;
            padding: 20px;
        }

        h1{
            text-align: center;
        }

        .contenedor{
            max-width: 1000px;
            margin: auto;
        }

        .card{
            background: white;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .nombre{
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .descripcion{
            color: #555;
        }

        .info{
            margin-top: 10px;
            color: #888;
        }
    </style>
</head>
<body>

    <div class="contenedor">

        <h1>Lista de Categorías</h1>

        @foreach($categorias as $categoria)

            <div class="card">

                <div class="nombre">
                    {{ $categoria->nombre }}
                </div>

                <div class="descripcion">
                    {{ $categoria->descripcion }}
                </div>

                <div class="info">
                    ID: {{ $categoria->id }}
                    |
                    Vistas: {{ $categoria->vistas }}
                    |
                    Estado: {{ $categoria->status }}
                </div>

            </div>

        @endforeach

    </div>

</body>
</html>