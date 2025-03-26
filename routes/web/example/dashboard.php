<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::get('/example', [Controllers\ExampleController::class, 'index'])
  ->name('example.index');

Route::get('/upload-testing', function () {
  $filePath = 'uploads/test.txt';

  try {
    \Illuminate\Support\Facades\Storage::disk('s3')->put($filePath, 'Laravel Upload Test');
    echo "Upload berhasil ke path: " . $filePath;
  } catch (Exception $e) {
    echo "Error: " . $e->getMessage();
  }
})->name('example.upload-testing');
