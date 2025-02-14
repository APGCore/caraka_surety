<?php

use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)
        ->name('marketing-partner-submission.')
        ->group(function () {
            Route::get('/create', 'displayCreateByMarketingPartner')->name('create.index');
            Route::get('/history', 'displayHistoryByMarketingPartner')->name('history.index');
            Route::get('/draft', 'displayDocumentDraftByMarketingPartner')->name('document-draft');
            Route::post('/store', 'store')->name('form.store');
            Route::get('/detail/{id}', 'showDetailSubmission')->name('detail');
            Route::get('/draft-doc/{id}', 'showDetailDocsSubmission')->name('docs');
            Route::post('/save-content', 'saveDocument')->name('save.content');

        });
});
