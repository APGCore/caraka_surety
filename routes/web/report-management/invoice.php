<?php

use App\Http\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;

Route::controller(InvoiceController::class)
    ->prefix('invoice')
    ->name('invoice.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{submission}', 'show')->name('show');
        Route::post('/', 'store')->name('store');
    });
