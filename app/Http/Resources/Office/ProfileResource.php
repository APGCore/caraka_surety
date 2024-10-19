<?php

namespace App\Http\Resources\Office;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'province' => $this->resource->province?->name,
            'regency' => $this->resource->regency?->name,
            'district' => $this->resource->district?->name,
            'profile_limit' => $this->whenLoaded('profileLimit', function () {
                return $this->resource->profileLimit->first();
            }),
            'created_at' => $this->resource->created_at->format('d F Y'),
        ];
    }
}
