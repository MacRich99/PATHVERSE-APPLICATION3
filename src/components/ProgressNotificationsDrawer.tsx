import React from 'react';
import { X, Bell, Check, Target, Flame, Award, Sparkles, ShieldCheck } from 'lucide-react';
import { PathverseNotification } from '../types';

interface ProgressNotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  notifications: PathverseNotification[];
  onMarkRead: (id: string) => void;
}

export const ProgressNotificationsDrawer: React.FC<ProgressNotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notificationsEnabled,
  onToggleNotifications,
  notifications,
  onMarkRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end animate-fade-in">
      <div className="bg-[#1C1F37] border-l border-white/10 w-full max-w-md h-full p-6 sm:p-8 shadow-2xl flex flex-col space-y-6 overflow-y-auto">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0B0D17] border border-[#F2AF29]/40 text-[#F2AF29]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Notifications</h3>
              <p className="text-[11px] text-slate-400">Non-manipulative progress updates</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#0B0D17] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reminder Settings Toggle */}
        <div className="bg-[#0B0D17] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-white">Daily Progress Reminders</h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Receive gentle morning mission alerts and milestone badges.
            </p>
          </div>

          <button
            onClick={onToggleNotifications}
            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
              notificationsEnabled ? 'bg-[#F2AF29]' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-[#0B0D17] transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Recent Updates
          </span>

          {notifications.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-slate-400">
              <ShieldCheck className="w-8 h-8 text-[#F2AF29] mx-auto opacity-80" />
              <p className="text-xs">No unread notifications.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-[#0B0D17]/50 border-white/5 opacity-70'
                    : 'bg-[#0B0D17] border-[#F2AF29]/30 text-white shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#F2AF29]/10 text-[#F2AF29] shrink-0 mt-0.5">
                    {notif.type === 'morning' && <Target className="w-4 h-4" />}
                    {notif.type === 'inactive' && <Flame className="w-4 h-4" />}
                    {notif.type === 'completion' && <Sparkles className="w-4 h-4" />}
                    {notif.type === 'milestone' && <Award className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-white">{notif.title}</h5>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
