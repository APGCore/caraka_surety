<?php

use App\Models\Profile;
use App\Models\Role;
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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('route_name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('head_id')
                ->after('id')
                ->nullable()
                ->references('id')->on('users')
                ->cascadeOnDelete();
            $table->foreignIdFor(Profile::class, 'profile_id')
                ->after('head_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignIdFor(Role::class, 'role_id')
                ->after('profile_id')
                ->constrained()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['profile_id']);
            $table->dropColumn('profile_id');
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });
        Schema::dropIfExists('roles');
    }
};
