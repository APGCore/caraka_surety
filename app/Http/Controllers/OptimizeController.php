<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Artisan;

class OptimizeController extends Controller
{
    public function cacheClear()
    {
        try {
            // code...
            Artisan::call('cache:clear');
            Artisan::call('optimize');
            Artisan::call('route:cache');
            Artisan::call('route:clear');
            Artisan::call('view:clear');
            Artisan::call('config:cache');

            flashMessage('success', 'Server Cache Cleared Done!');

            return redirect()->back();
        } catch (\Exception $e) {

            flashMessage('failed', $e->getMessage());

            return redirect()->back();
        }
    }
}
