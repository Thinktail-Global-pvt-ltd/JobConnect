import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, KeyRound, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const cleanId = adminId.trim();
      const cleanPassword = password.trim();

      if (cleanId === 'jobconnect_admin' && cleanPassword === '123456') {
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_user_id', 'jobconnect_admin');
        sessionStorage.setItem('admin_authenticated', 'true');

        window.dispatchEvent(new Event('admin_auth_change'));
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Invalid Admin ID or Password. Please try again.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-800">
      {/* Background Ambient Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#059669]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border border-emerald-100">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800 tracking-tight">Admin Console Login</h2>
          <p className="text-xs text-slate-400 font-medium">Restricted system. Authorised administrative personnel only.</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          
          {/* Admin ID Field */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
              Admin ID
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="jobconnect_admin"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition-all shadow-sm"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition-all shadow-sm"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#059669] hover:bg-[#047857] text-white rounded-2xl py-3.5 text-xs font-extrabold shadow-lg shadow-[#059669]/25 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                Sign In to Admin Console
              </>
            )}
          </button>
        </form>

        {/* Footer Notice */}
        <div className="pt-2 text-center border-t border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold block">
            JobConnect Admin Portal &bull; Secured System
          </span>
        </div>

      </div>
    </div>
  );
}
