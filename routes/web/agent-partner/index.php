<?php

use App\Enums\RoleEnum;
use App\Http\Middleware\HandleRoleUsers;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', HandleRoleUsers::class.':'.RoleEnum::AgentPartner->value])->prefix('agent-partner')->group(function () {
    foreach (glob(__DIR__.'/*.php') as $file) {
        require_once $file;
    }
});
