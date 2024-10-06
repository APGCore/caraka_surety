<?php

namespace App\Http\Controllers\Office;

use App\Http\Controllers\Controller;
use App\Http\Resources\Office\EmployeeResource;
use App\Models\Profile;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $offices = Profile::all();
        $officeSelected = $request->get('office_id') ?? $offices->first()->id;

        $employees = User::search($request->get('search'))
            ->where('profile_id', $officeSelected)
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $employeeResource = EmployeeResource::collection($employees);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Karyawan',
            ],
            'offices' => $offices,
            'officeSelected' => $officeSelected,
            'employees' => fn () => $employeeResource,
        ]);
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
        $roles = Role::query()->whereNot('id', 1)->get();

        $component = $request->path().'/index';

        return inertia($component, compact('officeSelected', 'roles'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $requestValid = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:'.User::class.',email',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|same:password',
            'phone' => 'required|string',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'profile_id' => 'required|exists:profiles,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        try {
            DB::beginTransaction();

            $requestValid['password'] = Hash::make($requestValid['password']);
            $user = User::query()
                ->create($requestValid);
            DB::commit();

            return redirect()->route('employee.index', ['office_id' => $user->profile_id]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error on EmployeeController@store: {$e->getMessage()}");

            return back()->withErrors(['errors' => 'Gagal menambahkan data karyawan']);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, string $id)
    {
        $request->validate([
            'office_id' => 'required|exists:profiles,id',
        ]);
        $officeSelected = (int) $request->get('office_id');
        $roles = Role::query()->whereNot('id', 1)->get();
        $employee = User::query()->find($id);

        $component = $request->path();
        $component = substr($component, 0, strrpos($component, '/')).'/index';

        return inertia($component, compact('officeSelected', 'roles', 'employee'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $requestValid = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:'.User::class.',email,'.$id,
            'phone' => 'required|string',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'profile_id' => 'required|exists:profiles,id',
            'role_id' => 'required|exists:roles,id',
            'password' => 'nullable|string|min:8',
            'password_confirmation' => 'nullable|same:password',
        ]);

        try {
            DB::beginTransaction();

            $user = User::query()->find($id);
            $user->update($requestValid);
            DB::commit();

            return redirect()->route('employee.index', ['office_id' => $user->profile_id]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error on EmployeeController@update: {$e->getMessage()}");

            return back()->withErrors(['errors' => 'Gagal mengubah data karyawan']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
