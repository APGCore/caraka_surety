<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HostToHostResource  extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'guarantor_id' => $this->guarantor_id,
            'guarantor_name' => $this->guarantor_name,
            'guarantor_url_host' => $this->guarantor_url_host,
            'token' => $this->token,
            'accessed_at' => $this->accessed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
