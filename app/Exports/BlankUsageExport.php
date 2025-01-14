<?php

namespace App\Exports;

use App\Models\Guarantor\Blank;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;

class BlankUsageExport implements FromCollection, WithEvents, WithHeadings
{
    /**
     * Ambil data untuk diekspor
     */
    public function collection()
    {
        return Blank::query()
            ->select([
                'number', // Nomor Blanko
                \DB::raw("CONCAT(
                            CASE WHEN is_used = 1 THEN 'Terpakai' ELSE '' END,
                            CASE WHEN is_used = 1 AND (is_broken = 1 OR is_approved = 1) THEN ', ' ELSE '' END,
                            CASE WHEN is_broken = 1 THEN ' Rusak' ELSE '' END,
                            CASE WHEN (is_used = 0 AND is_broken = 0) AND is_approved = 1 THEN ', ' ELSE '' END,
                            CASE WHEN is_approved = 1 THEN ', Disetujui' ELSE '' END
                          ) AS status"), // Gabungan status
                \DB::raw('(SELECT name FROM profiles WHERE profiles.id = blanks.profile_id) AS kantor_cabang'), // Kantor Cabang
            ])
            ->get();
    }

    /**
     * Header kolom pada file Excel
     */
    public function headings(): array
    {
        return [
            'No Blanko',
            'Status',
            'Kantor Cabang',
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
}
