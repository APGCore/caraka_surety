<?php

namespace App\Http\Controllers;

use App\Enums\SubmissionStatus;
use App\Models\Product\Product;
use App\Models\Submission\Submission;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    private function getCountOfSubmission(?int $userId = null): array
    {
        $submissions = Submission::query()->when($userId, fn ($query) => $query
            ->where('staff_id', $userId)
            ->orWhere('checked_by', $userId)
            ->orWhere('approved_by', $userId)
            ->orWhere('rejected_by', $userId)
        )->get();
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

    private function getChartSubmissionThisYear(?int $productId = null, ?int $userId = null): array
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

        $submissions = Submission::query()
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereYear('created_at', now()->year)
            ->when($productId, fn ($query) => $query->where('product_id', $productId))
            ->when($userId, fn ($query) => $query
                ->where('staff_id', $userId)
                ->orWhere('checked_by', $userId)
                ->orWhere('approved_by', $userId)
                ->orWhere('rejected_by', $userId))
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

    private function getSubmissionThisMonth(?int $userId = null): object
    {
        return Submission::query()
            ->select('id', 'principal_id', 'product_id', 'contract_value', 'guarantee_value', 'status')
            ->with(['principal:id,name', 'product:id,name'])
            ->when($userId, fn ($query) => $query
                ->where('staff_id', $userId)
                ->orWhere('checked_by', $userId)
                ->orWhere('approved_by', $userId)
                ->orWhere('rejected_by', $userId))
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->orderByDesc('created_at')
            ->get();
    }

    private function getProps($productId): array
    {
        $userId = auth()->user()->getAuthIdentifier();
        $countOfSubmission = $this->getCountOfSubmission($userId);
        $chartSubmissionThisYear = $this->getChartSubmissionThisYear($productId, $userId);
        $submissionThisMonth = $this->getSubmissionThisMonth($userId);
        $products = Product::query()->get();

        return [
            'total_submission' => $countOfSubmission['total'],
            'total_submission_process' => $countOfSubmission['process'],
            'total_submission_approved' => $countOfSubmission['approved'],
            'total_submission_rejected' => $countOfSubmission['rejected'],
            'products' => $products,
            'graph_data' => $chartSubmissionThisYear,
            'submissions' => $submissionThisMonth,
        ];
    }

    public function dashboardAdmin(Request $request): \Inertia\Response
    {
        $component = 'admin/dashboard/index';

        return inertia($component);
    }

    public function dashboardStaff(Request $request): \Inertia\Response
    {
        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        $component = 'staff/dashboard/index';

        return inertia($component, $props);
    }

    public function dashboardStaffOperasional(Request $request): \Inertia\Response
    {
        $component = 'staff-operasional/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardStaffTeknik(Request $request): \Inertia\Response
    {
        $component = 'staff-teknik/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardManager(Request $request): \Inertia\Response
    {
        $component = 'manager/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardDireksi(Request $request): \Inertia\Response
    {
        $component = 'direksi/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardStaffCabang(Request $request): \Inertia\Response
    {
        $component = 'staff-cabang/dashboard/index';

        return inertia($component);
    }

    public function dashboardKepalaCabang(Request $request): \Inertia\Response
    {
        $component = 'kepala-cabang/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardKepalaAgenPartner(Request $request): \Inertia\Response
    {
        $component = 'kepala-agent-partner/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }
}
