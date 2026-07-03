import React, { useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function Settings() {
  const [platformName, setPlatformName] = useState('JobConnect');
  const [communityName, setCommunityName] = useState('Hospitality Elite');
  const [supportNum, setSupportNum] = useState('+1 (800) 555-JOBS');
  const [supportEmail, setSupportEmail] = useState('support@jobconnect.hospitality');
  const [description, setDescription] = useState('The premier digital workspace for hospitality professionals, connecting top-tier culinary and service talent with world-class employers through referral networks and specialized training programs.');

  // Toggles status
  const [referral, setReferral] = useState(true);
  const [training, setTraining] = useState(true);
  const [chefConnect, setChefConnect] = useState(false);

  const handleSave = () => {
    alert("Platform configuration saved successfully!");
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header title & save action button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Platform Settings</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Configure the core identity and global feature toggles for the JobConnect ecosystem.</p>
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
              <textarea value={description} rows={5} onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all leading-relaxed" />
            </div>
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

          {/* Card 2: Pro Tip alert box */}
          <div className="bg-[#eff6ff] border border-blue-15 border-blue-100 rounded-2xl p-5 text-left flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-outfit font-extrabold text-xs text-slate-800">Pro Tip</h4>
              <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">
                Disabling these features will hide the respective tabs from the public user dashboard and restrict new content creation.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
