<?php

namespace App\Exports;

use App\Enums\OfficeType;
use App\Enums\SubmissionStatus;
use App\Models\Submission\Submission;
use App\Traits\CalculateInvoice;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class SubmissionExport implements FromCollection, WithColumnFormatting, WithEvents, WithHeadings, WithMapping
{
    use CalculateInvoice;

    protected array $submissionIds;

    protected bool $isBranch;

    private int $rowNumber = 0;

    public function __construct(array $submissionIds, bool $isBranch = false)
    {
        $this->submissionIds = $submissionIds;
        $this->isBranch = $isBranch;
    }

    /**
     * Ambil data untuk diekspor
     */
    public function collection(): Collection
    {
        return Submission::query()
            ->whereIn('id', $this->submissionIds)
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
                'submissionBefore:id,blank_id',
                'submissionBefore.blank',
            ])
            ->orderByDesc('created_at')
            ->get();
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
            'PREMI JUAL',
            'ADMIN JUAL',
            'TOTAL PREMI JUAL',
        ];

        if ($this->isBranch) {
            $data = array_merge($data, [
                'PREMI MODAL',
                'ADMIN MODAL',
                'TOTAL PREMI MODAL',
                'KOMISI',
                'PPH KOMISI',
                'NETT KOMISI',
                'NETT PREMI',
                'PENDAPATAN PREMI'
            ]);
        }

        return $data;
    }

    public function map($row): array
    {
        $rateModal = $this->calculateCapitalRates($row);
        $rateJual = $this->calculateSellingRates($row);
        $isProcess = $row->status === SubmissionStatus::PROCESS->value;

        $data = [
            ++$this->rowNumber,
            Carbon::parse($row->approved_at)->format('F'),
            $row->guarantorBranch->name ?? '',
            $row->office->name ?? '',
            $row->blank?->getAttribute('number') ?? '-',
            $isProcess ? 'XXXXXXXXXXXXXXXX' : $row->no_guarantee,
            $row->principal->name ?? '',
            $row->obligee->name ?? '',
            $row->guarantee_value,
            $row->guarantorToProductType->full_name ?? '',
            $row->guarantor->name ?? '',
            Carbon::parse($row->start_date)->format('d/m/Y H:i'),
            Carbon::parse($row->end_date)->format('d/m/Y H:i'),
            $row->time_period,
            $row->difference_time_period,
            strtoupper(SubmissionStatus::getLabels()[$row->status] ?? ''),
            $rateJual->get('premi', 0),
            $rateJual->get('adm', 0),
            $rateJual->get('total', 0),
        ];

        if ($this->isBranch) {
            $data = array_merge($data, [
                $rateModal->get('premi', 0),
                $rateModal->get('adm', 0),
                $rateModal->get('total', 0),
                $rateModal->get('commission', 0),
                $rateModal->get('pph_commission', 0),
                $rateModal->get('nett_commission', 0),
                $rateModal->get('nett_premi', 0),
                $rateJual->get('premi', 0) - $rateModal->get('nett_premi', 0),
            ]);
        }

        return $data;
    }

    /**
     * Event untuk menyesuaikan lebar kolom secara otomatis
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;
                // Menentukan jumlah kolom yang digunakan
                $highestColumn = $sheet->getHighestColumn();
                $highestRow = $sheet->getHighestRow();

                // Menyesuaikan lebar kolom secara otomatis
                foreach (range('A', $highestColumn) as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }

                $sheet->getStyle('A')->getAlignment()->setHorizontal('center');
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
            'Q' => 'Rp #,##0', // PREMI JUAL
            'R' => 'Rp #,##0', // ADMIN JUAL
            'S' => 'Rp #,##0', // TOTAL PREMI JUAL
        ];

        if ($this->isBranch) {
            $data = array_merge($data, [
                'T' => 'Rp #,##0', // PREMI MODAL
                'U' => 'Rp #,##0', // ADMIN MODAL
                'V' => 'Rp #,##0', // TOTAL PREMI MODAL
                'W' => 'Rp #,##0', // KOMISI
                'X' => 'Rp #,##0', // PPH KOMISI
                'Y' => 'Rp #,##0', // NETT KOMISI
                'Z' => 'Rp #,##0', // NETT PREMI
                'AA' => 'Rp #,##0', // PENDAPATAN PREMI
            ]);
        }

        return $data;
    }
}
