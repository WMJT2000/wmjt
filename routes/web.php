<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Comentario;

use App\Http\Controllers\KnowledgeController;
use App\Http\Controllers\DashboardController;


Route::get('/', [DashboardController::class, 'index'])
    ->name('dashboard');

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


Route::get('/knowledge', [
    KnowledgeController::class,
    'index'
])->name('knowledge.index');


Route::get('/knowledge/technology/{id}', [
    KnowledgeController::class,
    'technology'
])->name('knowledge.technology');


Route::get('/knowledge/category/{id}', [
    KnowledgeController::class,
    'category'
])->name('knowledge.category');


Route::get('/knowledge/concept/{id}', [
    KnowledgeController::class,
    'concept'
])->name('knowledge.concept');


Route::get('/knowledge/search', [
    KnowledgeController::class,
    'search'
])->name('knowledge.search');