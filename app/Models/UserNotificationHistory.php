<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserNotificationHistory extends Model
{
    use HasFactory;

    protected $table = 'user_notification_histories';

    protected $fillable = [
        'user_id',
        'type',
        'recipient',
        'title',
        'body',
        'status',
        'is_read',
        'metadata',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'metadata' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            self::ensureTableExists();
        });
    }

    /**
     * Ensure user_notification_histories table & columns exist automatically on MySQL database.
     */
    public static function ensureTableExists()
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('user_notification_histories')) {
                \Illuminate\Support\Facades\Schema::create('user_notification_histories', function ($table) {
                    $table->id();
                    $table->unsignedBigInteger('user_id')->nullable();
                    $table->string('type')->default('fcm');
                    $table->string('recipient')->nullable();
                    $table->string('title')->nullable();
                    $table->text('body')->nullable();
                    $table->string('status')->default('sent');
                    $table->boolean('is_read')->default(false);
                    $table->json('metadata')->nullable();
                    $table->timestamps();
                });
            } else {
                if (!\Illuminate\Support\Facades\Schema::hasColumn('user_notification_histories', 'is_read')) {
                    \Illuminate\Support\Facades\Schema::table('user_notification_histories', function ($table) {
                        $table->boolean('is_read')->default(false);
                    });
                }
            }

            if (\Illuminate\Support\Facades\DB::table('user_notification_histories')->count() === 0) {
                \Illuminate\Support\Facades\DB::table('user_notification_histories')->insert([
                    [
                        'user_id' => 1,
                        'type' => 'job_approved',
                        'recipient' => '+91 98765 43210',
                        'title' => '💼 Job Listing Approved',
                        'body' => 'Job Listing "Executive Chef - Fine Dining" was reviewed & approved live.',
                        'status' => 'sent',
                        'is_read' => false,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    [
                        'user_id' => 2,
                        'type' => 'chef_approved',
                        'recipient' => '+91 98123 45678',
                        'title' => '🌟 Chef Profile Published',
                        'body' => 'Chef Profile "Chef Vikram Sharma" published to employer directory.',
                        'status' => 'sent',
                        'is_read' => false,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    [
                        'user_id' => 3,
                        'type' => 'application_received',
                        'recipient' => '+44 7700 900077',
                        'title' => '👤 New Job Application',
                        'body' => 'Application received from Adrian Smith for Executive Pastry Chef.',
                        'status' => 'sent',
                        'is_read' => false,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    [
                        'user_id' => 4,
                        'type' => 'consultation_booked',
                        'recipient' => '+34 612 345 678',
                        'title' => '📅 Overseas Training Enquiry',
                        'body' => 'Maria Lopez submitted enquiry for Culinary Arts Training - Dubai.',
                        'status' => 'sent',
                        'is_read' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ]);
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('ensureTableExists Exception: ' . $e->getMessage());
        }
    }
    /**
     * Safely sanitize metadata to prevent json_encode failures.
     */
    public function setMetadataAttribute($value)
    {
        if (is_string($value)) {
            $this->attributes['metadata'] = $value;
            return;
        }
        if (!is_array($value)) {
            $this->attributes['metadata'] = json_encode(['data' => (string)$value]);
            return;
        }

        $clean = [];
        foreach ($value as $k => $v) {
            if (is_scalar($v) || is_null($v)) {
                $clean[$k] = $v;
            } else {
                $clean[$k] = json_encode($v);
            }
        }
        $this->attributes['metadata'] = json_encode($clean);
    }

    /**
     * Get the recipient User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
