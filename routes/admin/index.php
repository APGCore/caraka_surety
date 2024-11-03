<?php

use App\Enums\RoleEnum;
use App\Http\Middleware\HandleRoleUsers;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', HandleRoleUsers::class.':'.RoleEnum::Admin->value])->prefix('admin')->group(function () {
    require_once __DIR__.'/dashboard.php';
    require_once __DIR__.'/location.php';
    require_once __DIR__.'/products.php';
    require_once __DIR__.'/submission.php';
    require_once __DIR__.'/office.php';
    require_once __DIR__.'/document.php';
    require_once __DIR__.'/guarantor.php';
    require_once __DIR__.'/scoring.php';
    require_once __DIR__.'/obligee.php';
    require_once __DIR__.'/bank.php';
    require_once __DIR__.'/principal.php';
});
