<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Enums\SubmissionStatus;
use App\Models\Product\Product;
use App\Models\Submission\Submission;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController extends Controller
{
    private function getCountOfSubmission($submissions): array
    {
        $totalSubmission = (clone $submissions)->count();
        $totalSubmissionProcess = (clone $submissions)->where('status', SubmissionStatus::PROCESS->value)->count();
        $totalSubmissionApproved = (clone $submissions)->where('status', SubmissionStatus::APPROVED->value)->count();
        $totalSubmissionRejected = (clone $submissions)->where('status', SubmissionStatus::REJECTED->value)->count();

        return [
            'total' => $totalSubmission,
            'process' => $totalSubmissionProcess,
            'approved' => $totalSubmissionApproved,
            'rejected' => $totalSubmissionRejected,
        ];
    }

    private function getChartSubmissionThisYear(?int $productId, $submissions): array
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

        $result = (clone $submissions)->filter(function ($submission) use ($productId) {
            return $submission->created_at->year == now()->year && (! $productId || $submission->product_id == $productId);
        })->groupBy(function ($submission) {
            return $submission->created_at->month;
        })->map(function ($group) {
            return $group->count();
        });

        $chartData = [];
        foreach ($monthNames as $key => $monthName) {
            $chartData[] = [
                'month' => $monthName,
                'total' => $result->get($key + 1, 0),
            ];
        }

        return $chartData;
    }

    private function getSubmissionThisMonth($submissions): object
    {
        return (clone $submissions)
            ->filter(function ($submission) {
                return $submission->created_at->year == now()->year && $submission->created_at->month == now()->month;
            })
            ->map(function ($submission) {
                return [
                    'id' => $submission->id,
                    'principal_id' => $submission->principal_id,
                    'product_id' => $submission->product_id,
                    'contract_value' => $submission->contract_value,
                    'guarantee_value' => $submission->guarantee_value,
                    'status' => $submission->status,
                    'principal' => $submission->principal ? $submission->principal->only(['id', 'name']) : null,
                    'product' => $submission->product ? $submission->product->only(['id', 'name']) : null,
                ];
            })
            ->sortByDesc('created_at')
            ->values();
    }

    private function getProps($productId): array
    {
        $user = auth()->user();
        $isStaff = $user->hasRole(RoleEnum::Staff->value);
        $userId = $user->id;
        $user->load('staff');
        $staffs = $user->getRelation('staff');
        $guarantorId = session('guarantor_id', config('guarantor.id'));
        $submissions = Submission::query()
            ->where('guarantor_id', $guarantorId)
            ->when($userId, fn ($query) => $query->where(
                fn ($query) => $query
                    ->whereIn('staff_id', $isStaff ? [$userId] : $staffs->pluck('id')->toArray())
                    ->orWhere('checked_by', $userId)
                    ->orWhere('approved_by', $userId)
                    ->orWhere('rejected_by', $userId)
            ))
            ->with(['principal:id,name', 'product:id,name'])
            ->get();
        $countOfSubmission = $this->getCountOfSubmission($submissions);
        $chartSubmissionThisYear = $this->getChartSubmissionThisYear($productId, $submissions);
        $submissionThisMonth = $this->getSubmissionThisMonth($submissions);
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

    public function dashboardAdmin(Request $request): Response
    {
        $component = 'admin/dashboard/index';

        return inertia($component);
    }

    public function dashboardStaff(Request $request): Response
    {
        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        $component = 'staff/dashboard/index';

        return inertia($component, $props);
    }

    public function dashboardStaffOperasional(Request $request): Response
    {
        $component = 'staff-operasional/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardStaffTeknik(Request $request): Response
    {
        $component = 'staff-teknik/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardManager(Request $request): Response
    {
        $component = 'manager/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardDireksi(Request $request): Response
    {
        $component = 'direksi/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardStaffCabang(Request $request): Response
    {
        $component = 'staff-cabang/dashboard/index';

        return inertia($component);
    }

    public function dashboardKepalaCabang(Request $request): Response
    {
        $component = 'kepala-cabang/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardKepalaAgenPartner(Request $request): Response
    {
        $component = 'kepala-agent-partner/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardAgenPartner(Request $request): Response
    {
        $component = 'agent-partner/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardMarketingPartner(Request $request): Response
    {
        $component = 'marketing-partner/dashboard/index';

        $productId = $request->get('product_id');
        $props = $this->getProps($productId);

        return inertia($component, $props);
    }

    public function dashboardKeuangan(Request $request): Response
    {
        $component = 'keuangan/dashboard/index';

        $productId = $request->get('product_id');
        $products = Product::query()->get();

        return inertia($component, compact('products'));
    }
}
