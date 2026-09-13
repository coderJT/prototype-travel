import React from 'react';
import {
  Compass,
  Users,
  Calendar,
  MessageSquare,
  User,
  Plus,
  PanelLeftClose,
  X,
  ShieldCheck,
  LogIn,
  LogOut
} from 'lucide-react';
import { hasApiKey, getActiveModelName } from '../services/geminiService';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentTraveler,
  setCurrentTraveler,
  travelers = [],
  currentDestination = 'Tokyo',
  isOpen = true,
  onToggle,
  onOpenCreateTrip,
  onOpenCreateAccount,
  onOpenApiKeyModal,
  authUser,
  onOpenAuthModal,
  onSignOut,
  activeTrip,
  onOpenTripPortal
}) {
  const keyActive = hasApiKey();

  const navItems = [
    {
      id: 'personal',
      label: 'Agent Chat',
      description: `1-on-1 with ${currentTraveler?.agentName || 'Sub-AI'}`,
      icon: MessageSquare
    },
    {
      id: 'meeting',
      label: 'Meeting Table',
      description: 'Deliberation & Consensus',
      icon: Users
    },
    {
      id: 'profile',
      label: 'Traveler Profile',
      description: 'Budget, pacing & limits',
      icon: User
    },
    {
      id: 'itinerary',
      label: 'Master Itinerary',
      description: 'Timeline & Disruption Plan',
      icon: Calendar
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onToggle}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs lg:hidden transition-opacity"
      />

      {/* Sidebar Container */}
      <aside className="fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-68 h-screen overflow-y-auto bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 select-none shadow-xl lg:shadow-none animate-in slide-in-from-left duration-250">
        {/* Top Brand & Header Area */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-base text-gray-900 tracking-tight leading-tight flex items-center gap-1.5">
                  <span>EscapePlan</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    AI
                  </span>
                </h1>
                <p className="text-[11px] text-gray-500 font-medium">
                  Autonomous Squad Planner
                </p>
              </div>
            </div>

            {/* Collapse / Close Button */}
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4 hidden lg:block" />
              <X className="w-4 h-4 lg:hidden" />
            </button>
          </div>

          {/* Current Destination, Invite Code & Trip Portal Button */}
          <div className="mt-5 p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Current Trip
                </div>
                <div className="text-xs font-bold text-gray-900 truncate">
                  {activeTrip?.title || currentDestination}
                </div>
              </div>
              <button
                onClick={onOpenTripPortal}
                className="px-2 py-1 rounded-lg bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer shrink-0"
                title="Join trip with code or create new trip"
              >
                <span>Portal</span>
              </button>
            </div>
            <div className="pt-1.5 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
              <span className="text-gray-500">Invite Code:</span>
              <button
                onClick={onOpenTripPortal}
                className="font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                title="Click to view or join another trip"
              >
                {activeTrip?.inviteCode || 'TOKYO-77'}
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="mt-5 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-1.5">
              Workspace
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-purple-50 text-purple-900 font-semibold border border-purple-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs leading-tight">{item.label}</div>
                    <div className="text-[10px] text-gray-400 font-normal truncate mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Area: User Auth & Active Traveler Profile */}
        <div className="p-5 border-t border-gray-200 space-y-3">
          {/* Active Traveler Switcher */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
              <span>Active Profile</span>
              <button
                onClick={onOpenCreateAccount}
                className="text-[10px] text-purple-600 hover:text-purple-800 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Traveler</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <img
                src={currentTraveler?.avatar}
                alt={currentTraveler?.name}
                className="w-8 h-8 rounded-lg object-cover border border-gray-300 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <select
                  value={currentTraveler?.id}
                  onChange={(e) => {
                    const found = travelers.find(t => t.id === e.target.value);
                    if (found) setCurrentTraveler(found);
                  }}
                  className="w-full bg-transparent font-bold text-xs text-gray-900 focus:outline-none cursor-pointer truncate"
                >
                  {travelers.map(t => (
                    <option key={t.id} value={t.id} className="text-gray-900">
                      {t.name}
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-gray-500 truncate font-normal">
                  {currentTraveler?.vibe}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-600 font-medium">
              <span>Sub-AI: {currentTraveler?.agentName}</span>
              <span className="font-semibold text-gray-900">${currentTraveler?.budgetDaily}/d</span>
            </div>
          </div>

          {/* Supabase Account Status */}
          <div className="p-2.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
            {authUser ? (
              <div className="flex items-center justify-between w-full">
                <div className="min-w-0 pr-2">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Logged In
                  </div>
                  <div className="text-xs font-semibold text-gray-900 truncate">
                    {authUser.email}
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="w-full py-1.5 px-2.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Join Trip</span>
              </button>
            )}
          </div>

          {/* Gemini LLM Status */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              {keyActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-emerald-700 font-semibold truncate max-w-[120px]" title={`Gemini Model: ${getActiveModelName()}`}>
                    Gemini Live
                  </span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Offline Demo</span>
                </>
              )}
            </span>
            <button
              onClick={onOpenApiKeyModal}
              className="text-[10px] font-semibold text-gray-600 hover:text-gray-900 underline cursor-pointer"
            >
              {keyActive ? 'Config Key' : 'Set Gemini Key'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
