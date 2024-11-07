<?php

namespace App\Traits;

use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

trait RegionTrait
{
    /**
     * Synchronize the provinces data from the external API.
     */
    public function syncApi($route, $query = []): array
    {
        $url = env('BINDER_BYTE_API_URL').'/'.$route;
        $response = Http::pool(function (Pool $pool) use ($url, $query) {
            $pool->get($url, [
                'api_key' => env('BINDER_BYTE_API_KEY'),
                ...$query,
            ]);
        });

        if ($response[0]->json('value') === null) {
            Log::error('Binder Byte API Request Failed', [
                'url' => $url,
                'query' => $query,
                'errors' => $response[0],
            ]);
        }

        return $response;
    }
}
