<?php

namespace App\Http\Resources\Location;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegencyResource extends JsonResource
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
            // 'created_at' => $this->resource->created_at->format('d F Y'),
        ];
    }
}
