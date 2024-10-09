<?php

/** @noinspection ALL */

use App\Http\Controllers\Scorings\ScoringController;
use Illuminate\Support\Facades\Route;

Route::prefix('scoring-management')->group(function () {
    Route::controller(ScoringController::class)->prefix('scoring')
        ->name('scoring.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::get('/create', 'create')->name('create');
            Route::put('{scoring}', 'update')->name('update');
            Route::get('/edit/{scoring}', 'edit')->name('edit');
            Route::delete('{scoring}', 'destroy')->name('destroy');
        });
});
