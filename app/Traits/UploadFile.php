<?php

namespace App\Traits;

use Exception;
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
    public function uploadFile(UploadedFile $file, string $path, string $fileName): string
    {
        // Ensure a valid extension (defaults to PDF if not image)
        $allowedExtensions = ['png', 'jpg', 'jpeg'];
        $extension = in_array($file->getClientOriginalExtension(), $allowedExtensions)
            ? $file->getClientOriginalExtension()
            : 'pdf';

        // Format file name
        $sanitizedFileName = time() . '_' . str_replace(' ', '_', $fileName) . '.' . $extension;

        // Ensure path does not have leading slashes
        $cleanPath = trim($path, '/');

        // Store file
        $disk = Storage::disk(config('filesystems.default'));
        $storedPath = $disk->putFileAs($cleanPath, $file, $sanitizedFileName);

        if (!$storedPath) {
            throw new Exception('File upload failed.');
        }

        return $storedPath;
    }

    /**
     * Get the file path from the storage.
     */
    public function getFileUrl($path): string
    {
        $disk = Storage::disk(config('filesystems.default'));

        // Jika bucket public, langsung return URL biasa
        if ($disk->exists($path)) {
            return $disk->url($path);
        }

        // Jika private, buat signed URL manual (valid 60 menit)
        return $this->generateTemporaryUrl($path, 60);
    }

    private function generateTemporaryUrl($path, $minutes): string
    {
        $bucket = env('AWS_BUCKET');
        $endpoint = env('AWS_ENDPOINT');

        // Generate timestamp untuk expired time
        $expires = now()->addMinutes($minutes)->timestamp;

        // Buat URL manual (tanpa signature)
        return "{$endpoint}/{$bucket}/{$path}?expires={$expires}";
    }


    /**
     * Delete file from the storage.
     */
    public function deleteFile($pathAndFileName): void
    {
        $disk = config('filesystems.default');
        Log::info('Checking file: ' . $pathAndFileName);

        if (Storage::disk($disk)->exists($pathAndFileName)) {
            Log::info('File exists, deleting: ' . $pathAndFileName);
            Storage::disk($disk)->delete($pathAndFileName);
        } else {
            Log::warning('File not found: ' . $pathAndFileName);
        }
    }
}
