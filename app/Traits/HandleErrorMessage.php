<?php

namespace App\Traits;

use Exception;

trait HandleErrorMessage
{
    public function handleErrorMessage(Exception $e): array
    {
        $errorMessage = $e->getMessage();
        $errorCode = $e->getCode();
        $errorFile = $e->getFile();
        $errorLine = $e->getLine();

        if ($errorCode === 0) {
            $errorMessage = 'Terjadi kesalahan pada sistem, silakan coba lagi.';
        }

        return [
            'status' => 'error',
            'message' => $errorMessage,
            'code' => $errorCode,
            'file' => $errorFile,
            'line' => $errorLine,
        ];
    }
}
