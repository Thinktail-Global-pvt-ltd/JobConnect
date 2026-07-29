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

    /**
     * Helper to convert enum strings (e.g. late_afternoon, morning) to formatted time ranges.
     */
    public static function parsePreferredCallTime($input): string
    {
        if (empty($input)) {
            return '10:00 AM - 01:00 PM';
        }

        $inputStr = trim((string)$input);
        $normalized = strtolower(str_replace(['-', ' ', '_'], '', $inputStr));

        $timeMap = [
            'earlymorning'   => '08:00 AM - 10:00 AM',
            'midmorning'     => '10:00 AM - 12:00 PM',
            'morning'        => '09:00 AM - 12:00 PM',
            'earlyafternoon' => '12:00 PM - 02:00 PM',
            'lateafternoon'  => '02:00 PM - 05:00 PM',
            'afternoon'      => '02:00 PM - 05:00 PM',
            'evening'        => '05:00 PM - 08:00 PM',
            'night'          => '07:00 PM - 10:00 PM',
        ];

        if (isset($timeMap[$normalized])) {
            return $timeMap[$normalized];
        }

        foreach ($timeMap as $key => $slot) {
            if (str_contains($normalized, $key)) {
                return $slot;
            }
        }

        return $inputStr;
    }

    /**
     * Mutator to ensure preferred_call_time is always human-formatted time range.
     */
    public function setPreferredCallTimeAttribute($value)
    {
        $this->attributes['preferred_call_time'] = self::parsePreferredCallTime($value);
    }
}
