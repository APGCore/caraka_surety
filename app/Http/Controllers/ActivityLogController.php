<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityLogResource;
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

    /**
     * Handle the incoming request.
     */
    public function index()
    {
        Carbon::setLocale('id');
        $activities = Activity::orderBy('created_at', 'desc')->get();

        // list of unique causer_id
        $causerIds = $activities->pluck('causer_id')->filter()->unique();

        // list of user in causer_id
        $users = User::whereIn('id', $causerIds)->pluck('name', 'id');

        $activities = $activities->map(function ($activity) use ($users) {
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

        // $activities = ActivityLogResource::collection($activities);


        $inertiaProps = [
            'page_settings' => [
                'title' => 'Log Aktivitas',
            ],
            'activitylogs' => fn() => $activities,
        ];



        return inertia($this->inertiaComponents->list, $inertiaProps);
    }
}
