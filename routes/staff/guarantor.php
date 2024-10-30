<?php

use App\Http\Controllers\Guarantor\GuarantorController;
use Illuminate\Support\Facades\Route;

Route::prefix('guarantor-management')->group(function () {
    Route::controller(GuarantorController::class)->prefix('guarantors')
        ->name('staff-guarantor-')->group(function () {
            Route::get('/{product}', 'getGuarantorByProductId')->name('get.byProduct');
        });
});
