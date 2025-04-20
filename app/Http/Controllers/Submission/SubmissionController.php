<?php

namespace App\Http\Controllers\Submission;

use App\Enums\RoleEnum;
use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Submission\StoreRequest;
use App\Http\Resources\Submission\SubmissionResource;
use App\Models\Document\DocumentFormat;
use App\Models\Document\RequiredDoc;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\ProfileLimit;
use App\Models\Product\Product;
use App\Models\Profile\Profile;
use App\Models\RelatedParties\Obligee;
use App\Models\RelatedParties\Principal;
use App\Models\Scoring\Scoring;
use App\Models\Submission\Submission;
use App\Models\Submission\SubmissionBlank;
use App\Models\Submission\SubmissionCallback;
use App\Models\Submission\SubmissionDoc;
use App\Models\User;
use App\Services\HostToHostService;
use App\Traits\FilterOffice;
use App\Traits\GeneratePattern;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Riskihajar\Terbilang\Facades\Terbilang;
use Symfony\Component\HttpFoundation\JsonResponse;

class SubmissionController extends Controller
{
    use FilterOffice, GeneratePattern;

    protected HostToHostService $hostToHostService;

    protected int $guarantorId;

    public function __construct(
        HostToHostService $hostToHostService
    ) {
        Carbon::setLocale('id');
        $this->hostToHostService = $hostToHostService;
        $this->guarantorId = config('guarantor.id');
    }

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
                    ->when($guarantorSelected !== null, function ($query) use ($guarantorSelected) {
                        $query->where('guarantor_id', $guarantorSelected);
                    })
                    ->when($productSelected !== null, function ($query) use ($productSelected) {
                        $query->where('product_id', $productSelected);
                    })
                    ->when($guarantorToProductType !== null, function ($query) use ($guarantorToProductType) {
                        $query->where('guarantor_to_product_type_id', $guarantorToProductType->id);
                    })
                    ->with([
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
                        'submissionBefore:id,no_guarantee',
                        'submissionBefore.blanks',
                    ]);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $resource = SubmissionResource::collection($submissions);
        $component = 'admin/submission-management/list/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Daftar Pengajuan',
            ],
            'submissions' => fn () => $resource,
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
    public function store(StoreRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $principal = $validated['principal'];
            $principalId = $principal['id'];
            $principalRatios = $principal['ratios'];
            $principalRatios = collect($principalRatios)->map(function ($ratio) {
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
            $scoring = $validated['scoring'];
            $isEdit = $submission['is_edit'] ?? false;

            // get user staff
            $staff = auth()->user();
            $profile = Profile::query()
                ->find($staff->profile_id);

            // get blanks
            $blank = Blank::query()
                ->where('is_picked', false)
                ->firstWhere('id', $submission['blank_id']);
            if (! $blank) {
                throw new Exception('Blangko Sudah Digunakan');
            }
            $blank->update(['is_picked' => true]);

            $principal = Principal::query()->firstWhere('id', $principalId);
            // create principal ratios
            foreach ($principalRatios as $principalRatio) {
                $principal->principalRatios()
                    ->updateOrCreate([
                        'year' => $principalRatio['year'],
                    ], $principalRatio);
            }

            // create or update obligee
            $obligee = Obligee::query()
                ->updateOrCreate([
                    'id' => $obligee['id'] ?? null,
                ], $obligee);

            // generate no guarantee
            $guarantorHead = Guarantor::query()
                ->with(['pattern', 'branch'])
                ->find($submission['guarantor_id']);

            $guarantorBranchId = $submission['guarantor_branch_id'];
            $guarantorToProductType = $guarantorHead->guarantorToProductTypes()
                ->where('product_id', $submission['product_id'])
                ->where('product_type_id', $submission['product_type_id'])
                ->where('job_group', $submission['job_group'])
                ->where('job_type', $submission['job_type'])
                ->first();

            // prepare create submission
            $dataSubmission = collect($submission)->toArray();
            $submissionId = $dataSubmission['id'] ?? null;

            $submissionOld = Submission::query()->select(['id', 'no_guarantee'])->find($submissionId);
            if ($submissionOld) {
                $noGuarantee = $submissionOld->getAttribute('no_guarantee');
                if ($isEdit) {
                    $messageResponse = 'Berhasil memperbarui pengajuan';
                } else {
                    $submissionOld->update(['is_revised' => true]);
                    $submissionOld->blanks()->update(['is_revised' => true]);
                    $messageResponse = 'Berhasil merevisi pengajuan';
                }
            } else {
                $noGuarantee = $this->generateNoGuarantee(
                    $guarantorHead,
                    $guarantorToProductType,
                    $guarantorBranchId,
                    $blank,
                    $profile);
                $messageResponse = 'Berhasil membuat pengajuan';
            }
            $dataSubmission['submission_before_id'] = $submissionId;
            $dataSubmission['no_guarantee'] = $noGuarantee;

            $dataSubmission['guarantor_to_product_type_id'] = $guarantorToProductType->id;
            $dataSubmission['principal_id'] = $principalId;
            $dataSubmission['staff_id'] = auth()->id();
            $dataSubmission['obligee_id'] = $obligee->getAttribute('id');
            $dataSubmission['note_scoring'] = $scoring['note'];
            $modelScoring = Scoring::query()->find($scoring['id']);
            $dataSubmission['min_point_scoring'] = $modelScoring?->min_point;
            $dataSubmission['contract_doc_date'] = $submission['contract_doc_date'] ? Carbon::parse($submission['contract_doc_date'])->format('Y-m-d') : null;
            $dataSubmission['start_date'] = $submission['start_date'] ? Carbon::parse($submission['start_date'])->format('Y-m-d H:i:s') : null;
            $dataSubmission['end_date'] = $submission['end_date'] ? Carbon::parse($submission['end_date'])->format('Y-m-d H:i:s') : null;
            $dataSubmission['contract_value'] = $this->currencyConvert($submission['contract_value']);
            $dataSubmission['guarantee_value'] = $this->currencyConvert($submission['guarantee_value']);
            $scores = $scoring['scores'];

            if ($isEdit) {
                $submission = $submissionOld->load(['scores']);
                $submissionOld->scores()->delete();
                $submissionOld->update($dataSubmission);
            } else {
                $submission = Submission::query()->with(['blanks', 'scores'])->create($dataSubmission);
            }

            // update or create submission blangko
            SubmissionBlank::query()->updateOrCreate([
                'submission_id' => $submission->getAttribute('id'),
                'blank_id' => $blank->id,
            ]);

            // create submission scoring
            foreach ($scores as &$score) {
                $score['scoring_id'] = $scoring['id'];
            }

            $submission->scores()->createMany($scores);
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
     * Display the specified resource.
     */
    public function edit($id)
    {
        $submission = $this->getSubmission($id);
        if ($submission->status !== SubmissionStatus::PROCESS->value) {
            flashMessage('Gagal', 'Pengajuan tidak dapat diubah', 'error');

            return redirect()->back();
        }
        $principal = $submission->principal->only([
            'id', 'province_id', 'regency_id', 'district_id', 'village', 'name', 'address', 'telephone',
            'fax', 'postal_code', 'npwp', 'nib', 'siup_siujk', 'head_name', 'director_name', 'director_position',
            'director_phone', 'commissioner', 'year_established', 'est_deed', 'last_deed', 'business_fields',
        ]);
        $principalRatios = $submission->principal->principalRatios->toArray() ?? [];
        $principal = collect(array_merge($principal, [
            'ratios' => $principalRatios,
        ]));

        $obligee = $submission->obligee;

        $scoring = collect([
            'id' => $submission->scores->first()->scoring_id,
            'note' => $submission->note_scoring,
            'scores' => $submission->scores,
        ]);

        $submissionArray = $submission->only(['id', 'guarantor_id', 'guarantor_branch_id', 'product_id',
            'bank_id', 'contract_doc_name',
            'contract_doc_number', 'contract_doc_date', 'contract_value', 'guarantee_value',
            'time_period', 'start_date', 'end_date', 'job_name', 'job_location_province_id',
            'job_location_regency_id', 'job_location_district_id', 'job_location_village',
            'job_location_address', 'job_location_postal_code', 'source_of_fund_id',
            'note', 'risk_mitigation',
        ]);

        $submission = array_merge($submissionArray,
            $submission->guarantorToProductType->only(
                'product_type_id', 'job_group', 'job_type',
            ), ['is_edit' => true, 'blank_id' => $submission->blanks->first()?->id]);

        // new class
        $data = collect(compact('submission', 'principal', 'principalRatios', 'obligee', 'scoring'));

        return inertia('staff/submission-management/create/index', [
            'page_settings' => fn () => [
                'title' => 'Ubah Pengajuan',
            ],
            'submission' => fn () => $data,
        ]);
    }

    private function getSubmission($id): Submission
    {
        return Submission::with([
            'principal' => function ($query) {
                $query->withTrashed();
            },
            'principal.documents' => function ($query) {
                $query->withTrashed();
            },
            'principal.principalRatios' => function ($query) {
                $query->withTrashed();
            },
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
            'blanks',
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
        ])->findOrFail($id);
    }

    /**
     * Display the specified resource.
     */
    public function revision($id)
    {
        $submission = $this->getSubmission($id);
        $principal = $submission->getRelation('principal')->only([
            'id', 'province_id', 'regency_id', 'district_id', 'village', 'name', 'address', 'telephone',
            'fax', 'postal_code', 'npwp', 'nib', 'siup_siujk', 'head_name', 'director_name', 'director_position',
            'director_phone', 'commissioner', 'year_established', 'est_deed', 'last_deed', 'business_fields',
        ]);
        $principalRatios = $submission->getRelation('principal')->principalRatios->toArray() ?? [];
        $principal = collect(array_merge($principal, [
            'ratios' => $principalRatios,
        ]));

        $obligee = $submission->getRelation('obligee');

        $scoring = collect([
            'id' => $submission->getRelation('scores')->first()->scoring_id,
            'note' => $submission->getAttribute('note_scoring'),
            'scores' => $submission->getRelation('scores'),
        ]);

        $submissionArray = $submission->only(['id', 'guarantor_id', 'guarantor_branch_id', 'product_id',
            'bank_id', 'contract_doc_name',
            'contract_doc_number', 'contract_doc_date', 'contract_value', 'guarantee_value',
            'time_period', 'start_date', 'end_date', 'job_name', 'job_location_province_id',
            'job_location_regency_id', 'job_location_district_id', 'job_location_village',
            'job_location_address', 'job_location_postal_code', 'source_of_fund_id',
            'note', 'risk_mitigation',
        ]);

        $submission = array_merge($submissionArray,
            $submission->getRelation('guarantorToProductType')->only(
                'product_type_id', 'job_group', 'job_type',
            ));

        // new class
        $data = collect(compact('submission', 'principal', 'principalRatios', 'obligee', 'scoring'));

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
    public function showDetailSubmission($id)
    {
        $submission = $this->getSubmission($id);
        $mailNumber = $this->generateNomorSurat($id);
        $principal = $submission->getRelation('principal');
        $principalDocs = collect($principal->getRelation('documents'));
        $blank = $submission->getRelation('blanks')->first();

        $requiredDocs = RequiredDoc::query()->get(['id', 'product_type_id', 'name', 'description', 'created_at'])
            ->map(fn ($doc) => $doc->fill([
                'name' => $principalDocs->firstWhere('required_doc_id', $doc->id)?->name ?? $doc->name,
                'url' => $principalDocs->firstWhere('required_doc_id', $doc->id)?->url ? Storage::url($principalDocs->firstWhere('required_doc_id', $doc->id)->url) : null,
            ]));

        $ratios = collect($principal->getRelation('principalRatios'))->take(2);
        $principal->setAttribute('ratios', $ratios);

        $contractValueFormatted = $this->formatCurrency($submission->getAttribute('contract_value'));
        $guaranteeValueFormatted = $this->formatCurrency($submission->getAttribute('guarantee_value'));
        $analystName = $submission->getRelation('staff')->getAttribute('name');

        $submission->getRelation('scores')->map(function ($score) {
            $score->category_name = $score->scoringQuestionCategory->name ?? '-';
            $score->question_name = $score->scoringQuestion->name ?? '-';
            $score->option_name = $score->scoringOption->name ?? '-';

            return $score;
        });

        // SCORING RESULT
        $analysis = ['character' => 0, 'capacity' => 0, 'capital' => 0, 'condition' => 0, 'collateral' => 0];

        $scoringResult = $submission->getRelation('scores')
            ->reduce(function ($grouped, $score) use (&$analysis) {
                $categoryId = $score->getAttribute('scoring_question_category_id');
                $category = $score->getRelation('scoringQuestionCategory');
                $categoryName = $category->getAttribute('name');

                if (! isset($grouped[$categoryId])) {
                    $grouped[$categoryId] = [
                        'id' => $categoryId,
                        'name' => $categoryName,
                        'items' => [],
                    ];
                }

                $grouped[$categoryId]['items'][] = $score;
                $point = $score->getAttribute('point') ?? 0;

                switch ($categoryName) {
                    case 'Character':
                        $analysis['character'] += $point;
                        break;
                    case 'Capacity':
                        $analysis['capacity'] += $point;
                        break;
                    case 'Capital':
                        $analysis['capital'] += $point;
                        break;
                    case 'Condition':
                        $analysis['condition'] += $point;
                        break;
                    case 'Collateral':
                        $analysis['collateral'] += $point;
                        break;
                }

                return $grouped;
            }, []);

        $guaranteeValue = $submission->getAttribute('guarantee_value');
        $terbilang = $guaranteeValue ? ucwords(Terbilang::make($guaranteeValue, ' Rupiah')) : '';

        // Hitung total skoring
        $totalScore = array_sum($analysis);

        // Tentukan notes dan recommendation
        if ($totalScore > 60 && $totalScore < 100) {
            $notes = 'Dipertimbangkan untuk disetujui';
            $recommendation = 'disetujui';
        } elseif ($totalScore <= 60) {
            $notes = 'Dipertimbangkan untuk ditambahkan mitigasi risiko';
            $recommendation = 'ditolak';
        } else {
            $notes = 'Skoring tidak valid';
            $recommendation = 'ditolak';
        }

        // GET EXPERIENCE
        $approvedSubmissionsExp = Submission::query()
            ->where('status', 'approved')
            ->where(function ($query) use ($submission) {
                $query->where('principal_id', $submission->getAttribute('principal_id'))
                    ->orWhere('obligee_id', $submission->getAttribute('obligee_id'));
            })
            ->with(['obligee'])
            ->get()
            ->map(function ($submission) use (&$index) {
                $index++;

                return "<tr style='text-align: left;'>
                            <td style='text-align: center;'>{$index}</td>
                            <td>{$submission->getRelation('obligee')->getAttribute('name')}</td>
                            <td>{$submission->getAttribute('job_name')}</td>
                            <td>Rp. ".number_format($submission->getAttribute('contract_value'), 0, ',', '.').'</td>
                            <td>'.date('Y', strtotime($submission->getAttribute('approved_at'))).'</td>
                        </tr>';
            })->implode('');

        $getExp = "
            <table style='width: 100%; border-collapse: collapse; text-align: center;' border='1'>
                <tr>
                    <td colspan='5' style='border-left: 1px solid black; border-right: 1px solid black; text-align: center;'>
                        <strong>PENGALAMAN KERJA</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan='5' style='text-align:left'>
                        <strong>Berikut Pengalaman Kerja PT {$principal->getAttribute('name')}</strong>
                    </td>
                </tr>
                <tr>
                    <th>No</th>
                    <th>Obligee</th>
                    <th>Nama Proyek</th>
                    <th>Nilai Proyek</th>
                    <th>Tahun</th>
                </tr>
                {$approvedSubmissionsExp}
            </table>
        ";

        // GET SUSUNAN PENGURUS

        $pengurus = collect();

        if (! empty($principal->getAttribute('director_name'))) {
            $pengurus->push(['nama' => $principal->getAttribute('director_name'), 'jabatan' => 'Direktur']);
        }
        if (! empty($principal->commissioner)) {
            $pengurus->push(['nama' => $principal->getAttribute('commissioner'), 'jabatan' => 'Komisaris']);
        }

        if (! empty($principal->head_name)) {
            $pengurus->push(['nama' => $principal->getAttribute('head_name'), 'jabatan' => 'Kepala Cabang']);
        }

        $susunanPengurus = $pengurus->map(function ($pengurus, $index) {
            return "<tr>
                        <td style='text-align: center; vertical-align: middle;'>".($index + 1)."</td>
                        <td>{$pengurus['nama']}</td>
                        <td>{$pengurus['jabatan']}</td>
                    </tr>";
        })->implode('');

        $getAdministatorsPrincipal = "
            <table style='width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px;' border='1'>
                <tr>
                    <td colspan='3' style='text-align: center'><strong>SUSUNAN PENGURUS</strong></td>
                </tr>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Jabatan</th>
                </tr>
                {$susunanPengurus}
            </table>
        ";

        $principal->setAttribute('approved_submissions', $principal->approvedSubmissions()
            ->select(['id', 'contract_doc_name', 'contract_doc_number', 'contract_value', 'status', 'created_at'])
            ->with('obligee')
            ->get());

        // number surat
        $mailNumberResume = $this->generateNomorSuratResume($submission->getAttribute('id'), $submission->getAttribute('created_at'));
        // tanggal pengajuan
        $submissionDate = Carbon::parse($submission->getAttribute('created_at'))->translatedFormat('d F Y');

        $startDate = Carbon::parse($submission->getAttribute('start_date'))->translatedFormat('d F Y');
        $endDate = Carbon::parse($submission->getAttribute('end_date'))->translatedFormat('d F Y');
        $guaranteeIssueDate = Carbon::parse($submission->getAttribute('approved_at'))->translatedFormat('d F Y');
        $contractDocDate = Carbon::parse($submission->getAttribute('contract_doc_date'))->translatedFormat('d F Y');
        $dayName = Carbon::parse($submission->getAttribute('approved_at'))->translatedFormat('l');

        $documentFormatAnalysis = DocumentFormat::query()
            ->whereNull('guarantor_id')
            ->whereNull('product_id')
            ->whereNull('guarantor_to_product_type_id')
            ->first();
        $guarantor = $submission->getRelation('guarantor');
        $guarantorBranch = $submission->getRelation('guarantorBranch');
        $documentFormats = $guarantor->getRelation('documentFormats');
        $documentFormatGuarantor = $documentFormats->whereNull('product_id')->whereNull('guarantor_to_product_type_id')->values();
        $documentFormatProduct = $documentFormats->where('product_id', $submission->getAttribute('product_id'))->whereNull('guarantor_to_product_type_id')->values();
        $documentFormatTypeGuarantor = $documentFormats->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))->values();
        $guarantorAddress = $guarantorBranch->getAttribute('address') ?? $guarantor->getAttribute('address') ?? '';

        // get submission pic
        $guarantorPic = $guarantorBranch->getAttribute('pic') ?? $guarantor->getAttribute('pic');

        $callbackRelation = $submission->getRelation('callback');
        if ($callbackRelation) {
            $callback = collect([
                'id' => $callbackRelation->getAttribute('id'),
                'doc_url' => $callbackRelation->getAttribute('doc_url'),
                // 'url' => Storage::url($submission->getAttribute('url')),
                $urlPath = $submission->getAttribute('url');
                'url' => $urlPath ? Storage::url($urlPath) : null,
            ]);
            $submission->setAttribute('callback', $callback);
        }

        $submission->setRawAttributes([
            ...$submission->attributesToArray(),
            ...$submission->relationsToArray(),
            'mail_number' => $mailNumber,
            'blank' => $blank,
            'required_docs' => $requiredDocs,
            'contract_value_formatted' => $contractValueFormatted,
            'guarantee_value_formatted' => $guaranteeValueFormatted,
            'analyst_name' => $analystName,
            'scoring_result' => $scoringResult,
            'analysis' => $analysis,
            'terbilang' => $terbilang,
            // submission
            'notes' => $notes,
            'recommendation' => $recommendation,
            'total_score' => $totalScore,
            'get_exp' => $getExp,
            'get_administators_principal' => $getAdministatorsPrincipal,
            'mail_number_resume' => $mailNumberResume,
            'submission_date' => $submissionDate,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'guarantee_issue_date' => $guaranteeIssueDate,
            'contract_doc_date' => $contractDocDate,
            'day_name' => $dayName,
            'document_format_analysis' => $documentFormatAnalysis,
            'document_format_guarantor' => $documentFormatGuarantor,
            'document_format_product' => $documentFormatProduct,
            'document_format_type_guarantee' => $documentFormatTypeGuarantor,
            'guarantor_address' => $guarantorAddress,
            'guarantor_pic' => $guarantorPic,
        ]);

        $submission->submission_callback = $submission->getRelation('callback');


        // check role
        $checkRole = $this->checkRole();
        $isStaff = $checkRole['isStaff'];
        $isDireksi = $checkRole['isDireksi'];
        $isManager = $checkRole['isManager'];
        $isKepalaCabang = $checkRole['isKepalaCabang'];

        if ($isStaff) {
            $component = 'staff/submission-management/history/detail/index';
        } elseif ($isDireksi) {
            $component = 'direksi/submission-management/history/detail/index';
            // GET DOC
            $submissionDocs = $submission->getRelation('submissionDocs')
                ->map(function ($docSig) {
                    $url = $docSig->getAttribute('url');
                    if ($url) {
                        $docSig->setAttribute('url', Storage::url($url));
                    }

                    return $docSig;
                });

            $submission->setAttribute('submission_docs', $submissionDocs);
        } elseif ($isManager) {
            $component = 'manager/submission-management/detail/index';
        } elseif ($isKepalaCabang) {
            $component = 'kepala-cabang/submission-management/detail/index';
        } else {
            $component = 'staff/submission-management/history/detail/index';
        }

        return inertia($component, [
            'submission' => fn () => $submission,
        ]);
    }

    public function generateNomorSurat($submissionId)
    {
        $submission = Submission::find($submissionId);

        if (! $submission) {
            return null;
        }

        $submissionId = $submission->id;
        $guarantorCode = $submission->guarantor->code;
        $createdAt = Carbon::parse($submission->created_at)->format('Y'); // Format tanggal YYYMMDD

        return strtoupper("{$guarantorCode}/{$submissionId}/{$createdAt}");
    }

    private function formatCurrency($value): string
    {
        return 'Rp. '.number_format($value, 2, ',', '.');
    }

    private function generateNomorSuratResume($id, $createdAt): string
    {
        return "{$id}/BPR/".Carbon::parse($createdAt)->format('m/Y');
    }

    private function checkRole(): array
    {
        // check role
        $authId = auth()->id();
        $user = User::query()->find($authId);
        $isStaff = $user->hasRole(RoleEnum::Staff->value);
        $isDireksi = $user->hasRole(RoleEnum::Direksi->value);
        $isManager = $user->hasRole(RoleEnum::Manager->value);
        $isKepalaCabang = $user->hasRole(RoleEnum::KepalaCabang->value);
        $isKepalaAgentPartner = $user->hasRole(RoleEnum::KepalaAgentPartner->value);
        $isAgentPartner = $user->hasRole(RoleEnum::AgentPartner->value);
        $isMarketingPartner = $user->hasRole(RoleEnum::MarketingPartner->value);

        return compact([
            'authId',
            'isStaff',
            'isDireksi',
            'isManager',
            'isKepalaCabang',
            'isKepalaAgentPartner',
            'isAgentPartner',
            'isMarketingPartner',
        ]);
    }

    public function displayCreate()
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

    public function displayHistory(Request $request)
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

        $submissions = Submission::search($request->get('search'))
            ->query(
                function ($query) use ($authId, $isStaff, $isManager, $isKepalaCabang, $isDireksi, $officeSelected) {
                    $query->where('guarantor_id', $this->guarantorId)
                        ->when($isStaff, function ($query) use ($authId) {
                            $query->where('staff_id', '=', $authId);
                        })
                        ->when($isManager || $isKepalaCabang, function ($query) use ($authId) {
                            $query->whereNot('status', SubmissionStatus::PROCESS->value)
                                ->where('checked_by', '=', $authId)
                                ->orWhere('approved_by', '=', $authId)
                                ->orWhere('rejected_by', '=', $authId);
                        })
                        ->when($isDireksi, function ($query) {
                            $query->whereNot('status', SubmissionStatus::PROCESS->value);
                        })
                        ->when($officeSelected, function ($query) use ($officeSelected) {
                            $query->whereHas('staff', function ($query) use ($officeSelected) {
                                $query->where('profile_id', $officeSelected);
                            });
                        })
                        ->with(['scores', 'principal', 'bank', 'obligee', 'employeeLimit',
                            'sourceOfFund', 'guarantor', 'guarantorToProductType',
                            'guarantorProductTypeLimit', 'staff.office']);
                }
            )
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
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
        ]);
    }

    public function displaySubmission(Request $request)
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

        $staffs = $isManager ? User::query()
            ->where('head_id', $authId)
            ->pluck('id') : [];

        $submissions = Submission::query()
            ->where('guarantor_id', $this->guarantorId)
            ->when($isDireksi, function ($query) {
                $query->where('checked_by', '!=', null)
                    ->where('status', SubmissionStatus::PROCESS->value);
            })
            ->when($isManager || $isKepalaCabang, function ($query) use ($staffs) {
                $query->whereIn('staff_id', $staffs)
                    ->where([
                        'checked_by' => null,
                        'approved_by' => null,
                        'rejected_by' => null,
                    ]);
            })
            ->when($isKepalaAgentPartner, function ($query) use ($staffs) {
                $query->whereIn('staff_id', $staffs);
            })
            ->when($officeSelected, function ($query) use ($officeSelected) {
                $query->whereHas('staff', function ($query) use ($officeSelected) {
                    $query->where('profile_id', $officeSelected);
                });
            })
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
            ])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($submission) use ($authId) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');
                $employeeLimit = $submission->employeeLimit->firstWhere('employee_id', $authId);
                $productLimit = $submission->guarantorProductTypeLimit;

                return array_merge($submission->toArray(), [
                    'employee_limit' => $employeeLimit?->limit ?? 0,
                    'product_limit' => $productLimit?->limit ?? 0,
                    'product_limit_inherit' => $productLimit?->limit_inherit ?? 0,
                    'beyond_the_limit' => ($employeeLimit?->limit ?? 0) < $submission->guarantee_value,
                    'created_at' => $date,
                ]);
            });

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

    public function approve(Request $request, Submission $submission): void
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
            $submission->load('blanks');
            $blank = $submission->getRelation('blanks')->where('is_broken', false)->first();
            $blank->update(['is_used' => true]);
            $documents = $request->input('documents', []);
            if (count($documents) > 0) {
                $submission->submissionDocs()->delete();
                $docData = collect($documents)->map(fn ($doc) => [
                    'document_format_id' => $doc['id'] ?? null,
                    'name' => $doc['name'] ?? null,
                    'format_document' => $doc['content'],
                    'url' => $doc['url'] ?? null,
                ])->toArray();
                $submission->submissionDocs()->createMany($docData);
            }

            $guarantor = $submission->load(['guarantor', 'guarantor.hostToHost'])->getRelation('guarantor');
            $hostToHost = $guarantor->getRelation('hostToHost');
            $messageSend = '';
            if ($hostToHost) {
                // if submission before id is exist, is revision submission
                $submissionIdForHost = $submission->getAttribute('id');
                try {
                    $result = $this->sendToGuarantor($submissionIdForHost);
                    if ($result['status'] == 'success') {
                        $messageSend = 'Berhasil mengirimkan data ke pihak asuransi';
                    } else {
                        $messageSend = 'Gagal mengirimkan data ke pihak asuransi: '.$result['message'];
                    }
                } catch (Exception $e) {
                    $error = $this->handleErrorMessage($e);
                    Log::error('Failed to send data to insurance', $error);
                    $messageSend = 'Gagal mengirimkan data ke pihak asuransi';
                }
            }
            Log::info('Submission approved', ['submission_id' => $submission->getAttribute('id')]);
            flashMessage('success', 'Berhasil menyetujui pengajuan dan menyimpan dokumen, '.$messageSend);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to approve submission', $error);
            flashMessage('error', 'Terjadi kesalahan saat menyetujui pengajuan', 'error');
        }
    }

    private function sendToGuarantor($submissionId): array
    {
        $submission = Submission::query()
            ->with([
                'principal:id,name,telephone,pic,npwp,nib,siup_siujk,head_name,business_fields,'.
                'director_name,director_position,director_phone,commissioner,year_established,'.
                'last_deed,province_id,regency_id,district_id,village,address,postal_code',
                'principal.province:id,code,name',
                'principal.regency:id,code,name',
                'principal.district:id,code,name',
                'principal.documents:id,principal_id,name,url',
                'blanks',
                'guarantor:id,code,name',
                'guarantorBranch:id,code,name',
                'guarantor.hostToHost:id,guarantor_id,guarantor_url_host,auth_prefix,token',
                'product:id,name',
                'guarantorToProductType:id,product_type_id,name,job_group,job_type',
                'obligee:id,name,telephone,pic,no_ppk,province_id,regency_id,district_id,village,address,postal_code',
                'obligee.province:id,code,name',
                'obligee.regency:id,code,name',
                'obligee.district:id,code,name',
                'province:id,code,name',
                'regency:id,code,name',
                'district:id,code,name',
                'sourceOfFund:id,name',
                'submissionDocs:id,submission_id,name,format_document,url',
                'staff:id,head_id,profile_id',
            ])->find($submissionId);
        $principal = $submission->getRelation('principal');
        $blank = $submission->getRelation('blanks')->where('is_broken', false)->first();
        $guarantor = $submission->getRelation('guarantor');
        $guarantorBranch = $submission->getRelation('guarantorBranch');
        $product = $submission->getRelation('product');
        $guarantorToProductType = $submission->getRelation('guarantorToProductType');
        $obligee = $submission->getRelation('obligee');
        $jobProvince = $submission->getRelation('province');
        $jobRegency = $submission->getRelation('regency');
        $jobDistrict = $submission->getRelation('district');
        $sourceOfFound = $submission->getRelation('sourceOfFund');
        $submissionDocs = $submission->getRelation('submissionDocs')->whereNotNull('format_document');
        $submissionDocsFile = $submission->getRelation('submissionDocs')->whereNull('format_document');
        $submissionBeforeId = $submission->getAttribute('submission_before_id');

        $hostToHost = $guarantor->getRelation('hostToHost');
        $url = $hostToHost->getAttribute('guarantor_url_host');
        $url = $submissionBeforeId ? $url.'/endorsement' : $url.'/submission';
        $prefix = $hostToHost->getAttribute('auth_prefix');
        $token = ($prefix ? $prefix.' ' : '').$hostToHost->getAttribute('token');

        $profileLimit = $this->getProfileLimit(
            $submission->guarantor_id,
            $submission->guarantor_product_type_id,
            $submission->getRelation('staff')->getAttribute('profile_id'))
            ?->getAttribute('limit') ?? 0;
        $beyondTheLimit = $profileLimit < $submission->guarantee_value;

        $dataRevision = [];
        if ($submissionBeforeId) {
            $submissionCallback = SubmissionCallback::query()->firstWhere('submission_id', $submissionBeforeId);
            if (! $submissionCallback) {
                return [
                    'status' => 'error',
                    'message' => 'Pengajuan sebelumnya belum mendapatkan persetujuan',
                ];
            }
            $dataRevision = [
                'previous_id' => $submissionBeforeId,
                'remarks' => $submission->getAttribute('revised_note'),
                'policyno' => $submissionCallback->getAttribute('no_policy'),
            ];
        }
        $result = array_merge($dataRevision, [
            'submission_id' => $submission->getAttribute('id'),
            'principal' => [
                'id' => $principal->getAttribute('id'),
                'name' => $principal->getAttribute('name'),
                'telephone' => $principal->getAttribute('telephone'),
                'pic' => $principal->getAttribute('pic'),
                'npwp' => $principal->getAttribute('npwp'),
                'nib' => $principal->getAttribute('nib'),
                'siup_siujk' => $principal->getAttribute('siup_siujk'),
                'head_name' => $principal->getAttribute('head_name'),
                'business_fields' => $principal->getAttribute('business_fields'),
                'director' => [
                    'name' => $principal->getAttribute('director_name'),
                    'position' => $principal->getAttribute('director_position'),
                    'phone' => $principal->getAttribute('director_phone'),
                    'commissioner' => $principal->getAttribute('commissioner'),
                ],
                'year_established' => $principal->getAttribute('year_established'),
                'last_legality' => $principal->getAttribute('last_deed'),
                'location' => [
                    'province' => $principal->province?->only(['code', 'name']),
                    'regency' => $principal->regency?->only(['code', 'name']),
                    'district' => $principal->district?->only(['code', 'name']),
                    'village' => $principal->getAttribute('village'),
                    'address' => $principal->getAttribute('address'),
                    'postal_code' => $principal->getAttribute('postal_code'),
                ],
                'docs' => $beyondTheLimit ? $principal->getRelation('documents')->map(function ($doc) {
                    return [
                        'name' => $doc->getAttribute('name'),
                        'url' => $doc->getAttribute('url'),
                    ];
                })->toArray() : [],
            ],
            'guarantee' => [
                'no' => $submission->getAttribute('no_guarantee'),
                'value' => $submission->getAttribute('guarantee_value'),
            ],
            'contract' => [
                'blank' => $blank?->number,
                'value' => $submission->getAttribute('contract_value'),
                'document' => [
                    'name' => $submission->getAttribute('contract_doc_name'),
                    'number' => $submission->getAttribute('contract_doc_number'),
                    'date' => $submission->getAttribute('contract_doc_date'),
                ],
                'guarantor' => [
                    ...$guarantor->only(['id', 'code', 'name']),
                    'branch' => $guarantorBranch?->only(['id', 'code', 'name']),
                ],
                'product' => $product->only(['id', 'name']),
                'product_type' => [
                    'id' => $guarantorToProductType->getAttribute('product_type_id'),
                    'name' => $guarantorToProductType->getAttribute('name'),
                ],
                'obligee' => [
                    'name' => $obligee->getAttribute('name'),
                    'telephone' => $obligee->getAttribute('telephone'),
                    'pic' => $obligee->getAttribute('pic'),
                    'no_ppk' => $obligee->getAttribute('npwp'),
                    'location' => [
                        'province' => $obligee->province?->only(['code', 'name']),
                        'regency' => $obligee->regency?->only(['code', 'name']),
                        'district' => $obligee->district?->only(['code', 'name']),
                        'village' => $obligee->getAttribute('village'),
                        'address' => $obligee->getAttribute('address'),
                        'postal_code' => $obligee->getAttribute('postal_code'),
                    ],
                ],
                'project' => [
                    'name' => $submission->getAttribute('job_name'),
                    'group' => $guarantorToProductType->getAttribute('job_group'),
                    'type' => $guarantorToProductType->getAttribute('job_type'),
                    'time_period' => $submission->getAttribute('time_period'),
                    'start_date' => $submission->getAttribute('start_date'),
                    'end_date' => $submission->getAttribute('end_date'),
                    'source_of_fund' => $sourceOfFound->only(['id', 'name']),
                    'location' => [
                        'province' => $jobProvince->only(['code', 'name']),
                        'regency' => $jobRegency->only(['code', 'name']),
                        'district' => $jobDistrict->only(['code', 'name']),
                        'village' => $submission->getAttribute('job_location_village'),
                        'address' => $submission->getAttribute('job_location_address'),
                        'postal_code' => $submission->getAttribute('job_location_postal_code'),
                    ],
                ],
            ],
            'output' => $submissionDocs->map(function ($doc) {
                return [
                    'name' => $doc->getAttribute('name'),
                    'value' => $doc->getAttribute('format_document'),
                ];
            })->toArray(),
            'final_output_file' => $submissionDocsFile->map(function ($doc) {
                return [
                    'name' => $doc->getAttribute('name'),
                    'url' => $doc->getAttribute('url'),
                ];
            })->toArray(),
        ]);

        Log::info('Data Send To Assurance', $result);
        $final = $this->hostToHostService->sendPostRequest($url, $token, $result);
        if ($final['status'] == 'success') {
            $submission->update(['has_send_to_guarantor' => true]);

            return $final;
        }

        return $final;
    }

    private function getProfileLimit($guarantorId, $guarantorProductTypeId, $profileId)
    {
        return ProfileLimit::query()
            ->where('guarantor_id', $guarantorId)
            ->where('guarantor_to_product_type_id', $guarantorProductTypeId)
            ->where('profile_id', $profileId)
            ->first();
    }

    public function broken(Submission $submission): void
    {
        DB::beginTransaction();
        try {
            $submission->update(['status' => SubmissionStatus::BROKEN->value]);
            $submission->blanks()->update(['is_broken' => true]);
            DB::commit();
            flashMessage('success', 'Berhasil menandai pengajuan sebagai broken');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to mark submission as broken', ['error' => $e->getMessage()]);
            flashMessage('error', 'Terjadi kesalahan saat menandai pengajuan sebagai broken', 'error');
        }
    }

    public function reject(Submission $submission): void
    {
        DB::beginTransaction();
        try {
            $dateNow = now()->format('Y-m-d H:i:s');

            $checkedBy = $submission->getAttribute('checked_by');
            $checkedAt = $submission->getAttribute('checked_at');
            $updated = $submission->update([
                'checked_by' => $checkedBy ?? auth()->id(),
                'checked_at' => $checkedAt ?? $dateNow,
                'rejected_by' => auth()->id(),
                'rejected_at' => $dateNow,
                'status' => SubmissionStatus::REJECTED->value,
            ]);

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
                $submission->submissionDocs()->delete();
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

    public function saveDocument(Request $request)
    {
        $validated = $request->validate([
            'submission_id' => 'required|integer|exists:submissions,id',
            'document_format_id' => 'nullable|integer|exists:document_formats,id',
            'name' => 'nullable|string|max:255',
            'format_document' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $submissionDoc = SubmissionDoc::updateOrCreate(
                [
                    'submission_id' => $validated['submission_id'],
                    'name' => $validated['name'],
                ],
                [
                    'document_format_id' => $validated['document_format_id'] ?? null,
                    'format_document' => $validated['format_document'], // Data yang diperbarui
                ]
            );

            DB::commit();

            return response()->json([
                'message' => $submissionDoc->wasRecentlyCreated
                  ? 'Dokumen berhasil dibuat.'
                  : 'Dokumen berhasil diperbarui.',
                'data' => $submissionDoc,
            ], 201);
        } catch (Exception $e) {
            // Error handling
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal menyimpan dokumen.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function saveDocSignatured(Request $request)
    {
        $request->validate([
            'spkmgr_file' => 'nullable|file|mimes:pdf,docx,doc|max:10240',
            'permohonan_file' => 'nullable|file|mimes:pdf,docx,doc|max:10240',
            'submission_id' => 'required|exists:submissions,id',
        ]);

        DB::beginTransaction();
        try {
            $submissionId = $request->input('submission_id');
            $documents = [];

            if ($request->hasFile('spkmgr_file')) {
                $spkmgrFile = $request->file('spkmgr_file');
                // Generate nama file unik
                $uniqueName = uniqid('spkmgr_', true).'.'.$spkmgrFile->getClientOriginalExtension();
                // Simpan file di folder dengan path berdasarkan submission_id
                //                $spkmgrPath = $spkmgrFile->storeAs(
                //                    "documents/spkmgr/{$submissionId}",
                //                    $uniqueName,
                //                    'public'
                //                );
                $spkmgrPath = $this->uploadFile($spkmgrFile, "documents/spkmgr/{$submissionId}", $uniqueName);
                $documents[] = [
                    'submission_id' => $submissionId,
                    'document_format_id' => null,
                    'name' => 'Surat Pernyataan Kesediaan Membayar Ganti Rugi (SPKMGR)',
                    'format_document' => null,
                    'url' => $spkmgrPath,
                ];
            }

            if ($request->hasFile('permohonan_file')) {
                $permohonanFile = $request->file('permohonan_file');
                // Generate nama file unik
                $uniqueName = uniqid('permohonan_', true).'.'.$permohonanFile->getClientOriginalExtension();
                // Simpan file di folder dengan path berdasarkan submission_id
                //                $permohonanPath = $permohonanFile->storeAs(
                //                    "documents/permohonan/{$submissionId}",
                //                    $uniqueName,
                //                    'public'
                //                );
                $permohonanPath = $this->uploadFile($permohonanFile, "documents/permohonan/{$submissionId}", $uniqueName);
                $documents[] = [
                    'submission_id' => $submissionId,
                    'document_format_id' => null,
                    'name' => 'Surat Permohonan',
                    'format_document' => null,
                    'url' => $permohonanPath,
                ];
            }

            foreach ($documents as $document) {
                SubmissionDoc::updateOrCreate(
                    ['submission_id' => $document['submission_id'], 'url' => $document['url']], // Key untuk mencocokkan dokumen
                    $document
                );
            }

            DB::commit();

            return response()->json([
                'message' => 'File berhasil diunggah dan disimpan.',
                'data' => $documents,
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal mengunggah file.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateDocument(Request $request, SubmissionDoc $submissionDoc)
    {
        $validated = $request->validate([
            'format' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $submissionDoc->update([
                'format_document' => $validated['format'],
            ]);

            DB::commit();

            return $this->responseSuccess('Berhasil mengubah format dokumen');
        } catch (Exception $e) {
            DB::rollBack();

            return $this->responseError('Gagal mengubah format dokumen', ['message' => $e->getMessage()]);
        }
    }

    public function send($submissionId): JsonResponse
    {
        $result = $this->sendToGuarantor($submissionId);

        if ($result['status'] === 'success') {
            Log::info('Submission sent to guarantor', ['submission_id' => $submissionId]);

            return $this->responseSuccess('Berhasil mengirimkan data ke pihak asuransi');
        }
        Log::error('Submission failed to send to guarantor', ['submission_id' => $submissionId]);

        return $this->responseError('Gagal mengirimkan data ke pihak asuransi: '.$result['message']);
    }

    public function postToGetCallback(Submission $submission): JsonResponse
    {
        $submission->load(['guarantor', 'guarantor.hostToHost']);
        $guarantor = $submission->getRelation('guarantor');
        $hostToHost = $guarantor->getRelation('hostToHost');
        $url = $hostToHost->getAttribute('guarantor_url_host').'/status';
        $prefix = $hostToHost->getAttribute('auth_prefix');
        $token = ($prefix ? $prefix.' ' : '').$hostToHost->getAttribute('token');

        $result = $this->hostToHostService->sendPostRequest($url, $token, ['submission_id' => $submission->id]);

        if ($result['status'] === 'success') {
            $data = $result['message'];
            // image is base64
            $imageString = $data['image'];
            // base64 to file
            $fileData = $this->base64ToFile($imageString);
            // save image to storage
            $url = $this->uploadFile($fileData, 'submission/callback', $submission->id.'-image-from-guarantor');
            $submission->update(['has_send_to_guarantor' => true]);
            SubmissionCallback::query()->updateOrCreate(
                ['submission_id' => $submission->id],
                [
                    'submission_id' => $submission->id,
                    'doc_url' => $data['doc_url'],
                    'url' => $url,
                    'no_policy' => $data['policyno'],
                ]
            );

            return $this->responseSuccess('Berhasil Mengambil Data', $data);
        } else {
            Log::error('Error Callback: ', ['message' => $result['message']]);

            return $this->responseError('Terjadi Kesalahan Saat Mengambil Data', $result['message']);
        }
    }


    // public function embedQrCodeToDocs(Submission $submission): void
    // {
    //     $submission->load([
    //         'callback',
    //         'submissionDocs.documentFormat',
    //     ]);

    //     $qrUrl = optional($submission->callback)['url']; // Mengambil QR URL dari array callback
    //     $targetTypeId = $submission->guarantorToProductType->id;

    //     // Debug: Pastikan QR URL ada
    //     Log::debug('QR URL:', [$qrUrl]);

    //     // Debug: Pastikan callback sudah dimuat dengan benar
    //     Log::debug('Callback Data:', [$targetTypeId]);

    //     if (empty($qrUrl)) {
    //         Log::info("No QR code available for submission ID: {$submission->id}");
    //         return;
    //     }

    //     // Loop untuk meng-update submissionDocs
    //     foreach ($submission->submissionDocs as $doc) {
    //         // Debug: Periksa data submissionDoc dan documentFormat
    //         Log::debug('Processing submissionDoc ID:', [$doc->id]);
    //         Log::debug('Document Format ID:', [optional($doc->documentFormat)->id]);

    //         $docTypeId = optional($doc->documentFormat->guarantorToProductType)->id;
    //         Log::debug("doc {$docTypeId} vs target {$targetTypeId}");

    //         // Pastikan tipe dokumen cocok
    //         if ($docTypeId !== $targetTypeId) {
    //             continue;
    //         }

    //         // Ambil konten HTML dokumen
    //         $html = $doc->html ?? '';
    //         Log::debug('Original HTML:', [$html]);

    //         // HTML untuk QR Code
    //         $qrHtml = '<div style="margin-top:40px;text-align:center;">';
    //         $qrHtml .= '<img src="' . e($qrUrl) . '" alt="QR Code" style="width:150px;height:150px;"><br>';
    //         $qrHtml .= '<small>Scan untuk verifikasi dokumen ini</small>';
    //         $qrHtml .= '</div>';

    //         // Menambahkan QR Code ke dalam konten HTML
    //         if (str_contains($html, '</body>')) {
    //             $html = str_replace('</body>', $qrHtml . '</body>', $html);
    //         } else {
    //             $html .= $qrHtml;
    //         }

    //         // Debug: Periksa HTML yang sudah diperbarui
    //         Log::debug('Updated HTML:', [$html]);

    //         // Simpan perubahan HTML ke dokumen
    //         $doc->html = $html;
    //         $doc->save();
    //         Log::info("Updated document {$doc->id} with QR code.");
    //     }
    // }

    public function embedQrCodeToDocs(Submission $submission): void
    {
        $submission->load([
            'callback',
            'submissionDocs.documentFormat.guarantorToProductType',
        ]);

        $qrPath = optional($submission->callback)['url'];
        $qrUrl =Storage::url($qrPath);
        $targetTypeId = optional($submission->guarantorToProductType)->id;

        $matchingDocs = $submission->submissionDocs->filter(function ($doc) use ($targetTypeId) {
            return optional(optional($doc->documentFormat)->guarantorToProductType)->id === $targetTypeId;
        });

        Log::debug("qr : {$qrUrl}");


        if ($matchingDocs->isEmpty()) {
            Log::info("Tidak ada dokumen yang cocok untuk embedding QR, submission ID: {$submission->id}");
            return;
        }

        foreach ($matchingDocs as $doc) {
            $html = $doc->format_document ?? '';

            $qrHtml = '<div style="margin-top:40px;text-align:center;">';
            $qrHtml .= '<img src="' . e($qrUrl) . '" alt="QR Code" style="width:150px;height:150px;"><br>';
            $qrHtml .= '<small>Scan untuk verifikasi dokumen ini</small>';
            $qrHtml .= '</div>';

            if (str_contains($html, '</body>')) {
                $html = str_replace('</body>', $qrHtml . '</body>', $html);
            } else {
                $html .= $qrHtml;
            }

            $doc->format_document = $html;
            $doc->save();

            Log::info("QR code embedded ke doc ID: {$doc->id}");
        }
    }



}
