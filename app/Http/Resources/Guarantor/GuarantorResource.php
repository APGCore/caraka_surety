<?php

namespace App\Http\Resources\Guarantor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class GuarantorResource extends JsonResource
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
            'picture' => $this->resource->picture ? Storage::url($this->resource->picture) : null,
            'province' => $this->resource->province?->name,
            'regency' => $this->resource->regency?->name,
            'district' => $this->resource->district?->name,
            'created_at' => $this->resource->created_at->format('d F Y'),
        ];
    }
}
