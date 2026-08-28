<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Comentarios</title>

    <style>

        body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            margin: 0;
            padding: 40px;
        }

        .container {
            max-width: 700px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
        }

        h1 {
            margin-top: 0;
        }

        input,
        textarea {
            width: 100%;
            box-sizing: border-box;
            padding: 12px;
            margin-top: 8px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 15px;
        }

        textarea {
            height: 120px;
            resize: vertical;
        }

        button {
            padding: 12px 20px;
            border: none;
            border-radius: 5px;
            background: #222;
            color: white;
            cursor: pointer;
            font-size: 15px;
        }

        button:hover {
            background: #444;
        }

        .error {
            color: red;
            margin-bottom: 15px;
        }

        .comentarios {
            margin-top: 30px;
        }

        .comentario {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }

        .nombre {
            font-weight: bold;
            font-size: 18px;
        }

        .texto {
            margin-top: 10px;
        }

        .fecha {
            margin-top: 10px;
            color: #888;
            font-size: 13px;
        }

    </style>

</head>

<body>

<div class="container">

    <h1>Comentarios</h1>

    @if ($errors->any())

        <div class="error">

            @foreach ($errors->all() as $error)

                <div>
                    {{ $error }}
                </div>

            @endforeach

        </div>

    @endif


    <form method="POST" action="/comentarios">

        @csrf

        <label>
            Nombre
        </label>

        <input
            type="text"
            name="nombre"
            placeholder="Escribe tu nombre"
            value="{{ old('nombre') }}"
            required
        >


        <label>
            Comentario
        </label>

        <textarea
            name="comentario"
            placeholder="Escribe tu comentario..."
            required
        >{{ old('comentario') }}</textarea>


        <button type="submit">
            Publicar comentario
        </button>

    </form>


    <div class="comentarios">

        <h2>Comentarios recientes</h2>

        @forelse ($comentarios as $comentario)

            <div class="comentario">

                <div class="nombre">
                    {{ $comentario->nombre }}
                </div>

                <div class="texto">
                    {{ $comentario->comentario }}
                </div>

                <div class="fecha">
                    {{ $comentario->created_at }}
                </div>

            </div>

        @empty

            <p>
                Todavía no hay comentarios.
            </p>

        @endforelse

    </div>

</div>

</body>

</html>