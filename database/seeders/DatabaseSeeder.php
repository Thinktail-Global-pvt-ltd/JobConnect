<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserRole;
use App\Models\JobPost;
use App\Models\ChefProfile;
use App\Models\TrainingOpportunity;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admins & Users
        $user1 = User::create([
            'mobile_number' => '9876543210',
            'full_name' => 'Sanjay Kapoor',
            'email' => 'sanjay@jobconnect.in',
            'profile_photo_path' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
            'city' => 'New Delhi',
            'experience_range' => '6+ Years',
            'preferred_role' => 'Executive Chef',
            'current_employer' => 'The Taj Palace',
            'skills' => ['Fine Dining', 'Menu Costing', 'Inventory Control', 'French Cuisine'],
        ]);

        $user2 = User::create([
            'mobile_number' => '8765432109',
            'full_name' => 'Ananya Sharma',
            'email' => 'ananya@bistrobites.com',
            'profile_photo_path' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
            'city' => 'Mumbai',
            'experience_range' => '4-6 Years',
            'preferred_role' => 'F&B Manager',
            'current_employer' => 'Bistro Bites Ltd',
            'skills' => ['Guest Relations', 'Staff Scheduling', 'POS Operations', 'Wine Pairing'],
        ]);

        $user3 = User::create([
            'mobile_number' => '7654321098',
            'full_name' => 'Vikram Rathore',
            'email' => 'vikram@agencies.net',
            'city' => 'Bangalore',
            'experience_range' => '6+ Years',
            'preferred_role' => 'Recruitment Director',
            'skills' => ['Staffing', 'Licensing', 'Kitchen Setup'],
        ]);

        // Create Roles for Users
        UserRole::create(['user_id' => $user1->id, 'role_type' => 'job_seeker', 'is_active' => true]);
        UserRole::create(['user_id' => $user1->id, 'role_type' => 'employer', 'is_active' => false]);
        
        UserRole::create(['user_id' => $user2->id, 'role_type' => 'employer', 'is_active' => true]);
        
        UserRole::create(['user_id' => $user3->id, 'role_type' => 'agency', 'is_active' => true]);

        // 2. Create Job Posts with precise details, location, salary, experience range, requirements, benefits and company logo URLs

        // Post 1: Pinned Overseas Job (Global Logistics Corp)
        JobPost::create([
            'created_by' => $user2->id,
            'title' => 'Urgent: Regional Warehouse Manager',
            'category' => 'overseas',
            'company' => 'Global Logistics Corp',
            'salary' => '$4,500 - $6,200',
            'location' => 'Singapore / Remote',
            'company_logo_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw6KW49aCaMoidses4Ct3ME69O2-YmQetFiTkHazZaDNkEZI0CNZ-6ohIb-w_nnIpfsLgxHSZQiJ_L4yvoijR6mXrPHMUYYM5JQv_ygPdFAj11zSttaaAscZQ3dGZoIFvC_L-ycHgwiahAuiIiT-G3S0XEDPSpN-JCufO4bCX6rxGWK3eVLNcLAwoUYiozYioIRODHOFTM9v0ErHUShc3fmMkMBJb8RpzLYLMHhWBmoIkLHnPxneV_kMZyHCH2HpGlkpQJ0kOw93Yz',
            'contact_info' => 'careers@globallogistics.com',
            'description' => 'Leading the operations for our new Southeast Asian hub. Seeking an experienced professional to manage logistics and staff...',
            'status' => 'approved',
            'is_pinned' => true,
            'country' => 'Singapore',
            'visa_assistance' => true,
            'accommodation_available' => true,
            'contract_duration' => 'Permanent',
            'experience_range' => '5+ Years',
            'requirements' => [
                'Proven track record in regional warehouse or logistics management.',
                'Familiarity with Southeast Asian shipping regulations.',
                'Strong leadership and inventory control capabilities.'
            ],
            'benefits' => [
                'Competitive Salary & Bonus',
                'Health & Life Insurance Cover',
                'Annual Travel Tickets'
            ],
            'job_type' => 'Full-time',
            'showcase_image_url' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
            'map_image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcF0fP5djm650f6F65l2AVwIZ-Eg4mpJkUpf4wT_EDR5_VL4q-9GwMV_ZTAmMAfE2Pc5e1-wXWYNWO-e_pI5NQNZs4jobnrD1TN3ZmKW7ExTXU_LIUY9-47rMrTUX6VYuF6vQXzBUvZHAK8U62-bdwgwDFtVfgSUeACaB62M3YgktgTXONmeMpg-HVpmLHuo9vduD-ovin5c7K3T_l0xvedO5696K45ekEGN-4_siUdUXqd-RdiKBhysZWdVq3CepQw8o9CDU2z1xh'
        ]);

        // Post 2: Overseas Job (The Grand Patisserie - Senior Pastry Chef)
        JobPost::create([
            'created_by' => $user2->id,
            'title' => 'Senior Pastry Chef',
            'category' => 'overseas',
            'company' => 'The Grand Patisserie',
            'salary' => '£35k - £42k / yr',
            'location' => 'Mayfair, London',
            'company_logo_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCETeC_7adg-KnGuBfePfK3jp_6CunjodjxhRwOYSUMDRKOraozfblv4G9kVmV0sJlD4HswBU9kp3M1GEkVIPwJxreWx1XWIRhkkCYXb3o5nwu0YzZuy3voySnAbPJa6VfKnq1vpgrDs-Nk4fWflOLDPu4OIHWp8f6Obq7_Wfi91Nyw8il4GVA2GjeRkjiBkzMM466_UQ_qz8COnPtb9Pqwuu4IJgqS1mYMWb0EcYaFjtskL0PGnNPRW3MIiseWsl7w1YLSxJ8TllqK',
            'contact_info' => 'jobs@grandpatisserie.co.uk',
            'description' => 'We are looking for a creative and experienced Senior Pastry Chef to lead our dessert department. You will be responsible for creating innovative dessert menus, managing a small team of pastry cooks, and ensuring the highest standards of quality and presentation for our discerning clientele.',
            'status' => 'approved',
            'is_pinned' => false,
            'country' => 'United Kingdom',
            'visa_assistance' => true,
            'accommodation_available' => false,
            'contract_duration' => 'Permanent Contract',
            'experience_range' => '5+ Years',
            'requirements' => [
                'Proven experience as a Pastry Chef in a 5-star hotel or Michelin-starred restaurant.',
                'Exceptional skills in sugar work, chocolate tempering, and complex dessert plating.',
                'Strong leadership and team management capabilities.',
                'Food hygiene certification (Level 3 minimum).'
            ],
            'benefits' => [
                'Private Health Cover',
                'Free Staff Meals',
                'Performance Bonus',
                'Training & Development'
            ],
            'job_type' => 'Full-time',
            'showcase_image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbM9wD64k_f98GmWV0iN9daYyZGZJEMhx8VuHbXHc-KQdAbDqUQboJy36CyEFK5sHbcZ0QMBbBdh5fvqrfDm2kiBuLwI_p0_cGNCfyfNPaka9ZQaZUlNoSEtfZyLkZVRUGDsDVz80Hw-LwcXMJp1W4ObDgXshzdzKqn_Xaf_HbiSqHsWi46AOoZKd7I8Smyqn3opNLElkgomuAZ2G7lWpK2z0CtTMlPiI3OdbV9zl_IW6VJzcbs2gCUTHFWuvvNZM3RJ7Q5p5Vzu6P',
            'map_image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcF0fP5djm650f6F65l2AVwIZ-Eg4mpJkUpf4wT_EDR5_VL4q-9GwMV_ZTAmMAfE2Pc5e1-wXWYNWO-e_pI5NQNZs4jobnrD1TN3ZmKW7ExTXU_LIUY9-47rMrTUX6VYuF6vQXzBUvZHAK8U62-bdwgwDFtVfgSUeACaB62M3YgktgTXONmeMpg-HVpmLHuo9vduD-ovin5c7K3T_l0xvedO5696K45ekEGN-4_siUdUXqd-RdiKBhysZWdVq3CepQw8o9CDU2z1xh'
        ]);

        // Post 3: India Job (Fine Dine Group)
        JobPost::create([
            'created_by' => $user2->id,
            'title' => 'Head Chef - New Mumbai Branch',
            'category' => 'india',
            'company' => 'Fine Dine Group',
            'salary' => '₹12L - ₹18L PA',
            'location' => 'Mumbai, India',
            'company_logo_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3yDNowqj6UzEXBNrbCdWwdabJdy1pUK8eUxLtcp6cqC2IA0a5yOc38WaRksViOadVN9TUH3HMHg3L1-mr6BPvixhc4kOV1qXfkU7-WA4qqZW045yFvAvjtCVPA1MuDVq1UZV1UQkLNwH8pXZ5YOzXcCHOYwW2IFV7wQPQ5Y4Al-KyX7g8vAMw5MV5c5N4buJSS0xcQQF479UQLQUtY7ToBBoqF9m4104RrjeWKHMJivFL5SrmCfgN4Km_czIo8jd1QbUP56YKSitl',
            'contact_info' => 'recruitment@finedinegroup.com',
            'description' => 'We are opening our 15th location and looking for a creative culinary leader. Must have 8+ years experience in European cuisine.',
            'status' => 'approved',
            'is_pinned' => false,
            'experience_range' => '8+ Years',
            'requirements' => [
                'Creative menu design skills for European style plating.',
                'Budget and inventory management track record.',
                'Culinary Arts degree from a recognized institution.'
            ],
            'benefits' => [
                'Performance Incentives',
                'Gratuity & Provident Fund benefits',
                'Complimentary Dining vouchers'
            ],
            'job_type' => 'Full-time',
            'showcase_image_url' => 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600',
            'map_image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcF0fP5djm650f6F65l2AVwIZ-Eg4mpJkUpf4wT_EDR5_VL4q-9GwMV_ZTAmMAfE2Pc5e1-wXWYNWO-e_pI5NQNZs4jobnrD1TN3ZmKW7ExTXU_LIUY9-47rMrTUX6VYuF6vQXzBUvZHAK8U62-bdwgwDFtVfgSUeACaB62M3YgktgTXONmeMpg-HVpmLHuo9vduD-ovin5c7K3T_l0xvedO5696K45ekEGN-4_siUdUXqd-RdiKBhysZWdVq3CepQw8o9CDU2z1xh'
        ]);

        // Post 4: Overseas Job (Azure Resorts)
        JobPost::create([
            'created_by' => $user2->id,
            'title' => 'Guest Relations Officer',
            'category' => 'overseas',
            'company' => 'Azure Resorts',
            'salary' => 'AED 8,000 + Benefits',
            'location' => 'Dubai, UAE',
            'company_logo_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFZ2umPyIN4fuIm3GJ5IobUQQvIY5U0N2r-sYmOeY2kv41iWJeDjx7U9W3xf30oIDhwAISxf-sjnFo1HUbdVoQGUKpjGnf56hMG-Eg4-k6DAli0xGkABpw1BgCRC1Ob74QRPYOg4FYzwmaQTs-KrEThIk1WbsAiFDnx0M8kBMJY1GmzXyKBf5SsfEV-gMWbM5HplC8JEnFjOZ9XmilUWFjtH90ue6y1GWy8ctNMzvRyX87M4MEch0Nt_Qnp4BihQAUCTJS9enCBJQO',
            'contact_info' => 'hr@azureresorts.ae',
            'description' => 'Ensure a seamless experience for our premium guests. Fluency in English and Arabic is a plus.',
            'status' => 'approved',
            'is_pinned' => false,
            'country' => 'UAE',
            'visa_assistance' => true,
            'accommodation_available' => true,
            'contract_duration' => '2 Year Renewable',
            'experience_range' => '2-4 Years',
            'requirements' => [
                'Fluency in both written and spoken English and Arabic.',
                'Prior experience in Front Desk or Guest Relations operations.',
                'Excellent problem solving skills under high pressure.'
            ],
            'benefits' => [
                'Tax-Free Salary',
                'Provided Shared Accommodation & Transport',
                'Bi-annual Flight Allowance'
            ],
            'job_type' => 'Full-time',
            'showcase_image_url' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
            'map_image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcF0fP5djm650f6F65l2AVwIZ-Eg4mpJkUpf4wT_EDR5_VL4q-9GwMV_ZTAmMAfE2Pc5e1-wXWYNWO-e_pI5NQNZs4jobnrD1TN3ZmKW7ExTXU_LIUY9-47rMrTUX6VYuF6vQXzBUvZHAK8U62-bdwgwDFtVfgSUeACaB62M3YgktgTXONmeMpg-HVpmLHuo9vduD-ovin5c7K3T_l0xvedO5696K45ekEGN-4_siUdUXqd-RdiKBhysZWdVq3CepQw8o9CDU2z1xh'
        ]);

        // Post 5: Pending Job (For admin moderation tests)
        JobPost::create([
            'created_by' => $user1->id,
            'title' => 'Restaurant Captain / Lead Waiter',
            'category' => 'india',
            'company' => 'Taj Palace Bistro',
            'salary' => '₹25,000 - ₹30,000',
            'location' => 'New Delhi, India',
            'contact_info' => 'sanjay@tajpalace.com',
            'description' => 'Looking for an experienced Lead Waiter with exceptional table manners and basic beverage knowledge. Must handle peak weekend hours comfortably.',
            'status' => 'pending',
            'is_pinned' => false,
            'experience_range' => '2-4 Years',
            'requirements' => [
                'Experience in fine dining captaincy or silver service.',
                'Strong communication and upselling capabilities.',
                'Beverage service training certification is a plus.'
            ],
            'benefits' => [
                'Staff Gratuity / Service Charge share',
                'Free Staff Meals & Transport support',
                'Weekly Offs'
            ],
            'job_type' => 'Full-time',
            'showcase_image_url' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600',
            'map_image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcF0fP5djm650f6F65l2AVwIZ-Eg4mpJkUpf4wT_EDR5_VL4q-9GwMV_ZTAmMAfE2Pc5e1-wXWYNWO-e_pI5NQNZs4jobnrD1TN3ZmKW7ExTXU_LIUY9-47rMrTUX6VYuF6vQXzBUvZHAK8U62-bdwgwDFtVfgSUeACaB62M3YgktgTXONmeMpg-HVpmLHuo9vduD-ovin5c7K3T_l0xvedO5696K45ekEGN-4_siUdUXqd-RdiKBhysZWdVq3CepQw8o9CDU2z1xh'
        ]);

        // Post 6: Community / Referrals Job
        JobPost::create([
            'created_by' => $user3->id,
            'title' => 'F&B Supervisor - Quick Service Restaurant',
            'category' => 'community',
            'company' => 'Burger Junction',
            'salary' => '₹18,000 - ₹22,000',
            'location' => 'Bangalore, India',
            'contact_info' => 'WhatsApp +91 80 9991 8888',
            'description' => 'Urgent referral opening! Small cozy QSR in Indiranagar needs a supervisor to manage counter staff and order supplies. Shift begins at 1 PM.',
            'status' => 'approved',
            'is_pinned' => false,
            'experience_range' => '1-3 Years',
            'requirements' => [
                'Prior experience managing POS billing systems.',
                'Inventory stock count and order reconciliation skill.',
                'Polite guest interaction and management capabilities.'
            ],
            'benefits' => [
                'Performance Bonuses',
                'Overtime pay benefits',
                'Uniform provided'
            ],
            'job_type' => 'Full-time',
            'showcase_image_url' => 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600',
            'map_image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcF0fP5djm650f6F65l2AVwIZ-Eg4mpJkUpf4wT_EDR5_VL4q-9GwMV_ZTAmMAfE2Pc5e1-wXWYNWO-e_pI5NQNZs4jobnrD1TN3ZmKW7ExTXU_LIUY9-47rMrTUX6VYuF6vQXzBUvZHAK8U62-bdwgwDFtVfgSUeACaB62M3YgktgTXONmeMpg-HVpmLHuo9vduD-ovin5c7K3T_l0xvedO5696K45ekEGN-4_siUdUXqd-RdiKBhysZWdVq3CepQw8o9CDU2z1xh'
        ]);

        // 3. Create Chef Profiles
        ChefProfile::create([
            'user_id' => $user1->id,
            'cuisine_specialty' => 'Mughlai & Awadhi',
            'bio' => 'Award winning chef specialized in lost recipes of Awadh. Passionate about slow cooking techniques and custom spice mixtures.',
            'calendly_link' => 'https://calendly.com/chef-sanjay-kapoor',
            'availability_info' => 'Available on Mondays and Wednesdays after 4 PM.',
            'approval_status' => 'approved',
        ]);

        // 4. Create Training Opportunities
        TrainingOpportunity::create([
            'program_name' => 'Luxury Concierge Training Program',
            'provider_name' => 'EduPath Hospitality',
            'description' => '3-month intensive certification course with guaranteed placement in top-tier hotels across India and the Middle East.',
            'contact_information' => 'admissions@edupath.edu.in',
            'location' => 'Online / Hybrid',
            'price' => 'Early Bird: ₹15,000',
            'external_link' => 'https://www.edupathhospitality.edu.in/apply',
        ]);

        TrainingOpportunity::create([
            'program_name' => 'Global Barista & Mixology Foundation',
            'provider_name' => 'Italian Coffee Guild',
            'description' => 'Weekend certification focusing on espresso brewing, coffee art, and craft cocktails techniques by international instructors.',
            'contact_information' => 'barista@coffeeguild.it',
            'location' => 'Rome, Italy (In-Person)',
            'price' => 'Course Program',
            'external_link' => 'https://coffeeguild.it/global-certification',
        ]);
    }
}
