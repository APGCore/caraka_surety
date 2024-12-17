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
        $url = config('app.binder_byte_api_url').'/'.$route;
        $response = Http::pool(function (Pool $pool) use ($url, $query) {
            $pool->get($url, [
                'api_key' => config('app.binder_byte_api_key'),
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
