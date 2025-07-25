<?php

namespace App\Exports;

use App\Models\Submission\Submission;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Events\AfterSheet;

class SubmissionExport implements FromCollection, WithColumnFormatting, WithEvents, WithHeadings, WithMapping
{
    protected array $submissionIds;

    public function __construct(array $submissionIds)
    {
        $this->submissionIds = $submissionIds;
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
                'guarantorToProductType:id,code_product,code,name',
                'blanks:id,number,is_broken',
                'principal:id,name',
                'obligee:id,name',
                'staff:id,name,profile_id',
                'staff.office:id,name,code,office_type',
                'staff.office.profileRate',
                'submissionBefore:id',
                'submissionBefore.blanks',
                'staff:id,name,profile_id',
                'staff.office:id,name',
            ])
            ->get();
    }

    /**
     * Header kolom pada file Excel
     */
    public function headings(): array
    {
        return [
            'ID',
            'Tanggal Pengajuan',
            'Nomor Blangko',
            'Nomor Pengajuan',
            'Nama Principal',
            'Nilai Jaminan',
            'Produk',
            'Jenis Jaminan',
        ];
    }

    public function map($row): array
    {
        $guarantorToProductType = $row->getRelation('guarantorToProductType');
        $blanks = $row->getRelation('blanks');

        return [
            $row->id,
            $row->created_at->format('Y-m-d H:i:s'),
            $blanks->isNotEmpty() ? $blanks->first()->number : '',
            $row->no_guarantee,
            $row->principal?->name ?? '',
            number_format($row->guarantee_value, 2, ',', '.'),
            $row->product?->name ?? '',
            $guarantorToProductType?->name ?? '',
        ];
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
        return [
            'A' => '@', // ID sebagai teks
            'B' => 'yyyy-mm-dd hh:mm:ss', // Tanggal Pengajuan
            'C' => '@', // Nomor Blangko sebagai teks
            'D' => '@', // Nomor Pengajuan sebagai teks
            'E' => '@', // Nama Principal sebagai teks
            'F' => '#,##0.00', // Nilai Jaminan dengan format angka
            'G' => '@', // Produk sebagai teks
            'H' => '@', // Jenis Jaminan sebagai teks
        ];
    }
}
