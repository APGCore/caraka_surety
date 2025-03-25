<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::get('/example', [Controllers\ExampleController::class, 'index'])
  ->name('example.index');

Route::get('/upload-testing', function () {
  try {
    Storage::disk('s3')->put('test.txt', 'Isi file dari Laravel');
    \Illuminate\Support\Facades\Log::info('File berhasil diupload ke S3');
  } catch (Exception $e) {
    \Illuminate\Support\Facades\Log::error('File gagal diupload ke S3', ['error' => $e->getMessage()]);
  }
})->name('example.upload-testing');
