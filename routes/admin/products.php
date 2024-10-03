<?php

use App\Http\Controllers\Products\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('product-management')->group(function () {
    Route::controller(ProductController::class)->prefix('products')
        ->name('products.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
        });
});
