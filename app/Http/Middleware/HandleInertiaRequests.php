<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Gate;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            //
            'location.center.lat' => config('location.center.latitude'),
            'location.center.lng' => config('location.center.longitude'),
            'location.min.lat' => config('location.bound.min.latitude'),
            'location.min.lng' => config('location.bound.min.longitude'),
            'location.max.lat' => config('location.bound.max.latitude'),
            'location.max.lng' => config('location.bound.max.longitude'),
            'location.city' => config('location.city'),
            'import_failures' => fn() => $request
                ->session()
                ->get('import_failures', []),
        ]);
    }
}
