<?php

use App\Enums\RoleEnum;
use App\Http\Middleware\HandleRoleUsers;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', HandleRoleUsers::class.':'.RoleEnum::KepalaCabang->value])->prefix('kepala-cabang')->group(function () {
    require_once __DIR__.'/dashboard.php';
    require_once __DIR__.'/submission.php';
});
