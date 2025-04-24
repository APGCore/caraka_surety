<?php

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
        Schema::create('principal_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Principal::class, 'principal_id')->constrained()->onDelete('cascade');
            $table->string('obligee_name');
            $table->string('project_name');
            $table->float('contract_value');
            $table->integer('year');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('principal_experiences');
    }
};
