import React, { useState } from 'react';
import {
  ShieldCheck,
  Send,
  Lock,
  Sparkles,
  DollarSign,
  Footprints,
  Clock,
  Heart,
  Tag,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Users,
  Copy,
  Check,
  Wand2,
  Brain,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function PersonalizationStudio({
  currentTraveler,
  chatMessages,
  onSendMessage,
  onNavigateToProfile,
  onNavigateToMeeting,
  activeTrip,
  travelers = [],
  itinerary = [],
  agenda = null,
  onGeneratePlanNow,
  isThinking = false
}) {
  const [inputText, setInputText] = useState('');
  const [deadline, setDeadline] = useState(activeTrip?.intakeDeadline || 'Today at 6:00 PM');
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [expandedThinking, setExpandedThinking] = useState({});
  const messagesEndRef = React.useRef(null);

  const travelerMessages = chatMessages[currentTraveler?.id] || [];

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [travelerMessages, isThinking]);

  const toggleThinking = (msgId) => {
    setExpandedThinking(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    onSendMessage(currentTraveler.id, inputText);
    setInputText('');
  };

  const copyTripCode = () => {
    if (activeTrip?.inviteCode) {
      navigator.clipboard.writeText(activeTrip.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const samplePrompts = [
    "What are our planned activities for Day 1 and Day 2?",
    "Who in our squad has the tightest daily budget limit?",
    "I injured my knee last year, keep walking under 10,000 steps.",
    "What is the storm risk on Day 3 and how are we handling it?"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* 1. Squad Intake Coordination Header (Invite Code, Deadline & Instant Generation) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
                Phase 1: Confidential Sub-AI Intake
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Code: {activeTrip?.inviteCode || 'TOKYO-77'}
              </span>
              <button
                onClick={copyTripCode}
                title="Copy Invite Code to share with friends"
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight mt-1">
              {activeTrip?.title || `${activeTrip?.destination || 'Tokyo'} Squad Expedition`}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live ground truth context loaded from Master Itinerary and all 4 squad member profiles.
            </p>
          </div>

          {/* Intake Deadline & Instant Plan Synthesis Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Intake Deadline:</span>
              {isEditingDeadline ? (
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  onBlur={() => setIsEditingDeadline(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingDeadline(false)}
                  className="px-1.5 py-0.5 rounded bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setIsEditingDeadline(true)}
                  className="font-bold text-gray-900 hover:text-purple-600 underline cursor-pointer"
                  title="Click to edit deadline"
                >
                  {deadline}
                </button>
              )}
            </div>

            <button
              onClick={onGeneratePlanNow}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-200" />
              <span>Generate Trip Plan Now</span>
            </button>
          </div>
        </div>

        {/* Squad Members Readiness Tracker */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Squad Readiness:</span>
          </span>
          {travelers.map((t) => {
            const isReady = t.id !== currentTraveler?.id || travelerMessages.length >= 3;
            return (
              <div
                key={t.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${
                  isReady 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <img src={t.avatar} alt={t.name} className="w-4 h-4 rounded-full object-cover" />
                <span>{t.name}</span>
                <span>{isReady ? '✓' : '• consulting'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Grid: 1-on-1 Chat Stream + Real-Time Persona Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chat Conversation Stream (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl flex flex-col h-[620px] shadow-xs overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-base shadow-2xs">
                {currentTraveler.agentAvatar}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <span>{currentTraveler.agentName}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                </div>
                <div className="text-[10px] text-gray-500">
                  Advocate for {currentTraveler.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
                <span>LangGraph Agent Active</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 bg-white px-2.5 py-1 rounded-lg border border-gray-200 font-medium">
                <Lock className="w-3 h-3 text-gray-400" />
                <span>Confidential</span>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/30">
            {travelerMessages.map((msg) => {
              const isBot = msg.sender === 'bot';

              if (!isBot) {
                return (
                  <div key={msg.id} className="flex items-start gap-2.5 justify-end">
                    <div className="max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed bg-purple-600 text-white shadow-xs font-medium">
                      {msg.text}
                    </div>
                  </div>
                );
              }

              // Extract thinking text if present
              let thinking = msg.thinking;
              let displayText = msg.text || '';
              if (!thinking && displayText.includes('<thinking>')) {
                const match = displayText.match(/<thinking>([\s\S]*?)<\/thinking>/i);
                if (match) {
                  thinking = match[1].trim();
                  displayText = displayText.replace(/<thinking>[\s\S]*?<\/thinking>/i, '').trim();
                }
              }

              // Default fallback thinking if seed message
              if (!thinking && msg.id > 1) {
                thinking = `Audited ${currentTraveler.name}'s constraints ($${currentTraveler.budgetDaily}/d budget, ${currentTraveler.walkingLimitSteps} steps limit) against ${activeTrip?.destination || 'Tokyo'} Master Itinerary.`;
              }

              const isThinkingOpen = expandedThinking[msg.id];

              return (
                <div key={msg.id} className="flex items-start gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm shrink-0 mt-0.5 shadow-2xs">
                    {currentTraveler.agentAvatar}
                  </div>

                  <div className="max-w-[88%] space-y-1.5">
                    {/* Collapsible Thinking & Context Analysis Block */}
                    {thinking && (
                      <div className="bg-slate-900 text-slate-100 rounded-xl p-2.5 text-xs shadow-2xs border border-slate-800 space-y-2">
                        <div
                          onClick={() => toggleThinking(msg.id)}
                          className="flex items-center justify-between cursor-pointer select-none text-[11px] font-semibold text-purple-300 hover:text-purple-200"
                        >
                          <div className="flex items-center gap-1.5">
                            <Brain className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                            <span>AI Reasoning & Context Analysis</span>
                          </div>
                          <span className="text-[10px] text-slate-400 bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                            {isThinkingOpen ? (
                              <><span>Hide</span><ChevronUp className="w-3 h-3" /></>
                            ) : (
                              <><span>View Reasoning</span><ChevronDown className="w-3 h-3" /></>
                            )}
                          </span>
                        </div>

                        {isThinkingOpen && (
                          <div className="pt-2 border-t border-slate-800 space-y-2 text-[11px] leading-relaxed text-slate-300">
                            {/* Context badges */}
                            <div className="flex flex-wrap gap-1">
                              <span className="px-1.5 py-0.5 rounded bg-purple-950/90 text-purple-300 border border-purple-800/70 text-[9px] font-bold">
                                ✓ Budget: ${currentTraveler.budgetDaily}/d
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-800/70 text-[9px] font-bold">
                                ✓ Step Limit: {Number(currentTraveler.walkingLimitSteps).toLocaleString()}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-950/90 text-blue-300 border border-blue-800/70 text-[9px] font-bold">
                                ✓ Itinerary Grounded
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap font-mono text-[10.5px] text-slate-300/95 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                              {thinking}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Final Answer Text */}
                    <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl p-3 text-xs leading-relaxed shadow-2xs whitespace-pre-wrap">
                      {displayText}
                    </div>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-start gap-2.5 justify-start animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm shrink-0 mt-0.5 shadow-2xs">
                  {currentTraveler.agentAvatar}
                </div>
                <div className="rounded-2xl p-3 bg-slate-900 text-slate-100 border border-purple-500/50 shadow-2xs text-xs space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-purple-300">
                    <Brain className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                    <span>{currentTraveler.agentName} is analyzing squad context & reasoning with Gemini</span>
                    <span className="flex gap-1 items-center ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Checking budget ($${currentTraveler.budgetDaily}/d), stamina limits ({currentTraveler.walkingLimitSteps} steps), and Master Itinerary...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
              Prompts:
            </span>
            {[
              "What's our plan for Day 2 in Asakusa?",
              "Update my daily budget to $180",
              "Can we keep walking under 8,000 steps?",
              "How are Alice and Bob's constraints handled?"
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(p)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-medium transition-colors cursor-pointer truncate max-w-[200px]"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${currentTraveler.agentName} in confidence...`}
              className="flex-1 px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Column: Real-Time Preferences Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Learned Parameters
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Represented at the squad meeting table
                </p>
              </div>
              <button
                onClick={onNavigateToProfile}
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="space-y-3">
              {/* Daily Budget */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-purple-600" />
                  Daily Budget Cap
                </span>
                <span className="font-bold text-gray-900">
                  ${currentTraveler.budgetDaily}/day
                </span>
              </div>

              {/* Walking Pace */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                    <Footprints className="w-3.5 h-3.5 text-purple-600" />
                    Step Limit
                  </span>
                  <span className="font-bold text-gray-900">
                    {currentTraveler.walkingLimitSteps?.toLocaleString() || '12,000'} steps max
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, ((currentTraveler.walkingLimitSteps || 12000) / 30000) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Wake-up Time */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  Earliest Wake Up
                </span>
                <span className="font-bold text-gray-900">
                  {currentTraveler.preferredWakeUp || '9:00 AM'}
                </span>
              </div>

              {/* Food & Vibe */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                <div className="text-xs text-gray-600 font-medium flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-purple-600" />
                  Dietary Passions
                </div>
                <div className="text-xs font-semibold text-gray-900">
                  {currentTraveler.dietary}
                </div>
              </div>

              {/* Identified Preferences tags */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
                <div className="text-xs text-gray-600 font-medium flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-purple-600" />
                  Active Preference Tags
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {(currentTraveler.identifiedPreferences || [
                    '#AuthenticLocalFood',
                    `#Budget$${currentTraveler.budgetDaily}`,
                    '#ShelteredWeatherGems'
                  ]).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white text-gray-800 border border-gray-200 text-[11px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onNavigateToProfile}
                className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Edit Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick link to Meeting Table */}
          <button
            type="button"
            onClick={onNavigateToMeeting}
            className="w-full p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-medium shadow-xs transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-left">
              <Sparkles className="w-4 h-4 text-purple-200" />
              <div>
                <div className="font-bold">Join Meeting Table</div>
                <div className="text-[11px] text-purple-100 font-normal">
                  Deliberate options and compromises with the squad
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
