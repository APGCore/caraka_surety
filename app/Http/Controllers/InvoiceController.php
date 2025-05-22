<?php

namespace App\Http\Controllers;

use App\Http\Requests\Invoice\StoreRequest;
use App\Http\Resources\Submission\SubmissionResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Product\Product;
use App\Models\RelatedParties\PrincipalRate;
use App\Models\Submission\Submission;
use App\Traits\CalculateInvoice;
use App\Traits\FilterOffice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InvoiceController extends Controller
{
    use CalculateInvoice, FilterOffice;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
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

        return inertia('report/invoice/index', [
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request): void
    {
        DB::beginTransaction();
        try {
            $requestValid = $request->validated();
            $submissionId = $requestValid['submission_id'];
            $submission = Submission::query()->with(['staff'])->find($submissionId);
            $profileId = $submission->getRelation('staff')->getAttribute('profile_id');
            $guarantorId = $submission->getAttribute('guarantor_id');
            $guarantorBranchId = $submission->getAttribute('guarantor_to_branch_id');
            $guarantorToProductTypeId = $submission->getAttribute('guarantor_to_product_type_id');
            $principalId = $submission->getAttribute('principal_id');

            $dataRate = [
                'minimum_bill' => $this->currencyConvert($requestValid['minimum_bill']),
                'selling_rate' => $requestValid['selling_rate'],
                'sales_administration' => $this->currencyConvert($requestValid['sales_administration']),
                'broken_rate' => $this->currencyConvert($requestValid['broken_rate']),
                'revised_rate' => $this->currencyConvert($requestValid['revised_rate']),
            ];

            $dataPrincipalRate = [
                'profile_id' => $profileId,
                'guarantor_id' => $guarantorId,
                'guarantor_branch_id' => $guarantorBranchId,
                'guarantor_to_product_type_id' => $guarantorToProductTypeId,
                'principal_id' => $principalId,
            ];

            PrincipalRate::query()->createOrFirst($dataPrincipalRate, $dataRate);

            $submission->submissionRate()->updateOrCreate(
                ['submission_id' => $submissionId],
                $dataRate
            );
            DB::commit();
            flashMessage('Berhasil', 'Berhasil menyimpan data');
        } catch (\Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error store invoice', $error);
            flashMessage('Gagal', 'Gagal menyimpan data', 'error');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Submission $submission)
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
                $query->select(['id', 'code_product', 'code', 'name', 'full_name'])->withTrashed();
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
            'principal.principalRate',
            'submissionRate',
        ]);
        $guarantorRate = $this->calculateGuarantor($submission);
        $officeRate = $this->calculateOffice($submission);
        $principalRate = $this->calculatePrincipal($submission);
        $submissionRate = $this->calculateSubmission($submission);

        $submission->unsetRelation('guarantor.guarantorRate');
        $submission->unsetRelation('staff.office.profileRate');
        $submission->unsetRelation('principal.principalRate');
        $submission->unsetRelation('submissionRate');

        return inertia('report/invoice/detail/index', [
            'page_settings' => [
                'title' => 'Detail Invoice',
            ],
            'submission' => $submission,
            'guarantor_rate' => $guarantorRate,
            'office_rate' => $officeRate,
            'principal_rate' => $principalRate,
            'submission_rate' => $submissionRate,
        ]);
    }
}
