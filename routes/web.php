<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KnowledgeController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TechnologyController;
use App\Http\Controllers\ConceptController;
use App\Http\Controllers\ManagementController;
use App\Http\Controllers\KnowledgeManagementController;
use App\Http\Controllers\EnglishLearningController;
use App\Http\Controllers\EnglishManagementController;
use App\Http\Controllers\EnglishCategoryController;
use App\Http\Controllers\EnglishWordController;
use App\Http\Controllers\EnglishMeaningController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/logout-test', function () {
    Auth::logout();

    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return redirect()->route('login');
});

// Página inicial
// Al entrar a http://localhost:8000/
// se envía al login de Breeze
Route::get('/', function () {
    return redirect()->route('login');
})->name('inicio');


// Aprendizaje de inglés
// Aprendizaje de inglés
Route::middleware('auth')->group(function () {

    Route::get('/english', [EnglishLearningController::class, 'index'])
        ->name('english.index');

            Route::get('/english/category/{category}/practice', [EnglishLearningController::class, 'practice'])
    ->name('english.practice');

Route::get('/english/category/{category}/{word?}', [EnglishLearningController::class, 'study'])
    ->name('english.study');



});

// Dashboard principal
// Después de iniciar sesión, se muestra inicio.blade.php
Route::get('/home', [KnowledgeController::class, 'home'])
    ->middleware(['auth', 'verified'])
    ->name('home');


// Dashboard de Breeze
// Si alguna parte de Breeze intenta entrar a /dashboard,
// lo enviamos a nuestro dashboard /home
Route::get('/dashboard', function () {
    return redirect()->route('home');
})->middleware(['auth', 'verified'])->name('dashboard');


// Perfil
Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});


// Conocimiento
Route::middleware('auth')->group(function () {

    Route::get('/knowledge', [KnowledgeController::class, 'index'])
        ->name('knowledge.index');

    Route::get('/knowledge/technology/{id}', [KnowledgeController::class, 'technology'])
        ->name('knowledge.technology');

    Route::get('/knowledge/category/{id}', [KnowledgeController::class, 'category'])
        ->name('knowledge.category');

    Route::get('/knowledge/concept/{id}', [KnowledgeController::class, 'concept'])
        ->name('knowledge.concept');

    Route::get('/knowledge/search', [KnowledgeController::class, 'search'])
        ->name('knowledge.search');
});


// Gestión
// Gestión
Route::middleware('auth')->group(function () {

    // Página principal de gestión
    Route::get('/gestion', [ManagementController::class, 'index'])
        ->name('gestion.index');

    // Gestión del conocimiento técnico
    Route::get('/gestion/conocimiento', [KnowledgeManagementController::class, 'index'])
        ->name('gestion.knowledge.index');

        // Gestión de inglés
Route::get('/gestion/ingles', [EnglishManagementController::class, 'index'])
    ->name('gestion.english.index');

    // Categorías de inglés
Route::get('/gestion/english/categories', [EnglishCategoryController::class, 'page'])
    ->name('english.categories.index');

// Palabras de inglés
Route::get('/gestion/english/words', [EnglishWordController::class, 'page'])
    ->name('english.words.index');

// Significados de inglés
Route::get('/gestion/english/meanings', [EnglishMeaningController::class, 'page'])
    ->name('english.meanings.index');

    // Tecnologías
    Route::get('/gestion/technologies', [TechnologyController::class, 'page'])
        ->name('technologies.index');

    // Categorías
    Route::get('/gestion/categories', [CategoryController::class, 'page'])
        ->name('categories.index');

    // Conceptos
    Route::get('/gestion/concepts', [ConceptController::class, 'page'])
        ->name('concepts.index');

});

// Rutas de Laravel Breeze
require __DIR__.'/auth.php';