import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Bot,
  MessageCircle,
  ThumbsUp,
  Award,
  Zap,
  Info,
  Layers,
  Send,
  Coffee,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  Minimize2,
  X
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
  const [activeSpeaker, setActiveSpeaker] = useState('orchestrator');
  const [speechBubbles, setSpeechBubbles] = useState({
    alice: "Option C fits my $150 budget and has cozy authentic food! 🍲",
    bob: "I’m in for Option C because of the artisanal sake flight! 🍶⚡",
    charlie: "Option C is calm, indoors away from the storm, and under 1,500 steps. Perfect! 📷",
    orchestrator: "Hello squad! I’ve reviewed everyone's offline chats. Option C hits 96% group harmony!"
  });
  const [logs, setLogs] = useState([
    {
      sender: 'Aegis (Main AI Guide)',
      type: 'orchestrator',
      avatar: '✨',
      text: 'Good morning squad! Weather radar detected a coastal storm on Day 3. I synthesized everyone’s offline preferences to bring 3 great indoor alternatives to the table!',
      time: 'Just now'
    },
    {
      sender: 'Alice-Bot',
      type: 'sub-ai',
      avatar: '🍲',
      text: 'Option B exceeds Alice’s comfortable daily budget. Option C (Soba Masterclass) is super cozy, authentic, and perfectly under her $150 cap!',
      time: '1m ago'
    },
    {
      sender: 'Bob-Bot',
      type: 'sub-ai',
      avatar: '⚡',
      text: 'Bob loves thrills, but the 5-pour craft sake tasting in Option C sounds awesome and keeps his energy up!',
      time: '30s ago'
    },
    {
      sender: 'Charlie-Bot',
      type: 'sub-ai',
      avatar: '📷',
      text: 'Option C is 100% weather-sheltered, photogenic, and only ~1,200 steps so Charlie won’t get fatigued.',
      time: '10s ago'
    }
  ]);
  const [isSimulatingDebate, setIsSimulatingDebate] = useState(false);
  const [customArgument, setCustomArgument] = useState('');
  const [showLogDrawer, setShowLogDrawer] = useState(true);
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
        text: 'Aegis: Reviewing Alice, Bob, and Charlie’s private preferences to find common joy...',
        log: { sender: 'Aegis (Main AI Guide)', type: 'orchestrator', avatar: '✨', text: 'Analyzing everyone’s private comfort zones for Day 3 indoor contingency.', time: 'Just now' }
      },
      {
        speaker: 'alice',
        text: 'Alice-Bot: Checking Alice’s notes... Option B is too pricey ($60). Option C is under $35 and deliciously authentic! 🍲',
        log: { sender: 'Alice-Bot', type: 'sub-ai', avatar: '🍲', text: 'Voted for Option C to protect Alice’s comfortable dining budget.', time: 'Just now' }
      },
      {
        speaker: 'bob',
        text: 'Bob-Bot: Option C includes a lively craft sake flight! Bob will love that vibe. Thumbs up! ⚡',
        log: { sender: 'Bob-Bot', type: 'sub-ai', avatar: '⚡', text: 'Bob-Bot accepts Option C compromise with excitement for the sake flight.', time: 'Just now' }
      },
      {
        speaker: 'charlie',
        text: 'Charlie-Bot: Soba studio is serene, dry, and under 1,500 steps. Zero group fatigue! 📷',
        log: { sender: 'Charlie-Bot', type: 'sub-ai', avatar: '📷', text: 'Charlie-Bot confirms Option C matches Charlie’s mindful pacing.', time: 'Just now' }
      },
      {
        speaker: 'orchestrator',
        text: 'Aegis: High five! 🌟 We have a 96% unanimous agreement on Option C!',
        log: { sender: 'Aegis (Main AI Guide)', type: 'orchestrator', avatar: '✨', text: 'Unanimous consensus reached on Option C! Ready to lock into the trip plan.', time: 'Just now' }
      }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setActiveSpeaker(step.speaker);
        setSpeechBubbles(prev => ({ ...prev, [step.speaker]: step.text }));
        setLogs(prev => [step.log, ...prev]);
        if (index === steps.length - 1) {
          setIsSimulatingDebate(false);
        }
      }, (index + 1) * 1500);
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
      text: `Voted for ${chosen?.title.split(':')[0]}!`,
      time: 'Just now'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleSubAIIntervene = () => {
    const interveneLog = {
      sender: currentTraveler.agentName,
      type: 'sub-ai',
      avatar: currentTraveler.agentAvatar,
      text: `Advocating for ${currentTraveler.name}: "${currentTraveler.privateNotes.slice(0, 65)}..." -> Ensuring the plan fits their comfort zone!`,
      time: 'Just now'
    };
    setActiveSpeaker(currentTraveler.id);
    setSpeechBubbles(prev => ({
      ...prev,
      [currentTraveler.id]: `[My Sub-AI speaking up]: Championing ${currentTraveler.name}'s preferences with kindness!`
    }));
    setLogs(prev => [interveneLog, ...prev]);
  };

  const handleLockInConsensus = () => {
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.6 }
    });
    onResolveDilemma(selectedOption);
    if (isFullscreen) setIsFullscreen(false);
  };

  const getSeatTraveler = (id) => travelers.find(t => t.id === id);

  return (
    <div className={`transition-all ${
      isFullscreen
        ? 'fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto p-6 sm:p-10 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200'
        : 'w-full max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8'
    }`}>
      {/* Top Banner with Fullscreen Expand Trigger */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1.5 border border-indigo-100">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              Round Table Session
            </span>
            <span className="text-xs font-semibold text-slate-400">• Day 3 Disruption Resolution</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            The Escape Round Table ☕
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every traveler has a dedicated seat paired with their Sub-AI concierge. 
            The central guide <strong className="text-indigo-600">Aegis</strong> computes win-win compromises by balancing individual budgets, walking limits, and desired vibes.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Full Screen Expand Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-2 px-4 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 transition-colors shadow-xs"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Expand Table to Fullscreen"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-slate-600" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-indigo-600" />
                <span>Fullscreen Table Arena</span>
              </>
            )}
          </button>

          <button
            onClick={runSubAIDebate}
            disabled={isSimulatingDebate}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold rounded-2xl shadow-sm transition-all disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${isSimulatingDebate ? 'animate-bounce text-yellow-200' : ''}`} />
            <span>{isSimulatingDebate ? 'AI Agents Deliberating...' : 'Simulate AI Discussion'}</span>
          </button>

          <button
            onClick={() => setShowLogDrawer(!showLogDrawer)}
            className="flex items-center gap-2 px-4 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-indigo-500" />
            <span>{showLogDrawer ? 'Hide Log' : 'Show Log'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Round Table Surface + Live Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
        {/* The Round Table Pod - EXPANDED SIZING */}
        <div className={`${showLogDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all space-y-6`}>
          {/* Table Outer Ring (Pastel Wooden / Clean Glow Ring) */}
          <div className={`relative rounded-[56px] ${isFullscreen ? 'p-8 sm:p-14' : 'p-6 sm:p-10'} table-ring border border-slate-200 shadow-sm`}>
            {/* The Round Table Surface - WIDE BY DEFAULT */}
            <div className={`relative rounded-[46px] round-table-surface border-2 border-white ${isFullscreen ? 'p-8 sm:p-14 min-h-[820px]' : 'p-6 sm:p-10 min-h-[760px]'} flex flex-col justify-between overflow-hidden shadow-inner`}>
              
              {/* Decorative Ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <div className={`${isFullscreen ? 'w-[560px] h-[560px]' : 'w-[480px] h-[480px]'} rounded-full border-4 border-dashed border-indigo-400`}></div>
              </div>

              {/* SEAT 1: Alice (Top Left) & SEAT 2: Bob (Top Right) */}
              <div className="flex justify-between items-start z-10 gap-6">
                {/* Seat 1: Alice */}
                <div className="relative group max-w-[320px]">
                  {speechBubbles.alice && (
                    <div className="absolute -top-16 left-0 sm:left-3 z-30 max-w-[260px] bg-white text-slate-800 text-xs p-3.5 rounded-2xl border border-emerald-200 shadow-md speech-active pointer-events-none">
                      <div className="font-bold text-emerald-600 flex items-center gap-1 mb-0.5">
                        <span>🍲 Alice-Bot:</span>
                      </div>
                      {speechBubbles.alice}
                      <div className="w-2.5 h-2.5 bg-white border-r border-b border-emerald-200 transform rotate-45 absolute -bottom-1.5 left-6"></div>
                    </div>
                  )}

                  <div className={`flex items-center gap-4 p-4 sm:p-5 rounded-3xl transition-all ${
                    activeSpeaker === 'alice'
                      ? 'bg-emerald-50 ring-2 ring-emerald-400 shadow-md'
                      : 'bg-white/95 border border-slate-200/80 shadow-xs'
                  }`}>
                    <div className="relative shrink-0">
                      <img
                        src={getSeatTraveler('alice').avatar}
                        alt="Alice"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-xs"
                      />
                      <span className="absolute -bottom-1 -right-1 text-lg bg-white rounded-full p-0.5 border border-slate-200 shadow-xs">
                        🍲
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 truncate">Alice Lin</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold shrink-0">
                          Seat 1
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        Alice-Bot (Food & Thrift)
                      </div>
                      <div className="flex items-center gap-2 mt-2.5">
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
                          ${getSeatTraveler('alice').budgetDaily}/d cap
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                          {votes.alice === 'opt-c' ? 'Voted C 👍' : 'Deciding'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seat 2: Bob */}
                <div className="relative group max-w-[320px]">
                  {speechBubbles.bob && (
                    <div className="absolute -top-16 right-0 sm:right-3 z-30 max-w-[260px] bg-white text-slate-800 text-xs p-3.5 rounded-2xl border border-amber-200 shadow-md speech-active pointer-events-none">
                      <div className="font-bold text-amber-600 flex items-center gap-1 mb-0.5">
                        <span>⚡ Bob-Bot:</span>
                      </div>
                      {speechBubbles.bob}
                      <div className="w-2.5 h-2.5 bg-white border-r border-b border-amber-200 transform rotate-45 absolute -bottom-1.5 right-6"></div>
                    </div>
                  )}

                  <div className={`flex items-center gap-4 p-4 sm:p-5 rounded-3xl transition-all ${
                    activeSpeaker === 'bob'
                      ? 'bg-amber-50 ring-2 ring-amber-400 shadow-md'
                      : 'bg-white/95 border border-slate-200/80 shadow-xs'
                  }`}>
                    <div className="text-right min-w-0">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold shrink-0">
                          Seat 2
                        </span>
                        <span className="font-black text-sm text-slate-900 truncate">Bob Martinez</span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        Bob-Bot (Adrenaline)
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-2.5">
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                          {votes.bob === 'opt-c' ? 'Voted C 👍' : 'Deciding'}
                        </span>
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
                          ${getSeatTraveler('bob').budgetDaily}/d cap
                        </span>
                      </div>
                    </div>

                    <div className="relative shrink-0">
                      <img
                        src={getSeatTraveler('bob').avatar}
                        alt="Bob"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-xs"
                      />
                      <span className="absolute -bottom-1 -left-1 text-lg bg-white rounded-full p-0.5 border border-slate-200 shadow-xs">
                        ⚡
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABLE CENTER: COMMUNITY CARDS & AEGIS */}
              <div className="my-6 relative z-20 flex flex-col items-center">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-100">
                      <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-3xl">
                        ✨
                      </div>
                    </div>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
                      ✓
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm sm:text-base text-slate-900 tracking-wide">
                        AEGIS • SQUAD ORCHESTRATOR
                      </span>
                      <span className="text-xs px-3 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-bold">
                        Friendly Host
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Balancing Everyone’s Preferences for Maximum Happiness
                    </div>
                  </div>
                </div>

                {speechBubbles.orchestrator && (
                  <div className="max-w-2xl bg-white border border-indigo-100 rounded-3xl px-6 py-3.5 mb-4 text-center shadow-xs">
                    <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed">
                      {speechBubbles.orchestrator}
                    </p>
                  </div>
                )}

                {/* THE DISCUSSION CARD (CENTER OF TABLE) */}
                <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                      <span className="text-xl">⛈️</span>
                      <span className="font-black text-slate-900">Topic On The Table:</span>
                      <span className="text-slate-600 font-medium truncate max-w-[340px]">
                        Day 3 Boat Cruise cancelled by coastal storm. Pick an indoor plan!
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/60 shrink-0">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-800">
                        Harmony: 3/3 Agreed!
                      </span>
                    </div>
                  </div>

                  {/* 3 Roomy Proposal Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {agenda.dilemmaOptions.map((opt) => {
                      const isSelected = selectedOption === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleVote(opt.id)}
                          className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-gradient-to-b from-emerald-50 to-teal-50/60 border-emerald-400 ring-2 ring-emerald-400/40 shadow-sm'
                              : 'bg-slate-50/80 border-slate-200 hover:border-indigo-300 hover:bg-white'
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute -top-2.5 -right-2 bg-emerald-500 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-xs">
                              ⭐ TOP MATCH
                            </span>
                          )}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="font-black text-slate-900">{opt.title.split(':')[0]}</span>
                              <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-md">
                                {opt.cost}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                              {opt.title.split(':')[1]}
                            </p>
                          </div>

                          <div className="mt-3.5 pt-3 border-t border-slate-200/70 text-xs">
                            <div className="flex items-center justify-between text-slate-500 mb-1">
                              <span>Squad Match:</span>
                              <span className="text-emerald-700 font-black">
                                {opt.id === 'opt-c' ? '96% 🌟' : opt.id === 'opt-a' ? '74%' : '48%'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 italic line-clamp-2 leading-relaxed">
                              {opt.aiSummary}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SEAT 4: Current Player (Bottom Left) & SEAT 3: Charlie (Bottom Right) */}
              <div className="flex justify-between items-end z-10 gap-6">
                {/* Current Player Slot */}
                <div className="relative group max-w-[340px]">
                  <div className="p-4 sm:p-5 rounded-3xl bg-indigo-50/95 border-2 border-indigo-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={currentTraveler.avatar}
                          alt={currentTraveler.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-xs"
                        />
                        <span className="absolute -bottom-1 -right-1 text-lg bg-white rounded-full p-0.5 border border-indigo-200 shadow-xs">
                          {currentTraveler.agentAvatar}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900 truncate">{currentTraveler.name}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-200 text-indigo-900 font-bold shrink-0">
                            You (Seat 4)
                          </span>
                        </div>
                        <div className="text-xs text-indigo-800 font-medium truncate mt-0.5">
                          Companion: {currentTraveler.agentName}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 font-semibold">
                          Budget: ${currentTraveler.budgetDaily}/day cap
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSubAIIntervene}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Ask My Sub-AI to Chime In ✨</span>
                    </button>
                  </div>
                </div>

                {/* Seat 3: Charlie */}
                <div className="relative group max-w-[320px]">
                  {speechBubbles.charlie && (
                    <div className="absolute -top-16 right-0 sm:right-3 z-30 max-w-[260px] bg-white text-slate-800 text-xs p-3.5 rounded-2xl border border-sky-200 shadow-md speech-active pointer-events-none">
                      <div className="font-bold text-sky-600 flex items-center gap-1 mb-0.5">
                        <span>📷 Charlie-Bot:</span>
                      </div>
                      {speechBubbles.charlie}
                      <div className="w-2.5 h-2.5 bg-white border-r border-b border-sky-200 transform rotate-45 absolute -bottom-1.5 right-6"></div>
                    </div>
                  )}

                  <div className={`flex items-center gap-4 p-4 sm:p-5 rounded-3xl transition-all ${
                    activeSpeaker === 'charlie'
                      ? 'bg-sky-50 ring-2 ring-sky-400 shadow-md'
                      : 'bg-white/95 border border-slate-200/80 shadow-xs'
                  }`}>
                    <div className="text-right min-w-0">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-sky-100 text-sky-800 font-bold shrink-0">
                          Seat 3
                        </span>
                        <span className="font-black text-sm text-slate-900 truncate">Charlie Zhang</span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium truncate mt-0.5">Charlie-Bot (Pacing)</div>
                      <div className="flex items-center justify-end gap-2 mt-2.5">
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                          {votes.charlie === 'opt-c' ? 'Voted C 👍' : 'Deciding'}
                        </span>
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
                          ${getSeatTraveler('charlie').budgetDaily}/d cap
                        </span>
                      </div>
                    </div>

                    <div className="relative shrink-0">
                      <img
                        src={getSeatTraveler('charlie').avatar}
                        alt="Charlie"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400 shadow-xs"
                      />
                      <span className="absolute -bottom-1 -left-1 text-lg bg-white rounded-full p-0.5 border border-slate-200 shadow-xs">
                        📷
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Action Bar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Deliberation Vote</div>
              <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                Option C (Tsukiji Soba Masterclass & Sake Tasting)
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => handleVote('opt-c')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-xs transition-all"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Vote Option C</span>
              </button>

              <button
                onClick={() => handleVote('opt-a')}
                className="flex-1 sm:flex-none px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all"
              >
                <span>Vote Option A</span>
              </button>

              <button
                onClick={handleLockInConsensus}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white text-xs font-extrabold rounded-2xl shadow-sm transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Lock In Plan & Celebrate! 🎊</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Deliberation Transcript (Right Column) */}
        {showLogDrawer && (
          <div className={`lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col ${isFullscreen ? 'h-[850px]' : 'h-[780px]'} shadow-xs`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-black text-sm text-slate-900">Round Table Feed</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                {logs.length} messages
              </span>
            </div>

            {/* Offline-to-Live Synthesis Explainer */}
            <div className="my-4 p-4 bg-indigo-50/80 border border-indigo-100 rounded-2xl text-xs text-indigo-950 leading-relaxed">
              <div className="font-bold text-indigo-900 flex items-center gap-1.5 mb-1">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Why this feels effortless:</span>
              </div>
              Each person shared their real budget & fatigue limits with their Sub-AI privately. The Sub-AIs negotiate here diplomatically so nobody has to feel awkward!
            </div>

            {/* Scrollable Transcript Feed */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                    log.type === 'orchestrator'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : log.type === 'sub-ai'
                      ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      {log.isImage ? (
                        <img src={log.avatar} alt="User" className="w-5 h-5 rounded-full" />
                      ) : (
                        <span>{log.avatar}</span>
                      )}
                      <span className={
                        log.type === 'orchestrator' ? 'text-amber-700' :
                        log.type === 'sub-ai' ? 'text-indigo-700' : 'text-emerald-700'
                      }>
                        {log.sender}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{log.time}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {log.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Input to speak into the room */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!customArgument.trim()) return;
                const newLog = {
                  sender: `${currentTraveler.name} (Live Voice)`,
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
              className="pt-4 border-t border-slate-100 flex gap-2.5"
            >
              <input
                type="text"
                placeholder={`Chime in as ${currentTraveler.name}...`}
                value={customArgument}
                onChange={(e) => setCustomArgument(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
