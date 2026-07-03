import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockApi } from '../services/api';
import { Check, X, Edit, ArrowLeft, CheckSquare, Square } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Approval Checklist State
  const [checklist, setChecklist] = useState({
    status: false,
    salary: false,
    content: false,
    contact: false,
  });

  const loadJob = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getJobDetail(id);
      if (data.success) {
        setJob(data.job);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  const handleApprove = async () => {
    await mockApi.approveJob(id);
    loadJob();
  };

  const handleReject = async () => {
    await mockApi.rejectJob(id);
    loadJob();
  };

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm font-bold text-slate-400">Loading Job Submission Details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-4 text-center py-12">
        <p className="text-sm font-bold text-rose-500">Job Submission Not Found.</p>
        <Link to="/admin/jobs" className="text-xs font-bold text-[#065f46] hover:underline">← Back to Job Moderation</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Back arrow */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
        <Link to="/admin/jobs" className="hover:text-slate-600">Jobs</Link>
        <span>&gt;</span>
        <span className="capitalize">{job.status} Review</span>
        <span>&gt;</span>
        <span className="text-slate-600">Job ID #{job.id}</span>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800 leading-snug">{job.title}</h2>
          <div className="flex items-center gap-2">
            {job.status === 'pending' ? (
              <span className="bg-[#059669] text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                New Request
              </span>
            ) : (
              <span className={`text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${job.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {job.status}
              </span>
            )}
            <span className="text-[10px] font-bold text-slate-400">
              Submitted 2 hours ago by {job.creator?.full_name || 'Ahmed Khan'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="bg-white border border-[#e2e8f0] hover:bg-slate-50 text-slate-600 rounded-lg px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5">
            <Edit className="w-3.5 h-3.5" />
            Edit Before Publishing
          </button>
          
          {job.status !== 'rejected' && (
            <button onClick={handleReject} className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" />
              Reject Job
            </button>
          )}

          {job.status !== 'approved' && (
            <button onClick={handleApprove} className="bg-[#065f46] hover:bg-[#044e39] text-white rounded-lg px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
              <Check className="w-3.5 h-3.5" />
              Approve Job
            </button>
          )}
        </div>
      </div>

      {/* Grid Content splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Summary & Description */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Bar */}
          <div className="bg-white grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl border border-[#e2e8f0] shadow-sm text-left">
            <div className="space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Salary Range</span>
              <span className="font-outfit font-extrabold text-sm text-emerald-600 block">{job.salary || 'AED 5,000+'}</span>
            </div>
            <div className="border-l border-slate-100 pl-4 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Experience</span>
              <span className="font-outfit font-extrabold text-sm text-slate-700 block">{job.experience_range || '5+ Years'}</span>
            </div>
            <div className="border-l border-slate-100 pl-4 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Work Type</span>
              <span className="font-outfit font-extrabold text-sm text-slate-700 block">{job.job_type || 'Full-Time'}</span>
            </div>
            <div className="border-l border-slate-100 pl-4 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Location</span>
              <span className="font-outfit font-extrabold text-sm text-slate-700 block">{job.location || 'Dubai, UAE'}</span>
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-white p-7 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4 text-left">
            <h3 className="font-outfit font-extrabold text-base text-slate-800">Job Description</h3>
            <p className="text-slate-500 leading-relaxed text-xs font-semibold whitespace-pre-line">
              {job.description || `We are looking for a highly skilled and creative Executive Sous Chef to join our world-class culinary team at Grand Hyatt Dubai. The ideal candidate will assist the Executive Chef in managing the entire kitchen operation, ensuring the highest standards of food quality and service across all dining outlets.

              As the second-in-command, you will be responsible for menu development, cost control, staff training, and maintaining rigorous health and safety standards. This role requires a leader who can thrive in a fast-paced environment and inspire a diverse team of chefs.

              Key responsibilities include supervising food preparation, overseeing culinary staff performance, managing inventory and supply chains, and collaborating with the F&B management team to deliver exceptional guest experiences.`}
            </p>
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card 1: Employer profile summary */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden text-left">
            <div className="h-16 bg-[#a7f3d0]/60 relative"></div>
            <div className="px-6 pb-6 relative">
              
              {/* Overlapping logo square */}
              <div className="w-14 h-14 bg-white border border-[#e2e8f0] rounded-xl flex items-center justify-center p-2 shadow-sm -mt-7 mb-3 overflow-hidden">
                <span className="text-xl">🏢</span>
              </div>

              <h4 className="font-outfit font-extrabold text-base text-slate-800">{job.company || 'Grand Hyatt'}</h4>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] font-bold text-[#059669]">
                <span>✓</span>
                <span>Verified Premium Employer</span>
              </div>

              <div className="mt-5 space-y-3.5 text-xs font-semibold text-slate-500 border-t border-slate-50 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Primary Contact</span>
                  <span className="text-slate-800 font-bold">{job.creator?.full_name || 'Ahmed Khan'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Contact Email</span>
                  <span className="text-[#059669] font-bold truncate max-w-[150px]">{job.creator?.email || 'ahmed.k@hyatt.com'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Location</span>
                  <span className="text-slate-800 font-bold">{job.location || 'Dubai Healthcare City'}</span>
                </div>
              </div>

              <button className="w-full mt-5 bg-[#eff6ff] hover:bg-blue-100 text-blue-600 rounded-lg py-2.5 text-xs font-bold transition-all text-center">
                View Employer Profile
              </button>
            </div>
          </div>

          {/* Card 2: Spacer banner */}
          <div className="h-4 bg-slate-50 border border-[#e2e8f0] border-dashed rounded-xl"></div>

          {/* Card 3: Checklist */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm text-left space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-base">📋</span>
              <h4 className="font-outfit font-extrabold text-sm text-slate-800">Approval Checklist</h4>
            </div>

            <div className="space-y-3 pt-1">
              {/* Item 1 */}
              <button onClick={() => toggleCheck('status')} className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-slate-600 transition-colors">
                {checklist.status ? <CheckSquare className="w-4 h-4 text-[#059669]" /> : <Square className="w-4 h-4 text-slate-300" />}
                <span>Employer status verified</span>
              </button>

              {/* Item 2 */}
              <button onClick={() => toggleCheck('salary')} className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-slate-600 transition-colors">
                {checklist.salary ? <CheckSquare className="w-4 h-4 text-[#059669]" /> : <Square className="w-4 h-4 text-slate-300" />}
                <span>Salary range meets guidelines</span>
              </button>

              {/* Item 3 */}
              <button onClick={() => toggleCheck('content')} className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-slate-600 transition-colors">
                {checklist.content ? <CheckSquare className="w-4 h-4 text-[#059669]" /> : <Square className="w-4 h-4 text-slate-300" />}
                <span>Content clear and professional</span>
              </button>

              {/* Item 4 */}
              <button onClick={() => toggleCheck('contact')} className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-slate-600 transition-colors">
                {checklist.contact ? <CheckSquare className="w-4 h-4 text-[#059669]" /> : <Square className="w-4 h-4 text-slate-300" />}
                <span>Contact information valid</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
