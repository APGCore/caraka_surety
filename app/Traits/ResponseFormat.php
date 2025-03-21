<?php

namespace App\Traits;

trait ResponseFormat
{
    /**
     * Format the response success.
     */
    public function responseSuccess($message, $data = null, $code = 200)
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Format the response error.
     */
    public function responseError($message, $data = null, $code = 400)
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
        ], $code);
    }
}
