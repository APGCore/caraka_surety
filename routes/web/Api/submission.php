<?php

use App\Http\Controllers\Api\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::controller(SubmissionController::class)
    ->prefix('submission-management')
    ->name('api.submission-management.')
    ->group(function () {
        Route::get('post-to-get-callback', 'postToGetCallback')->name('post-to-get-callback');
        Route::post('set-blank', 'setBlank')->name('set-blank');
        Route::post('save-doc', 'saveDocSignature')->name('save-permohonan-doc');
        Route::post('document/{submissionId}/store', 'storeDocument')->name('document.store');
        Route::put('document/{submissionDoc}', 'updateDocument')->name('document.update');
        Route::post('send/{submission}', 'send')->name('send');
        Route::post('specimen/download', 'downloadSpecimenPdf')->name('specimen.download');
        Route::get('specimen/{submissionId}', 'getSpecimenPdf')->name('specimen.get');
        Route::get('specimen/{submissionId}/preview', 'previewSpecimenPdf')->name('specimen.preview');
    });
