import React, { useState, useEffect } from 'react';
import { Bell, Search, Filter, RefreshCw, CheckCircle, Clock, Eye, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockApi } from '../services/api';

export default function NotificationsLog() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, unread, read
  const [selectedNotif, setSelectedNotif] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getNotifications();
      if (res && res.success) {
        const rawList = res.notifications || [];
        
        // 1. Strictly filter out WhatsApp & login_auth_code logs (Show only FCM Notifications)
        const fcmList = rawList.filter(item => {
          const type = String(item.type || '').toLowerCase();
          const title = String(item.title || '').toLowerCase();
          const body = String(item.body || item.message || '').toLowerCase();
          return !type.includes('whatsapp') && !title.includes('whatsapp') && !body.includes('whatsapp') && !type.includes('login_auth_code') && !title.includes('login_auth_code');
        });

        // 2. Deduplicate repeated identical notifications for the same recipient
        const dedupedList = [];
        const seenMap = new Map();

        for (const notif of fcmList) {
          const recipientId = notif.user_id || notif.recipient_phone || notif.recipient_name || 'anon';
          const cleanTitle = (notif.title || '').trim().toLowerCase();
          const cleanBody = (notif.body || notif.message || '').trim().toLowerCase();
          const key = `${recipientId}_${cleanTitle}_${cleanBody}`;

          if (!seenMap.has(key)) {
            seenMap.set(key, true);
            dedupedList.push(notif);
          }
        }

        setNotifications(dedupedList);
      }
    } catch (e) {
      console.error("Failed to fetch notification logs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filtered list based on search and status filter
  const filteredNotifications = notifications.filter(item => {
    const title = (item.title || '').toLowerCase();
    const body = (item.body || item.message || '').toLowerCase();
    const recipient = (item.recipient_name || item.recipient_phone || item.user_id || '').toLowerCase();
    const type = (item.type || '').toLowerCase();

    const matchesSearch = title.includes(searchTerm.toLowerCase()) || 
                          body.includes(searchTerm.toLowerCase()) || 
                          recipient.includes(searchTerm.toLowerCase()) ||
                          type.includes(searchTerm.toLowerCase());

    if (statusFilter === 'unread') return matchesSearch && !item.is_read;
    if (statusFilter === 'read') return matchesSearch && item.is_read;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-outfit font-extrabold text-2xl text-slate-800">FCM Notifications & Audit Logs</h2>
              <span className="bg-emerald-50 text-[#059669] border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {notifications.length} Total Logs
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Comprehensive real-time log of all FCM push notifications and system audit events dispatched across Jobrito platform.
            </p>
          </div>
        </div>

        <button 
          onClick={fetchLogs}
          className="bg-white border border-[#e2e8f0] hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-[#059669] ${loading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, message body, or recipient..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] focus:bg-white transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all' 
                ? 'bg-[#059669] text-white shadow-xs' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Logs ({notifications.length})
          </button>
          <button
            onClick={() => setStatusFilter('unread')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'unread' 
                ? 'bg-[#059669] text-white shadow-xs' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Unread ({notifications.filter(n => !n.is_read).length})
          </button>
          <button
            onClick={() => setStatusFilter('read')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'read' 
                ? 'bg-[#059669] text-white shadow-xs' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Read ({notifications.filter(n => n.is_read).length})
          </button>
        </div>

      </div>

      {/* Notifications Log Table Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-[#059669] animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-400">Loading FCM notification logs...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No matching notification logs found</p>
            <p className="text-xs font-semibold text-slate-400 mt-1">Try adjusting your search query or filter settings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Status / ID</th>
                  <th className="py-3.5 px-6">Notification Title</th>
                  <th className="py-3.5 px-6">Message Body</th>
                  <th className="py-3.5 px-6">Recipient</th>
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredNotifications.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Status / ID */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          item.is_read 
                            ? 'bg-slate-100 text-slate-500' 
                            : 'bg-emerald-50 text-[#059669] border border-emerald-200'
                        }`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-800 block">#{item.id || idx + 1}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                            item.is_read ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.is_read ? 'Read' : 'Unread'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-4 px-6 max-w-xs">
                      <span className="font-extrabold text-slate-800 block truncate" title={item.title}>
                        {item.title || 'FCM Push Notification'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                        Type: {item.type || 'fcm_push'}
                      </span>
                    </td>

                    {/* Body */}
                    <td className="py-4 px-6 max-w-md">
                      <p className="text-slate-600 line-clamp-2 leading-relaxed" title={item.body || item.message}>
                        {item.body || item.message || 'No description body provided.'}
                      </p>
                    </td>

                    {/* Recipient */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 inline-block">
                        <span className="font-extrabold text-slate-800 block">
                          {item.recipient_name || item.user_name || item.user_id || 'All Users'}
                        </span>
                        {item.recipient_phone && (
                          <span className="text-[10px] font-bold text-[#059669] block">
                            📱 {item.recipient_phone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 px-6 whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.created_at || item.time || 'Recently'}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedNotif(item)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#059669]" />
                        View
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center font-bold">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-outfit font-extrabold text-lg text-slate-800">Notification Detail Log</h3>
                  <span className="text-xs font-semibold text-slate-400">Log ID: #{selectedNotif.id || 'N/A'}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNotif(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-extrabold flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Title</span>
                <p className="text-sm font-extrabold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedNotif.title || 'FCM Notification'}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Message Content</span>
                <div className="text-xs font-semibold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedNotif.body || selectedNotif.message || 'No body message text.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Recipient</span>
                  <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">
                    {selectedNotif.recipient_name || selectedNotif.user_id || 'System Wide'}
                  </span>
                  {selectedNotif.recipient_phone && (
                    <span className="text-[10px] font-bold text-[#059669] block mt-0.5">
                      {selectedNotif.recipient_phone}
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Timestamp</span>
                  <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">
                    {selectedNotif.created_at || selectedNotif.time || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button 
                onClick={() => setSelectedNotif(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
