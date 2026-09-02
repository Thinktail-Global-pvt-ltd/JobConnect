import React, { useState } from 'react';
import { ShieldCheck, Info, Key, Lock } from 'lucide-react';
import { mockApi } from '../services/api';

export default function Settings() {
  const [platformName, setPlatformName] = useState('JobRito');
  const [communityName, setCommunityName] = useState('Hospitality Elite');
  const [supportNum, setSupportNum] = useState('+91 (800) 555-JOBRITO');
  const [supportEmail, setSupportEmail] = useState('support@jobrito.com');
  const [description, setDescription] = useState('The premier digital workspace for hospitality professionals, connecting top-tier culinary and service talent with world-class employers through referral networks and specialized training programs.');

  // Toggles status
  const [referral, setReferral] = useState(true);
  const [training, setTraining] = useState(true);
  const [chefConnect, setChefConnect] = useState(false);

  // Admin Change Password State
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [submittingPwd, setSubmittingPwd] = useState(false);
  const [pwdStatus, setPwdStatus] = useState({ type: '', msg: '' });

  const handleSave = () => {
    alert("Platform configuration saved successfully!");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pwdData.currentPassword || !pwdData.newPassword || !pwdData.confirmPassword) {
      setPwdStatus({ type: 'error', msg: 'Please fill in all password fields.' });
      return;
    }
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setPwdStatus({ type: 'error', msg: 'New password and confirm password do not match.' });
      return;
    }

    setSubmittingPwd(true);
    setPwdStatus({ type: '', msg: '' });

    try {
      const res = await mockApi.changeAdminPassword(pwdData.currentPassword, pwdData.newPassword, pwdData.confirmPassword);
      if (res && res.success) {
        setPwdStatus({ type: 'success', msg: res.message || 'Admin password updated successfully!' });
        setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPwdStatus({ type: 'error', msg: res?.message || 'Failed to update admin password.' });
      }
    } catch (err) {
      console.error('Password change error:', err);
      setPwdStatus({ type: 'error', msg: 'An error occurred while updating the password.' });
    } finally {
      setSubmittingPwd(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header title & save action button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Platform Settings</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Configure the core identity, admin security, and global feature toggles for the JobRito ecosystem.</p>
        </div>

        <button onClick={handleSave} className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-5 py-2.5 text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all flex items-center gap-1.5 self-stretch md:self-auto justify-center">
          <ShieldCheck className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Main configuration split (2/3 left, 1/3 right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Form Controls (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
              <span>⚙️</span> Platform Configuration
            </h3>

            {/* Platform name and Community name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Platform Name</label>
                <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)}
                       className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Community Name</label>
                <input type="text" value={communityName} onChange={(e) => setCommunityName(e.target.value)}
                       className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all" />
              </div>
            </div>

            {/* Support Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Support Number</label>
                <input type="text" value={supportNum} onChange={(e) => setSupportNum(e.target.value)}
                       className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Support Email</label>
                <input type="text" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)}
                       className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all" />
              </div>
            </div>

            {/* Community description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Community Description</label>
              <textarea value={description} rows={4} onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all leading-relaxed" />
            </div>
          </div>

          {/* Admin Change Password Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
              <span>🔑</span> Change Admin Password
            </h3>

            {pwdStatus.msg && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                pwdStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {pwdStatus.msg}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Current Admin Password *</label>
                <input 
                  type="password"
                  required
                  placeholder="Enter current password (default: 123456)"
                  value={pwdData.currentPassword}
                  onChange={(e) => setPwdData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">New Admin Password *</label>
                  <input 
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={pwdData.newPassword}
                    onChange={(e) => setPwdData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Confirm New Password *</label>
                  <input 
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={pwdData.confirmPassword}
                    onChange={(e) => setPwdData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submittingPwd}
                  className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-5 py-2.5 text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  {submittingPwd ? 'Updating Password...' : 'Update Admin Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Feature Controls (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card 1: Community Controls Toggles */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
              <span>🎨</span> Community Controls
            </h3>

            {/* Toggles items list */}
            <div className="space-y-4 pt-1">
              
              {/* Toggle 1 */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-85 text-slate-800 leading-tight">Referral Posts</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Allow users to share internal opportunities</span>
                </div>
                <button onClick={() => setReferral(prev => !prev)} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${referral ? 'bg-[#eff6ff] border-blue-200 text-blue-600 font-extrabold' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                  {referral ? '✓' : ''}
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex justify-between items-start gap-4 border-t border-slate-50 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-85 text-slate-800 leading-tight">Training & Overseas</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Enable educational and global posts</span>
                </div>
                <button onClick={() => setTraining(prev => !prev)} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${training ? 'bg-[#eff6ff] border-blue-200 text-blue-600 font-extrabold' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                  {training ? '✓' : ''}
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex justify-between items-start gap-4 border-t border-slate-50 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-85 text-slate-800 leading-tight">ChefConnect Posts</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Display specialized culinary network feed</span>
                </div>
                <button onClick={() => setChefConnect(prev => !prev)} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${chefConnect ? 'bg-[#eff6ff] border-blue-200 text-blue-600 font-extrabold' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                  {chefConnect ? '✓' : ''}
                </button>
              </div>

            </div>
          </div>

          {/* Card 3: Danger Zone (Purge All Users & Sessions) */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 text-left space-y-3">
            <h4 className="font-outfit font-extrabold text-xs text-rose-900 flex items-center gap-1.5">
              <span>⚠️</span> Danger Zone
            </h4>
            <p className="text-[11px] font-semibold text-rose-700 leading-relaxed">
              Permanently wipe all registered users from the database, invalidate active user sessions, clear personal access tokens, and delete notification histories.
            </p>
            <button
              type="button"
              onClick={async () => {
                if (!window.confirm("⚠️ DANGER: Permanently delete ALL users, sessions, personal access tokens, and notification history from database?")) return;
                if (window.prompt("Type DELETE to confirm wiping all users & sessions:") !== 'DELETE') {
                  alert("Canceled.");
                  return;
                }
                try {
                  const res = await fetch('/api/admin/users/delete-all', { method: 'POST', headers: { 'Accept': 'application/json' } });
                  const data = await res.json();
                  if (data?.success) {
                    alert(`Success: ${data.message}`);
                  } else {
                    alert(`Error: ${data?.message || 'Failed to delete users'}`);
                  }
                } catch (e) {
                  alert('Error executing request.');
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose-700"
            >
              <span>Delete All Users, Sessions & Tokens</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
