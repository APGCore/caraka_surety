<?php

use App\Enums\RoleEnum;
use App\Http\Controllers\ExportController;
use App\Http\Middleware\HandleRoleUsers;
use Illuminate\Support\Facades\Route;

Route::middleware(HandleRoleUsers::class . ':' . implode(',', [
    RoleEnum::Admin->value,
    RoleEnum::Direksi->value,
    RoleEnum::Manager->value,
    RoleEnum::Staff->value,
    RoleEnum::Keuangan->value
  ]))
    ->prefix('submission')
    ->name('submission.')->group(function () {
        Route::get('/', [ExportController::class, 'submissionToExcel'])->name('export.excel');
    });
