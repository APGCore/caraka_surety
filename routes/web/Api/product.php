<?php

use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Products\ProductTipeController;
use Illuminate\Support\Facades\Route;

Route::prefix('product-management')
    ->name('api.product-management.')
    ->group(function () {
        Route::controller(ProductController::class)
            ->prefix('product')
            ->name('product.')
            ->group(function () {
                Route::get('all', 'getAllProducts')->name('all');
            });

        Route::controller(ProductTipeController::class)
            ->prefix('product-type')
            ->name('product-type.')
            ->group(function () {
                Route::get('all', 'index')->name('all');
                Route::get('/get-by-product-and-guarantor/{productId}/guarantor/{guarantorId}', 'getByProductAndGuarantor')->name('from-product-and-guarantor');
            });
    });
