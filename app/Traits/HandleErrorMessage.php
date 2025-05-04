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
        $isSQL = false;

        if (str_contains($errorMessage, 'SQL') || str_contains($errorMessage, 'sql')) {
            $errorMessage = 'Terjadi kesalahan pada database, silakan hubungi administrator.';
            $isSQL = true;
        }

        return [
            'status' => 'error',
            'message' => $errorMessage,
            'code' => $errorCode,
            'file' => $errorFile,
            'line' => $errorLine,
            ...($isSQL ? ['sql_error' => $e->getMessage()] : []),
        ];
    }
}
