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
  Wand2,
  Plane,
  Zap,
  Receipt,
  CheckCircle2,
  Ticket,
  BookOpen,
  RotateCcw
} from 'lucide-react';
import { generateBookingComUrl, REAL_WORLD_HOTELS, REAL_WORLD_FLIGHTS } from '../services/bookingService';
import DemandAiBookingModal from './DemandAiBookingModal';
import HowToUseVisualGuide from './HowToUseVisualGuide';
import RednoteTravelModal from './RednoteTravelModal';
import {
  isHotelBooked,
  isFlightBooked,
  getTripBookingStatus,
  executeDemandAiAutonomousBooking,
  executeDemandAiAutonomousFlightBooking,
  cancelStoredBooking
} from '../services/bookingDemandAiService';

export default function ItineraryView({
  itinerary,
  travelers = [],
  currentDestination = 'Tokyo',
  onSimulateEmergency,
  onNavigateToMeeting,
  onNavigateToPersonal,
  emergencySimulated,
  onResolveEmergencyDirectly,
  onOpenPlanGenerator,
  onNavigateToBookings,
  onLoadDemoItinerary,
  onResetItinerary
}) {
  const [activeDay, setActiveDay] = useState(1);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showVisualGuide, setShowVisualGuide] = useState(false);

  // RedNote Travel Intelligence state
  const [isRednoteOpen, setIsRednoteOpen] = useState(false);
  const [rednoteQuery, setRednoteQuery] = useState('');

  // Demand AI state
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingType, setBookingType] = useState('hotel');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const defaultHotel = REAL_WORLD_HOTELS[0];
  const defaultFlight = REAL_WORLD_FLIGHTS[1] || REAL_WORLD_FLIGHTS[0];
  const tripStatus = getTripBookingStatus(defaultHotel.name, defaultFlight.flightNumber);

  const handleAutoBookFlight = () => {
    setSelectedFlight(defaultFlight);
    setSelectedHotel(null);
    setBookingType('flight');
    setSelectedBooking(null);
    setIsDemandModalOpen(true);
  };

  const handleAutoBookHotel = () => {
    setSelectedHotel(defaultHotel);
    setSelectedFlight(null);
    setBookingType('hotel');
    setSelectedBooking(null);
    setIsDemandModalOpen(true);
  };

  const handleBookEntireTrip = () => {
    if (!tripStatus.isFlightBooked) {
      handleAutoBookFlight();
    } else if (!tripStatus.isHotelBooked) {
      handleAutoBookHotel();
    }
  };

  const hasItinerary = Array.isArray(itinerary) && itinerary.length > 0;
  const currentDayData = hasItinerary ? (itinerary.find(d => d.day === activeDay) || itinerary[0]) : null;

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

  const filteredItems = currentDayData?.items ? currentDayData.items.filter(item => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'dining') return item.type === 'dining';
    if (filterCategory === 'activity') return item.type === 'activity';
    return true;
  }) : [];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Professional Trip Planner Master Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-black text-[11px] rounded-full uppercase tracking-wider border border-indigo-100/80">
                🧭 EscapePlan Trip Master
              </span>
              {hasItinerary ? (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-full border border-emerald-200/80 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Consensus Plan Active</span>
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-50 text-amber-700 font-bold text-[11px] rounded-full border border-amber-200/80 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Zero-State • Ready to Plan</span>
                </span>
              )}
              <span className="px-3 py-1 bg-slate-100 text-slate-700 font-medium text-[11px] rounded-full border border-slate-200">
                {travelers.length > 0 ? `${travelers.length} Travelers (${travelers.map(t => t.name).join(', ')})` : '3 Travelers (Alice, Bob, Charlie)'}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
              <span>{currentDestination} Squad Expedition</span>
              <span className="text-slate-300 font-light hidden sm:inline">/</span>
              <span className="text-sm sm:text-base font-semibold text-slate-500">
                {hasItinerary ? `${itinerary.length} Days Schedule` : 'Autonomous AI Trip Planner'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
              Professional multi-agent travel platform with Booking.com Demand AI autonomous fulfillment, private confidential preferences, and live weather radar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Toggle visual guide button */}
            <button
              onClick={() => setShowVisualGuide(!showVisualGuide)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shadow-xs cursor-pointer ${
                showVisualGuide
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{showVisualGuide ? 'Hide Guide' : '📖 How It Works'}</span>
            </button>

            {/* RedNote Intelligence button */}
            <button
              onClick={() => {
                setRednoteQuery('');
                setIsRednoteOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-2xl shadow-xs transition-all cursor-pointer"
            >
              <span>📕 RedNote Intel</span>
            </button>

            {/* Plan Generator button */}
            {onOpenPlanGenerator && (
              <button
                onClick={onOpenPlanGenerator}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>✨ New Plan</span>
              </button>
            )}

            {/* Demo itinerary reload / reset */}
            {hasItinerary && onResetItinerary && (
              <button
                onClick={onResetItinerary}
                title="Reset trip to see zero-state guide or start fresh"
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-bold rounded-2xl border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Trip</span>
              </button>
            )}

            {!hasItinerary && onLoadDemoItinerary && (
              <button
                onClick={onLoadDemoItinerary}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-2xl border border-indigo-200 transition-all cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Load Demo Plan</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visual Guide Mode (Active when no itinerary exists OR toggled by user) */}
      {(!hasItinerary || showVisualGuide) ? (
        <div className="space-y-6">
          {hasItinerary && showVisualGuide && (
            <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs text-indigo-900 font-bold">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>You are currently viewing the Visual Instructions. Your active itinerary is saved.</span>
              </div>
              <button
                onClick={() => setShowVisualGuide(false)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Return to Active Itinerary ➔
              </button>
            </div>
          )}

          <HowToUseVisualGuide
            onGeneratePlan={onOpenPlanGenerator}
            onLoadDemo={onLoadDemoItinerary}
            onNavigateToMeeting={onNavigateToMeeting}
            onNavigateToPersonal={onNavigateToPersonal}
            onNavigateToBookings={onNavigateToBookings}
            hasItinerary={hasItinerary}
          />
        </div>
      ) : (
        <>
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

      {/* Autonomous Demand AI Full-Trip Booking Hub */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/60 rounded-3xl p-6 sm:p-7 text-white shadow-md space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-indigo-100 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                Booking.com Demand API Sandbox v3.2
              </span>
              <span className="text-xs text-indigo-200 font-bold">
                Zero Human Interaction Engine
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Autonomous Trip Fulfillment Hub ✈️🏨
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Aegis Concierge can autonomously reserve both flights and accommodations in one click, mapping Alice, Bob, and Charlie's constraints straight to the Demand API.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {!tripStatus.isTripFullyBooked ? (
              <button
                onClick={handleBookEntireTrip}
                className="w-full md:w-auto flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>⚡ 1-Click Auto-Book Full Trip (Flight + Hotel)</span>
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-5 py-3.5 rounded-2xl text-emerald-300 text-xs font-black shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Trip 100% Booked via Demand AI Sandbox</span>
              </div>
            )}
          </div>
        </div>

        {/* 2 Live Sync Cards: Squad Flight & Hotel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
          {/* Flight Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">
                🌸
              </div>
              <div>
                <div className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Squad Flight (SIN ➔ HND)</div>
                <div className="text-sm font-black text-white">Japan Airlines • JL 038</div>
                <div className="text-xs text-slate-300">11:45 AM - 19:30 PM • 3 Travelers</div>
              </div>
            </div>

            <div>
              {tripStatus.isFlightBooked ? (
                <button
                  onClick={() => {
                    setSelectedBooking(tripStatus.flightBooking);
                    setSelectedFlight(null);
                    setSelectedHotel(null);
                    setBookingType('flight');
                    setIsDemandModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PNR: {tripStatus.flightBooking.pnr}</span>
                </button>
              ) : (
                <button
                  onClick={handleAutoBookFlight}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Auto-Book Flight</span>
                </button>
              )}
            </div>
          </div>

          {/* Hotel Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">
                🏨
              </div>
              <div>
                <div className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Squad Stay (Shinjuku)</div>
                <div className="text-sm font-black text-white">Hotel Groove Shinjuku</div>
                <div className="text-xs text-slate-300">Kabukicho Tower • 4 Nights</div>
              </div>
            </div>

            <div>
              {tripStatus.isHotelBooked ? (
                <button
                  onClick={() => {
                    setSelectedBooking(tripStatus.hotelBooking);
                    setSelectedHotel(null);
                    setSelectedFlight(null);
                    setBookingType('hotel');
                    setIsDemandModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ref: {tripStatus.hotelBooking.pnr}</span>
                </button>
              ) : (
                <button
                  onClick={handleAutoBookHotel}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Auto-Book Hotel</span>
                </button>
              )}
            </div>
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

                    <div className="flex items-center gap-2">
                      {/* RedNote Travel Tips Trigger */}
                      <button
                        onClick={() => {
                          setRednoteQuery(item.title);
                          setIsRednoteOpen(true);
                        }}
                        className="flex items-center gap-1.5 text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-2.5 py-1.5 rounded-xl transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
                        title="View RedNote trending travel tips & photo spots"
                      >
                        <span>📕 RedNote Tips</span>
                      </button>

                      {/* Flight Item Handling */}
                      {item.type === 'flight' && (() => {
                        const existing = isFlightBooked(item.title);
                        const matchedFlight = REAL_WORLD_FLIGHTS.find(f =>
                          item.title.toLowerCase().includes(f.flightNumber.toLowerCase()) ||
                          item.title.toLowerCase().includes(f.airline.toLowerCase())
                        ) || defaultFlight;

                        if (existing) {
                          return (
                            <button
                              onClick={() => {
                                setSelectedBooking(existing);
                                setSelectedFlight(null);
                                setSelectedHotel(null);
                                setBookingType('flight');
                                setIsDemandModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 text-indigo-800 hover:text-indigo-950 font-bold bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-xl transition-colors text-xs cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700" />
                              <span>E-Ticket Confirmed (PNR: {existing.pnr})</span>
                            </button>
                          );
                        }

                        return (
                          <button
                            onClick={() => {
                              setSelectedFlight(matchedFlight);
                              setSelectedHotel(null);
                              setSelectedBooking(null);
                              setBookingType('flight');
                              setIsDemandModalOpen(true);
                            }}
                            className="flex items-center gap-1.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold px-3 py-1.5 rounded-xl transition-all text-xs shadow-xs active:scale-95 cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                            <span>⚡ Auto-Book Flight with Demand AI</span>
                          </button>
                        );
                      })()}

                      {/* Stay / Hotel Item Handling */}
                      {item.type === 'stay' && (() => {
                        const existing = isHotelBooked(item.title);
                        const matchedHotel = REAL_WORLD_HOTELS.find(h =>
                          item.title.toLowerCase().includes(h.name.toLowerCase()) ||
                          h.name.toLowerCase().includes(item.title.toLowerCase())
                        ) || {
                          id: 'ht-itinerary',
                          name: item.title,
                          neighborhood: item.location,
                          roomType: 'Deluxe Triple Suite (3 Travelers)',
                          pricePerNightPerPerson: item.costPerPerson || 85,
                          totalPricePerPerson: (item.costPerPerson || 85) * 4,
                          totalGroupStay: (item.costPerPerson || 85) * 4 * 3,
                          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
                          advocate: item.advocate
                        };

                        if (existing) {
                          return (
                            <button
                              onClick={() => {
                                setSelectedBooking(existing);
                                setSelectedHotel(null);
                                setSelectedFlight(null);
                                setBookingType('hotel');
                                setIsDemandModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition-colors text-xs cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Demand AI Booked ({existing.pnr})</span>
                            </button>
                          );
                        }

                        return (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedHotel(matchedHotel);
                                setSelectedFlight(null);
                                setSelectedBooking(null);
                                setBookingType('hotel');
                                setIsDemandModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-bold px-3 py-1.5 rounded-xl transition-all text-xs shadow-xs active:scale-95 cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                              <span>⚡ Auto-Book with Demand AI</span>
                            </button>

                            <a
                              href={generateBookingComUrl({ hotelName: item.title, destination: item.location })}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold text-xs px-2 py-1"
                            >
                              <span>Manual</span>
                            </a>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </>
      )}

      {/* Demand AI Booking & Voucher Modal */}
      <DemandAiBookingModal
        isOpen={isDemandModalOpen}
        onClose={() => setIsDemandModalOpen(false)}
        hotel={selectedHotel}
        flight={selectedFlight}
        bookingType={bookingType}
        existingBooking={selectedBooking}
        travelers={travelers}
        onBookingSuccess={() => setRefreshKey(k => k + 1)}
        onBookingCancel={(id) => {
          cancelStoredBooking(id);
          setRefreshKey(k => k + 1);
        }}
      />

      {/* RedNote Travel Intelligence Modal */}
      <RednoteTravelModal
        isOpen={isRednoteOpen}
        onClose={() => setIsRednoteOpen(false)}
        currentDestination={currentDestination}
        initialSearchQuery={rednoteQuery}
      />
    </div>
  );
}
