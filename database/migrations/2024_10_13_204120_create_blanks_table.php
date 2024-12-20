<?php

use App\Models\Guarantor\Guarantor;
use App\Models\Profile;
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
        Schema::create('blanks', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Guarantor::class, 'guarantor_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Profile::class, 'profile_id')->nullable()
                ->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('from_profile_id')->nullable()->references('id')
                ->on('profiles')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('number');
            $table->boolean('is_used')->default(false);
            $table->boolean('is_broken')->default(false);
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
        Schema::dropIfExists('blanks');
    }
};
