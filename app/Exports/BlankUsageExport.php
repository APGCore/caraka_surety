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
                'is_used', // Status digunakan
                'is_broken', // Status rusak
                'is_approved', // Status disetujui
                'profile_id', // ID Kantor Cabang
            ])
            ->with([
                'profile' => function ($query) {
                    $query->select('id', 'name', 'code');
                },
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
            'Unit Bisnis',
        ];
    }

    public function map($blank): array
    {
        $status = [];

        if ($blank->is_used) {
            $status[] = 'Terpakai';
        }

        if ($blank->is_broken) {
            $status[] = 'Rusak';
        }

        if ($blank->is_approved) {
            $status[] = 'Disetujui';
        }

        $gabunganStatus = implode(', ', $status);
        $profile = $blank->getRelation('profile');

        return [
            $blank->number,
            $gabunganStatus,
            $profile ?
              $profile->name.' ('.$profile->code.')'
              : '',
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
