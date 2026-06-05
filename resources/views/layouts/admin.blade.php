<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin Dashboard') | JobConnect</title>
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar Menu -->
        <aside class="sidebar">
            <div class="logo-section">
                <div class="logo-icon">J</div>
                <div class="logo-text">JobConnect</div>
            </div>
            
            <nav>
                <ul class="nav-menu">
                    <li class="nav-item {{ Request::is('admin/dashboard') ? 'active' : '' }}">
                        <a href="{{ url('admin/dashboard') }}">
                            <span>📊</span> Dashboard
                        </a>
                    </li>
                    <li class="nav-item {{ Request::is('admin/users*') ? 'active' : '' }}">
                        <a href="{{ url('admin/users') }}">
                            <span>👥</span> User Accounts
                        </a>
                    </li>
                    <li class="nav-item {{ Request::is('admin/jobs*') ? 'active' : '' }}">
                        <a href="{{ url('admin/jobs') }}">
                            <span>💼</span> Job Moderation
                        </a>
                    </li>
                    <li class="nav-item {{ Request::is('admin/chefs*') ? 'active' : '' }}">
                        <a href="{{ url('admin/chefs') }}">
                            <span>👨‍🍳</span> Chef Screening
                        </a>
                    </li>
                    <li class="nav-item {{ Request::is('admin/training*') ? 'active' : '' }}">
                        <a href="{{ url('admin/training') }}">
                            <span>📚</span> Training Programs
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main Workspace -->
        <main class="main-wrapper">
            <header class="header-section">
                <div class="header-title">
                    <h1>@yield('header-title', 'Overview')</h1>
                    <p>@yield('header-subtitle', 'Platform oversight and statistics')</p>
                </div>
            </header>

            @if(session('success'))
                <div class="alert alert-success">
                    <span>✅</span> {{ session('success') }}
                </div>
            @endif

            @yield('content')
        </main>
    </div>
</body>
</html>
