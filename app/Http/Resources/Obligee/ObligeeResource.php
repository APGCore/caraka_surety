<?php

namespace App\Http\Resources\Obligee;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ObligeeResource extends JsonResource
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
            'created_at' => $this->resource->created_at->format('d F Y'),
        ];
    }
}
