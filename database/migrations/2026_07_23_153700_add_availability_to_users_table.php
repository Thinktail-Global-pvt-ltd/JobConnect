<?php

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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'is_available')) {
                $table->boolean('is_available')->default(true)->after('profile_photo_path');
            }
            if (!Schema::hasColumn('users', 'availability_status')) {
                $table->string('availability_status')->default('Available')->after('is_available');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'is_available')) {
                $table->dropColumn('is_available');
            }
            if (Schema::hasColumn('users', 'availability_status')) {
                $table->dropColumn('availability_status');
            }
        });
    }
};
