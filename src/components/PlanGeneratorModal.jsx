import React, { useState } from 'react';
import {
  Sparkles,
  X,
  MapPin,
  Calendar,
  Compass,
  Footprints,
  DollarSign,
  Clock,
  Heart,
  Bot,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { generatePlanWithAI, hasApiKey } from '../services/geminiService';
import { executeFullTripAutonomousBooking } from '../services/bookingDemandAiService';

export default function PlanGeneratorModal({
  isOpen,
  onClose,
  travelers,
  onPlanGenerated
}) {
  const [destination, setDestination] = useState('Tokyo');
  const [durationDays, setDurationDays] = useState(4);
  const [theme, setTheme] = useState('Hidden Gems & Foodie');
  const [pace, setPace] = useState('Balanced');
  const [isGenerating, setIsGenerating] = useState(false);
  const [autoBookDemandAi, setAutoBookDemandAi] = useState(true);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const newPlan = await generatePlanWithAI({
        destination,
        durationDays,
        theme,
        pace,
        travelers
      });

      if (autoBookDemandAi) {
        // Execute autonomous Demand AI flight and hotel booking in the background for this destination
        await executeFullTripAutonomousBooking({
          hotel: {
            id: `ht-${destination.toLowerCase()}`,
            name: `${destination} Grand Central Hotel & Suites`,
            neighborhood: `${destination} Center`,
            roomType: 'Deluxe Triple Suite (3 Travelers)',
            pricePerNightPerPerson: 85,
            totalPricePerPerson: 340,
            totalGroupStay: 1020,
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
          },
          flight: {
            id: `fl-${destination.toLowerCase()}`,
            airline: 'All Nippon Airways (ANA)',
            airlineLogo: '✈️',
            flightNumber: 'NH 802',
            origin: 'Singapore (SIN)',
            destination: destination,
            departTime: '06:10 AM',
            arriveTime: '13:55 PM',
            duration: '6h 45m',
            baggage: '2 x 23kg included',
            pricePerPerson: 420,
            totalGroupPrice: 1260
          },
          travelers
        });
      }

      onPlanGenerated(newPlan, destination, { autoBooked: autoBookDemandAi });
      setIsGenerating(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  const presetDestinations = [
    { name: 'Tokyo', flag: '🇯🇵', subtitle: 'Neon, Ramen & Tech' },
    { name: 'Kyoto', flag: '⛩️', subtitle: 'Zen Groves & Shrines' },
    { name: 'Paris', flag: '🇫🇷', subtitle: 'Bistros, Art & Seine' },
    { name: 'Seoul', flag: '🇰🇷', subtitle: 'K-Food, Night Markets' },
    { name: 'Bali', flag: '🌴', subtitle: 'Villas, Waterfalls & Surf' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-slate-900">AI Plan Generator</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                  {hasApiKey() ? 'Gemini 1.5/2.0 Active' : 'Demo Engine'}
                </span>
              </div>
              <p className="text-xs text-slate-500">Synthesizes all 3 Sub-AI constraints into a balanced master trip</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleGenerate} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Choose Destination:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presetDestinations.map(dest => (
                <button
                  type="button"
                  key={dest.name}
                  onClick={() => setDestination(dest.name)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    destination === dest.name
                      ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200'
                      : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="text-xl mb-1">{dest.flag}</div>
                  <div className="font-extrabold text-xs text-slate-900">{dest.name}</div>
                  <div className="text-[10px] text-slate-500">{dest.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Pace */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Trip Length:
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value={3}>3 Days (Weekend Escape)</option>
                <option value={4}>4 Days (Balanced Break)</option>
                <option value={5}>5 Days (Deep Explorer)</option>
                <option value={7}>7 Days (Full Grand Tour)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pacing Style:
              </label>
              <select
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value="Relaxed">Relaxed (Under 8,000 steps)</option>
                <option value="Balanced">Balanced (8k - 14k steps)</option>
                <option value="High Energy">High Energy (20,000+ steps)</option>
              </select>
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Primary Squad Theme:
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-500"
            >
              <option value="Hidden Gems & Foodie">Hidden Gems & Foodie Crawls</option>
              <option value="Cyberpunk, Arcades & Nightlife">Cyberpunk, Arcades & Nightlife</option>
              <option value="Mindful Art, Temples & Zen Pacing">Mindful Art, Temples & Zen Pacing</option>
              <option value="Balanced Squad Compromise">Balanced Squad Compromise (All Vibes)</option>
            </select>
          </div>

          {/* Autonomous Demand AI Full-Trip Booking Toggle */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/90 to-blue-50/90 border border-indigo-200/70 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span>Autonomous Demand AI Full-Trip Booking</span>
                  <span className="text-[9px] bg-indigo-100 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded">
                    Sandbox v3.2
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Auto-reserve flights & hotel upon generation with zero human typing
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoBookDemandAi}
                onChange={(e) => setAutoBookDemandAi(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Group Constraints Auto-Injected */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>Multi-Agent Constraint Locks Injected:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <strong className="text-slate-800">Alice:</strong> Max $150/d budget cap & ramen focus.
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <strong className="text-slate-800">Bob:</strong> No mornings before 10:30 AM & night spots.
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <strong className="text-slate-800">Charlie:</strong> Max 8,000 steps & quiet cafes.
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate New Escape Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
