<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserRole;
use App\Models\ChefProfile;
use App\Models\EmployerProfile;
use App\Models\JobPost;

class LocalDataSeeder extends Seeder
{
    public function run()
    {
        // 1. CHEFS DATA
        $chefsData = [
            [
                'full_name' => 'Nisha Chef',
                'email' => 'nisha@jobrito.com',
                'mobile_number' => '9599016982',
                'city' => 'Mumbai',
                'country' => 'India',
                'preferred_role' => 'Sous Chef',
                'experience_range' => '1-2 Years',
                'cuisine_specialty' => 'Italian, Indian, Chinese',
                'bio' => 'Passionate culinary artist specializing in authentic Italian pasta and modern Indian fusion.',
                'calendly_link' => 'https://calendly.com/chef-nisha',
                'approval_status' => 'approved',
                'is_available' => 1,
            ],
            [
                'full_name' => 'Chef Sanjeev Kumar',
                'email' => 'sanjeev@jobrito.com',
                'mobile_number' => '9876543210',
                'city' => 'Mumbai',
                'country' => 'India',
                'preferred_role' => 'Executive Chef',
                'experience_range' => '10-15 Years',
                'cuisine_specialty' => 'Indian, Mughlai, Continental',
                'bio' => 'Celebrated master chef with 15+ years experience running 5-star hotel kitchens.',
                'calendly_link' => 'https://calendly.com/chef-sanjeev',
                'approval_status' => 'approved',
                'is_available' => 1,
            ],
            [
                'full_name' => 'Chef Marco Santini',
                'email' => 'marco@jobrito.com',
                'mobile_number' => '9876500112',
                'city' => 'London',
                'country' => 'United Kingdom',
                'preferred_role' => 'Head Chef',
                'experience_range' => '8-10 Years',
                'cuisine_specialty' => 'Italian, French, Mediterranean',
                'bio' => 'Experienced European chef with Michelin-star kitchen experience.',
                'calendly_link' => 'https://calendly.com/chef-marco-santini',
                'approval_status' => 'approved',
                'is_available' => 1,
            ],
            [
                'full_name' => 'Irfan',
                'email' => 'irfan@jobrito.com',
                'mobile_number' => '8105674906',
                'city' => 'Bengaluru',
                'country' => 'India',
                'preferred_role' => 'CDP (Chef de Partie)',
                'experience_range' => '2-5 Years',
                'cuisine_specialty' => 'Italian, Indian, Tandoor',
                'bio' => 'Energetic CDP specializing in wood-fired pizza and tandoori grills.',
                'calendly_link' => null,
                'approval_status' => 'pending',
                'is_available' => 1,
            ],
            [
                'full_name' => 'Vg',
                'email' => 'vg@jobrito.com',
                'mobile_number' => '8223053891',
                'city' => 'Doha',
                'country' => 'Qatar',
                'preferred_role' => 'Pastry Chef',
                'experience_range' => '2-5 Years',
                'cuisine_specialty' => 'Bakery, Desserts, Italian',
                'bio' => 'Expert baker & chocolatier with Gulf experience.',
                'calendly_link' => null,
                'approval_status' => 'pending',
                'is_available' => 1,
            ],
        ];

        foreach ($chefsData as $c) {
            $user = User::create([
                'full_name' => $c['full_name'],
                'email' => $c['email'],
                'mobile_number' => $c['mobile_number'],
                'city' => $c['city'],
                'country' => $c['country'],
                'preferred_role' => $c['preferred_role'],
                'experience_range' => $c['experience_range'],
                'is_suspended' => false,
                'is_available' => $c['is_available'],
            ]);

            UserRole::create([
                'user_id' => $user->id,
                'role_type' => 'chef',
                'is_active' => true,
            ]);

            ChefProfile::create([
                'user_id' => $user->id,
                'cuisine_specialty' => $c['cuisine_specialty'],
                'bio' => $c['bio'],
                'calendly_link' => $c['calendly_link'],
                'approval_status' => $c['approval_status'],
            ]);
        }

        // 2. EMPLOYERS DATA
        $employersData = [
            [
                'business_name' => 'STARBUCKS',
                'contact_person_name' => 'Smith',
                'business_email' => 'smith@jobb.com',
                'business_mobile' => '9845078870',
                'business_location' => 'India',
                'industry_segment' => 'Cafe',
            ],
            [
                'business_name' => 'Big BUNN',
                'contact_person_name' => 'Feras',
                'business_email' => 'feras@bigbunn.com',
                'business_mobile' => '9886137887',
                'business_location' => 'Riyadh, Saudi Arabia',
                'industry_segment' => 'QSR',
            ],
            [
                'business_name' => 'Thinktail Global pvt ltd',
                'contact_person_name' => 'Nisha',
                'business_email' => 'nisha@thinktail.com',
                'business_mobile' => '8447220079',
                'business_location' => 'Delhi, India',
                'industry_segment' => 'Cafe & Fine Dining',
            ],
            [
                'business_name' => 'XMate Hospitality',
                'contact_person_name' => 'Jack',
                'business_email' => 'jack@xmate.com',
                'business_mobile' => '9845078871',
                'business_location' => 'Riyadh',
                'industry_segment' => 'Hospitality Consultancy',
            ],
        ];

        $employerUser = null;
        foreach ($employersData as $emp) {
            $user = User::create([
                'full_name' => $emp['contact_person_name'],
                'email' => $emp['business_email'],
                'mobile_number' => $emp['business_mobile'],
                'city' => $emp['business_location'],
                'country' => 'India',
                'current_employer' => $emp['business_name'],
                'is_suspended' => false,
            ]);

            if (!$employerUser) {
                $employerUser = $user;
            }

            UserRole::create([
                'user_id' => $user->id,
                'role_type' => 'employer',
                'is_active' => true,
            ]);

            EmployerProfile::create([
                'user_id' => $user->id,
                'business_name' => $emp['business_name'],
                'industry_segment' => $emp['industry_segment'],
                'business_location' => $emp['business_location'],
                'contact_person_name' => $emp['contact_person_name'],
                'business_mobile' => $emp['business_mobile'],
                'business_email' => $emp['business_email'],
                'preferred_language' => 'English',
                'nominee_name' => 'HR Manager',
                'nominee_relationship' => 'HR',
                'nominee_mobile' => $emp['business_mobile'],
                'is_completed' => true,
            ]);
        }

        // 3. TALENT / JOBSEEKER DATA
        $talents = [
            ['full_name' => 'Sanjay Kapoor', 'mobile_number' => '9876543211', 'city' => 'New Delhi', 'status' => 'ACTIVE'],
            ['full_name' => 'Ananya Sharma', 'mobile_number' => '8765432189', 'city' => 'Mumbai', 'status' => 'ACTIVE'],
            ['full_name' => 'Vikram Rathore', 'mobile_number' => '7654321098', 'city' => 'Bangalore', 'status' => 'ACTIVE'],
            ['full_name' => 'Ramesh Kumar', 'mobile_number' => '9111111100', 'city' => 'Mumbai', 'status' => 'ACTIVE'],
            ['full_name' => 'Sunita Rao', 'mobile_number' => '9111111101', 'city' => 'Mumbai', 'status' => 'SUSPENDED'],
        ];

        foreach ($talents as $t) {
            $u = User::create([
                'full_name' => $t['full_name'],
                'mobile_number' => $t['mobile_number'],
                'city' => $t['city'],
                'country' => 'India',
                'is_suspended' => $t['status'] === 'SUSPENDED',
            ]);

            UserRole::create([
                'user_id' => $u->id,
                'role_type' => 'job_seeker',
                'is_active' => true,
            ]);
        }

        // 4. SAMPLE JOBS
        if ($employerUser) {
            JobPost::create([
                'created_by' => $employerUser->id,
                'title' => 'Executive Chef',
                'company' => 'STARBUCKS',
                'category' => 'india',
                'location' => 'Mumbai, India',
                'salary' => '₹8,00,000 - ₹12,00,000 PA',
                'contact_info' => 'smith@jobb.com | 9845078870',
                'description' => 'Looking for an experienced Executive Chef to manage kitchen operations.',
                'status' => 'approved',
                'open_positions' => 2,
            ]);

            JobPost::create([
                'created_by' => $employerUser->id,
                'title' => 'Senior Barista & Pastry Chef',
                'company' => 'Big BUNN',
                'category' => 'overseas',
                'location' => 'Riyadh, Saudi Arabia',
                'salary' => 'SAR 6,000 / month',
                'contact_info' => 'feras@bigbunn.com | 9886137887',
                'description' => 'Specialist for gourmet coffee & fresh croissants.',
                'status' => 'approved',
                'open_positions' => 4,
            ]);
        }

        $this->command->info('Local data seeded successfully!');
    }
}
