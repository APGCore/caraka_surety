<?php

use App\Http\Controllers\Api\FileController;
use App\Http\Middleware\Api\GetFileByTokenGuarantorMiddleware;
use Illuminate\Support\Facades\Route;

Route::controller(FileController::class)->prefix('file')->name('file.')->group(function () {
    Route::middleware(GetFileByTokenGuarantorMiddleware::class)
        ->get('/', 'index')->name('index');
});
