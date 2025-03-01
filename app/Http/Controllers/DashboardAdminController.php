<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Enums\SubmissionStatus;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Profile\Profile;
use App\Models\Submission\Submission;
use Illuminate\Http\Request;

class DashboardAdminController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        //

        // Used Blanks
        $usedBlanks = Blank::where('is_used', true)->count();

        // All Branch
        $userBranch = Profile::where('office_type', OfficeType::BRANCH->value)->get();

        // initiate the model
        $submission = Submission::whereYear('created_at', now()->year);

        // Filter the collection in memory
        $approvedSubmission = (clone $submission)->whereNotNull('approved_by')->with('userApproved')->get();

        // Total Premi
        $totalPremi = $approvedSubmission->sum('guarantee_value');

        // Total User Who Aprrove Subs
        $userApprovedSubmission = $approvedSubmission->pluck('userApproved')->unique()->values();
        $profileId = $request->get('profile_id');

        $chartSubmissionThisYear = $this->getChartSubmissionThisYear((clone $submission), $profileId);
        $submissionThisMonth = $this->getSubmissionThisMonth((clone $submission));
        $countOfSubmission = $this->getCountOfSubmission((clone $submission));
        $countGuarantors = Guarantor::whereNull('headquarter_id')->count();

        return inertia('admin/dashboard/index', [
            'totalPremi' => fn () => $totalPremi,
            'totalUsedBlank' => fn () => $usedBlanks,
            'totalSubmission' => fn () => $countOfSubmission['total'],
            'process' => fn () => $countOfSubmission['process'],
            'approved' => fn () => $countOfSubmission['approved'],
            'rejected' => fn () => $countOfSubmission['rejected'],
            'branches' => fn () => $userBranch,
            'userApprovedSubmission' => fn () => $userApprovedSubmission,
            'graph_data' => $chartSubmissionThisYear,
            'submissions' => $submissionThisMonth,
            'countGuarantors' => $countGuarantors,
        ]);
    }

    private function getCountOfSubmission($submissions): array
    {
        $totalSubmission = $submissions->count();
        $totalSubmissionProcess = $submissions->where('status', SubmissionStatus::PROCESS->value)->count();
        $totalSubmissionApproved = $submissions->where('status', SubmissionStatus::APPROVED->value)->count();
        $totalSubmissionRejected = $submissions->where('status', SubmissionStatus::REJECTED->value)->count();

        return [
            'total' => $totalSubmission,
            'process' => $totalSubmissionProcess,
            'approved' => $totalSubmissionApproved,
            'rejected' => $totalSubmissionRejected,
        ];
    }

    private function getChartSubmissionThisYear($submissions, $profileId): array
    {
        // get month names in Indonesian
        $monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Mei',
            'Juni',
            'Juli',
            'Agus',
            'Sep',
            'Okt',
            'Nov',
            'Des',
        ];

        $submissions = $submissions
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereYear('created_at', now()->year)
            ->when($profileId, function ($query, $profileId) {
                return $query->whereHas('staff', function ($query) use ($profileId) {
                    $query->where('profile_id', $profileId);
                });
            })
            ->groupBy('month')
            ->get();

        $chartData = [];
        foreach ($monthNames as $key => $monthName) {
            $chartData[] = [
                'month' => $monthName,
                'total' => $submissions->firstWhere('month', $key + 1)?->total ?? 0,
            ];
        }

        return $chartData;
    }

    private function getSubmissionThisMonth($submissions): object
    {
        return $submissions->select('id', 'principal_id', 'product_id', 'contract_value', 'guarantee_value', 'status')
            ->with(['principal:id,name', 'product:id,name'])
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->orderByDesc('created_at')
            ->get();
    }
}
