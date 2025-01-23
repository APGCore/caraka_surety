<?php

namespace App\Http\Controllers;

use App\Exports\BlankUsageExport;
use App\Http\Resources\Report\BlankUsageResource;
use App\Http\Resources\Submission\SubmissionResource;
use App\Models\Guarantor\Blank;
use App\Models\Submission\Submission;
use App\Traits\GeneratePattern;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    use GeneratePattern;

    public function invoice(Request $request)
    {
        $date = collect($request->get('date') ?? [
            now()->subDays(7)->toDateString(),
            now()->toDateString(),
        ])->values();
        $submissions = Submission::search($request->get('search'))
            ->query(function ($query) use ($date) {
                return $query->when($date->isNotEmpty(), function ($query) use ($date) {
                    $query->whereBetween('created_at', $date);
                })->with([
                    'guarantor:id,name,code',
                    'guarantorBranch:id,name,code',
                    'guarantor.pattern:id,guarantor_id,prefix,content,suffix',
                    'guarantorToProductType:id,code_product,code',
                    'blanks:id,number,is_broken',
                    'principal:id,name',
                    'obligee:id,name',
                    'staff:id,name,profile_id',
                    'staff.office:id,name,code',
                ]);
            })
            ->orderBy('id')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        foreach ($submissions as $submission) {
            $guarantor = $submission->guarantor;
            $guarantorBranchId = $submission->guarantor_branch_id;
            $guarantorToProductType = $submission->guarantorToProductType;
            $blank = $submission->blanks->firstWhere('is_broken', false);
            $noGuarantee = $this->generateNoGuarantee($guarantor, $guarantorToProductType, $guarantorBranchId, $blank, $submission->staff?->office);
            if ($submission->no_guarantee !== $noGuarantee) {
                $submission->no_guarantee = $noGuarantee;
                $submission->save();
            }
            $submission->blank = $blank;
        }
        $resource = SubmissionResource::collection($submissions);

        return inertia('report/invoice/index', [
            'page_settings' => [
                'title' => 'Laporan Invoice',
            ],
            'submissions' => fn () => $resource,
        ]);
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

        return inertia('report/production/index', [
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

        return inertia('report/blanks-usage/index', [
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

// Ambil parameter jangka waktu dari request (default ke null jika tidak ada)
// $startDate = $request->input('start_date');
// $endDate = $request->input('end_date');

// // Query dengan filter tanggal jika diberikan
// $blanks = Blank::query()
//     ->when($startDate, fn ($query) => $query->whereDate('created_at', '>=', $startDate))
//     ->when($endDate, fn ($query) => $query->whereDate('created_at', '<=', $endDate))
//     ->withCount([
//         'submissions as used' => fn ($query) => $query->where('status', 'used'),
//         'submissions as revised' => fn ($query) => $query->where('status', 'revised'),
//         'submissions as damaged' => fn ($query) => $query->where('status', 'damaged'),
//     ])
//     ->get();

// $totalSent = $blanks->count();
// $totalUsed = $blanks->sum('used');
// $totalRevised = $blanks->sum('revised');
// $totalDamaged = $blanks->sum('damaged');
// $totalNotUsed = $totalSent - $totalUsed;

// 'data' => [
//     'blanks' => $blanks,
//     'total_sent' => $totalSent,
//     'total_used' => $totalUsed,
//     'total_revised' => $totalRevised,
//     'total_damaged' => $totalDamaged,
//     'total_not_used' => $totalNotUsed,
// ],
// 'filters' => [
//     'start_date' => $startDate,
//     'end_date' => $endDate,
// ],
// 'export_url' => url('/export-blanks?start_date=' . $startDate . '&end_date=' . $endDate),
