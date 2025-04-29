<?php

namespace App\Http\Resources\Office;

use App\Http\Resources\UserResource;
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
        $limit = $this->resource->profileLimit->first();

        return [
            'id' => $this->resource->id,
            'code' => $this->resource->code,
            'name' => $this->resource->name,
            'email' => $this->resource->email,
            'office_name' => $this->resource->name,
            'profile_limit_id' => $limit ? $limit->id : null,
            'limit' => $limit ? $limit->limit : 0,
            'limit_inherit' => $limit ? $limit->limit_inherit : 0,
            'product_type' => $limit?->guarantorToProductType?->productType?->name ?? 'Belum diatur',
            'created_at' => $this->resource->created_at->format('d-m-Y'),
            'users' => $this->resource->relationLoaded('users') ? UserResource::collection($this->resource->users) : null,
        ];
    }
}
