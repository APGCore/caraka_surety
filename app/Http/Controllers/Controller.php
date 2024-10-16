<?php

namespace App\Http\Controllers;

use App\Traits\RegionTrait;
use App\Traits\ResponseFormat;
use App\Traits\UploadFile;

abstract class Controller
{
    use ResponseFormat, UploadFile, RegionTrait;
}
