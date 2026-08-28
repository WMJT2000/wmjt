<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Comentario;


Route::get('/', function () {

    return view('inicio');

});

/*
|--------------------------------------------------------------------------
| GESTIÓN DE TECNOLOGÍAS
|--------------------------------------------------------------------------
*/

Route::get('/gestion/technologies', function () {

    return view(
        'technologies.index'
    );

});


/*
|--------------------------------------------------------------------------
| GESTIÓN DE CATEGORÍAS
|--------------------------------------------------------------------------
*/

Route::get('/gestion/categories', function () {

    return view(
        'categories.index'
    );

});


/*
|--------------------------------------------------------------------------
| GESTIÓN DE CONCEPTOS
|--------------------------------------------------------------------------
*/

Route::get('/gestion/concepts', function () {

    return view(
        'concepts.index'
    );

});