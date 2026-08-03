<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class ProfileController extends Controller
{
    /**
     * Get user photo directly from users table profile_photo_path column (no auto-fill/cache fallback)
     */
    private function getUserPhoto($user = null)
    {
        if (!$user) {
            return null;
        }

        // 1. Return direct profile_photo_path from users table if set
        if (!empty($user->profile_photo_path)) {
            return $user->profile_photo_path;
        }

        // 2. If user has employer profile with company_logo_path, return that
        if ($user->employerProfile && !empty($user->employerProfile->company_logo_path)) {
            return $user->employerProfile->company_logo_path;
        }

        return null;
    }

    /**
     * Fetch user profile.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        if (!$user && $request->bearerToken()) {
            $tokenStr = $request->bearerToken();
            $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);
            if ($tokenObj) {
                $user = $tokenObj->tokenable;
            }
        }
        if (!$user) {
            $user = User::first();
        }

        if ($user) {
            $user->load(['chefProfile', 'employerProfile', 'socials']);
        }
        
        $photo = $this->getUserPhoto($user);

        $activeRole = $user ? ($user->active_profile ?: 'job_seeker') : 'job_seeker';

        $chefData = null;
        $employerData = null;

        if ($activeRole === 'chef') {
            if ($user && $user->chefProfile) {
                $availability = [];
                if ($user->chefProfile->availability_info) {
                    $availability = is_array($user->chefProfile->availability_info) ? $user->chefProfile->availability_info : (json_decode($user->chefProfile->availability_info, true) ?: []);
                }
                $chefData = [
                    'id' => $user->chefProfile->id,
                    'user_id' => $user->chefProfile->user_id,
                    'cuisine_specialty' => $user->chefProfile->cuisine_specialty ?: null,
                    'specialties' => $user->chefProfile->cuisine_specialty ?: null,
                    'bio' => $user->chefProfile->bio ?: null,
                    'calendly_link' => $user->chefProfile->calendly_link ?: null,
                    'availability_info' => $availability,
                    'approval_status' => $user->chefProfile->approval_status ?: 'approved',
                    'status' => $user->chefProfile->approval_status ?: 'approved',
                ];
            }
        } elseif ($activeRole === 'employer') {
            if ($user && $user->employerProfile) {
                $ops = $user->employerProfile->operational_locations;
                if (is_string($ops)) {
                    $ops = json_decode($ops, true) ?: [];
                }
                $employerData = [
                    'id' => $user->employerProfile->id,
                    'user_id' => $user->employerProfile->user_id,
                    'business_name' => $user->employerProfile->business_name ?: null,
                    'company_name' => $user->employerProfile->business_name ?: null,
                    'industry_segment' => $user->employerProfile->industry_segment ?: null,
                    'description' => $user->employerProfile->industry_segment ?: null,
                    'business_location' => $user->employerProfile->business_location ?: null,
                    'city' => $user->employerProfile->business_location ?: null,
                    'contact_person_name' => $user->employerProfile->contact_person_name ?: null,
                    'designation' => $user->employerProfile->contact_person_name ?: null,
                    'business_mobile' => $user->employerProfile->business_mobile ?: null,
                    'business_email' => $user->employerProfile->business_email ?: null,
                    'preferred_language' => $user->employerProfile->preferred_language ?: null,
                    'company_logo_path' => $user->employerProfile->company_logo_path ?: null,
                    'company_logo_url' => $user->employerProfile->company_logo_path ?: null,
                    'operational_locations' => is_array($ops) ? $ops : [],
                    'nominee_name' => $user->employerProfile->nominee_name ?: null,
                    'nominee_relationship' => $user->employerProfile->nominee_relationship ?: null,
                    'nominee_mobile' => $user->employerProfile->nominee_mobile ?: null,
                    'is_completed' => (bool)$user->employerProfile->is_completed,
                    'created_at' => $user->employerProfile->created_at ? $user->employerProfile->created_at->toIso8601String() : null,
                    'updated_at' => $user->employerProfile->updated_at ? $user->employerProfile->updated_at->toIso8601String() : null,
                ];
            }
        }

        // Talent Side Profile Data Construction
        $talentData = null;
        if ($user) {
            $skillsArray = [];
            if (is_array($user->skills)) {
                $skillsArray = $user->skills;
            } elseif (is_string($user->skills) && !empty($user->skills)) {
                $skillsArray = json_decode($user->skills, true) ?: array_values(array_filter(array_map('trim', explode(',', $user->skills))));
            }

            $talentCompleteness = \App\Services\ProfileProgressService::calculateTalent($user)['completeness'];

            $talentData = [
                'id' => $user->id,
                'user_id' => $user->id,
                'full_name' => $user->full_name ?: null,
                'name' => $user->full_name ?: null,
                'email' => $user->email ?: null,
                'gender' => $user->gender ?: null,
                'mobile_number' => $user->mobile_number ?: null,
                'country' => $user->country ?: null,
                'city' => $user->city ?: null,
                'experience_range' => $user->experience_range ?: ($user->experience_years ?: null),
                'experience_years' => $user->experience_range ?: ($user->experience_years ?: null),
                'preferred_role' => $user->preferred_role ?: null,
                'current_employer' => $user->current_employer ?: null,
                'skills' => !empty($skillsArray) ? $skillsArray : null,
                'availability_status' => $user->availability_status ?: null,
                'is_available' => (bool)$user->is_available,
                'selected_language' => $user->selected_language ?: null,
                'profile_photo_path' => $photo,
                'completeness' => $talentCompleteness,
                'profile_completeness' => $talentCompleteness,
                'created_at' => $user->created_at ? $user->created_at->toIso8601String() : null,
                'updated_at' => $user->updated_at ? $user->updated_at->toIso8601String() : null,
            ];
        }

        // Ensure social media schema includes youtube, website, github, others
        if (\Illuminate\Support\Facades\Schema::hasTable('user_socials')) {
            if (!\Illuminate\Support\Facades\Schema::hasColumn('user_socials', 'youtube')) {
                try {
                    \Illuminate\Support\Facades\Schema::table('user_socials', function (\Illuminate\Database\Schema\Blueprint $table) {
                        $table->string('youtube', 255)->nullable();
                        $table->string('website', 255)->nullable();
                        $table->string('github', 255)->nullable();
                        $table->text('others')->nullable();
                    });
                } catch (\Throwable $e) {}
            }
        }

        $socialsObj = $user ? $user->socials : null;
        $othersList = [];
        if ($socialsObj && $socialsObj->others) {
            $othersList = is_array($socialsObj->others) ? $socialsObj->others : (json_decode($socialsObj->others, true) ?: []);
        }

        $socialsData = [
            'instagram' => $socialsObj ? ($socialsObj->instagram ?: null) : null,
            'linkedin'  => $socialsObj ? ($socialsObj->linkedin ?: null) : null,
            'facebook'  => $socialsObj ? ($socialsObj->facebook ?: null) : null,
            'twitter'   => $socialsObj ? ($socialsObj->twitter ?: null) : null,
            'youtube'   => $socialsObj ? ($socialsObj->youtube ?: null) : null,
            'website'   => $socialsObj ? ($socialsObj->website ?: null) : null,
            'github'    => $socialsObj ? ($socialsObj->github ?: null) : null,
            'others'    => $othersList,
        ];

        $activeRole = $user ? $user->active_profile : 'job_seeker';
        $completeness = $user ? \App\Services\ProfileProgressService::calculate($user) : 0;

        // Extract location_preference & employment_preference safely if available
        $chefAvailability = ($user && $user->chefProfile && $user->chefProfile->availability_info)
            ? (is_array($user->chefProfile->availability_info) ? $user->chefProfile->availability_info : (json_decode($user->chefProfile->availability_info, true) ?: []))
            : [];
            
        $jobLocation = ($user && $user->city) ? $user->city : ($chefAvailability['location_preference'] ?? null);
        $preference = ($user && $user->preferred_role) ? $user->preferred_role : (is_array($chefAvailability['employment_preference'] ?? null) ? implode(', ', $chefAvailability['employment_preference']) : ($chefAvailability['employment_preference'] ?? null));
        $country = ($user && !empty($user->country)) ? $user->country : null;
        $city = ($user && !empty($user->city)) ? $user->city : ($employerData['city'] ?? null);

        $isAvailable = $user ? (bool)$user->is_available : true;
        $availabilityStatus = ($user && !empty($user->availability_status)) ? $user->availability_status : null;

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user ? $user->id : null,
                'mobile_number' => $user ? $user->mobile_number : null,
                'full_name' => $user ? $user->full_name : null,
                'name' => $user ? $user->full_name : null,
                'email' => $user ? $user->email : null,
                'gender' => $user ? $user->gender : null,
                'profile_photo_path' => $photo,
                'country' => $country,
                'city' => $city,
                'job_location' => $jobLocation,
                'preference' => $preference,
                'experience_years' => $user ? ($user->experience_range ?: $user->experience_years) : null,
                'experience_range' => $user ? ($user->experience_range ?: $user->experience_years) : null,
                'preferred_role' => $user ? $user->preferred_role : null,
                'current_employer' => $user ? $user->current_employer : null,
                'skills' => $user ? $user->skills : null,
                'availability_status' => $availabilityStatus,
                'is_available' => $isAvailable,
                'selected_language' => ($user && $user->selected_language) ? $user->selected_language : null,
                'active_profile' => $activeRole,
                'active_role' => $activeRole,
                'user_role' => $activeRole,
                'completeness' => $completeness,
                'profile_completeness' => $completeness,
                'talent_profile' => $talentData,
                'talent_profile_details' => $talentData,
                'job_seeker_profile' => $talentData,
                'chef_profile' => $chefData,
                'chef_profile_details' => $chefData,
                'employer_profile' => $employerData,
                'socials' => $socialsData,
            ],
            'country' => $country,
            'city' => $city,
            'job_location' => $jobLocation,
            'preference' => $preference,
            'availability_status' => $availabilityStatus,
            'is_available' => $isAvailable,
            'talent_profile' => $talentData,
            'talent_profile_details' => $talentData,
            'job_seeker_profile' => $talentData,
            'chef_profile' => $chefData,
            'employer_profile' => $employerData,
            'socials' => $socialsData,
        ]);
    }

    /**
     * Update user profile.
     */
    public function update(Request $request)
    {
        return $this->updatePersonal($request);
    }

    /**
     * Show personal profile for /profile/personal endpoint.
     */
    public function showPersonal(Request $request)
    {
        try {
            $user = $request->user() ?? User::first();
            $photo = $this->getUserPhoto($user);

            $skillsData = null;
            if ($user && $user->skills) {
                if (is_array($user->skills)) {
                    $skillsData = implode(', ', $user->skills);
                } elseif (is_string($user->skills) && !empty($user->skills)) {
                    $skillsData = $user->skills;
                }
            }

            $profileData = [
                'full_name' => $user ? $user->full_name : null,
                'email' => $user ? $user->email : null,
                'country' => $user ? $user->country : null,
                'city' => $user ? $user->city : null,
                'gender' => $user ? $user->gender : null,
                'experience_range' => $user ? ($user->experience_range ?: ($user->experience_years ? $user->experience_years . ' Years' : null)) : null,
                'experience_years' => $user ? ($user->experience_range ?: ($user->experience_years ? $user->experience_years . ' Years' : null)) : null,
                'current_employer' => $user ? $user->current_employer : null,
                'job_type' => $user ? $user->preferred_role : null,
                'location_preference' => $user ? $user->city : null,
                'preferred_role' => $user ? $user->preferred_role : null,
                'skills' => $skillsData,
                'profile_photo_path' => $photo
            ];

            return response()->json([
                'status' => 'success',
                'data' => $profileData
            ], 200);

        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('showPersonal Exception: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => $e->getMessage(),
                'error_type' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => array_slice(explode("\n", $e->getTraceAsString()), 0, 10)
            ], 500);
        }
    }

    /**
     * Update personal profile for /profile/personal endpoint (Supports JSON & File Uploads).
     */
    public function updatePersonal(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user && $request->bearerToken()) {
                $tokenStr = $request->bearerToken();
                $tokenObj = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);
                if ($tokenObj) {
                    $user = $tokenObj->tokenable;
                }
            }
            if (!$user) {
                $user = User::first();
            }

            $photoUrl = null;

            // 1. Check for File Uploads across all possible form keys safely (including company_logo)
            $fileKey = null;
            if ($request->hasFile('company_logo')) {
                $fileKey = 'company_logo';
            } elseif ($request->hasFile('company_logo_path')) {
                $fileKey = 'company_logo_path';
            } elseif ($request->hasFile('logo')) {
                $fileKey = 'logo';
            } elseif ($request->hasFile('profile_photo_path')) {
                $fileKey = 'profile_photo_path';
            } elseif ($request->hasFile('profile_photo')) {
                $fileKey = 'profile_photo';
            } elseif ($request->hasFile('file')) {
                $fileKey = 'file';
            } elseif ($request->hasFile('avatar')) {
                $fileKey = 'avatar';
            } elseif ($request->hasFile('image')) {
                $fileKey = 'image';
            }

            if ($fileKey && $request->file($fileKey) && $request->file($fileKey)->isValid()) {
                $file = $request->file($fileKey);
                $filename = time() . '_' . preg_replace('/[^A-Za-z0-9\._-]/', '', $file->getClientOriginalName());
                
                // Ensure uploads directory exists
                $destinationPath = public_path('uploads');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }

                $file->move($destinationPath, $filename);
                $photoUrl = url('uploads/' . $filename);
            } else {
                // 2. Check for URL string input if no valid file was uploaded
                $inputPhoto = $request->input('company_logo') ?? $request->input('company_logo_path') ?? $request->input('logo') ?? $request->input('profile_photo_path') ?? $request->input('profile_photo') ?? $request->input('image');
                if (!empty($inputPhoto) && is_string($inputPhoto) && !str_contains($inputPhoto, '@')) {
                    $photoUrl = $inputPhoto;
                }
            }

            // Strictly update ONLY fields present in the request
            if ($user) {
                if ($request->has('full_name')) {
                    $user->full_name = $request->input('full_name');
                }
                if ($request->has('email')) {
                    $requestedEmail = $request->input('email');
                    if ($requestedEmail) {
                        $isEmailTakenByOther = User::where('email', $requestedEmail)
                            ->where('id', '!=', $user->id)
                            ->exists();

                        if (!$isEmailTakenByOther) {
                            $user->email = $requestedEmail;
                        }
                    }
                }
                if ($request->has('country')) {
                    $user->country = $request->input('country');
                }
                if ($request->has('city')) {
                    $user->city = $request->input('city');
                }
                if ($request->has('gender') && \Illuminate\Support\Facades\Schema::hasColumn('users', 'gender')) {
                    $user->gender = $request->input('gender');
                }
                if ($request->has('experience_range')) {
                    $user->experience_range = $request->input('experience_range');
                } elseif ($request->has('experience_years')) {
                    $user->experience_range = $request->input('experience_years');
                }
                if ($request->has('current_employer')) {
                    $user->current_employer = $request->input('current_employer');
                }
                if ($request->has('preferred_role')) {
                    $user->preferred_role = $request->input('preferred_role');
                }
                if ($request->has('skills')) {
                    $skillsInput = $request->input('skills');
                    $skillsArray = [];
                    if (is_array($skillsInput)) {
                        $skillsArray = array_values(array_filter(array_map('trim', $skillsInput)));
                    } elseif (is_string($skillsInput) && !empty($skillsInput)) {
                        $skillsArray = array_values(array_filter(array_map('trim', explode(',', $skillsInput))));
                    }
                    $user->skills = $skillsArray;
                }
                if ($photoUrl) {
                    $user->profile_photo_path = $photoUrl;
                }

                // Parse and update Availability if provided in request
                if ($request->has('availability_status') || $request->has('is_available') || $request->has('availability')) {
                    $rawAvail = $request->input('availability_status') ?? $request->input('is_available') ?? $request->input('availability');
                    $isAvail = true;
                    if (is_bool($rawAvail)) {
                        $isAvail = $rawAvail;
                    } elseif (is_string($rawAvail)) {
                        $norm = strtolower(trim($rawAvail));
                        if (in_array($norm, ['unavailable', 'false', '0', 'off', 'hidden', 'inactive', 'not available'])) {
                            $isAvail = false;
                        }
                    } elseif (is_numeric($rawAvail)) {
                        $isAvail = (int)$rawAvail === 1;
                    }

                    $statusStr = $isAvail ? 'Available' : 'Unavailable';
                    $user->is_available = $isAvail;
                    $user->availability_status = $statusStr;

                    if ($user->chefProfile) {
                        $existingInfo = [];
                        if (!empty($user->chefProfile->availability_info)) {
                            if (is_array($user->chefProfile->availability_info)) {
                                $existingInfo = $user->chefProfile->availability_info;
                            } elseif (is_string($user->chefProfile->availability_info)) {
                                $decoded = json_decode($user->chefProfile->availability_info, true);
                                if (is_array($decoded)) {
                                    $existingInfo = $decoded;
                                } else {
                                    $existingInfo['legacy_info'] = $user->chefProfile->availability_info;
                                }
                            }
                        }
                        $existingInfo['status'] = $statusStr;
                        $existingInfo['availability_status'] = $statusStr;
                        $existingInfo['is_available'] = $isAvail;

                        $user->chefProfile->availability_info = json_encode($existingInfo);
                        $user->chefProfile->save();
                    }
                }

                try {
                    $user->save();
                } catch (\Illuminate\Database\QueryException $qe) {
                    if (str_contains($qe->getMessage(), "Unknown column 'gender'")) {
                        try {
                            \Illuminate\Support\Facades\DB::statement("ALTER TABLE users ADD COLUMN gender VARCHAR(50) NULL AFTER email");
                            $user->save();
                        } catch (\Throwable $ex) {
                            $user->offsetUnset('gender');
                            unset($user->gender);
                            $user->save();
                        }
                    } else {
                        throw $qe;
                    }
                }

                // Handle Social Links updates safely
                $socialsPayload = $request->input('socials') ?? $request->only(['linkedin', 'instagram', 'facebook', 'twitter', 'youtube', 'website', 'github', 'others']);
                if (is_array($socialsPayload) && !empty(array_filter($socialsPayload))) {
                    $instagram = $socialsPayload['instagram'] ?? $request->input('instagram');
                    $linkedin  = $socialsPayload['linkedin'] ?? $request->input('linkedin');
                    $facebook   = $socialsPayload['facebook'] ?? $request->input('facebook');
                    $twitter    = $socialsPayload['twitter'] ?? $request->input('twitter');
                    $youtube    = $socialsPayload['youtube'] ?? $request->input('youtube');
                    $website    = $socialsPayload['website'] ?? $request->input('website');
                    $github     = $socialsPayload['github'] ?? $request->input('github');
                    $others     = $socialsPayload['others'] ?? $request->input('others');

                    if (is_array($others)) {
                        $others = json_encode($others);
                    }

                    \App\Models\UserSocial::updateOrCreate(
                        ['user_id' => $user->id],
                        array_filter([
                            'instagram' => $instagram,
                            'linkedin'  => $linkedin,
                            'facebook'  => $facebook,
                            'twitter'   => $twitter,
                            'youtube'   => $youtube,
                            'website'   => $website,
                            'github'    => $github,
                            'others'    => $others,
                        ], fn($val) => !is_null($val))
                    );
                }

                // Sync to EmployerProfile model if user is an employer or employer profile fields are explicitly provided
                if ($user && ($user->active_profile === 'employer' || $request->hasAny(['business_name', 'company_name', 'industry_segment', 'business_location', 'contact_person_name', 'business_mobile', 'business_email', 'operational_locations', 'company_logo']))) {
                    $empProfile = \App\Models\EmployerProfile::firstOrNew(['user_id' => $user->id]);

                    if ($request->has('business_name') || $request->has('company_name')) {
                        $empProfile->business_name = $request->input('business_name') ?? $request->input('company_name');
                    }
                    if ($request->has('industry_segment') || $request->has('description')) {
                        $empProfile->industry_segment = $request->input('industry_segment') ?? $request->input('description');
                    }
                    if ($request->has('business_location') || $request->has('city')) {
                        $empProfile->business_location = $request->input('business_location') ?? $request->input('city');
                    }
                    if ($request->has('contact_person_name') || $request->has('full_name')) {
                        $empProfile->contact_person_name = $request->input('contact_person_name') ?? $request->input('full_name');
                    }
                    if ($request->has('business_mobile') || $request->has('mobile_number')) {
                        $empProfile->business_mobile = $request->input('business_mobile') ?? $request->input('mobile_number');
                    }
                    if ($request->has('business_email') || $request->has('email')) {
                        $empProfile->business_email = $request->input('business_email') ?? $request->input('email');
                    }
                    if ($request->has('preferred_language')) {
                        $empProfile->preferred_language = $request->input('preferred_language');
                    }
                    if ($request->has('nominee_name')) {
                        $empProfile->nominee_name = $request->input('nominee_name');
                    }
                    if ($request->has('nominee_relationship')) {
                        $empProfile->nominee_relationship = $request->input('nominee_relationship');
                    }
                    if ($request->has('nominee_mobile')) {
                        $empProfile->nominee_mobile = $request->input('nominee_mobile');
                    }
                    if ($photoUrl) {
                        $empProfile->company_logo_path = $photoUrl;
                    }
                    if ($request->has('operational_locations')) {
                        $opsLocations = $request->input('operational_locations');
                        $empProfile->operational_locations = is_array($opsLocations) ? json_encode($opsLocations) : $opsLocations;
                    }
                    $empProfile->is_completed = true;
                    $empProfile->save();
                }
            }

            $skillsFormatted = null;
            if ($user && $user->skills) {
                $skillsFormatted = is_array($user->skills) ? implode(', ', $user->skills) : $user->skills;
            }

            $updatedData = [
                'full_name' => $user ? $user->full_name : null,
                'email' => $user ? $user->email : null,
                'country' => $user ? $user->country : null,
                'city' => $user ? $user->city : null,
                'gender' => $user ? $user->gender : null,
                'experience_range' => $user ? ($user->experience_range ?: ($user->experience_years ? $user->experience_years . ' Years' : null)) : null,
                'current_employer' => $user ? $user->current_employer : null,
                'job_type' => $user ? $user->preferred_role : null,
                'location_preference' => $user ? $user->city : null,
                'preferred_role' => $user ? $user->preferred_role : null,
                'skills' => $skillsFormatted,
                'profile_photo_path' => $this->getUserPhoto($user),
            ];

            return response()->json([
                'success' => true,
                'status' => 'success',
                'message' => 'Profile information updated successfully!',
                'profile_photo_path' => $updatedData['profile_photo_path'],
                'data' => $updatedData
            ], 200);

        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('updatePersonal Exception: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => $e->getMessage(),
                'error_type' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => array_slice(explode("\n", $e->getTraceAsString()), 0, 10)
            ], 500);
        }
    }

    /**
     * Update user's selected language.
     */
    public function updateLanguage(Request $request)
    {
        $user = $request->user() ?? User::first();

        $validator = Validator::make($request->all(), [
            'selected_language' => 'required|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        if ($user) {
            $user->update([
                'selected_language' => $request->selected_language,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Language preference updated successfully.',
            'selected_language' => $request->selected_language,
        ]);
    }

    /**
     * Delete user account permanently (HARD DELETE from users table and related tables).
     * DELETE /api/profile/delete or POST /api/profile/delete
     */
    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        if (!$user && $request->bearerToken()) {
            $tokenStr = $request->bearerToken();
            if (str_contains($tokenStr, '|')) {
                $tokenId = explode('|', $tokenStr)[0];
                $tokenObj = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
                if ($tokenObj) {
                    $user = $tokenObj->tokenable;
                }
            }
        }

        if (!$user && ($request->filled('user_id') || $request->filled('mobile_number') || $request->filled('mobile'))) {
            $query = User::query();
            if ($request->filled('user_id')) {
                $query->where('id', $request->user_id);
            }
            if ($request->filled('mobile_number')) {
                $query->where('mobile_number', $request->mobile_number);
            } elseif ($request->filled('mobile')) {
                $query->where('mobile_number', $request->mobile);
            }
            $user = $query->first();
        }

        if ($user) {
            $userId = $user->id;

            // Revoke all tokens & device tokens
            try {
                if (method_exists($user, 'tokens')) {
                    $user->tokens()->delete();
                }
            } catch (\Throwable $e) {}

            try {
                \App\Models\UserDeviceToken::where('user_id', $userId)->delete();
                \App\Models\ChefProfileView::where('chef_id', $userId)->orWhere('employer_id', $userId)->delete();
                \App\Models\UserRole::where('user_id', $userId)->delete();
                \App\Models\ChefProfile::where('user_id', $userId)->delete();
                \App\Models\EmployerProfile::where('user_id', $userId)->delete();
                \App\Models\UserSocial::where('user_id', $userId)->delete();
                \App\Models\UserNotificationHistory::where('user_id', $userId)->delete();
                \App\Models\JobApplication::where('applicant_id', $userId)->orWhere('employer_id', $userId)->delete();
            } catch (\Throwable $e) {}

            // Perform HARD SQL DELETE from users database table
            try {
                \Illuminate\Support\Facades\DB::table('users')->where('id', $userId)->delete();
            } catch (\Throwable $e) {
                $user->delete();
            }

            return response()->json([
                'success' => true,
                'status' => 'success',
                'message' => "User #{$userId} has been permanently deleted from users table and database.",
                'deleted_user_id' => $userId
            ], 200);
        }

        return response()->json([
            'success' => false,
            'status' => 'error',
            'message' => 'User account not found or already deleted.'
        ], 404);
    }

    /**
     * Get Chef Profile Completeness percentage and breakdown.
     * GET /api/chef/profile/completeness
     */
    public function getChefCompleteness(Request $request)
    {
        $user = $request->user() ?: auth('sanctum')->user();
        if (!$user) {
            $user = User::first();
        }

        $result = \App\Services\ProfileProgressService::calculateChef($user);

        return response()->json([
            'success' => true,
            'role' => 'chef',
            'completeness' => $result['completeness'],
            'percentage' => $result['percentage'],
            'breakdown' => $result['breakdown'],
            'missing_fields' => $result['missing_fields']
        ], 200);
    }

    /**
     * Get Employer Profile Completeness percentage and breakdown.
     * GET /api/employer/profile/completeness
     */
    public function getEmployerCompleteness(Request $request)
    {
        $user = $request->user() ?: auth('sanctum')->user();
        if (!$user) {
            $user = User::first();
        }

        $result = \App\Services\ProfileProgressService::calculateEmployer($user);

        return response()->json([
            'success' => true,
            'role' => 'employer',
            'completeness' => $result['completeness'],
            'percentage' => $result['percentage'],
            'breakdown' => $result['breakdown'],
            'missing_fields' => $result['missing_fields']
        ], 200);
    }

    /**
     * Get Talent Profile Completeness percentage.
     * GET /api/talent/profile/completeness
     */
    public function getTalentCompleteness(Request $request)
    {
        $user = $request->user() ?: auth('sanctum')->user();
        if (!$user) {
            $user = User::first();
        }

        $result = \App\Services\ProfileProgressService::calculateTalent($user);

        return response()->json([
            'success' => true,
            'role' => 'talent',
            'completeness' => $result['completeness'],
            'percentage' => $result['percentage']
        ], 200);
    }

    /**
     * Get Profile Completeness dynamically based on active profile or query param.
     * GET /api/profile/completeness
     */
    public function getCompleteness(Request $request)
    {
        $user = $request->user() ?: auth('sanctum')->user();
        if (!$user) {
            $user = User::first();
        }

        $role = $request->query('role') ?? ($user ? ($user->active_profile ?? 'talent') : 'talent');

        if ($role === 'chef') {
            return $this->getChefCompleteness($request);
        } elseif ($role === 'employer') {
            return $this->getEmployerCompleteness($request);
        } else {
            return $this->getTalentCompleteness($request);
        }
    }

    /**
     * Dedicated API method for posting / updating Employer profile data.
     * POST /api/employer/profile
     */
    public function updateEmployerProfile(Request $request)
    {
        $res = $this->updatePersonal($request);
        $user = $request->user() ?: auth('sanctum')->user();
        if (!$user) {
            $user = User::first();
        }

        if ($user) {
            $completeness = \App\Services\ProfileProgressService::calculateEmployer($user);
            return response()->json([
                'success' => true,
                'status' => 'success',
                'message' => 'Employer profile saved successfully!',
                'completeness' => $completeness['completeness'],
                'employer_profile' => $user->employerProfile ? $user->employerProfile->fresh() : null,
            ]);
        }

        return $res;
    }
}
