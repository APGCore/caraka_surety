<?php

use App\Http\Controllers\ExportController;
use Illuminate\Support\Facades\Route;

Route::controller(ExportController::class)
    ->prefix('export')
    ->name('export.')
    ->group(function () {
        Route::prefix('submission')->name('submission.')->group(function () {
            Route::get('pdf', 'pdfPreview')->name('pdf.preview');
            Route::get('word', 'wordDownload')->name('word.preview');
        });
    });
