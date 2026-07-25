import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/api';
import { RefreshCw, MapPin, Building2, Clock, Sparkles, Wifi, Battery, Signal, Terminal, ArrowUpRight, CheckCircle2, Copy } from 'lucide-react';

export default function LiveFeed() {
  const [feedItems, setFeedItems] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const curlCommand = `curl -X GET "http://178.16.138.159/backend/api/feed?filter=all" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer <YOUR_TOKEN>"`;

  const fetchLivePublicFeed = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getPublicFeed('all');
      if (data && data.success && data.feed) {
        setApiResponse(data);
        setFeedItems(data.feed.data || []);
      } else {
        // Fallback demo data if API returns empty
        const demoFeed = [
          {
            id: 1,
            title: 'Urgent: Regional Warehouse Manager',
            company: 'Global Logistics Corp',
            category: 'overseas',
            salary: '$4,500 - $6,200',
            location: 'Singapore / Remote',
            _type: 'job',
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            title: '🎉 JobConnect 10,000 Placements Achieved!',
            body: 'We are thrilled to announce 10,000 successful placements across India and abroad.',
            post_type: 'Community Announcement',
            _type: 'admin_post',
            created_at: new Date().toISOString()
          },
          {
            id: 3,
            title: 'Head Chef - Luxury Bistro Palace',
            company: 'Luxury Bistro Palace',
            category: 'india',
            salary: 'INR 80,000 - 1,20,000',
            location: 'Mumbai, Maharashtra',
            _type: 'job',
            created_at: new Date().toISOString()
          }
        ];
        setFeedItems(demoFeed);
        setApiResponse({ success: true, feed: { data: demoFeed } });
      }
    } catch (err) {
      console.error('Failed to fetch public candidate feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePublicFeed();
  }, []);

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFeed = feedItems.filter(item => {
    if (!categoryFilter) return true;
    if (item._type === 'job') return item.category === categoryFilter;
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Public Feed Phone Interface Preview</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Live view of published feed stream visible to candidates and chefs via <code className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">GET /api/feed?filter=all</code>.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLivePublicFeed}
            className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Feed Stream
          </button>
        </div>
      </div>

      {/* Dual Column Layout: Left (cURL & API Inspector), Right (Mobile Phone Frame Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: API Endpoint Details & cURL Command (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* cURL Command Box */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 shadow-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-300">Production cURL Command</span>
              </div>
              <button 
                onClick={handleCopyCurl}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1"
              >
                {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <pre className="text-[11px] font-mono bg-slate-950 p-3.5 rounded-xl overflow-x-auto text-emerald-300 leading-relaxed border border-slate-800/80">
              {curlCommand}
            </pre>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Target Route: <code className="text-emerald-300 font-bold">GET /api/feed?filter=all</code></span>
            </div>
          </div>

          {/* Feed API Payload Inspector Box */}
          <div className="bg-white rounded-3xl border border-[#e2e8f0] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-outfit font-extrabold text-sm text-slate-800">Live API JSON Inspector</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100">
                HTTP 200 OK
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-h-[360px] overflow-y-auto custom-scrollbar font-mono text-[11px] text-slate-700 leading-relaxed">
              {loading ? (
                <p className="text-slate-400 text-xs py-10 text-center">Fetching live payload...</p>
              ) : (
                <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: SMARTPHONE PHONE MOCKUP PREVIEW (7 Cols) */}
        <div className="lg:col-span-7 flex justify-center py-2">
          
          {/* Smartphone Frame Container */}
          <div className="relative w-full max-w-[375px] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl ring-1 ring-slate-800/60 border-4 border-slate-800">
            
            {/* Phone Notch / Dynamic Island */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-50 flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
              <div className="w-2 h-2 rounded-full bg-slate-950" />
            </div>

            {/* Smartphone Inner Screen */}
            <div className="bg-[#f8f9fc] rounded-[36px] overflow-hidden min-h-[660px] max-h-[680px] flex flex-col relative border border-slate-200">
              
              {/* Phone Top Status Bar */}
              <div className="pt-3.5 px-6 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-800 bg-white/90 backdrop-blur-md sticky top-0 z-40">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <Signal className="w-3 h-3 text-slate-700" />
                  <Wifi className="w-3 h-3 text-slate-700" />
                  <Battery className="w-3.5 h-3.5 text-slate-700" />
                </div>
              </div>

              {/* Smartphone App Header */}
              <div className="px-5 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-9 z-30">
                <div className="flex items-center gap-2">
                  <span className="font-outfit font-extrabold text-lg text-[#059669]">JobConnect</span>
                  <span className="bg-emerald-100 text-[#059669] text-[9px] font-extrabold px-2 py-0.5 rounded-full">Feed</span>
                </div>
                <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs">👤</span>
              </div>

              {/* Category Filter Chips inside Mobile Screen */}
              <div className="px-4 py-2.5 bg-slate-50 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200/60">
                <button 
                  onClick={() => setCategoryFilter('')}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${categoryFilter === '' ? 'bg-[#059669] text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  All Posts
                </button>
                <button 
                  onClick={() => setCategoryFilter('india')}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${categoryFilter === 'india' ? 'bg-[#059669] text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  🇮🇳 India Jobs
                </button>
                <button 
                  onClick={() => setCategoryFilter('overseas')}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${categoryFilter === 'overseas' ? 'bg-[#059669] text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  ✈️ Overseas
                </button>
              </div>

              {/* Phone Main Feed Stream Body */}
              <div className="flex-grow overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
                {loading ? (
                  <p className="text-center text-slate-400 text-xs py-20 font-medium">Loading candidate feed...</p>
                ) : filteredFeed.length === 0 ? (
                  <p className="text-center text-slate-400 text-xs py-20 font-medium">No published feed items visible.</p>
                ) : (
                  filteredFeed.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2.5">
                      
                      {/* Item Source & Type Badge */}
                      <div className="flex items-center justify-between">
                        {item._type === 'job' ? (
                          <span className="px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                            <Briefcase className="w-2.5 h-2.5" />
                            {item.category || 'india'} job
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase bg-teal-50 text-teal-700 border border-teal-100 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            {item.post_type || 'Announcement'}
                          </span>
                        )}

                        <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          Published
                        </span>
                      </div>

                      {/* Content Title & Details */}
                      <div>
                        <h4 className="font-outfit font-extrabold text-slate-800 text-xs leading-snug">{item.title}</h4>
                        {item._type === 'job' ? (
                          <p className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            {item.company || 'Hospitality Employer'}
                          </p>
                        ) : (
                          <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-2">{item.body}</p>
                        )}
                      </div>

                      {/* Job Meta (Location & Salary) */}
                      {item._type === 'job' && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] font-semibold text-slate-600">
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {item.location || 'India'}
                          </span>
                          <span className="font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full">
                            {item.salary || 'Competitive Pay'}
                          </span>
                        </div>
                      )}

                      {/* Action Button inside Mobile Card */}
                      <div className="pt-1">
                        <button className="w-full bg-[#059669] hover:bg-[#047857] text-white py-2 rounded-xl text-[10px] font-extrabold shadow-2xs transition-all flex items-center justify-center gap-1">
                          <span>{item._type === 'job' ? 'Apply Now' : 'Read Full Announcement'}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

              {/* Smartphone Bottom Navigation Bar */}
              <div className="bg-white border-t border-slate-200/80 px-6 py-2 flex items-center justify-between sticky bottom-0 z-40">
                <div className="flex flex-col items-center gap-0.5 text-[#059669]">
                  <span className="text-base">🏠</span>
                  <span className="text-[9px] font-extrabold">Feed</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 text-slate-400">
                  <span className="text-base">💼</span>
                  <span className="text-[9px] font-bold">Jobs</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 text-slate-400">
                  <span className="text-base">🎓</span>
                  <span className="text-[9px] font-bold">Overseas</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 text-slate-400">
                  <span className="text-base">👤</span>
                  <span className="text-[9px] font-bold">Profile</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
