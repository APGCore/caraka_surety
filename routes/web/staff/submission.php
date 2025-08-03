<?php

use App\Http\Controllers\Submission\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::prefix('submission-management')->group(function () {
    Route::controller(SubmissionController::class)
        ->name('staff-submission-')
        ->group(function () {
            Route::get('/create', 'create')->name('create.submission');
            Route::get('/history', 'displayHistory')->name('history.submission');
            Route::post('/store', 'store')->name('form.store');
            Route::get('/edit/{id}', 'edit')->name('edit');
            Route::get('/detail/{id}', 'showDetailSubmission')->name('detail.submission');
            Route::get('/revision/{id}', 'revision')->name('revision');
            Route::get('/broken/{submission}', 'broken')->name('broken');
            Route::post('/{submission}/embed-qr', 'embedQrCodeToDocs')->name('embedQr');
            Route::post('/publication', 'updatePublication')->name('publication');
            Route::delete('/delete/{submission}', 'destroy')->name('destroy');
        });
});
