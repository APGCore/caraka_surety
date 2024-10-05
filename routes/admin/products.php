<?php

use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Products\ProductTipeController;
use Illuminate\Support\Facades\Route;

Route::prefix('product-management')->group(function () {
    Route::controller(ProductController::class)->prefix('products')
        ->name('products.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::post('/store', 'store')->name('store');
            Route::delete('/{product}', 'destroy')->name('destroy');
            Route::get('/edit/{product}', 'edit')->name('edit');
            Route::put('/{product}', 'update')->name('update');
        });

    Route::controller(ProductTipeController::class)->prefix('product-types')
        ->name('product-types.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::post('/store', 'store')->name('store');
            Route::delete('/{productTipe}', 'destroy')->name('destroy');
            Route::get('/edit/{productTipe}', 'edit')->name('edit');
            Route::put('/{productTipe}', 'update')->name('update');
        });
});
