<?php

namespace App\Http\Controllers;

use App\Models\Guarantor\Blank;
use App\Models\Profile;
use App\Models\Submission\Submission;
use App\Models\User;
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
        $userBranch = Profile::where('is_central', '!=', true)->get();

        // initiate the model
        $submission = Submission::all();

        // Filter the collection in memory
        $approvedSubmission = $submission->whereNotNull('approved_by');

        // Load the relationship after filtering
        $approvedSubmission->load('userApproved');

        // Total Submission
        $totalSubmission = $submission->count();

        // Total Premi
        $totalPremi = $approvedSubmission->sum('guarantee_value');

        // Total User Who Aprrove Subs
        $userApprovedSubmission = $approvedSubmission->pluck('userApproved')->unique();

        return inertia('admin/dashboard/index', [
            'totalPremi' => fn () => $totalPremi,
            'totalUsedBlank' => fn () => $usedBlanks,
            'totalSubmission' => fn () => $totalSubmission,
            'branches' => fn () => $userBranch,
            'userApprovedSubmission' => fn () => $userApprovedSubmission,
            'test' => fn () => [],
        ]);
    }
}
