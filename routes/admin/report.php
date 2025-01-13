<?php

use App\Exports\BlankUsageExport;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Maatwebsite\Excel\Facades\Excel;

Route::controller(ReportController::class)->prefix('report')
    ->name('report.')->group(function () {
        Route::prefix('invoice')
            ->name('invoice.')->group(function () {
                Route::get('/', 'invoice')->name('index');
            });
        Route::prefix('production')
            ->name('production.')->group(function () {
                Route::get('/', 'productionReport')->name('index');
            });
        Route::prefix('blank-usage')
            ->name('blank-usage.')->group(function () {
                Route::get('/', 'blankUsage')->name('index');
                // Route::get('/export', 'exportBlankUsage')->name('export');
                Route::get('/export-blank-usage', function () {
                    return Excel::download(new BlankUsageExport, 'blank_usage.xlsx');
                })->name('export-unit');
            });
    });
