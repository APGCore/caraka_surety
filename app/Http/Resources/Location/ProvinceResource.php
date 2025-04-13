<?php

namespace App\Http\Resources\Location;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProvinceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        // Set locale to Indonesian for Carbon
        Carbon::setLocale('id');

        return [
            ...parent::toArray($request),
            // 'created_at' => $this->resource->created_at->translatedFormat('d F Y'),
        ];
    }
}
