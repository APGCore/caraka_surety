<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::controller(ReportController::class)->prefix('report')
    ->name('report.')->group(function () {
        Route::prefix('invoice')
            ->name('invoice.')->group(function () {
                Route::get('/', 'invoice')->name('index');
            });
    });
