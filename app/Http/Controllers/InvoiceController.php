<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Enums\SubmissionStatus;
use App\Http\Requests\Invoice\StoreRequest;
use App\Http\Resources\Submission\SubmissionResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Product\Product;
use App\Models\Profile\Profile;
use App\Models\RelatedParties\PrincipalRate;
use App\Models\Submission\Submission;
use App\Services\HostToHostService;
use App\Traits\CalculateInvoice;
use App\Traits\FilterOffice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class InvoiceController extends Controller
{
    use CalculateInvoice, FilterOffice;

    protected HostToHostService $hostToHostService;

    public function __construct(
        HostToHostService $hostToHostService
    ) {
        $this->hostToHostService = $hostToHostService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
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

        // Get all IDs before pagination
        $submissionIds = Submission::search($request->get('search'))
            ->query(function ($query) use ($date, $officeSelected, $guarantorSelected, $productSelected, $guarantorToProductType) {
                $query->whereNotIn('status', [SubmissionStatus::REJECTED->value, SubmissionStatus::PROCESS->value])
                    ->when($date->isNotEmpty(), fn ($q) => $q->whereBetween('created_at', $date))
                    ->when($officeSelected, fn ($q) => $q->whereHas('staff', fn ($q) => $q->where('profile_id', $officeSelected)))
                    ->when($guarantorSelected, fn ($q) => $q->where('guarantor_id', $guarantorSelected))
                    ->when($productSelected, fn ($q) => $q->where('product_id', $productSelected))
                    ->when($guarantorToProductType, fn ($q) => $q->where('guarantor_to_product_type_id', $guarantorToProductType->id))
                    ->select('id');
            })
            ->get()->pluck('id')->toArray();

        // Paginate the results
        $submissions = Submission::search($request->get('search'))
            ->query(function ($query) use ($date, $officeSelected, $guarantorSelected, $productSelected, $guarantorToProductType) {
                $query->whereNotIn('status', [SubmissionStatus::REJECTED->value, SubmissionStatus::PROCESS->value])
                    ->when($date->isNotEmpty(), fn ($q) => $q->whereBetween('created_at', $date))
                    ->when($officeSelected, fn ($q) => $q->whereHas('staff', fn ($q) => $q->where('profile_id', $officeSelected)))
                    ->when($guarantorSelected, fn ($q) => $q->where('guarantor_id', $guarantorSelected))
                    ->when($productSelected, fn ($q) => $q->where('product_id', $productSelected))
                    ->when($guarantorToProductType, fn ($q) => $q->where('guarantor_to_product_type_id', $guarantorToProductType->id))
                    ->with([
                        'submissionBefore:id',
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
                    ]);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $resource = SubmissionResource::collection($submissions);

        return inertia('report/invoice/index', [
            'page_settings' => [
                'title' => 'Laporan Invoice',
            ],
            'submissions' => fn () => $resource,
            'submissionIds' => $submissionIds,
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

            $this->storeSubmissionRate($submission, $requestValid['minimum_bill'],
                $requestValid['selling_rate'], $requestValid['sales_administration'],
                $requestValid['broken_rate'], $requestValid['revised_rate']);

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
    public function show(Submission $submission): Response|RedirectResponse
    {
        $submission->load([
            'submissionBefore:id',
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

        if ($submission->getRelation('guarantor')?->getRelation('guarantorRate') === null) {
            flashMessage('Peringatan', 'Rate Penjamin Tidak Tersedia, silakan hubungi admin', 'warning');

            return redirect()->back();
        }
        if ($submission->getRelation('staff')?->getRelation('office')?->getRelation('profileRate') === null) {
            flashMessage('Peringatan', 'Rate Sumber Bisnis Tidak Tersedia, silakan hubungi admin', 'warning');

            return redirect()->back();
        }
        $guarantorRate = $this->calculateGuarantor($submission);
        $officeRate = $this->calculateOffice($submission);
        //        $principalRate = $this->calculatePrincipal($submission);
        $capitalRate = $this->calculateCapitalRates($submission);
        //        $sellingRate = $this->calculateSellingRates($submission);
        $isSet = $submission->getRelation('submissionRate') !== null;

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
            //            'principal_rate' => $principalRate,
            'capital_rate' => $capitalRate,
            'selling_rate' => $officeRate,
            'is_set' => $isSet,
        ]);
    }

    private function storeSubmissionRate(Submission $submission, $minimum, $rate, $adm, $broken, $revised): void
    {
        $submission->load(['staff']);
        $profileId = $submission->getRelation('staff')->getAttribute('profile_id');
        $guarantorId = $submission->getAttribute('guarantor_id');
        $guarantorBranchId = $submission->getAttribute('guarantor_to_branch_id');
        $guarantorToProductTypeId = $submission->getAttribute('guarantor_to_product_type_id');
        $principalId = $submission->getAttribute('principal_id');

        $dataRate = [
            'minimum_bill' => $minimum,
            'selling_rate' => $rate,
            'sales_administration' => $adm,
            'broken_rate' => $broken,
            'revised_rate' => $revised,
        ];

        $dataPrincipalRate = [
            'profile_id' => $profileId,
            'guarantor_id' => $guarantorId,
            'guarantor_branch_id' => $guarantorBranchId,
            'guarantor_to_product_type_id' => $guarantorToProductTypeId,
            'principal_id' => $principalId,
        ];

        PrincipalRate::query()->updateOrCreate($dataPrincipalRate, $dataRate);

        $submission->submissionRate()->updateOrCreate(
            ['submission_id' => $submission->getAttribute('id')],
            $dataRate
        );
    }

    /**
     * Send the invoice to the finance app.
     */
    public function sendToFinance(Request $request): RedirectResponse
    {
        $request->validate([
            'submission_ids' => 'required|array',
            'submission_ids.*' => 'required|integer|exists:'.Submission::class.',id,deleted_at,NULL',
        ]);
        DB::beginTransaction();
        try {
            $submissionIds = $request->get('submission_ids', []);
            $submissions = Submission::query()
                ->select(['id', 'no_guarantee', 'guarantor_id', 'guarantor_branch_id', 'principal_id', 'obligee_id', 'staff_id',
                    'product_id', 'guarantor_to_product_type_id', 'guarantee_value', 'time_period', 'difference_time_period', 'status',
                    'created_at', 'checked_at', 'approved_at', 'is_revised',
                ])
                ->with([
                    'guarantor' => function ($query) {
                        $query->withTrashed();
                    },
                    'guarantor.province',
                    'guarantor.regency',
                    'guarantor.district',
                    'guarantor.guarantorRate',
                    'guarantorBranch' => function ($query) {
                        $query->withTrashed();
                    },
                    'guarantorBranch.province',
                    'guarantorBranch.regency',
                    'guarantorBranch.district',
                    'principal' => function ($query) {
                        $query->withTrashed();
                    },
                    'principal.province',
                    'principal.regency',
                    'principal.district',
                    'obligee' => function ($query) {
                        $query->withTrashed();
                    },
                    'obligee.province',
                    'obligee.regency',
                    'obligee.district',
                    'staff' => function ($query) {
                        $query->select(['id', 'name', 'profile_id'])->withTrashed();
                    },
                    'staff.office' => function ($query) {
                        $query->select(['id', 'name', 'code', 'office_type'])->withTrashed();
                    },
                    'staff.office.profileRate',
                    'guarantorToProductType' => function ($query) {
                        $query->select(['id', 'name', 'job_group', 'job_type'])->withTrashed();
                    },
                    'submissionRate',
                    'blanks' => function ($query) {
                        $query->select(['blanks.id', 'blanks.number', 'blanks.is_broken'])->withTrashed();
                    },
                ])
                ->whereIn('id', $submissionIds)
                ->get();
            $offices = [];
            $invoices = [];
            foreach ($submissions as $submission) {
                $staff = $submission->getRelation('staff');
                $office = Profile::query()
                    ->select(['id', 'name', 'code', 'office_type'])
                    ->where('office_type', OfficeType::HEADQUARTER->value)
                    ->withTrashed()
                    ->first();
                $businessUnit = $staff->getRelation('office');
                $principal = $submission->getRelation('principal');
                $obligee = $submission->getRelation('obligee');
                $guarantor = $submission->getRelation('guarantor');
                $guarantorBranch = $submission->getRelation('guarantorBranch');
                $guarantorToProductType = $submission->getRelation('guarantorToProductType');
                $blanks = $submission->getRelation('blanks');
                $profileRate = $businessUnit?->getRelation('profileRate')
                    ->where('guarantor_id', $submission->getAttribute('guarantor_id'))
                    ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
                    ->first();
                // If profile rate not found, use guarantor rate
                if (! $profileRate) {
                    $offices[] = $businessUnit;

                    continue; // Skip if submission rate is not set
                }
                $submission->update(['has_send_to_finance' => true]);
                $minimum = (float) ($profileRate->getAttribute('minimum_bill') ?? 0);
                $rate = (float) ($profileRate->getAttribute('selling_rate') ?? 0);
                $adm = (float) ($profileRate->getAttribute('sales_administration') ?? 0);
                $brokenRate = (float) ($profileRate->getAttribute('broken_rate') ?? 0);
                $revisedRate = (float) ($profileRate->getAttribute('revised_rate') ?? 0);
                $this->storeSubmissionRate(
                    $submission,
                    $minimum,
                    $rate,
                    $adm,
                    $brokenRate,
                    $revisedRate,
                );
                // Calculate rates
                $capitalRates = $this->calculateCapitalRates($submission);
                $sellingRates = $this->calculateSellingRates($submission);

                $prefixCode = 'apg-core-';
                $invoices[] = [
                    'submission' => [
                        'id' => $submission->getAttribute('id'),
                        'no_guarantee' => $submission->getAttribute('no_guarantee'),
                        'no_blank' => $blanks->firstWhere('is_broken', false)?->getAttribute('number') ?? '-',
                        'status' => $submission->getAttribute('status'),
                        'created_at' => $submission->getAttribute('created_at'),
                        'checked_at' => $submission->getAttribute('checked_at'),
                        'approved_at' => $submission->getAttribute('approved_at'),
                    ],
                    'office' => [
                        'code' => $prefixCode.'office-'.$office->getAttribute('id'),
                        'name' => $office->getAttribute('name'),
                        'office_type' => $office->getAttribute('office_type'),
                    ],
                    'business_unit' => [
                        'code' => $prefixCode.'business-unit-'.$businessUnit->getAttribute('id'),
                        'name' => $businessUnit->getAttribute('name'),
                        'office_type' => $businessUnit->getAttribute('office_type'),
                    ],
                    'principal' => [
                        'code' => $prefixCode.'principal-'.$principal->getAttribute('id'),
                        'province' => $principal->getRelation('province')?->getAttribute('name') ?? '-',
                        'regency' => $principal->getRelation('regency')?->getAttribute('name') ?? '-',
                        'district' => $principal->getRelation('district')?->getAttribute('name') ?? '-',
                        'village' => $principal->getAttribute('village') ?? '-',
                        'name' => $principal->getAttribute('name'),
                        'address' => $principal->getAttribute('address'),
                        'postal_code' => $principal->getAttribute('postal_code') ?? '-',
                        'telephone' => $principal->getAttribute('telephone') ?? '-',
                        'fax' => $principal->getAttribute('fax') ?? '-',
                        'pic' => $principal->getAttribute('pic') ?? '-',
                        'npwp' => $principal->getAttribute('npwp') ?? '-',
                        'nib' => $principal->getAttribute('nib') ?? '-',
                        'siup_siujk' => $principal->getAttribute('siup_siujk') ?? '-',
                        'head_name' => $principal->getAttribute('head_name') ?? '-',
                        'business_fields' => $principal->getAttribute('business_fields') ?? '-',
                        'director_name' => $principal->getAttribute('director_name') ?? '-',
                        'director_position' => $principal->getAttribute('director_position') ?? '-',
                        'director_phone' => $principal->getAttribute('director_phone') ?? '-',
                        'commissioner' => $principal->getAttribute('commissioner') ?? '-',
                        'year_established' => $principal->getAttribute('year_established') ?? '-',
                        'est_deed' => $principal->getAttribute('est_deed') ?? '-',
                    ],
                    'obligee' => [
                        'code' => $prefixCode.'obligee-'.$obligee->getAttribute('id'),
                        'province' => $obligee->getRelation('province')?->getAttribute('name') ?? '-',
                        'regency' => $obligee->getRelation('regency')?->getAttribute('name') ?? '-',
                        'district' => $obligee->getRelation('district')?->getAttribute('name') ?? '-',
                        'village' => $obligee->getAttribute('village') ?? '-',
                        'name' => $obligee->getAttribute('name'),
                        'address' => $obligee->getAttribute('address'),
                        'postal_code' => $obligee->getAttribute('postal_code') ?? '-',
                        'telephone' => $obligee->getAttribute('telephone') ?? '-',
                        'fax' => $obligee->getAttribute('fax') ?? '-',
                        'pic' => $obligee->getAttribute('pic') ?? '-',
                        'no_ppk' => $obligee->getAttribute('no_ppk') ?? '-',
                    ],
                    'insurance' => [
                        'code' => $prefixCode.'insurance-'.$submission->getAttribute('guarantor_id'),
                        'province' => $guarantor->getRelation('province')?->getAttribute('name') ?? '-',
                        'regency' => $guarantor->getRelation('regency')?->getAttribute('name') ?? '-',
                        'district' => $guarantor->getRelation('district')?->getAttribute('name') ?? '-',
                        'village' => $guarantor->getAttribute('village') ?? '-',
                        'name' => $guarantor->getAttribute('name'),
                        'address' => $guarantor->getAttribute('address'),
                        'postal_code' => $guarantor->getAttribute('postal_code') ?? '-',
                        'telephone' => $guarantor->getAttribute('telephone') ?? '-',
                        'fax' => $guarantor->getAttribute('fax') ?? '-',
                        'pic' => $guarantor->getAttribute('pic') ?? '-',
                    ],
                    'insurance_branch' => [
                        'code' => $prefixCode.'insurance-branch-'.$submission->getAttribute('guarantor_branch_id'),
                        'province' => $guarantorBranch->getRelation('province')?->getAttribute('name') ?? '-',
                        'regency' => $guarantorBranch->getRelation('regency')?->getAttribute('name') ?? '-',
                        'district' => $guarantorBranch->getRelation('district')?->getAttribute('name') ?? '-',
                        'village' => $guarantorBranch->getAttribute('village') ?? '-',
                        'name' => $guarantorBranch->getAttribute('name'),
                        'address' => $guarantorBranch->getAttribute('address'),
                        'postal_code' => $guarantorBranch->getAttribute('postal_code') ?? '-',
                        'telephone' => $guarantorBranch->getAttribute('telephone') ?? '-',
                        'fax' => $guarantorBranch->getAttribute('fax') ?? '-',
                        'pic' => $guarantorBranch->getAttribute('pic') ?? '-',
                    ],
                    'invoice' => [
                        'guarantee_value' => $submission->getAttribute('guarantee_value'),
                        'guarantee_days' => $submission->getAttribute('time_period'),
                        'guarantee_days_diff' => $submission->getAttribute('difference_time_period'),
                        'purchase' => $capitalRates,
                        'sales' => $sellingRates,
                        //                    'product' => [
                        //                        'code' => $prefixCode.'product-'.$submission->getAttribute('product_id'),
                        //                        'name' => $guarantorToProductType->getAttribute('name'),
                        //                    ],
                        'product_type' => [
                            'code' => $prefixCode.'product-type-'.$guarantorToProductType->getAttribute('id'),
                            'name' => $guarantorToProductType->getAttribute('name'),
                            'job_group' => $guarantorToProductType->getAttribute('job_group'),
                            'job_type' => $guarantorToProductType->getAttribute('job_type'),
                        ],
                    ],
                ];
            }
            $officeNames = collect($offices)->unique('id')->pluck('name')->toArray();
            // If rate not found
            $rateNotFound = count($offices) > 0 ? ', karena Unit Bisnis '.implode(', ', $officeNames).' yang belum memiliki Rate dan tidak dapat mengirim ke sistem keuangan.' : '';
            if (count($invoices) === 0) {
                flashMessage('Peringatan', 'Tidak ada invoice yang dapat dikirim ke aplikasi keuangan'.$rateNotFound, 'warning');
                DB::rollBack();

                return redirect()->back();
            }
            Log::info('Data to send to finance', compact('invoices'));
            $url = config('services.finance.url');
            $token = config('services.finance.token');
            $response = $this->hostToHostService->sendPostRequest($url, $token, compact('invoices'));
            if ($response['status'] === 'error') {
                Log::error('Error sending invoice to finance', compact('response'));
                flashMessage('Gagal', 'Gagal mengirim invoice ke aplikasi keuangan', 'error');
                DB::rollBack();
            } else {
                Log::info('Invoice sent to finance successfully', ['response' => $response, 'offices_not_have_rate' => $officeNames]);
                flashMessage('Berhasil', 'Invoice berhasil dikirim ke aplikasi keuangan'.$rateNotFound);
                DB::commit();
            }
        } catch (\Exception $e) {
            DB::rollBack();
            $message = $this->handleErrorMessage($e);
            Log::error('Error sending invoice to finance', $message);
            flashMessage('Gagal', $message['message'] ?? 'Gagal mengirim invoice ke aplikasi keuangan', 'error');
        } finally {
            return redirect()->back();
        }
    }
}
