<?php

namespace App\Http\Controllers\Submission;

use App\Http\Controllers\Controller;
use App\Http\Requests\Submission\StoreRequest;
use App\Models\RelatedParties\Principal;
use App\Models\Submission\Submission;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

        // dd($validated);
        try {
            DB::beginTransaction();
            $principal = $validated['principal'];
            $principalDocuments = $validated['principal']['documents'];
            $submission = $validated['submission'];
            $scoring = $validated['scoring'];

            $createPrincipal = Principal::query()
                ->updateOrCreate([
                    'id' => $principal['id'] ?? null,
                ], collect($principal)->toArray());

            foreach ($principalDocuments as $principalDocument) {
                $document = collect($principalDocument)->toArray();
                $document['name'] = $document['required_doc_name'];
                $principalName = $principal?->name ? str_replace(' ', '_', $principal?->name) : 'principal';
                $path = "principal/{$principal?->id}-{$principalName}/documents";

                if ($principalDocument['required_doc_id']) {
                    $this->deleteFile($createPrincipal->documents()
                        ->where('required_doc_id', $principalDocument['required_doc_id'])
                        ->first()?->url);
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

            $dataSubmission = collect($submission)->toArray();
            $dataSubmission['principal_id'] = $createPrincipal->id;
            $dataSubmission['note_scoring'] = $scoring['note'];
            $dataSubmission['min_point_scoring'] = $scoring['min_point'];
            $dataSubmission['contract_doc_date'] = $submission['contract_doc_date'] ? \Carbon\Carbon::parse($submission['contract_doc_date'])->format('Y-m-d') : null;
            $dataSubmission['start_date'] = $submission['start_date'] ? \Carbon\Carbon::parse($submission['start_date'])->format('Y-m-d H:i:s') : null;
            $dataSubmission['end_date'] = $submission['end_date'] ? \Carbon\Carbon::parse($submission['end_date'])->format('Y-m-d H:i:s') : null;

            $submission = Submission::query()
                ->create($dataSubmission);

            $submission->update([
                'min_point_scoring' => $scoring['min_point'],
                'note_scoring' => $scoring['note'],
            ]);

            $scores = $scoring['scores'];
            foreach ($scores as &$score) {
                $score['scoring_id'] = $scoring['id'];
            }
            $submission->scores()->createMany($scores);

            DB::commit();

            flashMessage('success', 'Berhasil membuat pengajuan');

            return back();
            // return back()->with('success', 'Berhasil membuat pengajuan');

        } catch (\Exception $e) {
            DB::rollBack();

            dd([
                'message' => $e->getMessage(),
                'trace' => $e->getTrace(),
                'line' => $e->getLine(),
            ]);
            Log::error('SubmissionController@store: ', [
                'message' => $e->getMessage(),
                'trace' => $e->getTrace(),
                'line' => $e->getLine(),
            ]);
            flashMessage('error', 'Gagal membuat pengajuan', 'error');

            // return back()->with('error', 'Gagal membuat pengajuan');

            return back();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Submission $submission)
    {
        return inertia('admin/submission/detail/index', [
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
            'page_settings' => fn() => [
                'title' => 'Buat Pengajuan',
            ],
        ]);
    }

    public function displayHistoryByStaff()
    {
        $component = 'staff/submission-management/history/index';

        Carbon::setLocale('id');

        $submissions = Submission::query()
            ->with(['scores', 'principal', 'bank', 'obligee', 'sourceOfFund', 'guarantor', 'guarantorToProductType'])
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
            'page_settings' => fn() => [
                'title' => 'Histori Pengajuan',
            ],
            'submissions' => fn() => $submissions,
        ]);
    }

    public function displayDocumentDraftByStaff()
    {
        $component = 'staff/submission-management/document-draft/index';

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

        return inertia($component, [
            'page_settings' => fn() => [
                'title' => 'Draft Dokumen Pengajuan',
            ],
            'submissions' => fn() => $submissions,
        ]);
    }
}
