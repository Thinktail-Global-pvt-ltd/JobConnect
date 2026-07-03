import React, { useState } from 'react';
import { Download, Plus, Eye, Phone, MoreVertical, Check, X, ShieldAlert, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const INITIAL_ENQUIRIES = [
  {
    id: '1',
    name: 'Adrian Smith',
    email: 'adrian.s@email.com',
    phone: '+44 7700 900077',
    program: 'Chef Internship - Dubai',
    date: 'Oct 24, 2023, 10:45 AM',
    status: 'New Enquiry',
    status_color: 'text-emerald-600 bg-emerald-500',
    avatar_color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    query: "I have 3 years of experience in London hotels and I'm looking to move to Dubai for fine dining. Does this program include visa sponsorship?",
    priority: 'HIGH PRIORITY'
  },
  {
    id: '2',
    name: 'Maria Lopez',
    email: 'm.lopez@globemail.net',
    phone: '+34 612 345 678',
    program: 'Culinary Arts Training',
    date: 'Oct 23, 2023, 04:20 PM',
    status: 'Contacted',
    status_color: 'text-slate-400 bg-slate-300',
    avatar_color: 'bg-orange-50 text-orange-600 border-orange-200',
    query: "Hi, I am interested in pastry cooking. Can I enroll in this program part-time while keeping my job?",
    priority: 'STANDARD'
  },
  {
    id: '3',
    name: 'James Kang',
    email: 'jkang_99@provider.com',
    phone: '+82 10 1234 5678',
    program: 'Overseas Placement - USA',
    date: 'Oct 23, 2023, 11:15 AM',
    status: 'Urgent Follow-up',
    status_color: 'text-rose-500 bg-rose-500',
    avatar_color: 'bg-slate-100 text-slate-600 border-slate-200',
    query: "URGENT: My passport verification was delayed. Who can I contact to adjust my flight details?",
    priority: 'CRITICAL'
  },
  {
    id: '4',
    name: 'Elena Dubois',
    email: 'e.dubois@maison.fr',
    phone: '+33 1 23 45 67 89',
    program: 'Sommelier Masterclass',
    date: 'Oct 22, 2023, 09:30 AM',
    status: 'Contacted',
    status_color: 'text-slate-400 bg-slate-300',
    avatar_color: 'bg-teal-50 text-teal-600 border-teal-200',
    query: "Good day, I would like to pay for the course using my credit card, but the portal has rejected it twice.",
    priority: 'STANDARD'
  },
  {
    id: '5',
    name: 'Rahul Verma',
    email: 'rahul.v@techhosp.in',
    phone: '+91 98765 43210',
    program: 'Hospitality Management',
    date: 'Oct 22, 2023, 08:05 AM',
    status: 'New Enquiry',
    status_color: 'text-emerald-600 bg-emerald-500',
    avatar_color: 'bg-blue-50 text-blue-600 border-blue-200',
    query: "Hello, what is the age limit for the hospitality management course? Do I need a college degree?",
    priority: 'STANDARD'
  }
];

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = (enquiry) => {
    setActiveEnquiry(enquiry);
    setDrawerOpen(true);
  };

  const handleMarkContacted = (id) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'Contacted', status_color: 'text-slate-400 bg-slate-300' } : e));
    if (activeEnquiry?.id === id) {
      setActiveEnquiry(prev => ({ ...prev, status: 'Contacted', status_color: 'text-slate-400 bg-slate-300' }));
    }
  };

  return (
    <div className="space-y-6 text-left relative overflow-hidden">
      
      {/* Breadcrumbs and Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>Training & Overseas</span>
            <span>&gt;</span>
            <span className="text-slate-600">Enquiries</span>
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-slate-800">Enquiries Management</h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            Export CSV
          </button>
          
          <button className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-5 py-2.5 text-xs font-bold shadow-sm shadow-[#059669]/10 transition-all">
            + Manual Entry
          </button>
        </div>
      </div>

      {/* KPI Cards Row (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Enquiries</span>
          <div className="flex items-center justify-between mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">1,284</span>
            <span className="bg-emerald-50 text-[#059669] border border-emerald-100 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">~ 12%</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Pending Response</span>
          <div className="flex items-center justify-between mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">42</span>
            <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md">High Priority</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Contacted Today</span>
          <div className="flex items-center justify-between mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">18</span>
            <span className="bg-emerald-50 text-[#059669] border border-emerald-100 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md">On Track</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between min-h-[105px]">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Avg. Wait Time</span>
          <div className="flex items-center justify-between mt-2">
            <span className="font-outfit font-extrabold text-2xl text-slate-800 block">4.2h</span>
            <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">-0.5h</span>
          </div>
        </div>

      </div>

      {/* Main Enquiries Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {/* Navigation Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-[#e2e8f0] bg-slate-50/10">
          <div className="flex items-center gap-2 flex-wrap">
            <button className="bg-white border border-[#e2e8f0] rounded-lg px-4 py-2 text-xs font-bold text-[#475569] flex items-center gap-1.5 hover:bg-slate-50 transition-all">
              Filter Status <span>▼</span>
            </button>
            <button className="bg-white border border-[#e2e8f0] rounded-lg px-4 py-2 text-xs font-bold text-[#475569] flex items-center gap-1.5 hover:bg-slate-50 transition-all">
              Last 30 Days <span>▼</span>
            </button>
          </div>

          <span className="text-xs text-slate-400 font-bold">Showing 1-10 of 1,284 results</span>
        </div>

        {/* Directory Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-[#e2e8f0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Mobile Number</th>
                <th className="py-4 px-6">Program Interested In</th>
                <th className="py-4 px-6">Date Submitted</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-slate-700 text-xs font-semibold">
              {enquiries.map(enq => (
                <tr key={enq.id} className="hover:bg-slate-50/30 transition-colors">
                  
                  {/* Name column */}
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-outfit text-xs border border-white shadow-sm ${enq.avatar_color}`}>
                        {enq.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 text-[13px] block leading-tight">{enq.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{enq.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Mobile number */}
                  <td className="py-4.5 px-6 font-semibold text-slate-500">
                    <code>{enq.phone}</code>
                  </td>

                  {/* Program interested in */}
                  <td className="py-4.5 px-6">
                    <span className="bg-[#ccfbf1] text-[#0f766e] border border-[#99f6e4] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                      {enq.program}
                    </span>
                  </td>

                  {/* Submitted Date */}
                  <td className="py-4.5 px-6 text-slate-400 font-bold">
                    {enq.date}
                  </td>

                  {/* Status Indicator */}
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${enq.status_color}`} />
                      <span className={`${enq.status === 'Urgent Follow-up' ? 'text-rose-600' : 'text-slate-600'} font-bold`}>{enq.status}</span>
                    </div>
                  </td>

                  {/* Actions buttons */}
                  <td className="py-4.5 px-6 text-center">
                    <div className="flex items-center justify-center gap-3.5">
                      <button onClick={() => handleOpenDrawer(enq)} className="text-slate-400 hover:text-slate-600" title="Review">
                        <Eye className="w-4 h-4" />
                      </button>

                      {enq.status !== 'Contacted' ? (
                        <button onClick={() => handleMarkContacted(enq.id)} className="text-slate-400 hover:text-[#059669]" title="Call">
                          <Phone className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[#059669] text-xs">✓</span>
                      )}

                      <button className="text-slate-400 hover:text-slate-600" title="More">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[#e2e8f0] bg-slate-50/10">
          <div>
            <select className="bg-white border border-[#e2e8f0] rounded-lg px-2 py-1 text-xs font-bold text-slate-500 focus:outline-none">
              <option>Rows per page: 10</option>
              <option>Rows per page: 20</option>
              <option>Rows per page: 50</option>
            </select>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-lg bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">2</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">3</button>
            <span className="text-slate-400 px-1 font-bold">...</span>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">128</button>
            <button className="w-7 h-7 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 flex items-center justify-center text-slate-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>

      {/* Slide-out Drawer Overlay */}
      {drawerOpen && activeEnquiry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
          
          {/* Dismiss area */}
          <div className="flex-grow h-full" onClick={() => setDrawerOpen(false)}></div>
          
          {/* Drawer Body container */}
          <div className="w-full max-w-[400px] h-full bg-[#f8f9fc] border-l border-[#e2e8f0] p-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="font-outfit font-extrabold text-slate-800 text-base">Enquiries Detail</h3>
                <button onClick={() => setDrawerOpen(false)} className="w-7 h-7 bg-white hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-xs shadow-sm border border-[#e2e8f0]">✕</button>
              </div>

              {/* Profile Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs relative text-left">
                
                {/* Priority Badge absolute overlay */}
                <span className="absolute top-4 right-4 bg-orange-50 text-orange-600 border border-orange-100 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md leading-none">
                  {activeEnquiry.priority}
                </span>

                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold font-outfit text-sm border ${activeEnquiry.avatar_color}`}>
                    {activeEnquiry.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-outfit font-extrabold text-slate-800 text-sm leading-none">{activeEnquiry.name}</h4>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
                      🎓 {activeEnquiry.program}
                    </span>
                  </div>
                </div>

                {/* Message Box */}
                <div className="mt-5 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    "{activeEnquiry.query}"
                  </p>
                </div>

                {/* Contact Controls */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button className="bg-white border border-[#e2e8f0] hover:bg-slate-50 text-slate-700 rounded-lg py-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1 shadow-xs">
                    📞 Call
                  </button>
                  <button onClick={() => handleMarkContacted(activeEnquiry.id)}
                          className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg py-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1 shadow-xs">
                    ✓ Contacted
                  </button>
                </div>

              </div>

              {/* Sarah Jenkins Mock scan list underneath */}
              <div className="bg-white p-4.5 rounded-xl border border-slate-100/60 shadow-xs flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm">👤</div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-75 text-slate-800 block leading-tight">Sarah Jenkins</h5>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Advanced Sommelier</span>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 text-center">
                Follow-up scheduled for tomorrow
              </div>
            </div>

            {/* Bottom info footer */}
            <span className="text-[9px] font-bold text-slate-400 text-center block pt-4">© 2023 JobConnect Hospitality Admin Panel</span>
          </div>

        </div>
      )}

    </div>
  );
}
