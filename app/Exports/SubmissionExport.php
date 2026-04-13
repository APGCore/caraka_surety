<?php

namespace App\Exports;

use App\Enums\SubmissionStatus;
use App\Traits\CalculateInvoice;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SubmissionExport implements FromCollection, WithColumnFormatting, WithEvents, WithHeadings, WithMapping, WithStyles
{
    use CalculateInvoice;

    protected Collection $submissions;

    protected bool $isBranch;

    private int $rowNumber = 0;

    public function __construct(Collection $submissions, bool $isBranch = false)
    {
        $this->submissions = $submissions;
        $this->isBranch = $isBranch;
    }

    /**
     * Ambil data untuk diekspor
     */
    public function collection(): Collection
    {
        return $this->submissions;
    }

    /**
     * Header kolom pada file Excel
     */
    public function headings(): array
    {
        $data = [
            'NO',
            'PERIODE',
            'CABANG ASURANSI',
            'CABANG BPR/SUMBER BISNIS',
            'NO BLANGKO',
            'NO JAMINAN',
            'PRINCIPAL',
            'OBLIGEE',
            'NILAI JAMINAN',
            'JENIS JAMINAN',
            'ASURANSI PENJAMIN',
            'PERIODE AWAL',
            'PERIODE AKHIR',
            'JANGKA WAKTU',
            'SELISIH JANGKA WAKTU',
            'KETERANGAN',
            'TANGGAL BUAT',
            'TANGGAL SETUJU',
            'TANGGAL KIRIM ASURANSI',
            'TANGGAL TERBIT',
            'PREMI JUAL',
            'ADMIN JUAL',
            'SERVICE CHARGES JUAL',
            'TOTAL PREMI JUAL',
        ];

        if (! $this->isBranch) {
            $data = array_merge($data, [
                'PREMI MODAL',
                'BIAYA MATERAI',
                'ADMIN MODAL',
                'SERVICE CHARGES MODAL',
                'TOTAL MODAL',
                'KOMISI',
                'PPH KOMISI',
                'NETT KOMISI',
                'NETT PREMI',
                'PENDAPATAN PREMI',
            ]);
        }

        return $data;
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true], 'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFDDDDDD'], // abu-abu header
            ]],
        ];
    }

    public function map($row): array
    {
        $isProcess = $row->status === SubmissionStatus::PROCESS->value;

        $data = [
            ++$this->rowNumber,
            $row->send_to_guarantor_at ? Carbon::parse($row->send_to_guarantor_at)->format('F') : '',
            $row->guarantorBranch->name ?? '',
            $row->office->name ?? '',
            $row->blank?->getAttribute('number') ?? '-',
            $isProcess ? 'XXXXXXXXXXXXXXXX' : $row->no_guarantee,
            $row->principal->name ?? '',
            $row->obligee->name ?? '',
            $row->guarantee_value ?? 0,
            $row->guarantorToProductType->full_name ?? '',
            $row->guarantor->name ?? '',
            $row->start_date ? Carbon::parse($row->start_date)->format('d/m/Y H:i') : '',
            $row->end_date ? Carbon::parse($row->end_date)->format('d/m/Y H:i') : '',
            $row->time_period ?? '',
            $row->difference_time_period ?? '',
            $row->is_minus ? 'DIREVISI' : ($row->status ? strtoupper(SubmissionStatus::getLabels()[$row->status]) : ''),
            $row->created_at ? Carbon::parse($row->created_at)->format('d/m/Y H:i') : '',
            $row->approved_at ? Carbon::parse($row->approved_at)->format('d/m/Y H:i') : '',
            $row->send_to_guarantor_at ? Carbon::parse($row->send_to_guarantor_at)->format('d/m/Y H:i') : '',
            $row->publication_date ? Carbon::parse($row->publication_date)->format('d/m/Y') : '',
            $row->rate_jual?->get('premi', 0) ?? 0,
            $row->rate_jual?->get('adm', 0) ?? 0,
            $row->rate_jual?->get('service_charges', 0) ?? 0,
            $row->rate_jual?->get('total', 0) ?? 0,
        ];

        if (! $this->isBranch) {
            $rowNumber = $this->rowNumber + 1;
            $data = array_merge($data, [
                $row->rate_modal?->get('premi', 0) ?? 0,
                $row->rate_modal?->get('stamp_duty', 0) ?? 0,
                $row->rate_modal?->get('adm', 0) ?? 0,
                $row->rate_modal?->get('service_charges', 0) ?? 0,
                $row->rate_modal?->get('total', 0) ?? 0,
                $row->rate_modal?->get('commission', 0) ?? 0,
                $row->rate_modal?->get('pph_commission', 0) ?? 0,
                $row->rate_modal?->get('nett_commission', 0) ?? 0,
                $row->rate_modal?->get('nett_premi', 0) ?? 0,
                "=X$rowNumber - AG$rowNumber",
            ]);
        }

        return $data;
    }

    /**
     * Event untuk menyesuaikan lebar kolom secara otomatis
     */
    public function registerEvents(): array
    {
        $isBranch = $this->isBranch; // bawa flag ke dalam closure

        return [
            AfterSheet::class => function (AfterSheet $event) use ($isBranch) {
                $sheet = $event->sheet->getDelegate();

                // 1) Autosize kolom
                $highestColumn = $sheet->getHighestColumn();
                $highestColumnIndex = Coordinate::columnIndexFromString($highestColumn);
                for ($col = 1; $col <= $highestColumnIndex; $col++) {
                    $columnLetter = Coordinate::stringFromColumnIndex($col);
                    $sheet->getColumnDimension($columnLetter)->setAutoSize(true);
                }

                // 2) Freeze header
                $sheet->freezePane('A2');

                // 3) Center kolom NO (A) – perbaikan: gunakan range, bukan 'A' saja
                $rowCount = $sheet->getHighestRow();
                $sheet->getStyle('A2:A'.$rowCount)
                    ->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_CENTER);

                // 4) Page setup (biar rapi saat print)
                $sheet->getPageSetup()
                    ->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)
                    ->setPaperSize(PageSetup::PAPERSIZE_A4)
                    ->setFitToWidth(1)
                    ->setFitToHeight(0)
                    ->setRowsToRepeatAtTopByStartAndEnd(1, 1); // ulangi baris header di setiap halaman

                // 5) Header/Footer cetak (yang tampil di Print Preview)
                $sheet->getHeaderFooter()
                    ->setOddFooter('&LDicetak oleh Sistem&CPage &P of &N&R&D &T');

                // 6) Alternating row colors + kondisi
                for ($row = 2; $row <= $rowCount; $row++) {
                    $color = 'FFFFFFFF';

                    // jika status === REVISED (kolom P)
                    if (
                        strtoupper((string) $sheet->getCell("P$row")->getValue()) ===
                        strtoupper(SubmissionStatus::getLabels()[SubmissionStatus::REVISED->value] ?? '')
                    ) {
                        $color = 'FFFFFF99'; // kuning muda
                    }

                    // jika TOTAL PREMI JUAL (X) < 0 → merah muda
                    if (((float) $sheet->getCell("X$row")->getValue()) < 0) {
                        $color = 'FFFFAAAA';
                    }

                    $sheet->getStyle("A$row:$highestColumn$row")
                        ->getFill()
                        ->setFillType(Fill::FILL_SOLID)
                        ->getStartColor()
                        ->setARGB($color);
                }

                // 7) (OPSIONAL) Tambah baris TOTAL & Footer teks
                //    - total di kolom uang dengan formula SUM
                //    - catatan footer dekoratif 1 baris di bawahnya
                $lastDataRow = $rowCount;
                $totalRow = $lastDataRow + 1;

                // Kolom uang yang pasti ada (branch maupun bukan)
                // T (Premi Jual), U (Admin Jual), V (Service Charges), W (Total Premi Jual)
                $sheet->setCellValue("T$totalRow", 'TOTAL'); // label sebelum kolom U
                $sheet->getStyle("T$totalRow")->getFont()->setBold(true);

                $sheet->setCellValue("U$totalRow", "=SUM(U2:U$lastDataRow)");
                $sheet->setCellValue("V$totalRow", "=SUM(V2:V$lastDataRow)");
                $sheet->setCellValue("W$totalRow", "=SUM(W2:W$lastDataRow)");
                $sheet->setCellValue("X$totalRow", "=SUM(X2:X$lastDataRow)");

                // Jika bukan branch, total-kan kolom tambahan
                if (! $isBranch) {
                    $sheet->setCellValue("Y$totalRow", "=SUM(Y2:Y$lastDataRow)");
                    $sheet->setCellValue("Z$totalRow", "=SUM(Z2:Z$lastDataRow)");
                    $sheet->setCellValue("AA$totalRow", "=SUM(AA2:AA$lastDataRow)");
                    $sheet->setCellValue("AB$totalRow", "=SUM(AB2:AB$lastDataRow)");
                    $sheet->setCellValue("AC$totalRow", "=SUM(AC2:AC$lastDataRow)");
                    $sheet->setCellValue("AD$totalRow", "=SUM(AD2:AD$lastDataRow)");
                    $sheet->setCellValue("AE$totalRow", "=SUM(AE2:AE$lastDataRow)");
                    $sheet->setCellValue("AF$totalRow", "=SUM(AF2:AF$lastDataRow)");
                    $sheet->setCellValue("AG$totalRow", "=SUM(AG2:AG$lastDataRow)");
                    $sheet->setCellValue("AH$totalRow", "=SUM(AH2:AH$lastDataRow)");
                }

                // Format Rp untuk semua kolom total (U–X branch / U–AH non-branch)
                $lastMoneyCol = $isBranch ? 'X' : 'AH';
                $sheet->getStyle("U$totalRow:$lastMoneyCol$totalRow")
                    ->getNumberFormat()
                    ->setFormatCode('Rp #,##0');

                // Bold keseluruhan baris TOTAL
                $sheet->getStyle("A$totalRow:$highestColumn$totalRow")
                    ->getFont()->setBold(true);
            },
        ];
    }

    public function columnFormats(): array
    {
        $data = [
            'A' => '@', // NO
            'B' => '@', // PERIODE
            'C' => '@', // CABANG ASURANSI
            'D' => '@', // CABANG BPR/SUMBER BISNIS
            'E' => '@', // NO BLANKO
            'F' => '@', // NO JAMINAN
            'G' => '@', // PRINCIPAL
            'H' => '@', // OBLIGEE
            'I' => 'Rp #,##0', // NILAI JAMINAN
            'J' => '@', // JENIS JAMINAN
            'K' => '@', // ASURANSI PENJAMIN
            'L' => NumberFormat::FORMAT_DATE_DATETIME, // PERIODE AWAL
            'M' => NumberFormat::FORMAT_DATE_DATETIME, // PERIODE AKHIR
            'N' => '#,##0', // JANGKA WAKTU
            'O' => '#,##0', // SELISIH JANGKA WAKTU
            'P' => '@', // KETERANGAN
            'Q' => NumberFormat::FORMAT_DATE_DATETIME, // TANGGAL BUAT
            'R' => NumberFormat::FORMAT_DATE_DATETIME, // TANGGAL SETUJU
            'S' => NumberFormat::FORMAT_DATE_DATETIME, // TANGGAL KIRIM ASURANSI
            'T' => '@', // TANGGAL TERBIT
            'U' => 'Rp #,##0', // PREMI JUAL
            'V' => 'Rp #,##0', // ADMIN JUAL
            'W' => 'Rp #,##0', // SERVICE CHARGES JUAL
            'X' => 'Rp #,##0', // TOTAL PREMI JUAL
        ];

        if (! $this->isBranch) {
            $data = array_merge($data, [
                'Y' => 'Rp #,##0', // PREMI MODAL
                'Z' => 'Rp #,##0', // STAMP DUTY
                'AA' => 'Rp #,##0', // ADMIN MODAL
                'AB' => 'Rp #,##0', // SERVICE CHARGES MODAL
                'AC' => 'Rp #,##0', // TOTAL PREMI MODAL
                'AD' => 'Rp #,##0', // KOMISI
                'AE' => 'Rp #,##0', // PPH KOMISI
                'AF' => 'Rp #,##0', // NETT KOMISI
                'AG' => 'Rp #,##0', // NETT PREMI
                'AH' => 'Rp #,##0', // PENDAPATAN PREMI
            ]);
        }

        return $data;
    }
}
