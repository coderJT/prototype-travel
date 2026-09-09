import React from 'react';
import { Compass, Sparkles, Key, Users, MessageSquare, Calendar, Wallet, Radio, Image as ImageIcon } from 'lucide-react';
import { hasApiKey } from '../services/geminiService';

export default function Header({
  activeTab,
  setActiveTab,
  currentTraveler,
  setCurrentTraveler,
  travelers,
  newsAlerts,
  onOpenNewsRadar,
  emergencySimulated,
  onOpenApiKeyModal,
  currentDestination = 'Tokyo'
}) {
  const highSeverityAlerts = newsAlerts.filter(a => a.severity === 'high');
  const keyActive = hasApiKey();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 lg:px-8 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Trip Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-100">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-indigo-600 animate-spin" style={{ animationDuration: '30s' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                  EscapePlan <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">AI Squad</span>
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">🌸 {currentDestination} Escape</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  3 Sub-AIs Connected
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Quick API Key / Radar */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenApiKeyModal}
              className="p-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs"
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenNewsRadar}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold"
            >
              <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Radar ({newsAlerts.length})</span>
            </button>
          </div>
        </div>

        {/* Friendly Navigation Pills */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 text-xs font-semibold overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('meeting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'meeting'
                ? 'bg-white text-indigo-700 shadow-sm font-bold border border-indigo-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Round Table</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-100 text-emerald-700 font-bold">
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'itinerary'
                ? 'bg-white text-indigo-700 shadow-sm font-bold border border-indigo-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>Master Itinerary</span>
            {emergencySimulated && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping ml-0.5"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'personal'
                ? 'bg-white text-indigo-700 shadow-sm font-bold border border-indigo-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-rose-500" />
            <span>Personal Sub-AI</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'media'
                ? 'bg-white text-indigo-700 shadow-sm font-bold border border-indigo-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-pink-500" />
            <span>AI Visuals & Video</span>
            <span className="text-[9px] bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded-full font-bold">
              Imagen/Veo
            </span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'budget'
                ? 'bg-white text-indigo-700 shadow-sm font-bold border border-indigo-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Wallet className="w-4 h-4 text-amber-500" />
            <span>Budget</span>
          </button>
        </div>

        {/* Gemini Key Pill & Persona Switcher */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Gemini API Key Indicator */}
          <button
            onClick={onOpenApiKeyModal}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              keyActive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
            }`}
            title="Set your Gemini API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{keyActive ? 'Gemini Key Active' : 'API Key'}</span>
          </button>

          {/* World News Radar Button */}
          <button
            onClick={onOpenNewsRadar}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              highSeverityAlerts.length > 0
                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Radar</span>
            {highSeverityAlerts.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full text-[10px] font-bold">
                {newsAlerts.length}
              </span>
            )}
          </button>

          {/* Persona Switcher */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-2.5 py-1 shadow-xs">
            <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">Playing:</span>
            <select
              value={currentTraveler.id}
              onChange={(e) => {
                const found = travelers.find(t => t.id === e.target.value);
                if (found) setCurrentTraveler(found);
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {travelers.map(t => (
                <option key={t.id} value={t.id} className="text-slate-900">
                  {t.name} ({t.vibe})
                </option>
              ))}
            </select>
            <img
              src={currentTraveler.avatar}
              alt={currentTraveler.name}
              className="w-5 h-5 rounded-full object-cover border border-indigo-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
