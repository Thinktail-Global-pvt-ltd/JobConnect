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
        Schema::table('training_opportunities', function (Blueprint $table) {
            if (!Schema::hasColumn('training_opportunities', 'is_pinned')) {
                $table->boolean('is_pinned')->default(false)->after('location');
            }
            if (!Schema::hasColumn('training_opportunities', 'status')) {
                $table->string('status')->default('Published')->after('location');
            }
            if (!Schema::hasColumn('training_opportunities', 'duration')) {
                $table->string('duration')->nullable()->after('location');
            }
        });

        Schema::table('admin_posts', function (Blueprint $table) {
            if (!Schema::hasColumn('admin_posts', 'is_pinned')) {
                $table->boolean('is_pinned')->default(false)->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_opportunities', function (Blueprint $table) {
            if (Schema::hasColumn('training_opportunities', 'is_pinned')) {
                $table->dropColumn('is_pinned');
            }
        });

        Schema::table('admin_posts', function (Blueprint $table) {
            if (Schema::hasColumn('admin_posts', 'is_pinned')) {
                $table->dropColumn('is_pinned');
            }
        });
    }
};
