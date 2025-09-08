<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Exports\SubmissionExport;
use App\Models\Document\DocumentFormat;
use App\Models\User;
use DOMDocument;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Submission\Submission;
use Mpdf\Mpdf;
use Mpdf\MpdfException;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Shared\Html;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Traits\ReplaceDocumentFormat;
use TCPDF;
use Throwable;

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

        $html = $documentFormat->format_document;

        if (! $html) {
            abort(404, 'Konten HTML tidak tersedia.');
        }

        // Buat array data yang akan replace placeholder
        $data = $this->convertSubmission($submission);
        $html = $this->replaceDocumentFormat($documentFormat, $data);

        // ✅ Sanitize/normalisasi HTML sebelum masuk ke PhpWord
        $html = $this->cleanHtmlForPhpWord($html);

        $phpWord  = new PhpWord();
        $section  = $phpWord->addSection();

        try {
          Html::addHtml($section, $html, false, false);
        } catch (Throwable) {
          // Fallback terakhir: tulis sebagai teks biasa jika HTML tetap bermasalah
          $section->addText(strip_tags($html));
        }

        $tempFile = tempnam(sys_get_temp_dir(), 'word');
        $phpWord->save($tempFile);

        return response()->streamDownload(function () use ($tempFile) {
            echo file_get_contents($tempFile);
            unlink($tempFile); // Hapus file setelah dikirim
        }, "surat-pengajuan-{$submission->getAttribute("id")}.docx", [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]);
    }

  /**
   * Bersihkan & normalkan HTML agar aman untuk PhpWord\Html::addHtml().
   */
  private function cleanHtmlForPhpWord(string $html): string
  {
    // 1) Normalisasi tag umum yang sering rusak
    $search  = [
      // br ditutup salah
      '#</\s*br\s*>#i',
      // samakan bentuk <br> menjadi XHTML self-close
      '#<\s*br\s*>#i',
      // hapus tag yang berpotensi bikin error dan tidak dipakai di dokumen Word
      '#<\s*(script|style|svg|video|audio|canvas|iframe)[^>]*>.*?<\s*/\s*\1\s*>#is',
      // nbsp berlebih → spasi biasa
      '/&nbsp;+/i',
    ];
    $replace = [
      '<br />',
      '<br />',
      '',
      ' ',
    ];
    $html = preg_replace($search, $replace, $html ?? '') ?? '';

    // (Opsional) hindari entity aneh di attribute
    $html = preg_replace('/\son[a-z]+\s*=\s*"[^"]*"/i', '', $html); // hapus inline event handler

    // 2) Perapihan struktur menggunakan DOMDocument
    //    Catatan: LIBXML_HTML_NOIMPLIED & NODEFDTD supaya tidak menambah <html><body> otomatis.
    $internalErrorsBackup = libxml_use_internal_errors(true);
    $dom = new DOMDocument('1.0', 'UTF-8');

    // Bungkus dengan meta encoding agar aman karakter UTF-8
    $wrapped = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' . $html;

    // Jika gagal, kita tetap lanjut dengan versi yang telah dinormalisasi di atas
    $loaded = @$dom->loadHTML(
      $wrapped,
      LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
    );

    if ($loaded) {
      // 3) Hapus node yang tidak didukung/berpotensi bermasalah kalau masih tersisa
      $tagsToRemove = ['script', 'style', 'svg', 'video', 'audio', 'canvas', 'iframe'];
      foreach ($tagsToRemove as $tag) {
        $nodes = $dom->getElementsByTagName($tag);
        // Karena live NodeList, iterasi mundur
        for ($i = $nodes->length - 1; $i >= 0; $i--) {
          $node = $nodes->item($i);
          $node->parentNode?->removeChild($node);
        }
      }

      // 4) Pastikan <td>/<tr>/<table> rapi sebisanya (DOM akan auto-close banyak kasus umum)
      //    Tidak ada aksi khusus di sini; DOM sudah merapikan kebanyakan mismatch.

      $html = $dom->saveHTML();
    }

    libxml_clear_errors();
    libxml_use_internal_errors($internalErrorsBackup);

    // 5) Trim agar tidak ada whitespace berlebih di awal/akhir
    return trim($html);
  }
}
