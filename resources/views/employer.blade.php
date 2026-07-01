<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $companyName }} - Employer Dashboard</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- CSS Inline Stylesheet for instant serving -->
    <style>
      :root {
        /* Colors */
        --primary: hsl(150, 75%, 38%);
        --primary-light: hsl(150, 70%, 96%);
        --primary-dark: hsl(150, 75%, 28%);
        --danger: hsl(351, 80%, 54%);
        --danger-light: hsl(351, 80%, 96%);
        --warning: hsl(38, 92%, 50%);
        --warning-light: hsl(38, 92%, 96%);
        --info: hsl(210, 85%, 55%);
        --info-light: hsl(210, 85%, 96%);
        --text-main: hsl(220, 15%, 15%);
        --text-muted: hsl(220, 10%, 48%);
        --text-light: hsl(220, 10%, 75%);
        --border-color: hsl(220, 15%, 94%);
        --bg-body: hsl(210, 15%, 96%);
        --bg-screen: hsl(220, 20%, 99%);
        --bg-card: #ffffff;
        --bg-hover: hsl(220, 15%, 98%);
        
        /* Shadows */
        --shadow-sm: 0 2px 4px rgba(0,0,0,0.02);
        --shadow-md: 0 4px 12px rgba(0,0,0,0.04);
        --shadow-lg: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 16px -8px rgba(0,0,0,0.03);
        
        /* Radius */
        --radius-sm: 8px;
        --radius-md: 14px;
        --radius-lg: 20px;
        --radius-circle: 50%;
        
        /* Typography */
        --font-family: 'Inter', sans-serif;
        --font-display: 'Outfit', sans-serif;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: var(--font-family);
        background-color: var(--bg-body);
        color: var(--text-main);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }

      /* --- DESKTOP PHONE WRAPPER & FRAME --- */
      .phone-wrapper {
        perspective: 1000px;
        padding: 20px 0;
      }

      .phone-frame {
        position: relative;
        width: 410px;
        height: 840px;
        background: #111;
        border-radius: 46px;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 12px #222, 0 0 0 14px #333;
        overflow: visible;
        transition: all 0.3s ease;
      }

      /* Simulated Phone Buttons */
      .phone-volume-up, .phone-volume-down, .phone-power-btn {
        position: absolute;
        background: #222;
        border-radius: 2px 0 0 2px;
      }
      .phone-volume-up {
        top: 180px;
        left: -15px;
        width: 4px;
        height: 50px;
      }
      .phone-volume-down {
        top: 240px;
        left: -15px;
        width: 4px;
        height: 50px;
      }
      .phone-power-btn {
        top: 200px;
        right: -15px;
        width: 4px;
        height: 70px;
        border-radius: 0 2px 2px 0;
      }

      .phone-notch {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 110px;
        height: 30px;
        background: #000;
        border-radius: 20px;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .phone-notch::before {
        content: '';
        width: 12px;
        height: 12px;
        background: #1a1a1a;
        border-radius: 50%;
        margin-right: 15px;
        box-shadow: inset 0 0 3px rgba(255,255,255,0.2);
      }
      .phone-notch::after {
        content: '';
        width: 45px;
        height: 4px;
        background: #333;
        border-radius: 2px;
      }

      .phone-screen {
        position: relative;
        width: 100%;
        height: 100%;
        background: var(--bg-screen);
        border-radius: 36px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      /* Phone Status Bar */
      .phone-status-bar {
        height: 44px;
        padding: 14px 24px 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--bg-screen);
        font-size: 11.5px;
        font-weight: 600;
        z-index: 50;
        user-select: none;
      }

      .status-bar-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .status-bar-time {
        font-family: var(--font-display);
        font-weight: 700;
        letter-spacing: -0.2px;
      }

      .status-bar-call {
        background-color: #2563eb;
        color: white;
        padding: 2px 6px;
        border-radius: 12px;
        font-size: 9.5px;
        display: flex;
        align-items: center;
        gap: 3px;
        font-weight: 500;
      }

      .status-bar-right {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .status-bar-speed {
        font-size: 8.5px;
        color: var(--text-muted);
        margin-right: 4px;
      }

      .status-bar-network {
        font-size: 9px;
        font-weight: 700;
        color: #111;
      }

      .status-bar-icon {
        opacity: 0.8;
      }

      .status-bar-battery {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .phone-home-indicator {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        width: 120px;
        height: 5px;
        background: #000;
        border-radius: 10px;
        z-index: 99;
      }

      /* --- VIEWPORT & SCREEN SCROLLING --- */
      .app-viewport {
        position: relative;
        flex: 1;
        overflow: hidden;
      }

      .app-screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-screen);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 16px 20px 80px 20px;
        box-sizing: border-box;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        -webkit-overflow-scrolling: touch;
      }

      /* Hide scrollbars but keep functionality */
      .app-screen::-webkit-scrollbar {
        display: none;
      }
      .app-screen {
        scrollbar-width: none;
      }

      /* Transitions */
      .app-screen.active {
        transform: translateX(0);
      }

      .app-screen.screen-hidden-left {
        transform: translateX(-100%);
      }

      .app-screen.screen-hidden-right {
        transform: translateX(100%);
      }

      /* --- SCREEN 1: EMPLOYER DASHBOARD --- */
      .employer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .employer-profile {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .employer-avatar {
        width: 46px;
        height: 46px;
        border-radius: var(--radius-circle);
        object-fit: cover;
        border: 1.5px solid var(--border-color);
      }

      .employer-meta {
        display: flex;
        flex-direction: column;
      }

      .employer-name {
        font-family: var(--font-display);
        font-size: 15.5px;
        font-weight: 700;
        color: var(--text-main);
        letter-spacing: -0.2px;
      }

      .employer-contact {
        font-size: 11px;
        color: var(--text-muted);
        margin-top: 1px;
      }

      .header-actions {
        display: flex;
        gap: 8px;
      }

      .header-btn {
        background: white;
        border: 1px solid var(--border-color);
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-main);
        cursor: pointer;
        position: relative;
        transition: background-color 0.2s, transform 0.1s;
      }

      .header-btn:hover {
        background-color: var(--bg-hover);
      }

      .header-btn:active {
        transform: scale(0.95);
      }

      .notification-btn .notification-badge {
        position: absolute;
        top: 10px;
        right: 11px;
        width: 7px;
        height: 7px;
        background-color: var(--danger);
        border-radius: 50%;
        border: 1px solid white;
      }

      .page-title {
        font-family: var(--font-display);
        font-size: 24px;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 20px;
      }

      /* Main Applicants Metric Card */
      .main-metric-card {
        background: white;
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-color);
        padding: 20px;
        box-shadow: var(--shadow-sm);
        margin-bottom: 16px;
      }

      .metric-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .metric-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .metric-label {
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 0.5px;
        color: var(--text-muted);
      }

      .metric-value {
        font-family: var(--font-display);
        font-size: 38px;
        font-weight: 700;
        color: var(--text-main);
        line-height: 1.1;
      }

      .metric-icon-wrapper {
        background-color: var(--primary-light);
        color: var(--primary);
        width: 44px;
        height: 44px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .metric-divider {
        height: 1px;
        background-color: var(--border-color);
        margin: 18px 0;
      }

      .metric-breakdown {
        display: flex;
        justify-content: space-between;
      }

      .breakdown-col {
        flex: 1;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 4px;
        position: relative;
      }

      .breakdown-col:not(:last-child)::after {
        content: '';
        position: absolute;
        right: 0;
        top: 15%;
        height: 70%;
        width: 1px;
        background-color: var(--border-color);
      }

      .breakdown-num {
        font-family: var(--font-display);
        font-size: 18px;
        font-weight: 700;
      }

      .shortlisted .breakdown-num { color: var(--primary); }
      .rejected .breakdown-num { color: var(--danger); }
      .contacted .breakdown-num { color: var(--text-main); }

      .breakdown-label {
        font-size: 11px;
        color: var(--text-muted);
      }

      /* Mini Cards Grid */
      .mini-cards-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 24px;
      }

      .mini-card {
        background: white;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
        padding: 14px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: var(--shadow-sm);
      }

      .mini-card-icon {
        width: 36px;
        height: 36px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mini-card-icon.yellow {
        background-color: var(--warning-light);
        color: var(--warning);
      }

      .mini-card-icon.blue {
        background-color: var(--info-light);
        color: var(--info);
      }

      .mini-card-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .mini-card-label {
        font-size: 11.5px;
        color: var(--text-muted);
        font-weight: 500;
      }

      .mini-card-val {
        font-family: var(--font-display);
        font-size: 16px;
        font-weight: 700;
        color: var(--text-main);
      }

      /* Actions Section */
      .section-title {
        font-family: var(--font-display);
        font-size: 18px;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 14px;
      }

      .actions-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .action-item-btn {
        background: white;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 16px 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        cursor: pointer;
        text-align: left;
        box-shadow: var(--shadow-sm);
        transition: all 0.2s;
      }

      .action-item-btn:hover {
        border-color: var(--text-light);
        transform: translateY(-1px);
      }

      .action-item-btn:active {
        transform: translateY(0) scale(0.99);
      }

      .action-item-left {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .action-icon-circle {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .action-icon-circle.green {
        background-color: var(--primary-light);
        color: var(--primary);
      }

      .action-icon-circle.gray-blue {
        background-color: hsl(220, 15%, 93%);
        color: hsl(220, 20%, 40%);
      }

      .action-item-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .action-item-title {
        font-family: var(--font-display);
        font-size: 14.5px;
        font-weight: 700;
        color: var(--text-main);
      }

      .action-item-desc {
        font-size: 11px;
        color: var(--text-muted);
      }

      .action-chevron {
        color: var(--text-light);
      }

      /* Support FAB */
      .support-fab {
        position: absolute;
        bottom: 24px;
        right: 20px;
        width: 48px;
        height: 48px;
        border-radius: var(--radius-circle);
        background-color: var(--primary);
        color: white;
        border: none;
        box-shadow: 0 4px 14px rgba(22, 163, 74, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 40;
        transition: transform 0.2s, background-color 0.2s;
      }

      .support-fab:hover {
        background-color: var(--primary-dark);
      }

      .support-fab:active {
        transform: scale(0.9);
      }

      /* --- SCREEN 2: ALL POSTED JOBS --- */
      .jobs-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
      }

      .back-arrow-btn {
        background: none;
        border: none;
        color: var(--text-main);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border-radius: var(--radius-sm);
        transition: background-color 0.2s;
      }

      .back-arrow-btn:hover {
        background-color: var(--bg-hover);
      }

      .jobs-header-title {
        font-family: var(--font-display);
        font-size: 19px;
        font-weight: 700;
        color: var(--text-main);
      }

      .jobs-tabs {
        display: flex;
        background-color: white;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 4px;
        gap: 4px;
        margin-bottom: 16px;
        box-shadow: var(--shadow-sm);
      }

      .tab-btn {
        flex: 1;
        background: none;
        border: none;
        border-radius: var(--radius-sm);
        padding: 10px 4px;
        font-size: 12px;
        font-weight: 600;
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
      }

      .tab-btn.active {
        background-color: var(--primary);
        color: white;
        box-shadow: 0 4px 10px rgba(22, 163, 74, 0.2);
      }

      .jobs-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .jobs-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      /* Empty State */
      .jobs-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 24px;
        text-align: center;
        color: var(--text-muted);
      }

      .jobs-empty-state svg {
        color: var(--text-light);
        margin-bottom: 14px;
      }

      .jobs-empty-state h3 {
        font-family: var(--font-display);
        font-size: 15px;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 6px;
      }

      .jobs-empty-state p {
        font-size: 12px;
        line-height: 1.4;
        max-width: 220px;
      }

      /* Job Listing Card */
      .job-card {
        background: white;
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-color);
        padding: 18px 20px;
        box-shadow: var(--shadow-sm);
        transition: all 0.2s;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .job-card-header {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 12px;
      }

      .job-card-icon {
        width: 40px;
        height: 40px;
        background-color: var(--primary-light);
        color: var(--primary);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .job-card-info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .job-card-title {
        font-family: var(--font-display);
        font-size: 15.5px;
        font-weight: 700;
        color: var(--text-main);
        line-height: 1.3;
      }

      .job-card-loc-date {
        font-size: 11px;
        color: var(--text-muted);
        margin-top: 3px;
      }

      .job-card-badge {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.2px;
        padding: 3px 8px;
        border-radius: var(--radius-sm);
        align-self: flex-start;
      }

      .job-card-badge.active {
        background-color: var(--primary-light);
        color: var(--primary);
      }

      .job-card-badge.pending {
        background-color: var(--warning-light);
        color: var(--warning);
      }

      .job-card-badge.closed {
        background-color: hsl(220, 15%, 94%);
        color: var(--text-muted);
      }

      .job-card-meta {
        display: flex;
        gap: 16px;
        margin-bottom: 18px;
        padding-left: 2px;
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        color: var(--text-muted);
        font-weight: 500;
      }

      .meta-item svg {
        color: var(--text-light);
      }

      .job-card-hiring {
        background-color: hsl(220, 15%, 98.5%);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 12px;
        margin-bottom: 16px;
      }

      .hiring-title {
        font-size: 9px;
        font-weight: 700;
        color: var(--text-muted);
        letter-spacing: 0.3px;
        margin-bottom: 10px;
      }

      .hiring-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        text-align: center;
      }

      .hiring-col {
        display: flex;
        flex-direction: column;
        gap: 3px;
        position: relative;
      }

      .hiring-col:not(:last-child)::after {
        content: '';
        position: absolute;
        right: 0;
        top: 15%;
        height: 70%;
        width: 1px;
        background-color: var(--border-color);
      }

      .hiring-val {
        font-family: var(--font-display);
        font-size: 13.5px;
        font-weight: 700;
      }

      .hiring-col.pending .hiring-val { color: var(--info); }
      .hiring-col.shortlist .hiring-val { color: var(--primary); }
      .hiring-col.contact .hiring-val { color: var(--warning); }
      .hiring-col.reject .hiring-val { color: var(--danger); }

      .hiring-lbl {
        font-size: 10px;
        color: var(--text-muted);
      }

      .job-card-actions {
        display: flex;
        gap: 10px;
      }

      .btn-view-talent {
        flex: 1;
        background-color: var(--primary);
        color: white;
        border: none;
        padding: 11px 0;
        border-radius: var(--radius-md);
        font-size: 12.5px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s, transform 0.1s;
        box-shadow: 0 4px 10px rgba(22, 163, 74, 0.15);
      }

      .btn-view-talent:hover {
        background-color: var(--primary-dark);
      }

      .btn-view-talent:active {
        transform: scale(0.98);
      }

      .btn-close-job {
        flex: 1;
        background: white;
        border: 1px solid var(--border-color);
        color: var(--text-muted);
        padding: 11px 0;
        border-radius: var(--radius-md);
        font-size: 12.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-close-job:hover {
        border-color: var(--text-light);
        color: var(--text-main);
        background-color: var(--bg-hover);
      }

      .btn-close-job:active {
        transform: scale(0.98);
      }

      /* Add Job FAB */
      .add-job-fab {
        position: absolute;
        bottom: 24px;
        right: 20px;
        width: 48px;
        height: 48px;
        border-radius: var(--radius-circle);
        background-color: var(--primary);
        color: white;
        border: none;
        box-shadow: 0 4px 14px rgba(22, 163, 74, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 40;
        transition: transform 0.2s, background-color 0.2s;
      }

      .add-job-fab:hover {
        background-color: var(--primary-dark);
      }

      .add-job-fab:active {
        transform: scale(0.9);
      }

      /* --- OVERLAYS & MODALS --- */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        visibility: hidden;
        opacity: 0;
        transition: all 0.3s ease;
      }

      .modal-overlay.active {
        visibility: visible;
        opacity: 1;
      }

      .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
      }

      /* Bottom Sheet Modal Style */
      .bottom-sheet {
        position: absolute;
        bottom: 0;
        width: 100%;
        max-width: 410px; /* Constrain to desktop phone layout */
        background: white;
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        padding: 16px 24px 34px 24px;
        box-shadow: 0 -10px 25px rgba(0,0,0,0.1);
        transform: translateY(100%);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 10;
      }

      .modal-overlay.active .bottom-sheet {
        transform: translateY(0);
      }

      .bottom-sheet-handle {
        width: 36px;
        height: 4px;
        background-color: var(--border-color);
        border-radius: 2px;
        margin: 0 auto 16px auto;
      }

      .bottom-sheet-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .bottom-sheet-header h2 {
        font-family: var(--font-display);
        font-size: 18px;
        font-weight: 700;
      }

      .close-modal-btn {
        background: none;
        border: none;
        font-size: 24px;
        line-height: 1;
        color: var(--text-light);
        cursor: pointer;
        padding: 4px;
        transition: color 0.2s;
      }

      .close-modal-btn:hover {
        color: var(--text-main);
      }

      /* Forms */
      .bottom-sheet-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-group.half {
        flex: 1;
      }

      .form-row {
        display: flex;
        gap: 14px;
      }

      label {
        font-size: 11.5px;
        font-weight: 600;
        color: var(--text-muted);
      }

      input[type="text"], input[type="number"], select {
        width: 100%;
        padding: 11px 14px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        font-family: var(--font-family);
        font-size: 13px;
        color: var(--text-main);
        background-color: white;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      input[type="text"]:focus, input[type="number"]:focus, select:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--primary-light);
      }

      .form-actions {
        display: flex;
        gap: 12px;
        margin-top: 10px;
      }

      .btn-primary {
        flex: 1;
        background-color: var(--primary);
        color: white;
        border: none;
        padding: 12px 0;
        border-radius: var(--radius-md);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .btn-primary:hover {
        background-color: var(--primary-dark);
      }

      .btn-secondary {
        flex: 1;
        background-color: white;
        border: 1px solid var(--border-color);
        color: var(--text-muted);
        padding: 12px 0;
        border-radius: var(--radius-md);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-secondary:hover {
        border-color: var(--text-light);
        background-color: var(--bg-hover);
      }

      .btn-danger {
        flex: 1;
        background-color: var(--danger);
        color: white;
        border: none;
        padding: 12px 0;
        border-radius: var(--radius-md);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .btn-danger:hover {
        background-color: hsl(351, 80%, 46%);
      }

      /* Full Dialog Modal (for Applicants List) */
      .modal-dialog {
        width: 90%;
        max-width: 370px;
        background: white;
        border-radius: var(--radius-lg);
        padding: 22px;
        box-shadow: var(--shadow-lg);
        transform: scale(0.9);
        transition: transform 0.3s ease;
        z-index: 10;
      }

      .modal-overlay.active .modal-dialog {
        transform: scale(1);
      }

      .modal-dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 18px;
      }

      .modal-dialog-header h2 {
        font-family: var(--font-display);
        font-size: 17px;
        font-weight: 700;
      }

      .modal-subtitle {
        font-size: 11px;
        color: var(--text-muted);
        margin-top: 2px;
      }

      .talent-summary-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        background-color: var(--bg-hover);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 8px;
        margin-bottom: 20px;
        text-align: center;
      }

      .talent-summary-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .talent-summary-item:not(:last-child) {
        border-right: 1px solid var(--border-color);
      }

      .talent-summary-item .num {
        font-family: var(--font-display);
        font-size: 13px;
        font-weight: 700;
      }

      .talent-summary-item.pending .num { color: var(--info); }
      .talent-summary-item.shortlist .num { color: var(--primary); }
      .talent-summary-item.contact .num { color: var(--warning); }
      .talent-summary-item.reject .num { color: var(--danger); }

      .talent-summary-item .lbl {
        font-size: 8.5px;
        font-weight: 500;
        color: var(--text-muted);
      }

      .applicants-list-heading {
        font-family: var(--font-display);
        font-size: 12px;
        font-weight: 700;
        color: var(--text-main);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
      }

      .applicants-list {
        max-height: 280px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-right: 4px;
      }

      /* Custom Scrollbar for list */
      .applicants-list::-webkit-scrollbar {
        width: 4px;
      }
      .applicants-list::-webkit-scrollbar-track {
        background: var(--bg-hover);
        border-radius: 2px;
      }
      .applicants-list::-webkit-scrollbar-thumb {
        background: var(--text-light);
        border-radius: 2px;
      }

      .applicant-card {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        background-color: white;
      }

      .applicant-card-top {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .applicant-avatar-circle {
        width: 32px;
        height: 32px;
        background-color: var(--bg-body);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-display);
        font-size: 11px;
        font-weight: 700;
        color: var(--text-muted);
      }

      .applicant-info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .applicant-name {
        font-size: 12.5px;
        font-weight: 600;
        color: var(--text-main);
      }

      .applicant-meta {
        font-size: 9.5px;
        color: var(--text-muted);
        margin-top: 1px;
      }

      .applicant-status-badge {
        font-size: 8px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .applicant-status-badge.new { background-color: var(--info-light); color: var(--info); }
      .applicant-status-badge.shortlisted { background-color: var(--primary-light); color: var(--primary); }
      .applicant-status-badge.contacted { background-color: var(--warning-light); color: var(--warning); }
      .applicant-status-badge.rejected { background-color: var(--danger-light); color: var(--danger); }

      .applicant-actions {
        display: flex;
        gap: 6px;
        margin-top: 2px;
        border-top: 1px dashed var(--border-color);
        padding-top: 8px;
      }

      .applicant-action-btn {
        flex: 1;
        background: var(--bg-hover);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 5px 0;
        font-size: 9.5px;
        font-weight: 600;
        cursor: pointer;
        color: var(--text-muted);
        transition: all 0.2s;
        text-align: center;
      }

      .applicant-action-btn.btn-sh:hover { background-color: var(--primary-light); border-color: var(--primary); color: var(--primary); }
      .applicant-action-btn.btn-ct:hover { background-color: var(--warning-light); border-color: var(--warning); color: var(--warning); }
      .applicant-action-btn.btn-rj:hover { background-color: var(--danger-light); border-color: var(--danger); color: var(--danger); }

      .applicant-card-empty {
        text-align: center;
        padding: 24px;
        font-size: 12px;
        color: var(--text-muted);
      }

      /* Alert Overlay Modal */
      .alert-overlay .alert-dialog {
        width: 85%;
        max-width: 320px;
        background: white;
        border-radius: var(--radius-lg);
        padding: 24px;
        text-align: center;
        box-shadow: var(--shadow-lg);
        transform: scale(0.9);
        transition: transform 0.3s ease;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }

      .modal-overlay.active .alert-dialog {
        transform: scale(1);
      }

      .alert-dialog-icon {
        width: 52px;
        height: 52px;
        border-radius: var(--radius-circle);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .alert-dialog-icon.red {
        background-color: var(--danger-light);
        color: var(--danger);
      }

      .alert-dialog h3 {
        font-family: var(--font-display);
        font-size: 16px;
        font-weight: 700;
      }

      .alert-dialog p {
        font-size: 11.5px;
        color: var(--text-muted);
        line-height: 1.45;
      }

      .alert-dialog-actions {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 8px;
        margin-top: 8px;
      }

      .alert-dialog-actions button {
        width: 100%;
      }

      /* --- TOAST NOTIFICATIONS --- */
      .toast-container {
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 300;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
        width: 90%;
        max-width: 340px;
      }

      .toast {
        background-color: #1e293b;
        color: white;
        border-radius: var(--radius-md);
        padding: 12px 16px;
        font-size: 12px;
        font-weight: 500;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slide-down-fade 0.35s cubic-bezier(0.16, 1, 0.3, 1), fade-out 0.25s 2.75s forwards;
        pointer-events: auto;
      }

      .toast-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
      }

      .toast.success .toast-icon { color: var(--primary); }
      .toast.info .toast-icon { color: var(--info); }
      .toast.warning .toast-icon { color: var(--warning); }
      .toast.error .toast-icon { color: var(--danger); }

      @keyframes slide-down-fade {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes fade-out {
        to {
          opacity: 0;
          transform: translateY(-10px);
        }
      }

      /* --- RESPONSIVE STYLE --- */
      @media (max-width: 480px) {
        body {
          background-color: var(--bg-screen);
          align-items: flex-start;
        }
        .phone-wrapper {
          padding: 0;
          width: 100vw;
          height: 100vh;
        }
        .phone-frame {
          width: 100%;
          height: 100%;
          border-radius: 0;
          box-shadow: none;
        }
        .phone-screen {
          border-radius: 0;
        }
        .phone-notch, .phone-volume-up, .phone-volume-down, .phone-power-btn {
          display: none;
        }
        .phone-status-bar {
          padding: 10px 16px 0 16px;
        }
        .app-screen {
          padding: 12px 16px 80px 16px;
        }
        .bottom-sheet {
          max-width: 100%;
        }
        .phone-home-indicator {
          bottom: 4px;
          width: 134px;
          height: 5px;
        }
      }
    </style>
  </head>
  <body>
    <!-- App Container (simulated phone wrapper on desktop) -->
    <div class="phone-wrapper">
      <div class="phone-frame">
        <!-- Physical phone details on desktop -->
        <div class="phone-notch"></div>
        <div class="phone-volume-up"></div>
        <div class="phone-volume-down"></div>
        <div class="phone-power-btn"></div>
        
        <!-- Screen contents -->
        <div class="phone-screen">
          
          <!-- Phone Status Bar -->
          <div class="phone-status-bar">
            <div class="status-bar-left">
              <span class="status-bar-time" id="status-time">15:04</span>
              <div class="status-bar-call">
                <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
                  <path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.72 11.72 0 003.79.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.6 3.79 1 1 0 01-.27 1.11z"/>
                </svg>
                <span>00:45</span>
              </div>
            </div>
            <div class="status-bar-right">
              <span class="status-bar-speed">333.3 KB/s</span>
              <!-- Network Signal -->
              <svg class="status-bar-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M2 22h20V2z" opacity="0.3"/>
                <path d="M17 7L2 22h15z"/>
              </svg>
              <span class="status-bar-network">5G+</span>
              <!-- Battery -->
              <div class="status-bar-battery">
                <span class="battery-level">72%</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M17 5H3a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z" opacity="0.3"/>
                  <path d="M15 7H3v10h12V7z"/>
                  <path d="M21 9v6h2V9h-2z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- App Screens Container -->
          <div class="app-viewport">
            
            <!-- SCREEN 1: EMPLOYER DASHBOARD -->
            <div id="screen-dashboard" class="app-screen active">
              <!-- Employer Header -->
              <header class="employer-header">
                <div class="employer-profile">
                  <img class="employer-avatar" src="{{ $avatarUrl }}" alt="{{ $employerName }}" />
                  <div class="employer-meta">
                    <h3 class="employer-name">{{ $companyName }}</h3>
                    <p class="employer-contact">Contact: {{ $employerName }}</p>
                  </div>
                </div>
                <div class="header-actions">
                  <button class="header-btn notification-btn" id="btn-notifications" aria-label="Notifications">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span class="notification-badge"></span>
                  </button>
                  <button class="header-btn settings-btn" id="btn-settings" aria-label="Settings">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                  </button>
                  <a href="/logout" class="header-btn logout-btn" id="btn-logout" aria-label="Logout" style="text-decoration: none;" title="Logout">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                  </a>
                </div>
              </header>

              <!-- Dashboard Body -->
              <main class="dashboard-content">
                <h1 class="page-title">Dashboard</h1>

                <!-- Main Metric Card -->
                <section class="main-metric-card">
                  <div class="metric-top">
                    <div class="metric-info">
                      <span class="metric-label">ALL TALENT APPLICANTS RECEIVED</span>
                      <span class="metric-value" id="dashboard-total-applicants">{{ $totalApplicants }}</span>
                    </div>
                    <div class="metric-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div class="metric-divider"></div>
                  
                  <div class="metric-breakdown">
                    <div class="breakdown-col shortlisted">
                      <span class="breakdown-num" id="dashboard-shortlisted">{{ $totalShortlisted }}</span>
                      <span class="breakdown-label">Shortlisted</span>
                    </div>
                    <div class="breakdown-col rejected">
                      <span class="breakdown-num" id="dashboard-rejected">{{ $totalRejected }}</span>
                      <span class="breakdown-label">Rejected</span>
                    </div>
                    <div class="breakdown-col contacted">
                      <span class="breakdown-num" id="dashboard-contacted">{{ $totalContacted }}</span>
                      <span class="breakdown-label">Contacted</span>
                    </div>
                  </div>
                </section>

                <!-- Mini Status Cards Grid -->
                <section class="mini-cards-grid">
                  <div class="mini-card pending">
                    <div class="mini-card-icon yellow">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div class="mini-card-info">
                      <span class="mini-card-label">Pending</span>
                      <span class="mini-card-val" id="dashboard-pending-count">{{ $pendingJobsCount }}</span>
                    </div>
                  </div>
                  
                  <div class="mini-card active-jobs">
                    <div class="mini-card-icon blue">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                    </div>
                    <div class="mini-card-info">
                      <span class="mini-card-label">Active Jobs</span>
                      <span class="mini-card-val" id="dashboard-active-count">{{ $activeJobsCount }}</span>
                    </div>
                  </div>
                </section>

                <!-- Actions Section -->
                <section class="actions-section">
                  <h2 class="section-title">Actions</h2>
                  <div class="actions-list">
                    <button class="action-item-btn" id="action-post-job">
                      <div class="action-item-left">
                        <div class="action-icon-circle green">
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </div>
                        <div class="action-item-text">
                          <span class="action-item-title">Post Job</span>
                          <span class="action-item-desc">Create a new opening for your team</span>
                        </div>
                      </div>
                      <svg class="action-chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>

                    <button class="action-item-btn" id="action-my-jobs">
                      <div class="action-item-left">
                        <div class="action-icon-circle gray-blue">
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                          </svg>
                        </div>
                        <div class="action-item-text">
                          <span class="action-item-title">My Jobs</span>
                          <span class="action-item-desc">Edit or close existing job postings</span>
                        </div>
                      </div>
                      <svg class="action-chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                </section>
              </main>

              <!-- Support Float Button -->
              <button class="support-fab" id="support-fab" aria-label="Customer Support">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="11" r="3"></circle>
                </svg>
              </button>
            </div>


            <!-- SCREEN 2: ALL MY POSTED JOBS -->
            <div id="screen-jobs" class="app-screen screen-hidden-right">
              <!-- Back Header -->
              <header class="jobs-header">
                <button class="back-arrow-btn" id="jobs-back-btn" aria-label="Back to Dashboard">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <h1 class="jobs-header-title">All Jobs</h1>
              </header>

              <!-- Jobs Tabs -->
              <nav class="jobs-tabs">
                <button class="tab-btn active" data-tab="active" id="tab-active">Active (0)</button>
                <button class="tab-btn" data-tab="pending" id="tab-pending">Pending (0)</button>
                <button class="tab-btn" data-tab="closed" id="tab-closed">Closed (0)</button>
              </nav>

              <!-- Jobs Cards Listing Container -->
              <main class="jobs-content">
                <div class="jobs-list" id="jobs-list-container">
                  <!-- Dynamic content rendered by JS -->
                </div>
              </main>

              <!-- Add Job Float Button -->
              <button class="add-job-fab" id="add-job-fab" aria-label="Post a Job">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

          </div> <!-- /app-viewport -->

          <!-- Home Indicator (simulated iOS bar at bottom) -->
          <div class="phone-home-indicator"></div>
        </div> <!-- /phone-screen -->
      </div> <!-- /phone-frame -->
    </div> <!-- /phone-wrapper -->


    <!-- MODAL 1: POST A NEW JOB (Bottom Sheet) -->
    <div class="modal-overlay" id="modal-post-job">
      <div class="modal-backdrop"></div>
      <div class="bottom-sheet">
        <div class="bottom-sheet-handle"></div>
        <div class="bottom-sheet-header">
          <h2>Post a New Job</h2>
          <button class="close-modal-btn" data-close="modal-post-job">&times;</button>
        </div>
        <form class="bottom-sheet-form" id="form-post-job">
          <div class="form-group">
            <label for="job-title">Job Title</label>
            <input type="text" id="job-title" placeholder="e.g. Executive Sous Chef" required />
          </div>
          <div class="form-group">
            <label for="job-location">Location</label>
            <input type="text" id="job-location" placeholder="e.g. Dubai, UAE" required />
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label for="job-openings">Openings</label>
              <input type="number" id="job-openings" min="1" value="1" required />
            </div>
            <div class="form-group half">
              <label for="job-type">Job Type</label>
              <select id="job-type">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="job-status">Initial Status</label>
            <select id="job-status">
              <option value="active">Active (Publish Immediately)</option>
              <option value="pending">Pending (Save Draft)</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" data-close="modal-post-job">Cancel</button>
            <button type="submit" class="btn-primary">Post Job</button>
          </div>
        </form>
      </div>
    </div>


    <!-- MODAL 2: TALENT APPLICANTS LIST (Full Dialog Overlay) -->
    <div class="modal-overlay" id="modal-view-talent">
      <div class="modal-backdrop"></div>
      <div class="modal-dialog">
        <div class="modal-dialog-header">
          <div>
            <h2 id="talent-modal-title">Talent Applicants</h2>
            <p class="modal-subtitle" id="talent-modal-subtitle">Hiring progress for job opening</p>
          </div>
          <button class="close-modal-btn" data-close="modal-view-talent">&times;</button>
        </div>
        <div class="modal-dialog-body">
          <div class="talent-summary-grid">
            <div class="talent-summary-item pending">
              <span class="num" id="talent-sum-pending">0</span>
              <span class="lbl">Pending</span>
            </div>
            <div class="talent-summary-item shortlist">
              <span class="num" id="talent-sum-shortlist">0</span>
              <span class="lbl">Shortlisted</span>
            </div>
            <div class="talent-summary-item contact">
              <span class="num" id="talent-sum-contact">0</span>
              <span class="lbl">Contacted</span>
            </div>
            <div class="talent-summary-item reject">
              <span class="num" id="talent-sum-reject">0</span>
              <span class="lbl">Rejected</span>
            </div>
          </div>

          <h3 class="applicants-list-heading">Applicant Profiles</h3>
          <div class="applicants-list" id="applicants-list-container">
            <!-- Rendered by JS -->
          </div>
        </div>
      </div>
    </div>


    <!-- MODAL 3: CONFIRM CLOSE JOB (Dialog Alert) -->
    <div class="modal-overlay alert-overlay" id="modal-confirm-close">
      <div class="modal-backdrop"></div>
      <div class="alert-dialog">
        <div class="alert-dialog-icon red">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3>Close Job Position?</h3>
        <p>This will move the job to the Closed tab and archive current hiring progress. You will no longer receive new applications for this role.</p>
        <div class="alert-dialog-actions">
          <button class="btn-secondary" id="btn-cancel-close">Keep Position Open</button>
          <button class="btn-danger" id="btn-confirm-close-action">Yes, Close Job</button>
        </div>
      </div>
    </div>


    <!-- Notification Toast -->
    <div class="toast-container" id="toast-container"></div>

    <!-- Client-side Logic driving the AJAX database state -->
    <script>
      // --- STATE FROM LARAVEL ---
      const state = {
        jobs: @json($jobs),
        currentScreen: "dashboard",
        currentTab: "active",
        activeJobToClose: null,
        activeJobForTalent: null
      };

      // --- DOM ELEMENTS ---
      const elements = {
        screenDashboard: document.getElementById("screen-dashboard"),
        screenJobs: document.getElementById("screen-jobs"),
        
        btnMyJobs: document.getElementById("action-my-jobs"),
        btnPostJob: document.getElementById("action-post-job"),
        btnJobsBack: document.getElementById("jobs-back-btn"),
        
        tabActive: document.getElementById("tab-active"),
        tabPending: document.getElementById("tab-pending"),
        tabClosed: document.getElementById("tab-closed"),
        
        jobsListContainer: document.getElementById("jobs-list-container"),
        toastContainer: document.getElementById("toast-container"),
        
        dashTotalApplicants: document.getElementById("dashboard-total-applicants"),
        dashShortlisted: document.getElementById("dashboard-shortlisted"),
        dashRejected: document.getElementById("dashboard-rejected"),
        dashContacted: document.getElementById("dashboard-contacted"),
        dashPendingCount: document.getElementById("dashboard-pending-count"),
        dashActiveCount: document.getElementById("dashboard-active-count"),
        
        modalPostJob: document.getElementById("modal-post-job"),
        modalViewTalent: document.getElementById("modal-view-talent"),
        modalConfirmClose: document.getElementById("modal-confirm-close"),
        
        formPostJob: document.getElementById("form-post-job"),
        btnCancelClose: document.getElementById("btn-cancel-close"),
        btnConfirmCloseAction: document.getElementById("btn-confirm-close-action"),
        fabAddJob: document.getElementById("add-job-fab"),
        supportFab: document.getElementById("support-fab"),
        
        talentModalTitle: document.getElementById("talent-modal-title"),
        talentModalSubtitle: document.getElementById("talent-modal-subtitle")
      };

      // Get CSRF Token
      const getCsrfToken = () => document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      // --- SYSTEM CLOCK ---
      function updateClock() {
        const timeEl = document.getElementById("status-time");
        if (timeEl) {
          const now = new Date();
          let hours = now.getHours();
          let minutes = now.getMinutes();
          hours = hours < 10 ? '0' + hours : hours;
          minutes = minutes < 10 ? '0' + minutes : minutes;
          timeEl.textContent = `${hours}:${minutes}`;
        }
      }
      setInterval(updateClock, 1000);
      updateClock();

      // --- TOAST SYSTEM ---
      function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
        let iconSvg = '';
        if (type === 'success') {
          iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === 'info') {
          iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        } else if (type === 'warning') {
          iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        } else {
          iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
        }

        toast.innerHTML = `
          <span class="toast-icon">${iconSvg}</span>
          <span>${message}</span>
        `;
        elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
          toast.remove();
        }, 3000);
      }

      // --- SCREEN NAVIGATION ---
      function navigateTo(screenId) {
        if (screenId === "jobs") {
          elements.screenDashboard.classList.remove("active");
          elements.screenDashboard.classList.add("screen-hidden-left");
          
          elements.screenJobs.classList.remove("screen-hidden-right");
          elements.screenJobs.classList.add("active");
          state.currentScreen = "jobs";
        } else {
          elements.screenJobs.classList.remove("active");
          elements.screenJobs.classList.add("screen-hidden-right");
          
          elements.screenDashboard.classList.remove("screen-hidden-left");
          elements.screenDashboard.classList.add("active");
          state.currentScreen = "dashboard";
          updateDashboardMetrics();
        }
      }

      // --- MODAL CONTROLS ---
      function openModal(modalEl) {
        modalEl.classList.add("active");
      }

      function closeModal(modalEl) {
        modalEl.classList.remove("active");
      }

      document.querySelectorAll("[data-close]").forEach(btn => {
        btn.addEventListener("click", () => {
          const modalId = btn.getAttribute("data-close");
          closeModal(document.getElementById(modalId));
        });
      });

      document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", (e) => {
          if (e.target === overlay || e.target.classList.contains("modal-backdrop")) {
            closeModal(overlay);
          }
        });
      });

      // --- METRIC AGGREGATION & RENDERING ---
      function updateDashboardMetrics() {
        const activeJobs = state.jobs.filter(j => j.status === 'active');
        const pendingJobs = state.jobs.filter(j => j.status === 'pending');
        
        let totalApplicants = 0;
        let totalShortlisted = 0;
        let totalRejected = 0;
        let totalContacted = 0;
        
        activeJobs.forEach(job => {
          totalApplicants += job.applicants.length;
          job.applicants.forEach(app => {
            if (app.status === 'shortlisted') totalShortlisted++;
            else if (app.status === 'rejected') totalRejected++;
            else if (app.status === 'contacted') totalContacted++;
          });
        });
        
        elements.dashTotalApplicants.textContent = totalApplicants;
        elements.dashShortlisted.textContent = totalShortlisted;
        elements.dashRejected.textContent = totalRejected;
        elements.dashContacted.textContent = totalContacted;
        
        elements.dashActiveCount.textContent = activeJobs.length;
        elements.dashPendingCount.textContent = pendingJobs.length;
      }

      function updateTabButtons() {
        const activeCount = state.jobs.filter(j => j.status === 'active').length;
        const pendingCount = state.jobs.filter(j => j.status === 'pending').length;
        const closedCount = state.jobs.filter(j => j.status === 'closed').length;
        
        elements.tabActive.textContent = `Active (${activeCount})`;
        elements.tabPending.textContent = `Pending (${pendingCount})`;
        elements.tabClosed.textContent = `Closed (${closedCount})`;
        
        elements.tabActive.classList.toggle("active", state.currentTab === "active");
        elements.tabPending.classList.toggle("active", state.currentTab === "pending");
        elements.tabClosed.classList.toggle("active", state.currentTab === "closed");
      }

      function renderJobs() {
        elements.jobsListContainer.innerHTML = "";
        updateTabButtons();
        
        const filteredJobs = state.jobs.filter(j => j.status === state.currentTab);
        
        if (filteredJobs.length === 0) {
          elements.jobsListContainer.innerHTML = `
            <div class="jobs-empty-state">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <h3>No ${state.currentTab} jobs found</h3>
              <p>Post a new opening or adjust your filters to view job postings.</p>
            </div>
          `;
          return;
        }
        
        filteredJobs.forEach(job => {
          const totalApps = job.applicants.length;
          const pendingApps = job.applicants.filter(a => a.status === 'new' || a.status === 'pending').length;
          const shortlistApps = job.applicants.filter(a => a.status === 'shortlisted').length;
          const contactApps = job.applicants.filter(a => a.status === 'contacted').length;
          const rejectApps = job.applicants.filter(a => a.status === 'rejected').length;
          
          const card = document.createElement("div");
          card.className = "job-card";
          
          card.innerHTML = `
            <div class="job-card-header">
              <div class="job-card-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18.8 22H19c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1h-.2c-1.3 0-2.4 1-2.6 2.4l-1.5 9.1c-.2 1 0 2 .5 2.8l3 5.4c.3.5.7.8 1.2.8z"></path>
                  <path d="M10 2v8c0 .7-.3 1.3-.8 1.7L7 14v7c0 .6-.4 1-1 1s-1-.4-1-1v-7L2.8 11.7C2.3 11.3 2 10.7 2 10V2c0-.6.4-1 1-1s1 .4 1 1v5h1V2c0-.6.4-1 1-1s1 .4 1 1v5h1V2c0-.6.4-1 1-1s1 .4 1 1z"></path>
                </svg>
              </div>
              <div class="job-card-info">
                <h3 class="job-card-title">${job.title}</h3>
                <span class="job-card-loc-date">${job.location} &bull; ${job.date_posted}</span>
              </div>
              <span class="job-card-badge ${job.status}">${job.status.toUpperCase()}</span>
            </div>
            
            <div class="job-card-meta">
              <div class="meta-item">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <span>${job.openings} Openings</span>
              </div>
              <div class="meta-item">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>${job.type}</span>
              </div>
            </div>
            
            <div class="job-card-hiring">
              <div class="hiring-title">HIRING PROGRESS (${totalApps} TALENT APPLICATIONS RECEIVED)</div>
              <div class="hiring-grid">
                <div class="hiring-col pending">
                  <span class="hiring-val">${pendingApps}</span>
                  <span class="hiring-lbl">Pending</span>
                </div>
                <div class="hiring-col shortlist">
                  <span class="hiring-val">${shortlistApps}</span>
                  <span class="hiring-lbl">Shortlist</span>
                </div>
                <div class="hiring-col contact">
                  <span class="hiring-val">${contactApps}</span>
                  <span class="hiring-lbl">Contact</span>
                </div>
                <div class="hiring-col reject">
                  <span class="hiring-val">${rejectApps}</span>
                  <span class="hiring-lbl">Rejected</span>
                </div>
              </div>
            </div>
            
            <div class="job-card-actions">
              <button class="btn-view-talent" data-job-id="${job.id}">View Talent</button>
              ${job.status !== 'closed' ? `<button class="btn-close-job" data-job-id="${job.id}">Close Job</button>` : ''}
            </div>
          `;
          
          card.querySelector(".btn-view-talent").addEventListener("click", () => {
            openTalentModal(job.id);
          });
          
          const closeBtn = card.querySelector(".btn-close-job");
          if (closeBtn) {
            closeBtn.addEventListener("click", () => {
              state.activeJobToClose = job.id;
              openModal(elements.modalConfirmClose);
            });
          }
          
          elements.jobsListContainer.appendChild(card);
        });
      }

      // --- AJAX VIEW TALENT DIALOG ---
      function openTalentModal(jobId) {
        const job = state.jobs.find(j => j.id === jobId);
        if (!job) return;
        
        state.activeJobForTalent = jobId;
        elements.talentModalTitle.textContent = `${job.title} Applicants`;
        elements.talentModalSubtitle.textContent = `Hiring progress for job opening in ${job.location}`;
        
        renderTalentApplicantsList();
        openModal(elements.modalViewTalent);
      }

      function renderTalentApplicantsList() {
        const job = state.jobs.find(j => j.id === state.activeJobForTalent);
        if (!job) return;
        
        const pending = job.applicants.filter(a => a.status === 'new' || a.status === 'pending').length;
        const shortlist = job.applicants.filter(a => a.status === 'shortlisted').length;
        const contact = job.applicants.filter(a => a.status === 'contacted').length;
        const reject = job.applicants.filter(a => a.status === 'rejected').length;
        
        document.getElementById("talent-sum-pending").textContent = pending;
        document.getElementById("talent-sum-shortlist").textContent = shortlist;
        document.getElementById("talent-sum-contact").textContent = contact;
        document.getElementById("talent-sum-reject").textContent = reject;
        
        const container = document.getElementById("applicants-list-container");
        container.innerHTML = "";
        
        if (job.applicants.length === 0) {
          container.innerHTML = `<div class="applicant-card-empty">No candidates have applied yet for this job role.</div>`;
          return;
        }
        
        job.applicants.forEach(app => {
          const initials = app.name.split(" ").map(n => n[0]).join("").toUpperCase();
          const card = document.createElement("div");
          card.className = "applicant-card";
          
          card.innerHTML = `
            <div class="applicant-card-top">
              <div class="applicant-avatar-circle">${initials}</div>
              <div class="applicant-info">
                <span class="applicant-name">${app.name}</span>
                <span class="applicant-meta">Applied on ${app.applied_date}</span>
              </div>
              <span class="applicant-status-badge ${app.status === 'new' ? 'pending' : app.status}">
                ${app.status === 'new' ? 'PENDING' : app.status.toUpperCase()}
              </span>
            </div>
            <div class="applicant-actions">
              ${app.status !== 'shortlisted' ? `<button class="applicant-action-btn btn-sh" data-id="${app.id}" data-action="shortlisted">Shortlist</button>` : ''}
              ${app.status !== 'contacted' ? `<button class="applicant-action-btn btn-ct" data-id="${app.id}" data-action="contacted">Contact</button>` : ''}
              ${app.status !== 'rejected' ? `<button class="applicant-action-btn btn-rj" data-id="${app.id}" data-action="rejected">Reject</button>` : ''}
            </div>
          `;
          
          card.querySelectorAll(".applicant-action-btn").forEach(btn => {
            btn.addEventListener("click", () => {
              const appId = parseInt(btn.getAttribute("data-id"));
              const newStatus = btn.getAttribute("data-action");
              ajaxUpdateApplicantStatus(appId, newStatus);
            });
          });
          
          container.appendChild(card);
        });
      }

      // --- AJAX DATABASE PERSISTENCE CALLS ---

      // 1. Update Applicant Status AJAX
      function ajaxUpdateApplicantStatus(applicantId, status) {
        fetch(`/api/applicants/${applicantId}/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken()
          },
          body: JSON.stringify({ status: status })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Update local state record
            const jobIndex = state.jobs.findIndex(j => j.id === state.activeJobForTalent);
            if (jobIndex !== -1) {
              const appIndex = state.jobs[jobIndex].applicants.findIndex(a => a.id === applicantId);
              if (appIndex !== -1) {
                state.jobs[jobIndex].applicants[appIndex] = data.applicant;
              }
            }
            showToast(data.message, "success");
            
            // Re-render components
            renderTalentApplicantsList();
            renderJobs();
            updateDashboardMetrics();
          } else {
            showToast("Failed to update status.", "error");
          }
        })
        .catch(err => {
          console.error(err);
          showToast("Network connection error.", "error");
        });
      }

      // 2. Post New Job AJAX
      elements.formPostJob.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const title = document.getElementById("job-title").value.trim();
        const location = document.getElementById("job-location").value.trim();
        const openings = parseInt(document.getElementById("job-openings").value);
        const type = document.getElementById("job-type").value;
        const status = document.getElementById("job-status").value;
        
        fetch('/api/employer/jobs/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken()
          },
          body: JSON.stringify({
            title: title,
            location: location,
            openings: openings,
            type: type,
            status: status
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Add job to local state array
            state.jobs.unshift(data.job);
            
            elements.formPostJob.reset();
            closeModal(elements.modalPostJob);
            showToast(data.message, "success");
            
            state.currentTab = status;
            renderJobs();
            updateDashboardMetrics();
            navigateTo("jobs");
          } else {
            showToast("Failed to post job.", "error");
          }
        })
        .catch(err => {
          console.error(err);
          showToast("Validation failed or database error.", "error");
        });
      });

      // 3. Close Job AJAX
      elements.btnConfirmCloseAction.addEventListener("click", () => {
        const jobId = state.activeJobToClose;
        if (!jobId) return;
        
        fetch(`/jobs/${jobId}/close`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken()
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Update local state status
            const job = state.jobs.find(j => j.id === jobId);
            if (job) {
              job.status = 'closed';
            }
            closeModal(elements.modalConfirmClose);
            showToast(data.message, "info");
            
            state.currentTab = 'closed';
            renderJobs();
            updateDashboardMetrics();
          } else {
            showToast("Failed to close job posting.", "error");
          }
        })
        .catch(err => {
          console.error(err);
          showToast("Network connection error.", "error");
        });
        
        state.activeJobToClose = null;
      });

      elements.btnCancelClose.addEventListener("click", () => {
        closeModal(elements.modalConfirmClose);
        state.activeJobToClose = null;
      });

      // --- NEW NAVIGATION BINDINGS ---
      elements.btnMyJobs.addEventListener("click", () => {
        state.currentTab = "active";
        renderJobs();
        navigateTo("jobs");
      });

      elements.btnPostJob.addEventListener("click", () => {
        openModal(elements.modalPostJob);
      });

      elements.btnJobsBack.addEventListener("click", () => {
        navigateTo("dashboard");
      });

      // Tabs
      elements.tabActive.addEventListener("click", () => {
        state.currentTab = "active";
        renderJobs();
      });

      elements.tabPending.addEventListener("click", () => {
        state.currentTab = "pending";
        renderJobs();
      });

      elements.tabClosed.addEventListener("click", () => {
        state.currentTab = "closed";
        renderJobs();
      });

      // FAB Buttons
      elements.fabAddJob.addEventListener("click", () => {
        openModal(elements.modalPostJob);
      });

      elements.supportFab.addEventListener("click", () => {
        showToast("Support Chat: Helpdesk is offline. Try again later.", "warning");
      });

      // --- INITIALIZE APPLICATION ---
      function init() {
        renderJobs();
        updateDashboardMetrics();
        showToast("Welcome back, {{ $employerName }}!", "info");
      }

      init();
    </script>
  </body>
</html>
