<?php

namespace App\Http\Controllers;

class ExplorController extends Controller
{
    //

    public function index()
    {
        $page = 'explore/index';

        return inertia($page);
    }
}
