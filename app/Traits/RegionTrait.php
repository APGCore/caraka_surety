<?php

namespace App\Traits;

use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;

trait RegionTrait
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
