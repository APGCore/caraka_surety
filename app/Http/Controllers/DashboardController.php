<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboardAdmin(Request $request)
    {
        $component = 'admin/dashboard/index';

        return inertia($component);
    }

    public function dashboardStaff(Request $request)
    {
        $component = 'staff/dashboard/index';

        return inertia(component: $component);
    }
}
