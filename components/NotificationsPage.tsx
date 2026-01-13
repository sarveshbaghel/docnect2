
import React from 'react';
import { Notification } from '../types';
import { Bell, Trash2, CheckCircle2, Clock, Inbox } from 'lucide-react';

interface NotificationsPageProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onClear: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onMarkAllRead, onClear }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500">Stay updated with document approvals and new submissions.</p>
        </div>
        {notifications.length > 0 && (
          <div className="flex gap-3">
            <button 
              onClick={onMarkAllRead}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <CheckCircle2 size={18} />
              Mark all as read
            </button>
            <button 
              onClick={onClear}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
            >
              <Trash2 size={18} />
              Clear all
            </button>
          </div>
        )}
      </header>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-6 flex items-start gap-4 transition-all hover:bg-slate-50/50 ${!n.read ? 'bg-indigo-50/30' : ''}`}
              >
                <div className={`mt-1 p-2 rounded-xl shrink-0 ${!n.read ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                  <Bell size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                    <h3 className={`font-bold text-slate-900 ${!n.read ? 'text-indigo-900' : ''}`}>{n.title}</h3>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {n.date}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{n.message}</p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0 shadow-sm shadow-indigo-300"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-24 text-slate-400">
            <div className="p-6 bg-slate-50 rounded-full mb-4">
              <Inbox size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-600">All clear!</h3>
            <p className="text-sm">You don't have any new notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
