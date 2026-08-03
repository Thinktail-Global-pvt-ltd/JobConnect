<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingOpportunity extends Model
{
    protected $fillable = [
        'program_name',
        'provider_name',
        'description',
        'contact_information',
        'location',
        'price',
        'external_link',
        'duration',
        'status',
        'is_pinned',
        'employer_details',
        'skills_covered',
        'benefits',
        'placement_opportunities',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
    ];
}
