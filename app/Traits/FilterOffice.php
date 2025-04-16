<?php

namespace App\Traits;

use App\Enums\OfficeType;
use App\Models\Profile\Profile;
use Illuminate\Http\Request;

trait FilterOffice
{
    public function filterOffice(Request $request): object
    {
        $officeTypes = OfficeType::getName();
        array_unshift($officeTypes, 'Semua');
        $officeTypeSelected = $request->get('office_type', $officeTypes[0]);
        $officeType = $officeTypeSelected !== 'Semua' ? OfficeType::getValueOfName()[$officeTypeSelected] : null;
        $offices = Profile::query()->where('office_type', $officeType)->get();
        $officeSelected = $officeTypeSelected != 'Semua' ? ((int) ($request->get('office_id') ?? $offices->first()?->getAttribute('id'))) : 0;

        return (object) compact('offices', 'officeTypes', 'officeSelected', 'officeTypeSelected');
    }
}
