<?php

use App\Http\Controllers\Guarantor\GuarantorController;
use App\Http\Controllers\Guarantor\PatternController;
use Illuminate\Support\Facades\Route;

Route::prefix('guarantor-management')
    ->name('api.guarantor-management.')
    ->group(function () {

        Route::controller(GuarantorController::class)
            ->prefix('guarantor')
            ->name('guarantor.')->group(function () {
                Route::get('all', 'getAll')->name('all');
                Route::get('branch/{headquarterId}', 'getByHeadquarteId')->name('branch.by-headquarter');
                Route::get('branch', 'getAllBranch')->name('branch.all');
                Route::get('{guarantor}/product', 'product')->name('product');
                Route::get('{guarantor}/product/{product}', 'productType')->name('product.type');
            });

        Route::controller(PatternController::class)
            ->prefix('pattern')
            ->name('pattern.')->group(function () {
                Route::get('convert', 'convert')->name('convert');
            });
    });
