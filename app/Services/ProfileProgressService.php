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
    /**
     * Check if user has at least one valid social media or custom link added.
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
                $val = trim((string)($socials->$field ?? ''));
                if ($val !== '' && strtolower($val) !== 'null' && strtolower($val) !== 'n/a' && strtolower($val) !== 'undefined') {
                    return true;
                }
            }

            if (!empty($socials->others)) {
                $others = is_array($socials->others) ? $socials->others : (json_decode($socials->others, true) ?: []);
                if (is_array($others)) {
                    foreach ($others as $item) {
                        $val = trim((string)$item);
                        if ($val !== '' && strtolower($val) !== 'null' && strtolower($val) !== 'n/a' && strtolower($val) !== 'undefined') {
                            return true;
                        }
                    }
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
     * Evaluates 15 logical components (Social links group & Photo group marked complete if at least 1 item exists).
     */
    public static function calculateChef(User $user): array
    {
        $breakdown = [];
        $chefProfile = $user->chefProfile ?: ChefProfile::where('user_id', $user->id)->first();
        
        $availInfo = [];
        if ($chefProfile && !empty($chefProfile->availability_info)) {
            $availInfo = is_array($chefProfile->availability_info) 
                ? $chefProfile->availability_info 
                : (json_decode($chefProfile->availability_info, true) ?: []);
        }

        // 1. Full Name
        $breakdown['full_name'] = self::isFilled($user->full_name) ? 7 : 0;

        // 2. Preferred Role
        $breakdown['preferred_role'] = self::isFilled($user->preferred_role) ? 7 : 0;

        // 3. City
        $breakdown['city'] = self::isFilled($user->city) ? 7 : 0;

        // 4. Country
        $breakdown['country'] = self::isFilled($user->country) ? 7 : 0;

        // 5. Experience Range
        $breakdown['experience_range'] = (self::isFilled($user->experience_range) || self::isFilled($user->experience_years)) ? 7 : 0;

        // 6. Cuisine Specialty
        $cuisine = $chefProfile ? $chefProfile->cuisine_specialty : null;
        $breakdown['cuisine_specialty'] = self::isFilled($cuisine) ? 7 : 0;

        // 7. Bio
        $bio = $chefProfile ? $chefProfile->bio : null;
        $breakdown['bio'] = self::isFilled($bio) ? 7 : 0;

        // 8. Location Preference
        $locPref = $availInfo['location_preference'] ?? null;
        $breakdown['location_preference'] = self::isFilled($locPref) ? 7 : 0;

        // 9. Availability / Availability Status
        $avail = $user->availability_status ?: ($availInfo['availability_status'] ?? ($availInfo['status'] ?? null));
        $breakdown['availability'] = self::isFilled($avail) ? 7 : 0;

        // 10. Languages
        $langs = $user->selected_language ?: ($availInfo['languages'] ?? null);
        $breakdown['languages'] = self::isFilled($langs) ? 7 : 0;

        // 11. Skills / Operational Expertise
        $skillsVal = $user->skills ?: ($chefProfile ? ($chefProfile->operational_expertise ?? ($chefProfile->operational_experties ?? null)) : null);
        $breakdown['skills'] = self::isFilled($skillsVal) ? 6 : 0;

        // 12. Regional Experience
        $regExp = $availInfo['regional_experience'] ?? null;
        $breakdown['regional_experience'] = self::isFilled($regExp) ? 6 : 0;

        // 13. Employment Preference
        $empPref = $availInfo['employment_preference'] ?? null;
        $breakdown['employment_preference'] = self::isFilled($empPref) ? 6 : 0;

        // 14. Social Links (COMPLETE if AT LEAST ONE valid social media link is filled in user_socials)
        $hasAnySocial = self::hasSocialLinks($user);
        $breakdown['social_links'] = $hasAnySocial ? 6 : 0;

        // 15. Calendly / Booking Link (COMPLETE if calendly_link is filled)
        $hasCalendly = $chefProfile && self::isFilled($chefProfile->calendly_link);
        $breakdown['calendly_link'] = $hasCalendly ? 6 : 0;

        // 16. Profile Photo (COMPLETE if AT LEAST ONE photo source exists)
        $hasPhoto = self::isFilled($user->profile_photo_path);
        $breakdown['profile_photo'] = $hasPhoto ? 6 : 0;

        // 17. Age
        $ageVal = $user->age ?: ($chefProfile ? $chefProfile->age : ($availInfo['age'] ?? null));
        $breakdown['age'] = self::isFilled($ageVal) ? 6 : 0;

        // 18. Overseas Work Experience
        $overseasExp = $user->overseas_work_experience ?: ($chefProfile ? $chefProfile->overseas_work_experience : null);
        $breakdown['overseas_work_experience'] = self::isFilled($overseasExp) ? 6 : 0;

        $filledCount = 0;
        foreach ($breakdown as $key => $val) {
            if ($val > 0) {
                $filledCount++;
            }
        }

        // Exact percentage out of 100%
        $percentage = round(($filledCount / 18) * 100);

        $missing = array_keys(array_filter($breakdown, function($val) {
            return $val === 0;
        }));

        return [
            'role' => 'chef',
            'completeness' => $percentage,
            'percentage' => $percentage,
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

        // 1. Business Name / Company Name (15%)
        $businessName = $empProfile ? $empProfile->business_name : null;
        if (!self::isFilled($businessName)) {
            $businessName = $user->current_employer;
        }
        if (self::isFilled($businessName)) {
            $percentage += 15;
            $breakdown['business_name'] = 15;
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

        // 5. Business Mobile / Contact Mobile (15%)
        $mobile = $empProfile ? $empProfile->business_mobile : null;
        if (!self::isFilled($mobile)) {
            $mobile = $user->mobile_number;
        }
        if (self::isFilled($mobile)) {
            $percentage += 15;
            $breakdown['business_mobile'] = 15;
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

        // 9. Preferred Language (10%)
        $prefLang = $empProfile ? $empProfile->preferred_language : null;
        if (!self::isFilled($prefLang)) {
            $prefLang = $user->selected_language;
        }
        if (self::isFilled($prefLang)) {
            $percentage += 10;
            $breakdown['preferred_language'] = 10;
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

        // 1. Name (15%)
        if (self::isFilled($user->full_name)) {
            $percentage += 15;
            $breakdown['full_name'] = 15;
        } else {
            $breakdown['full_name'] = 0;
        }

        // 2. Mobile / Email (15%)
        if (self::isFilled($user->mobile_number) || self::isFilled($user->email)) {
            $percentage += 15;
            $breakdown['contact'] = 15;
        } else {
            $breakdown['contact'] = 0;
        }

        // 3. City / Location (15%)
        if (self::isFilled($user->city) || self::isFilled($user->country)) {
            $percentage += 15;
            $breakdown['city'] = 15;
        } else {
            $breakdown['city'] = 0;
        }

        // 4. Experience Range (15%)
        if (self::isFilled($user->experience_range) || self::isFilled($user->experience_years)) {
            $percentage += 15;
            $breakdown['experience'] = 15;
        } else {
            $breakdown['experience'] = 0;
        }

        // 5. Preferred Role (15%)
        if (self::isFilled($user->preferred_role)) {
            $percentage += 15;
            $breakdown['preferred_role'] = 15;
        } else {
            $breakdown['preferred_role'] = 0;
        }

        // 6. Age (13%)
        $ageVal = $user->age ?: ($user->chefProfile ? $user->chefProfile->age : null);
        if (self::isFilled($ageVal)) {
            $percentage += 13;
            $breakdown['age'] = 13;
        } else {
            $breakdown['age'] = 0;
        }

        // 7. Overseas Work Experience (12%)
        $overseasExp = $user->overseas_work_experience ?: ($user->chefProfile ? $user->chefProfile->overseas_work_experience : null);
        if (self::isFilled($overseasExp)) {
            $percentage += 12;
            $breakdown['overseas_work_experience'] = 12;
        } else {
            $breakdown['overseas_work_experience'] = 0;
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
