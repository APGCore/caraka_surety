<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HostToHostResource extends JsonResource
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
            'guarantor_id' => $this->resource->guarantor_id,
            'guarantor_name' => $this->resource->guarantor_name,
            'guarantor_url_host' => $this->resource->guarantor_url_host,
            'token' => $this->resource->token,
            'accessed_at' => $this->resource->accessed_at,
            'created_at' => $this->resource->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->resource->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
