import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Bot,
  MessageCircle,
  Zap,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  Check,
  ArrowRight
} from 'lucide-react';

export default function MeetingPokerTable({
  currentTraveler,
  travelers,
  agenda,
  onResolveDilemma,
  dilemmaResolved
}) {
  const [selectedOption, setSelectedOption] = useState(agenda.dilemmaOptions[2].id);
  const [votes, setVotes] = useState({
    alice: 'opt-c',
    bob: 'opt-c',
    charlie: 'opt-c'
  });
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [speechBubbles, setSpeechBubbles] = useState({
    alice: "Option C fits my budget and has delicious authentic food.",
    bob: "Option C has the craft sake tasting — count me in!",
    charlie: "Option C is sheltered and under 1,500 steps. Perfect.",
    orchestrator: "Option C achieves unanimous 96% harmony across all constraints."
  });
  const [logs, setLogs] = useState([
    {
      sender: 'Aegis (Main AI Guide)',
      type: 'orchestrator',
      avatar: '✨',
      text: 'Synthesized everyone’s offline constraints to recommend 3 indoor alternatives for Day 3.',
      time: 'Just now'
    },
    {
      sender: 'Alice-Bot',
      type: 'sub-ai',
      avatar: '🍲',
      text: 'Option C (Soba Masterclass) stays comfortably under Alice’s $150 daily budget.',
      time: '1m ago'
    },
    {
      sender: 'Bob-Bot',
      type: 'sub-ai',
      avatar: '⚡',
      text: 'Bob likes the 5-pour craft sake tasting in Option C.',
      time: '30s ago'
    },
    {
      sender: 'Charlie-Bot',
      type: 'sub-ai',
      avatar: '📷',
      text: 'Option C is 100% weather-sheltered and low walking fatigue for Charlie.',
      time: '10s ago'
    }
  ]);
  const [isSimulatingDebate, setIsSimulatingDebate] = useState(false);
  const [customArgument, setCustomArgument] = useState('');
  const [showLogDrawer, setShowLogDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close fullscreen on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const runSubAIDebate = () => {
    setIsSimulatingDebate(true);
    const steps = [
      {
        speaker: 'orchestrator',
        text: 'Reviewing group comfort zones for Day 3 indoor contingency...',
        log: { sender: 'Aegis (Lead AI)', type: 'orchestrator', avatar: '✨', text: 'Analyzing everyone’s private comfort zones for Day 3 indoor contingency.', time: 'Just now' }
      },
      {
        speaker: 'alice',
        text: 'Checking Alice’s notes: Option C is under $35 and authentic.',
        log: { sender: 'Alice-Bot', type: 'sub-ai', avatar: '🍲', text: 'Voted for Option C to protect Alice’s comfortable dining budget.', time: 'Just now' }
      },
      {
        speaker: 'bob',
        text: 'Craft sake tasting in Option C sounds awesome to Bob.',
        log: { sender: 'Bob-Bot', type: 'sub-ai', avatar: '⚡', text: 'Bob-Bot accepts Option C compromise with excitement for the sake flight.', time: 'Just now' }
      },
      {
        speaker: 'charlie',
        text: 'Dry, indoor studio under 1,500 steps. Zero group fatigue.',
        log: { sender: 'Charlie-Bot', type: 'sub-ai', avatar: '📷', text: 'Charlie-Bot confirms Option C matches Charlie’s mindful pacing.', time: 'Just now' }
      },
      {
        speaker: 'orchestrator',
        text: 'Unanimous 3/3 consensus reached on Option C!',
        log: { sender: 'Aegis (Lead AI)', type: 'orchestrator', avatar: '✨', text: 'Unanimous consensus reached on Option C! Ready to lock into the trip plan.', time: 'Just now' }
      }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setActiveSpeaker(step.speaker);
        setSpeechBubbles(prev => ({ ...prev, [step.speaker]: step.text }));
        setLogs(prev => [step.log, ...prev]);
        if (index === steps.length - 1) {
          setIsSimulatingDebate(false);
          setTimeout(() => setActiveSpeaker(null), 3500);
        }
      }, (index + 1) * 1200);
    });
  };

  const handleVote = (optionId) => {
    setSelectedOption(optionId);
    setVotes(prev => ({
      ...prev,
      [currentTraveler.id]: optionId
    }));

    const chosen = agenda.dilemmaOptions.find(o => o.id === optionId);
    const newLog = {
      sender: `${currentTraveler.name} (You)`,
      type: 'user',
      avatar: currentTraveler.avatar,
      isImage: true,
      text: `Selected ${chosen?.title.split(':')[0]}`,
      time: 'Just now'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleSubAIIntervene = () => {
    const interveneLog = {
      sender: currentTraveler.agentName,
      type: 'sub-ai',
      avatar: currentTraveler.agentAvatar,
      text: `Advocating for ${currentTraveler.name}: Prioritizing their comfort zone and budget cap.`,
      time: 'Just now'
    };
    setActiveSpeaker(currentTraveler.id);
    setSpeechBubbles(prev => ({
      ...prev,
      [currentTraveler.id]: `Speaking up for ${currentTraveler.name}: Option C best balances their personal priorities.`
    }));
    setLogs(prev => [interveneLog, ...prev]);
    setTimeout(() => setActiveSpeaker(null), 3500);
  };

  const handleLockInConsensus = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    onResolveDilemma(selectedOption);
    if (isFullscreen) setIsFullscreen(false);
  };

  const getSeatTraveler = (id) => travelers.find(t => t.id === id);
  const selectedOptionData = agenda.dilemmaOptions.find(o => o.id === selectedOption) || agenda.dilemmaOptions[2];

  return (
    <div className={`transition-all ${
      isFullscreen
        ? 'fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto p-6 sm:p-10 flex flex-col justify-between'
        : 'w-full max-w-[1600px] mx-auto px-4 sm:px-8 py-6 space-y-6'
    }`}>
      {/* Minimalist Top Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Squad Round Table
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 font-medium">
                Day 3 Contingency
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Sub-AIs negotiating compromises based on private constraints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={runSubAIDebate}
            disabled={isSimulatingDebate}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulatingDebate ? 'animate-spin text-amber-300' : 'text-amber-400'}`} />
            <span>{isSimulatingDebate ? 'Agents Discussing...' : 'Simulate Deliberation'}</span>
          </button>

          <button
            onClick={() => setShowLogDrawer(!showLogDrawer)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              showLogDrawer
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>{showLogDrawer ? 'Hide Feed' : 'Feed'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Table Area + Optional Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* The Round Table Arena */}
        <div className={`${showLogDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6 transition-all`}>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
            
            {/* Upper Seats: Alice & Bob */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              {/* Alice (Seat 1) */}
              <div className="flex items-center gap-3.5 max-w-xs">
                <div className="relative shrink-0">
                  <img
                    src={getSeatTraveler('alice').avatar}
                    alt="Alice"
                    className={`w-12 h-12 rounded-2xl object-cover border transition-all ${
                      activeSpeaker === 'alice' ? 'border-emerald-500 ring-4 ring-emerald-100' : 'border-slate-200'
                    }`}
                  />
                  <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full p-0.5 border border-slate-200">
                    🍲
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Alice Lin</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-medium">
                      Alice-Bot
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Prefers Option C • &lt;${getSeatTraveler('alice').budgetDaily}/d
                  </div>
                  {speechBubbles.alice && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50/70 border border-emerald-100 px-2.5 py-1 rounded-lg mt-1">
                      "{speechBubbles.alice}"
                    </div>
                  )}
                </div>
              </div>

              {/* Bob (Seat 2) */}
              <div className="flex items-center sm:flex-row-reverse gap-3.5 max-w-xs sm:text-right">
                <div className="relative shrink-0">
                  <img
                    src={getSeatTraveler('bob').avatar}
                    alt="Bob"
                    className={`w-12 h-12 rounded-2xl object-cover border transition-all ${
                      activeSpeaker === 'bob' ? 'border-amber-500 ring-4 ring-amber-100' : 'border-slate-200'
                    }`}
                  />
                  <span className="absolute -bottom-1 -left-1 text-xs bg-white rounded-full p-0.5 border border-slate-200">
                    ⚡
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center sm:justify-end gap-2">
                    <span className="text-xs font-bold text-slate-900">Bob Martinez</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-medium">
                      Bob-Bot
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Prefers Option C • Sake flight & thrills
                  </div>
                  {speechBubbles.bob && (
                    <div className="text-[11px] text-amber-900 bg-amber-50/70 border border-amber-100 px-2.5 py-1 rounded-lg mt-1">
                      "{speechBubbles.bob}"
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Central Decision Box: The Core Focus */}
            <div className="my-8 max-w-4xl mx-auto bg-slate-50/70 border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Disruption Contingency
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Day 3 Tokyo Bay Boat Cruise Cancelled (Coastal Gale)
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-100/70 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3/3 Consensus on Option C</span>
                </div>
              </div>

              {/* Lead Guide Note */}
              <div className="flex items-start gap-3 p-3.5 bg-white border border-indigo-100 rounded-xl text-xs text-slate-700">
                <span className="text-base leading-none">✨</span>
                <p className="leading-relaxed">
                  <strong className="text-indigo-700 font-semibold">Aegis Concierge:</strong> Option C (Tsukiji Soba Masterclass) satisfies Alice’s budget cap, keeps Charlie sheltered under 1,500 steps, and excites Bob with artisanal sake tasting.
                </p>
              </div>

              {/* Minimalist 3-Option Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {agenda.dilemmaOptions.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  const matchRate = opt.id === 'opt-c' ? '96%' : opt.id === 'opt-a' ? '74%' : '48%';
                  const isTop = opt.id === 'opt-c';

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleVote(opt.id)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-xs'
                          : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      {isTop && (
                        <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full">
                          RECOMMENDED
                        </span>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">
                            {opt.title.split(':')[0]}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600">
                            {opt.cost}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">
                          {opt.title.split(':')[1]}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Squad Fit:</span>
                        <span className={`font-bold ${isTop ? 'text-emerald-600' : 'text-slate-600'}`}>
                          {matchRate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lower Seats: Current Traveler (You) & Charlie */}
            <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mt-8">
              {/* Current Traveler (Seat 4 / You) */}
              <div className="flex items-center gap-3.5 max-w-xs">
                <div className="relative shrink-0">
                  <img
                    src={currentTraveler.avatar}
                    alt={currentTraveler.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-indigo-300 ring-2 ring-indigo-100"
                  />
                  <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full p-0.5 border border-indigo-200">
                    {currentTraveler.agentAvatar}
                  </span>
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{currentTraveler.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded font-medium">
                      You
                    </span>
                  </div>
                  <button
                    onClick={handleSubAIIntervene}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Bot className="w-3 h-3" />
                    <span>Chime in with Sub-AI</span>
                  </button>
                </div>
              </div>

              {/* Charlie (Seat 3) */}
              <div className="flex items-center sm:flex-row-reverse gap-3.5 max-w-xs sm:text-right">
                <div className="relative shrink-0">
                  <img
                    src={getSeatTraveler('charlie').avatar}
                    alt="Charlie"
                    className={`w-12 h-12 rounded-2xl object-cover border transition-all ${
                      activeSpeaker === 'charlie' ? 'border-sky-500 ring-4 ring-sky-100' : 'border-slate-200'
                    }`}
                  />
                  <span className="absolute -bottom-1 -left-1 text-xs bg-white rounded-full p-0.5 border border-slate-200">
                    📷
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center sm:justify-end gap-2">
                    <span className="text-xs font-bold text-slate-900">Charlie Zhang</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-medium">
                      Charlie-Bot
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Prefers Option C • &lt;1,500 steps, sheltered
                  </div>
                  {speechBubbles.charlie && (
                    <div className="text-[11px] text-sky-900 bg-sky-50/70 border border-sky-100 px-2.5 py-1 rounded-lg mt-1">
                      "{speechBubbles.charlie}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Minimalist Single Action Bar: Clean & High Clarity */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="text-xs">
              <span className="text-slate-400">Chosen Plan: </span>
              <span className="font-bold text-slate-900">
                {selectedOptionData.title} ({selectedOptionData.cost})
              </span>
            </div>

            <button
              onClick={handleLockInConsensus}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Lock Into Master Itinerary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Deliberation Feed (Clean Side Drawer) */}
        {showLogDrawer && (
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col h-[680px] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-900">
                Deliberation Log
              </h3>
              <span className="text-[11px] text-slate-400">
                {logs.length} entries
              </span>
            </div>

            {/* Feed items */}
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>{log.avatar}</span>
                      <span>{log.sender}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{log.time}</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {log.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick message form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!customArgument.trim()) return;
                const newLog = {
                  sender: `${currentTraveler.name}`,
                  type: 'user',
                  avatar: currentTraveler.avatar,
                  isImage: true,
                  text: customArgument,
                  time: 'Just now'
                };
                setLogs(prev => [newLog, ...prev]);
                setSpeechBubbles(prev => ({
                  ...prev,
                  [currentTraveler.id]: customArgument
                }));
                setCustomArgument('');
              }}
              className="pt-3 border-t border-slate-100 flex gap-2"
            >
              <input
                type="text"
                placeholder={`Speak as ${currentTraveler.name}...`}
                value={customArgument}
                onChange={(e) => setCustomArgument(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
