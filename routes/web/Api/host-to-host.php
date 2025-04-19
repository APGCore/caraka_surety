<?php

use App\Http\Controllers\HostToHostController;
use Illuminate\Support\Facades\Route;

Route::prefix('host-to-host-management')
    ->name('api.host-to-host-management.')
    ->group(function () {

        Route::controller(HostToHostController::class)
            ->prefix('host-to-host')
            ->name('host-to-host.')->group(function () {

                // NAME: api.host-to-host-management.host-to-host.search-host-to-host
                // PATH: /host-to-host-management/host-to-host/search-host-to-host
                Route::get('search-host-to-host', 'apiSearch')->name('search-host-to-host');
            });
    });
