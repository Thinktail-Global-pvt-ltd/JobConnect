<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Firebase FCM Tester - JobConnect</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        outfit: ['Outfit', 'sans-serif'],
                        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50/50 text-gray-800 antialiased font-jakarta">

<div class="max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-xl border-x border-gray-100 pb-12">
    <!-- Header -->
    <header class="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-50 shadow-sm">
        <a href="{{ route('profile') }}" class="text-gray-400 hover:text-gray-600 transition flex items-center justify-center p-1.5 hover:bg-gray-50 rounded-full">
            <span class="material-symbols-outlined text-[22px]">arrow_back</span>
        </a>
        <div>
            <h1 class="font-outfit font-black text-base text-gray-900 tracking-tight">FCM Push Tester</h1>
            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Firebase Integration Diagnostics</p>
        </div>
    </header>

    <!-- Body Container -->
    <div class="px-5 py-6 space-y-6">
        
        <!-- Setup Guide Info -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 p-4.5 rounded-2xl space-y-2">
            <div class="flex items-center gap-2 text-blue-800">
                <span class="material-symbols-outlined text-lg">info</span>
                <span class="text-xs font-bold font-outfit uppercase tracking-wider">Required Backend Config</span>
            </div>
            <p class="text-[10px] text-blue-700/80 leading-relaxed font-medium">
                Make sure you have placed your Firebase Service Account private key JSON file at:
                <code class="block mt-1.5 p-2 bg-white/70 rounded-lg border border-blue-100/50 text-[9px] font-mono break-all text-blue-900">
                    storage/app/firebase/firebase_credentials.json
                </code>
            </p>
        </div>

        <!-- Testing Form -->
        <div class="space-y-4">
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-gray-400 text-lg">send</span>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Send Test Notification</span>
            </div>

            <div class="space-y-4 bg-white border border-gray-100 p-5 rounded-3xl shadow-xs text-left">
                <!-- Device Token -->
                <div class="space-y-1.5">
                    <label for="fcm_token_input" class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Device FCM Token</label>
                    <textarea id="fcm_token_input" rows="2" 
                              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-xs font-mono placeholder-gray-400 resize-none"
                              placeholder="Paste FCM Device Token here...">{{ $user->fcm_token ?? '' }}</textarea>
                </div>

                <!-- Title -->
                <div class="space-y-1.5">
                    <label for="title_input" class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Notification Title</label>
                    <input type="text" id="title_input" value="Test push from JobConnect"
                           class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-xs"
                           placeholder="Enter title...">
                </div>

                <!-- Body -->
                <div class="space-y-1.5">
                    <label for="body_input" class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Notification Body</label>
                    <textarea id="body_input" rows="2" 
                              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-xs placeholder-gray-400 resize-none"
                              placeholder="Enter message body...">This is a test push notification to verify FCM working state!</textarea>
                </div>

                <div class="flex flex-col gap-2">
                    <button type="button" id="btn-register-fcm" onclick="registerDeviceToken()"
                            class="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs">
                        Register Device Token
                    </button>
                    <button type="button" id="btn-send-fcm" onclick="sendTestNotification()"
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs">
                        Send Test Push
                    </button>
                </div>
            </div>
        </div>

        <!-- Terminal Output Console -->
        <div class="space-y-2">
            <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">Console Output Log</span>
            <div class="bg-gray-950 border border-gray-900 text-green-400 font-mono text-[9px] p-4.5 rounded-2xl space-y-2 text-left min-h-[140px] overflow-y-auto max-h-[220px]">
                <div class="text-gray-500 font-semibold">// Diagnostics console loaded. Ready to test.</div>
                <div id="console-logs" class="space-y-1.5"></div>
            </div>
        </div>

    </div>
</div>

<script>
    function printToConsole(message, type = 'info') {
        const consoleEl = document.getElementById('console-logs');
        if (!consoleEl) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const logLine = document.createElement('div');
        
        let colorClass = 'text-green-400';
        let prefix = '[INFO]';
        
        if (type === 'error') {
            colorClass = 'text-red-400';
            prefix = '[ERROR]';
        } else if (type === 'success') {
            colorClass = 'text-emerald-400';
            prefix = '[SUCCESS]';
        }
        
        logLine.className = `${colorClass} font-mono leading-relaxed`;
        logLine.innerHTML = `<span class="text-gray-600">[${timestamp}]</span> <span class="font-bold">${prefix}</span> ${message}`;
        
        consoleEl.appendChild(logLine);
        
        // Auto scroll to bottom
        consoleEl.parentElement.scrollTop = consoleEl.parentElement.scrollHeight;
    }

    async function registerDeviceToken() {
        const tokenInput = document.getElementById('fcm_token_input');
        const regBtn = document.getElementById('btn-register-fcm');
        
        if (!tokenInput || !regBtn) return;
        
        const token = tokenInput.value.trim();
        if (!token) {
            printToConsole('FCM Device Token is required to register.', 'error');
            return;
        }
        
        regBtn.disabled = true;
        regBtn.innerHTML = 'Registering...';
        
        printToConsole(`Initiating POST request to /api/user/fcm-token...`);
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch("{{ url('/api/user/fcm-token') }}", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    fcm_token: token
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                printToConsole(`Token saved successfully in Database: ${data.message}`, 'success');
            } else {
                printToConsole(`Token save failed: ${data.message || JSON.stringify(data.errors)}`, 'error');
            }
        } catch (err) {
            printToConsole(`Network request failed: ${err.message}`, 'error');
        } finally {
            regBtn.disabled = false;
            regBtn.innerHTML = 'Register Device Token';
        }
    }

    async function sendTestNotification() {
        const tokenInput = document.getElementById('fcm_token_input');
        const titleInput = document.getElementById('title_input');
        const bodyInput = document.getElementById('body_input');
        const sendBtn = document.getElementById('btn-send-fcm');
        
        if (!tokenInput || !titleInput || !bodyInput || !sendBtn) return;
        
        const token = tokenInput.value.trim();
        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();
        
        if (!token) {
            printToConsole('FCM Device Token is required to send notification.', 'error');
            return;
        }
        
        sendBtn.disabled = true;
        sendBtn.innerHTML = 'Sending...';
        
        printToConsole(`Initiating POST request to /api/test/send-notification...`);
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await fetch("{{ url('/api/test/send-notification') }}", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    fcm_token: token,
                    title: title,
                    body: body
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                printToConsole(`FCM Server Response: ${data.message}`, 'success');
            } else {
                printToConsole(`FCM Server Error: ${data.message}`, 'error');
            }
        } catch (err) {
            printToConsole(`Network request failed: ${err.message}`, 'error');
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = 'Send Test Push';
        }
    }
</script>

</body>
</html>
