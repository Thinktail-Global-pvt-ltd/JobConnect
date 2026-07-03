<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds is_referral flag and submitted_by_role (jobseeker, chef, employer, agency)
     * to the job_posts table.
     */
    public function up(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            // Whether this post is a referral by a job-seeker or chef
            $table->boolean('is_referral')->default(false)->after('is_pinned');

            // Which user role submitted this post: jobseeker, chef, employer, agency
            $table->string('submitted_by_role')->nullable()->after('is_referral');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            $table->dropColumn(['is_referral', 'submitted_by_role']);
        });
    }
};
