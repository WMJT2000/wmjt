<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TechnologyController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ConceptController;

use App\Http\Controllers\EnglishCategoryController;
use App\Http\Controllers\EnglishWordController;
use App\Http\Controllers\EnglishMeaningController;

Route::middleware('auth')->group(function () {

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


Route::get('/english/categories', [EnglishCategoryController::class, 'index']);
Route::get('/english/categories/{id}', [EnglishCategoryController::class, 'show']);
Route::post('/english/categories', [EnglishCategoryController::class, 'store']);
Route::put('/english/categories/{id}', [EnglishCategoryController::class, 'update']);
Route::delete('/english/categories/{id}', [EnglishCategoryController::class, 'destroy']);

Route::get('/english/words', [EnglishWordController::class, 'index']);

Route::get('/english/words/categories', [
    EnglishWordController::class,
    'categories'
]);

Route::get('/english/words/{id}', [
    EnglishWordController::class,
    'show'
]);

Route::post('/english/words', [
    EnglishWordController::class,
    'store'
]);

Route::put('/english/words/{id}', [
    EnglishWordController::class,
    'update'
]);

Route::delete('/english/words/{id}', [
    EnglishWordController::class,
    'destroy'
]);

Route::get('/english/meanings', [
    EnglishMeaningController::class,
    'index'
]);

Route::get('/english/meanings/categories', [
    EnglishMeaningController::class,
    'categories'
]);

Route::get('/english/meanings/words/{categoryId}', [
    EnglishMeaningController::class,
    'wordsByCategory'
]);

Route::get('/english/meanings/{id}', [
    EnglishMeaningController::class,
    'show'
]);

Route::post('/english/meanings', [
    EnglishMeaningController::class,
    'store'
]);

Route::put('/english/meanings/{id}', [
    EnglishMeaningController::class,
    'update'
]);

Route::delete('/english/meanings/{id}', [
    EnglishMeaningController::class,
    'destroy'
]);
});
