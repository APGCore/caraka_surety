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

        return inertia($component);
    }



    public function dashboardManager(Request $request)
    {
        $component = 'manager/dashboard/index';

        return inertia($component);
    }


    public function dashboardDireksi(Request $request)
    {
        $component = 'direksi/dashboard/index';

        return inertia($component);
    }


    public function dashboardStaffCabang(Request $request)
    {
        $component = 'staff-cabang/dashboard/index';

        return inertia($component);
    }

    public function dashboardKepalaCabang(Request $request)
    {
        $component = 'kepala-cabang/dashboard/index';

        return inertia($component);
    }
}
