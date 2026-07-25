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
            $table->decimal('salary_min', 15, 2)->nullable()->after('salary');
            $table->decimal('salary_max', 15, 2)->nullable()->after('salary_min');
            $table->string('salary_currency', 10)->nullable()->after('salary_max');
            $table->string('contact_person')->nullable()->after('submitted_by_role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            $table->dropColumn(['salary_min', 'salary_max', 'salary_currency', 'contact_person']);
        });
    }
};
