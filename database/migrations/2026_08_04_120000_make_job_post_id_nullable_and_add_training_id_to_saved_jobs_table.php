<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('saved_jobs')) {
            try {
                DB::statement('ALTER TABLE saved_jobs MODIFY job_post_id BIGINT UNSIGNED NULL');
            } catch (\Throwable $e) {}

            if (!Schema::hasColumn('saved_jobs', 'training_id')) {
                Schema::table('saved_jobs', function (Blueprint $table) {
                    $table->unsignedBigInteger('training_id')->nullable()->after('job_post_id');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('saved_jobs')) {
            if (Schema::hasColumn('saved_jobs', 'training_id')) {
                Schema::table('saved_jobs', function (Blueprint $table) {
                    $table->dropColumn('training_id');
                });
            }
        }
    }
};
