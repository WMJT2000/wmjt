{{-- 
|--------------------------------------------------------------------------
| TABLA GESTIÓN
|--------------------------------------------------------------------------
| 
| Componente reutilizable para tablas administrativas.
|
| Este archivo solamente define la estructura HTML.
|
| La información será colocada posteriormente por
| tabla-gestion.js.
|
|--------------------------------------------------------------------------
--}}

<div
    id="{{ $id }}"
    class="tabla-gestion-wrapper"
>

    <div class="tabla-gestion-container">

        <table class="tabla-gestion">

            <thead>

                <tr>

                    {{-- =================================================
                    COLUMNA DE SELECCIÓN
                    ================================================== --}}

                    @if ($selectable ?? false)

                        <th>
                            Seleccionar
                        </th>

                    @endif


                    {{-- =================================================
                    COLUMNAS
                    ================================================== --}}

                    @foreach ($columns as $column)

                        <th>
                            {{ $column['label'] }}
                        </th>

                    @endforeach


                    {{-- =================================================
                    ACCIONES
                    ================================================== --}}

                    @if (
                        ($actions['edit'] ?? false) ||
                        ($actions['delete'] ?? false)
                    )

                        <th>
                            Acciones
                        </th>

                    @endif

                </tr>

            </thead>


            <tbody>

                <tr>

                    <td
                        colspan="{{
                            count($columns)
                            + (($selectable ?? false) ? 1 : 0)
                            + (
                                ($actions['edit'] ?? false) ||
                                ($actions['delete'] ?? false)
                                ? 1
                                : 0
                            )
                        }}"
                        class="tabla-gestion-loading"
                    >
                        Cargando...
                    </td>

                </tr>

            </tbody>

        </table>

    </div>

</div>