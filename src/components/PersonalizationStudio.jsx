import React, { useState } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  Send,
  Lock,
  EyeOff,
  Sparkles,
  Sliders,
  DollarSign,
  Footprints,
  Clock,
  Heart,
  Smile,
  CheckCircle2
} from 'lucide-react';

export default function PersonalizationStudio({
  currentTraveler,
  chatMessages,
  onSendMessage,
  onUpdateTraveler
}) {
  const [inputText, setInputText] = useState('');

  const travelerMessages = chatMessages[currentTraveler.id] || [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(currentTraveler.id, inputText);
    setInputText('');
  };

  const samplePrompts = [
    "I injured my knee last year, so let's keep walking under 10,000 steps.",
    "I want at least one fancy matcha tea ceremony experience.",
    "Please don't book any flights or morning tours before 9:30 AM.",
    "I'm feeling stressed about spending over $180 per day."
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Friendly Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-3xl shadow-xs shrink-0">
              {currentTraveler.agentAvatar}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Your Personal Concierge 💬
                </h2>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                  1-on-1 Confidential
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Tell <strong className="text-purple-700">{currentTraveler.agentName}</strong> your real, unfiltered feelings. 
                Your agent handles the group diplomacy so you don’t have to compromise your joy.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-50/70 px-4 py-2.5 rounded-2xl border border-purple-100 text-xs text-purple-800 font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Private Notes Never Leaked</span>
          </div>
        </div>
      </div>

      {/* Grid: 1-on-1 Chat Stream + Real-Time Persona Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Chat Conversation Stream (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl flex flex-col h-[700px] shadow-xs overflow-hidden">
          {/* Chat Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                {currentTraveler.agentAvatar}
              </div>
              <div>
                <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>{currentTraveler.agentName}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-xs text-slate-500">
                  Advocate for {currentTraveler.name} • {currentTraveler.agentTone}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/60 font-semibold">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Safe Space</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fafbfd]">
            {travelerMessages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-9 h-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-lg shrink-0 mt-0.5 shadow-xs">
                      {currentTraveler.agentAvatar}
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed ${
                      isBot
                        ? 'bg-white border border-slate-200/80 text-slate-800 shadow-xs'
                        : 'bg-indigo-600 text-white rounded-br-xs shadow-sm font-medium'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {!isBot && (
                    <img
                      src={currentTraveler.avatar}
                      alt={currentTraveler.name}
                      className="w-9 h-9 rounded-2xl object-cover border border-indigo-200 shrink-0 mt-0.5 shadow-xs"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Suggested Prompts Quick Taps */}
          <div className="px-5 py-3 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2.5 text-xs">
            <span className="text-slate-400 whitespace-nowrap font-bold">Try tapping:</span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(prompt)}
                className="whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all font-medium text-xs"
              >
                "{prompt.slice(0, 32)}..."
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-2.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Share secret budget caps, fears, or must-haves with ${currentTraveler.agentName}...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right Column: Persona Blueprint (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-purple-600" />
                <h3 className="font-black text-base text-slate-900">Extracted Persona Blueprint</h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Synced with Table
              </span>
            </div>

            <div className="space-y-4">
              {/* Daily Budget */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    Comfortable Budget Limit
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    ${currentTraveler.budgetDaily} / day
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${(currentTraveler.budgetDaily / 400) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Walking Pace */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-sky-500" />
                    Daily Step Comfort
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    {currentTraveler.walkingLimitSteps.toLocaleString()} steps max
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full"
                    style={{ width: `${(currentTraveler.walkingLimitSteps / 30000) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Wake-up Time */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  Earliest Wake Up
                </span>
                <span className="font-black text-slate-900 text-sm">
                  {currentTraveler.preferredWakeUp}
                </span>
              </div>

              {/* Food & Vibe */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-xs text-slate-500 font-bold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Food & Atmosphere
                </div>
                <div className="text-xs font-bold text-slate-800">
                  {currentTraveler.dietary}
                </div>
              </div>

              {/* Private Notes */}
              <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200/70 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                  <EyeOff className="w-4 h-4" />
                  <span>Private Truth (Shared only with your Sub-AI)</span>
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{currentTraveler.privateNotes}"
                </p>
              </div>
            </div>
          </div>

          {/* Friendly Guidance Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Why Offline Deliberation Works
              </h4>
            </div>
            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] shrink-0 mt-0.5 font-bold">1</div>
                <div><strong>Zero awkwardness:</strong> Tell your AI your real limits without worrying about looking cheap or difficult.</div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[11px] shrink-0 mt-0.5 font-bold">2</div>
                <div><strong>Smart Representation:</strong> At the squad round table, your AI advocates kindly on your behalf.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
