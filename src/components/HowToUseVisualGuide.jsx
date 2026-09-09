import React from 'react';
import {
  Sparkles,
  MessageSquare,
  Users,
  Zap,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Bot,
  Plane,
  Building2,
  CloudRain,
  CheckCircle2,
  Star,
  Check,
  Coffee,
  Ticket
} from 'lucide-react';

export default function HowToUseVisualGuide({
  onGeneratePlan,
  onLoadDemo,
  onNavigateToMeeting,
  onNavigateToPersonal,
  onNavigateToBookings,
  hasItinerary = false
}) {
  const steps = [
    {
      step: '01',
      badge: 'Private & Uncensored',
      title: 'Confidential 1-on-1 Studio',
      subtitle: 'Speak freely with your personal Sub-AI concierge',
      icon: MessageSquare,
      iconColor: 'from-purple-500 to-indigo-600',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      description:
        'Tell your Sub-AI your secret constraints without group judgment: daily budget limits, strict "no waking up before 10:30 AM" rules, or walking fatigue caps. Your private preferences are kept confidential.',
      preview: {
        type: 'chat',
        title: 'Alice & Alice-Bot (1-on-1)',
        items: [
          { sender: 'Alice', text: 'I secretly hate paying $200+ for tiny dinners. Max $150/d budget cap!' },
          { sender: 'Alice-Bot', text: 'Locked! I’ll diplomatically champion authentic gems so you never feel pressured.' }
        ]
      },
      actionText: 'Open 1-on-1 Studio',
      onAction: onNavigateToPersonal
    },
    {
      step: '02',
      badge: 'No Drama Consensus',
      title: 'The Squad Round Table Arena',
      subtitle: 'Sub-AIs debate trade-offs at a wide virtual table',
      icon: Users,
      iconColor: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description:
        'Every traveler is seated with their Sub-AI. When a dilemma arises (like weather disruptions or restaurant picks), the Sub-AIs advocate for their humans while lead guide Aegis calculates win-win compromises.',
      preview: {
        type: 'consensus',
        title: 'Round Table Live Consensus',
        harmony: 96,
        votes: [
          { name: 'Alice-Bot', reason: 'Fits $150 budget cap ($35 dinner)' },
          { name: 'Bob-Bot', reason: 'Includes artisanal sake flight' },
          { name: 'Charlie-Bot', reason: '100% weather safe & under 1,500 steps' }
        ]
      },
      actionText: 'Enter The Round Table',
      onAction: onNavigateToMeeting
    },
    {
      step: '03',
      badge: 'Zero Human Typing',
      title: 'Demand AI Autonomous Booking',
      subtitle: '1-click flight & hotel fulfillment via Demand API Sandbox',
      icon: Zap,
      iconColor: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      description:
        'Skip repetitive checkout forms. Aegis auto-binds Alice, Bob, and Charlie’s passenger manifest, seating (14A, 14B, 14C), and room preferences directly into Booking.com Demand API Sandbox v3.2.',
      preview: {
        type: 'booking',
        title: 'Demand API Confirmed Vouchers',
        flight: 'Japan Airlines JL 038 • PNR #JL84X2',
        hotel: 'Hotel Groove Shinjuku • Ref #BKG-DEMAND-749',
        total: '$1,380 Flights + $1,020 Stay (Pre-authorized)'
      },
      actionText: 'View Booking Hub',
      onAction: onNavigateToBookings
    },
    {
      step: '04',
      badge: 'Disruption Proof',
      title: 'Master Timeline & World Radar',
      subtitle: 'Adaptive multi-day schedule with live weather replanning',
      icon: Calendar,
      iconColor: 'from-blue-500 to-indigo-600',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      description:
        'AI monitors meteorological feeds and transit delays. If an outdoor activity is threatened by storm surges, the squad is notified immediately with indoor alternatives already priced and vetted.',
      preview: {
        type: 'radar',
        title: 'Meteorological Feeds',
        alert: '⚠️ Tropical Storm Warning (Day 3 Cruise threatened)',
        resolution: '✅ Replaced with Soba Masterclass (Unanimous)'
      },
      actionText: 'Explore Itinerary',
      onAction: onLoadDemo
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Professional Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider border border-indigo-400/30 flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Next-Gen Multi-Agent Travel Planner
            </span>
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              EscapePlan AI • Professional Architecture
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            How EscapePlan AI Plans Your Perfect Escape ✈️✨
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Coordinating trips with friends often leads to unspoken compromises and awkward budgeting. 
            EscapePlan AI solves this with <strong>personal Sub-AI concierges</strong>, a <strong>virtual round table</strong>, and <strong>autonomous Booking.com Demand AI fulfillment</strong>.
          </p>

          {/* Quick CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={onGeneratePlan}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate New AI Plan</span>
            </button>

            <button
              onClick={onLoadDemo}
              className="flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-2xl border border-white/20 transition-all cursor-pointer"
            >
              <span>Load Tokyo Demo Itinerary (4 Days)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Workflow Steps Grid */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              The 4-Step Multi-Agent Engine
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              How private constraints transform into a confirmed, disruption-safe master trip
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((s) => {
            const IconComponent = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6 hover:border-indigo-300 transition-all group"
              >
                <div className="space-y-4">
                  {/* Top Row: Step Number & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.iconColor} text-white flex items-center justify-center shadow-md shrink-0`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          Step {s.step}
                        </span>
                        <h4 className="text-lg font-black text-slate-900 leading-tight">
                          {s.title}
                        </h4>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black border uppercase tracking-wider ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {s.description}
                  </p>

                  {/* Interactive Visual Preview Box */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 text-xs space-y-2.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                      <span>{s.preview.title}</span>
                      <span className="text-indigo-600 font-extrabold text-[10px]">Live Feature</span>
                    </div>

                    {s.preview.type === 'chat' && (
                      <div className="space-y-2">
                        {s.preview.items.map((m, i) => (
                          <div
                            key={i}
                            className={`p-2.5 rounded-xl text-xs ${
                              m.sender === 'Alice'
                                ? 'bg-indigo-50 border border-indigo-100 text-indigo-950 font-medium'
                                : 'bg-white border border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-extrabold text-[10px] block text-slate-400 mb-0.5">
                              {m.sender}:
                            </span>
                            {m.text}
                          </div>
                        ))}
                      </div>
                    )}

                    {s.preview.type === 'consensus' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                          <span className="font-bold text-slate-700">Aegis Harmony Score</span>
                          <span className="font-black text-emerald-600">96% Compromise</span>
                        </div>
                        {s.preview.votes.map((v, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] text-slate-600">
                            <span className="font-bold text-slate-800">{v.name}:</span>
                            <span className="truncate max-w-[200px] text-slate-500">{v.reason}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {s.preview.type === 'booking' && (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Plane className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="font-bold text-slate-800">{s.preview.flight}</span>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                            E-Tickets
                          </span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="font-bold text-slate-800">{s.preview.hotel}</span>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                            Voucher
                          </span>
                        </div>
                      </div>
                    )}

                    {s.preview.type === 'radar' && (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-bold flex items-center gap-1.5">
                          <CloudRain className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{s.preview.alert}</span>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{s.preview.resolution}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  onClick={s.onAction}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-2xl text-xs font-bold transition-all cursor-pointer group-hover:bg-indigo-600 group-hover:text-white"
                >
                  <span>{s.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
