@extends('layouts.app')

@section('title', 'Objetivo de Aprendizaje')

@section('content')

<div class="hellad">

    <div class="hellad-breadcrumb">

        <a href="{{ route('hellad.index') }}">
            HELLAD
        </a>

        <span>›</span>

        <span>Objetivo de aprendizaje</span>

    </div>


    {{-- OBJETIVO --}}

    <div class="hellad-header">

        <span class="hellad-item-number">
            OBJETIVO DE APRENDIZAJE
        </span>

        <div class="hellad-objective-box">

            <p>
                {{ $objetivo->descripcion }}
            </p>

        </div>

    </div>


    {{-- DESTREZAS --}}

    <div class="hellad-section">

        <h2>
            Destrezas
        </h2>

        <p>
            Consulta las destrezas correspondientes a cada rango de edad.
        </p>

    </div>


    {{-- CONTROLES --}}

    <div class="hellad-toolbar">

        <input type="search" id="helladSearch" class="hellad-search" placeholder="Buscar una destreza...">

        <select id="helladAge" class="hellad-filter">

            <option value="all">
                Todas las edades
            </option>

            <option value="0-5">
                0–5 meses
            </option>

            <option value="6-11">
                6–11 meses
            </option>

            <option value="12-23">
                12–23 meses
            </option>

            <option value="24-35">
                24–35 meses
            </option>

            <option value="36-47">
                36–47 meses
            </option>

            <option value="48-59">
                48–59 meses
            </option>

        </select>

    </div>


    {{-- ESTADÍSTICAS --}}

    <div class="hellad-stats">

        <span>
            <strong id="helladVisible">
                {{ $objetivo->destrezas->count() }}
            </strong>
            destrezas
        </span>

        <span>
            Objetivo #{{ $objetivo->id }}
        </span>

    </div>


    {{-- LISTA --}}

    <div class="hellad-list" id="helladDestrezas">

        @foreach ($objetivo->destrezas as $index => $destreza)

        <div class="hellad-item hellad-destreza"
            data-age="{{ $destreza->edad_min_meses }}-{{ $destreza->edad_max_meses }}"
            data-text="{{ strtolower($destreza->descripcion) }}">

            <div class="hellad-item-header">

                <span class="hellad-item-number">
                    DESTREZA {{ $index + 1 }}
                </span>

                <span class="hellad-item-age">

                    {{ $destreza->edad_min_meses }}
                    –
                    {{ $destreza->edad_max_meses }}
                    meses

                </span>

            </div>

            <p class="hellad-item-text">
                {{ $destreza->descripcion }}
            </p>

        </div>

        @endforeach

    </div>


    <div id="helladEmpty" class="hellad-empty" style="display:none;">
        No encontramos destrezas con esos criterios.
    </div>

</div>


<script>
document.addEventListener('DOMContentLoaded', function() {

    const search = document.getElementById('helladSearch');
    const age = document.getElementById('helladAge');
    const items = document.querySelectorAll('.hellad-destreza');
    const visible = document.getElementById('helladVisible');
    const empty = document.getElementById('helladEmpty');

    function filterDestrezas() {

        const searchValue =
            search.value.toLowerCase().trim();

        const ageValue =
            age.value;

        let count = 0;

        items.forEach(function(item) {

            const text =
                item.dataset.text;

            const itemAge =
                item.dataset.age;

            const matchesSearch =
                text.includes(searchValue);

            const matchesAge =
                ageValue === 'all' ||
                itemAge === ageValue;

            if (matchesSearch && matchesAge) {

                item.style.display = 'block';

                count++;

            } else {

                item.style.display = 'none';

            }

        });

        visible.textContent = count;

        empty.style.display =
            count === 0 ? 'block' : 'none';

    }

    search.addEventListener(
        'input',
        filterDestrezas
    );

    age.addEventListener(
        'change',
        filterDestrezas
    );

});
</script>

@endsection