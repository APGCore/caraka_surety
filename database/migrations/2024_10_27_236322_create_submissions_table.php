<?php

use App\Enums\SubmissionStatus;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Product\Product;
use App\Models\RelatedParties\Obligee;
use App\Models\RelatedParties\Principal;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Principal::class, 'principal_id')->constrained()->nullOnDelete();
            $table->foreignIdFor(Guarantor::class, 'guarantor_id')->constrained()->nullOnDelete();
            $table->foreignIdFor(Product::class, 'product_id')->constrained()->nullOnDelete();
            $table->foreignIdFor(GuarantorToProductType::class, 'guarantor_to_product_type_id')->constrained()->nullOnDelete();
            $table->foreignIdFor(Obligee::class, 'obligee_id')->constrained()->nullOnDelete();
            $table->string('contract_doc_name');
            $table->string('contract_doc_number');
            $table->string('contract_doc_date');
            $table->float('contract_value');
            $table->float('guarantee_value');
            $table->integer('time_period');
            $table->timestamp('start_date');
            $table->timestamp('end_date');
            $table->string('job_name');
            $table->timestamp('guarantee_issue_date');
            $table->string('job_location');
            $table->string('source_of_funds');
            $table->enum('status', SubmissionStatus::getValues())->default(SubmissionStatus::PROCESS); // status
            $table->text('note')->nullable();
            $table->text('note_scoring')->nullable();
            $table->text('min_point_scoring')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
