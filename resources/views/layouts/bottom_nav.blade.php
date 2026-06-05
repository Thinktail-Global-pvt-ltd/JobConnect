@php
    $user = Auth::user();
    $activeRole = $user ? $user->currentRoleContext() : null;
    $roleType = $activeRole ? $activeRole->role_type : 'job_seeker';
    
    // Determine active tab
    $isHome = Request::is('/');
    $isPost = Request::is('jobs/create');
    $isAdmin = Request::is('admin*');
    $isProfilePage = Request::is('profile') || Request::is('profile/*');
    
    $currentSection = request()->query('section');
    
    $tabs = [];
    
    if ($roleType === 'job_seeker') {
        $tabs = [
            [
                'label' => 'Home',
                'url' => route('home'),
                'icon' => 'home',
                'active' => $isHome
            ],
            [
                'label' => 'Applications',
                'url' => route('profile.applications'),
                'icon' => 'description',
                'active' => Request::is('profile/applications')
            ],
            [
                'label' => 'Profile',
                'url' => route('profile'),
                'icon' => 'person',
                'active' => Request::is('profile') || Request::is('profile/personal')
            ]
        ];
    } elseif ($roleType === 'chef') {
        $tabs = [
            [
                'label' => 'Home',
                'url' => route('home'),
                'icon' => 'home',
                'active' => $isHome
            ],
            [
                'label' => 'Chef Status',
                'url' => route('profile', ['section' => 'chef']),
                'icon' => 'restaurant',
                'active' => Request::is('profile') && $currentSection === 'chef'
            ],
            [
                'label' => 'Profile',
                'url' => route('profile'),
                'icon' => 'person',
                'active' => (Request::is('profile') && $currentSection !== 'chef') || Request::is('profile/personal')
            ]
        ];
    } elseif ($roleType === 'employer' || $roleType === 'agency') {
        $labelJobs = ($roleType === 'agency') ? 'Agency Jobs' : 'My Jobs';
        $tabs = [
            [
                'label' => 'Home',
                'url' => route('home'),
                'icon' => 'home',
                'active' => $isHome
            ],
            [
                'label' => 'Post Job',
                'url' => route('jobs.create'),
                'icon' => 'add_circle',
                'active' => $isPost
            ],
            [
                'label' => $labelJobs,
                'url' => route('profile', ['section' => 'my_posted_jobs']),
                'icon' => 'work_history',
                'active' => Request::is('profile') && $currentSection === 'my_posted_jobs'
            ],
            [
                'label' => 'Profile',
                'url' => route('profile'),
                'icon' => 'person',
                'active' => ((Request::is('profile') && $currentSection !== 'my_posted_jobs') || Request::is('profile/personal')) && !$isPost
            ]
        ];
    } elseif ($roleType === 'administrator') {
        $tabs = [
            [
                'label' => 'Home',
                'url' => route('home'),
                'icon' => 'home',
                'active' => $isHome
            ],
            [
                'label' => 'Admin Panel',
                'url' => '/admin/dashboard',
                'icon' => 'dashboard',
                'active' => $isAdmin
            ],
            [
                'label' => 'Profile',
                'url' => route('profile'),
                'icon' => 'person',
                'active' => Request::is('profile') || Request::is('profile/personal')
            ]
        ];
    }
@endphp

<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center bg-surface border-t-[0.5px] border-outline-variant pb-safe z-50 h-[64px]">
    @foreach($tabs as $tab)
        <a href="{{ $tab['url'] }}" class="flex flex-col items-center justify-center {{ $tab['active'] ? 'text-primary font-bold' : 'text-on-secondary-container dark:text-outline-variant' }} hover:bg-secondary-container/20 transition-transform scale-95 active:scale-90 px-4 py-1 rounded-xl">
            <span class="material-symbols-outlined" style="{{ $tab['active'] ? "font-variation-settings: 'FILL' 1;" : '' }}">{{ $tab['icon'] }}</span>
            <span class="font-label-md text-label-md">{{ $tab['label'] }}</span>
        </a>
    @endforeach
</nav>
