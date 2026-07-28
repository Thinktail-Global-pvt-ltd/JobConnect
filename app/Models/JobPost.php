<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    protected $fillable = [
        'created_by',
        'title',
        'category', // india, overseas, community
        'company',
        'salary',
        'salary_min',
        'salary_max',
        'salary_currency',
        'contact_person',
        'location',
        'company_logo_url',
        'contact_info',
        'description',
        'status', // pending, approved, rejected
        'is_pinned',
        'is_referral',          // true if submitted as a referral
        'submitted_by_role',    // jobseeker, chef, employer, agency
        'country',
        'visa_assistance',
        'accommodation_available',
        'contract_duration',
        'experience_range',
        'requirements',
        'benefits',
        'job_type',
        'showcase_image_url',
        'map_image_url',
        'open_positions',
    ];

    protected $casts = [
        'is_pinned'               => 'boolean',
        'is_referral'             => 'boolean',
        'visa_assistance'         => 'boolean',
        'accommodation_available' => 'boolean',
        'requirements'            => 'array',
        'benefits'                => 'array',
        'salary_min'              => 'float',
        'salary_max'              => 'float',
        'open_positions'          => 'integer',
    ];

    protected $appends = [
        'posted_by_role',
        'active_role',
        'user_role',
    ];

    public function getPostedByRoleAttribute(): string
    {
        if (!empty($this->submitted_by_role)) {
            return $this->submitted_by_role;
        }
        if ($this->creator) {
            return $this->creator->active_profile;
        }
        return 'employer';
    }

    public function getActiveRoleAttribute(): string
    {
        return $this->getPostedByRoleAttribute();
    }

    public function getUserRoleAttribute(): string
    {
        return $this->getPostedByRoleAttribute();
    }

    /**
     * Relationship with user creator.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relationship with job applications.
     */
    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    /**
     * Scope for approved posts.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for pending posts.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for feed ordering: is_pinned first, then chronological.
     */
    public function scopeSortedFeed($query)
    {
        return $query->orderBy('is_pinned', 'desc')
                     ->orderBy('created_at', 'desc');
    }

    /**
     * Check if a user has exceeded the daily rate limit of 1 community/referral submission.
     */
    public static function hasExceededDailyLimit(User $user): bool
    {
        return self::where('created_by', $user->id)
            ->where('category', 'community')
            ->where('created_at', '>=', Carbon::now()->subDay())
            ->exists();
    }
}
