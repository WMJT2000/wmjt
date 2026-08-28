<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TechnologyController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ConceptController;


/*
|--------------------------------------------------------------------------
| TECHNOLOGIES
|--------------------------------------------------------------------------
*/

Route::get('/technologies', [
    TechnologyController::class,
    'index'
]);

Route::get('/technologies/{id}', [
    TechnologyController::class,
    'show'
]);

Route::post('/technologies', [
    TechnologyController::class,
    'store'
]);

Route::put('/technologies/{id}', [
    TechnologyController::class,
    'update'
]);

Route::delete('/technologies/{id}', [
    TechnologyController::class,
    'destroy'
]);

Route::get('/technologies/{id}/categories', [
    TechnologyController::class,
    'categories'
]);

Route::get('/technologies/{id}/full', [
    TechnologyController::class,
    'full'
]);


/*
|--------------------------------------------------------------------------
| CATEGORIES
|--------------------------------------------------------------------------
*/

Route::get('/categories', [
    CategoryController::class,
    'index'
]);

Route::get('/categories/{id}', [
    CategoryController::class,
    'show'
]);

Route::post('/categories', [
    CategoryController::class,
    'store'
]);

Route::put('/categories/{id}', [
    CategoryController::class,
    'update'
]);

Route::delete('/categories/{id}', [
    CategoryController::class,
    'destroy'
]);

Route::get('/categories/{id}/concepts', [
    CategoryController::class,
    'concepts'
]);


/*
|--------------------------------------------------------------------------
| CONCEPTS
|--------------------------------------------------------------------------
*/

Route::get('/concepts', [
    ConceptController::class,
    'index'
]);

Route::get('/concepts/{id}', [
    ConceptController::class,
    'show'
]);

Route::post('/concepts', [
    ConceptController::class,
    'store'
]);

Route::put('/concepts/{id}', [
    ConceptController::class,
    'update'
]);

Route::delete('/concepts/{id}', [
    ConceptController::class,
    'destroy'
]);