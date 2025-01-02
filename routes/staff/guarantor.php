<?php

use App\Http\Controllers\Guarantor\GuarantorController;
use Illuminate\Support\Facades\Route;

Route::prefix('guarantor-management')->group(function () {
    Route::controller(GuarantorController::class)->prefix('guarantors')
        ->name('staff-guarantor-')->group(function () {
            Route::get('/branch/{guarantor}', 'getGuarantorBranchByHeadIsPairing')->name('get.byHeadIsPairing');
            Route::get('/{product}', 'getGuarantorByProductId')->name('get.byProduct');
        });
});
