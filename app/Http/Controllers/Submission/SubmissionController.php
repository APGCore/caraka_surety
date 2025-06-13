<?php

namespace App\Http\Controllers\Submission;

use App\Enums\OfficeType;
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
use App\Traits\currencyConverter;
use App\Traits\FilterOffice;
use App\Traits\GeneratePattern;
use App\Traits\Numbering;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;
use Riskihajar\Terbilang\Facades\Terbilang;
use Symfony\Component\HttpFoundation\JsonResponse;

class SubmissionController extends Controller
{
  use currencyConverter, FilterOffice, GeneratePattern, Numbering;

  protected HostToHostService $hostToHostService;

  protected int $guarantorId;

  protected int $productId;

  public function __construct(
    HostToHostService $hostToHostService
  )
  {
    Carbon::setLocale('id');
    $this->hostToHostService = $hostToHostService;
    $this->guarantorId = config('guarantor.id');
    $this->productId = config('product.id');
  }

  public function index(Request $request): Response
  {
    $date = collect($request->get('date') ?? [
      now()->subDays(7)->toDateString() . ' 00:00:00',
      now()->toDateString() . ' 23:59:59',
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
    $guarantorSelected = (int)$request->get('guarantor_id', $guarantors->first()?->getAttribute('id'));
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
            'submissionBefore:id',
            'submissionBefore.blanks',
            'staff:id,name,profile_id',
            'staff.office:id,name',
          ]);
      })
      ->orderBy('created_at', 'desc')
      ->paginate($request->get('per_page') ?? 10)
      ->appends('query')
      ->appends($request->all());

    $resource = SubmissionResource::collection($submissions);
    $component = 'admin/submission-management/list/index';

    return inertia($component, [
      'page_settings' => [
        'title' => 'Daftar Pengajuan',
      ],
      'submissions' => fn() => $resource,
      'offices' => $offices,
      'officeTypes' => $officeTypes,
      'officeSelected' => (int)$officeSelected,
      'officeTypeSelected' => $officeTypeSelected,
      'guarantors' => $guarantors->map->only('id', 'name'),
      'guarantorSelected' => $guarantorSelected,
      'products' => $products,
      'productSelected' => (int)$productSelected,
      'productTypes' => $productTypes,
      'productTypeSelected' => (int)$productTypeSelected,
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
        $ratio['year'] = (int)$ratio['year'];
        $ratio['current_assets'] = (float)$ratio['current_assets'];
        $ratio['current_debt'] = (float)$ratio['current_debt'];
        $ratio['total_debt'] = (float)$ratio['total_debt'];
        $ratio['total_assets'] = (float)$ratio['total_assets'];
        $ratio['revenue'] = (float)$ratio['revenue'];
        $ratio['net_income'] = (float)$ratio['net_income'];
        $ratio['liquidity_ratios'] = (float)$ratio['liquidity_ratios'];
        $ratio['profitability_ratios'] = (float)$ratio['profitability_ratios'];
        $ratio['solvency_ratios'] = (float)$ratio['solvency_ratios'];

        return $ratio;
      })->toArray();

      $obligee = $validated['obligee'];
      $submission = $validated['submission'];
      $submissionType = $validated['submissionType'];
      $submission['difference_time_period'] = (float)$submission['difference_time_period'];
      $supportDocs = $submission['support_docs'] ?? [];
      $scoring = $validated['scoring'];
      $isEdit = $submissionType === SubmissionType::EDIT->value;
      $isRevision = $submissionType === SubmissionType::REVISION->value;

      // get profile
      $profile = Profile::query()->firstWhere('office_type', OfficeType::HEADQUARTER->value);

      // submission editing
      $submissionEdit = Submission::with('blanks')->find($submission['id'] ?? null);
      $blankIds = $submissionEdit?->blanks->pluck('id')->toArray() ?? [];
      $blankId = $submission['blank_id'] ?? null;

      // get blanks
      $blank = Blank::query()
        ->where('is_picked', $isEdit && in_array($blankId, $blankIds))
        ->firstWhere('id', $submission['blank_id']);
      if (!$blank) {
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

      if ($isRevision) {
        $submissionBeforeId = $dataSubmission['submission_before_id'];
        $submissionForRevision = Submission::query()->select(['id', 'no_guarantee'])->find($submissionBeforeId);
        $noGuarantee = $submissionForRevision->getAttribute('no_guarantee');
        $submissionForRevision->update(['is_revised' => true]);
        $submissionForRevision->blanks()->each(function ($query) {
          $query->update(['is_revised' => true]);
        });
        $messageResponse = 'Berhasil merevisi pengajuan';
      } elseif ($isEdit) {
        $noGuarantee = $submissionEdit->getAttribute('no_guarantee');
        $messageResponse = 'Berhasil memperbarui pengajuan';
      } else {
        $noGuarantee = $this->generateNoGuarantee(
          $guarantorHead,
          $guarantorToProductType,
          $guarantorBranchId,
          $blank,
          $profile
        );
        $messageResponse = 'Berhasil membuat pengajuan';
      }
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
      $dataSubmission['contract_value'] = (float)str_replace(',', '.', $submission['contract_value']);
      $dataSubmission['guarantee_value'] = (float)str_replace(',', '.', $submission['guarantee_value']);
      $dataSubmission['first_year_ratio'] = $principalRatios[0]['year'] ?? null;
      $dataSubmission['last_year_ratio'] = $principalRatios[1]['year'] ?? null;

      $scores = $scoring['scores'];

      if ($isEdit) {
        $submission = Submission::query()->with(['blanks', 'scores', 'supportDocs'])->find($submission['id']);
        $submission->scores()->delete();
        $submission->update($dataSubmission);
      } else {
        $submission = Submission::query()->with(['blanks', 'scores', 'supportDocs'])->create($dataSubmission);
      }

      // update or create submission blangko
      SubmissionBlank::query()->updateOrCreate([
        'submission_id' => $submission->getAttribute('id'),
        'blank_id' => $blank->getAttribute('id'),
      ]);

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
          $existingDoc = $submission->supportDocs()->find($supportDoc['id']);
          if ($existingDoc) {
            $this->deleteFile($existingDoc->url);
          }
          $data['url'] = $this->uploadFile(
            $file,
            "submission/submission-$noGuarantee/support-documents/{$supportDoc['number']}",
            $supportDoc['name']
          );
        }

        if (!empty($supportDoc['id'])) {
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
      'page_settings' => fn() => [
        'title' => 'Buat Pengajuan',
      ],
    ]);
  }

  private function checkRole(): array
  {
    // check role
    $authId = auth()->id();
    $user = User::query()->find($authId);
    $roleName = $user->role->name;
    $isStaff = $roleName === RoleEnum::Staff->value;
    $isDireksi = $roleName === RoleEnum::Direksi->value;
    $isManager = $roleName === RoleEnum::Manager->value;
    $isKepalaCabang = $roleName === RoleEnum::KepalaCabang->value;
    $isKepalaAgentPartner = $roleName === RoleEnum::KepalaAgentPartner->value;
    $isAgentPartner = $roleName === RoleEnum::AgentPartner->value;
    $isMarketingPartner = $roleName === RoleEnum::MarketingPartner->value;

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

  /**
   * Display the specified resource.
   */
  public function edit($id): Response|RedirectResponse
  {
    $submission = $this->getSubmission($id);
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
      ['blank_id' => $submission->getRelation('blanks')->first()?->id],
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
      'page_settings' => fn() => [
        'title' => 'Ubah Pengajuan',
      ],
      'submission' => fn() => $data,
    ]);
  }

  private function getSubmission($id): Submission
  {
    return Submission::with([
      'principal' => function ($query) {
        $query->withTrashed();
      },
      'principal.documents',
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
      'supportDocs',
    ])->findOrFail($id);
  }

  /**
   * Display the specified resource.
   */
  public function revision($id): Response
  {
    $submission = $this->getSubmission($id);
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
      'submission_before_id' => (int)$id,
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
      'page_settings' => fn() => [
        'title' => 'Revisi Pengajuan',
      ],
      'submission' => fn() => $data,
    ]);
  }

  /**
   * Display the specified resource.
   */
  public function showDetailSubmission($id): Response
  {
    $submission = $this->getSubmission($id);
    $mailNumber = $this->generateNomorSurat($submission);
    $principal = $submission->getRelation('principal');
    $principalDocs = $principal->getRelation('documents');
    $blank = $submission->getRelation('blanks')->first();

    // check role
    $checkRole = $this->checkRole();
    $isStaff = $checkRole['isStaff'];
    $isDireksi = $checkRole['isDireksi'];
    $isManager = $checkRole['isManager'];
    $isKepalaCabang = $checkRole['isKepalaCabang'];

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

    $contractValueFormatted = $this->formatCurrency($submission->getAttribute('contract_value'));
    $guaranteeValueFormatted = $this->formatCurrency($submission->getAttribute('guarantee_value'));
    $analystName = $submission->getRelation('staff')->getAttribute('name');

    $submission->getRelation('scores')->map(function ($score) {
      $score->setAttribute('category_name', $score->scoringQuestionCategory->name ?? '-');
      $score->setAttribute('question_name', $score->scoringQuestion->name ?? '-');
      $score->setAttribute('option_name', $score->scoringOption->name ?? '-');

      return $score;
    });

    // SCORING RESULT
    $analysis = ['character' => 0, 'capacity' => 0, 'capital' => 0, 'condition' => 0, 'collateral' => 0];

    $scoringResult = $submission->getRelation('scores')
      ->reduce(function ($grouped, $score) use (&$analysis) {
        $categoryId = $score->getAttribute('scoring_question_category_id');
        $category = $score->getRelation('scoringQuestionCategory');
        $categoryName = $category->getAttribute('name');

        if (!isset($grouped[$categoryId])) {
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
                    <td>Rp. " . number_format($submission->getAttribute('contract_value'), 0, ',', '.') . '</td>
                    <td>' . date('Y', strtotime($submission->getAttribute('approved_at'))) . '</td>
                </tr>';
      })->implode('');

    $getExp = "<table style='width: 100%; border-collapse: collapse; text-align: center;' border='1'>
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
                  </table>";

    // GET SUSUNAN PENGURUS

    $pengurus = collect();

    if (!empty($principal->getAttribute('director_name'))) {
      $pengurus->push(['nama' => $principal->getAttribute('director_name'), 'jabatan' => 'Direktur']);
    }
    if (!empty($principal->commissioner)) {
      $pengurus->push(['nama' => $principal->getAttribute('commissioner'), 'jabatan' => 'Komisaris']);
    }

    if (!empty($principal->head_name)) {
      $pengurus->push(['nama' => $principal->getAttribute('head_name'), 'jabatan' => 'Kepala Cabang']);
    }

    $susunanPengurus = $pengurus->map(function ($pengurus, $index) {
      return "<tr>
                        <td style='text-align: center; vertical-align: middle;'>" . ($index + 1) . "</td>
                        <td>{$pengurus['nama']}</td>
                        <td>{$pengurus['jabatan']}</td>
                    </tr>";
    })->implode('');

    $getAdministatorsPrincipal =
      "<table style='width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px;' border='1'>
              <tr>
                  <td colspan='3' style='text-align: center'><strong>SUSUNAN PENGURUS</strong></td>
              </tr>
              <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Jabatan</th>
              </tr>
              {$susunanPengurus}
          </table>";

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

    $submissionDocsFile = $submission->getRelation('submissionDocs')->whereNotNull('url')->values();
    $submissionDocs = $submission->getAttribute('has_send_to_guarantor') ? $submission->getRelation('submissionDocs')->whereNull('url')->values() : [];
    $finalOutputFile = $submissionDocsFile->map(function ($doc) {
      $document = $doc->only('name', 'url');
      $document['name'] = $doc->getAttribute('name') ?? '-';
      $document['url'] = Storage::url($doc->getAttribute('url'));

      return $document;
    });

    // get submission pic
    $guarantorPic = $guarantorBranch->getAttribute('pic') ?? $guarantor->getAttribute('pic');

    // get submission time difference period
    $getDifferenceTimePeriod = $submission->getAttribute('difference_time_period');
    $timePeriod = $submission->getAttribute('time_period');

    if ($getDifferenceTimePeriod == -1) {
      $timePeriod -= 1;
    } elseif ($getDifferenceTimePeriod == 1) {
      $timePeriod += 1;
    }

    // get terbilang hari
    $terbilang_hari = $timePeriod ? ucwords(Terbilang::make($timePeriod)) : '';

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
    $productLimit = $submission->getRelation('guarantorProductTypeLimit')
      ?->getAttribute($submissionInheritId ? 'limit_inherit' : 'limit', 0);
    $beyondTheLimit = $employeeLimit < $submission->getAttribute('guarantee_value');

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

    $docsInfo = $supportDocs->map(function ($doc) {
      return "$doc->name, Nomor : $doc->number, Tanggal $doc->date";
    })->implode('; ');

    $isAddedQR = $submission->getAttribute('is_added_qrcode');

    if ($isStaff) {
      $component = 'staff/submission-management/history/detail/index';
    } elseif ($isDireksi) {
      $component = 'direksi/submission-management/history/detail/index';
    } elseif ($isManager) {
      $component = 'manager/submission-management/detail/index';
    } elseif ($isKepalaCabang) {
      $component = 'kepala-cabang/submission-management/detail/index';
    } else {
      $component = 'staff/submission-management/history/detail/index';
    }

    $submission->unsetRelation('submissionDocs');
    $submission->setAttribute('submission_docs', $submissionDocs);
    $submission->setAttribute('mail_number', $mailNumber);
    $submission->setAttribute('blank', $blank);
    $submission->setAttribute('required_docs', $requiredDocs);
    $submission->setAttribute('contract_value_formatted', $contractValueFormatted);
    $submission->setAttribute('guarantee_value_formatted', $guaranteeValueFormatted);
    $submission->setAttribute('analyst_name', $analystName);
    $submission->setAttribute('scoring_result', $scoringResult);
    $submission->setAttribute('analysis', $analysis);
    $submission->setAttribute('terbilang', $terbilang);
    $submission->setAttribute('terbilang_hari', $terbilang_hari);
    $submission->setAttribute('notes', $notes);
    $submission->setAttribute('recommendation', $recommendation);
    $submission->setAttribute('total_score', $totalScore);
    $submission->setAttribute('get_exp', $getExp);
    $submission->setAttribute('get_administators_principal', $getAdministatorsPrincipal);
    $submission->setAttribute('mail_number_resume', $mailNumberResume);
    $submission->setAttribute('start_date', $startDate);
    $submission->setAttribute('end_date', $endDate);
    $submission->setAttribute('submission_date', $submissionDate);
    $submission->setAttribute('guarantee_issue_date', $guaranteeIssueDate);
    $submission->setAttribute('contract_doc_date', $contractDocDate);
    $submission->setAttribute('day_name', $dayName);
    $submission->setAttribute('document_format_analysis', $documentFormatAnalysis);
    $submission->setAttribute('document_format_guarantor', $documentFormatGuarantor);
    $submission->setAttribute('document_format_product', $documentFormatProduct);
    $submission->setAttribute('document_format_type_guarantee', $documentFormatTypeGuarantor);
    $submission->setAttribute('guarantor_address', $guarantorAddress);
    $submission->setAttribute('guarantor_pic', $guarantorPic);
    $submission->setAttribute('employee_limit', $employeeLimit);
    $submission->setAttribute('product_limit', $productLimit);
    $submission->setAttribute('beyond_the_limit', $beyondTheLimit);
    $submission->setAttribute('support_docs', $supportDocs);
    $submission->setAttribute('time_period', $timePeriod);
    $submission->setAttribute('final_output_file', $finalOutputFile);
    $submission->setAttribute('is_added_qrcode', $isAddedQR);
    $submission->setAttribute('submission_support_docs', $docsInfo);

    return inertia($component, [
      'submission' => fn() => $submission,
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

    $staffs = !$isStaff || !$isDireksi ? User::query()
      ->where('head_id', $authId)
      ->pluck('id') : [];

    $submissions = Submission::search($search)
      ->query(function ($query) use ($authId, $isDireksi, $isManager, $isKepalaCabang, $isKepalaAgentPartner, $staffs, $officeSelected) {
        $query
          ->where('guarantor_id', $this->guarantorId)
          ->where('product_id', $this->productId)
          ->when($isDireksi, fn($query) => $query
            ->whereNotNull('checked_by')
            ->where('status', SubmissionStatus::PROCESS->value)
            ->whereHas('userChecked.role', fn($query) => $query->where('name', RoleEnum::Manager->value))
          )
          ->when($isManager, fn($query) => $query
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
          ->when($isKepalaCabang, fn($query) => $query
            ->whereIn('staff_id', $staffs)
            ->whereNull(['approved_by', 'rejected_by'])
            ->where(function ($query) use ($authId) {
              $query->whereNull('checked_by')
                ->orWhere('checked_by', $authId);
            })
          )
          ->when($isKepalaAgentPartner, fn($query) => $query->whereIn('staff_id', $staffs))
          ->when($officeSelected, fn($query) => $query
            ->whereHas('staff', fn($query) => $query->where('profile_id', $officeSelected))
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
            'staff.office:id,name',
          ]);
      })
      ->orderByDesc('updated_at')
      ->paginate($request->get('per_page') ?? 10)
      ->appends('query')
      ->appends($request->all());

    $submissions = SubmissionResource::collection($submissions);
    //            ->map(function ($submission) {
    //                $date = Carbon::parse($submission->created_at)
    //                    ->translatedFormat('d F Y');
    //                $submissionInheritId = $submission->getAttribute('submission_inherit_id');
    //                $employeeLimit = $submission->getRelation('employeeLimit')
    //                    ?->firstWhere('employee_id', auth()->id())
    //                    ?->getAttribute($submissionInheritId ? 'limit_inherit' : 'limit', 0);
    //                $productLimit = $submission->getRelation('guarantorProductTypeLimit')
    //                    ?->getAttribute($submissionInheritId ? 'limit_inherit' : 'limit', 0);
    //                $beyondTheLimit = $employeeLimit < $submission->getAttribute('guarantee_value');
    //
    //                return array_merge($submission->toArray(), [
    //                    'employee_limit' => $employeeLimit,
    //                    'product_limit' => $productLimit,
    //                    'beyond_the_limit' => $beyondTheLimit,
    //                    'created_at' => $date,
    //                ]);
    //            });

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
      'page_settings' => fn() => [
        'title' => 'List Pengajuan Masuk',
      ],
      'submissions' => fn() => $submissions,
      'officeTypes' => $officeTypes,
      'offices' => $offices,
      'officeTypeSelected' => $officeTypeSelected,
      'officeSelected' => $officeSelected,
    ]);
  }

  // for history pengajuan
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

    $submissions = Submission::search($request->get('search'))
      ->query(
        function ($query) use ($authId, $isStaff, $isManager, $isKepalaCabang, $isDireksi, $staffs, $officeSelected, $statusSelected) {
          $query->where('guarantor_id', $this->guarantorId)
            ->where('product_id', $this->productId)
            ->when($isStaff, fn($query) => $query->where('staff_id', $authId))
            ->when($isDireksi, function ($query) {
              $query->whereNot('status', SubmissionStatus::PROCESS->value);
            })
            ->when($isManager || $isKepalaCabang, fn($query) => $query->whereIn('staff_id', $staffs)
              ->whereNot('status', SubmissionStatus::PROCESS->value)
              ->when($isKepalaCabang, fn($query) => $query->whereNotNull('checked_by')))
            ->when($officeSelected && !$isStaff, fn($query) => $query->whereHas('staff', fn($query) => $query->where('profile_id', $officeSelected)))
            ->when($statusSelected, fn($query) => $query->where('status', $statusSelected))
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
              'staff.office:id,name',
            ]);
        }
      )
      ->orderByDesc('created_at')
      ->paginate($request->get('per_page') ?? 10)
      ->appends('query')
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
      'page_settings' => fn() => [
        'title' => 'Riwayat Pengajuan',
      ],
      'submissions' => fn() => $resource,
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

      if (!$updated) {
        throw new Exception('Failed to approve submission');
      }
      $submission->load('blanks');
      $submission->blanks()->update(['is_used' => true]);

      // $guarantor = $submission->load(['guarantor', 'guarantor.hostToHost'])->getRelation('guarantor');
      // $hostToHost = $guarantor->getRelation('hostToHost');
      // $messageSend = '';
      // if ($hostToHost) {
      //     // if submission before id is exist, is revision submission
      //     $submissionIdForHost = $submission->getAttribute('id');
      //     try {
      //         $result = $this->sendToGuarantor($submissionIdForHost);
      //         if ($result['status'] == 'success') {
      //             $messageSend = 'Berhasil mengirimkan data ke pihak asuransi';
      //         } else {
      //             $messageSend = 'Gagal mengirimkan data ke pihak asuransi: '.$result['message'];
      //         }
      //     } catch (Exception $e) {
      //         $error = $this->handleErrorMessage($e);
      //         Log::error('Failed to send data to insurance', $error);
      //         $messageSend = 'Gagal mengirimkan data ke pihak asuransi';
      //     }
      // }
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
      $submission->blanks()->update([
        'is_picked' => null,
        'is_used' => null,
        'is_broken' => null,
        'is_revised' => null,
        'is_approved' => null,
      ]);
      $updated = $submission->update([
        'checked_by' => $checkedBy ?? auth()->id(),
        'checked_at' => $checkedAt ?? $dateNow,
        'rejected_by' => auth()->id(),
        'rejected_at' => $dateNow,
        'status' => SubmissionStatus::REJECTED->value,
      ]);

      if (!$updated) {
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

      if (!$updated) {
        DB::rollBack();
        flashMessage('error', 'Gagal kirim ke direksi pengajuan', 'error');
      } else {
        $documents = $request->input('documents', []);
        $submission->submissionDocs()->whereNotNull('document_format_id')->delete();
        $docData = collect($documents)->map(fn($doc) => [
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

  public function saveDocument(Request $request): \Illuminate\Http\JsonResponse
  {
    $validated = $request->validate([
      'submission_id' => 'required|integer|exists:submissions,id',
      'document_format_id' => 'nullable|integer|exists:document_formats,id',
      'name' => 'nullable|string|max:255',
      'format_document' => 'required|string',
    ]);

    DB::beginTransaction();
    try {
      $submissionDoc = SubmissionDoc::query()
        ->updateOrCreate(
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

  public function saveDocSignatured(Request $request): \Illuminate\Http\JsonResponse
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
        $uniqueName = uniqid('spkmgr_', true) . '.' . $spkmgrFile->getClientOriginalExtension();
        // Simpan file di folder dengan path berdasarkan submission_id
        //                $spkmgrPath = $spkmgrFile->storeAs(
        //                    "documents/spkmgr/{$submissionId}",
        //                    $uniqueName,
        //                    'public'
        //                );
        $spkmgrPath = $this->uploadFile($spkmgrFile, "documents/spkmgr/$submissionId", $uniqueName);
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
        $uniqueName = uniqid('permohonan_', true) . '.' . $permohonanFile->getClientOriginalExtension();
        // Simpan file di folder dengan path berdasarkan submission_id
        //                $permohonanPath = $permohonanFile->storeAs(
        //                    "documents/permohonan/{$submissionId}",
        //                    $uniqueName,
        //                    'public'
        //                );
        $permohonanPath = $this->uploadFile($permohonanFile, "documents/permohonan/$submissionId", $uniqueName);
        $documents[] = [
          'submission_id' => $submissionId,
          'document_format_id' => null,
          'name' => 'Surat Permohonan',
          'format_document' => null,
          'url' => $permohonanPath,
        ];
      }

      foreach ($documents as $document) {
        SubmissionDoc::query()->updateOrCreate(
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

  public function storeDocument(Request $request, $submissionId): JsonResponse
  {
    $request->validate([
      'documents' => 'required|array',
      'documents.*.id' => 'required|exists:document_formats,id',
      'documents.*.name' => 'nullable|string|max:255',
      'documents.*.content' => 'required|string',
      'documents.*.url' => 'nullable|string|max:255',
    ]);

    DB::beginTransaction();
    try {
      $submission = Submission::query()->findOrFail($submissionId);
      $documents = $request->input('documents', []);
      if (count($documents) > 0) {
        $submission->submissionDocs()->whereNotNull('document_format_id')->delete();
        $docData = collect($documents)->map(fn($doc) => [
          'document_format_id' => $doc['id'] ?? null,
          'name' => $doc['name'] ?? null,
          'format_document' => $doc['content'],
          'url' => $doc['url'] ?? null,
        ])->toArray();
        $submission->submissionDocs()->createMany($docData);
      }
      DB::commit();

      return $this->responseSuccess('Berhasil menyimpan dokumen pengajuan');
    } catch (Exception $e) {
      DB::rollBack();
      $error = $this->handleErrorMessage($e);
      Log::error('Failed to save documents', $error);

      return $this->responseError('Gagal menyimpan dokumen pengajuan', $error);
    }
  }

  public function updateDocument(Request $request, SubmissionDoc $submissionDoc): JsonResponse
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
      $error = $this->handleErrorMessage($e);
      Log::error('Failed to update document format', $error);

      return $this->responseError('Gagal mengubah format dokumen', $error);
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

    return $this->responseError('Gagal mengirimkan data ke pihak asuransi: ' . $result['message']);
  }

  private function sendToGuarantor($submissionId): array
  {
    $submission = Submission::query()
      ->with([
        'principal:id,name,telephone,pic,npwp,nib,siup_siujk,head_name,business_fields,' .
        'director_name,director_position,director_phone,commissioner,year_established,' .
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
        'supportDocs:id,submission_id,name,number,date,url',
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
    $submissionDocs = $submission->getRelation('submissionDocs')->whereNotNull('format_document')->values();
    $submissionDocsFile = $submission->getRelation('submissionDocs')->whereNull('format_document')->values();
    $submissionBeforeId = $submission->getAttribute('submission_before_id');

    $hostToHost = $guarantor->getRelation('hostToHost');
    $url = $hostToHost->getAttribute('guarantor_url_host');
    $url = $submissionBeforeId ? $url . '/endorsement' : $url . '/submission';
    $prefix = $hostToHost->getAttribute('auth_prefix');
    $token = ($prefix ? $prefix . ' ' : '') . $hostToHost->getAttribute('token');

    //        $profileLimit = $this->getProfileLimit(
    //            $submission->guarantor_id,
    //            $submission->guarantor_product_type_id,
    //            $submission->getRelation('staff')->getAttribute('profile_id')
    //        )
    //            ?->getAttribute('limit') ?? 0;
    //        $beyondTheLimit = $profileLimit < $submission->guarantee_value;

    $dataSend = [
      'submission_id' => $submission->getAttribute('id'),
    ];
    if ($submissionBeforeId) {
      $submissionCallback = SubmissionCallback::query()->firstWhere('submission_id', $submissionBeforeId);
      if (!$submissionCallback) {
        return [
          'status' => 'error',
          'message' => 'Pengajuan sebelumnya belum mendapatkan persetujuan',
        ];
      }
      $dataSend = [
        'previous_id' => $submissionBeforeId,
        // 'submission_id' => $submissionBeforeId,
        'remarks' => $submission->getAttribute('revised_note'),
        'policyno' => $submissionCallback->getAttribute('no_policy'),
      ];
    }
    $docsPrincipal = $principal->getRelation('documents')->map(function ($doc) {
      return [
        'name' => $doc->getAttribute('name'),
        'url' => $doc->getAttribute('url'),
      ];
    })->toArray();
    $supportDocs = $submission->getRelation('supportDocs')->map(function ($doc) {
      return [
        'name' => $doc->getAttribute('name') . ', ' . $doc->getAttribute('number') . ', ' . $doc->getAttribute('date'),
        'url' => $doc->getAttribute('url'),
      ];
    })->toArray();
    $finalOutputFile = $submissionDocsFile->map(function ($doc) {
      return [
        'name' => $doc->getAttribute('name'),
        'url' => $doc->getAttribute('url'),
      ];
    })->toArray();
    $docs = array_merge($docsPrincipal, $supportDocs, $finalOutputFile);
    $docSupport = $submission->getRelation('supportDocs')->first();

    $result = array_merge($dataSend, [
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
        'docs' => $docs,
      ],
      'guarantee' => [
        'no' => $submission->getAttribute('no_guarantee'),
        'value' => $submission->getAttribute('guarantee_value'),
      ],
      'contract' => [
        'blank' => $blank?->number,
        'value' => $submission->getAttribute('contract_value'),
        //                'document' => [
        //                    'name' => $submission->getAttribute('contract_doc_name'),
        //                    'number' => $submission->getAttribute('contract_doc_number'),
        //                    'date' => $submission->getAttribute('contract_doc_date'),
        //                ],
        'document' => $docSupport ? [
          'name' => $docSupport->getAttribute('name'),
          'number' => $docSupport->getAttribute('number'),
          'date' => $docSupport->getAttribute('date'),
        ] : [
          'name' => null,
          'number' => null,
          'date' => null,
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
      'final_output_file' => $finalOutputFile,
    ]);

    Log::info('Data Send To Assurance', $result);
    $final = $this->hostToHostService->sendPostRequest($url, $token, $result);
    if ($final['status'] == 'success') {
      $submission->update(['has_send_to_guarantor' => true]);

      return $final;
    }

    return $final;
  }

  /**
   * @throws Exception
   */
  public function postToGetCallback(Submission $submission): JsonResponse
  {
    try {
      $submission->load(['guarantor', 'guarantor.hostToHost']);
      $guarantor = $submission->getRelation('guarantor');
      $hostToHost = $guarantor->getRelation('hostToHost');
      $url = $hostToHost->getAttribute('guarantor_url_host') . '/status';
      $prefix = $hostToHost->getAttribute('auth_prefix');
      $token = ($prefix ? $prefix . ' ' : '') . $hostToHost->getAttribute('token');
      $submissionId = $submission->getAttribute('id');

      $result = $this->hostToHostService->sendPostRequest($url, $token, ['submission_id' => $submissionId]);

      if ($result['status'] === 'success') {
        $data = $result['message'];
        // image is base64
        $imageString = $data['image'];
        // base64 to file
        $fileData = $this->base64ToFile($imageString);
        // save image to storage
        $url = $this->uploadFile($fileData, 'submission/callback', $submissionId . '-image-from-guarantor');
        $submission->update(['has_send_to_guarantor' => true]);
        SubmissionCallback::query()->updateOrCreate(
          ['submission_id' => $submissionId],
          [
            'doc_url' => $data['doc_url'],
            'url' => $url,
            'no_policy' => $data['policyno'],
          ]
        );

        return $this->responseSuccess('Berhasil Mengambil Data', $data);
      } else {
        throw new Exception('Gagal mengambil data dari pihak asuransi: ' . $result['message']);
      }
    } catch (Exception $e) {
      Log::error('Error decoding JSON: ', ['message' => $e->getMessage()]);

      return $this->responseError('Terjadi Kesalahan Saat Mengambil Data', 'Gagal mendekode data dari pihak asuransi');
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
      $qrHtml .= '<img src="' . e($qrUrl) . '" alt="QR Code" style="width:100px;height:100px;"><br>';
      $qrHtml .= '<small>Scan untuk verifikasi dokumen ini</small>';
      $qrHtml .= '</div>';

      if (str_contains($html, '</body>')) {
        $html = str_replace('</body>', $qrHtml . '</body>', $html);
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
      $submission->load('blanks');
      foreach ($submission->getRelation('blanks') as $blank) {
        $blank->update([
          'is_picked' => false,
          'is_used' => false,
          'is_broken' => false,
          'is_revised' => false,
        ]);
      }
      $submission->submissionBefore()->update([
        'is_revised' => false,
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
      'publication_date' => 'nullable|date',
      'publication_place' => 'nullable|string|max:255',
    ]);
    DB::beginTransaction();

    try {
      $submissionId = $request->get('submission_id');
      $publicationDate = $request->get('publication_date');
      $publicationPlace = $request->get('publication_place');
      $submission = Submission::query()->findOrFail($submissionId);

      $submission->update([
        'publication_date' => $publicationDate,
        'publication_place' => $publicationPlace,
      ]);

      $submissionId = $submission->getAttribute('id');

      $this->updatePublicationPlaceholders($submissionId, $publicationDate, $publicationPlace);

      DB::commit();

      flashMessage('success', 'Berhasil memperbarui data publikasi pengajuan');
    } catch (Exception $e) {
      DB::rollBack();
      $error = $this->handleErrorMessage($e);
      Log::error('Failed to delete submission', $error);
      flashMessage('error', 'Terjadi kesalahan saat mengupdate data', 'error');
    }
  }

  public function updatePublicationPlaceholders(int $submissionId, ?string $publicationDate, ?string $publicationPlace): void
  {
    DB::transaction(function () use ($submissionId, $publicationDate, $publicationPlace) {
      $submissionDocs = SubmissionDoc::query()->where('submission_id', $submissionId)->get();

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
    });
  }
}
