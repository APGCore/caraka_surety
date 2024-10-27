<?php

use App\Models\RelatedParties\Principal;
use App\Models\RequiredDoc;
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
        Schema::create('principal_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Principal::class, 'principal_id')->constrained()->onDelete('cascade');
            $table->foreignIdFor(RequiredDoc::class, 'required_doc_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('number')->nullable();
            $table->text('url');
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('principal_documents');
    }
};
