<?php

namespace App\Http\Resources\Guarantor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlankResource extends JsonResource
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
            'is_used' => $this->resource->is_used,
            'is_broken' => $this->resource->is_broken,
            'created_at' => $this->resource->created_at->format('d F Y'),
        ];
    }
}
