<?php

use App\Http\Controllers\Guarantor\GuarantorRateController;
use Illuminate\Support\Facades\Route;

Route::controller(GuarantorRateController::class)->prefix('guarantor-rate')
    ->name('guarantor-rate.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('list', 'list')->name('list');
        Route::get('create', 'create')->name('create');
        Route::post('store', 'store')->name('store');
        Route::get('{guarantorRate}/edit', 'edit')->name('edit');
        Route::put('{guarantorRate}/update', 'update')->name('update');
        Route::delete('{guarantorRate}/delete', 'destroy')->name('delete');
    });
