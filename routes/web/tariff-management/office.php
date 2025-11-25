<?php

use App\Http\Controllers\Office\OfficeRateController;
use Illuminate\Support\Facades\Route;

Route::controller(OfficeRateController::class)->prefix('office-rate')
    ->name('office-rate.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('list', 'list')->name('list');
        Route::post('/', 'store')->name('store');
        Route::get('create', 'create')->name('create');
        Route::get('{profileRate}/edit', 'edit')->name('edit');
        Route::put('{profileRate}/update', 'update')->name('update');
        Route::delete('{profileRate}/delete', 'destroy')->name('destroy');
    });
