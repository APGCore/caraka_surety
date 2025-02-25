<?php

namespace App\Http\Controllers\Submission;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Submission\StoreRequest;
use App\Models\Document\DocumentFormat;
use App\Models\Document\RequiredDoc;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Product\Product;
use App\Models\Product\ProductType;
use App\Models\Profile\Profile;
use App\Models\RelatedParties\Obligee;
use App\Models\RelatedParties\Principal;
use App\Models\Scoring\Scoring;
use App\Models\Submission\SourceOfFund;
use App\Models\Submission\Submission;
use App\Models\Submission\SubmissionBlank;
use App\Models\Submission\SubmissionDoc;
use App\Models\User;
use App\Services\HostToHostService;
use App\Traits\GeneratePattern;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    use GeneratePattern;

    protected HostToHostService $hostToHostService;

    public function __construct(
        HostToHostService $hostToHostService
    ) {
        Carbon::setLocale('id');
        $this->hostToHostService = $hostToHostService;
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
                $ratio['current_assets'] = (int) $ratio['current_assets'];
                $ratio['current_debt'] = (int) $ratio['current_debt'];
                $ratio['total_debt'] = (int) $ratio['total_debt'];
                $ratio['total_assets'] = (int) $ratio['total_assets'];
                $ratio['revenue'] = (int) $ratio['revenue'];
                $ratio['net_income'] = (int) $ratio['net_income'];

                return $ratio;
            })->toArray();

            $obligee = $validated['obligee'];
            $submission = $validated['submission'];
            $scoring = $validated['scoring'];

            // get user staff
            $staff = auth()->user();
            $profile = Profile::query()
                ->find($staff->profile_id);

            // get blanks
            $blank = Blank::query()
                ->where([
                    'guarantor_id' => $submission['guarantor_id'],
                    'profile_id' => $profile->id,
                    'is_used' => false,
                    'is_broken' => false,
                    'is_approved' => true,
                ])
                ->orderBy('created_at')
                ->first();

            // error when $blanks is empty
            if (! $blank) {
                throw new \Exception('Blangko belum tersedia');
            }

            // update blank
            $blank->update([
                'is_used' => true,
            ]);

            //            $createPrincipal = Principal::query()
            //                ->with(['documents', 'principalRatios'])
            //                ->updateOrCreate([
            //                    'id' => $principal['id'] ?? null,
            //                ], collect($principal)->toArray());

            $principal = Principal::query()->firstWhere('id', $principalId);
            // create principal ratios
            foreach ($principalRatios as $principalRatio) {
                $principal?->principalRatios()
                    ->updateOrCreate([
                        'year' => $principalRatio['year'],
                    ], $principalRatio);
            }

            // create principal document
            //            foreach ($principalDocuments as $principalDocument) {
            //                $document = collect($principalDocument)->toArray();
            //                $document['name'] = $document['required_doc_name'];
            //                $document['is_approved'] = true;
            //                $principalName = $principal['name'] ? str_replace(' ', '_', $principal['name']) : 'principal';
            //                $path = "principal/{$createPrincipal->id}-{$principalName}/documents";
            //
            //                $existingDocument = $createPrincipal->documents()
            //                    ->where('required_doc_id', $principalDocument['required_doc_id'])
            //                    ->first();
            //
            //                if ($existingDocument && $existingDocument->url) {
            //                    $this->deleteFile($existingDocument->url);
            //                }
            //
            //                $document['url'] = $this->uploadFile(
            //                    $document['file'],
            //                    $path,
            //                    $document['required_doc_name']
            //                );
            //
            //                $createPrincipal->documents()
            //                    ->updateOrCreate([
            //                        'required_doc_id' => $principalDocument['required_doc_id'],
            //                    ], $document);
            //            }

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

            $noGuarantee = $this->generateNoGuarantee($guarantorHead, $guarantorToProductType, $guarantorBranchId, $blank, $profile);

            // prepare create submission
            $dataSubmission = collect($submission)->toArray();
            $dataSubmission['guarantor_to_product_type_id'] = $guarantorToProductType->id;
            $dataSubmission['principal_id'] = $principalId;
            $dataSubmission['staff_id'] = auth()->id();
            $dataSubmission['obligee_id'] = $obligee->getAttribute('id');
            $dataSubmission['no_guarantee'] = $noGuarantee;
            $dataSubmission['note_scoring'] = $scoring['note'];
            $modelScoring = Scoring::query()->find($scoring['id']);
            $dataSubmission['min_point_scoring'] = $modelScoring?->min_point;
            $dataSubmission['contract_doc_date'] = $submission['contract_doc_date'] ? Carbon::parse($submission['contract_doc_date'])->format('Y-m-d') : null;
            $dataSubmission['start_date'] = $submission['start_date'] ? Carbon::parse($submission['start_date'])->format('Y-m-d H:i:s') : null;
            $dataSubmission['end_date'] = $submission['end_date'] ? Carbon::parse($submission['end_date'])->format('Y-m-d H:i:s') : null;
            $dataSubmission['contract_value'] = $this->currencyConvert($submission['contract_value']);
            $dataSubmission['guarantee_value'] = $this->currencyConvert($submission['guarantee_value']);
            $scores = $scoring['scores'];
            if (collect($scores)->sum('point') > $dataSubmission['min_point_scoring']) {
                $dataSubmission['checked_by'] = auth()->user()->head_id;
                $dataSubmission['checked_at'] = now()->format('Y-m-d H:i:s');
            }

            $submission = Submission::query()->with(['blanks', 'scores'])->create($dataSubmission);

            // create submission blangko
            SubmissionBlank::query()->create([
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
            flashMessage('success', 'Berhasil membuat pengajuan');
            DB::commit();

            return redirect()->back()->with('success', 'Berhasil membuat pengajuan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('SubmissionController@store: ', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            if (str_contains($e->getMessage(), 'Blangko')) {
                flashMessage('Blangko Kosong', $e->getMessage(), 'error');

                return redirect()->back()->withErrors(['error' => $e->getMessage()]);
            } else {
                flashMessage('Error', 'Gagal membuat pengajuan', 'error');

                return redirect()->back()->withErrors(['error' => 'Gagal membuat pengajuan']);
            }
        }
    }

    private function getSubmission($id)
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
            'guarantorToProductType' => function ($query) {
                $query->withTrashed();
            },
            'obligee' => function ($query) {
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
            'submissionDocs' => function ($query) {
                $query->withTrashed();
            },
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
        ])->findOrFail($id);
    }

    /**
     * Display the specified resource.
     */
    public function showDetailSubmission($id)
    {
        $submission = $this->getSubmission($id);
        $submission->mail_number = $this->generateNomorSurat($id);

        $principalDocs = collect($submission->principal->documents);

        $submission->document_format_guarantor = $submission->guarantor->documentFormats;
        $submission->document_format_product = $submission->product->documentFormats;
        $submission->document_format_type_guarantee = $submission->guarantorToProductType->documentFormats;
        $submission->required_docs = RequiredDoc::query()->get(['id', 'product_type_id', 'name', 'description', 'created_at'])
            ->map(function ($doc) use ($principalDocs) {
                $principalDoc = $principalDocs->firstWhere('required_doc_id', $doc->id);
                if ($principalDoc) {
                    $doc->name = $principalDoc->name;
                    $doc->url = Storage::url($principalDoc->url);
                }

                return $doc;
            });

        $submission->principal->ratios = collect($submission->principal->principalRatios)->take(2);

        $submission->contract_value_formatted = $this->formatCurrency($submission->contract_value);
        $submission->guarantee_value_formatted = $this->formatCurrency($submission->guarantee_value);

        $submission->analyst_name = $submission->staff->name;

        $submission->scores->map(function ($score) {
            $score->category_name = $score->scoringQuestionCategory->name ?? '-';
            $score->question_name = $score->scoringQuestion->name ?? '-';
            $score->option_name = $score->scoringOption->name ?? '-';

            return $score;
        });

        // GET DOC FORMAT ANALYSIS
        $submission->document_format_analysis = DocumentFormat::whereNull('guarantor_id')
            ->whereNull('product_id')
            ->whereNull('guarantor_to_product_type_id')
            ->first();

        // SCORING RESULT
        $analysis = ['character' => 0, 'capacity' => 0, 'capital' => 0, 'condition' => 0, 'collateral' => 0];

        $submission->scoring_result = $submission->scores->reduce(function ($grouped, $score) use (&$analysis) {
            $categoryId = $score->scoring_question_category_id;
            $category = $score->scoringQuestionCategory;

            if (! isset($grouped[$categoryId])) {
                $grouped[$categoryId] = [
                    'id' => $categoryId,
                    'name' => $category->name,
                    'items' => [],
                ];
            }

            $grouped[$categoryId]['items'][] = $score;

            switch ($category->name) {
                case 'Character':
                    $analysis['character'] += $score->point ?? 0;
                    break;
                case 'Capacity':
                    $analysis['capacity'] += $score->point ?? 0;
                    break;
                case 'Capital':
                    $analysis['capital'] += $score->point ?? 0;
                    break;
                case 'Condition':
                    $analysis['condition'] += $score->point ?? 0;
                    break;
                case 'Collateral':
                    $analysis['collateral'] += $score->point ?? 0;
                    break;
            }

            return $grouped;
        }, []);

        $submission->analysis = $analysis;

        // Hitung total skoring
        $totalScore = array_sum($analysis);

        // Tentukan notes dan recommendation
        if ($totalScore > 60 && $totalScore < 100) {
            $submission->notes = 'Dipertimbangkan untuk disetujui';
            $submission->recommendation = 'disetujui';
        } elseif ($totalScore <= 60) {
            $submission->notes = 'Dipertimbangkan untuk ditambahkan mitigasi risiko';
            $submission->recommendation = 'ditolak';
        } else {
            $submission->notes = 'Skoring tidak valid';
            $submission->recommendation = 'ditolak';
        }

        $submission->total_score = $totalScore;

        // GET EXPERIENCE
        $approvedSubmissionsExp = Submission::where('status', 'approved')
            ->where(function ($query) use ($submission) {
                $query->where('principal_id', $submission->principal_id)
                    ->orWhere('obligee_id', $submission->obligee_id);
            })
            ->with(['obligee'])
            ->get()
            ->map(function ($submission) use (&$index) {
                $index++;

                return "<tr style='text-align: left;'>
                            <td style='text-align: center;'>{$index}</td>
                            <td>{$submission->obligee->name}</td>
                            <td>{$submission->job_name}</td>
                            <td>Rp. ".number_format($submission->contract_value, 0, ',', '.').'</td>
                            <td>'.date('Y', strtotime($submission->approved_at)).'</td>
                        </tr>';
            })->implode('');

        $submission->get_exp = "
            <table style='width: 100%; border-collapse: collapse; text-align: center;' border='1'>
                <tr>
                    <td colspan='5' style='border-left: 1px solid black; border-right: 1px solid black; text-align: center;'>
                        <strong>PENGALAMAN KERJA</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan='5' style='text-align:left'>
                        <strong>Berikut Pengalaman Kerja PT {$submission->principal->name}</strong>
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
        $principal = $submission->principal;

        $pengurus = collect();

        if (! empty($principal->director_name)) {
            $pengurus->push(['nama' => $principal->director_name, 'jabatan' => 'Direktur']);
        }
        if (! empty($principal->commissioner)) {
            $pengurus->push(['nama' => $principal->commissioner, 'jabatan' => 'Komisaris']);
        }

        if (! empty($principal->head_name)) {
            $pengurus->push(['nama' => $principal->head_name, 'jabatan' => 'Kepala Cabang']);
        }

        $susunanPengurus = $pengurus->map(function ($pengurus, $index) {
            return "<tr>
                        <td style='text-align: center; vertical-align: middle;'>".($index + 1)."</td>
                        <td>{$pengurus['nama']}</td>
                        <td>{$pengurus['jabatan']}</td>
                    </tr>";
        })->implode('');

        $submission->get_administators_principal = "
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

        $submission->principal->approved_submissions = $submission->principal->approvedSubmissions()
            ->select(['id', 'contract_doc_name', 'contract_doc_number', 'contract_value', 'status', 'created_at'])
            ->with('obligee')
            ->get();

        // number surat
        $submission->mail_number_resume = $this->generateNomorSuratResume($submission->id, $submission->created_at);
        // tanggal pengajuan
        $submission->submission_date = Carbon::parse($submission->created_at)->translatedFormat('d F Y');

        $submission->start_date = Carbon::parse($submission->start_date)->translatedFormat('d F Y');
        $submission->end_date = Carbon::parse($submission->end_date)->translatedFormat('d F Y');
        $submission->guarantee_issue_date = Carbon::parse($submission->approved_at)->translatedFormat('d F Y');
        $submission->day_name = Carbon::parse($submission->approved_at)->translatedFormat('l');

        return inertia('staff/submission-management/history/detail/index', [
            'submission' => fn () => $submission,
        ]);
    }

    public function showDetailDocsSubmission($id)
    {
        $submission = Submission::with(['principal', 'guarantorToProductType'])
            ->findOrFail($id);

        return inertia('staff/submission-management/document-draft/detail/index', [
            'submission' => fn () => $submission,
        ]);
    }

    public function showDetailSubmissionManager($id)
    {
        $submission = $this->getSubmission($id);
        $submission->mail_number = $this->generateNomorSurat($id);

        $submission->employee_limit = $submission->employeeLimit->firstWhere('employee_id', auth()->id());

        $submission->document_format_analysis = DocumentFormat::whereNull('guarantor_id')
            ->whereNull('product_id')
            ->whereNull('guarantor_to_product_type_id')
            ->first();

        $submission->product_limit = $submission->guarantorProductTypeLimit;
        $submission->document_format_guarantor = $submission->guarantor->documentFormats;
        $submission->document_format_product = $submission->product->documentFormats;
        $submission->document_format_type_guarantee = $submission->guarantorToProductType->documentFormats;
        $submission->approved_by_direksi = $submission->userApproved && $submission->userApproved->role->name === 'direksi';
        $submission->beyond_the_limit = ($submission->employee_limit?->limit ?? 0) < $submission->guarantee_value;
        $principalDocs = collect($submission->principal->documents);
        $submission->required_docs = RequiredDoc::query()->get(['id', 'product_type_id', 'name', 'description', 'created_at'])
            ->map(function ($doc) use ($principalDocs) {
                $principalDoc = $principalDocs->firstWhere('required_doc_id', $doc->id);
                if ($principalDoc) {
                    $doc->name = $principalDoc->name;
                    $doc->url = Storage::url($principalDoc->url);
                }

                return $doc;
            });
        $submission->submission_docs = $submission->submissionDocs->map(function ($docSig) {
            $docSig->url = Storage::url($docSig->url);

            return $docSig;
        });
        $submission->principal->ratios = collect($submission->principal->principalRatios)->take(2);
        ($submission->principal->principalRatios);

        $submission->contract_value_formatted = $this->formatCurrency($submission->contract_value);
        $submission->guarantee_value_formatted = $this->formatCurrency($submission->guarantee_value);
        $submission->analyst_name = $submission->staff->name;

        $submission->scores->map(function ($score) {
            $score->category_name = $score->scoringQuestionCategory->name ?? '-';
            $score->question_name = $score->scoringQuestion->name ?? '-';
            $score->option_name = $score->scoringOption->name ?? '-';

            return $score;
        });

        // GET DOC FORMAT ANALYSIS
        $submission->document_format_analysis = DocumentFormat::whereNull('guarantor_id')
            ->whereNull('product_id')
            ->whereNull('guarantor_to_product_type_id')
            ->first();

        // SCORING RESULT
        $analysis = ['character' => 0, 'capacity' => 0, 'capital' => 0, 'condition' => 0, 'collateral' => 0];

        $submission->scoring_result = $submission->scores->reduce(function ($grouped, $score) use (&$analysis) {
            $categoryId = $score->scoring_question_category_id;
            $category = $score->scoringQuestionCategory;

            if (! isset($grouped[$categoryId])) {
                $grouped[$categoryId] = [
                    'id' => $categoryId,
                    'name' => $category->name,
                    'items' => [],
                ];
            }

            $grouped[$categoryId]['items'][] = $score;

            switch ($category->name) {
                case 'Character':
                    $analysis['character'] += $score->point ?? 0;
                    break;
                case 'Capacity':
                    $analysis['capacity'] += $score->point ?? 0;
                    break;
                case 'Capital':
                    $analysis['capital'] += $score->point ?? 0;
                    break;
                case 'Condition':
                    $analysis['condition'] += $score->point ?? 0;
                    break;
                case 'Collateral':
                    $analysis['collateral'] += $score->point ?? 0;
                    break;
            }

            return $grouped;
        }, []);

        $submission->analysis = $analysis;

        // Hitung total skoring
        $totalScore = array_sum($analysis);

        // Tentukan notes dan recommendation
        if ($totalScore > 60 && $totalScore < 100) {
            $submission->notes = 'Dipertimbangkan untuk disetujui';
            $submission->recommendation = 'disetujui';
        } elseif ($totalScore <= 60) {
            $submission->notes = 'Dipertimbangkan untuk ditambahkan mitigasi risiko';
            $submission->recommendation = 'ditolak';
        } else {
            $submission->notes = 'Skoring tidak valid';
            $submission->recommendation = 'ditolak';
        }

        $submission->total_score = $totalScore;

        // GET EXPERIENCE
        $approvedSubmissionsExp = Submission::where('status', 'approved')
            ->where(function ($query) use ($submission) {
                $query->where('principal_id', $submission->principal_id)
                    ->orWhere('obligee_id', $submission->obligee_id);
            })
            ->with(['obligee'])
            ->get()
            ->map(function ($submission) use (&$index) {
                $index++;

                return "<tr style='text-align: left;'>
                            <td style='text-align: center;'>{$index}</td>
                            <td>{$submission->obligee->name}</td>
                            <td>{$submission->job_name}</td>
                            <td>Rp. ".number_format($submission->contract_value, 0, ',', '.').'</td>
                            <td>'.date('Y', strtotime($submission->approved_at)).'</td>
                        </tr>';
            })->implode('');

        $submission->get_exp = "
            <table style='width: 100%; border-collapse: collapse; text-align: center;' border='1'>
                <tr>
                    <td colspan='5' style='border-left: 1px solid black; border-right: 1px solid black; text-align: center;'>
                        <strong>PENGALAMAN KERJA</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan='5' style='text-align:left'>
                        <strong>Berikut Pengalaman Kerja PT {$submission->principal->name}</strong>
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
        $principal = $submission->principal;

        $pengurus = collect();

        if (! empty($principal->director_name)) {
            $pengurus->push(['nama' => $principal->director_name, 'jabatan' => 'Direktur']);
        }
        if (! empty($principal->commissioner)) {
            $pengurus->push(['nama' => $principal->commissioner, 'jabatan' => 'Komisaris']);
        }

        if (! empty($principal->head_name)) {
            $pengurus->push(['nama' => $principal->head_name, 'jabatan' => 'Kepala Cabang']);
        }

        $susunanPengurus = $pengurus->map(function ($pengurus, $index) {
            return "<tr>
                        <td style='text-align: center; vertical-align: middle;'>".($index + 1)."</td>
                        <td>{$pengurus['nama']}</td>
                        <td>{$pengurus['jabatan']}</td>
                    </tr>";
        })->implode('');

        $submission->get_administators_principal = "
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

        $submission->principal->approved_submissions = $submission->principal->approvedSubmissions()
            ->select(['id', 'contract_doc_name', 'contract_doc_number', 'contract_value', 'status', 'created_at'])
            ->with('obligee')
            ->get();

        // number surat
        $submission->mail_number_resume = $this->generateNomorSuratResume($submission->id, $submission->created_at);
        // tanggal pengajuan
        $submission->submission_date = Carbon::parse($submission->created_at)->translatedFormat('d F Y');

        $submission->start_date = Carbon::parse($submission->start_date)->translatedFormat('d F Y');
        $submission->end_date = Carbon::parse($submission->end_date)->translatedFormat('d F Y');
        $submission->guarantee_issue_date = Carbon::parse($submission->approved_at)->translatedFormat('d F Y');
        $submission->day_name = Carbon::parse($submission->approved_at)->translatedFormat('l');

        return inertia('manager/submission-management/detail/index', [
            'submission' => fn () => $submission,
        ]);
    }

    public function showDetailDocsSubmissionManager($id)
    {
        $submission = SubmissionDoc::with(['requiredDoc'])
            ->findOrFail($id);

        return inertia('manager/submission-management/document-draft/detail/index', [
            'submission' => fn () => $submission,
        ]);
    }

    public function showDetailSubmissionDireksi($id)
    {
        $submission = $this->getSubmission($id);
        $submission->mail_number = $this->generateNomorSurat($id);

        $submission->employee_limit = $submission->employeeLimit->firstWhere('employee_id', auth()->id());
        $submission->product_limit = $submission->guarantorProductTypeLimit;

        $submission->document_format_guarantor = $submission->guarantor->documentFormats;
        $submission->document_format_product = $submission->product->documentFormats;
        $submission->document_format_type_guarantee = $submission->guarantorToProductType->documentFormats;
        $submission->beyond_the_limit = ($submission->employee_limit?->limit ?? 0) < $submission->guarantee_value;
        $principalDocs = collect($submission->principal->documents);
        $submission->required_docs = RequiredDoc::query()->get(['id', 'product_type_id', 'name', 'description', 'created_at'])
            ->map(function ($doc) use ($principalDocs) {
                $principalDoc = $principalDocs->firstWhere('required_doc_id', $doc->id);
                if ($principalDoc) {
                    $doc->name = $principalDoc->name;
                    $doc->url = Storage::url($principalDoc->url);
                }

                return $doc;
            });
        $submission->principal->ratios = collect($submission->principal->principalRatios)->take(2);
        ($submission->principal->principalRatios);

        $submission->contract_value_formatted = $this->formatCurrency($submission->contract_value);
        $submission->guarantee_value_formatted = $this->formatCurrency($submission->guarantee_value);
        $submission->analyst_name = $submission->staff->name;

        $submission->scores->map(function ($score) {
            $score->category_name = $score->scoringQuestionCategory->name ?? '-';
            $score->question_name = $score->scoringQuestion->name ?? '-';
            $score->option_name = $score->scoringOption->name ?? '-';

            return $score;
        });

        // GET DOC FORMAT ANALYSIS
        $submission->document_format_analysis = DocumentFormat::whereNull('guarantor_id')
            ->whereNull('product_id')
            ->whereNull('guarantor_to_product_type_id')
            ->first();

        // SCORING RESULT
        $analysis = ['character' => 0, 'capacity' => 0, 'capital' => 0, 'condition' => 0, 'collateral' => 0];

        $submission->scoring_result = $submission->scores->reduce(function ($grouped, $score) use (&$analysis) {
            $categoryId = $score->scoring_question_category_id;
            $category = $score->scoringQuestionCategory;

            if (! isset($grouped[$categoryId])) {
                $grouped[$categoryId] = [
                    'id' => $categoryId,
                    'name' => $category->name,
                    'items' => [],
                ];
            }

            $grouped[$categoryId]['items'][] = $score;

            switch ($category->name) {
                case 'Character':
                    $analysis['character'] += $score->point ?? 0;
                    break;
                case 'Capacity':
                    $analysis['capacity'] += $score->point ?? 0;
                    break;
                case 'Capital':
                    $analysis['capital'] += $score->point ?? 0;
                    break;
                case 'Condition':
                    $analysis['condition'] += $score->point ?? 0;
                    break;
                case 'Collateral':
                    $analysis['collateral'] += $score->point ?? 0;
                    break;
            }

            return $grouped;
        }, []);

        $submission->analysis = $analysis;

        // Hitung total skoring
        $totalScore = array_sum($analysis);

        // Tentukan notes dan recommendation
        if ($totalScore > 60 && $totalScore < 100) {
            $submission->notes = 'Dipertimbangkan untuk disetujui';
            $submission->recommendation = 'disetujui';
        } elseif ($totalScore <= 60) {
            $submission->notes = 'Dipertimbangkan untuk ditambahkan mitigasi risiko';
            $submission->recommendation = 'ditolak';
        } else {
            $submission->notes = 'Skoring tidak valid';
            $submission->recommendation = 'ditolak';
        }

        $submission->total_score = $totalScore;

        // GET EXPERIENCE
        $approvedSubmissionsExp = Submission::where('status', 'approved')
            ->where(function ($query) use ($submission) {
                $query->where('principal_id', $submission->principal_id)
                    ->orWhere('obligee_id', $submission->obligee_id);
            })
            ->with(['obligee'])
            ->get()
            ->map(function ($submission) use (&$index) {
                $index++;

                return "<tr style='text-align: left;'>
                            <td style='text-align: center;'>{$index}</td>
                            <td>{$submission->obligee->name}</td>
                            <td>{$submission->job_name}</td>
                            <td>Rp. ".number_format($submission->contract_value, 0, ',', '.').'</td>
                            <td>'.date('Y', strtotime($submission->approved_at)).'</td>
                        </tr>';
            })->implode('');

        $submission->get_exp = "
            <table style='width: 100%; border-collapse: collapse; text-align: center;' border='1'>
                <tr>
                    <td colspan='5' style='border-left: 1px solid black; border-right: 1px solid black; text-align: center;'>
                        <strong>PENGALAMAN KERJA</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan='5' style='text-align:left'>
                        <strong>Berikut Pengalaman Kerja PT {$submission->principal->name}</strong>
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
        $principal = $submission->principal;

        $pengurus = collect();

        if (! empty($principal->director_name)) {
            $pengurus->push(['nama' => $principal->director_name, 'jabatan' => 'Direktur']);
        }
        if (! empty($principal->commissioner)) {
            $pengurus->push(['nama' => $principal->commissioner, 'jabatan' => 'Komisaris']);
        }

        if (! empty($principal->head_name)) {
            $pengurus->push(['nama' => $principal->head_name, 'jabatan' => 'Kepala Cabang']);
        }

        $susunanPengurus = $pengurus->map(function ($pengurus, $index) {
            return "<tr>
                        <td style='text-align: center; vertical-align: middle;'>".($index + 1)."</td>
                        <td>{$pengurus['nama']}</td>
                        <td>{$pengurus['jabatan']}</td>
                    </tr>";
        })->implode('');

        $submission->get_administators_principal = "
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

        $submission->principal->approved_submissions = $submission->principal->approvedSubmissions()
            ->select(['id', 'contract_doc_name', 'contract_doc_number', 'contract_value', 'status', 'created_at'])
            ->with('obligee')
            ->get();

        // number surat
        $submission->mail_number_resume = $this->generateNomorSuratResume($submission->id, $submission->created_at);
        // tanggal pengajuan
        $submission->submission_date = Carbon::parse($submission->created_at)->translatedFormat('d F Y');

        $submission->start_date = Carbon::parse($submission->start_date)->translatedFormat('d F Y');
        $submission->end_date = Carbon::parse($submission->end_date)->translatedFormat('d F Y');
        $submission->guarantee_issue_date = Carbon::parse($submission->approved_at)->translatedFormat('d F Y');
        $submission->day_name = Carbon::parse($submission->approved_at)->translatedFormat('l');

        return inertia('direksi/submission-management/history/detail/index', [
            'submission' => $submission,
        ]);
    }

    public function showDetailDocsSubmissionDireksi($id)
    {
        $submission = Submission::with(['principal', 'guarantorToProductType'])
            ->findOrFail($id);

        return inertia('direksi/submission-management/document-draft/detail/index', [
            'submission' => fn () => $submission,
        ]);
    }

    public function showDetailSubmissionKepalaCabang($id)
    {
        $submission = $this->getSubmission($id);
        $submission->mail_number = $this->generateNomorSurat($id);

        $employeeLimit = $submission->employeeLimit->firstWhere('employee_id', auth()->id()) ?? 0;
        $submission->product_limit = $submission->guarantorProductTypeLimit;
        $submission->document_format_analysis = DocumentFormat::whereNull('guarantor_id')
            ->whereNull('product_id')
            ->whereNull('guarantor_to_product_type_id')
            ->first();
        $submission->document_format_guarantor = $submission->guarantor->documentFormats;
        $submission->document_format_product = $submission->product->documentFormats;
        $submission->document_format_type_guarantee = $submission->guarantorToProductType->documentFormats;
        $submission->approved_by_direksi = $submission->userApproved && $submission->userApproved->role->name === 'direksi';
        $submission->limit = $employeeLimit;
        $submission->beyond_the_limit = $employeeLimit < $submission->guarantee_value;
        $principalDocs = collect($submission->principal->documents);
        $submission->required_docs = RequiredDoc::query()->get(['id', 'product_type_id', 'name', 'description', 'created_at'])
            ->map(function ($doc) use ($principalDocs) {
                $principalDoc = $principalDocs->firstWhere('required_doc_id', $doc->id);
                if ($principalDoc) {
                    $doc->name = $principalDoc->name;
                    $doc->url = Storage::url($principalDoc->url);
                }

                return $doc;
            });
        $submission->submission_docs = $submission->submissionDocs->map(function ($docSig) {
            $docSig->url = Storage::url($docSig->url);

            return $docSig;
        });
        $submission->principal->ratios = collect($submission->principal->principalRatios)->take(2);
        ($submission->principal->principalRatios);

        $submission->contract_value_formatted = $this->formatCurrency($submission->contract_value);
        $submission->guarantee_value_formatted = $this->formatCurrency($submission->guarantee_value);

        $submission->scores->map(function ($score) {
            $score->category_name = $score->scoringQuestionCategory->name ?? '-';
            $score->question_name = $score->scoringQuestion->name ?? '-';
            $score->option_name = $score->scoringOption->name ?? '-';

            return $score;
        });

        // GET DOC FORMAT ANALYSIS
        $submission->document_format_analysis = DocumentFormat::whereNull('guarantor_id')
            ->whereNull('product_id')
            ->whereNull('guarantor_to_product_type_id')
            ->first();

        // SCORING RESULT
        $analysis = ['character' => 0, 'capacity' => 0, 'capital' => 0, 'condition' => 0, 'collateral' => 0];

        $submission->scoring_result = $submission->scores->reduce(function ($grouped, $score) use (&$analysis) {
            $categoryId = $score->scoring_question_category_id;
            $category = $score->scoringQuestionCategory;

            if (! isset($grouped[$categoryId])) {
                $grouped[$categoryId] = [
                    'id' => $categoryId,
                    'name' => $category->name,
                    'items' => [],
                ];
            }

            $grouped[$categoryId]['items'][] = $score;

            switch ($category->name) {
                case 'Character':
                    $analysis['character'] += $score->point ?? 0;
                    break;
                case 'Capacity':
                    $analysis['capacity'] += $score->point ?? 0;
                    break;
                case 'Capital':
                    $analysis['capital'] += $score->point ?? 0;
                    break;
                case 'Condition':
                    $analysis['condition'] += $score->point ?? 0;
                    break;
                case 'Collateral':
                    $analysis['collateral'] += $score->point ?? 0;
                    break;
            }

            return $grouped;
        }, []);

        $submission->analysis = $analysis;

        // Hitung total skoring
        $totalScore = array_sum($analysis);

        // Tentukan notes dan recommendation
        if ($totalScore > 60 && $totalScore < 100) {
            $submission->notes = 'Dipertimbangkan untuk disetujui';
            $submission->recommendation = 'disetujui';
        } elseif ($totalScore <= 60) {
            $submission->notes = 'Dipertimbangkan untuk ditambahkan mitigasi risiko';
            $submission->recommendation = 'ditolak';
        } else {
            $submission->notes = 'Skoring tidak valid';
            $submission->recommendation = 'ditolak';
        }

        $submission->total_score = $totalScore;

        // GET EXPERIENCE
        $approvedSubmissionsExp = Submission::where('status', 'approved')
            ->where(function ($query) use ($submission) {
                $query->where('principal_id', $submission->principal_id)
                    ->orWhere('obligee_id', $submission->obligee_id);
            })
            ->with(['obligee'])
            ->get()
            ->map(function ($submission) use (&$index) {
                $index++;

                return "<tr style='text-align: left;'>
                            <td style='text-align: center;'>{$index}</td>
                            <td>{$submission->obligee->name}</td>
                            <td>{$submission->job_name}</td>
                            <td>Rp. ".number_format($submission->contract_value, 0, ',', '.').'</td>
                            <td>'.date('Y', strtotime($submission->approved_at)).'</td>
                        </tr>';
            })->implode('');

        $submission->get_exp = "
            <table style='width: 100%; border-collapse: collapse; text-align: center;' border='1'>
                <tr>
                    <td colspan='5' style='border-left: 1px solid black; border-right: 1px solid black; text-align: center;'>
                        <strong>PENGALAMAN KERJA</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan='5' style='text-align:left'>
                        <strong>Berikut Pengalaman Kerja PT {$submission->principal->name}</strong>
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
        $principal = $submission->principal;

        $pengurus = collect();

        if (! empty($principal->director_name)) {
            $pengurus->push(['nama' => $principal->director_name, 'jabatan' => 'Direktur']);
        }
        if (! empty($principal->commissioner)) {
            $pengurus->push(['nama' => $principal->commissioner, 'jabatan' => 'Komisaris']);
        }

        if (! empty($principal->head_name)) {
            $pengurus->push(['nama' => $principal->head_name, 'jabatan' => 'Kepala Cabang']);
        }

        $susunanPengurus = $pengurus->map(function ($pengurus, $index) {
            return "<tr>
                        <td style='text-align: center; vertical-align: middle;'>".($index + 1)."</td>
                        <td>{$pengurus['nama']}</td>
                        <td>{$pengurus['jabatan']}</td>
                    </tr>";
        })->implode('');

        $submission->get_administators_principal = "
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

        $submission->principal->approved_submissions = $submission->principal->approvedSubmissions()
            ->select(['id', 'contract_doc_name', 'contract_doc_number', 'contract_value', 'status', 'created_at'])
            ->with('obligee')
            ->get();

        // number surat
        $submission->mail_number_resume = $this->generateNomorSuratResume($submission->id, $submission->created_at);
        // tanggal pengajuan
        $submission->submission_date = Carbon::parse($submission->created_at)->translatedFormat('d F Y');

        $submission->start_date = Carbon::parse($submission->start_date)->translatedFormat('d F Y');
        $submission->end_date = Carbon::parse($submission->end_date)->translatedFormat('d F Y');
        $submission->guarantee_issue_date = Carbon::parse($submission->approved_at)->translatedFormat('d F Y');
        $submission->day_name = Carbon::parse($submission->approved_at)->translatedFormat('l');

        return inertia('kepala-cabang/submission-management/detail/index', [
            'submission' => fn () => $submission,
        ]);
    }

    public function displayCreateByStaff()
    {
        $component = 'staff/submission-management/create/index';

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Buat Pengajuan',
            ],
        ]);
    }

    public function displayHistoryByStaff()
    {
        $component = 'staff/submission-management/history/index';

        $authId = auth()->id();
        $submissions = Submission::query()
            ->where('guarantor_id', session('guarantor_id'))
            ->where('staff_id', '=', $authId)
            ->with(['scores', 'principal', 'bank', 'obligee', 'sourceOfFund', 'guarantor', 'guarantorToProductType'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($submission) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');

                return [
                    ...$submission->toArray(),
                    'created_at' => $date,
                ];
            });

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Histori Pengajuan',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displayDocumentDraftByStaff()
    {
        $component = 'manager/submission-management/document-draft/index';

        $submissions = Submission::whereHas('submissionDocs')
            ->with(['submissionDocs', 'principal'])
            ->get();

        $submissions->transform(function ($submission) {
            $submission->submission_date = Carbon::parse($submission->created_at)->translatedFormat('d F Y');

            return $submission;
        });

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Draft Dokumen Pengajuan',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displaySubmissionByManager()
    {
        $component = 'manager/submission-management/list/index';

        $authId = auth()->id();
        $staffs = User::query()
            ->where('head_id', $authId)
            ->pluck('id');

        $submissions = Submission::query()
            ->where('guarantor_id', session('guarantor_id'))
            ->whereIn('staff_id', $staffs)
            ->where([
                'checked_by' => null,
                'approved_by' => null,
                'rejected_by' => null,
            ])
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
            ->get()
            ->map(function ($submission) use ($authId) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');
                $managerLimit = $submission->employeeLimit->firstWhere('employee_id', $authId);
                $productLimit = $submission->guarantorProductTypeLimit;

                return array_merge($submission->toArray(), [
                    'manager_limit' => $managerLimit?->limit ?? 0,
                    'product_limit' => $productLimit?->limit ?? 0,
                    'product_limit_inherit' => $productLimit?->limit_inherit ?? 0,
                    'beyond_the_limit' => ($managerLimit?->limit ?? 0) < $submission->guarantee_value,
                    'created_at' => $date,
                ]);
            });

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'List Pengajuan Masuk',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displayHistoryByManager()
    {
        $component = 'manager/submission-management/history/index';

        $authId = auth()->id();
        $submissions = Submission::query()
            ->where('guarantor_id', session('guarantor_id'))
            ->where(function ($query) use ($authId) {
                $query->where('checked_by', '=', $authId)
                    ->orWhere('approved_by', '=', $authId)
                    ->orWhere('rejected_by', '=', $authId);
            })
            ->with(['scores', 'principal', 'bank', 'obligee', 'sourceOfFund', 'guarantor', 'guarantorToProductType', 'employeeLimit', 'guarantorProductTypeLimit'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($submission) use ($authId) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');
                $submission->contract_value_formatted = $this->formatCurrency($submission->contract_value);
                $submission->guarantee_value_formatted = $this->formatCurrency($submission->guarantee_value);
                $managerLimit = $submission->employeeLimit->firstWhere('employee_id', $authId);
                $productLimit = $submission->guarantorProductTypeLimit;

                return array_merge($submission->toArray(), [
                    'manager_limit' => $managerLimit?->limit ?? 0,
                    'product_limit' => $productLimit?->limit ?? 0,
                    'product_limit_inherit' => $productLimit?->limit_inherit ?? 0,
                    'beyond_the_limit' => ($managerLimit?->limit ?? 0) < $submission->guarantee_value,
                    'created_at' => $date,
                ]);
            });

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'List Hasil Pengajuan',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displaySubmissionByDireksi()
    {
        $component = 'direksi/submission-management/list/index';

        $authId = auth()->id();
        $staffs = User::query()
            ->where('head_id', '=', $authId)
            ->pluck('id');

        $submissions = Submission::query()
            ->where('guarantor_id', session('guarantor_id'))
            ->where('checked_by', '!=', null)
            ->where('status', SubmissionStatus::PROCESS->value)
            ->whereIn('checked_by', $staffs)
            ->with(['principal', 'guarantorToProductType', 'employeeLimit', 'guarantorProductTypeLimit', 'staff.office'])
            ->get()
            ->map(function ($submission) use ($authId) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');
                $direksiLimit = $submission->employeeLimit->firstWhere('employee_id', $authId);
                $productLimit = $submission->guarantorProductTypeLimit;
                $office = $submission->staff->office;

                return [
                    'id' => $submission->id,
                    'principal' => $submission->principal,
                    'guarantor_to_product_type' => $submission->guarantorToProductType,
                    'guarantee_value' => $submission->guarantee_value,
                    'status' => $submission->status,
                    'direksi_limit' => $direksiLimit?->limit ?? 0,
                    'product_limit' => $productLimit?->limit ?? 0,
                    'product_limit_inherit' => $productLimit?->limit_inherit ?? 0,
                    'beyond_the_limit' => ($direksiLimit?->limit ?? 0) < $submission->guarantee_value,
                    'office' => $office,
                    'created_at' => $date,
                ];
            });

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'List Pengajuan',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displayHistoryByDireksi()
    {
        $component = 'direksi/submission-management/history/index';

        $authId = auth()->id();
        $submissions = Submission::query()
            ->where('guarantor_id', session('guarantor_id'))
            ->where(function ($query) use ($authId) {
                $query->where('checked_by', '=', $authId)
                    ->orWhere('approved_by', '=', $authId)
                    ->orWhere('rejected_by', '=', $authId);
            })
            ->with(['scores', 'principal', 'bank', 'obligee', 'employeeLimit', 'sourceOfFund', 'guarantor', 'guarantorToProductType', 'guarantorProductTypeLimit'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($submission) use ($authId) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');
                $direksiLimit = $submission->employeeLimit->firstWhere('employee_id', $authId);
                $productLimit = $submission->guarantorProductTypeLimit;

                return [
                    ...$submission->toArray(),
                    'direksi_limit' => $direksiLimit?->limit ?? 0,
                    'product_limit' => $productLimit?->limit ?? 0,
                    'product_limit_inherit' => $productLimit?->limit_inherit ?? 0,
                    'beyond_the_limit' => ($direksiLimit?->limit ?? 0) < $submission->guarantee_value,
                    'created_at' => $date,
                ];
            });

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Riwayat Pengajuan',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displaySubmissionByKepalaCabang()
    {
        $component = 'kepala-cabang/submission-management/list/index';

        $authId = auth()->id();
        $staffs = User::query()
            ->where('head_id', '=', $authId)
            ->pluck('id');

        $submissions = Submission::query()
            ->where('guarantor_id', session('guarantor_id'))
            ->whereIn('staff_id', $staffs)
            ->where([
                'checked_by' => null,
                'approved_by' => null,
                'rejected_by' => null,
            ])
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
            ->get()
            ->map(function ($submission) use ($authId) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');
                $kepalaCabangLimit = $submission->employeeLimit->firstWhere('employee_id', $authId);
                $productLimit = $submission->guarantorProductTypeLimit;

                return array_merge($submission->toArray(), [
                    'kepala_cabang_limit' => $kepalaCabangLimit?->limit ?? 0,
                    'product_limit' => $productLimit?->limit ?? 0,
                    'product_limit_inherit' => $productLimit?->limit_inherit ?? 0,
                    'beyond_the_limit' => ($kepalaCabangLimit?->limit ?? 0) < $submission->guarantee_value,
                    'created_at' => $date,
                ]);
            });

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'List Pengajuan Masuk',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displayHistoryByKepalaCabang()
    {
        $component = 'kepala-cabang/submission-management/history/index';

        $authId = auth()->id();
        $submissions = Submission::query()
            ->where('guarantor_id', session('guarantor_id'))
            ->where(function ($query) use ($authId) {
                $query->where('checked_by', '=', $authId)
                    ->orWhere('approved_by', '=', $authId)
                    ->orWhere('rejected_by', '=', $authId);
            })
            ->with(['scores', 'principal', 'bank', 'obligee', 'sourceOfFund', 'guarantor', 'guarantorToProductType', 'employeeLimit', 'guarantorProductTypeLimit'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($submission) use ($authId) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');
                $submission->contract_value_formatted = $this->formatCurrency($submission->contract_value);
                $submission->guarantee_value_formatted = $this->formatCurrency($submission->guarantee_value);
                $kepalaCabangLimit = $submission->employeeLimit->firstWhere('employee_id', $authId);
                $productLimit = $submission->guarantorProductTypeLimit;

                return array_merge($submission->toArray(), [
                    'kepala_cabang_limit' => $kepalaCabangLimit?->limit ?? 0,
                    'product_limit' => $productLimit?->limit ?? 0,
                    'product_limit_inherit' => $productLimit?->limit_inherit ?? 0,
                    'beyond_the_limit' => ($kepalaCabangLimit?->limit ?? 0) < $submission->guarantee_value,
                    'created_at' => $date,
                ]);
            });

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'List Hasil Pengajuan',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displaySubmissionByKepalaAgentPartner()
    {
        $component = 'kepala-agent-partner/submission-management/list/index';

        $authId = auth()->id();
        $staffs = User::query()
            ->where('guarantor_id', session('guarantor_id'))
            ->where('head_id', '=', $authId)
            ->pluck('id');
        $submissions = Submission::query()
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
            ->whereIn('staff_id', $staffs)
            ->where([
                'checked_by' => null,
                'approved_by' => null,
                'rejected_by' => null,
            ])
            ->get()
            ->map(function ($submission) use ($authId) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');
                $kepalaCabangLimit = $submission->employeeLimit->firstWhere('employee_id', $authId);
                $productLimit = $submission->guarantorProductTypeLimit;

                return array_merge($submission->toArray(), [
                    'kepala_cabang_limit' => $kepalaCabangLimit?->limit ?? 0,
                    'product_limit' => $productLimit?->limit ?? 0,
                    'product_limit_inherit' => $productLimit?->limit_inherit ?? 0,
                    'beyond_the_limit' => ($kepalaCabangLimit?->limit ?? 0) < $submission->guarantee_value,
                    'created_at' => $date,
                ]);
            });

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'List Pengajuan Masuk',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displayHistoryByKepalaAgentPartner()
    {
        $component = 'kepala-agent-partner/submission-management/history/index';

        $authId = auth()->id();
        $submissions = Submission::query()
            ->where('guarantor_id', session('guarantor_id'))
            ->where(function ($query) use ($authId) {
                $query->where('checked_by', '=', $authId)
                    ->orWhere('approved_by', '=', $authId)
                    ->orWhere('rejected_by', '=', $authId);
            })
            ->with(['scores', 'principal', 'bank', 'obligee', 'sourceOfFund', 'guarantor', 'guarantorToProductType', 'employeeLimit', 'guarantorProductTypeLimit'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($submission) use ($authId) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');
                $submission->contract_value_formatted = $this->formatCurrency($submission->contract_value);
                $submission->guarantee_value_formatted = $this->formatCurrency($submission->guarantee_value);
                $kepalaCabangLimit = $submission->employeeLimit->firstWhere('employee_id', $authId);
                $productLimit = $submission->guarantorProductTypeLimit;

                return array_merge($submission->toArray(), [
                    'kepala_cabang_limit' => $kepalaCabangLimit?->limit ?? 0,
                    'product_limit' => $productLimit?->limit ?? 0,
                    'product_limit_inherit' => $productLimit?->limit_inherit ?? 0,
                    'beyond_the_limit' => ($kepalaCabangLimit?->limit ?? 0) < $submission->guarantee_value,
                    'created_at' => $date,
                ]);
            });

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'List Hasil Pengajuan',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displayCreateByAgentPartner()
    {
        $component = 'agent-partner/submission-management/create/index';

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Buat Pengajuan',
            ],
        ]);
    }

    public function displayHistoryByAgentPartner()
    {
        $component = 'agent-partner/submission-management/history/index';

        $authId = auth()->id();
        $submissions = Submission::query()
            ->where('guarantor_id', session('guarantor_id'))
            ->where('staff_id', '=', $authId)
            ->with(['scores', 'principal', 'bank', 'obligee', 'sourceOfFund', 'guarantor', 'guarantorToProductType'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($submission) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');

                return [
                    ...$submission->toArray(),
                    'created_at' => $date,
                ];
            });

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Histori Pengajuan',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displayDocumentDraftByAgentPartner()
    {
        $component = 'agent-partner/submission-management/document-draft/index';

        $submissions = Submission::with('principal')->get();

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Draft Dokumen Pengajuan',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displayCreateByMarketingPartner()
    {
        $component = 'marketing-partner/submission-management/create/index';

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Buat Pengajuan',
            ],
        ]);
    }

    public function displayHistoryByMarketingPartner()
    {
        $component = 'marketing-partner/submission-management/history/index';

        $authId = auth()->id();
        $submissions = Submission::query()
            ->where('guarantor_id', session('guarantor_id'))
            ->where('staff_id', '=', $authId)
            ->with(['scores', 'principal', 'bank', 'obligee', 'sourceOfFund', 'guarantor', 'guarantorToProductType'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($submission) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');

                return [
                    ...$submission->toArray(),
                    'created_at' => $date,
                ];
            });

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Histori Pengajuan',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displayDocumentDraftByMarketingPartner()
    {
        $component = 'marketing-partner/submission-management/document-draft/index';

        $submissions = Submission::with('principal')->get();

        return inertia($component, [
            'page_settings' => fn () => [
                'title' => 'Draft Dokumen Pengajuan',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function approve(Request $request, Submission $submission): void
    {
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
                flashMessage('error', 'Gagal menyetujui pengajuan', 'error');

                return;
            }

            $documents = $request->input('documents', []);
            $submission->submissionDocs()->delete();
            $docData = collect($documents)->map(fn ($doc) => [
                'document_format_id' => $doc['id'] ?? null,
                'name' => $doc['name'] ?? null,
                'format_document' => $doc['content'],
                'url' => $doc['url'] ?? null,
            ])->toArray();
            $submission->submissionDocs()->createMany($docData);

            $guarantor = $submission->load(['guarantor', 'guarantor.hostToHost'])->getRelation('guarantor');
            $hostToHost = $guarantor->getRelation('hostToHost');
            if ($hostToHost) {
                $this->sendToGuarantor($submission->getAttribute('id'));
            }
            Log::info('Submission approved', ['submission_id' => $submission->getAttribute('id')]);
            flashMessage('success', 'Berhasil menyetujui pengajuan dan menyimpan dokumen');
        } catch (\Exception $e) {
            Log::error('Failed to approve submission', ['error' => $e->getMessage()]);
            flashMessage('error', 'Terjadi kesalahan saat menyetujui pengajuan', 'error');
        }
    }

    public function reject(Submission $submission): void
    {
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
            flashMessage('error', 'Gagal menolak pengajuan', 'error');
        } else {
            flashMessage('success', 'Berhasil menolak pengajuan');
        }
    }

    // check status
    public function check(Submission $submission): void
    {
        $dateNow = now()->format('Y-m-d H:i:s');
        $updated = $submission->update([
            'checked_by' => auth()->id(),
            'checked_at' => $dateNow,
        ]);

        if (! $updated) {
            flashMessage('error', 'Gagal kirim ke direksi pengajuan', 'error');
        } else {
            flashMessage('success', 'Berhasil kirim ke direksi pengajuan');
        }
    }

    // save content tinymce
    public function saveDocument(Request $request)
    {
        $validated = $request->validate([
            'submission_id' => 'required|integer|exists:submissions,id',
            'document_format_id' => 'nullable|integer|exists:document_formats,id',
            'name' => 'nullable|string|max:255',
            'format_document' => 'required|string',
        ]);

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

            return response()->json([
                'message' => $submissionDoc->wasRecentlyCreated
                    ? 'Dokumen berhasil dibuat.'
                    : 'Dokumen berhasil diperbarui.',
                'data' => $submissionDoc,
            ], 201);
        } catch (\Exception $e) {
            // Error handling
            return response()->json([
                'message' => 'Gagal menyimpan dokumen.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function saveDocSignatured(Request $request)
    {
        $validated = $request->validate([
            'spkmgr_file' => 'nullable|file|mimes:pdf,docx,doc|max:10240',
            'permohonan_file' => 'nullable|file|mimes:pdf,docx,doc|max:10240',
            'submission_id' => 'required|exists:submissions,id',
        ]);

        $submissionId = $request->input('submission_id');
        $documents = [];

        if ($request->hasFile('spkmgr_file')) {
            $spkmgrFile = $request->file('spkmgr_file');
            // Generate nama file unik
            $uniqueName = uniqid('spkmgr_', true).'.'.$spkmgrFile->getClientOriginalExtension();
            // Simpan file di folder dengan path berdasarkan submission_id
            $spkmgrPath = $spkmgrFile->storeAs(
                "documents/spkmgr/{$submissionId}",
                $uniqueName,
                'public'
            );
            $documents[] = [
                'submission_id' => $submissionId,
                'document_format_id' => null,
                'name' => $uniqueName,
                'format_document' => null,
                'url' => $spkmgrPath,
            ];
        }

        if ($request->hasFile('permohonan_file')) {
            $permohonanFile = $request->file('permohonan_file');
            // Generate nama file unik
            $uniqueName = uniqid('permohonan_', true).'.'.$permohonanFile->getClientOriginalExtension();
            // Simpan file di folder dengan path berdasarkan submission_id
            $permohonanPath = $permohonanFile->storeAs(
                "documents/permohonan/{$submissionId}",
                $uniqueName,
                'public'
            );
            $documents[] = [
                'submission_id' => $submissionId,
                'document_format_id' => null,
                'name' => $uniqueName,
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

        return response()->json([
            'message' => 'File berhasil diunggah dan disimpan.',
            'data' => $documents,
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

    private function generateNomorSuratResume($id, $createdAt)
    {
        return "{$id}/BPR/".Carbon::parse($createdAt)->format('m/Y');
    }

    private function formatCurrency($value): string
    {
        return 'Rp. '.number_format($value, 2, ',', '.');
    }

    public function getApprovedSubmissionsByPrincipal($principalId)
    {
        $principal = Principal::with(['approvedSubmissions'])->findOrFail($principalId);

        return inertia('staff/submission-management/history/principal-submissions', [
            'principal' => fn () => $principal,
        ]);
    }

    private function sendToGuarantor($submissionId): void
    {
        $submission = Submission::query()
            ->with([
                'principal:id,name,telephone,pic,npwp,nib,siup_siujk,head_name,business_fields,'.
                'director_name,director_position,director_phone,commissioner,year_established,'.
                'last_deed,province_id,regency_id,district_id,village,address,postal_code',
                'principal.province:id,code,name',
                'principal.regency:id,code,name',
                'principal.district:id,code,name',
                'blanks',
                'guarantor:id,name',
                'guarantorBranch:id,name',
                'guarantor.hostToHost:id,guarantor_id,guarantor_url_host,token',
                'product:id,name',
                'guarantorToProductType:id,name,job_group,job_type',
                'obligee:id,name,telephone,pic,no_ppk,province_id,regency_id,district_id,village,address,postal_code',
                'obligee.province:id,code,name',
                'obligee.regency:id,code,name',
                'obligee.district:id,code,name',
                'province:id,code,name',
                'regency:id,code,name',
                'district:id,code,name',
                'sourceOfFund:id,name',
                'submissionDocs:id,submission_id,name,format_document',
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
        $products = Product::get(['id', 'name']);
        $productTypes = ProductType::get(['id', 'name']);
        $sourceOfFounds = SourceOfFund::get(['id', 'name']);
        $hostToHost = $guarantor->getRelation('hostToHost');
        $url = $hostToHost->getAttribute('guarantor_url_host');
        $token = $hostToHost->getAttribute('auth_prefix').$hostToHost->getAttribute('token');
        $result = [
            'submission_id' => $submission->getAttribute('id'),
            'resources' => [
                'project_group' => JobGroup::getValues(),
                'project_type' => JobType::getValues(),
                'product' => $products->toArray(),
                'product_type' => $productTypes->toArray(),
                'source_of_fund' => $sourceOfFounds->toArray(),
            ],
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
            ],
            'guarantee' => [
                'no' => $submission->getAttribute('no_guarantee'),
                'value' => $submission->getAttribute('guarantee_value'),
            ],
            'contract' => [
                'blank' => $blank?->number,
                'value' => $submission->getAttribute('contract_value'),
                'document' => [
                    'name' => $submission->getAttribute('doc_name'),
                    'number' => $submission->getAttribute('doc_number'),
                    'date' => $submission->getAttribute('doc_date'),
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
            'output' => $submission->getRelation('submissionDocs')->map(function ($doc) {
                return [
                    'name' => $doc->getAttribute('name'),
                    'value' => $doc->getAttribute('format_document'),
                ];
            })->toArray(),
        ];

        $this->hostToHostService->sendPostRequest($url, $token, $result);
    }
}
