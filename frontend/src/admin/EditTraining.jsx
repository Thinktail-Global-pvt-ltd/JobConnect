import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, ChevronRight, Check } from 'lucide-react';

export default function EditTraining() {
  const navigate = useNavigate();
  const [name, setName] = useState('Executive Culinary Arts & Global Placement');
  const [desc, setDesc] = useState('Master advanced techniques in modern European cuisine with guaranteed placement in 5-star Michelin partner hotels across France and the UAE. This intensive program bridges the gap between academic learning and high-end industry standards.');
  const [duration, setDuration] = useState('6 Months Professional Placement');
  const [countries, setCountries] = useState('France, UAE');

  const handleSave = () => {
    alert("Changes saved successfully!");
    navigate('/admin/training');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top action row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Edit Training Program</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Configure global hospitality placement and specialized training courses.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/admin/training" className="bg-white border border-[#e2e8f0] hover:bg-slate-50 text-slate-600 rounded-lg px-5 py-2.5 text-xs font-bold transition-all shadow-sm">
            Discard
          </Link>
          <button onClick={handleSave} className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-5 py-2.5 text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all">
            Save Changes
          </button>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side Form Fields (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Program Details */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-3">
              <span>📝</span> Program Details
            </h3>

            {/* Input name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Program Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                     className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all" />
            </div>

            {/* Drag & Drop box */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Banner Image</label>
              <div className="border border-dashed border-slate-200 rounded-xl p-8 bg-[#f8f9fc] hover:bg-slate-50/50 transition-all flex flex-col items-center justify-center text-center cursor-pointer">
                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-600">Drag and drop or <span className="text-[#059669] hover:underline">upload</span></p>
                <span className="text-[9px] font-bold text-slate-400 mt-1">Recommended size: 1200×600px (JPG, PNG)</span>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Description</label>
              <textarea value={desc} rows={5} onChange={(e) => setDesc(e.target.value)}
                        className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all leading-relaxed" />
            </div>
          </div>

          {/* Card 2: Deployment & Logistics */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-3">
              <span>🌍</span> Deployment & Logistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Training Duration */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Training Duration</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all">
                  <option>6 Months Professional Placement</option>
                  <option>12 Months Premium Internship</option>
                  <option>18 Months Executive Training</option>
                  <option>24 Months Leadership Program</option>
                </select>
              </div>

              {/* Deployment Countries */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Deployment Countries</label>
                <input type="text" value={countries} onChange={(e) => setCountries(e.target.value)}
                       className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#059669] focus:bg-white transition-all" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side Phone Shell Preview (1/3) */}
        <div className="lg:col-span-1 flex flex-col items-center gap-4">
          
          {/* Phone Shell container */}
          <div className="w-[280px] h-[540px] bg-slate-900 rounded-[36px] p-3 shadow-2xl border-4 border-slate-800 relative overflow-hidden flex flex-col justify-between">
            <div className="bg-white h-full rounded-[26px] overflow-hidden flex flex-col justify-between relative text-left">
              
              {/* Top banner image representation */}
              <div className="h-32 bg-gradient-to-br from-emerald-100 to-teal-200 relative p-4 flex flex-col justify-end">
                {/* Notch top bar */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-b-xl flex items-center justify-between px-3 text-[7px] text-white font-mono font-bold leading-none">
                  <span>9:41</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                  <span>📶🔋</span>
                </div>

                <span className="bg-emerald-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider self-start mb-1.5 leading-none">
                  ENROLLING NOW
                </span>
                <h4 className="font-outfit font-extrabold text-[12px] text-slate-800 leading-tight block drop-shadow-sm truncate">
                  {name || 'Executive Culinary Arts'}
                </h4>
              </div>

              {/* Quick Info Duration & Location */}
              <div className="grid grid-cols-2 gap-2 bg-[#f8f9fc] border-y border-slate-100 p-2.5 text-center">
                <div className="space-y-0.5">
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest block">Duration</span>
                  <span className="text-[9px] font-bold text-slate-700 block truncate">{duration.split(' ')[0]} Months</span>
                </div>
                <div className="border-l border-slate-100 space-y-0.5">
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest block">Location</span>
                  <span className="text-[9px] font-bold text-slate-700 block truncate">{countries || 'France & UAE'}</span>
                </div>
              </div>

              {/* About description */}
              <div className="flex-grow p-3 space-y-3 overflow-y-auto custom-scrollbar text-[9px] text-slate-500 font-semibold leading-relaxed">
                <div>
                  <h5 className="font-extrabold text-slate-700 text-[10px] mb-1">About Program</h5>
                  <p className="line-clamp-4">{desc}</p>
                </div>

                {/* Key Benefits */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100/50">
                  <h5 className="font-extrabold text-slate-700 text-[10px] mb-1">Key Benefits</h5>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[7px]">✓</div>
                    <span>Guaranteed Overseas Placement</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[7px]">✓</div>
                    <span>Michelin Star Certifications</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[7px]">✓</div>
                    <span>Travel & Visa Assistance</span>
                  </div>
                </div>
              </div>

              {/* Submit button on bottom */}
              <div className="p-3 border-t border-slate-50 bg-white">
                <button className="w-full bg-[#059669] text-white rounded-lg py-2 text-[10px] font-bold shadow-sm block text-center">
                  Apply for Program
                </button>
              </div>

            </div>
          </div>

          {/* Badge below phone mockup */}
          <span className="bg-[#eff6ff] border border-blue-100 text-blue-700 rounded-full px-3 py-1 text-[10px] font-extrabold flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Preview Active
          </span>

        </div>

      </div>
    </div>
  );
}
