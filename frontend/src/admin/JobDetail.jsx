import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockApi } from '../services/api';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleTogglePin = async () => {
    await mockApi.togglePinJob(id);
    loadJob();
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
        <Link to="/admin/jobs" className="text-xs font-bold text-brand-600 hover:underline">← Back to Job Moderation</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <Link to="/admin/jobs" className="bg-white hover:bg-slate-50 border border-slate-100 text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-2 transition-colors">
          ← Back to Job Moderation
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6 relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-brand-50 text-brand-600 border border-brand-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  {job.category}
                </span>
                {job.status === 'approved' ? (
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    Active / Approved
                  </span>
                ) : job.status === 'rejected' ? (
                  <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    Rejected
                  </span>
                ) : (
                  <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                    Pending Review
                  </span>
                )}
              </div>
              
              <h2 className="font-outfit font-extrabold text-2xl text-slate-800">{job.title}</h2>
              
              <p className="text-xs font-semibold text-slate-400">
                Submitted by <span className="text-slate-600 font-bold">{job.creator?.full_name || 'Employer'}</span> ({job.creator?.mobile_number})
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100 bg-slate-50/20 px-4 rounded-xl">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Salary Range</span>
                <span className="font-outfit font-extrabold text-lg text-emerald-600 block mt-1">{job.salary || 'Not Disclosed'}</span>
              </div>
              <div className="border-x border-slate-100 px-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
                <span className="font-outfit font-extrabold text-lg text-slate-700 block mt-1">{job.experience_range || 'Not Specified'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Work Type</span>
                <span className="font-outfit font-extrabold text-lg text-brand-600 block mt-1">{job.job_type || 'Full-time'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-outfit font-extrabold text-base text-slate-800">Job Description</h3>
              <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">{job.description}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <h3 className="font-outfit font-extrabold text-base text-slate-800">Key Requirements</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2 leading-relaxed">
                {Array.isArray(job.requirements) && job.requirements.length > 0 ? (
                  job.requirements.map((req, i) => <li key={i}>{req}</li>)
                ) : (
                  <li>No specific requirements listed.</li>
                )}
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <h3 className="font-outfit font-extrabold text-base text-slate-800">Benefits & Perks</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2 leading-relaxed">
                {Array.isArray(job.benefits) && job.benefits.length > 0 ? (
                  job.benefits.map((ben, i) => <li key={i}>{ben}</li>)
                ) : (
                  <li>No specific benefits listed.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-50 pb-3">Moderation Actions</h3>
            
            <div className="space-y-3 pt-1">
              {job.status !== 'approved' && (
                <button onClick={handleApprove} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 text-xs font-bold shadow-sm shadow-emerald-500/10 transition-all hover:-translate-y-0.5">
                  ✓ Approve Job Posting
                </button>
              )}

              {job.status !== 'rejected' && (
                <button onClick={handleReject} className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-3 text-xs font-bold shadow-sm shadow-rose-500/10 transition-all hover:-translate-y-0.5">
                  ✕ Reject Job Posting
                </button>
              )}

              {job.status === 'approved' && (
                <button onClick={handleTogglePin} className="w-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-600 rounded-xl py-3 text-xs font-bold transition-all">
                  {job.is_pinned ? 'Unpin from Top' : '📌 Pin to Top'}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-50 pb-3">Posting Details</h3>
            
            <div className="space-y-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-3">
                <span className="text-base">🏢</span>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Company</span>
                  <span className="text-slate-700 font-bold mt-0.5 block">{job.company}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base">📍</span>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Location</span>
                  <span className="text-slate-700 font-bold mt-0.5 block">{job.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base">📧</span>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Contact Info</span>
                  <span className="text-slate-700 font-bold mt-0.5 block">{job.contact_info}</span>
                </div>
              </div>

              {job.category === 'overseas' && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-base">🌍</span>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Visa Assistance</span>
                      <span className="text-slate-700 font-bold mt-0.5 block">{job.visa_assistance ? 'Yes, Available' : 'No'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base">🏠</span>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Accommodation</span>
                      <span className="text-slate-700 font-bold mt-0.5 block">{job.accommodation_available ? 'Yes, Included' : 'No'}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
