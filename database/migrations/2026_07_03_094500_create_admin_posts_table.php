<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Admin Community Posts — content injected into the job feed
     * every N job items (e.g. every 2 jobs).
     *
     * post_type:  announcement | update | training | banner | general
     * status:     published | draft | archived
     */
    public function up(): void
    {
        Schema::create('admin_posts', function (Blueprint $table) {
            $table->id();

            // Content
            $table->string('title');
            $table->text('body');
            $table->string('post_type')->default('announcement'); // announcement, update, training, banner, general
            $table->string('image_url')->nullable();
            $table->string('cta_label')->nullable();  // e.g. "Learn More", "Register Now"
            $table->string('cta_url')->nullable();

            // Scheduling & visibility
            $table->string('status')->default('published'); // published | draft | archived
            $table->timestamp('publish_at')->nullable();    // future scheduling (optional)

            // Inject frequency: after how many feed items this post appears
            // Default = 2 (every 2 job posts, inject 1 admin post)
            $table->unsignedTinyInteger('inject_every')->default(2);

            // Who created this admin post
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');

            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_posts');
    }
};
