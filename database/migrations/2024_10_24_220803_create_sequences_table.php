<?php

use App\Models\Guarantor\Guarantor;
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
        Schema::create('sequences', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Guarantor::class, 'guarantor_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('prefix')->nullable();
            $table->integer('length');
            $table->integer('current');
            $table->string('from')->nullable();
            $table->string('suffix')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sequences');
    }
};
