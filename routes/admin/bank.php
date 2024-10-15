<?php

use App\Http\Controllers\BankController;
use Illuminate\Support\Facades\Route;

Route::prefix('bank-management')->group(function () {
    Route::controller(BankController::class)->prefix('bank')
        ->name('bank.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/show/{bank}', 'show')->name('show');
            Route::get('/create', 'create')->name('create');
            Route::post('/store', 'store')->name('store');
            Route::delete('/{bank}', 'destroy')->name('destroy');
            Route::get('/edit/{bank}', 'edit')->name('edit');
            Route::patch('/{bank}', 'update')->name('update');

        });
});
