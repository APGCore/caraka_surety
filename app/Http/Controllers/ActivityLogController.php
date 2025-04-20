<?php

namespace App\Http\Controllers;

use App\Http\Resources\_Refactor\Api\ActivityLog\ActivityLogResource;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    protected object $inertiaComponents;

    public function __construct()
    {
        $this->inertiaComponents = (object) [
            'list' => 'admin/activity-log-management/activity-log/list/index',
        ];
    }

    public function apiSearch(Request $request)
    {
        // request validation
        $search = $request->get('search') ?? '';
        $perPage = (int) ($request->get('per_page') ?? 10);
        $isPageAble = $request->get('is_page_able') ?? 'false';
        $page = (int) ($request->get('page') ?? 1);

        // get the data from the database
        $query = Activity::when($search, function ($query) use ($search) {
            $query->where('log_name', 'like', '%'.$search.'%')
                ->orWhere('description', 'like', '%'.$search.'%');
        })
            ->select(['id', 'log_name', 'description', 'subject_type', 'event', 'subject_id', 'causer_type', 'causer_id', 'properties', 'created_at'])
            ->orderBy('created_at', 'desc');

        // if is page able is true, then paginate the data, otherwise get all the data
        $activities = $isPageAble !== 'false'
          ? $query->paginate(
              perPage: $perPage,
              page: $page
          )
          : $query->get();

        // Store pagination data if it exists
        $pagination = null;
        if ($isPageAble !== 'false') {
            $pagination = [
                'current_page' => $activities->currentPage(),
                'from' => $activities->firstItem(),
                'to' => $activities->lastItem(),
                'last_page' => $activities->lastPage(),
                'per_page' => (int) $perPage,
                'total' => $activities->total(),
            ];
        }

        // list of unique causer_id
        $causerIds = $activities->pluck('causer_id')->filter()->unique();

        // list of user in causer_id
        $users = User::whereIn('id', $causerIds)->pluck('name', 'id');

        // transform the data
        $transformedActivities = $activities->map(function ($activity) use ($users) {
            return [
                'id' => $activity->id,
                'username' => $users[$activity->causer_id] ?? 'Unknown',
                'judul' => $activity->log_name,
                'description' => $activity->description,
                'subject_type' => $activity->subject_type,
                'event' => $activity->event,
                'subject_id' => $activity->subject_id,
                'causer_type' => $activity->causer_type,
                'causer_id' => $activity->causer_id,
                'properties' => $activity->properties,
                'created_at' => $activity->created_at->translatedFormat('d F Y, H:i'),
            ];
        });

        // transform the data to the resource
        $activityLogResource = ActivityLogResource::collection($transformedActivities);

        // if is page able is true, then return the resource with pagination, otherwise return the data
        $datas = $isPageAble !== 'false' ? [
            'data' => $activityLogResource,
            'meta' => $pagination,
        ] : $activityLogResource;

        return $this->responseSuccess('Berhasil mengambil data log aktivitas', $datas);
    }

    /**
     * Handle the incoming request.
     */
    public function index(Request $request)
    {
        Carbon::setLocale('id');
        $request->validate([
            'search' => 'nullable|string',
            'page' => 'nullable|integer',
            'per_page' => 'nullable|integer',
        ]);

        $activities = Activity::when($request->search, function ($query) use ($request) {
            $query->where('log_name', 'like', '%'.$request->search.'%')
                ->orWhere('description', 'like', '%'.$request->search.'%');
        })
            ->select(['id', 'log_name', 'description', 'subject_type', 'event', 'subject_id', 'causer_type', 'causer_id', 'properties', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10, ['*'], 'page', $request->page ?? 1);

        // list of unique causer_id
        $causerIds = $activities->pluck('causer_id')->filter()->unique();

        // list of user in causer_id
        $users = User::whereIn('id', $causerIds)->pluck('name', 'id');

        $result = $activities->map(function ($activity) use ($users) {
            return [
                'id' => $activity->id,
                'username' => $users[$activity->causer_id] ?? 'Unknown',
                'judul' => $activity->log_name,
                'description' => $activity->description,
                'subject_type' => $activity->subject_type,
                'event' => $activity->event,
                'subject_id' => $activity->subject_id,
                'causer_type' => $activity->causer_type,
                'causer_id' => $activity->causer_id,
                'properties' => $activity->properties,
                'created_at' => $activity->created_at->translatedFormat('d F Y, H:i'),
            ];
        });

        // $resultEdited = ActivityLogResource::collection($result);

        $inertiaProps = [
            'page_settings' => [
                'title' => 'Log Aktivitas',
            ],
            'activitylogs' => fn () => $result,
            'meta' => fn () => $activities,
        ];

        return inertia($this->inertiaComponents->list, $inertiaProps);
    }
}
