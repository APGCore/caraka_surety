<?php

use App\Http\Controllers\SubmissionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/pengajuan', [SubmissionController::class, 'index'])->name('pengajuan.index');
});
