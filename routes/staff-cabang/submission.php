<?php

use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)
        ->name('staff-cabang-submission-')
        ->group(function () {
            Route::get('/create', 'displayCreateByStaff')->name('create.submission');
            Route::get('/history', 'displayHistoryByStaff')->name('history.submission');
            Route::get('/draft', 'displayDocumentDraftByStaff')->name('document-draft.submission');
        });
});
