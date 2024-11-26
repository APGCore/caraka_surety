<?php

namespace App\Http\Controllers;

use App\Enums\SubmissionStatus;
use App\Models\Product\Product;
use App\Models\Submission\Submission;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    private function getCountOfSubmission(): array
    {
        $submissions = Submission::query()->get();
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

    private function getChartSubmissionThisYear($productId = null): array
    {
        // get month names in Indonesian
        $monthNames = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ];

        $submissions = Submission::query()
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereYear('created_at', now()->year)
            ->when($productId, function ($query, $productId) {
                return $query->where('product_id', $productId);
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

    private function getSubmissionThisMonth(): object
    {
        return Submission::query()
            ->select('id', 'principal_id', 'product_id', 'contract_value', 'status')
            ->with(['principal:id,name', 'product:id,name'])
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->orderByDesc('created_at')
            ->get();
    }

    public function dashboardAdmin(Request $request)
    {
        $component = 'admin/dashboard/index';

        return inertia($component);
    }

    public function dashboardStaff(Request $request)
    {
        $productId = $request->get('product_id');
        $countOfSubmission = $this->getCountOfSubmission();
        $chartSubmissionThisYear = $this->getChartSubmissionThisYear($productId);
        $submissionThisMonth = $this->getSubmissionThisMonth();
        $products = Product::query()->get();

        $props = [
            'total_submission' => $countOfSubmission['total'],
            'total_submission_process' => $countOfSubmission['process'],
            'total_submission_approved' => $countOfSubmission['approved'],
            'total_submission_rejected' => $countOfSubmission['rejected'],
            'products' => $products,
            'graph_data' => $chartSubmissionThisYear,
            'submissions' => $submissionThisMonth,
        ];


        $component = 'staff/dashboard/index';

        return inertia($component, $props);
    }

    public function dashboardManager(Request $request)
    {
        $component = 'manager/dashboard/index';

        return inertia($component);
    }

    public function dashboardDireksi(Request $request)
    {
        $component = 'direksi/dashboard/index';

        return inertia($component);
    }

    public function dashboardStaffCabang(Request $request)
    {
        $component = 'staff-cabang/dashboard/index';

        return inertia($component);
    }

    public function dashboardKepalaCabang(Request $request)
    {
        $component = 'kepala-cabang/dashboard/index';

        return inertia($component);
    }
}
