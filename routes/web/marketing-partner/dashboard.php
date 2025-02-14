<?php

use App\Enums\RoleEnum;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'dashboardMarketingPartner'])->name(RoleEnum::MarketingPartnerRoute->value);
