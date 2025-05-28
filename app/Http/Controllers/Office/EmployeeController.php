<?php

namespace App\Http\Controllers\Office;

use App\Enums\OfficeType;
use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreRequest;
use App\Http\Requests\Employee\UpdateRequest;
use App\Http\Resources\Office\EmployeeResource;
use App\Models\Profile\Profile;
use App\Models\RelatedParties\OfficeMonitoring;
use App\Models\Role;
use App\Models\User;
use Exception;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

/**
 * @group Office Management
 *
 * API endpoints for managing employees
 * Model: Profile
 * Model: User
 * Model: Role
 */
class EmployeeController extends Controller
{
    public function getEmployeeByOffice(Request $request, Profile $office)
    {

        $profileId = $office->getAttribute('id');
        // $roles = $this->getRoles($office);
        $employees = User::query()->where('profile_id', $profileId)->get();

        return EmployeeResource::collection($employees);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $officeSelected = (int) $request->get('office_id', 1);
        $office = Profile::query()->find($officeSelected) ?? Profile::query()->firstWhere('office_type', OfficeType::HEADQUARTER->value);
        $routeName = $this->getRouteName($office);
        $employees = User::search($request->get('search'))
            ->query(function ($query) use ($officeSelected) {
                $query->with('role')
                    ->where('role_id', '!=', 1)
                    ->where('profile_id', $officeSelected);
            })
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $employeeResource = EmployeeResource::collection($employees);

        $component = 'admin/office-management/employee/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Daftar Pengguna',
            ],
            'office_selected' => $officeSelected,
            'employees' => fn () => $employeeResource,
            'route_name' => $routeName,
        ]);
    }

    private function getRouteName(Profile $office): string
    {
        $officeType = $office->getAttribute('office_type');

        return match ($officeType) {
            OfficeType::BRANCH->value => 'branch.employee',
            OfficeType::AGENT_PARTNER->value => 'branch-mitra-agen.employee',
            OfficeType::MARKETING_PARTNER->value => 'branch-mitra-pemasaran.employee',
            default => 'employee'
        };
    }

    private function createOfficeMonitoring($requestValid, $employee): void
    {
        $officeMonitoring = collect($requestValid['office_monitorings'])->map(function ($monitoring) use ($employee) {
            return [
                'id' => $monitoring['office_monitoring_id'] ?? null,
                'user_id' => $employee->getAttribute('id'),
                'profile_id' => $monitoring['office_id'],
            ];
        })->toArray();
        $officeMonitoringIds = collect($officeMonitoring)->pluck('id')->unique()->toArray();
        // delete pivot data
        OfficeMonitoring::query()
            ->where('user_id', $employee->getAttribute('id'))
            ->whereNotIn('id', $officeMonitoringIds)
            ->delete();
        foreach ($officeMonitoring as $monitoring) {
            OfficeMonitoring::query()->updateOrCreate(
                [
                    'id' => $monitoring['id'] ?? null,
                ],
                [
                    'user_id' => $monitoring['user_id'],
                    'profile_id' => $monitoring['profile_id'],
                ]
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $requestValid = $request->validated();
            $requestValid['password'] = Hash::make($requestValid['password']);
            $user = User::query()
                ->create($requestValid)->load('office');
            $office = $user->getRelation('office');

            $this->createOfficeMonitoring($requestValid, $user);

            $routeName = $this->getRouteName($office);
            activity()
                ->useLog('employee')
                ->performedOn($user)
                ->causedBy(auth()->user())
                ->log('Menambahkan data pengguna');
            flashMessage('Berhasil', 'Data pengguna berhasil ditambahkan');
            DB::commit();

            return redirect()->route($routeName.'.index', ['office_id' => $user->profile_id]);
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error on EmployeeController@store: ', $error);

            flashMessage('Gagal', 'Penambahan data pengguna gagal', 'error');

            return back()->withErrors(['errors' => 'Gagal menambahkan data pengguna']);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $request->validate([
            'office_id' => 'required|exists:profiles,id',
            'role_id' => 'nullable|exists:roles,id',
        ]);
        $officeSelected = (int) $request->get('office_id', 1);
        $office = Profile::query()->find($officeSelected);
        $roleNames = $this->getRoleByOfficeType($office->getAttribute('office_type'));
        $roles = Role::query()->whereIn('name', $roleNames)->get();
        // for head role
        $roleId = (int) $request->get('role_id');
        $role = Role::query()->find($roleId);
        $userRoles = $this->getRoles($office, $role);
        $headers = User::query()
            ->where('profile_id', $officeSelected)
            ->with('role')
            ->whereHas('role', function ($query) use ($userRoles) {
                $query->whereIn('name', $userRoles);
            })
            ->get();

        $routeName = $this->getRouteName($office);
        $component = 'admin/office-management/employee/create/index';

        return inertia($component, [
            'page_settings' => ['title' => 'Tambah Pengguna'],
            'officeSelected' => $officeSelected,
            'roles' => $roles,
            'headers' => $headers,
            'routeName' => $routeName,
        ]);
    }

    private function getRoleByOfficeType($officeType): array
    {
        $data = [
            OfficeType::HEADQUARTER->value => [
                RoleEnum::Direksi->value,
                RoleEnum::Manager->value,
                RoleEnum::Staff->value,
                RoleEnum::StaffTeknik->value,
                RoleEnum::StaffOperasional->value,
                RoleEnum::Keuangan->value,
            ],
            OfficeType::BRANCH->value => [
                RoleEnum::KepalaCabang->value,
                RoleEnum::Staff->value,
                RoleEnum::StaffTeknik->value,
                RoleEnum::StaffOperasional->value,
            ],
            OfficeType::AGENT_PARTNER->value => [
                RoleEnum::KepalaAgentPartner->value,
                RoleEnum::AgentPartner->value,
            ],
            OfficeType::MARKETING_PARTNER->value => [
                RoleEnum::MarketingPartner->value,
            ],
        ];

        return $data[$officeType];
    }

    private function getRoles(Profile $office, ?Role $role = null): array
    {
        $officeType = $office->getAttribute('office_type');
        $roles = [];
        if ($role === null) {
            return $roles;
        }
        if ($officeType === OfficeType::HEADQUARTER->value) {
            switch ($role->getAttribute('name')) {
                case RoleEnum::Manager->value:
                    $roles = [RoleEnum::Direksi->value];
                    break;
                case RoleEnum::Staff->value:
                case RoleEnum::StaffOperasional->value:
                case RoleEnum::StaffTeknik->value:
                    $roles = [RoleEnum::Manager->value];
                    break;
            }
        } elseif ($officeType === OfficeType::BRANCH->value) {
            switch ($role->getAttribute('name')) {
                case RoleEnum::KepalaCabang->value:
                    $roles = [RoleEnum::Manager->value];
                    break;
                case RoleEnum::Staff->value:
                case RoleEnum::StaffOperasional->value:
                case RoleEnum::StaffTeknik->value:
                    $roles = [RoleEnum::KepalaCabang->value];
                    break;
            }
        } elseif ($officeType === OfficeType::AGENT_PARTNER->value) {
            switch ($role->getAttribute('name')) {
                case RoleEnum::KepalaAgentPartner->value:
                    $roles = [RoleEnum::Manager->value];
                    break;
                case RoleEnum::AgentPartner->value:
                    $roles = [RoleEnum::KepalaAgentPartner->value];
                    break;
            }
        } elseif ($officeType === OfficeType::MARKETING_PARTNER->value) {
            if ($role->getAttribute('name') == RoleEnum::MarketingPartner->value) {
                $roles = [RoleEnum::Manager->value];
            }
        }

        return $roles;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, User $employee): Response
    {
        $employee = User::query()->with(['role', 'office', 'officeMonitorings'])->find($employee->getAttribute('id'));
        $office = $employee->getRelation('office');
        $officeType = $office->getAttribute('office_type');
        $officeSelected = $office->getAttribute('id');
        $roleId = $request->get('role_id', $employee->getAttribute('role_id'));
        $role = Role::query()->find($roleId);
        $userRoles = $this->getRoles($office, $role);
        $roleNames = $this->getRoleByOfficeType($office->getAttribute('office_type'));
        $roles = Role::query()->whereIn('name', $roleNames)->get();
        $headers = User::query()
            ->where('profile_id', $officeSelected)
            ->whereHas('role', function ($query) use ($userRoles) {
                $query->whereIn('name', $userRoles);
            })
            ->get();
        if ($officeType !== OfficeType::HEADQUARTER->value && $headers->count() === 0) {
            $headers = User::query()
                ->whereHas('role', function ($query) {
                    $query->whereIn('name', [RoleEnum::Manager->value]);
                })
                ->get();
        }
        $routeName = $this->getRouteName($office);
        $component = 'admin/office-management/employee/edit/index';

        return inertia($component, [
            'page_settings' => ['title' => 'Ubah Pengguna'],
            'officeSelected' => $officeSelected,
            'roles' => $roles,
            'employee' => $employee,
            'headers' => $headers,
            'routeName' => $routeName,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, User $employee)
    {
        DB::beginTransaction();
        try {
            $requestValid = $request->validated();

            $requestValid['password'] = $requestValid['password'] ? Hash::make($requestValid['password']) : null;
            $requestValid = array_filter($requestValid, fn ($value) => $value !== null);

            $office = $employee->load('office')->getRelation('office');

            $this->createOfficeMonitoring($requestValid, $employee);
            $routeName = $this->getRouteName($office);
            $employee->update($requestValid);
            activity()
                ->useLog('employee')
                ->performedOn($employee)
                ->causedBy(auth()->user())
                ->log('Mengubah data pengguna');
            flashMessage('Berhasil', 'Perubahan data pengguna berhasil');
            DB::commit();

            return redirect()->route($routeName.'.index', ['office_id' => $employee->getAttribute('profile_id')]);
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error on EmployeeController@update: ', $error);

            flashMessage('Gagal', 'Perubahan data pengguna gagal', 'error');

            return back()->withErrors(['errors' => 'Gagal mengubah data pengguna']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $employee)
    {
        try {
            DB::beginTransaction();

            if ($employee->getAttribute('role_id') === 1) {
                flashMessage('Gagal Menghapus Pengguna', 'Pengguna tidak dapat dihapus', 'error');

                return redirect()->back()->withErrors(['errors' => 'Pengguna tidak dapat dihapus']);
            }

            if ($employee->exists) {
                $employee->update([
                    'username' => $employee->getAttribute('username').'_deleted_'.now()->timestamp,
                    'email' => $employee->getAttribute('email').'_deleted_'.now()->timestamp,
                    'password' => Hash::make($employee->getAttribute('email')).'_deleted_'.now()->timestamp,
                ]);
                $employee->delete();
            } else {
                throw new ThrottleRequestsException('Pengguna tidak ditemukan');
            }
            activity()
                ->useLog('employee')
                ->performedOn($employee)
                ->causedBy(auth()->user())
                ->log('Menghapus data pengguna');
            flashMessage('Pengguna Dihapus', 'Pengguna berhasil dihapus');
            DB::commit();

            return redirect()->back();
        } catch (Exception $e) {
            flashMessage('Gagal Menghapus Pengguna', 'Terjadi kesalahan saat menghapus pengguna', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Error on EmployeeController@destroy: ', $error);
            DB::rollBack();

            return back()->withErrors(['errors' => 'Gagal menghapus data pengguna']);
        }
    }
}
