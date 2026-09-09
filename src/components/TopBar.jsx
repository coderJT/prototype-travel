import React from 'react';
import {
  Sparkles,
  Radio,
  Wand2,
  AlertTriangle,
  Menu,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function TopBar({
  activeTab,
  currentDestination,
  emergencySimulated,
  onOpenPlanGenerator,
  onSimulateEmergency,
  onOpenNewsRadar,
  newsAlerts
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'meeting':
        return 'The Escape Round Table';
      case 'itinerary':
        return 'Master Trip Timeline';
      case 'personal':
        return 'Personal Sub-AI Concierge';
      case 'bookings':
        return 'Live Flight & Hotel Booking Hub';
      case 'budget':
        return 'Shared Financial Ledger';
      default:
        return 'Travel Planner';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 lg:px-10 py-4 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Breadcrumb & Section Title */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>{currentDestination} Trip</span>
            <span>/</span>
            <span className="text-indigo-600 font-bold">{getTabTitle()}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
            {getTabTitle()}
          </h2>
        </div>

        {/* Spacious Action Area */}
        <div className="flex items-center gap-3">
          {/* Sub-AIs Synced Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>3 Sub-AIs In Sync</span>
          </div>

          {/* Quick Plan Generator Action */}
          <button
            onClick={onOpenPlanGenerator}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Generate Plan</span>
          </button>

          {/* Emergency Alert Indicator */}
          {emergencySimulated ? (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span className="hidden md:inline">Day 3 Weather Alert</span>
            </div>
          ) : (
            <button
              onClick={onSimulateEmergency}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
              <span>Simulate Storm</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
