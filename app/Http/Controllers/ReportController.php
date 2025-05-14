<?php

namespace App\Http\Controllers;

use App\Exports\BlankUsageExport;
use App\Http\Resources\Report\BlankUsageResource;
use App\Models\Guarantor\Blank;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    protected string $headComponent;

    public function __construct()
    {
        $this->headComponent = 'report/';
    }

    public function productionReport(Request $request)
    {
        // Data dasar untuk laporan produksi
        $branches = [
            [
                'branch' => 'Lampung',
                'sent' => 50,
                'number_range' => '001 - 050',
                'used' => 39,
                'revised' => 1,
                'damaged' => 0,
                'unused' => 10,
            ],
            [
                'branch' => 'Lampung',
                'sent' => 50,
                'number_range' => '201 - 250',
                'used' => 0,
                'revised' => 0,
                'damaged' => 0,
                'unused' => 50,
            ],
        ];

        // Menghitung total untuk setiap kolom
        $totals = [
            'sent' => array_sum(array_column($branches, 'sent')),
            'used' => array_sum(array_column($branches, 'used')),
            'revised' => array_sum(array_column($branches, 'revised')),
            'damaged' => array_sum(array_column($branches, 'damaged')),
            'unused' => array_sum(array_column($branches, 'unused')),
        ];

        return inertia($this->headComponent.'production/index', [
            'page_settings' => [
                'title' => 'Laporan Produksi',
            ],
            'branches' => $branches,
            'totals' => $totals,
        ]);
    }

    public function blankUsage(Request $request)
    {
        $blanks = Blank::query()
            ->with([
                'guarantor:id,name',
                'profile:id,name',
                'fromProfile:id,name',
            ])
            ->when($request->get('search'), function ($query, $search) {
                $query->where('number', 'like', "%$search%");
            })
            ->orderBy('id')
            ->paginate($request->get('per_page') ?? 10)
            ->appends($request->all());

        $resource = BlankUsageResource::collection($blanks);

        return inertia($this->headComponent.'blanks-usage/index', [
            'page_settings' => [
                'title' => 'Laporan Penggunaan Blangko',
            ],
            'blankUsage' => fn () => $resource,
        ]);
    }

    public function exportBlankUsage(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        return Excel::download(
            new BlankUsageExport($startDate, $endDate),
            'blank_usage_report.xlsx'
        );
    }
}
