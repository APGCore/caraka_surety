<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Exports\SubmissionExport;
use App\Models\Document\DocumentFormat;
use App\Models\User;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Submission\Submission;
use PhpOffice\PhpSpreadsheet\Writer\Pdf\Mpdf;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Mpdf\Mpdf;
use App\Traits\ReplaceDocumentFormat;
use TCPDF;

class ExportController extends Controller
{
  use ReplaceDocumentFormat;
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

    public function show($submission_id, $document_format)
    {
        $submission = $this->getSubmission($submission_id);

        $documentFormat = DocumentFormat::query()->findOrFail($document_format);

        $html = $documentFormat->format_document;
        // dd($html);
        // dd($documentFormat);


        if (! $html) {
            abort(404, 'Konten HTML tidak tersedia.');
        }

        // Buat array data yang akan replace placeholder
        $data = $this->convertSubmission($submission);
        // dd($submission);
        $html = $this->replaceDocumentFormat($documentFormat, $data);

        // dd($html, $data);

        $mpdf = new Mpdf([
            'tempDir' => storage_path('tmp/mpdf'),
        ]);
        $mpdf->WriteHTML($html);

        return response($mpdf->Output("invoice-submission-{$submission->id}.pdf", 'S'), 200)
            ->header('Content-Type', 'application/pdf');
    }

    private function getSubmission($submissionId): Submission
    {
        return Submission::with([
            'guarantor.documentFormats',
            'guarantorBranch',
            'principal.district',
            'principal.regency',
            'principal.province',
            'obligee.district',
            'obligee.regency',
            'obligee.province',
            'guarantor.district',
            'guarantor.regency',
            'guarantor.province',
            'product',
            'guarantorToProductType',
            // 'analysis',
            'sourceOfFund',
            'regency',
            'district',
            'province',
            // 'document_formats',
        ])
            ->find($submissionId);
    }

    private function replacePlaceholders(string $html, array $data): string
    {
        foreach ($data as $key => $value) {
            $uppercaseValue = strtoupper($key);
            // dd($uppercaseValue);
            $html = str_replace('['.$uppercaseValue.']', $value, $html);
        }

        return $html;
    }

    public function wordDownload($submission_id, $document_format): StreamedResponse
    {
        $submission = $this->getSubmission($submission_id);

        $documentFormat = DocumentFormat::query()->findOrFail($document_format);

        $html = $documentFormat->format_document;

        if (! $html) {
            abort(404, 'Konten HTML tidak tersedia.');
        }

        // Buat array data yang akan replace placeholder
        $data = $this->convertSubmission($submission);
        // dd($submission);
        $html = $this->replaceDocumentFormat($documentFormat, $data);

        $phpWord = new PhpWord;
        $section = $phpWord->addSection();

        Html::addHtml($section, $html, false, false);

        $tempFile = tempnam(sys_get_temp_dir(), 'word');
        $phpWord->save($tempFile, 'Word2007');

        return response()->streamDownload(function () use ($tempFile) {
            echo file_get_contents($tempFile);
            unlink($tempFile); // Hapus file setelah dikirim
        }, "surat-pengajuan-{$submission->id}.docx", [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]);
    }
}
