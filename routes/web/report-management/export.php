<?php

use App\Http\Controllers\ExportController;
use Illuminate\Support\Facades\Route;

Route::controller(ExportController::class)
    ->prefix('export')
    ->name('export.')
    ->group(function () {
        Route::prefix('submission')->name('submission.')->group(function () {
            Route::get('pdf/{document_format}', 'show')->name('pdf.preview');
            Route::get('word/{document_format}', 'wordDownload')->name('word.preview');
        });
    });
