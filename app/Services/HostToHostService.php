<?php

namespace App\Services;

use App\Traits\HandleErrorMessage;
use Exception;
use Illuminate\Support\Facades\Http;

class HostToHostService
{
    use HandleErrorMessage;

    public function sendPostRequest(string $url, string $token, array $data): array
    {
        try {
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

                return [
                    'status' => 'success',
                    'message' => $responseJson,
                ];
            }

            throw new Exception($responseJson['error']['message'] ?? 'Terjadi Kesalahan');
        } catch (Exception $e) {
            return $this->handleErrorMessage($e);
        }
    }
}
