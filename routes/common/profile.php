<?php

use App\Http\Controllers\Office\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/profile', [UserController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile-bpr', [UserController::class, 'updateCenter'])->name('profile.update.bpr');
    Route::patch('/profile', [UserController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [UserController::class, 'destroy'])->name('profile.destroy');
});

Route::prefix('references')->name('references.')->group(function () {

    // references.profile.*
    Route::controller(ProfileController::class)->prefix('profile')
        ->name('profile.')->group(function () {
            Route::get('all', 'all')->name('all');
        });
});
