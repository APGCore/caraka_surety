<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Exports\SubmissionExport;
use App\Models\Document\DocumentFormat;
use App\Models\Profile\Profile;
use App\Models\Submission\Submission;
use App\Models\Submission\SubmissionDoc;
use App\Models\User;
use App\Traits\ReplaceDocumentFormat;
use Carbon\Carbon;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Maatwebsite\Excel\Facades\Excel;
use Mpdf\Mpdf;
use Mpdf\MpdfException;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Settings;
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
        // Validasi input jika diperlukan
        $validatedData = $request->validate([
            'submission_ids' => 'required|array',
            'submission_ids.*' => 'integer|exists:submissions,id,deleted_at,NULL',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'office_id' => 'nullable|integer|exists:profiles,id,deleted_at,NULL',
        ]);
        $submissionIds = $validatedData['submission_ids'];

        $user = User::query()->with('office')->findOrFail(auth()->id());
        $office = $user->office;
        $isBranch = $office->office_type === OfficeType::BRANCH->value;
        $startDate = Carbon::parse($validatedData['start_date'])->format('d F Y');
        $endDate = Carbon::parse($validatedData['end_date'])->format('d F Y');
        $date = now()->format('d M Y');
        $officeReq = isset($validatedData['office_id']) ? Profile::query()->find($validatedData['office_id'])->name : 'Semua Kantor';
        $fileName = "LAPORAN PRODUKSI JASTAN $officeReq $startDate - $endDate (PER $date).xlsx";

        return Excel::download(new SubmissionExport($submissionIds, $isBranch), $fileName);
    }

    /**
     * @throws MpdfException
     */
    public function pdfPreview(Request $request): Application|Response|ResponseFactory
    {
        $request->validate([
            'submission_id' => 'required|exists:submissions,id,deleted_at,NULL',
            'document_format_id' => 'nullable|exists:document_formats,id',
            'submission_doc_id' => 'nullable|exists:submission_docs,id',
        ]);
        $submissionId = $request->get('submission_id');
        $documentFormatId = $request->get('document_format_id');
        $submissionDocId = $request->get('submission_doc_id');
        $submission = Submission::query()->findOrFail($submissionId);

        if ($documentFormatId) {
            $documentFormat = DocumentFormat::query()->findOrFail($documentFormatId);

            // Buat array data yang akan replace placeholder
            $data = $this->convertSubmission($submission);
            // dd($submission);
            $html = $this->replaceDocumentFormat($documentFormat, $data);
            $filename = str_replace(' ', '_', $documentFormat->getAttribute('name'));
        } else {
            // ambil dari submission document
            $submissionDocument = SubmissionDoc::query()->findOrFail($submissionDocId);
            $html = $submissionDocument->getAttribute('format_document');
            $filename = str_replace(' ', '_', $submissionDocument->getAttribute('name'));
        }
        $html = $this->normalizeHtmlForPhpWord($html);

        // 1) Siapkan direktori temp untuk PHPWord & gambar lokal
        $mpdfDir = storage_path('app/private/Mpdf-temp');
        if (! is_dir($mpdfDir)) {
            @mkdir($mpdfDir, 0775, true);
        }
        Settings::setTempDir($mpdfDir);
        [$localizedHtml, $downloadedFiles] = $this->localizeRemoteImages($html, $mpdfDir);

        // Inisialisasi mPDF
        $mpdf = new Mpdf([
            'tempDir' => storage_path('tmp/mpdf'),
        ]);
        // Membantu debug & SSL yang “rewel”
        $mpdf->showImageErrors = true;              // tampilkan error gambar ke log mPDF
        $mpdf->WriteHTML($localizedHtml);
        // cleanup file gambar yang kita download
        foreach ($downloadedFiles as $file) {
            if (is_file($file)) {
                @unlink($file);
            }
        }

        return response($mpdf->Output("{$filename}_{$submission->getAttribute('no_guarantee')}.pdf", 'S'), 200)
            ->header('Content-Type', 'application/pdf');
    }

    public function wordDownload(Request $request): StreamedResponse
    {
        $request->validate([
            'submission_id' => 'required|exists:submissions,id,deleted_at,NULL',
            'document_format_id' => 'nullable|exists:document_formats,id',
            'submission_doc_id' => 'nullable|exists:submission_docs,id',
        ]);
        $submissionId = $request->get('submission_id');
        $documentFormatId = $request->get('document_format_id');
        $submissionDocId = $request->get('submission_doc_id');
        $submission = Submission::query()->findOrFail($submissionId);

        if ($documentFormatId) {
            $documentFormat = DocumentFormat::query()->findOrFail($documentFormatId);

            // Buat array data yang akan replace placeholder
            $data = $this->convertSubmission($submission);
            // dd($submission);
            $html = $this->replaceDocumentFormat($documentFormat, $data);
            $filename = str_replace(' ', '_', $documentFormat->getAttribute('name'));
        } else {
            // ambil dari submission document
            $submissionDocument = SubmissionDoc::query()->findOrFail($submissionDocId);
            $html = $submissionDocument->getAttribute('format_document');
            $filename = str_replace(' ', '_', $submissionDocument->getAttribute('name'));
        }

        // 1) Siapkan direktori temp untuk PHPWord & gambar lokal
        $phpwordTempDir = storage_path('app/private/phpword-temp');
        if (! is_dir($phpwordTempDir)) {
            @mkdir($phpwordTempDir, 0775, true);
        }
        Settings::setTempDir($phpwordTempDir);

        // 2) Download semua <img src="http(s)://..."> ke file lokal & ganti src
        [$localizedHtml, $downloadedFiles] = $this->localizeRemoteImages($html, $phpwordTempDir);
        $localizedHtml = $this->normalizeHtmlForPhpWord($localizedHtml);

        // 3) Bangun dokumen
        $phpWord = new PhpWord;
        $section = $phpWord->addSection();

        Html::addHtml($section, $localizedHtml, false, false);

        // 4) Stream ke browser & bersihkan file sementara
        $filename = "{$filename}_{$submission->getAttribute('no_guarantee')}.docx";

        return response()->streamDownload(function () use ($phpWord, $downloadedFiles) {
            $writer = IOFactory::createWriter($phpWord);
            $writer->save('php://output');

            // cleanup file gambar yang kita download
            foreach ($downloadedFiles as $file) {
                if (is_file($file)) {
                    @unlink($file);
                }
            }
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]);
    }

    private function normalizeHtmlForPhpWord(string $html): string
    {
        $html = preg_replace('#</table>\s*(?=<table\b)#i', '</table><p>&nbsp;</p>', $html);
        $html = preg_replace('/<(br|img)([^>]*?)(?<!\/)>/i', '<$1$2 />', $html);

        return str_replace('&nbsp;', '&#160;', $html);
    }

    /**
     * Download semua <img> ber-URL ke file lokal dan ganti src jadi path lokal.
     *
     * @return array [string $newHtml, array $downloadedFiles]
     */
    private function localizeRemoteImages(string $html, string $saveDir): array
    {
        $downloaded = [];

        // pastikan saveDir ada
        if (! is_dir($saveDir)) {
            @mkdir($saveDir, 0775, true);
        }

        // Muat HTML dengan DOMDocument
        $dom = new \DOMDocument;
        // suppress warning HTML5; pastikan UTF-8 aman
        @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $imgs = $dom->getElementsByTagName('img');

        // Karena DOMNodeList live, salin dulu
        $toProcess = [];
        foreach ($imgs as $img) {
            $toProcess[] = $img;
        }

        foreach ($toProcess as $img) {
            $src = $img->getAttribute('src');
            if (! $src) {
                continue;
            }

            // skip data: atau file lokal yang sudah ada
            if (preg_match('#^data:#i', $src) || is_file($src)) {
                continue;
            }

            // hanya proses http/https
            if (! preg_match('#^https?://#i', $src)) {
                continue;
            }

            try {
                // Download pakai Laravel HTTP client (berbasis Guzzle)
                if (config('app.env') === 'local') {
                    // di local, abaikan SSL (misal self-signed)
                    $resp = Http::timeout(15)->withoutVerifying()->get($src);
                } else {
                    $resp = Http::timeout(15)->get($src);
                }

                if (! $resp->successful()) {
                    continue; // bisa juga dihapus gambarnya jika perlu
                }

                $binary = $resp->body();
                if ($binary === '' || $binary === null) {
                    continue;
                }

                // Tentukan MIME & ekstensi
                $mime = $resp->header('Content-Type', '');
                $ext = $this->guessImageExtension($mime, $src, $binary);

                // Simpan ke file lokal unik
                $localPath = rtrim($saveDir, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.uniqid('img_', true).'.'.$ext;
                file_put_contents($localPath, $binary);

                // Ganti src jadi absolute path lokal
                $img->setAttribute('src', $localPath);

                $downloaded[] = $localPath;
            } catch (\Throwable $e) {
                // gagal download; lanjutkan saja
                continue;
            }
        }

        // Ambil kembali inner HTML <body>
        $body = $dom->getElementsByTagName('body')->item(0);
        $newHtml = '';
        if ($body) {
            foreach ($body->childNodes as $child) {
                $newHtml .= $dom->saveHTML($child);
            }
        } else {
            $newHtml = $html; // fallback
        }

        return [$newHtml, $downloaded];
    }

    /**
     * Menebak ekstensi file gambar dari Content-Type, URL, atau isi file.
     */
    private function guessImageExtension(?string $mime, string $url, string $binary): string
    {
        // 1) Berdasarkan header Content-Type
        $map = [
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            'image/bmp' => 'bmp',
            'image/tiff' => 'tif',
            'image/svg+xml' => 'svg',
        ];
        $mime = strtolower((string) $mime);
        if (isset($map[$mime])) {
            return $map[$mime];
        }

        // 2) Coba dari ekstensi di URL
        if (preg_match('#\.(jpe?g|png|gif|webp|bmp|tiff?|svg)(\?.*)?$#i', parse_url($url, PHP_URL_PATH) ?? '', $m)) {
            return strtolower($m[1]) === 'jpeg' ? 'jpg' : strtolower($m[1]);
        }

        // 3) Fallback: deteksi magic bytes sederhana
        $sig = substr($binary, 0, 12);
        if (strncmp($sig, "\xFF\xD8\xFF", 3) === 0) {
            return 'jpg';
        }
        if (strncmp($sig, "\x89PNG", 4) === 0) {
            return 'png';
        }
        if (strncmp($sig, 'GIF8', 4) === 0) {
            return 'gif';
        }
        if (strncmp($sig, 'RIFF', 4) === 0 && substr($sig, 8, 4) === 'WEBP') {
            return 'webp';
        }

        // default
        return 'png';
    }
}
