<?php

use App\Http\Controllers\RelatedParties\ObligeeController;
use Illuminate\Support\Facades\Route;

Route::prefix('obligee-management')->group(function () {
    Route::controller(ObligeeController::class)->prefix('obligee')
        ->name('obligee.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/show/{obligee}', 'show')->name('show');
            Route::get('/create', 'create')->name('create');
            Route::post('/store', 'store')->name('store');
            Route::get('/edit/{obligee}', 'edit')->name('edit');
            Route::put('/{obligee}', 'update')->name('update');
            Route::delete('/{obligee}', 'destroy')->name('destroy');
        });
});
