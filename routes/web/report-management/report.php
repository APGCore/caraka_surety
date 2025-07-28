<?php

use App\Enums\RoleEnum;
use App\Exports\BlankUsageBranchExport;
use App\Exports\BlankUsageExport;
use App\Http\Controllers\ReportController;
use App\Http\Middleware\HandleRoleUsers;
use Illuminate\Support\Facades\Route;
use Maatwebsite\Excel\Facades\Excel;

Route::controller(ReportController::class)
    ->middleware(HandleRoleUsers::class.':'.implode(',', [RoleEnum::Admin->value, RoleEnum::Keuangan->value]))
    ->group(function () {
        Route::prefix('production')
            ->name('production.')->group(function () {
                Route::get('/', 'productionReportV2')->name('index');
            });
        Route::prefix('blank-usage')
            ->name('blank-usage.')->group(function () {
                Route::get('/', 'blankUsage')->name('index');
                // Route::get('/export', 'exportBlankUsage')->name('export');
                Route::get('/export-blank-usage', function () {
                    return Excel::download(new BlankUsageExport, 'blank_usage.xlsx');
                })->name('export-unit');

                Route::get('/export-blank-usage-per-branch', function () {
                    return Excel::download(new BlankUsageBranchExport, 'blank_usage_per_branch.xlsx');
                })->name('export-branch');
            });
    });
