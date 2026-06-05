<?php

namespace App\Services;

use App\Models\User;

class ProfileCompletionService
{
    /**
     * Calculate profile completion percentage dynamically.
     * 
     * Name(15%)
     * Photo(15%)
     * Mobile(10%)
     * City(15%)
     * Experience(20%)
     * Preferred Role(15%)
     * Skills(10%)
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

        // 5. Experience (20%)
        if ($user->experience_years !== null) {
            $percentage += 20;
        }

        // 6. Preferred Role (15%)
        if (!empty($user->preferred_role)) {
            $percentage += 15;
        }

        // 7. Skills (10%)
        if (!empty($user->skills) && is_array($user->skills) && count($user->skills) > 0) {
            $percentage += 10;
        }

        return $percentage;
    }
}
