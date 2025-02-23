<?php

namespace App\Http\Resources\Principal;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PrincipalDocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $principalDocument = collect($this->resource->principalDocument);


        if ($principalDocument->isNotEmpty()) {
            $principalDocument = [
                ...$principalDocument->toArray(),
                'path' => $principalDocument->get('url')
                    ? Storage::url($principalDocument->get('url')) : null,
            ];
        } else {
            $principalDocument = null;
        }

        return [
            ...parent::toArray($request),
            'principal_document' => $principalDocument,
            'created_at' => $this->resource->created_at->format('d F Y'),
        ];
    }
}
