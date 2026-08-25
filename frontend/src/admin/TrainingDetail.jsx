import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Globe, Clock, Building2, BookOpen, Sparkles, Award, Pin, 
  CheckCircle2, Ban, Trash2, ArrowLeft, Check, Edit, FileText, MapPin, Briefcase, ChevronLeft,
  User, Phone, Mail, Copy, X, ShieldCheck, Users
} from 'lucide-react';
import axios from 'axios';
import { mockApi, realApi } from '../services/api';

export default function TrainingDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [program, setProgram] = useState(location.state?.program || null);
  const [loading, setLoading] = useState(!location.state?.program);
  const [copiedId, setCopiedId] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    curriculum: '',
    duration: '',
    employer_details: '',
    countries: '',
    skills_covered: '',
    benefits: '',
    placement_opportunities: '',
    status: 'Published',
    is_pinned: false,
  });

  const fetchProgramDetail = async () => {
    setLoading(!program);
    let found = null;

    try {
      const res = await mockApi.getTrainingPrograms();
      if (res && res.programs) {
        found = res.programs.find(p => String(p.id) === String(id));
      }
    } catch (e) {}

    if (!found) {
      const endpoints = [
        `/api/admin/training/${id}`,
        `/backend/api/admin/training/${id}`
      ];
      for (const ep of endpoints) {
        try {
          const res = await axios.get(ep, { headers: { Accept: 'application/json' } });
          if (res.data && (res.data.program || res.data.data)) {
            found = res.data.program || res.data.data;
            break;
          }
        } catch (err) {}
      }
    }

    if (found) {
      setProgram(found);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProgramDetail();
  }, [id]);

  const handleTogglePublish = async () => {
    if (!program) return;
    const isCurrentlyPublished = (program.status || '').toLowerCase() === 'published' || (program.status || '').toLowerCase() === 'active';
    const newStatus = isCurrentlyPublished ? 'Draft' : 'Published';
    
    setProgram({ ...program, status: newStatus });
    alert(`Program status updated to: ${newStatus}`);

    try {
      await mockApi.updateTrainingStatus(program.id, newStatus);
    } catch (e) {}
  };

  const handleTogglePin = async () => {
    if (!program) return;
    const newPinned = !program.is_pinned;
    setProgram({ ...program, is_pinned: newPinned });
    alert(newPinned ? "Training program pinned to top!" : "Training program unpinned!");

    try {
      await mockApi.togglePinTraining(program.id);
    } catch (e) {}
  };

  const handleDeleteProgram = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this training program?")) return;
    try {
      await mockApi.deleteTrainingProgram(id);
      alert("Training program deleted successfully.");
      navigate('/admin/training');
    } catch (e) {
      alert("Failed to delete program: " + e.message);
    }
  };

  const handleCopyProgramId = () => {
    if (!program) return;
    const pId = `TRN-${String(program.id).padStart(6, '0')}`;
    navigator.clipboard.writeText(pId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleOpenEditModal = () => {
    if (!program) return;
    const countriesStr = Array.isArray(program.countries) 
      ? program.countries.join(', ') 
      : (program.countries || '');

    setEditForm({
      name: program.name || '',
      curriculum: program.curriculum || '',
      duration: program.duration || '',
      employer_details: program.employer_details || '',
      countries: countriesStr,
      skills_covered: program.skills_covered || '',
      benefits: program.benefits || '',
      placement_opportunities: program.placement_opportunities || '',
      status: program.status || 'Published',
      is_pinned: Boolean(program.is_pinned),
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEditForm = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedData = {
        ...program,
        ...editForm,
        countries: editForm.countries.split(',').map(c => c.trim()).filter(Boolean),
      };

      setProgram(updatedData);
      setIsEditModalOpen(false);
      alert("Training program details updated successfully!");

      try {
        await mockApi.updateTrainingProgram(program.id, updatedData);
      } catch (err) {}
    } catch (err) {
      alert("Failed to update program details: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Utility helper to validate whether a field value should be displayed
  const isValidField = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const trimmed = val.trim().toLowerCase();
      if (
        trimmed === '' || 
        trimmed === 'n/a' || 
        trimmed === 'x' || 
        trimmed === 'none' || 
        trimmed === 'null' || 
        trimmed === 'undefined' ||
        trimmed === 'no' ||
        trimmed === 'false'
      ) return false;
      return true;
    }
    if (Array.isArray(val)) {
      return val.filter(v => isValidField(v)).length > 0;
    }
    return true;
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs font-semibold">
        Loading training program details...
      </div>
    );
  }

  if (!program) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-500 font-medium">Training program not found.</p>
        <Link to="/admin/training" className="inline-flex items-center gap-2 text-sm font-bold text-[#153e69] hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Training & Placement Directory
        </Link>
      </div>
    );
  }

  const name = program.name || program.title || `Training Program #${program.id}`;
  const curriculum = program.curriculum || '';
  const duration = program.duration || '';
  const employerDetails = program.employer_details || program.provider || program.company || '';
  const countriesList = Array.isArray(program.countries) 
    ? program.countries.filter(c => isValidField(c)) 
    : (typeof program.countries === 'string' ? program.countries.split(',').map(c => c.trim()).filter(c => isValidField(c)) : []);

  const skillsCovered = program.skills_covered || '';
  const benefits = program.benefits || '';
  const placementOpportunities = program.placement_opportunities || '';
  
  const isPublished = (program.status || '').toLowerCase() === 'published' || (program.status || '').toLowerCase() === 'active';
  const isPinned = Boolean(program.is_pinned);
  const formattedId = `TRN-${String(program.id).padStart(6, '0')}`;
  const createdDateStr = program.created_at ? new Date(program.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 25, 2026';

  return (
    <div className="space-y-6 text-left pb-12">
      
      {/* Top Header Bar with Breadcrumb and Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div className="space-y-1">
          <Link 
            to="/admin/training" 
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#153e69] hover:text-blue-800 transition-colors mb-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Training & Placement
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="font-outfit font-extrabold text-2xl text-slate-900 tracking-tight">
              Training Program Specifications
            </h1>
            <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
              isPublished ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}>
              {isPublished ? 'Published' : 'Draft / In Review'}
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button 
            onClick={() => navigate(`/admin/applications?training_id=${id}&type=training`, { state: { trainingId: id } })}
            className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-4 py-2 text-xs font-extrabold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>View Applicants</span>
          </button>

          <button 
            onClick={handleOpenEditModal}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl px-4 py-2 text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Edit className="w-4 h-4 text-[#f58220]" />
            Edit Program Details
          </button>

          <button 
            onClick={handleTogglePin}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              isPinned ? 'bg-purple-600 text-white border border-purple-600' : 'bg-white border border-purple-200 text-purple-700 hover:bg-purple-50'
            }`}
          >
            <Pin className="w-4 h-4" />
            <span>{isPinned ? 'Unpin Program' : 'Pin Program'}</span>
          </button>
          
          <button 
            onClick={handleTogglePublish} 
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              isPublished 
                ? 'bg-white border border-rose-300 hover:bg-rose-50 text-rose-600' 
                : 'bg-[#065f46] hover:bg-[#044e39] text-white'
            }`}
          >
            {isPublished ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{isPublished ? 'Unpublish (Draft)' : 'Publish Program'}</span>
          </button>

          <button
            onClick={handleDeleteProgram}
            className="p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Delete Program"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Profile Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          
          {/* Icon Box */}
          <div className="w-20 h-20 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-3xl font-black text-purple-700 shrink-0 shadow-2xs">
            <GraduationCap className="w-10 h-10 text-purple-700" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-outfit font-extrabold text-2xl text-slate-900 leading-tight">{name}</h2>
            
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 flex-wrap">
              <span>Program ID: <strong className="text-slate-800">{formattedId}</strong></span>
              <button 
                onClick={handleCopyProgramId} 
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Copy Program ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1 flex-wrap text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 font-extrabold">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> {employerDetails || 'Provider N/A'}
              </span>

              <span className="text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg text-xs font-extrabold border border-purple-200 inline-flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" /> Training & Placement
              </span>

              {countriesList.length > 0 && (
                <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg text-xs font-extrabold border border-blue-200 inline-flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-600" /> {countriesList.join(', ')}
                </span>
              )}

              <Link 
                to={`/admin/applications?training_id=${id}&type=training`}
                state={{ trainingId: id }}
                className="text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg text-xs font-extrabold border border-emerald-200 inline-flex items-center gap-1.5 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-emerald-600" /> View Program Applicants
              </Link>

              {isPinned && (
                <span className="text-purple-800 bg-purple-100 px-2.5 py-1 rounded-lg text-xs font-extrabold border border-purple-300 inline-flex items-center gap-1">
                  <Pin className="w-3.5 h-3.5 text-purple-600" /> Pinned
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Quick Provider & Date Card (Right Side) */}
        <div className="bg-slate-50/70 border border-slate-100 p-4 px-6 rounded-2xl md:min-w-[260px] text-left space-y-2">
          <div className="flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-extrabold text-slate-800">Provider & Submission Info</span>
          </div>

          <div className="space-y-1.5 text-xs font-semibold text-slate-600">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400 text-[11px]">Provider / Employer</span>
              <span className="text-slate-900 font-extrabold">{employerDetails}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400 text-[11px]">Training Duration</span>
              <span className="text-slate-900 font-mono font-extrabold">{duration}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400 text-[11px]">Created Date</span>
              <span className="text-slate-800 font-extrabold">{createdDateStr}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Listing Properties Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4 flex-wrap text-xs font-bold text-slate-700">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Listing Properties:</span>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-3 py-1 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border-blue-200">
            Training & Overseas Feed
          </span>
          {isPinned && (
            <span className="px-3 py-1 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border-purple-200">
              ✓ Pinned Listing
            </span>
          )}
          <span className={`px-3 py-1 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1.5 capitalize ${
            isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            Status: {isPublished ? 'Published' : 'Draft / In Review'}
          </span>
        </div>
      </div>

      {/* 3-Column Main Grid Section (Matching Job Detail UI) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Column 1: Complete Program Specifications (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
          <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <GraduationCap className="w-4.5 h-4.5 text-purple-600" /> Complete Program Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-semibold">
            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Program Title</span>
              <span className="font-outfit font-extrabold text-sm text-slate-900 block">{name}</span>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Curriculum / Subject</span>
              <span className="font-outfit font-extrabold text-sm text-slate-900 block">{curriculum}</span>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Provider / Institution</span>
              <span className="font-outfit font-extrabold text-sm text-slate-900 block">{employerDetails}</span>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Primary Feed Category</span>
              <span className="font-outfit font-extrabold text-sm text-slate-900 block">Training & Placement</span>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Training Duration</span>
              <span className="font-outfit font-extrabold text-sm text-slate-900 block">{duration}</span>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Deployment Countries</span>
              <span className="font-outfit font-extrabold text-sm text-slate-900 block">{countriesList.join(', ')}</span>
            </div>

            {/* Mint Green Highlight Box: Benefits & Placement */}
            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1 sm:col-span-2">
              <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest block">Training Benefits & Fee Details</span>
              <div className="pt-0.5">
                <span className="font-outfit font-extrabold text-sm text-emerald-900 block">
                  {benefits}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5 sm:col-span-2">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Skills & Curriculum Covered</span>
              <span className="font-outfit font-extrabold text-sm text-slate-800 block">{skillsCovered}</span>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-0.5 sm:col-span-2">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Placement & International Opportunities</span>
              <span className="font-outfit font-extrabold text-sm text-slate-800 block">{placementOpportunities}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Provider Details (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
          <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building2 className="w-4.5 h-4.5 text-slate-500" /> Employer / Provider Details
          </h3>

          <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100/70 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-white rounded-xl border border-emerald-200 flex items-center justify-center text-xl shadow-xs shrink-0">
                🏫
              </div>
              <div>
                <h4 className="font-outfit font-extrabold text-base text-slate-900 leading-snug">{employerDetails}</h4>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Provider Account
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold border-t border-emerald-100/80 pt-3 text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Business / Agency</span>
                <span className="font-extrabold text-slate-900">{employerDetails}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Primary Contact</span>
                <span className="font-extrabold text-slate-900">{employerDetails}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Deployment Location</span>
                <span className="font-extrabold text-slate-900">{countriesList.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Program Overview & Moderation Log (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Program Overview Box */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-3">
            <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-slate-500" /> Program Overview
            </h3>
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-700 leading-relaxed">
              {curriculum || program.description || 'No detailed overview provided.'}
            </div>
          </div>

          {/* Moderation Log Timeline Box */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h3 className="font-outfit font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-slate-500" /> Moderation Log
            </h3>

            <div className="space-y-4 text-xs font-semibold relative pl-4 border-l-2 border-slate-100">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[21px] top-1 ring-4 ring-white" />
                <span className="text-[10px] font-extrabold text-slate-400 block">{createdDateStr}</span>
                <span className="text-slate-900 font-extrabold block">Program created & submitted for review</span>
              </div>

              <div className="relative">
                <div className={`w-2.5 h-2.5 rounded-full absolute -left-[21px] top-1 ring-4 ring-white ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-[10px] font-extrabold text-slate-400 block">Recently</span>
                <span className="text-slate-900 font-extrabold block">
                  {isPublished ? 'Program approved & published live' : 'Program set to Draft / In Review'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Program Details Modal (Matching Edit Job Modal) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Edit className="w-5 h-5" />
                </div>
                <h3 className="font-outfit font-extrabold text-lg text-slate-900">Edit Training Program Details</h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditForm} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Program Name / Title *</label>
                  <input 
                    type="text" 
                    required
                    value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-purple-600 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Curriculum / Subject *</label>
                  <input 
                    type="text" 
                    required
                    value={editForm.curriculum} 
                    onChange={e => setEditForm({...editForm, curriculum: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-purple-600 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Provider / Employer Details *</label>
                  <input 
                    type="text" 
                    required
                    value={editForm.employer_details} 
                    onChange={e => setEditForm({...editForm, employer_details: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-purple-600 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Training Duration *</label>
                  <input 
                    type="text" 
                    required
                    value={editForm.duration} 
                    onChange={e => setEditForm({...editForm, duration: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-purple-600 outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Deployment Countries (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={editForm.countries} 
                    onChange={e => setEditForm({...editForm, countries: e.target.value})}
                    placeholder="e.g. Saudi Arabia, UAE, Qatar, India"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-purple-600 outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Skills Covered</label>
                  <textarea 
                    rows={2}
                    value={editForm.skills_covered} 
                    onChange={e => setEditForm({...editForm, skills_covered: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-purple-600 outline-none transition-all resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Training Benefits & Fee Structure</label>
                  <textarea 
                    rows={2}
                    value={editForm.benefits} 
                    onChange={e => setEditForm({...editForm, benefits: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-purple-600 outline-none transition-all resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Placement & International Opportunities</label>
                  <textarea 
                    rows={2}
                    value={editForm.placement_opportunities} 
                    onChange={e => setEditForm({...editForm, placement_opportunities: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-purple-600 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Program Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
