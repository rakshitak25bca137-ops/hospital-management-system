import React, { useState } from 'react';
import { Search, Bell, ChevronDown, CheckCheck, ShieldAlert, User, LogOut, Check } from 'lucide-react';
import { AVAILABLE_ROLES } from '../data/initialData';

export default function Header({
  currentUser,
  onChangeRole,
  searchQuery,
  setSearchQuery,
  onPerformSearch,
  notifications = [],
  onLogout
}) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/70 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Search Input Bar (Matching screenshot pill style) */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onPerformSearch && onPerformSearch(searchQuery)}
            placeholder="Search patients, doctors..."
            className="w-full pl-11 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 text-sm rounded-full border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 mb-2">
                <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                <span className="text-[11px] text-blue-600 font-medium cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition-colors text-xs">
                    <div className="font-semibold text-slate-800 flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher (Matching screenshot: Hello, Kyra v / Admin) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-3 p-1.5 pr-2.5 rounded-full hover:bg-slate-100/80 transition-colors text-left"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
            />
            <div className="hidden sm:block">
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 leading-tight">
                <span>Hello, {currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-[11px] font-medium text-slate-500">{currentUser.role}</div>
            </div>
          </button>

          {/* Role Switching / User Menu (SRS Section 2.3 & 3.1) */}
          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1.5 border-b border-slate-100 mb-2">
                <div className="font-semibold text-slate-800 text-sm">Switch RBAC Role</div>
                <div className="text-[11px] text-slate-400">Test different user permissions per SRS</div>
              </div>

              <div className="space-y-1">
                {AVAILABLE_ROLES.map((r) => {
                  const isActive = currentUser.role === r.role;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        onChangeRole(r.role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-[10px] text-slate-400">{r.desc}</div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    onLogout();
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of CareNova</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
