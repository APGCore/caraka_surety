<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class ExampleController extends Controller
{
    //

    public function index()
    {
        return inertia('example/dashboard/index', []);
    }

    public function displayKaryawan(Request $request)
    {

        $searchUser = User::search($request->search)
            ->paginate($request->per_page ?? 10)
            ->appends('query', null)
            ->withQueryString();

        // Apply the resource transformation
        $users = UserResource::collection($searchUser);

        return inertia('example/karyawan/index', [
            'page_settings' => [
                'title' => 'Karyawan',
            ],
            'users' => fn () => $users,
        ]);
    }

    public function displayFile(Request $request)
    {

        return inertia('example/file/index', [
            'page_settings' => [
                'title' => 'File',
            ],

        ]);
    }
}
