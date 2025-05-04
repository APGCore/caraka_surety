<?php

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
        Schema::create('submission_support_docs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Submission::class, 'submission_id')->constrained()->noActionOnDelete();
            $table->string('name');
            $table->string('number');
            $table->string('date');
            $table->text('url');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_support_docs');
    }
};
