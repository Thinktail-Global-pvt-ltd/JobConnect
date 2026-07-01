<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'business_name',
        'industry_segment',
        'business_location',
        'contact_person_name',
        'business_mobile',
        'business_email',
        'preferred_language',
        'company_logo_path',
        'operational_locations',
        'nominee_name',
        'nominee_relationship',
        'nominee_mobile',
        'is_completed',
    ];

    protected $casts = [
        'operational_locations' => 'array',
        'is_completed' => 'boolean',
    ];

    /**
     * Get the user that owns the employer profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
