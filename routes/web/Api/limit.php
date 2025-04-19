<?php

use App\Http\Controllers\Guarantor\EmployeeLimitController;
use App\Http\Controllers\Guarantor\GuarantorProductTypeLimitController;
use App\Http\Controllers\Guarantor\ProfileLimitController;
use Illuminate\Support\Facades\Route;

Route::prefix('limit-management')
    ->name('api.limit-management.')
    ->group(function () {

        Route::controller(GuarantorProductTypeLimitController::class)
            ->prefix('guarantor-product-type-limit')
            ->name('guarantor-product-type-limit.')->group(function () {

                // api.limit-management.guarantor-product-type-limit.search-guarantor-product-type-limit
                Route::get('search-guarantor-product-type-limit', 'apiSearch')
                    ->name('search-guarantor-product-type-limit');
            });

        Route::controller(ProfileLimitController::class)
            ->prefix('profile-limit')
            ->name('profile-limit.')->group(function () {

                // api.limit-management.profile-limit.search-profile-limit
                Route::get('search-profile-limit', 'apiSearch')
                    ->name('search-profile-limit');
            });

        Route::controller(EmployeeLimitController::class)
            ->prefix('employee-limit')
            ->name('employee-limit.')->group(function () {

                // api.limit-management.employee-limit.search-employee-limit
                Route::get('search-employee-limit', 'apiSearch')
                    ->name('search-employee-limit');
            });
    });
