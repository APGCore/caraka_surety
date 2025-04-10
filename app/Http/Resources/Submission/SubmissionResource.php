<?php

namespace App\Http\Resources\Submission;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmissionResource extends JsonResource
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
            'no_guarantee' => $this->resource->no_guarantee,
            'job_name' => $this->resource->job_name,
            'guarantee_value' => $this->resource->guarantee_value,
            'start_date' => Carbon::parse($this->resource->start_date)->format('d F Y'),
            'end_date' => Carbon::parse($this->resource->end_date)->format('d F Y'),
            'time_period' => $this->resource->time_period,
            'created_at' => $this->resource->created_at->format('d F Y'),
            'blank' => $this->resource->blank ?? $this->resource->blanks->firstWhere('is_broken', false),
            'blanks' => $this->whenLoaded('blanks', $this->resource->blanks),
            'principal' => $this->whenLoaded('principal', function () {
                return [
                    'id' => $this->resource->principal->id,
                    'name' => $this->resource->principal->name,
                ];
            }),
            'guarantor' => $this->whenLoaded('guarantor', function () {
                return [
                    'id' => $this->resource->guarantor->id,
                    'name' => $this->resource->guarantor->name,
                ];
            }),
            'guarantor_branch' => $this->whenLoaded('guarantorBranch', function () {
                return [
                    'id' => $this->resource->guarantorBranch->id,
                    'name' => $this->resource->guarantorBranch->name,
                ];
            }),
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->resource->product->id,
                    'name' => $this->resource->product->name,
                ];
            }),
            'product_type' => $this->whenLoaded('guarantorToProductType', function () {
                return [
                    'id' => $this->resource->guarantorToProductType->id,
                    'name' => $this->resource->guarantorToProductType->name,
                ];
            }),
            'obligee' => $this->whenLoaded('obligee', function () {
                return [
                    'id' => $this->resource->obligee->id,
                    'name' => $this->resource->obligee->name,
                ];
            }),
            'staff' => $this->whenLoaded('staff', function () {
                return [
                    'id' => $this->resource->staff->id,
                    'name' => $this->resource->staff->name,
                    'office' => $this->resource->staff->office->name,
                ];
            }),
            'central_office_rate' => $this->resource->central_office_rate,
            'branch_office_rate' => $this->resource->branch_office_rate,
            'guarantor_rate' => $this->resource->guarantor_rate,
        ];
    }
}
