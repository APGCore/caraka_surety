<?php

namespace App\Traits;

trait ResponseFormat
{
    /**
     * Format the response success.
     */
    public function responseSuccess($message, $data = null)
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
        ]);
    }

    /**
     * Format the response error.
     */
    public function responseError($message, $data = null)
    {
        return response()->json($data, 400);
    }
}
