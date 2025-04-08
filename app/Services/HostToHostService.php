<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HostToHostService
{
    public function sendPostRequest(string $url, string $token, array $data): array
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => $token,
        ])->post($url, $data);

        $responseJson = $response->json();
        if ($response->successful()) {
            activity()
                ->useLog('host-to-host')
                ->causedBy(auth()->user())
                ->log('Sent POST request to '.$url);
            Log::info('Request to '.$url.' was successful', ['response' => $responseJson]);

            return [
                'status' => 'success',
                'message' => $responseJson,
            ];
        }
        Log::error('Request to '.$url.' was failed: ', ['error' => $responseJson]);

        return [
            'status' => 'error',
            'message' => $responseJson['error']['message'] ?? 'Terjadi Kesalahan',
        ];
    }
}
