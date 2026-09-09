import React from 'react';
import {
  Compass,
  Users,
  Calendar,
  MessageSquare,
  Wallet,
  Plane,
  Key,
  Radio,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  PanelLeftClose,
  X
} from 'lucide-react';
import { hasApiKey } from '../services/geminiService';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentTraveler,
  setCurrentTraveler,
  travelers,
  newsAlerts,
  onOpenNewsRadar,
  onOpenApiKeyModal,
  currentDestination,
  isOpen,
  onToggle
}) {
  const keyActive = hasApiKey();

  const navItems = [
    {
      id: 'meeting',
      label: 'The Round Table',
      description: 'Collaborative Squad Debate',
      icon: Users,
      badge: 'Live',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'itinerary',
      label: 'Master Itinerary',
      description: 'Adaptive Multi-Day Schedule',
      icon: Calendar,
      badge: null
    },
    {
      id: 'personal',
      label: 'Personal Sub-AI',
      description: '1-on-1 Confidential Chat',
      icon: MessageSquare,
      badge: 'Private',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'bookings',
      label: 'Live Bookings',
      description: 'Flights & Hotel Aggregators',
      icon: Plane,
      badge: 'Real',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'budget',
      label: 'Group Budget',
      description: 'Fair Expense Ledger',
      icon: Wallet,
      badge: null
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onToggle}
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden transition-opacity"
      />

      {/* Sidebar Container */}
      <aside className="fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 min-h-screen select-none shadow-xl lg:shadow-none animate-in slide-in-from-left duration-250">
        {/* Top Brand & Header Area */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-100 shrink-0">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Compass className="w-6 h-6 text-indigo-600 animate-spin" style={{ animationDuration: '35s' }} />
                </div>
              </div>
              <div>
                <h1 className="font-black text-lg text-slate-900 tracking-tight leading-tight">
                  EscapePlan <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">AI</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Multi-Agent Squad
                </p>
              </div>
            </div>

            {/* Collapse / Close Button */}
            <button
              onClick={onToggle}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-5 h-5 hidden lg:block" />
              <X className="w-5 h-5 lg:hidden" />
            </button>
          </div>

          {/* Current Destination Badge */}
          <div className="mt-5 p-3 rounded-2xl bg-gradient-to-r from-indigo-50/70 to-purple-50/70 border border-indigo-100/80 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Trip</div>
              <div className="text-xs font-extrabold text-slate-800">{currentDestination} Escape</div>
            </div>
            <span className="text-base">🌸</span>
          </div>

          {/* Navigation Menu with Spacious Padding */}
          <nav className="mt-6 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Trip Views
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Close on mobile after click
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                    isActive
                      ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5 leading-none">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Area: Controls & Traveler Persona Card */}
        <div className="p-6 border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenNewsRadar}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 text-xs font-bold transition-all"
            >
              <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Radar ({newsAlerts.length})</span>
            </button>

            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                keyActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-800 border-slate-200'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-purple-600" />
              <span>{keyActive ? 'API Active' : 'Set Key'}</span>
            </button>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Playing As</span>
              <span className="text-[10px] text-indigo-600 font-bold">Switch</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={currentTraveler.avatar}
                alt={currentTraveler.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-300 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <select
                  value={currentTraveler.id}
                  onChange={(e) => {
                    const found = travelers.find(t => t.id === e.target.value);
                    if (found) setCurrentTraveler(found);
                  }}
                  className="w-full bg-transparent font-black text-xs text-slate-900 focus:outline-none cursor-pointer truncate"
                >
                  {travelers.map(t => (
                    <option key={t.id} value={t.id} className="text-slate-900">
                      {t.name}
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {currentTraveler.vibe}
                </div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>Sub-AI: {currentTraveler.agentName.split(' ')[0]}</span>
              <span className="font-bold text-amber-700">${currentTraveler.budgetDaily}/d cap</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
