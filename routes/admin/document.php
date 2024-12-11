<?php

use App\Http\Controllers\Document\DocumentFormatController;
use App\Http\Controllers\Document\DocumentRequiredController;
use Illuminate\Support\Facades\Route;

Route::prefix('documents')->group(function () {
    Route::controller(DocumentRequiredController::class)->prefix('document-required')
        ->name('document.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/show', 'show')->name('show');
            Route::get('/create', 'create')->name('create');
            Route::post('/store', 'store')->name('store');
            Route::get('/edit/{requiredDoc}', 'edit')->name('edit');
            Route::put('/{requiredDoc}', 'update')->name('update');
            Route::delete('/{requiredDoc}', 'destroy')->name('destroy');
        });

    Route::controller(DocumentFormatController::class)->prefix('format')
        ->name('document-format.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/show', 'show')->name('show');
            Route::get('/create', 'create')->name('create');
            Route::post('/store', 'store')->name('store');
            Route::get('/edit/{documentFormat}', 'edit')->name('edit');
            Route::put('/{documentFormat}', 'update')->name('update');
            Route::delete('/{documentFormat}', 'destroy')->name('destroy');
        });
});
