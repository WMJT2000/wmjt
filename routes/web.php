<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    return '<h1>Laravel funciona correctamente</h1>';
});

Route::get('/testdb', function () {
    return 'RUTA TESTDB';
});

Route::get('/categorias', function () {

    $categorias = DB::table('categorias')
        ->orderBy('orden')
        ->get();

    return view('categorias', [
        'categorias' => $categorias
    ]);
});

Route::get('/categoria/{id}', function ($id) {

    $categoria = DB::table('categorias')
        ->where('id', $id)
        ->first();

    if (!$categoria) {
        abort(404);
    }

    return view('categoria', [
        'categoria' => $categoria
    ]);
});


Route::get('/hola', function () {
    return 'HOLA';
});