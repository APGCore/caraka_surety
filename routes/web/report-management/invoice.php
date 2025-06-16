<?php

use App\Enums\RoleEnum;
use App\Http\Controllers\InvoiceController;
use App\Http\Middleware\HandleRoleUsers;
use Illuminate\Support\Facades\Route;

Route::controller(InvoiceController::class)
    ->middleware(HandleRoleUsers::class.':'.implode(',', [RoleEnum::Admin->value, RoleEnum::Keuangan->value]))
    ->prefix('invoice')
    ->name('invoice.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{submission}', 'show')->name('show');
        Route::post('/', 'store')->name('store');
        Route::post('/send-to-finance', 'sendToFinance')->name('send-to-finance');
    });
