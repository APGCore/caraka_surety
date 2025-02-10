<?php

namespace App\Http\Controllers\Office;

use App\Enums\OfficeType;
use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\Office\EmployeeResource;
use App\Models\Profile\Profile;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
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

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $officeSelected = (int) ($request->get('office_id'));
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
                'title' => 'Pengguna '.$office->getAttribute('name'),
            ],
            'office_selected' => $officeSelected,
            'employees' => fn () => $employeeResource,
            'route_name' => $routeName,
        ]);
    }

    private function getRoles(Profile $office, ?User $employee = null): array
    {
        $roleDireksi = RoleEnum::Direksi->value;
        $roleManager = RoleEnum::Manager->value;
        $roleKepalaCabang = RoleEnum::KepalaCabang->value;
        $roles = [];
        if ($office->getAttribute('office_type') === OfficeType::HEADQUARTER->value) {
            if ($employee?->hasRole($roleManager)) {
                $roles[] = $roleDireksi;
            } else {
                $roles[] = $roleManager;
            }
        } elseif ($office->getAttribute('office_type') === OfficeType::BRANCH->value) {
            if ($employee?->hasRole($roleKepalaCabang)) {
                $roles[] = $roleDireksi;
            } else {
                $roles[] = $roleKepalaCabang;
            }
        }

        return $roles;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $request->validate([
            'office_id' => 'required|exists:profiles,id',
        ]);
        $officeSelected = (int) $request->get('office_id');
        $office = Profile::query()->find($officeSelected);
        $userRoles = $this->getRoles($office);
        $roles = Role::query()->whereNot('id', 1)->get();
        $headers = User::query()
            ->where('profile_id', $officeSelected)
            ->where('profile_id', 1)
            ->with('role')
            ->whereHas('role', function ($query) use ($userRoles) {
                $query->whereIn('name', $userRoles);
            })
            ->get();
        $routeName = $this->getRouteName($office);
        $component = 'admin/office-management/employee/create/index';

        return inertia($component, compact('officeSelected', 'roles', 'headers', 'routeName'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $requestValid = $request->validate([
            'name' => 'required|string',
            'username' => 'required|string|unique:'.User::class.',username',
            'email' => 'nullable|email|unique:'.User::class.',email',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|same:password',
            'phone' => 'nullable|string',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'head_id' => 'nullable|exists:users,id',
            'profile_id' => 'required|exists:profiles,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        try {
            DB::beginTransaction();

            $requestValid['password'] = Hash::make($requestValid['password']);
            $user = User::query()
                ->create($requestValid)->load('office');
            $office = $user->getRelation('office');
            $routeName = $this->getRouteName($office);
            activity()
                ->useLog('employee')
                ->performedOn($user)
                ->causedBy(auth()->user())
                ->log('Menambahkan data pengguna');
            flashMessage('Berhasil', 'Data pengguna berhasil ditambahkan');
            DB::commit();

            return redirect()->route($routeName.'.index', ['office_id' => $user->profile_id]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error on EmployeeController@store: {$e->getMessage()}");

            flashMessage('Gagal', 'Penambahan data pengguna gagal', 'error');

            return back()->withErrors(['errors' => 'Gagal menambahkan data pengguna']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $employee)
    {
        $employee = User::query()->with('office')->find($employee->getAttribute('id'));
        $office = $employee->getRelation('office');
        $officeSelected = $office->getAttribute('id');
        $userRoles = $this->getRoles($office, $employee);
        $roles = Role::query()->whereNot('id', 1)->get();
        $headers = User::query()
            ->with('role')
            ->whereHas('role', function ($query) use ($userRoles) {
                $query->whereIn('name', $userRoles);
            })
            ->get();
        $routeName = $this->getRouteName($office);
        $component = 'admin/office-management/employee/edit/index';

        return inertia($component, compact('officeSelected', 'roles', 'employee', 'headers', 'routeName'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $employee)
    {
        $requestValid = $request->validate([
            'name' => 'required|string',
            'username' => 'required|string|unique:'.User::class.',username,'.$employee->getAttribute('id'),
            'email' => 'nullable|email|unique:'.User::class.',email,'.$employee->getAttribute('id'),
            'phone' => 'nullable|string',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'head_id' => 'nullable|exists:users,id',
            'profile_id' => 'required|exists:profiles,id',
            'role_id' => 'required|exists:roles,id',
            'password' => 'nullable|string|min:8',
            'password_confirmation' => 'nullable|required_with:password|same:password',
        ]);

        // get $requestValid value not null
        $requestValid['password'] = $requestValid['password'] ? Hash::make($requestValid['password']) : null;
        $requestValid = array_filter($requestValid, fn ($value) => $value !== null);
        try {
            DB::beginTransaction();

            $user = User::query()->with('office')->find($employee->getAttribute('id'));
            $office = $user->getRelation('office');
            $routeName = $this->getRouteName($office);
            $user->update($requestValid);
            activity()
                ->useLog('employee')
                ->performedOn($user)
                ->causedBy(auth()->user())
                ->log('Mengubah data pengguna');
            flashMessage('Berhasil', 'Perubahan data pengguna berhasil');
            DB::commit();

            return redirect()->route($routeName.'.index', ['office_id' => $user->profile_id]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error on EmployeeController@update: {$e->getMessage()}");

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
        } catch (\Exception $e) {
            flashMessage('Gagal Menghapus Pengguna', 'Terjadi kesalahan saat menghapus pengguna', 'error');
            Log::error("Error on EmployeeController@destroy: {$e->getMessage()}");
            DB::rollBack();

            return back()->withErrors(['errors' => 'Gagal menghapus data pengguna']);
        }
    }
}
