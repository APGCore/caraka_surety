<?php

use App\Http\Controllers\RelatedParties\BankController;
use App\Http\Controllers\RelatedParties\BranchBankController;
use Illuminate\Support\Facades\Route;

Route::prefix('bank-management')->group(function () {
    Route::controller(BankController::class)->prefix('bank')
        ->name('bank.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::post('/store', 'store')->name('store');
            Route::get('/edit/{bank}', 'edit')->name('edit');
            Route::post('/update/{bank}', 'update')->name('update');
            Route::delete('/delete/{bank}', 'destroy')->name('destroy');

            // branch
            Route::controller(BranchBankController::class)->prefix('branch')
                ->name('branch.')->group(function () {
                    Route::get('/{bank}', 'index')->name('index');
                    Route::get('/{bank}/create', 'create')->name('create');
                    Route::post('/store', 'store')->name('store');
                    Route::get('/edit/{branch}', 'edit')->name('edit');
                    Route::post('/update/{branch}', 'update')->name('update');
                    Route::delete('/delete/{branch}', 'destroy')->name('destroy');
                });
        });
});
