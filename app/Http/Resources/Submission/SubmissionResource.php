<?php

namespace App\Http\Resources\Submission;

use App\Enums\SubmissionStatus;
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
        $employeeLimit = $this->resource->relationLoaded('employeeLimit') ? $this->resource->employeeLimit->firstWhere('employee_id', auth()->id()) : null;
        $productLimit = $this->resource->relationLoaded('guarantorProductTypeLimit') ? $this->resource->guarantorProductTypeLimit : null;
        $employeeLimit = $employeeLimit ? ($this->resource->submission_inherit_id ? $employeeLimit->limit_inherit : $employeeLimit->limit) : 0;
        $productLimit = $productLimit ? ($this->resource->submission_inherit_id ? $productLimit->limit_inherit : $productLimit->limit) : 0;
        $blanks = $this->resource->relationLoaded('blanks') ? $this->resource->blanks : null;

        return [
            ...parent::toArray($request),
            'status_label' => SubmissionStatus::getLabels()[$this->resource->status] ?? null,
            'start_date' => $this->resource->start_date ? Carbon::parse($this->resource->start_date)->format('d F Y') : null,
            'end_date' => $this->resource->end_date ? Carbon::parse($this->resource->end_date)->format('d F Y') : null,
            'created_at' => $this->resource->created_at?->format('d F Y H:i:s') ?? null,
            'blank' => $this->whenLoaded('blank', $this->resource->blank, $blanks?->first()),
            'blanks' => $blanks,
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
                    'full_name' => $this->resource->guarantorToProductType->full_name,
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
            'submission_before' => $this->whenLoaded('submissionBefore', function () {
                return [
                    'id' => $this->resource->submissionBefore->id,
                    'blank' => $this->resource->submissionBefore->blanks->select(['number'])->firstWhere('is_broken', false),
                ];
            }),
            'employee_limit' => $employeeLimit,
            'product_limit' => $productLimit,
            'beyond_the_limit' => $employeeLimit < $this->resource->guarantee_value,
        ];
    }
}
