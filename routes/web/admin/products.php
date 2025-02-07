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
            Route::get('/all', 'getAllProductType')->name('all');
            Route::post('/store', 'store')->name('store');
            Route::get('/edit/{productTipe}', 'edit')->name('edit');
            Route::put('update/{productTipe}', 'update')->name('update');
            Route::delete('destroy/{productTipe}', 'destroy')->name('destroy');
            Route::get('/get-by-product/{productId}', 'getByProduct')->name('get-by-product');
        });
});
