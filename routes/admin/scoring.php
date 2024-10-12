<?php

/** @noinspection ALL */

use App\Http\Controllers\Scorings\ScoringController;
use App\Http\Controllers\Scorings\ScoringQuestionCategoryController;
use App\Http\Controllers\Scorings\ScoringQuestionController;
use Illuminate\Support\Facades\Route;

Route::prefix('scoring-management')->group(function () {
    Route::controller(ScoringController::class)->prefix('scoring')
        ->name('scoring.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::get('/create', 'create')->name('create');
            Route::get('/all', 'getAllScoring')->name('all');
            Route::put('{scoring}', 'update')->name('update');
            Route::get('/edit/{scoring}', 'edit')->name('edit');
            Route::delete('{scoring}', 'destroy')->name('destroy');
        });

    Route::controller(ScoringQuestionCategoryController::class)->prefix('scoring-question-category')
        ->name('scoring-question-category.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::get('/create', 'create')->name('create');
            Route::put('{scoringQuestionCategory}', 'update')->name('update');
            Route::get('/edit/{scoringQuestionCategory}', 'edit')->name('edit');
            Route::get('/get-by-scoring/{scoringId}', 'getByScoring')->name('get-by-scoring');
            Route::delete('{scoringQuestionCategory}', 'destroy')->name('destroy');
        });

    Route::controller(ScoringQuestionController::class)->prefix('scoring-question')
        ->name('scoring-question.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::get('/create', 'create')->name('create');
            Route::put('{scoringQuestion}', 'update')->name('update');
            Route::get('/edit/{scoringQuestion}', 'edit')->name('edit');
            Route::delete('{scoringQuestion}', 'destroy')->name('destroy');
        });
});
