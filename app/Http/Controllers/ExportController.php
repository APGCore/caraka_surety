<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Exports\SubmissionExport;
use App\Models\Document\DocumentFormat;
use App\Models\Submission\Submission;
use App\Models\User;
use App\Traits\ReplaceDocumentFormat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Mpdf\Mpdf;
use Mpdf\MpdfException;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Shared\Html;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
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

  /**
   * @throws MpdfException
   */
  public function show($submission_id, $document_format)
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

    public function wordDownload($submission_id, $document_format): StreamedResponse
    {
        $submission = $this->getSubmission($submission_id);

        $documentFormat = DocumentFormat::query()->findOrFail($document_format);

        // Buat array data yang akan replace placeholder
        $data = $this->convertSubmission($submission);
        $html = $this->replaceDocumentFormat($documentFormat, $data);
        $html = $this->normalizeHtmlForPhpWord($html);

        $phpWord  = new PhpWord();
        $section  = $phpWord->addSection();

      // tulis HTML ke dokumen
      Html::addHtml($section, $html, false, false);

      // stream langsung ke output sebagai .docx
      return response()->streamDownload(function () use ($phpWord) {
        $writer = IOFactory::createWriter($phpWord);
        $writer->save('php://output');
      }, "surat-pengajuan-{$submission->getAttribute('id')}.docx", [
        'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]);
    }

    private function normalizeHtmlForPhpWord(string $html): string
    {
      // 1) buang <script>/<style> yang sering bikin parser rewel
      $html = preg_replace('#<(script|style)\b[^>]*>.*?</\1>#is', '', $html);

      // 2) pastikan void tags self-closing (XHTML-ish)
      $html = preg_replace('#<(br|hr)([^/>]*)>#i', '<$1$2 />', $html);
      $html = preg_replace('#<img([^/>]*)>#i', '<img$1 />', $html);

      // 3) OPTIONAL: hapus tag kosong <tag></tag> yang kadang dihasilkan template
      $html = preg_replace('#<(\w+)([^>]*)>\s*</\1>#', '', $html);

      // 4) Coba perbaiki otomatis pakai Tidy kalau ada
      if (extension_loaded('tidy')) {
        $config = [
          'output-xhtml' => true,
          'show-body-only' => true,
          'wrap' => 0,
          'force-output' => true,
          'indent' => false,
          'clean' => true,
          'char-encoding' => 'utf8',
        ];
        $tidy = new \tidy();
        $tidy->parseString($html, $config, 'utf8');
        $tidy->cleanRepair();
        $html = (string)$tidy; // sudah “dirapikan”
      } else {
        // 5) Fallback: pakai DOMDocument utk “membalanskan” tag
        $doc = new \DOMDocument('1.0', 'UTF-8');
        libxml_use_internal_errors(true);

        // Bungkus dalam <body> supaya loadHTML tidak menyuntik struktur aneh
        $doc->loadHTML('<?xml encoding="utf-8" ?><body>' . $html . '</body>',
          LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $errors = libxml_get_errors();
        libxml_clear_errors();

        // Ambil kembali isi <body> saja
        $html = '';
        $body = $doc->getElementsByTagName('body')->item(0);
        if ($body) {
          foreach ($body->childNodes as $child) {
            $html .= $doc->saveHTML($child);
          }
        }

        // Log agar tahu baris/tag mana yang bermasalah (sangat membantu debug)
        if (!empty($errors)) {
          Log::warning('HTML mismatches before PhpWord', array_map(
            fn($e) => trim($e->message) . ' @ line ' . $e->line, $errors
          ));
        }
      }

      return $html;
    }
}
