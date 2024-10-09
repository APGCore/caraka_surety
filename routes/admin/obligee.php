<?php

use App\Http\Controllers\ObligeeController;
use Illuminate\Support\Facades\Route;

Route::prefix('obligees')->group(function () {
    Route::controller(ObligeeController::class)->prefix('obligee-management')
        ->name('obligee.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/show', 'show')->name('show');
            Route::get('/create', 'create')->name('create');
            Route::post('/store', 'store')->name('store');
            Route::delete('/{requiredDoc}', 'destroy')->name('destroy');
            Route::get('/edit/{requiredDoc}', 'edit')->name('edit');
            Route::put('/{requiredDoc}', 'update')->name('update');

        });
});
