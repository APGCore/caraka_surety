<?php

namespace App\Http\Controllers;

use App\Traits\currencyConverter;
use App\Traits\HandleErrorMessage;
use App\Traits\RegionTrait;
use App\Traits\ResponseFormat;
use App\Traits\UploadFile;

abstract class Controller
{
    use currencyConverter, HandleErrorMessage, RegionTrait, ResponseFormat, UploadFile;
}
