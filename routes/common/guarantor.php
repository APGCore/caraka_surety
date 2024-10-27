<?php

use App\Http\Controllers\Guarantor\GuarantorController;
use App\Http\Controllers\Guarantor\PatternController;
use Illuminate\Support\Facades\Route;

Route::prefix('references')->name('references.')->group(function () {
    Route::controller(GuarantorController::class)->prefix('guarantor')->name('guarantor.')->group(function () {
        Route::get('all', 'getAll')->name('all');
        Route::get('{guarantor}/product/', 'product')->name('product');
        Route::get('{guarantor}/product/{product}', 'productType')->name('product-type');
    });

    Route::controller(PatternController::class)->prefix('pattern')->name('pattern.')->group(function () {
        Route::get('convert', 'convert')->name('convert');
    });
});
