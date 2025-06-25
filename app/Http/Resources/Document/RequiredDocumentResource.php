<?php

namespace App\Http\Resources\Document;

use App\Http\Resources\Principal\PrincipalDocumentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequiredDocumentResource extends JsonResource
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
            'principal_document' => $this->whenLoaded('principalDocument', function () {
                return PrincipalDocumentResource::collection($this->resource->principalDocument)->resolve();
            }),
            'created_at' => $this->resource->created_at?->format('d F Y'),
        ];
    }
}
