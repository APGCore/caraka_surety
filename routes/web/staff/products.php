<?php

use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Products\ProductTipeController;
use Illuminate\Support\Facades\Route;

Route::prefix('product-management')->group(function () {
    Route::controller(ProductController::class)->prefix('products')
        ->name('staff-products-')->group(function () {
            Route::get('/all', 'getAllProducts')->name('get.all');
        });

    Route::controller(ProductTipeController::class)->prefix('product-types')
        ->name('staff-product-types-')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/get-by-product-and-guarantor/{productId}/guarantor/{guarantorId}', 'getByProductAndGuarantor')->name('get.by-product-and-guarantor');
        });
});
