<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HostToHostService
{
    public function sendPostRequest(string $url, string $token, array $data): bool
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => $token,
            ])->post($url, $data);

            if ($response->successful()) {
                activity()
                    ->useLog('host-to-host')
                    ->causedBy(auth()->user())
                    ->log('Sent POST request to '.$url);
                Log::info('Request to '.$url.' was successful', ['response' => $response->json()]);
            }

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Request to '.$url.' was failed: ', ['error' => $e->getMessage()]);

            return false;
        }
    }
}
