<?php

namespace App\Exports;

use App\Models\Guarantor\Blank;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Events\AfterSheet;

class BlankUsageBranchExport implements FromCollection, ShouldAutoSize, WithEvents, WithHeadings, WithMapping
{
    public function collection(): Collection
    {
        $data = Blank::query()
            ->selectRaw('
                profiles.name AS branch,
                COUNT(*) AS total_sent,
                MIN(blanks.number) AS start_number,
                MAX(blanks.number) AS end_number,
                SUM(CASE WHEN blanks.is_used = 1 THEN 1 ELSE 0 END) AS used,
                SUM(CASE WHEN blanks.is_broken = 1 THEN 1 ELSE 0 END) AS broken,
                SUM(CASE WHEN blanks.is_used = 0 AND blanks.is_broken = 0 THEN 1 ELSE 0 END) AS unused
            ')
            ->join('profiles', 'blanks.profile_id', '=', 'profiles.id')
            ->groupBy('blanks.profile_id')
            ->get();

        $totals = [
            'branch' => 'Total',
            'total_sent' => $data->sum('total_sent'),
            'start_number' => '',
            'end_number' => '',
            'used' => $data->sum('used'),
            'broken' => $data->sum('broken'),
            'unused' => $data->sum('unused'),
        ];

        return $data->push((object) $totals);
    }

    public function map($row): array
    {
        return [
            $row->branch,
            $row->total_sent,
            $row->start_number && $row->end_number ? "{$row->start_number} - {$row->end_number}" : '',
            $row->used,
            0, // Kolom revisi (hardcoded 0 untuk saat ini)
            $row->broken,
            $row->unused,
        ];
    }

    public function headings(): array
    {
        return [
            [
                'Kantor Cabang Asuransi',
                'Jumlah yg dikirim',
                'No blanko',
                'Status Blanko', '', '',
                'Blanko Belum Terpakai',
            ],
            [
                '', '', '',
                'Terpakai', 'Revisi', 'Rusak',
                '',
            ],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;

                $sheet->mergeCells('A1:A2'); // Kantor Cabang Asuransi
                $sheet->mergeCells('B1:B2'); // Jumlah yg dikirim
                $sheet->mergeCells('C1:C2'); // No blanko
                $sheet->mergeCells('G1:G2'); // Blanko Belum Terpakai
                $sheet->mergeCells('D1:F1'); // Status Blanko

                $sheet->getStyle('A1:G2')->applyFromArray([
                    'font' => ['bold' => true],
                    'alignment' => [
                        'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                        'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                    ],
                ]);

                // Atur tinggi baris header
                $sheet->getRowDimension(1)->setRowHeight(20);
                $sheet->getRowDimension(2)->setRowHeight(20);

                $highestRow = $sheet->getHighestRow();
                $sheet->getStyle("B3:G{$highestRow}")->applyFromArray([
                    'alignment' => [
                        'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                        'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                    ],
                ]);

                // Style border untuk seluruh tabel
                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();
                $sheet->getStyle("A1:{$highestColumn}{$highestRow}")->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        ],
                    ],
                ]);

                $sheet->getStyle("A{$highestRow}:G{$highestRow}")->applyFromArray([
                    'font' => ['bold' => true],
                ]);
            },
        ];
    }
}
