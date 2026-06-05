<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    public const ROLE_JOB_SEEKER = 'job_seeker';
    public const ROLE_EMPLOYER = 'employer';
    public const ROLE_AGENCY = 'agency';
    public const ROLE_CHEF = 'chef';
    public const ROLE_ADMINISTRATOR = 'administrator';

    public const ROLES = [
        self::ROLE_JOB_SEEKER,
        self::ROLE_EMPLOYER,
        self::ROLE_AGENCY,
        self::ROLE_CHEF,
        self::ROLE_ADMINISTRATOR,
    ];

    protected $fillable = [
        'user_id',
        'role_type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relationship with user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
