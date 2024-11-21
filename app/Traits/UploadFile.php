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
        $extension = $file->getClientOriginalExtension();
        $fileName = str_replace(' ', '_', $fileName);
        $newFileName = time().'_'.$fileName.'.'.$extension;

        return $file->storeAs($path, $newFileName, 'public');
    }

    /**
     * Delete file from the storage.
     */
    public function deleteFile($pathAndFileName): void
    {
        if (Storage::disk('public')->exists($pathAndFileName)) {
            Storage::disk('public')->delete($pathAndFileName);
        }
    }
}
