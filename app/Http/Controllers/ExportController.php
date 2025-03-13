<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Submission\SubmissionDoc;
use App\Models\Document\DocumentFormat;
use TCPDF;
use Storage;

class ExportController extends Controller
{
    public function exportToPdf($docId)
    {
        // $document = SubmissionDoc::findOrFail($docId);
        $document = DocumentFormat::findOrFail($docId);

        $pdf = new TCPDF();
        $pdf->SetCreator('MyApp');
        $pdf->SetAuthor('MyApp');
        $pdf->SetTitle($document->name);

        // Matikan header agar tidak ada margin atas tambahan
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);

        // Atur margin agar lebih kecil
        $pdf->SetMargins(10, 5, 10); // Kiri, Atas, Kanan
        $pdf->SetAutoPageBreak(true, 5); // Auto Page Break dengan jarak bawah 5px

        $pdf->AddPage();

        // Ambil isi HTML dari format_document
        $html = $document->format_document;

        // Konversi HTML ke PDF
        $pdf->writeHTML($html, true, false, true, false, '');

        // Buat response download langsung
        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->Output('', 'S'); // Output sebagai string
        }, $document->name . '.pdf');
    }

    public function uploadToS3($docId)
    {
        $pdfPath = 'temp/document_' . $docId . '.pdf';

        if (!Storage::disk('local')->exists($pdfPath)) {
            return response()->json(['error' => 'File PDF tidak ditemukan'], 404);
        }

        // Unggah ke S3
        $s3Path = 'documents/' . basename($pdfPath);
        Storage::disk('s3')->put($s3Path, Storage::disk('local')->get($pdfPath));

        // Hapus file dari penyimpanan lokal setelah diunggah
        Storage::disk('local')->delete($pdfPath);

        return response()->json(['message' => 'PDF berhasil diunggah ke S3', 's3_path' => $s3Path]);
    }
}
