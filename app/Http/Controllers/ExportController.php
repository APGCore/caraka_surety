<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Exports\SubmissionExport;
use App\Models\Document\DocumentFormat;
use App\Models\User;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use TCPDF;

class ExportController extends Controller
{
    public function exportToPdf($docId): StreamedResponse
    {
        $document = DocumentFormat::query()->findOrFail($docId);

        $pdf = new TCPDF;
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
        }, $document->name.'.pdf');
    }

    public function submissionToExcel(Request $request): BinaryFileResponse
    {
        $request->merge([
            'submission_ids' => explode(',', $request->get('submission_ids', '')),
        ]);
        // Validasi input jika diperlukan
        $validatedData = $request->validate([
            'submission_ids' => 'nullable|array',
            'submission_ids.*' => 'integer|exists:submissions,id,deleted_at,NULL',
        ]);
        $submissionIds = $validatedData['submission_ids'];

        $user = User::query()->with('office')->findOrFail(auth()->id());
        $office = $user->office;
        $isBranch = $office->office_type === OfficeType::BRANCH->value;

        return Excel::download(new SubmissionExport($submissionIds, $isBranch), 'Laporan Produksi.xlsx');
    }
}
