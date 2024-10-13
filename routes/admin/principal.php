<?php

use App\Http\Controllers\PrincipalController;
use Illuminate\Support\Facades\Route;

Route::prefix('principal-management')->group(function () {
    Route::controller(PrincipalController::class)->prefix('principal')
        ->name('principal.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/show/{principal}', 'show')->name('show');
            Route::get('/create', 'create')->name('create');
            Route::post('/store', 'store')->name('store');
            Route::delete('/{principal}', 'destroy')->name('destroy');
            Route::get('/edit/{principal}', 'edit')->name('edit');
            Route::patch('/{principal}', 'update')->name('update');

        });
});
