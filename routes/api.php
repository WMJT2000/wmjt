<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TechnologyController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ConceptController;

use App\Http\Controllers\EnglishCategoryController;
use App\Http\Controllers\EnglishWordController;
use App\Http\Controllers\EnglishMeaningController;
use App\Http\Controllers\EnglishPronunciationController;
use App\Http\Controllers\ManualSectionController;
use App\Http\Controllers\ManualStepController;
use App\Http\Controllers\ManualController;
use App\Http\Controllers\ManualExecutionController;

Route::middleware('auth')->group(function () {

    Route::post('/english/pronunciation', [EnglishPronunciationController::class, 'pronounce']);


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


    /*
 |--------------------------------------------------------------------------
 | MANUALES
 |--------------------------------------------------------------------------
 */

    Route::get('/manuals', [
        ManualController::class,
        'index'
    ]);

    Route::get('/manuals/{id}', [
        ManualController::class,
        'show'
    ]);

    Route::post('/manuals', [
        ManualController::class,
        'store'
    ]);

    Route::put('/manuals/{id}', [
        ManualController::class,
        'update'
    ]);

    Route::delete('/manuals/{id}', [
        ManualController::class,
        'destroy'
    ]);

    Route::get('/manuals/{id}/sections', [
        ManualController::class,
        'sections'
    ]);

    Route::get('/manuals/{id}/full', [
        ManualController::class,
        'full'
    ]);


    /*
    |--------------------------------------------------------------------------
    | SECCIONES DE MANUALES
    |--------------------------------------------------------------------------
    */


    Route::get(
        '/manual-sections/manual/{manualId}',
        [ManualSectionController::class, 'byManual']
    );

    Route::get('/manual-sections', [
        ManualSectionController::class,
        'index'
    ]);

    Route::get('/manual-sections/{id}', [
        ManualSectionController::class,
        'show'
    ]);

    Route::post('/manual-sections', [
        ManualSectionController::class,
        'store'
    ]);

    Route::put('/manual-sections/{id}', [
        ManualSectionController::class,
        'update'
    ]);

    Route::delete('/manual-sections/{id}', [
        ManualSectionController::class,
        'destroy'
    ]);

    Route::get('/manual-sections/{id}/steps', [
        ManualSectionController::class,
        'steps'
    ]);


    /*
    |--------------------------------------------------------------------------
    | PASOS DE MANUALES
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/manual-steps/section/{sectionId}',
        [ManualStepController::class, 'bySection']
    );

    Route::get('/manual-steps', [
        ManualStepController::class,
        'index'
    ]);



    Route::get('/manual-steps/{id}', [
        ManualStepController::class,
        'show'
    ]);

    Route::post('/manual-steps', [
        ManualStepController::class,
        'store'
    ]);

    Route::put('/manual-steps/{id}', [
        ManualStepController::class,
        'update'
    ]);

    Route::delete('/manual-steps/{id}', [
        ManualStepController::class,
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




    ///manual excution


    Route::post(
        '/manual-executions',
        [ManualExecutionController::class, 'store']
    );

    Route::get(
        '/manual-executions/{id}',
        [ManualExecutionController::class, 'show']
    );

    Route::get(
        '/manuals/{manualId}/my-execution',
        [ManualExecutionController::class, 'myExecution']
    );

    Route::post(
        '/manual-executions/{executionId}/steps/{stepId}/complete',
        [ManualExecutionController::class, 'completeStep']
    );

    Route::post(
        '/manual-executions/{executionId}/steps/{stepId}/uncomplete',
        [ManualExecutionController::class, 'uncompleteStep']
    );

    Route::post(
        '/manual-executions/{executionId}/steps/{stepId}/notes',
        [ManualExecutionController::class, 'saveStepNote']
    );


    Route::put(
        '/manual-executions/{executionId}/current-step/{stepId}',
        [ManualExecutionController::class, 'updateCurrentStep']
    );


    Route::post(
        '/manual-executions/{manualId}/restart',
        [ManualExecutionController::class, 'restart']
    );



});
