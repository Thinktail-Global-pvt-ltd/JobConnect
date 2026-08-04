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

        // 1. Full Name (20%)
        if (self::isFilled($user->full_name)) {
            $percentage += 20;
            $breakdown['full_name'] = 20;
        } else {
            $breakdown['full_name'] = 0;
        }

        // 2. Mobile Number (20%)
        if (self::isFilled($user->mobile_number)) {
            $percentage += 20;
            $breakdown['mobile_number'] = 20;
        } else {
            $breakdown['mobile_number'] = 0;
        }

        // 3. City / Location (20%)
        if (self::isFilled($user->city) || self::isFilled($user->country)) {
            $percentage += 20;
            $breakdown['city'] = 20;
        } else {
            $breakdown['city'] = 0;
        }

        // 4. Culinary Experience (20%)
        if (self::isFilled($user->experience_range) || self::isFilled($user->experience_years)) {
            $percentage += 20;
            $breakdown['experience'] = 20;
        } else {
            $breakdown['experience'] = 0;
        }

        // 5. Preferred Role & Chef Profile (20%)
        $chefProfile = $user->chefProfile ?: ChefProfile::where('user_id', $user->id)->first();
        $hasRole = self::isFilled($user->preferred_role);
        $hasChefInfo = $chefProfile && (self::isFilled($chefProfile->cuisine_specialty) || self::isFilled($chefProfile->bio) || self::isFilled($chefProfile->availability_info));

        if ($hasRole || $hasChefInfo) {
            $percentage += 20;
            $breakdown['preferred_role'] = 20;
        } else {
            $breakdown['preferred_role'] = 0;
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
     * Calculate profile completeness for Employer role based on onboarding API fields.
     */
    public static function calculateEmployer(User $user): array
    {
        $breakdown = [];
        $percentage = 0;

        $empProfile = $user->employerProfile ?: \App\Models\EmployerProfile::where('user_id', $user->id)->first();

        // 1. Business Name / Company Name (10%)
        $businessName = $empProfile ? $empProfile->business_name : null;
        if (!self::isFilled($businessName)) {
            $businessName = $user->current_employer;
        }
        if (self::isFilled($businessName)) {
            $percentage += 10;
            $breakdown['business_name'] = 10;
        } else {
            $breakdown['business_name'] = 0;
        }

        // 2. Industry Segment (10%)
        $industry = $empProfile ? $empProfile->industry_segment : null;
        if (self::isFilled($industry)) {
            $percentage += 10;
            $breakdown['industry_segment'] = 10;
        } else {
            $breakdown['industry_segment'] = 0;
        }

        // 3. Business Location / City (10%)
        $location = $empProfile ? $empProfile->business_location : null;
        if (!self::isFilled($location)) {
            $location = $user->city;
        }
        if (self::isFilled($location)) {
            $percentage += 10;
            $breakdown['business_location'] = 10;
        } else {
            $breakdown['business_location'] = 0;
        }

        // 4. Contact Person Name / Full Name (10%)
        $contactPerson = $empProfile ? $empProfile->contact_person_name : null;
        if (!self::isFilled($contactPerson)) {
            $contactPerson = $user->full_name;
        }
        if (self::isFilled($contactPerson)) {
            $percentage += 10;
            $breakdown['contact_person_name'] = 10;
        } else {
            $breakdown['contact_person_name'] = 0;
        }

        // 5. Business Mobile / Contact Mobile (10%)
        $mobile = $empProfile ? $empProfile->business_mobile : null;
        if (!self::isFilled($mobile)) {
            $mobile = $user->mobile_number;
        }
        if (self::isFilled($mobile)) {
            $percentage += 10;
            $breakdown['business_mobile'] = 10;
        } else {
            $breakdown['business_mobile'] = 0;
        }

        // 6. Business Email / Email (10%)
        $email = $empProfile ? $empProfile->business_email : null;
        if (!self::isFilled($email)) {
            $email = $user->email;
        }
        if (self::isFilled($email)) {
            $percentage += 10;
            $breakdown['business_email'] = 10;
        } else {
            $breakdown['business_email'] = 0;
        }

        // 7. Company Logo / Profile Photo on Users Table (10%)
        $logo = $user->profile_photo_path ?: ($empProfile ? $empProfile->company_logo_path : null);
        if (self::isFilled($logo)) {
            $percentage += 10;
            $breakdown['company_logo'] = 10;
        } else {
            $breakdown['company_logo'] = 0;
        }

        // 8. Operational Locations (10%)
        $opsLocations = $empProfile ? $empProfile->operational_locations : null;
        if (self::isFilled($opsLocations)) {
            $percentage += 10;
            $breakdown['operational_locations'] = 10;
        } else {
            $breakdown['operational_locations'] = 0;
        }

        // 9. Nominee Name (5%)
        $nomineeName = $empProfile ? $empProfile->nominee_name : null;
        if (self::isFilled($nomineeName) && $nomineeName !== 'N/A') {
            $percentage += 5;
            $breakdown['nominee_name'] = 5;
        } else {
            $breakdown['nominee_name'] = 0;
        }

        // 10. Nominee Relationship (5%)
        $nomineeRel = $empProfile ? $empProfile->nominee_relationship : null;
        if (self::isFilled($nomineeRel) && $nomineeRel !== 'N/A') {
            $percentage += 5;
            $breakdown['nominee_relationship'] = 5;
        } else {
            $breakdown['nominee_relationship'] = 0;
        }

        // 11. Nominee Mobile (5%)
        $nomineeMobile = $empProfile ? $empProfile->nominee_mobile : null;
        if (self::isFilled($nomineeMobile) && $nomineeMobile !== 'N/A') {
            $percentage += 5;
            $breakdown['nominee_mobile'] = 5;
        } else {
            $breakdown['nominee_mobile'] = 0;
        }

        // 12. Preferred Language (5%)
        $prefLang = $empProfile ? $empProfile->preferred_language : null;
        if (!self::isFilled($prefLang)) {
            $prefLang = $user->selected_language;
        }
        if (self::isFilled($prefLang)) {
            $percentage += 5;
            $breakdown['preferred_language'] = 5;
        } else {
            $breakdown['preferred_language'] = 0;
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

        // 1. Name (20%)
        if (self::isFilled($user->full_name)) {
            $percentage += 20;
            $breakdown['full_name'] = 20;
        } else {
            $breakdown['full_name'] = 0;
        }

        // 2. Mobile (20%)
        if (self::isFilled($user->mobile_number)) {
            $percentage += 20;
            $breakdown['mobile_number'] = 20;
        } else {
            $breakdown['mobile_number'] = 0;
        }

        // 3. City / Location (20%)
        if (self::isFilled($user->city) || self::isFilled($user->country)) {
            $percentage += 20;
            $breakdown['city'] = 20;
        } else {
            $breakdown['city'] = 0;
        }

        // 4. Experience Range (20%)
        if (self::isFilled($user->experience_range) || self::isFilled($user->experience_years)) {
            $percentage += 20;
            $breakdown['experience'] = 20;
        } else {
            $breakdown['experience'] = 0;
        }

        // 5. Preferred Role (20%)
        if (self::isFilled($user->preferred_role)) {
            $percentage += 20;
            $breakdown['preferred_role'] = 20;
        } else {
            $breakdown['preferred_role'] = 0;
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
