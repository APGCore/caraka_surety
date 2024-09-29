<?php

namespace App\Http\Controllers\Region;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;

class RegionController extends Controller
{
    /**
     * Synchronize the provinces data from the external API.
     */
    public function syncApi($route, $query = []): array
    {
        return Http::pool(fn (Pool $pool) => [
            $pool->get(env('BINDER_BYTE_API_URL').'/'.$route, [
                'api_key' => env('BINDER_BYTE_API_KEY'),
                ...$query,
            ]),
        ]);
    }
}
