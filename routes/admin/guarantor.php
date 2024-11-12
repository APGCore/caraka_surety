<?php

use App\Http\Controllers\Guarantor\BlankController;
use App\Http\Controllers\Guarantor\DistributionOfBlankController;
use App\Http\Controllers\Guarantor\EmployeeLimitController;
use App\Http\Controllers\Guarantor\GuarantorController;
use App\Http\Controllers\Guarantor\GuarantorProductTypeLimitController;
use App\Http\Controllers\Guarantor\GuarantorRateController;
use App\Http\Controllers\Guarantor\GuarantorToProductTypeController;
use App\Http\Controllers\Guarantor\ProfileLimitController;
use Illuminate\Support\Facades\Route;

Route::prefix('guarantor-management')->group(function () {
    Route::controller(GuarantorController::class)->prefix('guarantor')->name('guarantor.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('create', 'create')->name('create');
        Route::post('store', 'store')->name('store');
        Route::get('edit/{guarantor}', 'edit')->name('edit');
        Route::post('update/{guarantor}', 'update')->name('update');
        Route::delete('destroy/{guarantor}', 'destroy')->name('destroy');
    });

    Route::prefix('product-guarantor')->name('product-guarantor.')->group(function () {
        Route::get('/', [GuarantorToProductTypeController::class, 'index'])->name('index');
        Route::get('get-by-guarantor/{guarantorId}', [GuarantorToProductTypeController::class, 'getByGuarantor'])->name('get-by-guarantor');
        Route::post('store', [GuarantorToProductTypeController::class, 'store'])->name('store');
        Route::put('update/{guarantorToProductType}', [GuarantorToProductTypeController::class, 'update'])->name('update');
        Route::delete('destroy/{guarantorToProductType}', [GuarantorToProductTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('blank')->name('blank.')->group(function () {
        Route::get('/', [BlankController::class, 'index'])->name('index');
        Route::post('store', [BlankController::class, 'store'])->name('store');
        Route::post('store/multi', [BlankController::class, 'storeMulti'])->name('store.multi');
        Route::put('update/{blank}', [BlankController::class, 'update'])->name('update');
        Route::delete('destroy/{blank}', [BlankController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('distribution-of-blank')->name('distribution-of-blank.')->group(function () {
        Route::get('/', [DistributionOfBlankController::class, 'index'])->name('index');
        Route::post('store', [DistributionOfBlankController::class, 'store'])->name('store');
        Route::delete('destroy/{blank}', [DistributionOfBlankController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('profile-limit')->name('profile-limit.')->group(function () {
        Route::get('/', [ProfileLimitController::class, 'index'])->name('index');
        Route::post('store', [ProfileLimitController::class, 'store'])->name('store');
        Route::put('update/{profileLimit}', [ProfileLimitController::class, 'update'])->name('update');
        Route::delete('destroy/{profileLimit}', [ProfileLimitController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('employee-limit')->name('employee-limit.')->group(function () {
        Route::get('/', [EmployeeLimitController::class, 'index'])->name('index');
        Route::post('store', [EmployeeLimitController::class, 'store'])->name('store');
        Route::put('update/{employeeLimit}', [EmployeeLimitController::class, 'update'])->name('update');
        Route::delete('destroy/{employeeLimit}', [EmployeeLimitController::class, 'destroy'])->name('destroy');
    });

    Route::controller(GuarantorRateController::class)->prefix('guarantor-rate')
        ->name('guarantor-rate.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('create/{guarantorToProductType}', 'create')->name('create');
            Route::post('store/{guarantorToProductType}', 'store')->name('store');
        });

    Route::controller(GuarantorProductTypeLimitController::class)->prefix('guarantor-product-type-limit')
        ->name('guarantor-product-type-limit.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('store', 'store')->name('store');
            Route::put('update/{guarantorProductTypeLimit}', 'update')->name('update');
            Route::delete('destroy/{guarantorProductTypeLimit}', 'destroy')->name('destroy');
        });
});
