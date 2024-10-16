<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait UploadFile
{
    /**
     * Upload file to the storage.
     */
    public function uploadFile(UploadedFile $file, $path, $fileName): string
    {
        $newFileName = time().'_'.$fileName;
        return $file->storeAs($path, $newFileName,'public');
    }

    /**
     * Delete file from the storage.
     */
    public function deleteFile($pathAndFileName): void
    {
        if (Storage::exists($pathAndFileName)) {
            Storage::delete($pathAndFileName);
        }
    }
}
