<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ExplorController extends Controller
{
    //

    public function index()
    {
        $page = 'explore/index';

        return inertia($page);
    }
}
