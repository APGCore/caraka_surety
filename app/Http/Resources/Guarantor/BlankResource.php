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
            'profile' => $this->whenLoaded('profile', function () {
                return [
                    'id' => $this->resource->profile->id,
                    'name' => $this->resource->profile->name,
                ];
            }),
            'guarantor_branch' => $this->whenLoaded('guarantorBranch', function () {
                return [
                    'id' => $this->resource->guarantorBranch->id,
                    'name' => $this->resource->guarantorBranch->name,
                ];
            }),
            'is_used' => $this->resource->is_used,
            'is_broken' => $this->resource->is_broken,
            'created_at' => $this->resource->created_at->format('d F Y'),
        ];
    }
}
