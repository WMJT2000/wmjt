<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KnowledgeController;
use Illuminate\Support\Facades\Auth;

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


// Rutas de Laravel Breeze
require __DIR__.'/auth.php';