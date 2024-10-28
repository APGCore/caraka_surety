<?php

use App\Enums\SubmissionStatus;
use App\Models\RequiredDoc;
use App\Models\Submission\Submission;
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
        Schema::create('submission_docs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Submission::class, 'submission_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(RequiredDoc::class, 'required_doc_id')->constrained()->noActionOnDelete();
            $table->string('name');
            $table->text('url');
            $table->text('description');
            $table->enum('status', SubmissionStatus::getValues())->default(SubmissionStatus::PROCESS->value);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_docs');
    }
};
