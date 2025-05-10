<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Exports\BlankUsageExport;
use App\Http\Resources\Report\BlankUsageResource;
use App\Http\Resources\Submission\SubmissionResource;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Product\Product;
use App\Models\Submission\Submission;
use App\Traits\CalculateInvoice;
use App\Traits\FilterOffice;
use App\Traits\GeneratePattern;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    use CalculateInvoice, FilterOffice, GeneratePattern;

    protected string $headComponent;

    public function __construct()
    {
        $this->headComponent = 'report/';
    }

    public function invoice(Request $request)
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
        $guarantorSelected = (int) $request->get('guarantor_id', $guarantors->first()?->getAttribute('id'));
        $products = Product::query()
            ->with('productType')
            ->get(['id', 'name']);
        $productSelected = $request->get('product_id');
        $product = $products->firstWhere('id', $productSelected);
        $productTypes = $product ? $product->productType : [];
        $productTypeSelected = $request->get('product_type_id');
        $guarantorToProductType = $guarantors->firstWhere('id', $guarantorSelected)
            ?->guarantorToProductTypes->where('product_id', $productSelected)->where('product_type_id', $productTypeSelected)->first();

        $submissions = Submission::search($request->get('search'))
            ->query(function ($query) use ($date, $officeSelected, $guarantorSelected, $productSelected, $guarantorToProductType) {
                return $query
                    ->when($date->isNotEmpty(), function ($query) use ($date) {
                        $query->whereBetween('created_at', $date);
                    })
                    ->when($officeSelected, function ($query) use ($officeSelected) {
                        $query->whereHas('staff', function ($query) use ($officeSelected) {
                            $query->where('profile_id', $officeSelected);
                        });
                    })
                    ->when($guarantorSelected, function ($query) use ($guarantorSelected) {
                        $query->where('guarantor_id', $guarantorSelected);
                    })
                    ->when($productSelected, function ($query) use ($productSelected) {
                        $query->where('product_id', $productSelected);
                    })
                    ->when($guarantorToProductType, function ($query) use ($guarantorToProductType) {
                        $query->where('guarantor_to_product_type_id', $guarantorToProductType->id);
                    })
                    ->with([
                        'guarantor' => function ($query) {
                            $query->select(['id', 'name', 'code'])->withTrashed();
                        },
                        'guarantorBranch' => function ($query) {
                            $query->select(['id', 'name', 'code'])->withTrashed();
                        },
                        'guarantor.pattern' => function ($query) {
                            $query->select(['id', 'guarantor_id', 'prefix', 'content', 'suffix']);
                        },
                        'guarantor.guarantorRate',
                        'product' => function ($query) {
                            $query->select(['id', 'name'])->withTrashed();
                        },
                        'guarantorToProductType' => function ($query) {
                            $query->select(['id', 'code_product', 'code', 'name'])->withTrashed();
                        },
                        'blanks' => function ($query) {
                            $query->select(['blanks.id', 'blanks.number', 'blanks.is_broken'])->withTrashed();
                        },
                        'principal' => function ($query) {
                            $query->select(['id', 'name'])->withTrashed();
                        },
                        'obligee' => function ($query) {
                            $query->select(['id', 'name'])->withTrashed();
                        },
                        'staff' => function ($query) {
                            $query->select(['id', 'name', 'profile_id'])->withTrashed();
                        },
                        'staff.office' => function ($query) {
                            $query->select(['id', 'name', 'code', 'office_type'])->withTrashed();
                        },
                        'staff.office.profileRate',
                    ]);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        foreach ($submissions as $submission) {
            $blank = $submission->blanks->firstWhere('is_broken', false);
            $submission->blank = $blank;
            // get invoice
            $officeRate = $this->calculateOffice($submission);
            $guarantorRate = $this->calculateGuarantor($submission);
            $submission->rate = (object) [
                'office_rate' => $officeRate,
                'guarantor_rate' => $guarantorRate,
                'difference' => $officeRate['total'] - $guarantorRate['total'],
            ];
        }

        $resource = SubmissionResource::collection($submissions);

        return inertia($this->headComponent.'invoice/index', [
            'page_settings' => [
                'title' => 'Laporan Invoice',
            ],
            'submissions' => fn () => $resource,
            'date' => [
                'start' => $date->first(),
                'end' => $date->last(),
            ],
            'offices' => $offices,
            'officeTypes' => $officeTypes,
            'officeTypeSelected' => $officeTypeSelected,
            'officeSelected' => $officeSelected,
            'guarantors' => $guarantors->map->only('id', 'name'),
            'guarantorSelected' => $guarantorSelected,
            'products' => $products,
            'productSelected' => (int) $productSelected,
            'productTypes' => $productTypes,
            'productTypeSelected' => (int) $productTypeSelected,
        ]);
    }

    public function invoiceDetail(Submission $submission)
    {
        $submission->load([
            'guarantor' => function ($query) {
                $query->select(['id', 'name', 'code'])->withTrashed();
            },
            'guarantorBranch' => function ($query) {
                $query->select(['id', 'name', 'code'])->withTrashed();
            },
            'guarantor.pattern' => function ($query) {
                $query->select(['id', 'guarantor_id', 'prefix', 'content', 'suffix']);
            },
            'guarantor.guarantorRate',
            'product' => function ($query) {
                $query->select(['id', 'name'])->withTrashed();
            },
            'guarantorToProductType' => function ($query) {
                $query->select(['id', 'code_product', 'code', 'name'])->withTrashed();
            },
            'blanks' => function ($query) {
                $query->select(['blanks.id', 'blanks.number', 'blanks.is_broken'])->withTrashed();
            },
            'principal' => function ($query) {
                $query->select(['id', 'name'])->withTrashed();
            },
            'obligee' => function ($query) {
                $query->select(['id', 'name'])->withTrashed();
            },
            'staff' => function ($query) {
                $query->select(['id', 'name', 'profile_id'])->withTrashed();
            },
            'staff.office' => function ($query) {
                $query->select(['id', 'name', 'code', 'office_type'])->withTrashed();
            },
            'staff.office.profileRate',
        ]);
        $guarantorRate = $this->calculateGuarantor($submission);
        $officeRate = $this->calculateOffice($submission);

        return inertia($this->headComponent.'invoice/detail/index', [
            'page_settings' => [
                'title' => 'Detail Invoice',
            ],
            'submission' => $submission,
            'guarantor_rate' => $guarantorRate,
            'office_rate' => $officeRate,
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
