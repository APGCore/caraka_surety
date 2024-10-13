<?php

namespace App\Http\Controllers\Office;

use App\Http\Controllers\Controller;
use App\Http\Requests\Office\StoreRequest;
use App\Http\Requests\Office\UpdateRequest;
use App\Http\Resources\Office\ProfileResource;
use App\Models\Profile;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function index(Request $request): Response
    {
        $profiles = Profile::search($request->get('search'))
            ->where('is_central', false)
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $profileResource = ProfileResource::collection($profiles);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Profile Cabang',
            ],
            'profiles' => fn () => $profileResource,
        ]);
    }

    // create
    public function create(Request $request): Response
    {
        $component = $request->path().'/index';

        return inertia($component);
    }

    public function store(StoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $requestValidated = $request->validated();
            Profile::query()
                ->create($requestValidated);

            flashMessage('Kantor Cabang Ditambahkan', 'Kantor Cabang berhasil ditambahkan');
            DB::commit();

            return redirect()->route('branch.index');
        } catch (\Throwable $th) {
            flashMessage('Gagal Menambahkan Kantor Cabang', 'Terjadi kesalahan saat menambahkan kantor cabang', 'error');
            Log::error('Profil Store: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
            DB::rollBack();

            return redirect()->back();
        }
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request, Profile $profile): Response
    {
        $component = $request->path();
        $component = substr($component, 0, strrpos($component, '/')).'/index';

        return inertia($component, [
            'profile' => $profile,
        ]);
    }

    public function update(UpdateRequest $request, Profile $profile)
    {
        try {
            DB::beginTransaction();
            $requestValidated = $request->validated();
            $profile->update($requestValidated);

            flashMessage('Kantor Cabang Diperbarui', 'Kantor Cabang berhasil diperbarui');
            DB::commit();

            return redirect()->route('branch.index');
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Memperbarui Kantor Cabang', 'Terjadi kesalahan saat memperbarui kantor cabang', 'error');
            Log::error('Profil Update: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));

            return redirect()->back();
        }
    }

    public function destroy(Profile $profile)
    {
        try {
            DB::beginTransaction();

            if ($profile->exists) {
                $profile->delete();
            } else {
                throw new ThrottleRequestsException('Kantor Cabang tidak ditemukan');
            }

            flashMessage('Kantor Cabang Dihapus', 'Kantor Cabang berhasil dihapus');
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Kantor Cabang', 'Terjadi kesalahan saat menghapus kantor cabang', 'error');
            Log::error('Profil Destroy: '.json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }
}
