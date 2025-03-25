<?php

namespace App\Traits;

use Aws\S3\Exception\S3Exception;
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
    try {
      $allowedExtensions = ['png', 'jpg', 'jpeg'];
      $extension = in_array($file->getClientOriginalExtension(), $allowedExtensions)
        ? $file->getClientOriginalExtension()
        : 'pdf';

      $sanitizedFileName = str_replace('.', '', date('ymd') . '_' . str_replace(' ', '_', $fileName)
          . '_' . date('Hi')) . '.' . $extension;

      $cleanPath = trim($path, '/');

      // Pastikan menggunakan disk S3
      $disk = Storage::disk('s3');
      $storedPath = $disk->putFileAs($cleanPath, $file, $sanitizedFileName);

      if (!$storedPath) {
        throw new Exception('File upload failed: Unable to store file on S3.');
      }

      return $storedPath;

    } catch (S3Exception $e) {  // Tangkap error dari AWS SDK
      Log::error('S3 Upload Error:', [
        'message' => $e->getMessage(),
        'aws_error_type' => $e->getAwsErrorType(),
        'aws_error_code' => $e->getAwsErrorCode(),
        'aws_request_id' => $e->getAwsRequestId(),
        'aws_details' => $e->toArray(), // Ini berisi detail error dari AWS
        'trace' => $e->getTraceAsString(),
      ]);

      throw new Exception('File upload failed: Unable to store file on S3.');
    }
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
    return $disk->temporaryUrl($path, now()->addMinutes(60));
  }

  /**
   * Delete file from the storage.
   */
  public function deleteFile($pathAndFileName): void
  {
    $disk = config('filesystems.default');

    try {
      if (Storage::disk($disk)->exists($pathAndFileName)) {
        Log::info('File exists, deleting: ' . $pathAndFileName);
        Storage::disk($disk)->delete($pathAndFileName);
      } else {
        Log::warning('File not found: ' . $pathAndFileName);
      }
    } catch (Exception $e) {
      Log::error('Unable to check existence for: ' . $pathAndFileName, ['exception' => $e]);
    }
  }
}
