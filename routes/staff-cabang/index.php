<?php

use App\Enums\RoleEnum;
use App\Http\Middleware\HandleRoleUsers;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', HandleRoleUsers::class.':'.RoleEnum::Staff->value])->prefix('staff-cabang')->group(function () {
    require_once __DIR__.'/dashboard.php';
    require_once __DIR__.'/submission.php';
});
