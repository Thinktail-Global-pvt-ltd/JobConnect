<?php

namespace App\Services;

use App\Models\User;
use App\Models\JobPost;
use App\Models\ChefProfile;
use App\Models\UserSocial;

class ProfileProgressService
{
    /**
     * Helper to strictly check if a field contains actual non-null, non-empty data.
     */
    private static function isFilled($value): bool
    {
        if ($value === null) {
            return false;
        }
        if (is_string($value)) {
            $trimmed = trim($value);
            return $trimmed !== '' && strtolower($trimmed) !== 'null';
        }
        if (is_array($value)) {
            return count(array_filter($value)) > 0;
        }
        if (is_numeric($value)) {
            return true;
        }
        return !empty($value);
    }

    /**
     * Check if user has at least one social media or custom link added.
     */
    private static function hasSocialLinks(User $user): bool
    {
        try {
            $socials = $user->socials ?: UserSocial::where('user_id', $user->id)->first();
            if (!$socials) {
                return false;
            }

            $fields = ['instagram', 'linkedin', 'facebook', 'twitter', 'youtube', 'website', 'github'];
            foreach ($fields as $field) {
                if (self::isFilled($socials->$field)) {
                    return true;
                }
            }

            if (!empty($socials->others)) {
                $others = is_array($socials->others) ? $socials->others : (json_decode($socials->others, true) ?: []);
                if (count(array_filter($others)) > 0) {
                    return true;
                }
            }
        } catch (\Throwable $e) {
            return false;
        }

        return false;
    }

    /**
     * Calculate profile progress percentage dynamically based on user active role.
     */
    public static function calculate(User $user): int
    {
        $role = $user->active_profile ?? 'job_seeker';
        if ($role === 'chef') {
            return self::calculateChef($user)['completeness'];
        } elseif ($role === 'employer') {
            return self::calculateEmployer($user)['completeness'];
        }

        return self::calculateTalent($user)['completeness'];
    }

    /**
     * Calculate profile completeness for Chef role.
     */
    public static function calculateChef(User $user): array
    {
        $breakdown = [];
        $percentage = 0;

        // 1. Full Name (15%)
        if (self::isFilled($user->full_name)) {
            $percentage += 15;
            $breakdown['full_name'] = 15;
        } else {
            $breakdown['full_name'] = 0;
        }

        // 2. Profile Photo (15%)
        if (self::isFilled($user->profile_photo_path)) {
            $percentage += 15;
            $breakdown['profile_photo'] = 15;
        } else {
            $breakdown['profile_photo'] = 0;
        }

        // 3. Mobile Number (10%)
        if (self::isFilled($user->mobile_number)) {
            $percentage += 10;
            $breakdown['mobile_number'] = 10;
        } else {
            $breakdown['mobile_number'] = 0;
        }

        // 4. City / Location (10%)
        if (self::isFilled($user->city)) {
            $percentage += 10;
            $breakdown['city'] = 10;
        } else {
            $breakdown['city'] = 0;
        }

        // 5. Culinary Experience (15%)
        if (self::isFilled($user->experience_range) || self::isFilled($user->experience_years)) {
            $percentage += 15;
            $breakdown['experience'] = 15;
        } else {
            $breakdown['experience'] = 0;
        }

        // 6. Preferred Role (15%)
        if (self::isFilled($user->preferred_role)) {
            $percentage += 15;
            $breakdown['preferred_role'] = 15;
        } else {
            $breakdown['preferred_role'] = 0;
        }

        // 7. Skills / Cuisine Specialty (10%)
        $chefProfile = ChefProfile::where('user_id', $user->id)->first();
        $hasSkills = self::isFilled($user->skills);
        $hasSpecialty = $chefProfile && (self::isFilled($chefProfile->cuisine_specialty) || self::isFilled($chefProfile->bio));

        if ($hasSkills || $hasSpecialty) {
            $percentage += 10;
            $breakdown['skills_and_specialty'] = 10;
        } else {
            $breakdown['skills_and_specialty'] = 0;
        }

        // 8. Social Media Links (10%)
        if (self::hasSocialLinks($user)) {
            $percentage += 10;
            $breakdown['social_links'] = 10;
        } else {
            $breakdown['social_links'] = 0;
        }

        $missing = array_keys(array_filter($breakdown, function($val) {
            return $val === 0;
        }));

        $score = min($percentage, 100);

        return [
            'role' => 'chef',
            'completeness' => $score,
            'percentage' => $score,
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

        // 1. Company Name / Recruiter Name (20%)
        if (self::isFilled($user->full_name) || self::isFilled($user->current_employer) || self::isFilled($user->company_name)) {
            $percentage += 20;
            $breakdown['company_name'] = 20;
        } else {
            $breakdown['company_name'] = 0;
        }

        // 2. Profile Photo / Company Logo (15%)
        if (self::isFilled($user->profile_photo_path)) {
            $percentage += 15;
            $breakdown['company_logo'] = 15;
        } else {
            $breakdown['company_logo'] = 0;
        }

        // 3. Mobile Number (15%)
        if (self::isFilled($user->mobile_number)) {
            $percentage += 15;
            $breakdown['contact_number'] = 15;
        } else {
            $breakdown['contact_number'] = 0;
        }

        // 4. City / Operating Location (20%)
        if (self::isFilled($user->city)) {
            $percentage += 20;
            $breakdown['location'] = 20;
        } else {
            $breakdown['location'] = 0;
        }

        // 5. Posted Jobs / Email (15%)
        $jobCount = JobPost::where('created_by', $user->id)->count();
        if ($jobCount > 0) {
            $percentage += 15;
            $breakdown['posted_jobs'] = 15;
        } else {
            $breakdown['posted_jobs'] = 0;
        }

        // 6. Social Media Links (15%)
        if (self::hasSocialLinks($user)) {
            $percentage += 15;
            $breakdown['social_links'] = 15;
        } else {
            $breakdown['social_links'] = 0;
        }

        $missing = array_keys(array_filter($breakdown, function($val) {
            return $val === 0;
        }));

        $score = min($percentage, 100);

        return [
            'role' => 'employer',
            'completeness' => $score,
            'percentage' => $score,
            'breakdown' => $breakdown,
            'missing_fields' => array_values($missing)
        ];
    }

    /**
     * Calculate profile completeness for Talent / Job Seeker role.
     */
    public static function calculateTalent(User $user): array
    {
        $breakdown = [];
        $percentage = 0;

        // 1. Name (15%)
        if (self::isFilled($user->full_name)) {
            $percentage += 15;
            $breakdown['full_name'] = 15;
        } else {
            $breakdown['full_name'] = 0;
        }

        // 2. Photo (15%)
        if (self::isFilled($user->profile_photo_path)) {
            $percentage += 15;
            $breakdown['profile_photo'] = 15;
        } else {
            $breakdown['profile_photo'] = 0;
        }

        // 3. Mobile (10%)
        if (self::isFilled($user->mobile_number)) {
            $percentage += 10;
            $breakdown['mobile_number'] = 10;
        } else {
            $breakdown['mobile_number'] = 0;
        }

        // 4. City (15%)
        if (self::isFilled($user->city)) {
            $percentage += 15;
            $breakdown['city'] = 15;
        } else {
            $breakdown['city'] = 0;
        }

        // 5. Experience Range (15%)
        if (self::isFilled($user->experience_range) || self::isFilled($user->experience_years)) {
            $percentage += 15;
            $breakdown['experience'] = 15;
        } else {
            $breakdown['experience'] = 0;
        }

        // 6. Preferred Role (10%)
        if (self::isFilled($user->preferred_role)) {
            $percentage += 10;
            $breakdown['preferred_role'] = 10;
        } else {
            $breakdown['preferred_role'] = 0;
        }

        // 7. Skills (10%)
        if (self::isFilled($user->skills)) {
            $percentage += 10;
            $breakdown['skills'] = 10;
        } else {
            $breakdown['skills'] = 0;
        }

        // 8. Social Media Links (10%)
        if (self::hasSocialLinks($user)) {
            $percentage += 10;
            $breakdown['social_links'] = 10;
        } else {
            $breakdown['social_links'] = 0;
        }

        $missing = array_keys(array_filter($breakdown, function($val) {
            return $val === 0;
        }));

        $score = min($percentage, 100);

        return [
            'role' => 'talent',
            'completeness' => $score,
            'percentage' => $score,
            'breakdown' => $breakdown,
            'missing_fields' => array_values($missing)
        ];
    }
}
