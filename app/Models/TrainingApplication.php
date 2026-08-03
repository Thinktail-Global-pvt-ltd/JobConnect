<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingApplication extends Model
{
    use HasFactory;

    protected $table = 'training_applications';

    protected $fillable = [
        'applicant_id',
        'job_post_id',
        'training_id',
        'employer_id',
        'status',
        'preferred_call_time',
        'is_training',
        'details',
    ];

    protected $casts = [
        'is_training' => 'boolean',
    ];

    public function applicant()
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }

    public function jobPost()
    {
        return $this->belongsTo(JobPost::class, 'job_post_id');
    }

    public function trainingOpportunity()
    {
        return $this->belongsTo(TrainingOpportunity::class, 'training_id');
    }

    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }
}
