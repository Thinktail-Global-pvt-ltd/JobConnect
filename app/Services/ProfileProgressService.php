<?php

namespace App\Services;

use App\Models\User;
use App\Models\JobPost;
use App\Models\ChefProfile;

class ProfileProgressService
{
    /**
     * Calculate profile progress percentage dynamically for general user.
     */
    public static function calculate(User $user): int
    {
        $percentage = 0;

        // 1. Name (15%)
        if (!empty($user->full_name)) {
            $percentage += 15;
        }

        // 2. Photo (15%)
        if (!empty($user->profile_photo_path)) {
            $percentage += 15;
        }

        // 3. Mobile (10%)
        if (!empty($user->mobile_number)) {
            $percentage += 10;
        }

        // 4. City (15%)
        if (!empty($user->city)) {
            $percentage += 15;
        }

        // 5. Experience Range (20%)
        if (!empty($user->experience_range) || !empty($user->experience_years)) {
            $percentage += 20;
        }

        // 6. Preferred Role (15%)
        if (!empty($user->preferred_role)) {
            $percentage += 15;
        }

        // 7. Skills (10%)
        if (!empty($user->skills) && (is_array($user->skills) ? count($user->skills) > 0 : !empty($user->skills))) {
            $percentage += 10;
        }

        return min($percentage, 100);
    }

    /**
     * Calculate profile completeness for Chef role.
     */
    public static function calculateChef(User $user): array
    {
        $breakdown = [];
        $percentage = 0;

        // 1. Full Name (15%)
        if (!empty($user->full_name)) {
            $percentage += 15;
            $breakdown['full_name'] = 15;
        } else {
            $breakdown['full_name'] = 0;
        }

        // 2. Profile Photo (15%)
        if (!empty($user->profile_photo_path)) {
            $percentage += 15;
            $breakdown['profile_photo'] = 15;
        } else {
            $breakdown['profile_photo'] = 0;
        }

        // 3. Mobile Number (10%)
        if (!empty($user->mobile_number)) {
            $percentage += 10;
            $breakdown['mobile_number'] = 10;
        } else {
            $breakdown['mobile_number'] = 0;
        }

        // 4. City / Location (15%)
        if (!empty($user->city)) {
            $percentage += 15;
            $breakdown['city'] = 15;
        } else {
            $breakdown['city'] = 0;
        }

        // 5. Culinary Experience (15%)
        if (!empty($user->experience_range) || !empty($user->experience_years)) {
            $percentage += 15;
            $breakdown['experience'] = 15;
        } else {
            $breakdown['experience'] = 0;
        }

        // 6. Preferred Role (15%)
        if (!empty($user->preferred_role)) {
            $percentage += 15;
            $breakdown['preferred_role'] = 15;
        } else {
            $breakdown['preferred_role'] = 0;
        }

        // 7. Skills / Cuisine Specialty (15%)
        $chefProfile = ChefProfile::where('user_id', $user->id)->first();
        $hasSkills = !empty($user->skills) && (is_array($user->skills) ? count($user->skills) > 0 : !empty($user->skills));
        $hasSpecialty = $chefProfile && (!empty($chefProfile->cuisine_specialty) || !empty($chefProfile->bio));

        if ($hasSkills || $hasSpecialty) {
            $percentage += 15;
            $breakdown['skills_and_specialty'] = 15;
        } else {
            $breakdown['skills_and_specialty'] = 0;
        }

        $missing = array_keys(array_filter($breakdown, function($val) {
            return $val === 0;
        }));

        return [
            'role' => 'chef',
            'completeness' => min($percentage, 100),
            'percentage' => min($percentage, 100),
            'breakdown' => $breakdown,
            'missing_fields' => array_values($missing)
        ];
    }

    /**
     * Calculate profile completeness for Employer role.
     */
    public static function calculateEmployer(User $user): array
    {
        $breakdown = [];
        $percentage = 0;

        // 1. Company Name / Recruiter Name (25%)
        if (!empty($user->full_name) || !empty($user->current_employer) || !empty($user->company_name)) {
            $percentage += 25;
            $breakdown['company_name'] = 25;
        } else {
            $breakdown['company_name'] = 0;
        }

        // 2. Profile Photo / Company Logo (15%)
        if (!empty($user->profile_photo_path)) {
            $percentage += 15;
            $breakdown['company_logo'] = 15;
        } else {
            $breakdown['company_logo'] = 0;
        }

        // 3. Mobile Number (20%)
        if (!empty($user->mobile_number)) {
            $percentage += 20;
            $breakdown['contact_number'] = 20;
        } else {
            $breakdown['contact_number'] = 0;
        }

        // 4. City / Operating Location (20%)
        if (!empty($user->city)) {
            $percentage += 20;
            $breakdown['location'] = 20;
        } else {
            $breakdown['location'] = 0;
        }

        // 5. Posted Jobs / Business Activity (20%)
        $jobCount = JobPost::where('created_by', $user->id)->count();
        if ($jobCount > 0 || !empty($user->email)) {
            $percentage += 20;
            $breakdown['jobs_or_email'] = 20;
        } else {
            $breakdown['jobs_or_email'] = 0;
        }

        $missing = array_keys(array_filter($breakdown, function($val) {
            return $val === 0;
        }));

        return [
            'role' => 'employer',
            'completeness' => min($percentage, 100),
            'percentage' => min($percentage, 100),
            'breakdown' => $breakdown,
            'missing_fields' => array_values($missing)
        ];
    }

    /**
     * Calculate profile completeness for Talent / Job Seeker role.
     */
    public static function calculateTalent(User $user): array
    {
        $percentage = self::calculate($user);
        return [
            'role' => 'talent',
            'completeness' => $percentage,
            'percentage' => $percentage
        ];
    }
}
