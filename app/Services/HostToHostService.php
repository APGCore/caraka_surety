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
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'token '.$token,
        ])->post($url, $data);
        activity()
            ->useLog('host-to-host')
            ->causedBy(auth()->user())
            ->log('Sent POST request to '.$url);

        if ($response->successful()) {
            Log::info('Request to '.$url.' was successful', ['response' => $response->json()]);
        } else {
            Log::error('Request to '.$url.' was failed: ', ['response' => $response->body()]);
        }

        return (object) $response->json();
    }
}
