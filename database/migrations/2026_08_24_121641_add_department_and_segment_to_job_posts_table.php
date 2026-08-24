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
        Schema::table('job_posts', function (Blueprint $table) {
            if (!Schema::hasColumn('job_posts', 'job_role')) {
                $table->string('job_role')->nullable();
            }
            if (!Schema::hasColumn('job_posts', 'industry_segment')) {
                $table->string('industry_segment')->nullable();
            }
            if (!Schema::hasColumn('job_posts', 'job_category')) {
                $table->string('job_category')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            $table->dropColumn(['job_role', 'industry_segment', 'job_category']);
        });
    }
};
