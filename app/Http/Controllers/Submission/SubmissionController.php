<?php

namespace App\Http\Controllers\Submission;

use App\Enums\RoleEnum;
use App\Enums\SubmissionStatus;
use App\Enums\SubmissionType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Submission\StoreRequest;
use App\Http\Resources\Submission\SubmissionResource;
use App\Models\Document\DocumentFormat;
use App\Models\Document\RequiredDoc;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Product\Product;
use App\Models\RelatedParties\Obligee;
use App\Models\RelatedParties\SubmissionObligee;
use App\Models\RelatedParties\Principal;
use App\Models\RelatedParties\SubmissionPrincipal;
use App\Models\Scoring\Scoring;
use App\Models\Submission\Submission;
use App\Models\User;
use App\Services\HostToHostService;
use App\Traits\FilterOffice;
use App\Traits\GeneratePattern;
use App\Traits\ReplaceDocumentFormat;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class SubmissionController extends Controller
{
    use FilterOffice, GeneratePattern, ReplaceDocumentFormat;

    protected HostToHostService $hostToHostService;

    protected int $guarantorId;

    protected int $productId;

    public function __construct(
        HostToHostService $hostToHostService
    ) {
        Carbon::setLocale('id');
        $this->hostToHostService = $hostToHostService;
        $this->guarantorId = config('guarantor.id');
        $this->productId = config('product.id');
    }

    // For Export

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
                    $query->whereLike('no_guarantee', "%{$search}%")
                        ->orWhereHas('principal', function ($query) use ($search) {
                            $query->whereLike('name', "%{$search}%");
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
            'blank:id,number,is_broken,is_revised',
            'principal:id,name',
            'obligee:id,name',
            'staff:id,name,profile_id',
            'office:id,name,code,office_type',
            'office.profileRate',
            'submissionBefore:id',
            'submissionBefore.blank',
            'staff:id,name,profile_id',
            'office:id,name',
        ])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page') ?? 10)
            ->withQueryString();

        $resource = SubmissionResource::collection($submissions);
        $component = 'admin/submission-management/list/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Daftar Pengajuan',
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        Log::info('Data Pengajuan: ', $validated);

        DB::beginTransaction();
        try {
            $principal = $validated['principal'];
            $principalId = $principal['id'];
            $principalRatios = collect($principal['ratios']);
            $principalRatios = $principalRatios->map(function ($ratio) {
                $ratio['year'] = (int) $ratio['year'];
                $ratio['current_assets'] = (float) $ratio['current_assets'];
                $ratio['current_debt'] = (float) $ratio['current_debt'];
                $ratio['total_debt'] = (float) $ratio['total_debt'];
                $ratio['total_assets'] = (float) $ratio['total_assets'];
                $ratio['revenue'] = (float) $ratio['revenue'];
                $ratio['net_income'] = (float) $ratio['net_income'];
                $ratio['liquidity_ratios'] = (float) $ratio['liquidity_ratios'];
                $ratio['profitability_ratios'] = (float) $ratio['profitability_ratios'];
                $ratio['solvency_ratios'] = (float) $ratio['solvency_ratios'];

                return $ratio;
            })->toArray();

            $obligee = $validated['obligee'];
            $submission = $validated['submission'];
            $submissionType = $validated['submissionType'];
            $submission['difference_time_period'] = (float) $submission['difference_time_period'];
            $supportDocs = $submission['support_docs'] ?? [];
            $scoring = $validated['scoring'];
            $isEdit = $submissionType === SubmissionType::EDIT->value;
            $isRevision = $submissionType === SubmissionType::REVISION->value;
            $staffId = auth()->id();
            $staff = User::query()->find($staffId);

            $principal = Principal::query()->firstWhere('id', $principalId);
            // create principal ratios
            foreach ($principalRatios as $principalRatio) {
                $principal->principalRatios()
                    ->updateOrCreate([
                        'year' => $principalRatio['year'],
                    ], $principalRatio);
            }

            // create or update obligee
            Obligee::query()
               ->firstOrCreate([
                   'id' => $obligee['id'] ?? null,
               ], $obligee);
            $obligee = SubmissionObligee::query()
                ->updateOrCreate([
                  'id' => $obligee['id'] ?? null,
                ], $obligee);

            $guarantorHead = Guarantor::query()
                ->with(['pattern', 'guarantorToProductTypes'])
                ->find($submission['guarantor_id']);
            $guarantorBranch = Guarantor::query()->find($submission['guarantor_branch_id']);

            $guarantorToProductType = $guarantorHead->getRelation('guarantorToProductTypes')
                ->where('product_id', $submission['product_id'])
                ->where('product_type_id', $submission['product_type_id'])
                ->where('job_group', $submission['job_group'])
                ->where('job_type', $submission['job_type'])
                ->first();

            // prepare create submission
            $dataSubmission = collect($submission)->toArray();

            if ($isRevision) {
                $submissionBeforeId = $dataSubmission['submission_before_id'];
                $submissionForRevision = Submission::query()->select(['id', 'blank_id', 'no_guarantee', 'status'])->find($submissionBeforeId);
                $submissionForRevision->blank()->update(['is_revised' => true]);
                $submissionForRevision->update(['status' => SubmissionStatus::REVISED->value]);
                $dataSubmission['staff_id'] = $staffId;
                $dataSubmission['publication_date'] = now();
                $dataSubmission['publication_place'] = $guarantorBranch->publication_place;
                $messageResponse = 'Berhasil merevisi pengajuan';
            } elseif ($isEdit) {
                $messageResponse = 'Berhasil memperbarui pengajuan';
            } else {
                $dataSubmission['office_id'] = $staff->getAttribute('profile_id');
                $dataSubmission['staff_id'] = $staffId;
                $dataSubmission['publication_date'] = now();
                $dataSubmission['publication_place'] = $guarantorBranch->publication_place;
                $messageResponse = 'Berhasil membuat pengajuan';
            }
            $dataSubmission['no_guarantee'] = str_pad('X', 16, 'X');
            $dataSubmission['guarantor_to_product_type_id'] = $guarantorToProductType->id;
            $dataSubmission['principal_id'] = $principalId;
            $dataSubmission['obligee_id'] = $obligee->getAttribute('id');
            $dataSubmission['note_scoring'] = $scoring['note'];
            $modelScoring = Scoring::query()->find($scoring['id']);
            $dataSubmission['min_point_scoring'] = (int) $modelScoring?->min_point;
            $dataSubmission['contract_doc_date'] = $submission['contract_doc_date'] ? Carbon::parse($submission['contract_doc_date'])->format('Y-m-d') : null;
            $dataSubmission['start_date'] = $submission['start_date'] ? Carbon::parse($submission['start_date'])->format('Y-m-d H:i:s') : null;
            $dataSubmission['end_date'] = $submission['end_date'] ? Carbon::parse($submission['end_date'])->format('Y-m-d H:i:s') : null;
            $dataSubmission['contract_value'] = (float) str_replace(',', '.', $submission['contract_value']);
            $dataSubmission['guarantee_value'] = (float) str_replace(',', '.', $submission['guarantee_value']);
            $dataSubmission['first_year_ratio'] = $principalRatios[0]['year'] ?? null;
            $dataSubmission['last_year_ratio'] = $principalRatios[1]['year'] ?? null;

            $scores = $scoring['scores'];

            if ($isEdit) {
                $submission = Submission::query()->with(['scores', 'supportDocs'])->find($submission['id']);
                $submission->scores()->delete();
                $submission->update($dataSubmission);
            } else {
                $submission = Submission::query()->with(['scores', 'supportDocs'])->create($dataSubmission);
            }

            // update support document
            // delete data if exist
            foreach ($supportDocs as $supportDoc) {
                $data = [
                    'submission_id' => $submission->getAttribute('id'),
                    'name' => $supportDoc['name'],
                    'number' => $supportDoc['number'],
                    'date' => $supportDoc['date'],
                ];
                $file = $supportDoc['file'] ?? null;

                if ($file) {
                    $existingDoc = $submission->supportDocs()->find($supportDoc['id'] ?? null);
                    if ($existingDoc) {
                        $this->deleteFile($existingDoc->url);
                    }
                    $data['url'] = $this->uploadFile(
                        $file,
                        "submission/submission-{$submission->getAttribute('id')}/support-documents/{$supportDoc['date']}",
                        $supportDoc['name']
                    );
                }

                if (! empty($supportDoc['id'])) {
                    $submission->supportDocs()->where('id', $supportDoc['id'])->update($data);
                } else {
                    $submission->supportDocs()->create($data);
                }
            }

            // create submission scoring
            foreach ($scores as &$score) {
                $score['scoring_id'] = $scoring['id'];
            }

            $submission->scores()->createMany($scores);

            // if score < min_point_scoring, set status to REJECTED
            $totalScore = collect($scores)->sum('point');
            if ($totalScore < ((int) $submission->getAttribute('min_point_scoring'))) {
                $this->processRejection($submission);
            }
            activity()
                ->useLog('submission')
                ->performedOn($submission)
                ->causedBy(auth()->user())
                ->log('Membuat pengajuan');
            flashMessage('success', $messageResponse);
            DB::commit();

            return redirect()->back()->with('success', $messageResponse);
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('SubmissionController@store: ', $error);

            if (str_contains($e->getMessage(), 'Blangko')) {
                flashMessage('Blangko Kosong', $e->getMessage(), 'error');

                return redirect()->back()->withErrors(['error' => $e->getMessage()]);
            } else {
                flashMessage('Error', 'Gagal membuat pengajuan', 'error');

                return redirect()->back()->withErrors(['error' => 'Gagal membuat pengajuan']);
            }
        }
    }

    /**
     * Display the form for creating a new resource.
     */
    public function create(): Response
    {
        $checkRole = $this->checkRole();
        $isStaff = $checkRole['isStaff'];
        $isAgentPartner = $checkRole['isAgentPartner'];
        $isMarketingPartner = $checkRole['isMarketingPartner'];

        if ($isStaff) {
            $component = 'staff/submission-management/create/index';
        } elseif ($isAgentPartner) {
            $component = 'agent-partner/submission-management/create/index';
        } elseif ($isMarketingPartner) {
            $component = 'marketing-partner/submission-management/create/index';
        } else {
            $component = 'staff/submission-management/create/index';
        }

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Buat Pengajuan',
            ],
        ]);
    }

    private function checkRole(): array
    {
        // check role
        $authId = auth()->id();
        $user = User::query()
            ->with('role')
            ->find($authId);
        $roleName = $user->getRelation('role')->getAttribute('name');
        $isStaff = $roleName === RoleEnum::Staff->value;
        $isDireksi = $roleName === RoleEnum::Direksi->value;
        $isManager = $roleName === RoleEnum::Manager->value;
        $isKepalaCabang = $roleName === RoleEnum::KepalaCabang->value;
        $isKepalaAgentPartner = $roleName === RoleEnum::KepalaAgentPartner->value;
        $isAgentPartner = $roleName === RoleEnum::AgentPartner->value;
        $isMarketingPartner = $roleName === RoleEnum::MarketingPartner->value;

        return compact([
            'authId',
            'user',
            'isStaff',
            'isDireksi',
            'isManager',
            'isKepalaCabang',
            'isKepalaAgentPartner',
            'isAgentPartner',
            'isMarketingPartner',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function edit($id): Response|RedirectResponse
    {
        $submission = $this->getSubmission($id);
        if (! $submission) {
          flashMessage('Gagal', 'Pengajuan tidak ditemukan', 'error');

          return redirect()->back();
        }
        if ($submission->getAttribute('has_send_to_guarantor')) {
            flashMessage('Gagal', 'Pengajuan tidak dapat diubah karena sudah di kirim ke asuransi', 'error');

            return redirect()->back();
        }
        $principal = $submission->getRelation('principal')->only([
            'id',
            'province_id',
            'regency_id',
            'district_id',
            'village',
            'name',
            'address',
            'telephone',
            'fax',
            'postal_code',
            'npwp',
            'nib',
            'siup_siujk',
            'head_name',
            'director_name',
            'director_position',
            'director_phone',
            'commissioner',
            'year_established',
            'est_deed',
            'last_deed',
            'business_fields',
        ]);

        $obligee = $submission->getRelation('obligee');

        $scoring = collect([
            'id' => $submission->getRelation('scores')->first()?->scoring_id ?? null,
            'note' => $submission->getAttribute('note_scoring'),
            'scores' => $submission->getAttribute('scores'),
        ]);

        $submissionArray = $submission->only([
            'id',
            'submission_inherit_id',
            'guarantor_id',
            'guarantor_branch_id',
            'product_id',
            'bank_id',
            'contract_doc_name',
            'contract_doc_number',
            'contract_doc_date',
            'contract_value',
            'guarantee_value',
            'time_period',
            'difference_time_period',
            'start_date',
            'end_date',
            'job_name',
            'job_location_province_id',
            'job_location_regency_id',
            'job_location_district_id',
            'job_location_village',
            'job_location_address',
            'job_location_postal_code',
            'source_of_fund_id',
            'note',
            'risk_mitigation',
            'revised_note',
            'first_year_ratio',
            'last_year_ratio',
        ]);

        $submission = array_merge(
            $submissionArray,
            $submission->getRelation('guarantorToProductType')->only(
                'product_type_id',
                'job_group',
                'job_type',
            ),
            ['support_docs' => $submission->getRelation('supportDocs')->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'name' => $doc->name,
                    'number' => $doc->number,
                    'date' => $doc->date,
                    'url' => $doc->url ? Storage::url($doc->url) : null,
                ];
            })]
        );

        $submissionType = SubmissionType::EDIT->value;

        // new class
        $data = collect(compact('submission', 'principal', 'obligee', 'scoring', 'submissionType'));

        return inertia('staff/submission-management/create/index', [
            'page_settings' => fn () => [
                'title' => 'Ubah Pengajuan',
            ],
            'submission' => fn () => $data,
        ]);
    }

    private function getSubmission($id): Submission|null
    {
        return Submission::with([
            'principal' => function ($query) {
                $query->withTrashed();
            },
            'principal.documents',
            'principal.principalRatios',
            'guarantor' => function ($query) {
                $query->withTrashed();
            },
            'guarantor.documentFormats',
            'guarantorBranch' => function ($query) {
                $query->withTrashed();
            },
            'guarantorToProductType' => function ($query) {
                $query->withTrashed();
            },
            'obligee' => function ($query) {
                $query->withTrashed();
            },
            'blank' => function ($query) {
                $query->withTrashed();
            },
            'obligee.province',
            'obligee.regency',
            'obligee.district',
            'principal.province',
            'principal.regency',
            'principal.district',
            'guarantor.province',
            'guarantor.regency',
            'guarantor.district',

            'district',
            'province',
            'regency',
            'sourceOfFund' => function ($query) {
                $query->withTrashed();
            },
            'submissionDocs',
            'submissionDocs.documentFormat:id,no',
            'scores',
            'scores.scoring' => function ($query) {
                $query->withTrashed();
            },
            'scores.scoringQuestionCategory' => function ($query) {
                $query->withTrashed();
            },
            'scores.scoringQuestion' => function ($query) {
                $query->withTrashed();
            },
            'scores.scoringOption' => function ($query) {
                $query->withTrashed();
            },
            'userChecked' => function ($query) {
                $query->withTrashed();
            },
            'userApproved' => function ($query) {
                $query->withTrashed();
            },
            'userRejected' => function ($query) {
                $query->withTrashed();
            },
            'staff' => function ($query) {
                $query->withTrashed();
            },
            'employeeLimit',
            'guarantorProductTypeLimit',
            'callback',
            'supportDocs',
        ])->find($id);
    }

    /**
     * Display the specified resource.
     */
    public function revision($id): Response|RedirectResponse
    {
        $submission = $this->getSubmission($id);
        if (! $submission) {
          flashMessage('Gagal', 'Pengajuan tidak ditemukan', 'error');

          return redirect()->back();
        }
        $principal = $submission->getRelation('principal')->only([
            'id',
            'province_id',
            'regency_id',
            'district_id',
            'village',
            'name',
            'address',
            'telephone',
            'fax',
            'postal_code',
            'npwp',
            'nib',
            'siup_siujk',
            'head_name',
            'director_name',
            'director_position',
            'director_phone',
            'commissioner',
            'year_established',
            'est_deed',
            'last_deed',
            'business_fields',
        ]);

        $obligee = $submission->getRelation('obligee');

        $scoring = collect([
            'id' => $submission->getRelation('scores')->first()->scoring_id,
            'note' => $submission->getAttribute('note_scoring'),
            'scores' => $submission->getRelation('scores'),
        ]);

        $submissionArray = $submission->only([
            'guarantor_id',
            'guarantor_branch_id',
            'product_id',
            'bank_id',
            'contract_doc_name',
            'contract_doc_number',
            'contract_doc_date',
            'contract_value',
            'guarantee_value',
            'time_period',
            'difference_time_period',
            'start_date',
            'end_date',
            'job_name',
            'job_location_province_id',
            'job_location_regency_id',
            'job_location_district_id',
            'job_location_village',
            'job_location_address',
            'job_location_postal_code',
            'source_of_fund_id',
            'note',
            'risk_mitigation',
            'revised_note',
            'first_year_ratio',
            'last_year_ratio',
        ]);

        $submission = array_merge($submissionArray, [
            'submission_before_id' => (int) $id,
        ], $submission->getRelation('guarantorToProductType')->only(
            'product_type_id',
            'job_group',
            'job_type',
        ), ['support_docs' => $submission->getRelation('supportDocs')->map(function ($doc) {
            return [
                'id' => $doc->id,
                'name' => $doc->name,
                'number' => $doc->number,
                'date' => $doc->date,
                'url' => $doc->url ? Storage::url($doc->url) : null,
            ];
        })]);

        $submissionType = SubmissionType::REVISION->value;

        // new class
        $data = collect(compact('submission', 'principal', 'obligee', 'scoring', 'submissionType'));

        return inertia('staff/submission-management/create/index', [
            'page_settings' => fn () => [
                'title' => 'Revisi Pengajuan',
            ],
            'submission' => fn () => $data,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function showDetailSubmission($id): Response|RedirectResponse
    {
        $submission = $this->getSubmission($id);
        if (! $submission) {
          flashMessage('Gagal', 'Pengajuan tidak ditemukan', 'error');

          return redirect()->back();
        }
        $principal = $submission->getRelation('principal');
        $principalDocs = $principal->getRelation('documents');
        $profileId = $submission->getRelation('staff')->getAttribute('profile_id');
        $submissionConverted = $this->convertSubmission(clone $submission); // for replace document format

        // check role
        $checkRole = $this->checkRole();
        $isStaff = $checkRole['isStaff'];
        $isDireksi = $checkRole['isDireksi'];
        $isManager = $checkRole['isManager'];
        $isKepalaCabang = $checkRole['isKepalaCabang'];

        $contractValueFormatted = $this->formatCurrency($submission->getAttribute('contract_value'));
        $guaranteeValueFormatted = $this->formatCurrency($submission->getAttribute('guarantee_value'));
        $requiredDocs = RequiredDoc::query()->get(['id', 'product_type_id', 'name', 'description', 'created_at'])
            ->map(function ($doc) use ($principalDocs) {
                $principalDoc = $principalDocs->firstWhere('required_doc_id', $doc->id);
                $doc->setAttribute('name', $principalDoc?->getAttribute('name') ?? $doc->name);
                $doc->setAttribute('url', $principalDoc?->getAttribute('url') ? Storage::url($principalDoc->url) : null);

                return $doc->only(['id', 'name', 'description', 'url']);
            });

        $firstYearRatio = $submission->getAttribute('first_year_ratio');
        $lastYearRatio = $submission->getAttribute('last_year_ratio');
        $ratios = $principal->getRelation('principalRatios');
        if ($firstYearRatio && $lastYearRatio) {
            $ratios = $ratios->whereIn('year', [
                $firstYearRatio,
                $lastYearRatio,
            ]);
        }
        $principal->setAttribute('ratios', $ratios->values()->toArray());

        $submission->getRelation('scores')->map(function ($score) {
            $score->setAttribute('category_name', $score->scoringQuestionCategory->name ?? '-');
            $score->setAttribute('question_name', $score->scoringQuestion->name ?? '-');
            $score->setAttribute('option_name', $score->scoringOption->name ?? '-');

            return $score;
        });

        $principal->setAttribute('approved_submissions', $principal->approvedSubmissions()
            ->select(['id', 'contract_doc_name', 'contract_doc_number', 'contract_value', 'status', 'created_at'])
            ->with('obligee')
            ->get());

        // tanggal pengajuan
        $startDate = Carbon::parse($submission->getAttribute('start_date'))->translatedFormat('d F Y');
        $endDate = Carbon::parse($submission->getAttribute('end_date'))->translatedFormat('d F Y');

        $documentFormats = DocumentFormat::query()
            ->whereNull(['guarantor_id', 'product_id', 'guarantor_to_product_type_id'])
            ->orWhere(function ($query) use ($submission) {
                $query->where('guarantor_id', $submission->getAttribute('guarantor_id'))
                    ->where('product_id', $submission->getAttribute('product_id'))
                    ->where(function ($query) use ($submission) {
                        $query->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
                            ->orWhereNull('guarantor_to_product_type_id');
                    });
            })
            ->orderBy('no')
            ->get();
        foreach ($documentFormats as $documentFormat) {
            $documentFormat->setAttribute('format_document', $this->replaceDocumentFormat($documentFormat, $submissionConverted));
        }

        $submissionDocsFile = $submission->getRelation('submissionDocs')->whereNotNull('url')->values();
        $submissionDocs = $submission->getAttribute('has_send_to_guarantor')
          ? $submission->getRelation('submissionDocs')->whereNotNull('document_format_id')->values() : collect();
        // sort by no
        $submissionDocs = $submissionDocs->sortBy(function ($doc) {
            return $doc->getRelation('documentFormat')->getAttribute('no');
        })->values();
        $finalOutputFile = $submissionDocsFile->map(function ($doc) {
            $document = $doc->only('name', 'url');
            $document['name'] = $doc->getAttribute('name') ?? '-';
            $document['url'] = Storage::url($doc->getAttribute('url'));

            return $document;
        });

        $callback = $submission->getRelation('callback');
        if ($callback) {
            $callback->setAttribute('url', $callback->getAttribute('url')
              ? Storage::url($callback->getAttribute('url'))
              : null);
        }

        $submissionInheritId = $submission->getAttribute('submission_inherit_id');
        $employeeLimit = $submission->getRelation('employeeLimit')
            ?->firstWhere('employee_id', auth()->id())
            ?->getAttribute($submissionInheritId ? 'limit_inherit' : 'limit', 0);
        $beyondTheLimit = $employeeLimit < $submission->getAttribute('guarantee_value');

        $totalScore = $submission->getRelation('scores')->sum('point');

        // get submission support docs
        $supportDocs = $submission->getRelation('supportDocs');

        $supportDocs = $supportDocs->map(function ($doc) {
            $date = $doc->getAttribute('date');
            $url = $doc->getAttribute('url');
            $doc->setAttribute('name', $doc->getAttribute('name') ?? '-');
            $doc->setAttribute('number', $doc->getAttribute('number') ?? '-');
            $doc->setAttribute('date', $date ? Carbon::parse($date)->translatedFormat('d F Y') : null);
            if ($url) {
                $doc->setAttribute('url', Storage::url($url));
            }

            return $doc;
        });

        $blankId = $submission->getAttribute('blank_id');
        $blanks = Blank::query()
            ->where('profile_id', $profileId)
            ->where(function ($query) use ($blankId) {
                $query->where('id', $blankId)
                    ->orWhere('is_picked', false);
            })->get();

        if ($isStaff) {
            $component = 'staff/submission-management/detail/index';
        } elseif ($isDireksi) {
            $component = 'direksi/submission-management/detail/index';
        } elseif ($isManager) {
            $component = 'manager/submission-management/detail/index';
        } elseif ($isKepalaCabang) {
            $component = 'kepala-cabang/submission-management/detail/index';
        } else {
            $component = 'staff/submission-management/detail/index';
        }
        $submission->unsetRelation('submissionDocs');

        $submission->setAttribute('contract_value_formatted', $contractValueFormatted);
        $submission->setAttribute('guarantee_value_formatted', $guaranteeValueFormatted);
        $submission->setAttribute('submission_docs', $submissionDocs);
        $submission->setAttribute('required_docs', $requiredDocs);
        $submission->setAttribute('start_date', $startDate);
        $submission->setAttribute('end_date', $endDate);
        $submission->setAttribute('document_formats', $documentFormats);
        $submission->setAttribute('beyond_the_limit', $beyondTheLimit);
        $submission->setAttribute('support_docs', $supportDocs);
        $submission->setAttribute('final_output_file', $finalOutputFile);
        $submission->setAttribute('callback', $callback);
        $submission->setAttribute('employee_limit', $employeeLimit);
        $submission->setAttribute('total_score', $totalScore);

        return inertia($component, [
            'submission' => fn () => $submission,
            'blanks' => fn () => $blanks,
        ]);
    }

    // for list pengajuan masuk

    public function displaySubmission(Request $request): Response
    {
        $checkRole = $this->checkRole();
        $authId = $checkRole['authId'];
        $isStaff = $checkRole['isStaff'];
        $isDireksi = $checkRole['isDireksi'];
        $isManager = $checkRole['isManager'];
        $isKepalaCabang = $checkRole['isKepalaCabang'];
        $isKepalaAgentPartner = $checkRole['isKepalaAgentPartner'];
        $isAgentPartner = $checkRole['isAgentPartner'];
        $isMarketingPartner = $checkRole['isMarketingPartner'];

        $officeFilter = $this->filterOffice($request);
        $officeTypes = $officeFilter->officeTypes;
        $offices = $officeFilter->offices;
        $officeTypeSelected = $officeFilter->officeTypeSelected;
        $officeSelected = $officeFilter->officeSelected;

        $search = $request->input('search');

        $staffs = ! $isStaff || ! $isDireksi ? User::query()
            ->where('head_id', $authId)
            ->pluck('id') : [];

        $submissions = Submission::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->whereLike('no_guarantee', "%$search%")
                        ->orWhereHas('principal', function ($query) use ($search) {
                            $query->whereLike('name', "%$search%");
                        });
                });
            })
            ->where('guarantor_id', $this->guarantorId)
            ->where('product_id', $this->productId)
            ->when(
                $isDireksi,
                fn ($query) => $query
                    ->whereNotNull('checked_by')
                    ->where('status', SubmissionStatus::PROCESS->value)
                    ->whereHas('userChecked.role', fn ($query) => $query->where('name', RoleEnum::Manager->value))
            )
            ->when(
                $isManager,
                fn ($query) => $query
                    ->where(function ($query) use ($staffs) {
                        $query->whereIn('staff_id', $staffs)
                            ->orWhereIn('checked_by', $staffs);
                    })
                    ->whereNull(['approved_by', 'rejected_by'])
                //  ->where(fn ($query) => $query
                //      ->whereNull('checked_by')
                //      ->orWhereHas('userChecked.role', fn ($query) => $query->where('name', RoleEnum::KepalaCabang->value))
                //  )
            )
            ->when(
                $isKepalaCabang,
                fn ($query) => $query
                    ->whereIn('staff_id', $staffs)
                    ->whereNull(['approved_by', 'rejected_by'])
                    ->where(function ($query) use ($authId) {
                        $query->whereNull('checked_by')
                            ->orWhere('checked_by', $authId);
                    })
            )
            ->when($isKepalaAgentPartner, fn ($query) => $query->whereIn('staff_id', $staffs))
            ->when(
                $officeSelected,
                fn ($query) => $query
                    ->whereHas('staff', fn ($query) => $query->where('profile_id', $officeSelected))
            )
            ->with([
                'scores',
                'principal',
                'bank',
                'obligee',
                'sourceOfFund',
                'guarantor',
                'guarantorToProductType',
                'employeeLimit',
                'guarantorProductTypeLimit',
                'staff:id,name,profile_id',
                'office:id,name',
            ])
            ->orderByDesc('updated_at')
            ->paginate($request->get('per_page') ?? 10)
            ->withQueryString();

        $submissions = SubmissionResource::collection($submissions);

        if ($isStaff) {
            $component = 'staff/submission-management/list/index';
        } elseif ($isDireksi) {
            $component = 'direksi/submission-management/list/index';
        } elseif ($isManager) {
            $component = 'manager/submission-management/list/index';
        } elseif ($isKepalaCabang) {
            $component = 'kepala-cabang/submission-management/list/index';
        } elseif ($isKepalaAgentPartner) {
            $component = 'kepala-agent-partner/submission-management/list/index';
        } elseif ($isAgentPartner) {
            $component = 'agent-partner/submission-management/list/index';
        } elseif ($isMarketingPartner) {
            $component = 'marketing-partner/submission-management/list/index';
        } else {
            $component = 'staff/submission-management/list/index';
        }

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'List Pengajuan Masuk',
            ],
            'submissions' => fn () => $submissions,
            'officeTypes' => $officeTypes,
            'offices' => $offices,
            'officeTypeSelected' => $officeTypeSelected,
            'officeSelected' => $officeSelected,
        ]);
    }

    // for history pengajuan
    public function displayHistory(Request $request): Response
    {
        $checkRole = $this->checkRole();
        $authId = $checkRole['authId'];
        $isStaff = $checkRole['isStaff'];
        $isDireksi = $checkRole['isDireksi'];
        $isManager = $checkRole['isManager'];
        $isKepalaCabang = $checkRole['isKepalaCabang'];
        $isKepalaAgentPartner = $checkRole['isKepalaAgentPartner'];
        $isAgentPartner = $checkRole['isAgentPartner'];
        $isMarketingPartner = $checkRole['isMarketingPartner'];
        $staffs = User::query()
            ->where('head_id', $authId)
            ->pluck('id');

        $officeFilter = $this->filterOffice($request);
        $officeTypes = $officeFilter->officeTypes;
        $offices = $officeFilter->offices;
        $officeTypeSelected = $officeFilter->officeTypeSelected;
        $officeSelected = $officeFilter->officeSelected;
        $status = SubmissionStatus::getValues();
        $statusSelected = $request['status_selected'] ?? null;
        $search = $request->get('search');

        $submissions = Submission::query()
            ->where('guarantor_id', $this->guarantorId)
            ->where('product_id', $this->productId)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->whereLike('no_guarantee', "%$search%")
                        ->orWhereHas('principal', function ($query) use ($search) {
                            $query->whereLike('name', "%$search%");
                        });
                });
            })
            ->when($isStaff, fn ($query) => $query->where('staff_id', $authId))
            ->when($isDireksi, function ($query) {
                $query->whereNot('status', SubmissionStatus::PROCESS->value);
            })
            ->when(
                $isManager || $isKepalaCabang,
                fn ($query) => $query->where(function ($query) use ($staffs, $authId) {
                    $query->whereIn('staff_id', $staffs)
                        ->orWhere('checked_by', $authId);
                })->whereNotNull('checked_by')
            )
            ->when($officeSelected && ! $isStaff, fn ($query) => $query->whereHas('staff', fn ($query) => $query->where('profile_id', $officeSelected)))
            ->when($statusSelected, fn ($query) => $query->where('status', $statusSelected))
            ->with([
                'scores',
                'principal',
                'bank',
                'obligee',
                'employeeLimit',
                'sourceOfFund',
                'guarantor',
                'guarantorToProductType',
                'guarantorProductTypeLimit',
                'staff:id,name,profile_id',
                'office:id,name',
            ])
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page') ?? 10)
            ->withQueryString();
        $resource = SubmissionResource::collection($submissions);

        if ($isStaff) {
            $component = 'staff/submission-management/history/index';
        } elseif ($isDireksi) {
            $component = 'direksi/submission-management/history/index';
        } elseif ($isManager) {
            $component = 'manager/submission-management/history/index';
        } elseif ($isKepalaCabang) {
            $component = 'kepala-cabang/submission-management/history/index';
        } elseif ($isKepalaAgentPartner) {
            $component = 'kepala-agent-partner/submission-management/history/index';
        } elseif ($isAgentPartner) {
            $component = 'agent-partner/submission-management/history/index';
        } elseif ($isMarketingPartner) {
            $component = 'marketing-partner/submission-management/history/index';
        } else {
            $component = 'staff/submission-management/history/index';
        }

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Riwayat Pengajuan',
            ],
            'submissions' => fn () => $resource,
            'officeTypes' => $officeTypes,
            'offices' => $offices,
            'officeTypeSelected' => $officeTypeSelected,
            'officeSelected' => $officeSelected,
            'status' => $status,
            'statusSelected' => $statusSelected,
        ]);
    }

    public function approve(Submission $submission): void
    {
        DB::beginTransaction();
        try {
            $dateNow = now()->format('Y-m-d H:i:s');

            $checkedBy = $submission->getAttribute('checked_by');
            $checkedAt = $submission->getAttribute('checked_at');
            $updated = $submission->update([
                'checked_by' => $checkedBy ?? auth()->id(),
                'checked_at' => $checkedAt ?? $dateNow,
                'approved_by' => auth()->id(),
                'approved_at' => $dateNow,
                'status' => SubmissionStatus::APPROVED->value,
            ]);

            if (! $updated) {
                throw new Exception('Failed to approve submission');
            }
            $submission->blank()->update(['is_used' => true]);
            Log::info('Submission approved', ['submission_id' => $submission->getAttribute('id')]);
            flashMessage('success', 'Berhasil menyetujui pengajuan');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to approve submission', $error);
            flashMessage('error', 'Terjadi kesalahan saat menyetujui pengajuan', 'error');
        }
    }

    public function broken(Submission $submission): void
    {
        DB::beginTransaction();
        try {
            $submission->load(['guarantor.hostToHost', 'submissionCallback']);
            $guarantor = $submission->getRelation('guarantor');
            $hostToHost = $guarantor->getRelation('hostToHost');
            if (! $hostToHost) {
                throw new Exception('Host to host not found for guarantor');
            }
            $url = $hostToHost->getAttribute('guarantor_url_host').'';
            $prefix = $hostToHost->getAttribute('auth_prefix');
            $token = ($prefix ? $prefix.' ' : '').$hostToHost->getAttribute('token');
            $submissionCallback = $submission->getRelation('submissionCallback');
            $data = [
                'submission_id' => $submission->getAttribute('id'),
                'no_policy' => $submissionCallback->getAttribute('no_policy'),
            ];
            $final = $this->hostToHostService->sendPostRequest($url, $token, $data);
            if ($final['status'] != 'success') {
                throw new Exception('Gagal mengajukan pengajuan rusak ke pihak asuransi: '.$final['message']);
            }
            $submission->update(['status' => SubmissionStatus::BROKEN->value]);
            $submission->blank()->update(['is_broken' => true]);
            DB::commit();
            flashMessage('success', 'Berhasil menandai pengajuan sebagai broken');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to mark submission as broken', ['error' => $e->getMessage()]);
            flashMessage('error', 'Terjadi kesalahan saat menandai pengajuan sebagai broken', 'error');
        }
    }

    private function processRejection(Submission $submission): bool
    {
        $dateNow = now()->format('Y-m-d H:i:s');

        $checkedBy = $submission->getAttribute('checked_by');
        $checkedAt = $submission->getAttribute('checked_at');
        $submission->load(['staff']);
        $staff = $submission->getRelation('staff');
        $headId = $staff->getAttribute('head_id');
        $submission->blank()->update([
            'is_picked' => false,
            'is_used' => false,
            'is_broken' => false,
            'is_revised' => false,
            'is_approved' => false,
        ]);

        return $submission->update([
            'checked_by' => $headId ?? $checkedBy ?? auth()->id(),
            'checked_at' => $checkedAt ?? $dateNow,
            'rejected_by' => $headId ?? auth()->id(),
            'rejected_at' => $dateNow,
            'status' => SubmissionStatus::REJECTED->value,
        ]);
    }

    public function reject(Submission $submission): void
    {
        DB::beginTransaction();
        try {
            $updated = $this->processRejection($submission);

            if (! $updated) {
                DB::rollBack();
                flashMessage('error', 'Gagal menolak pengajuan', 'error');
            } else {
                DB::commit();
                flashMessage('success', 'Berhasil menolak pengajuan');
            }
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to reject submission', $error);
            flashMessage('error', 'Terjadi kesalahan saat menolak pengajuan', 'error');
        }
    }

    public function check(Request $request, Submission $submission): void
    {
        DB::beginTransaction();
        try {
            $dateNow = now()->format('Y-m-d H:i:s');
            $updated = $submission->update([
                'checked_by' => auth()->id(),
                'checked_at' => $dateNow,
            ]);

            if (! $updated) {
                DB::rollBack();
                flashMessage('error', 'Gagal kirim ke direksi pengajuan', 'error');
            } else {
                $documents = $request->input('documents', []);
                $submission->submissionDocs()->whereNotNull('document_format_id')->delete();
                $docData = collect($documents)->map(fn ($doc) => [
                    'document_format_id' => $doc['id'] ?? null,
                    'name' => $doc['name'] ?? null,
                    'format_document' => $doc['content'],
                    'url' => $doc['url'] ?? null,
                ])->toArray();
                $submission->submissionDocs()->createMany($docData);

                DB::commit();
                flashMessage('success', 'Berhasil kirim ke direksi pengajuan');
            }
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('error', 'Terjadi kesalahan saat mengirim ke direksi pengajuan', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to check submission', $error);
        }
    }

    public function embedQrCodeToDocs(Submission $submission): void
    {
        $submission->load([
            'callback',
            'guarantorToProductType',
            'submissionDocs.documentFormat.guarantorToProductType',
        ]);

        $callback = $submission->getRelation('callback');
        $qrUrl = $callback && $callback->url ? Storage::url($callback->url) : null;

        $guarantorType = $submission->getRelation('guarantorToProductType');
        $targetTypeId = $guarantorType ? $guarantorType->id : null;

        $docs = $submission->getRelation('submissionDocs');

        $matchingDocs = collect($docs)->filter(function ($doc) use ($targetTypeId) {
            $guarantorToProductType = $doc->getRelation('documentFormat')?->getRelation('guarantorToProductType');

            return $guarantorToProductType && $guarantorToProductType->id === $targetTypeId;
        });

        Log::debug("qr : $qrUrl");

        if ($matchingDocs->isEmpty()) {
            Log::info("Tidak ada dokumen yang cocok untuk embedding QR, submission ID: {$submission->getAttribute('id')}");

            return;
        }

        $embedded = false;

        foreach ($matchingDocs as $doc) {
            $html = $doc->format_document ?? '';

            $qrHtml = '<div style="margin-top:40px;text-align:center;">';
            $qrHtml .= '<img src="'.e($qrUrl).'" alt="QR Code" style="width:100px;height:100px;"><br>';
            $qrHtml .= '<small>Scan untuk verifikasi dokumen ini</small>';
            $qrHtml .= '</div>';

            if (str_contains($html, '</body>')) {
                $html = str_replace('</body>', $qrHtml.'</body>', $html);
            } else {
                $html .= $qrHtml;
            }

            $doc->format_document = $html;
            $doc->save();
            $embedded = true;

            Log::info("QR code embedded ke doc ID: $doc->id");
        }

        if ($embedded) {
            if ($submission->getAttribute('is_added_qrcode') != 1) {
                Log::info("is_added_qrcode diset ke 1 di submissions ID: {$submission->getAttribute('id')}");
                $submission->setAttribute('is_added_qrcode', 1);
                $submission->save();
            }
        }
    }

    public function destroy(Submission $submission): void
    {
        DB::beginTransaction();
        try {
            $submission->scores()->delete();
            $submission->submissionDocs()->delete();
            $submission->supportDocs()->delete();
            $submission->callback()->delete();
            $submission->blank()->update([
                'is_picked' => false,
                'is_used' => false,
                'is_broken' => false,
                'is_revised' => false,
            ]);
            $submission->submissionBefore()->update([
                'status' => SubmissionStatus::APPROVED->value,
            ]);
            $submission->delete();
            DB::commit();
            flashMessage('success', 'Berhasil membatalkan pengajuan');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to delete submission', $error);
            flashMessage('error', 'Terjadi kesalahan saat membatalkan pengajuan', 'error');
        }
    }

    public function updatePublication(Request $request): void
    {
        // dd($request->all());
        $request->validate([
            'submission_id' => 'required|exists:submissions,id',
            'publication_date' => 'required|date',
            'publication_place' => 'required|string|max:255',
        ]);
        DB::beginTransaction();

        try {
            $submissionId = $request->get('submission_id');
            $publicationDate = $request->get('publication_date');
            $publicationPlace = $request->get('publication_place');
            $submission = Submission::query()->with('submissionDocs')->find($submissionId);

            $submission->update([
                'publication_date' => $publicationDate,
                'publication_place' => $publicationPlace,
            ]);

            $submissionDocs = $submission->getRelation('submissionDocs')
                ->whereNotNull('document_format_id');

            foreach ($submissionDocs as $doc) {
                $content = $doc->format_document;

                if (str_contains($content, '[PUBLICATION_DATE]') && $publicationDate) {
                    $formattedDate = Carbon::parse($publicationDate)->translatedFormat('d F Y');
                    $content = str_replace('[PUBLICATION_DATE]', $formattedDate, $content);
                }

                if (str_contains($content, '[PUBLICATION_PLACE]') && $publicationPlace) {
                    $content = str_replace('[PUBLICATION_PLACE]', $publicationPlace, $content);
                }

                $doc->update([
                    'format_document' => $content,
                ]);
            }

            DB::commit();

            flashMessage('success', 'Berhasil memperbarui data publikasi pengajuan');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to delete submission', $error);
            flashMessage('error', 'Terjadi kesalahan saat mengupdate data', 'error');
        }
    }
}
