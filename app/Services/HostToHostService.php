<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HostToHostService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function sendPostRequest(string $url, string $token, array $data): object
    {
        $jsonData = json_encode($data);
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => $token,
        ])->post($url, $jsonData);

        if ($response->successful()) {
            activity()
                ->useLog('host-to-host')
                ->causedBy(auth()->user())
                ->log('Sent POST request to '.$url);
            Log::info('Request to '.$url.' was successful', ['response' => $response->json()]);
        } else {
            Log::error('Request to '.$url.' was failed: ', ['response' => $response->body()]);
        }

        return (object) $response->json();
    }
}
