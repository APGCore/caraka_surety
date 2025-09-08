<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Exports\SubmissionExport;
use App\Models\Document\DocumentFormat;
use App\Models\User;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Submission\Submission;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Carbon;
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
        $data = [
            'principal_name' => $submission->principal->name ?? '',
            'location' => $submission->principal->address ?? '',
            'npwp' => $submission->principal->npwp ?? '',
            'nib' => $submission->principal->nib ?? '',
            'telephone' => $submission->principal->telephone ?? '',
            'director_name' => $submission->principal->director_name ?? '',
            'director_phone' => $submission->principal->director_phone ?? '',
            'bussiness_field' => $submission->principal->bussiness_field ?? '',
            'principal_commissioner' => $submission->principal->commissioner ?? '',
            'pic' => $submission->principal->pic ?? '',
            'director_position' => $submission->principal->director_position ?? '',
            'principal_address' => "{$submission->principal->address}, {$submission->principal->district->name}, {$submission->principal->regency->name}, {$submission->principal->province->name}",
            'est_deed' => $submission->principal->est_deed ?? '',
            'last_deed' => $submission->principal->last_deed ?? '',
            'get_susunan_pengurus' => $submission->get_administators_principal ?? '',
            'get_exp' => $submission->get_exp ?? '',
            'bank_name' => $submission->bankBranch->name ?? '',
            'bank_address' => $submission->bankBranch?->address ?? '',
            'obligee_name' => $submission->obligee->name ?? '',
            'obligee_address' => $submission->obligee->address ?? '',
            'source_of_fund' => $submission->source_of_fund->name ?? '',
            'ppk_name' => $submission->obligee->pic ?? '',
            'ppk_number' => $submission->obligee->no_ppk ?? '',
            'principal_siup' => $submission->principal->siup_siujk ?? '',
            'obligee_city' => $submission->obligee->district->name ?? '',
            'obligee_location' => "{$submission->obligee->address}, {$submission->obligee->district->name}, {$submission->obligee->regency->name}, {$submission->obligee->province->name}",
            'guarantor_name' => $submission->guarantor->name ?? '',
            'guarantor_address' => $submission->guarantor_address ?? '',
            'guarantor_pic' => $submission->guarantor_pic ?? '',
            'guarantor_location' => "{$submission->guarantor->address}, {$submission->guarantor->district->name}, {$submission->guarantor->regency->name}, {$submission->guarantor->province->name}",
            'guarantor_city' => $submission->guarantor_city ?? '',
            'source_of_fund_name' => $submission->source_of_fund->name ?? '',
            'contract_value' => $submission->contract_value ? number_format($submission->contract_value, 0, ',', '.') : '',
            'guarantee_value' => $submission->guarantee_value ? number_format($submission->guarantee_value, 0, ',', '.') : '',
            'guarantee_type' => $submission->guarantorToProductType->name ?? '',
            'no_guarantee' => $submission->no_guarantee ?? '',
            'time_period' => $submission->time_period ?? '',
            'job_name' => $submission->job_name ?? '',
            'job_location_village' => $submission->job_location_village ?? '',
            'contract_doc_name' => $submission->contract_doc_name ?? '',
            'contract_doc_number' => $submission->contract_doc_number ?? '',
            'contract_doc_date' => $submission->contract_doc_date ?? '',
            'start_date' => $submission->start_date ? Carbon::parse($submission->start_date)->translatedFormat('d F Y') : '',
            'end_date' => $submission->end_date ? Carbon::parse($submission->end_date)->translatedFormat('d F Y') : '',
            'guarantee_issue_date' => $submission->guarantee_issue_date ?? '',
            'submission_date' => $submission->created_at?->translatedFormat('d F Y') ?? '',
            'day' => $submission->day_name ?? '',
            // 'character_score'      => $submission->analysis->character ?? '',
            // 'capacity_score'       => $submission->analysis->capacity ?? '',
            // 'capital_score'        => $submission->analysis->capital ?? '',
            // 'collateral_score'     => $submission->analysis->collateral ?? '',
            // 'condition_score'      => $submission->analysis->condition ?? '',
            'total_score' => $submission->total_score ?? '',
            'recommendation' => $submission->recommendation ?? '',
            'notes' => $submission->notes ?? '',
            'analyst_name' => $submission->analyst_name ?? '',
            'manager_technique_name' => $submission->manager_technique_name ?? '',
            'branch_manager' => $submission->principal->director_name ?? '',
            'job_location' => "{$submission->job_location_village}, {$submission->district->name}, {$submission->regency->name}, {$submission->province->name}",
            'job_group' => $submission->guarantorToProductType->job_group ?? '',
            'no' => $submission->id ?? '',
            'city' => $submission->regency->name ?? '',
            'mail_number' => $submission->mail_number ?? '',
            'mail_number_resume' => $submission->mail_number_resume ?? '',
            'underlying' => ($submission->contract_doc_name.' '.$submission->contract_doc_number.' '.$submission->job_name) ?? '',
            'product_name' => $submission->product->name ?? '',
            'submission_support_docs' => $submission->submission_support_docs ?? '',
            'terbilang' => $submission->terbilang ?? '',
            'terbilang_hari' => $submission->terbilang_hari ?? '',
            'bank_branch_name' => $submission->bankBranch?->name ?? '',

        ];
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

        $data = [
            'PRINCIPAL_NAME' => $submission->principal->name ?? '',
            'location' => $submission->principal->address ?? '',
            'npwp' => $submission->principal->npwp ?? '',
            'nib' => $submission->principal->nib ?? '',
            'telephone' => $submission->principal->telephone ?? '',
            'director_name' => $submission->principal->director_name ?? '',
            'director_phone' => $submission->principal->director_phone ?? '',
            'bussiness_field' => $submission->principal->bussiness_field ?? '',
            'principal_commissioner' => $submission->principal->commissioner ?? '',
            'pic' => $submission->principal->pic ?? '',
            'director_position' => $submission->principal->director_position ?? '',
            'principal_address' => "{$submission->principal->address}, {$submission->principal->district->name}, {$submission->principal->regency->name}, {$submission->principal->province->name}",
            'est_deed' => $submission->principal->est_deed ?? '',
            'last_deed' => $submission->principal->last_deed ?? '',
            'get_susunan_pengurus' => $submission->get_administators_principal ?? '',
            'get_exp' => $submission->get_exp ?? '',
            'bank_name' => $submission->bank->name ?? '',
            'bank_address' => $submission->bankBranch?->address ?? '',
            'obligee_name' => $submission->obligee->name ?? '',
            'obligee_address' => $submission->obligee->address ?? '',
            'source_of_fund' => $submission->source_of_fund->name ?? '',
            'ppk_name' => $submission->obligee->pic ?? '',
            'ppk_number' => $submission->obligee->no_ppk ?? '',
            'principal_siup' => $submission->principal->siup_siujk ?? '',
            'obligee_city' => $submission->obligee->district->name ?? '',
            'obligee_location' => "{$submission->obligee->address}, {$submission->obligee->district->name}, {$submission->obligee->regency->name}, {$submission->obligee->province->name}",
            'guarantor_name' => $submission->guarantor->name ?? '',
            'guarantor_address' => $submission->guarantor_address ?? '',
            'guarantor_pic' => $submission->guarantor_pic ?? '',
            'guarantor_location' => "{$submission->guarantor->address}, {$submission->guarantor->district->name}, {$submission->guarantor->regency->name}, {$submission->guarantor->province->name}",
            'guarantor_city' => $submission->guarantor_city ?? '',
            'source_of_fund_name' => $submission->source_of_fund->name ?? '',
            'contract_value' => $submission->contract_value ? number_format($submission->contract_value, 0, ',', '.') : '',
            'guarantee_value' => $submission->guarantee_value ? number_format($submission->guarantee_value, 0, ',', '.') : '',
            'guarantee_type' => $submission->guarantorToProductType->name ?? '',
            'no_guarantee' => $submission->no_guarantee ?? '',
            'time_period' => $submission->time_period ?? '',
            'job_name' => $submission->job_name ?? '',
            'job_location_village' => $submission->job_location_village ?? '',
            'contract_doc_name' => $submission->contract_doc_name ?? '',
            'contract_doc_number' => $submission->contract_doc_number ?? '',
            'contract_doc_date' => $submission->contract_doc_date ?? '',
            'start_date' => $submission->start_date ?? '',
            'end_date' => $submission->end_date ?? '',
            'guarantee_issue_date' => $submission->guarantee_issue_date ?? '',
            'submission_date' => $submission->created_at?->translatedFormat('d F Y') ?? '',
            'day' => $submission->day_name ?? '',
            'total_score' => $submission->total_score ?? '',
            'recommendation' => $submission->recommendation ?? '',
            'notes' => $submission->notes ?? '',
            'analyst_name' => $submission->analyst_name ?? '',
            'manager_technique_name' => $submission->manager_technique_name ?? '',
            'branch_manager' => $submission->principal->director_name ?? '',
            'job_location' => "{$submission->job_location_village}, {$submission->district->name}, {$submission->regency->name}, {$submission->province->name}",
            'job_group' => $submission->guarantorToProductType->job_group ?? '',
            'no' => $submission->id ?? '',
            'city' => $submission->regency->name ?? '',
            'mail_number' => $submission->mail_number ?? '',
            'mail_number_resume' => $submission->mail_number_resume ?? '',
            'underlying' => ($submission->contract_doc_name.' '.$submission->contract_doc_number.' '.$submission->job_name) ?? '',
            'product_name' => $submission->product->name ?? '',
            'submission_support_docs' => $submission->submission_support_docs ?? '',
            'terbilang' => $submission->terbilang ?? '',
            'terbilang_hari' => $submission->terbilang_hari ?? '',
        ];

        $html = $this->replacePlaceholders($html, $data);

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
