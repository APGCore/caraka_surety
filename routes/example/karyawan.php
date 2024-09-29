<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::get('/example/karyawan', [Controllers\ExampleController::class, 'displayKaryawan'])
    ->name('example.karyawan');
