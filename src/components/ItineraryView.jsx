import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  AlertTriangle,
  Sparkles,
  Bot,
  Compass,
  ArrowRight,
  ShieldAlert,
  Bed,
  Utensils,
  Moon,
  CloudRain,
  Image as ImageIcon,
  Wand2
} from 'lucide-react';

export default function ItineraryView({
  itinerary,
  onSimulateEmergency,
  onNavigateToMeeting,
  emergencySimulated,
  onResolveEmergencyDirectly,
  onOpenPlanGenerator,
  onNavigateToMedia
}) {
  const [activeDay, setActiveDay] = useState(1);
  const [filterCategory, setFilterCategory] = useState('all');

  const currentDayData = itinerary.find(d => d.day === activeDay) || itinerary[0];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hotel':
        return <Bed className="w-5 h-5 text-indigo-500" />;
      case 'Food & Drinks':
      case 'Lunch':
      case 'Dinner':
      case 'Brunch':
      case 'Bakery':
      case 'Dinner (Celebration)':
        return <Utensils className="w-5 h-5 text-amber-500" />;
      case 'Nightlife':
        return <Moon className="w-5 h-5 text-purple-500" />;
      default:
        return <Compass className="w-5 h-5 text-emerald-500" />;
    }
  };

  const filteredItems = currentDayData.items.filter(item => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'dining') return item.type === 'dining';
    if (filterCategory === 'activity') return item.type === 'activity';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Friendly Real-time World News Alert Banner */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        emergencySimulated
          ? 'bg-gradient-to-r from-amber-50 via-rose-50 to-orange-50 border-amber-300 shadow-sm'
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
              emergencySimulated
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}>
              <CloudRain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {emergencySimulated ? '⚠️ Weather Advisory & Dynamic Re-Plan' : '✨ World News Radar Active'}
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                  emergencySimulated
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {emergencySimulated ? 'Day 3 Cruise Affected' : 'Radar Nominal'}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
                {emergencySimulated
                  ? 'Tropical Storm Neoguri gale alert: Tokyo Bay water bus is suspended on Day 3 afternoon. Aegis and the Sub-AIs have drafted indoor alternatives!'
                  : 'AI continuously monitors meteorological feeds, transit delays, and local festivals to safeguard the group.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            {emergencySimulated ? (
              <>
                <button
                  onClick={onNavigateToMeeting}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all"
                >
                  <Bot className="w-4 h-4" />
                  <span>Deliberate at Round Table</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onResolveEmergencyDirectly}
                  className="flex-1 lg:flex-none px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 shadow-xs transition-all"
                >
                  Quick Auto-Swap
                </button>
              </>
            ) : (
              <button
                onClick={onSimulateEmergency}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-2xl transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Simulate Typhoon Surge</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Days Tabs Navigation with Generous Spacing */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
        <div className="flex items-center gap-2.5 overflow-x-auto max-w-full">
          {itinerary.map(day => {
            const isActive = activeDay === day.day;
            const hasDisruption = day.items.some(i => i.status === 'threatened');
            return (
              <button
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                }`}
              >
                <span>Day {day.day}</span>
                <span className="text-[11px] font-medium opacity-80">{day.date.split(',')[0]}</span>
                {hasDisruption && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping absolute top-2 right-2"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterCategory === 'all' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilterCategory('dining')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterCategory === 'dining' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Food & Cafes
          </button>
          <button
            onClick={() => setFilterCategory('activity')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterCategory === 'activity' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Activities
          </button>
        </div>
      </div>

      {/* Day Overview Header */}
      <div className="bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-wide">DAY {currentDayData.day} • {currentDayData.date}</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Squad Agreement: {currentDayData.consensusScore}%
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            {currentDayData.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {currentDayData.theme}
          </p>
        </div>

        {currentDayData.disruptionRisk && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{currentDayData.disruptionRisk}</span>
          </div>
        )}
      </div>

      {/* Timeline Schedule Items with Roomy Padding */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isThreatened = item.status === 'threatened';
          const isReplaced = item.status === 'replaced';

          return (
            <div
              key={item.id}
              className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                isThreatened
                  ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                  : isReplaced
                  ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs ${
                  isThreatened
                    ? 'bg-amber-100 border-amber-200 text-amber-800'
                    : isReplaced
                    ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-xs">
                      <span className="font-black text-indigo-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        {item.time}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
                        {item.category}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 flex items-center gap-1 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black text-amber-900 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                        ${item.costPerPerson} / person
                      </span>
                      {isThreatened && (
                        <span className="px-3 py-1 rounded-xl bg-amber-200 text-amber-900 text-xs font-bold">
                          Storm Alert
                        </span>
                      )}
                      {isReplaced && (
                        <span className="px-3 py-1 rounded-xl bg-emerald-200 text-emerald-900 text-xs font-bold">
                          Consensus Plan
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {isThreatened && (
                    <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-700" />
                        <span>Weather Impact:</span>
                      </div>
                      <p className="text-xs leading-relaxed">{item.disruptionReason}</p>
                      <div className="mt-3">
                        <button
                          onClick={onNavigateToMeeting}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                        >
                          Resolve at Squad Table →
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>Origin: <strong className="text-indigo-700">{item.advocate}</strong></span>
                    </div>

                    <button
                      onClick={onNavigateToMedia}
                      className="flex items-center gap-1.5 text-purple-600 hover:text-purple-800 font-bold"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Visualize with AI</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
