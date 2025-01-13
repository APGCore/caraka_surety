<?php

namespace App\Http\Resources\Report;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlankUsageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'number' => $this->resource->number,
            'status' => $this->getStatus(),  // Call the getStatus method
            'issued_at' => $this->resource->issued_at ? $this->resource->issued_at->format('d F Y') : null,
            'expired_at' => $this->resource->expired_at ? $this->resource->expired_at->format('d F Y') : null,
            'guarantor' => $this->whenLoaded('guarantor', function () {
                return [
                    'id' => $this->resource->guarantor->id,
                    'name' => $this->resource->guarantor->name,
                ];
            }),
            'profile' => $this->whenLoaded('profile', function () {
                return [
                    'id' => $this->resource->profile->id,
                    'name' => $this->resource->profile->name,
                ];
            }),
            'from_profile' => $this->whenLoaded('fromProfile', function () {
                return [
                    'id' => $this->resource->fromProfile->id,
                    'name' => $this->resource->fromProfile->name,
                ];
            }),
            'usage' => $this->whenLoaded('usage', function () {
                return BlankUsageResource::collection($this->resource->usage);
            }),
        ];
    }

    /**
     * Get the status string based on the fields.
     */
    private function getStatus(): string
    {
        $status = [];

        if ($this->resource->is_used) {
            $status[] = 'Terpakai';
        }

        if ($this->resource->is_broken) {
            $status[] = 'Rusak';
        }

        if ($this->resource->is_approved) {
            $status[] = 'Disetujui';
        }

        return implode(', ', $status) ?: 'Belum Terpakai';
    }
}
