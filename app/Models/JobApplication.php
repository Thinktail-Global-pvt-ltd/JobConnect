<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $fillable = [
        'applicant_id',
        'job_post_id',
        'employer_id',
        'status', // new, contacted, shortlisted, hired, rejected
        'preferred_call_time',
    ];

    /**
     * Relationship with applicant.
     */
    public function applicant()
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }

    /**
     * Relationship with job post.
     */
    public function jobPost()
    {
        return $this->belongsTo(JobPost::class, 'job_post_id');
    }

    /**
     * Relationship alias for snake_case job_post.
     */
    public function job_post()
    {
        return $this->belongsTo(JobPost::class, 'job_post_id');
    }

    /**
     * Relationship with employer.
     */
    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }
}
