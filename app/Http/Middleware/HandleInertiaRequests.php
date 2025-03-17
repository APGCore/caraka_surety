<?php

namespace App\Http\Middleware;

use App\Enums\RoleEnum;
use App\Models\Guarantor\Guarantor;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'auth' => fn() => [
                'user' => $request->user()?->load('role'),
            ],
            'roles' => fn() => (object)RoleEnum::getKeyValue(),
            'guarantor' => Guarantor::select(['id', 'name', 'picture'])->firstWhere('id', session('guarantor_id', config('guarantor.id'))),
            'location' => fn() => $request->url(),
            'flash_message' => fn() => [
                'title' => $request->session()->get('title'),
                'description' => $request->session()->get('description'),
                'type' => $request->session()->get('type'),
            ],
        ];
    }
}
