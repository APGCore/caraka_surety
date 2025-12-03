<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Exports\SubmissionExport;
use App\Models\Document\DocumentFormat;
use App\Models\Profile\Profile;
use App\Models\Submission\Submission;
use App\Models\Submission\SubmissionDoc;
use App\Models\User;
use App\Traits\CalculateInvoice;
use App\Traits\ReplaceDocumentFormat;
use Carbon\Carbon;
use Exception;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\RedirectResponse;
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
    use CalculateInvoice, ReplaceDocumentFormat;

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
        }, $document->name.'.pdf', [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"$document->name.pdf\"",
        ]);
    }

    public function submissionToExcel(Request $request): BinaryFileResponse|RedirectResponse
    {
        // Validasi input jika diperlukan
        $validatedData = $request->validate([
            'search' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'office_id' => 'nullable|integer|exists:profiles,id,deleted_at,NULL',
            'guarantor_id' => 'nullable|integer|exists:guarantors,id,deleted_at,NULL',
            'product_id' => 'nullable|integer|exists:products,id,deleted_at,NULL',
            'guarantor_to_product_type_id' => 'nullable|integer|exists:guarantor_to_product_types,id,deleted_at,NULL',
        ]);
        $search = $request->get('search');
        $officeSelected = $request->get('office_id');
        $guarantorSelected = (int) $request->get('guarantor_id', config('guarantor.id'));
        $productSelected = $request->get('product_id', config('product.id'));
        $guarantorToProductTypeSelected = $request->get('guarantor_to_product_type_id');
        $startDate = Carbon::parse($validatedData['start_date'])->format('d F Y');
        $endDate = Carbon::parse($validatedData['end_date'])->format('d F Y');
        $date = ($startDate && $endDate)
          ? [
              Carbon::parse($startDate)->startOfDay(),
              Carbon::parse($endDate)->endOfDay(),
          ]
          : [
              now()->subDays(7)->toDateString().' 00:00:00',
              now()->toDateString().' 23:59:59',
          ];

        $submissions = Submission::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->whereLike('no_guarantee', "%$search%")
                        ->orWhereHas('principal', function ($query) use ($search) {
                            $query->whereLike('name', "%$search%");
                        });
                });
            })
            ->when($guarantorSelected, fn ($q) => $q->where('guarantor_id', $guarantorSelected))
            ->when($officeSelected, fn ($q) => $q->where('office_id', $officeSelected))
            ->when($productSelected, fn ($q) => $q->where('product_id', $productSelected))
            ->when($guarantorToProductTypeSelected, fn ($q) => $q->where('guarantor_to_product_type_id', $guarantorToProductTypeSelected))
            ->where('has_send_to_guarantor', true)
            ->whereBetween('send_to_guarantor_at', $date)
            ->with([
                'guarantor:id,name,code',
                'guarantorBranch:id,name,code',
                'guarantor.pattern:id,guarantor_id,prefix,content,suffix',
                'guarantor.guarantorRate',
                'product:id,name',
                'guarantorToProductType:id,code_product,code,name,full_name',
                'blank:id,number,is_broken,is_revised',
                'principal:id,name',
                'obligee:id,name',
                'staff:id,name,profile_id',
                'office:id,name,office_type',
                'submissionBefore' => fn ($q) => $q
                    ->where('send_to_guarantor_at', '<', $date[0]),
                'submissionBefore.product:id,name',
                'submissionBefore.guarantorToProductType:id,code_product,code,name,full_name',
                'submissionBefore.blank:id,number,is_broken,is_revised',
                'submissionBefore.principal:id,name',
                'submissionAfter' => fn ($q) => $q
                    ->where('send_to_guarantor_at', '>', $date[1])
                    ->select(['id', 'submission_before_id']),
            ])
            ->select([
                'id',
                'submission_before_id',
                'no_guarantee',
                'guarantor_id',
                'guarantor_branch_id',
                'office_id',
                'principal_id',
                'obligee_id',
                'product_id',
                'guarantor_to_product_type_id',
                'blank_id',
                'staff_id',
                'guarantee_value',
                'start_date',
                'end_date',
                'time_period',
                'difference_time_period',
                'status',
                'created_at',
                'approved_at',
                'send_to_guarantor_at',
            ])
            ->orderByDesc('no_guarantee')
            ->get();

        try {
            $result = $this->mapProductionReport($submissions);
        } catch (Exception $e) {
            flashMessage('error', 'Gagal memproses data untuk ekspor: '.$e->getMessage());

            return back();
        }

        $user = User::query()->with('office')->findOrFail(auth()->id());
        $office = $user->office;
        $isBranch = $office->office_type === OfficeType::BRANCH->value;
        $date = now()->format('d M Y');
        $officeReq = isset($validatedData['office_id']) ? Profile::query()->find($validatedData['office_id'])->getAttribute('name') : 'Semua Kantor';
        $fileName = "LAPORAN PRODUKSI JASTAN $officeReq $startDate - $endDate (PER $date).xlsx";

        return Excel::download(new SubmissionExport($result, $isBranch), $fileName);
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
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', "filename=\"{$filename}_{$submission->getAttribute('no_guarantee')}.pdf\"");
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
            'Content-Disposition' => "filename=\"$filename\"",
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
