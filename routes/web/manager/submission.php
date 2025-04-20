<?php

use App\Http\Controllers\ExportController;
use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)
        ->name('manager-submission-')
        ->group(function () {
            Route::get('/list', 'displaySubmission')->name('list.submission');
            Route::get('/history', 'displayHistory')->name('history.submission');

            Route::post('/approve/{submission}', 'approve')->name('approve');
            Route::post('/reject/{submission}', 'reject')->name('reject');
            Route::post('/check/{submission}', 'check')->name('check');

            Route::get('/detail/{id}', 'showDetailSubmission')->name('detail.submission');
            // Route::get('/detail-doc/{id}', 'showDetailDocsSubmissionManager')->name('detail.submission');
            Route::get('/draft-doc/{id}', 'showDetailDocsSubmissionManager')->name('docs.submission');

            Route::post('/save-doc', 'saveDocSignatured')->name('save-permohonan-doc.submission');
            Route::post('/submissions/{submission}/embed-qr','embedQrCodeToDocs')->name('submissions.embedQr');

        });
});

Route::get('/submission-management/document-draft/export-pdf/{id}', [ExportController::class, 'exportToPdf'])->name('export.pdf');
Route::post('/submission-management/document-draft/upload-pdf/{id}', [ExportController::class, 'uploadToS3'])->name('upload.pdf');
