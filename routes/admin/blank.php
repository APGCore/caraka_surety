<?php

use App\Http\Controllers\Guarantor\BlankController;
use App\Http\Controllers\Guarantor\DistributionOfBlankController;
use Illuminate\Support\Facades\Route;

Route::prefix('blank-management')->name('blank-management.')->group(function () {
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
});
