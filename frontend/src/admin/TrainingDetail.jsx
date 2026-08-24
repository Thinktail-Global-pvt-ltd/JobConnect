import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Globe, Clock, Building2, BookOpen, Sparkles, Award, Pin, 
  CheckCircle2, Ban, Trash2, ArrowLeft, Check, Edit, FileText, MapPin, Briefcase, ChevronLeft 
} from 'lucide-react';
import axios from 'axios';
import { mockApi, realApi } from '../services/api';

export default function TrainingDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [program, setProgram] = useState(location.state?.program || null);
  const [loading, setLoading] = useState(!location.state?.program);
  const [isPublished, setIsPublished] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

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
      const st = (found.status || '').toLowerCase();
      setIsPublished(st === 'published' || st === 'active');
      setIsPinned(Boolean(found.is_pinned));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProgramDetail();
  }, [id]);

  const handleTogglePublish = async () => {
    if (!program) return;
    const newStatus = isPublished ? 'Draft' : 'Published';
    setIsPublished(!isPublished);
    setProgram({ ...program, status: newStatus });
    try {
      await mockApi.updateTrainingStatus(program.id, newStatus);
    } catch (e) {}
  };

  const handleTogglePin = async () => {
    if (!program) return;
    setIsPinned(!isPinned);
    setProgram({ ...program, is_pinned: !isPinned });
    try {
      await mockApi.togglePinTraining(program.id);
    } catch (e) {}
  };

  const handleDeleteProgram = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this training program?")) return;
    try {
      await mockApi.deleteTrainingProgram(id);
      navigate('/admin/training');
    } catch (e) {
      alert("Failed to delete program: " + e.message);
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
        Loading program details...
      </div>
    );
  }

  if (!program) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-500 font-medium">Training program not found.</p>
        <Link to="/admin/training" className="inline-flex items-center gap-2 text-sm font-bold text-[#153e69] hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Training & Overseas Directory
        </Link>
      </div>
    );
  }

  const name = program.name || 'Training Opportunity';
  const curriculum = program.curriculum || '';
  const duration = program.duration || '';
  const employerDetails = program.employer_details || '';
  const countriesList = Array.isArray(program.countries) 
    ? program.countries.filter(c => isValidField(c)) 
    : (typeof program.countries === 'string' ? program.countries.split(',').map(c => c.trim()).filter(c => isValidField(c)) : []);
  
  const skillsCovered = program.skills_covered || '';
  const benefits = program.benefits || '';
  const placementOpportunities = program.placement_opportunities || '';

  const hasCurriculum = isValidField(curriculum);
  const hasDuration = isValidField(duration);
  const hasEmployer = isValidField(employerDetails);
  const hasCountries = countriesList.length > 0;
  const hasSkills = isValidField(skillsCovered);
  const hasBenefits = isValidField(benefits);
  const hasPlacement = isValidField(placementOpportunities);

  const hasRightSideContent = hasSkills || hasBenefits || hasPlacement;

  return (
    <div className="space-y-6 text-left pb-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 flex-wrap">
        <Link to="/admin/training" className="hover:text-slate-600">Training & Overseas</Link>
        <span className="text-slate-300">&gt;</span>
        <span className="text-slate-600">Program Detail</span>
      </div>

      {/* Header Profile Summary Block */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="flex items-center gap-4.5">
          {/* Graduation Icon Badge */}
          <div className="w-14 h-14 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl flex items-center justify-center text-2xl shadow-xs shrink-0">
            <GraduationCap className="w-7 h-7 text-purple-700" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-outfit font-extrabold text-xl text-slate-800 leading-none">{name}</h2>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                isPublished ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {isPublished ? 'Published' : 'Draft / In Review'}
              </span>
              {isPinned && (
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <Pin className="w-3 h-3" /> Pinned
                </span>
              )}
            </div>
            
            <p className="text-xs font-bold text-slate-400 flex items-center gap-2 flex-wrap">
              {hasCountries && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{countriesList.join(', ')}</span>
                </span>
              )}
              {hasDuration && (
                <span className="flex items-center gap-1">
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duration: {duration}</span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Toggle Pin */}
          <button 
            onClick={handleTogglePin}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 border shadow-2xs cursor-pointer ${
              isPinned ? 'bg-purple-600 text-white border-purple-600' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
            <span>{isPinned ? 'Unpin' : 'Pin'}</span>
          </button>

          {/* Toggle Publish / Draft */}
          <button 
            onClick={handleTogglePublish} 
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              isPublished 
                ? 'bg-white border border-[#f0a9a9] hover:bg-rose-50 text-[#d32f2f]' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPublished ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{isPublished ? 'Unpublish (Draft)' : 'Publish Program'}</span>
          </button>

          {/* Delete Program */}
          <button
            onClick={handleDeleteProgram}
            className="p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-[#d7dce2] rounded-xl transition-colors cursor-pointer"
            title="Delete Program"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Split Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Program Overview & Provider Info (1/3) */}
        <div className={hasRightSideContent ? "lg:col-span-1 space-y-6" : "lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0"}>
          
          {/* Card 1: Overview & Provider */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-4 h-4 text-[#153e69]" /> Overview & Provider Details
            </h3>

            <div className="space-y-3.5 text-xs font-semibold text-slate-600">
              {hasCurriculum && (
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Curriculum / Provider</span>
                  <span className="text-slate-900 font-extrabold mt-0.5 block text-sm">{curriculum}</span>
                </div>
              )}
              {hasDuration && (
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Training Duration</span>
                  <span className="text-slate-900 font-extrabold mt-0.5 block">{duration}</span>
                </div>
              )}
              {hasEmployer && (
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Employer / Provider Info</span>
                  <span className="text-blue-700 font-extrabold mt-0.5 block">{employerDetails}</span>
                </div>
              )}
              {hasCountries && (
                <div>
                  <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-1.5">Deployment Countries</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {countriesList.map((country, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{country}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Status & System Metadata */}
          <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-4 h-4 text-[#153e69]" /> Status & Verification
            </h3>

            <div className="space-y-3.5 text-xs font-semibold text-slate-600">
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Program Status</span>
                <span className={`font-extrabold mt-0.5 block uppercase ${isPublished ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isPublished ? 'Published' : 'Draft / In Review'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Pinned Status</span>
                <span className="text-purple-700 font-extrabold mt-0.5 block">
                  {isPinned ? 'Pinned on Top' : 'Standard Priority'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Detailed Sections (2/3) */}
        {hasRightSideContent && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Skills Covered */}
            {hasSkills && (
              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-3">
                <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Sparkles className="w-4 h-4 text-[#153e69]" /> Skills & Curriculum Covered
                </h3>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-line">
                  {skillsCovered}
                </p>
              </div>
            )}

            {/* Card 2: Training Benefits */}
            {hasBenefits && (
              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-3">
                <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Training Benefits
                </h3>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-line">
                  {benefits}
                </p>
              </div>
            )}

            {/* Card 3: Placement & Career Opportunities */}
            {hasPlacement && (
              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-3">
                <h3 className="font-outfit font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Briefcase className="w-4 h-4 text-[#153e69]" /> Placement & International Opportunities
                </h3>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-line">
                  {placementOpportunities}
                </p>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
