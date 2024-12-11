<?php

namespace App\Http\Controllers\Submission;

use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Submission\StoreRequest;
use App\Models\Document\RequiredDoc;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Profile;
use App\Models\RelatedParties\Obligee;
use App\Models\RelatedParties\Principal;
use App\Models\Scoring\Scoring;
use App\Models\Sequence;
use App\Models\Submission\Submission;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $submissions = [
            [
                'id' => 1,
                'name' => 'submission 1',
                'created_at' => '2024-01-01',
                'status' => 'Pending',
            ],
            [
                'id' => 2,
                'name' => 'submission 2',
                'created_at' => '2024-01-02',
                'status' => 'Approved',
            ],
            [
                'id' => 3,
                'name' => 'submission 3',
                'created_at' => '2024-01-03',
                'status' => 'Rejected',
            ],
        ];

        return inertia('admin/submission/index', [
            'submissions' => $submissions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $validated = $request->validated();

        // @dd($request->all());

        try {
            DB::beginTransaction();
            $principal = $validated['principal'];
            $principalDocuments = $validated['principal']['documents'];
            $principalRatios = $validated['principal']['ratios'];
            $obligiee = $validated['obligee'];
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

            $createPrincipal = Principal::query()
                ->with(['documents', 'principalRatios'])
                ->updateOrCreate([
                    'id' => $principal['id'] ?? null,
                ], collect($principal)->toArray());

            // create principal ratios
            foreach ($principalRatios as $principalRatio) {
                $createPrincipal->principalRatios()
                    ->updateOrCreate([
                        'year' => $principalRatio['year'],
                    ], $principalRatio);
            }

            // create principal document
            foreach ($principalDocuments as $principalDocument) {
                $document = collect($principalDocument)->toArray();
                $document['name'] = $document['required_doc_name'];
                $document['is_approved'] = true;
                $principalName = $principal['name'] ? str_replace(' ', '_', $principal['name']) : 'principal';
                $path = "principal/{$createPrincipal->id}-{$principalName}/documents";

                $existingDocument = $createPrincipal->documents()
                    ->where('required_doc_id', $principalDocument['required_doc_id'])
                    ->first();

                if ($existingDocument && $existingDocument->url) {
                    $this->deleteFile($existingDocument->url);
                }

                $document['url'] = $this->uploadFile(
                    $document['file'],
                    $path,
                    $document['required_doc_name']
                );

                $createPrincipal->documents()
                    ->updateOrCreate([
                        'required_doc_id' => $principalDocument['required_doc_id'],
                    ], $document);
            }

            // create or update obligiee
            $obligiee = Obligee::query()
                ->updateOrCreate([
                    'id' => $obligiee['id'] ?? null,
                ], $obligiee);

            // generate no guarantee
            $guarantor = Guarantor::query()
                ->with('pattern')
                ->find($submission['guarantor_id']);
            $guarantorToProductType = $guarantor->guarantorToProductTypes()
                ->find($submission['guarantor_to_product_type_id']);

            $ka = $guarantor->code;
            $kp = $guarantorToProductType->code;
            $kb = $blank->number;
            $noa = $profile->code;

            $guarantorPattern = $guarantor->pattern;
            $pattern = $guarantorPattern?->prefix.$guarantorPattern?->content.$guarantorPattern?->suffix;
            $sequence = Sequence::query()->where('guarantor_id', $submission['guarantor_id'])->orderByDesc('current')->get();
            $seqNodLast = $sequence->where('name', 'NOD')->first();
            $seqNomLast = $sequence->where('name', 'NOM')->first();
            $seqNoyLast = $sequence->where('name', 'NOY')->first();
            $nod = (string) $seqNodLast ? $seqNodLast->current + 1 : 1;
            $nom = (string) $seqNomLast ? $seqNomLast->current + 1 : 1;
            $noy = (string) $seqNoyLast ? $seqNoyLast->current + 1 : 1;
            $noGuarantee = convertPattern($pattern, $ka, $noa, $kp, $kb, $nod, $nom, $noy);

            // create sequence
            $this->createSequence('NOD', $nod, $pattern, $submission['guarantor_id']);
            $this->createSequence('NOM', $nom, $pattern, $submission['guarantor_id']);
            $this->createSequence('NOY', $noy, $pattern, $submission['guarantor_id']);

            // prepare create submission
            $dataSubmission = collect($submission)->toArray();
            $dataSubmission['principal_id'] = $createPrincipal->id;
            $dataSubmission['staff_id'] = auth()->user()->getAuthIdentifier();
            $dataSubmission['obligee_id'] = $obligiee->id;
            $dataSubmission['blank_id'] = $blank->id;
            $dataSubmission['no_guarantee'] = $noGuarantee;
            $dataSubmission['note_scoring'] = $scoring['note'];
            $modelScoring = Scoring::query()->find($scoring['id']);
            $dataSubmission['min_point_scoring'] = $modelScoring?->min_point;
            $dataSubmission['contract_doc_date'] = $submission['contract_doc_date'] ? Carbon::parse($submission['contract_doc_date'])->format('Y-m-d') : null;
            $dataSubmission['start_date'] = $submission['start_date'] ? Carbon::parse($submission['start_date'])->format('Y-m-d H:i:s') : null;
            $dataSubmission['end_date'] = $submission['end_date'] ? Carbon::parse($submission['end_date'])->format('Y-m-d H:i:s') : null;
            $dataSubmission['contract_value'] = $this->currencyConvert($submission['contract_value']);
            $dataSubmission['guarantee_value'] = $this->currencyConvert($submission['guarantee_value']);

            $submission = Submission::query()
                ->create($dataSubmission);

            $scores = $scoring['scores'];

            foreach ($scores as &$score) {
                $score['scoring_id'] = $scoring['id'];
            }

            $submission->scores()->createMany($scores);

            DB::commit();

            flashMessage('success', 'Berhasil membuat pengajuan');

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

    private function createSequence($name, $current, $pattern, $guarantorId): void
    {
        if (str_contains($pattern, $name)) {
            Sequence::query()->updateOrCreate([
                'name' => $name,
                'guarantor_id' => $guarantorId,
            ], [
                'current' => $current,
            ]);
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

        ])->findOrFail($id);
    }

    /**
     * Display the specified resource.
     */
    public function showDetailSubmission($id)
    {
        $submission = $this->getSubmission($id);

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

        $submission->scores->map(function ($score) {
            $score->category_name = $score->scoringQuestionCategory->name ?? '-';
            $score->question_name = $score->scoringQuestion->name ?? '-';
            $score->option_name = $score->scoringOption->name ?? '-';

            return $score;
        });

        return inertia('staff/submission-management/history/detail/index', [
            'submission' => $submission,
        ]);
    }

    public function showDetailDocsSubmission($id)
    {
        $submission = Submission::with(['principal', 'guarantorToProductType'])
            ->findOrFail($id);

        return inertia('staff/submission-management/document-draft/detail/index', [
            'submission' => $submission,
        ]);
    }

    public function showDetailSubmissionManager($id)
    {
        $submission = $this->getSubmission($id);

        $submission->employee_limit = $submission->employeeLimit->firstWhere('employee_id', auth()->user()->getAuthIdentifier());
        $submission->product_limit = $submission->guarantorProductTypeLimit;
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

        $submission->scores->map(function ($score) {
            $score->category_name = $score->scoringQuestionCategory->name ?? '-';
            $score->question_name = $score->scoringQuestion->name ?? '-';
            $score->option_name = $score->scoringOption->name ?? '-';

            return $score;
        });

        return inertia('manager/submission-management/detail/index', [
            'submission' => $submission,
        ]);
    }

    public function showDetailDocsSubmissionManager($id)
    {
        $submission = Submission::with(['principal', 'guarantorToProductType'])
            ->findOrFail($id);

        return inertia('manager/submission-management/document-draft/detail/index', [
            'submission' => $submission,
        ]);
    }

    public function showDetailSubmissionDireksi($id)
    {
        $submission = $this->getSubmission($id);

        $submission->employee_limit = $submission->employeeLimit->firstWhere('employee_id', auth()->user()->getAuthIdentifier());
        $submission->product_limit = $submission->guarantorProductTypeLimit;
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

        $submission->scores->map(function ($score) {
            $score->category_name = $score->scoringQuestionCategory->name ?? '-';
            $score->question_name = $score->scoringQuestion->name ?? '-';
            $score->option_name = $score->scoringOption->name ?? '-';

            return $score;
        });

        return inertia('direksi/submission-management/history/detail/index', [
            'submission' => $submission,
        ]);
    }

    public function showDetailDocsSubmissionDireksi($id)
    {
        $submission = Submission::with(['principal', 'guarantorToProductType'])
            ->findOrFail($id);

        return inertia('direksi/submission-management/document-draft/detail/index', [
            'submission' => $submission,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Submission $submission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Submission $submission)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Submission $submission)
    {
        //
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

        Carbon::setLocale('id');

        $authId = auth()->user()->getAuthIdentifier();
        $submissions = Submission::query()
            ->with(['scores', 'principal', 'bank', 'obligee', 'sourceOfFund', 'guarantor', 'guarantorToProductType'])
            ->where('staff_id', '=', auth()->user()->getAuthIdentifier())
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
        $component = 'staff/submission-management/document-draft/index';

        $submissions = Submission::with('principal')->get();

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

        Carbon::setLocale('id');

        $authId = auth()->user()->getAuthIdentifier();
        $staffs = User::query()
            ->where('head_id', '=', $authId)
            ->pluck('id');
        $submissions = Submission::query()
            ->with(['scores', 'principal', 'bank', 'obligee', 'sourceOfFund', 'guarantor',
                'guarantorToProductType', 'employeeLimit', 'guarantorProductTypeLimit'])
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
                $managerLimit = $submission->employeeLimit->firstWhere('employee_id', $authId);
                $productLimit = $submission->guarantorProductTypeLimit;

                return [
                    ...$submission->toArray(),
                    'manager_limit' => $managerLimit?->limit ?? 0,
                    'product_limit' => $productLimit?->limit ?? 0,
                    'product_limit_inherit' => $productLimit?->limit_inherit ?? 0,
                    'beyond_the_limit' => ($managerLimit?->limit ?? 0) < $submission->guarantee_value,
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

    public function displayHistoryByManager()
    {
        $component = 'manager/submission-management/history/index';

        Carbon::setLocale('id');

        $authId = auth()->user()->getAuthIdentifier();
        $submissions = Submission::query()
            ->where(function ($query) use ($authId) {
                $query->where('checked_by', '=', $authId)
                    ->orWhere('approved_by', '=', $authId)
                    ->orWhere('rejected_by', '=', $authId);
            })
            ->with(['scores', 'principal', 'bank', 'obligee', 'sourceOfFund', 'guarantor', 'guarantorToProductType'])
            ->get()
            ->map(function ($submission) use ($authId) {
                $date = Carbon::parse($submission->created_at)
                    ->translatedFormat('d F Y');
                $managerLimit = $submission->employeeLimit->firstWhere('employee_id', $authId);
                $productLimit = $submission->guarantorProductTypeLimit;

                return [
                    ...$submission->toArray(),
                    'manager_limit' => $managerLimit?->limit ?? 0,
                    'product_limit' => $productLimit?->limit ?? 0,
                    'product_limit_inherit' => $productLimit?->limit_inherit ?? 0,
                    'beyond_the_limit' => ($managerLimit?->limit ?? 0) < $submission->guarantee_value,
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

    public function displaySubmissionByDireksi()
    {
        $component = 'direksi/submission-management/list/index';

        Carbon::setLocale('id');

        $authId = auth()->user()->getAuthIdentifier();
        $submissions = Submission::query()
            ->with(['scores', 'principal', 'bank', 'obligee', 'sourceOfFund', 'guarantor', 'guarantorToProductType', 'employeeLimit', 'guarantorProductTypeLimit'])
            ->where('checked_by', '!=', null)
            ->where('status', '=', SubmissionStatus::PROCESS->value)
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
                'title' => 'List Pengajuan',
            ],
            'submissions' => fn () => $submissions,
        ]);
    }

    public function displayHistoryByDireksi()
    {
        $component = 'direksi/submission-management/history/index';

        Carbon::setLocale('id');

        $authId = auth()->user()->getAuthIdentifier();
        $submissions = Submission::query()
            ->where(function ($query) use ($authId) {
                $query->where('checked_by', '=', $authId)
                    ->orWhere('approved_by', '=', $authId)
                    ->orWhere('rejected_by', '=', $authId);
            })
            ->with(['scores', 'principal', 'bank', 'obligee', 'employeeLimit', 'sourceOfFund', 'guarantor', 'guarantorToProductType'])
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

    public function approve(Submission $submission): void
    {
        $updated = $submission->update([
            'checked_by' => auth()->user()->getAuthIdentifier(),
            'approved_by' => auth()->user()->getAuthIdentifier(),
            'checked_at' => now(),
            'approved_at' => now(),
            'status' => SubmissionStatus::APPROVED->value,
        ]);

        if (! $updated) {
            flashMessage('error', 'Gagal menyetujui pengajuan', 'error');
        } else {
            flashMessage('success', 'Berhasil menyetujui pengajuan');
        }
    }

    public function reject(Submission $submission): void
    {
        $updated = $submission->update([
            'checked_by' => auth()->user()->getAuthIdentifier(),
            'rejected_by' => auth()->user()->getAuthIdentifier(),
            'checked_at' => now(),
            'rejected_at' => now(),
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
        $updated = $submission->update([
            'checked_by' => auth()->user()->getAuthIdentifier(),
            'checked_at' => now(),
        ]);

        if (! $updated) {
            flashMessage('error', 'Gagal kirim ke direksi pengajuan', 'error');
        } else {
            flashMessage('success', 'Berhasil kirim ke direksi pengajuan');
        }
    }
}
