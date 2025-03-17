<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

trait UploadFile
{
    public function base64ToFile($base64String): UploadedFile
    {
        if (str_starts_with($base64String, 'data:image')) {
            preg_match('/data:image\/(\w+);base64,/', $base64String, $matches);
            $extension = $matches[1];

            $base64String = preg_replace('/^data:image\/\w+;base64,/', '', $base64String);
        } else {
            $extension = 'jpg'; // Default to jpg if no extension is found
        }

        // Decode the base64 string
        $fileDataString = base64_decode($base64String);

        // $fileData to UploadedFile
        return UploadedFile::fake()->createWithContent('file.' . $extension, $fileDataString);

    }

    /**
     * Upload file to the storage.
     */
    public function uploadFile(UploadedFile $file, $path, $fileName): string
    {
        $extension = in_array($file->getClientOriginalExtension(), ['png', 'jpg', 'jpeg'])
            ? $file->getClientOriginalExtension()
            : 'pdf';
        $fileName = str_replace(' ', '_', $fileName);
        $newFileName = time() . '_' . $fileName . '.' . $extension;
        $cleanPath = ltrim($path, '/');

        return Storage::disk(config('filesystems.default'))->putFileAs($cleanPath, $file, $newFileName);
    }

    /**
     * Delete file from the storage.
     */
    public function deleteFile($pathAndFileName): void
    {
        $disk = config('filesystems.default');
        Log::info("Checking file: " . $pathAndFileName);

        if (Storage::disk($disk)->exists($pathAndFileName)) {
            Log::info("File exists, deleting: " . $pathAndFileName);
            Storage::disk($disk)->delete($pathAndFileName);
        } else {
            Log::warning("File not found: " . $pathAndFileName);
        }
    }
}
