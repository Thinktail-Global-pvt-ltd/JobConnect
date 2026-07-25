<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - JobConnect</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Outfit', sans-serif; }
    </style>
</head>
<body class="bg-slate-900 min-h-screen flex items-center justify-center p-4">
    
    <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2 mb-6">
            <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border border-emerald-100 font-bold text-2xl">
                🛡️
            </div>
            <h2 className="font-extrabold text-2xl text-slate-800 tracking-tight">Admin Console Login</h2>
            <p className="text-xs text-slate-400 font-medium">Restricted system. Authorised administrative personnel only.</p>
        </div>

        @if($errors->any())
            <div class="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-xs font-semibold mb-4">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="/admin/login" method="POST" class="space-y-4">
            @csrf
            <div>
                <label class="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    Admin ID
                </label>
                <input type="text" name="admin_id" required placeholder="jobconnect_admin" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm" />
            </div>

            <div>
                <label class="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    Password
                </label>
                <input type="password" name="password" required placeholder="••••••" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm" />
            </div>

            <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3.5 text-xs font-extrabold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer">
                Sign In to Admin Console
            </button>
        </form>

        <div class="pt-4 text-center border-t border-slate-100 mt-6">
            <span class="text-[10px] text-slate-400 font-semibold block">
                JobConnect Admin Portal &bull; Secured System
            </span>
        </div>
    </div>

</body>
</html>
