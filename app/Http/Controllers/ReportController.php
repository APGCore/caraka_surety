<?php

namespace App\Http\Controllers;

use App\Exports\BlankUsageExport;
use App\Http\Resources\Report\BlankUsageResource;
use App\Http\Resources\Submission\SubmissionResource;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Product\Product;
use App\Models\Submission\Submission;
use App\Traits\FilterOffice;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    use FilterOffice;

    protected string $headComponent;

    public function __construct()
    {
        $this->headComponent = 'report/';
    }

    public function productionReportV2(Request $request)
    {
        $date = collect($request->get('date') ?? [
            now()->subDays(7)->toDateString().' 00:00:00',
            now()->toDateString().' 23:59:59',
        ])->values();
        $officeFilter = $this->filterOffice($request);
        $officeTypes = $officeFilter->officeTypes;
        $offices = $officeFilter->offices;
        $officeTypeSelected = $officeFilter->officeTypeSelected;
        $officeSelected = $officeFilter->officeSelected;
        $guarantors = Guarantor::query()
            ->whereNull('headquarter_id')
            ->with('guarantorToProductTypes')
            ->get(['id', 'name']);
        $guarantorSelected = (int) $request->get('guarantor_id', config('guarantor.id'));
        $products = Product::query()
            ->with('productType')
            ->get(['id', 'name']);
        $productSelected = $request->get('product_id');
        $product = $products->firstWhere('id', $productSelected);
        $productTypes = $product ? $product->productType : [];
        $productTypeSelected = $request->get('product_type_id');
        $guarantorToProductType = $guarantors->firstWhere('id', $guarantorSelected)
            ?->guarantorToProductTypes->where('product_id', $productSelected)->where('product_type_id', $productTypeSelected)->first();
        $search = $request->get('search');

        $submissions = Submission::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('no_guarantee', 'like', "%{$search}%")
                        ->orWhereHas('principal', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($date->isNotEmpty(), function ($query) use ($date) {
                $query->whereBetween('created_at', $date);
            })
            ->when($officeSelected, function ($query) use ($officeSelected) {
                $query->whereHas('staff', function ($query) use ($officeSelected) {
                    $query->where('profile_id', $officeSelected);
                });
            })
            ->where('guarantor_id', $guarantorSelected)
            ->when($productSelected !== null, function ($query) use ($productSelected) {
                $query->where('product_id', $productSelected);
            })
            ->when($guarantorToProductType !== null, function ($query) use ($guarantorToProductType) {
                $query->where('guarantor_to_product_type_id', $guarantorToProductType->id);
            });

        $submissionIds = $submissions->pluck('id');

        $submissions = $submissions->with([
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
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page') ?? 10)
            ->withQueryString();

        $resource = SubmissionResource::collection($submissions);
        $component = 'admin/submission-management/list/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Laporan Produksi',
            ],
            'submissions' => fn () => $resource,
            'submissionIds' => $submissionIds,
            'offices' => $offices,
            'officeTypes' => $officeTypes,
            'officeSelected' => (int) $officeSelected,
            'officeTypeSelected' => $officeTypeSelected,
            'guarantors' => $guarantors->map->only('id', 'name'),
            'guarantorSelected' => $guarantorSelected,
            'products' => $products,
            'productSelected' => (int) $productSelected,
            'productTypes' => $productTypes,
            'productTypeSelected' => (int) $productTypeSelected,
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
