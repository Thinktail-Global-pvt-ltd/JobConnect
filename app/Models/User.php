<?php

namespace App\Models;

use App\Services\ProfileProgressService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'mobile_number',
        'full_name',
        'email',
        'profile_photo_path',
        'city',
        'experience_range',
        'preferred_role',
        'current_employer',
        'skills',
        'is_suspended',
        'selected_language',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'is_suspended' => 'boolean',
        ];
    }

    /**
     * Get user roles / profiles.
     */
    public function roles()
    {
        return $this->hasMany(UserRole::class);
    }

    /**
     * Get active role.
     */
    public function activeRole()
    {
        return $this->hasOne(UserRole::class)->where('is_active', true);
    }

    /**
     * Get current active role context model.
     */
    public function currentRoleContext()
    {
        return $this->roles()->where('is_active', true)->first();
    }

    /**
     * Get chef profile.
     */
    public function chefProfile()
    {
        return $this->hasOne(ChefProfile::class);
    }

    /**
     * Get appointments received by the user as a chef.
     */
    public function chefAppointments()
    {
        return $this->hasMany(Appointment::class, 'chef_id');
    }

    /**
     * Get appointments booked by the user as an employer.
     */
    public function employerAppointments()
    {
        return $this->hasMany(Appointment::class, 'employer_id');
    }

    /**
     * Get job posts created by the user.
     */
    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'created_by');
    }

    /**
     * Get job applications submitted by the user.
     */
    public function applications()
    {
        return $this->hasMany(JobApplication::class, 'applicant_id');
    }

    /**
     * Get the user's saved job records.
     */
    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class);
    }

    /**
     * Get the user's bookmarked job posts.
     */
    public function savedJobPosts()
    {
        return $this->belongsToMany(JobPost::class, 'saved_jobs', 'user_id', 'job_post_id')->withTimestamps();
    }

    /**
     * Get the user's employer profile.
     */
    public function employerProfile()
    {
        return $this->hasOne(EmployerProfile::class);
    }

    /**
     * Accessor to dynamically calculate profile completeness percentage.
     */
    public function getProfileCompletenessAttribute(): int
    {
        return ProfileProgressService::calculate($this);
    }

    /**
     * Scope for non-suspended users.
     */
    public function scopeActive($query)
    {
        return $query->where('is_suspended', false);
    }

    /**
     * Helper to verify if user has an active role type.
     */
    public function hasActiveRole(string $roleType): bool
    {
        return $this->roles()->where('role_type', $roleType)->where('is_active', true)->exists();
    }
}
