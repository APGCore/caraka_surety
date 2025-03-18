<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Submission\GetFileRequest;
use Exception;
use Illuminate\Support\Facades\Log;

class FileController extends Controller
{
    public function index(GetFileRequest $request)
    {
        try {
            $path = $request->get('path');
            $url = $this->getFileUrl($path);

            return response()->redirectTo($url);
        } catch (Exception $e) {
            Log::error('Get File Error: ', ['message' => $e->getMessage()]);

            return $this->responseError('Terjadi Kesalahan Saat Mengambil File', $e->getMessage());
        }
    }
}
