import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  MessageCircle,
  Zap,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  Check,
  X,
  Calendar,
  Clock,
  Users,
  ArrowRight,
  ShieldCheck,
  Radio,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Target,
  Brain,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  generateSubAISpeechBubble,
  generateThreeAgentDebateSteps
} from '../services/consensusService';
import {
  generateMeetingDebateWithAI,
  respondToMeetingArgumentWithAI,
  generatePeerAgentTurnResponse
} from '../services/geminiService';

export default function MeetingTable({
  currentTraveler,
  travelers = [],
  agenda,
  onResolveDilemma,
  dilemmaResolved,
  onNavigateToItinerary,
  chatMessages = {},
  destination = 'Tokyo',
  itinerary = []
}) {
  const defaultOption = agenda.dilemmaOptions[2]; // Option C: Soba & Sake
  const [selectedOption, setSelectedOption] = useState(defaultOption.id);

  // Stance Votes: 'agree' | 'disagree' for each squad member on the focused proposal
  const [votes, setVotes] = useState({
    alice: 'agree',
    bob: 'agree',
    charlie: 'agree',
    you: 'agree'
  });

  // Track which specific option each squad member is currently choosing/backing
  const [chosenOptions, setChosenOptions] = useState({
    you: defaultOption.id,
    alice: defaultOption.id,
    bob: defaultOption.id,
    charlie: defaultOption.id
  });

  // Round-based Turn System: Each person can pass only ONCE per round
  const [roundNumber, setRoundNumber] = useState(1);
  const [hasPassedThisRound, setHasPassedThisRound] = useState({
    you: false,
    alice: false,
    bob: false,
    charlie: false
  });

  // Meeting Schedule & Host State
  const [meetingMode, setMeetingMode] = useState('live'); // 'live' | 'scheduled'
  const [scheduledTime, setScheduledTime] = useState('Tonight at 8:00 PM');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [isAiReplying, setIsAiReplying] = useState(false);

  // Speaker turns: Start with user (Justin / you)
  const speakerOrder = ['you', 'alice', 'bob', 'charlie'];
  const [currentSpeakerIdx, setCurrentSpeakerIdx] = useState(0);
  const activeSpeakerId = speakerOrder[currentSpeakerIdx];

  // Auto-scroll ref for Deliberation Live Feed
  const logEndRef = useRef(null);

  // Helper to get traveler data by ID
  const getSeatTraveler = (id) => {
    return travelers.find(t => t.id === id) || travelers[0];
  };

  // Helper for clean sender name and role badge
  const getSpeakerBadgeAndName = (idOrTraveler, defaultAgentName = '') => {
    const t = typeof idOrTraveler === 'string' ? getSeatTraveler(idOrTraveler) : idOrTraveler;
    if (!t) return { name: 'Squad Member', badge: defaultAgentName || 'Traveler', avatar: '👤' };
    
    if (t.id === 'you') {
      return {
        name: 'Justin (You)',
        badge: 'Lead Traveler',
        avatar: t.avatar || '👤',
        agentAvatar: t.agentAvatar || '🤖'
      };
    }
    
    const cleanAgent = (defaultAgentName || t.agentName || '').split('(')[0].trim();
    return {
      name: t.name ? t.name.replace(/\(.*?\)/g, '').trim() : 'Traveler',
      badge: cleanAgent || 'Sub-AI',
      avatar: t.avatar || '👤',
      agentAvatar: t.agentAvatar || '🤖'
    };
  };

  // Dynamically generate speech bubbles from real traveler data and private chat
  const [speechBubbles, setSpeechBubbles] = useState(() => {
    const youT = travelers.find(t => t.id === 'you') || currentTraveler;
    const aliceT = travelers.find(t => t.id === 'alice') || travelers[1];
    const bobT = travelers.find(t => t.id === 'bob') || travelers[2];
    const charlieT = travelers.find(t => t.id === 'charlie') || travelers[3];

    return {
      you: generateSubAISpeechBubble(youT, chatMessages, defaultOption, true),
      alice: generateSubAISpeechBubble(aliceT, chatMessages, defaultOption, false),
      bob: generateSubAISpeechBubble(bobT, chatMessages, defaultOption, false),
      charlie: generateSubAISpeechBubble(charlieT, chatMessages, defaultOption, false),
      orchestrator: `All 4 squad members (${travelers.map(t => t.name).join(', ') || 'squad'}) have their pacing, budget limits, and weather constraints balanced on Option C.`
    };
  });

  // Live Deliberation Feed: initialized cleanly with real-time session opening (chronological order, newest at bottom)
  const [logs, setLogs] = useState([
    {
      id: 'init-1',
      sender: 'Aegis',
      roleBadge: 'Lead AI Conciliator',
      type: 'orchestrator',
      avatar: '✨',
      text: `Deliberation room convened for ${destination} Day 3 storm contingency. Round 1 in session. Floor is open to Justin (You).`,
      time: 'Just now'
    }
  ]);

  const [isSimulatingDebate, setIsSimulatingDebate] = useState(false);
  const [customArgument, setCustomArgument] = useState('');
  const [showLogDrawer, setShowLogDrawer] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedThinkingLogs, setExpandedThinkingLogs] = useState({});

  const toggleLogThinking = (logId) => {
    setExpandedThinkingLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };

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

  // Auto-scroll to bottom of live feed when logs update
  useEffect(() => {
    if (showLogDrawer) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isAiReplying, showLogDrawer]);

  // Agreement calculations (Dynamically calculated based on votes matching table center focus)
  const agreeCount = travelers.filter(t => votes[t.id] === 'agree').length;
  const disagreeCount = travelers.filter(t => votes[t.id] === 'disagree').length;
  const isUnanimous = agreeCount === travelers.length && travelers.length > 0;
  const isMajority = agreeCount >= 3;
  const harmonyScore = meetingEnded ? 100 : travelers.length > 0 ? Math.round((agreeCount / travelers.length) * 100) : 100;

  const currentSpeakerTraveler = getSeatTraveler(activeSpeakerId);

  // Autonomous AI turn sequencer: chains Alice -> Bob -> Charlie -> returns floor to user
  const runAITurnSequencer = async (speakerId, lastUserText = '', referencedOption = null) => {
    if (speakerId === 'you' || speakerId === currentTraveler.id) {
      setIsAiReplying(false);
      return;
    }

    setIsAiReplying(true);
    const targetOpt = referencedOption || agenda.dilemmaOptions.find(o => o.id === selectedOption) || defaultOption;

    try {
      const aiResponse = await generatePeerAgentTurnResponse({
        speakerId,
        lastUserMessage: lastUserText,
        currentOption: targetOpt,
        destination,
        travelers,
        itinerary,
        currentRound: roundNumber
      });

      if (aiResponse) {
        setSpeechBubbles(prev => ({
          ...prev,
          [speakerId]: aiResponse.text
        }));

        const chosenOpt = aiResponse.chosenOptionId || targetOpt.id;
        setChosenOptions(prev => ({ ...prev, [speakerId]: chosenOpt }));
        
        // Stance is Agree if chosen option matches selectedOption in middle of table, else Disagree
        const stance = aiResponse.agreement || (chosenOpt === selectedOption ? 'agree' : 'disagree');
        setVotes(prev => ({ ...prev, [speakerId]: stance }));

        const speaker = getSeatTraveler(speakerId);
        const info = getSpeakerBadgeAndName(speaker, aiResponse.agentName);
        const logItem = {
          id: `ai-turn-${Date.now()}-${speakerId}`,
          sender: info.name,
          roleBadge: `${info.badge} • ${stance === 'agree' ? 'Agreed with Focus' : 'Disagreed with Focus'}`,
          type: 'sub-ai',
          avatar: speaker.avatar || info.avatar || aiResponse.avatar || '🤖',
          text: aiResponse.text,
          thinking: aiResponse.thinking || null,
          time: 'Just now'
        };
        setLogs(prev => [...prev, logItem]);
      }
    } catch (err) {
      console.warn('Error during AI turn execution:', err);
    } finally {
      setIsAiReplying(false);

      // Advance to next speaker in circle
      const currentIdx = speakerOrder.indexOf(speakerId);
      const nextIdx = (currentIdx + 1) % speakerOrder.length;
      const nextSpeakerId = speakerOrder[nextIdx];

      setTimeout(() => {
        if (nextIdx === 0) {
          // Round complete! Reset pass limits and return turn to user (Justin)
          setRoundNumber(r => {
            const nextRound = r + 1;
            const roundSummaryLog = {
              id: `round-summary-${Date.now()}`,
              sender: 'Aegis',
              roleBadge: 'Lead AI Conciliator',
              type: 'orchestrator',
              avatar: '✨',
              text: `✨ Round ${r} complete! Floor is returned to Justin (You) for Round ${nextRound}.`,
              time: 'Just now'
            };
            setLogs(prev => [...prev, roundSummaryLog]);
            return nextRound;
          });
          setHasPassedThisRound({ you: false, alice: false, bob: false, charlie: false });
          setCurrentSpeakerIdx(0);
        } else {
          // Trigger next peer AI's turn
          setCurrentSpeakerIdx(nextIdx);
          runAITurnSequencer(nextSpeakerId, lastUserText, targetOpt);
        }
      }, 1600);
    }
  };

  // Turn management: Pass Turn (Only once per person per round)
  const handlePassTurn = async () => {
    const speakerId = activeSpeakerId;
    const speaker = getSeatTraveler(speakerId);

    if (hasPassedThisRound[speakerId]) {
      alert(`${speaker.name} has already passed once in Round ${roundNumber}! Please contribute your input or wait for Round ${roundNumber + 1}.`);
      return;
    }

    // Mark as passed for this round
    setHasPassedThisRound(prev => ({
      ...prev,
      [speakerId]: true
    }));

    const info = getSpeakerBadgeAndName(speaker);
    const passLog = {
      id: `pass-${Date.now()}-${speakerId}`,
      sender: info.name,
      roleBadge: info.badge,
      type: speaker.id === 'you' ? 'user' : 'sub-ai',
      avatar: speaker.avatar,
      text: `Passed turn in Round ${roundNumber}.`,
      time: 'Just now'
    };
    setLogs(prev => [...prev, passLog]);

    // Calculate next speaker
    const nextIdx = (currentSpeakerIdx + 1) % speakerOrder.length;
    setCurrentSpeakerIdx(nextIdx);
    const nextSpeakerId = speakerOrder[nextIdx];

    // If next speaker is an AI, trigger sequential AI turns
    if (nextSpeakerId !== 'you' && nextSpeakerId !== currentTraveler.id) {
      setTimeout(() => {
        runAITurnSequencer(nextSpeakerId);
      }, 400);
    }
  };

  // Real-time AI Ingestion: User sends message into the Live Feed (Only on user's turn)
  const handleSendArgument = async (e) => {
    e.preventDefault();
    if (activeSpeakerId !== 'you' || !customArgument.trim() || isAiReplying) return;

    const text = customArgument.trim();
    const user = getSeatTraveler('you');
    const userLog = {
      id: `user-arg-${Date.now()}`,
      sender: 'Justin (You)',
      roleBadge: 'Lead Traveler',
      type: 'user',
      avatar: user.avatar,
      text,
      time: 'Just now'
    };

    setLogs(prev => [...prev, userLog]);
    setSpeechBubbles(prev => ({
      ...prev,
      you: `Justin (You): "${text}"`
    }));
    setCustomArgument('');
    setIsAiReplying(true);

    const lower = text.toLowerCase();
    let opt = agenda.dilemmaOptions.find(o => o.id === selectedOption) || defaultOption;
    if (lower.includes('kart') || lower.includes('vr') || lower.includes('akihabara') || lower.includes('option b') || lower.includes('opt-b')) {
      const optB = agenda.dilemmaOptions.find(o => o.id === 'opt-b');
      if (optB) {
        opt = optB;
        setChosenOptions(prev => ({ ...prev, you: 'opt-b' }));
      }
    } else if (lower.includes('museum') || lower.includes('mori') || lower.includes('art') || lower.includes('option a') || lower.includes('opt-a')) {
      const optA = agenda.dilemmaOptions.find(o => o.id === 'opt-a');
      if (optA) {
        opt = optA;
        setChosenOptions(prev => ({ ...prev, you: 'opt-a' }));
      }
    } else if (lower.includes('soba') || lower.includes('sake') || lower.includes('option c') || lower.includes('opt-c') || lower.includes('noodle')) {
      const optC = agenda.dilemmaOptions.find(o => o.id === 'opt-c');
      if (optC) {
        opt = optC;
        setChosenOptions(prev => ({ ...prev, you: 'opt-c' }));
      }
    }

    try {
      // 1. Aegis Conciliator Ingestion
      const aiReply = await respondToMeetingArgumentWithAI({
        userArgument: text,
        traveler: currentTraveler,
        currentOption: opt,
        destination,
        travelers,
        itinerary,
        returnFull: true
      });

      if (aiReply) {
        const replyText = typeof aiReply === 'object' ? aiReply.reply : aiReply;
        const thinkingText = typeof aiReply === 'object' ? aiReply.thinking : null;
        const aiReactionLog = {
          id: `aegis-reply-${Date.now()}`,
          sender: 'Aegis',
          roleBadge: 'Lead AI Conciliator',
          type: 'orchestrator',
          avatar: '✨',
          text: replyText,
          thinking: thinkingText,
          time: 'Just now'
        };
        setLogs(prev => [...prev, aiReactionLog]);
      }

      // Advance turn from user (0) to Alice (1) and start sequential AI turns
      setCurrentSpeakerIdx(1);
      setTimeout(() => {
        runAITurnSequencer('alice', text, opt);
      }, 600);

    } catch (err) {
      console.warn('Meeting AI argument reply error:', err);
      setIsAiReplying(false);
    }
  };

  // Change individual chosen option (automatically syncs agree/disagree with table center focus)
  const handleChooseOption = (travelerId, optionId) => {
    // 1. Update chosen option for this traveler
    setChosenOptions(prev => ({
      ...prev,
      [travelerId]: optionId
    }));

    // 2. Automatically update their vote stance on the focused proposal
    const isMatchingFocus = optionId === selectedOption;
    const newStance = isMatchingFocus ? 'agree' : 'disagree';
    setVotes(vPrev => ({
      ...vPrev,
      [travelerId]: newStance
    }));

    // 3. Dynamic in-character speech bubble updates explaining their choice
    const opt = agenda.dilemmaOptions.find(o => o.id === optionId) || defaultOption;
    const optName = opt.title.split(':')[0];
    const optDetail = opt.title.split(':')[1] || opt.title;

    let statement = '';
    if (travelerId === 'you') {
      statement = `Justin (You): "I'm choosing ${optName} (${optDetail.trim()}) for our Day 3 contingency."`;
    } else if (travelerId === 'alice') {
      statement = optionId === 'opt-a'
        ? `Alice: "Option A ($24) is fantastic—it stays well under my budget and keeps us out of the rain."`
        : optionId === 'opt-b'
        ? `Alice: "Option B ($60) is expensive for my daily cap, but I will consider it if the team really wants VR."`
        : `Alice: "Option C ($35) is ideal—authentic soba noodle making and fits my $150 budget!"`;
    } else if (travelerId === 'bob') {
      statement = optionId === 'opt-b'
        ? `Bob: "Option B is exactly the high-energy adrenaline I want—cyber karting in Akihabara!"`
        : optionId === 'opt-a'
        ? `Bob: "Option A is sheltered and chill, leaves energy and budget for evening gaming."`
        : `Bob: "Option C works great—traditional sake tasting and artisan food sounds awesome."`;
    } else if (travelerId === 'charlie') {
      statement = optionId === 'opt-a'
        ? `Charlie: "Option A (Mori Art Museum) has incredible indoor views of Tokyo Tower for aesthetic photos."`
        : optionId === 'opt-c'
        ? `Charlie: "Option C gives authentic artisan photography moments during the noodle masterclass."`
        : `Charlie: "Option B has vibrant cyberpunk neon lighting in Akihabara."`;
    }

    if (statement) {
      setSpeechBubbles(prev => ({
        ...prev,
        [travelerId]: statement
      }));
    }

    const voter = travelers.find(t => t.id === travelerId) || currentTraveler;
    const info = getSpeakerBadgeAndName(voter);

    const optLog = {
      id: `opt-choice-${Date.now()}-${travelerId}`,
      sender: info.name,
      roleBadge: isMatchingFocus ? 'Voted Agree' : 'Voted Disagree',
      type: 'vote',
      avatar: voter.avatar,
      text: `Chose ${optName} (${optDetail.trim()}) — ${isMatchingFocus ? '✓ Matches table focus (Agreed)' : '✗ Differs from table focus (Disagreed)'}.`,
      time: 'Just now'
    };
    setLogs(prev => [...prev, optLog]);
  };

  // Vote Stance handler: Agree vs Disagree on current focused option
  const handleVoteStance = (travelerId, stance) => {
    setVotes(prev => ({
      ...prev,
      [travelerId]: stance
    }));

    // If voting agree, align their chosen option with selectedOption.
    // If voting disagree, switch their chosen option to an alternative option.
    if (stance === 'agree') {
      setChosenOptions(prev => ({ ...prev, [travelerId]: selectedOption }));
    } else {
      const altOption = agenda.dilemmaOptions.find(o => o.id !== selectedOption) || defaultOption;
      setChosenOptions(prev => ({ ...prev, [travelerId]: altOption.id }));
    }

    const voter = travelers.find(t => t.id === travelerId) || currentTraveler;
    const info = getSpeakerBadgeAndName(voter);
    const opt = agenda.dilemmaOptions.find(o => o.id === selectedOption) || defaultOption;
    const newLog = {
      id: `vote-${Date.now()}-${travelerId}`,
      sender: info.name,
      roleBadge: stance === 'agree' ? 'Voted Agree' : 'Voted Disagree',
      type: 'vote',
      avatar: voter.avatar,
      text: `${stance === 'agree' ? '✓ Voted AGREE (Supports' : '✗ Voted DISAGREE (Prefers Alternative to'} ${opt.title.split(':')[0]})`,
      time: 'Just now'
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Select option focus (Table Center Proposal) -> Re-evaluates everyone's Agree/Disagree stance
  const handleSelectOption = (optionId) => {
    setSelectedOption(optionId);
    const opt = agenda.dilemmaOptions.find(o => o.id === optionId);

    // Re-evaluate votes for all squad members based on whether their chosenOption matches the new table focus!
    setVotes(prev => {
      const updatedVotes = {};
      travelers.forEach(t => {
        const choice = chosenOptions[t.id] || defaultOption.id;
        updatedVotes[t.id] = choice === optionId ? 'agree' : 'disagree';
      });
      return updatedVotes;
    });

    const newLog = {
      id: `focus-${Date.now()}`,
      sender: 'Aegis',
      roleBadge: 'Lead AI Conciliator',
      type: 'orchestrator',
      avatar: '✨',
      text: `Table focus shifted to ${opt.title.split(':')[0]}: ${opt.title.split(':')[1] || opt.title}. Re-evaluated squad alignment stances.`,
      time: 'Just now'
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Autonomous Debate simulation powered by LangGraph & Gemini
  const runSubAIDebate = async () => {
    setIsSimulatingDebate(true);
    const targetOpt = agenda.dilemmaOptions.find(o => o.id === selectedOption) || agenda.dilemmaOptions[2];

    let steps = null;
    try {
      steps = await generateMeetingDebateWithAI({
        travelers,
        destination,
        option: targetOpt,
        dilemmaTitle: agenda.title || 'Day 3 Storm Warning Deliberation',
        itinerary,
        chatMessages
      });
    } catch (err) {
      console.warn('Gemini debate synthesis failed, using consensus fallback:', err);
    }

    if (!steps || steps.length < 3) {
      const baseSteps = generateThreeAgentDebateSteps(travelers, chatMessages, agenda.dilemmaOptions, targetOpt.id);
      steps = baseSteps.map(s => ({
        ...s,
        agreement: 'agree',
        chosenOptionId: targetOpt.id
      }));
    }

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setCurrentSpeakerIdx(idx % speakerOrder.length);
        if (step.speaker !== 'orchestrator') {
          setSpeechBubbles(prev => ({
            ...prev,
            [step.speaker]: step.text
          }));
          const stance = step.agreement || 'agree';
          setVotes(prev => ({ ...prev, [step.speaker]: stance }));
          if (step.chosenOptionId) {
            setChosenOptions(prev => ({ ...prev, [step.speaker]: step.chosenOptionId }));
          }
        } else {
          setSpeechBubbles(prev => ({
            ...prev,
            orchestrator: step.text
          }));
        }

        const speaker = getSeatTraveler(step.speaker);
        const info = getSpeakerBadgeAndName(speaker, step.agentName);
        const logEntry = typeof step.log === 'object' ? step.log : {
          id: `debate-${Date.now()}-${idx}`,
          sender: info.name,
          roleBadge: `${info.badge} • ${step.agreement === 'agree' ? 'Agreed' : 'Disagreed'}`,
          type: 'sub-ai',
          avatar: speaker?.avatar || step.avatar || '🤖',
          text: step.log || step.text,
          thinking: step.thinking || null,
          time: 'Just now'
        };
        setLogs(prev => [...prev, logEntry]);

        if (idx === steps.length - 1) {
          setIsSimulatingDebate(false);
          setCurrentSpeakerIdx(0); // Set turn to user
          confetti({
            particleCount: 45,
            spread: 55,
            origin: { y: 0.6 }
          });
        }
      }, (idx + 1) * 950);
    });
  };

  const handleEndMeeting = () => {
    if (!isMajority) {
      alert(`Consensus requires at least majority agreement (${agreeCount}/${travelers.length} Agree). Continue deliberating or adjust option.`);
      return;
    }
    setMeetingEnded(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    onResolveDilemma(selectedOption);
  };

  const selectedOptionData = agenda.dilemmaOptions.find(o => o.id === selectedOption) || agenda.dilemmaOptions[2];

  // Helper to find title of chosen option
  const getOptionTitle = (optId) => {
    const opt = agenda.dilemmaOptions.find(o => o.id === optId);
    return opt ? opt.title.split(':')[0] : 'Option C';
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : ''}`}>
      {/* 1. Meeting Scheduling & Hosting Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              meetingMode === 'live' 
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}>
              <Radio className="w-3 h-3 text-purple-600 animate-pulse" />
              <span>{meetingMode === 'live' ? `Live Session: Round ${roundNumber}` : `Scheduled: ${scheduledTime}`}</span>
            </span>

            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              {harmonyScore}% Consensus Harmony
            </span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight mt-1">
            Squad Deliberation Room • Live Turn-Taking Conciliation
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Active Context: {destination} Squad Expedition ({travelers.map(t => t.name ? t.name.split(' ')[0] : 'Member').join(', ') || 'Squad'}) • Grounded in Master Itinerary & Live Preferences
          </p>
        </div>

        {/* Meeting Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {meetingMode !== 'live' ? (
            <button
              onClick={() => setMeetingMode('live')}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Host / Join Live Now
            </button>
          ) : (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span>Schedule Next Meeting</span>
            </button>
          )}

          <button
            onClick={runSubAIDebate}
            disabled={isSimulatingDebate}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulatingDebate ? 'animate-spin' : ''}`} />
            <span>{isSimulatingDebate ? 'Deliberating...' : 'Auto-Deliberate'}</span>
          </button>

          <button
            onClick={() => setShowLogDrawer(!showLogDrawer)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
              showLogDrawer
                ? 'bg-gray-100 text-gray-900 border-gray-300'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-gray-500" />
            <span>{showLogDrawer ? 'Hide Feed' : 'Debate Feed'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Round & Speaker Turn Bar */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md">
            Round {roundNumber} of 3
          </span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Floor Status:
          </span>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
            activeSpeakerId === 'you'
              ? 'bg-purple-600 text-white border border-purple-700 ring-2 ring-purple-200'
              : 'bg-white text-gray-900 border border-purple-300'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${activeSpeakerId === 'you' ? 'bg-white animate-ping' : 'bg-purple-600 animate-pulse'}`}></span>
            <span>
              {activeSpeakerId === 'you'
                ? '🎙️ YOUR TURN TO DELIBERATE (Justin)'
                : `🎙️ DELIBERATING NOW: ${currentSpeakerTraveler?.name} (${currentSpeakerTraveler?.agentName})`}
            </span>
          </div>
        </div>

        {/* Pass Turn Button with Once-per-Round Enforcement */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePassTurn}
            disabled={activeSpeakerId !== 'you' || hasPassedThisRound['you'] || isAiReplying}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs ${
              activeSpeakerId !== 'you'
                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                : hasPassedThisRound['you']
                ? 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed'
                : 'bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 cursor-pointer'
            }`}
          >
            <span>
              {activeSpeakerId !== 'you'
                ? `Waiting for ${currentSpeakerTraveler?.name}`
                : hasPassedThisRound['you']
                ? `Pass Used in R${roundNumber}`
                : `Pass Your Turn (1 left in R${roundNumber})`}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
          </button>
        </div>
      </div>

      {/* 3. Live Option Choice Breakdown Matrix (Which option everyone is choosing right now) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-purple-600" />
            <span>Live Squad Option Choices Breakdown</span>
          </div>
          <span className="text-[11px] text-gray-500">
            Select your preferred option or set the table proposal focus
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {agenda.dilemmaOptions.map((opt) => {
            const supporters = travelers.filter(t => (chosenOptions[t.id] || defaultOption.id) === opt.id);
            const count = supporters.length;
            const isLeading = count >= 3;
            const isTableFocus = selectedOption === opt.id;
            const isUserChoice = (chosenOptions['you'] || defaultOption.id) === opt.id;

            return (
              <div
                key={opt.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isTableFocus
                    ? 'bg-purple-50/70 border-purple-500 shadow-xs ring-1 ring-purple-200'
                    : 'bg-gray-50/60 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900">{opt.title.split(':')[0]}</span>
                    {isTableFocus && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-purple-600 text-white rounded">
                        Table Focus
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isLeading ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {count}/4 Supporters {isLeading ? '★ Leading' : ''}
                  </span>
                </div>
                <div className="text-[11px] text-gray-600 truncate mt-0.5">
                  {opt.title.split(':')[1] || opt.title}
                </div>

                {/* Current Supporters */}
                <div className="mt-2.5 pt-2 border-t border-gray-200/70">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium mb-1.5">
                    <span>Current Backers:</span>
                    {!isTableFocus && (
                      <button
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className="text-purple-600 hover:text-purple-800 font-bold hover:underline cursor-pointer"
                      >
                        Set Table Focus
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 min-h-[26px]">
                    {supporters.length > 0 ? (
                      supporters.map((s) => (
                        <div
                          key={s.id}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium ${
                            s.id === 'you'
                              ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                              : 'bg-white text-gray-800 border-gray-200'
                          }`}
                        >
                          <span>{s.agentAvatar}</span>
                          <span>{s.name.split(' ')[0]}</span>
                          {s.id === 'you' && <span className="text-[9px] text-purple-700">(You)</span>}
                        </div>
                      ))
                    ) : (
                      <span className="text-[10px] text-gray-400 italic">No squad members backing yet</span>
                    )}
                  </div>
                </div>

                {/* User's Choice Button */}
                <div className="mt-2.5 pt-2 border-t border-gray-200/50 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleChooseOption('you', opt.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isUserChoice
                        ? 'bg-purple-600 text-white shadow-2xs ring-1 ring-purple-300'
                        : 'bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 hover:border-purple-300'
                    }`}
                  >
                    <span>{isUserChoice ? '✓ Your Choice' : 'Select as Your Choice'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Main Grid: The Round Table Arena & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`${showLogDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-5 transition-all`}>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-xs relative overflow-hidden">
            
            {/* Upper Seats: You (Seat 1) & Alice (Seat 2) */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              {/* You (Seat 1: Real User) */}
              <div className={`p-3 rounded-2xl border transition-all max-w-sm w-full sm:w-auto ${
                activeSpeakerId === 'you'
                  ? 'border-purple-600 ring-4 ring-purple-100 shadow-md bg-purple-50/20'
                  : 'border-gray-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0 mt-0.5">
                    <img
                      src={getSeatTraveler('you').avatar}
                      alt={getSeatTraveler('you').name}
                      className={`w-11 h-11 rounded-xl object-cover border-2 transition-all ${
                        activeSpeakerId === 'you'
                          ? 'border-purple-600 ring-2 ring-purple-200'
                          : 'border-gray-200'
                      }`}
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full p-0.5 border border-gray-200">
                      {getSeatTraveler('you').agentAvatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900">{getSeatTraveler('you').name}</span>
                      {activeSpeakerId === 'you' ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-600 text-white flex items-center gap-1 animate-pulse">
                          <Radio className="w-2.5 h-2.5" /> SPEAKING NOW
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-gray-100 text-gray-400">
                          Waiting
                        </span>
                      )}
                      
                      <button
                        onClick={() => handleVoteStance('you', votes['you'] === 'agree' ? 'disagree' : 'agree')}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                          votes['you'] === 'agree'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {votes['you'] === 'agree' ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-600" />}
                        <span>{votes['you'] === 'agree' ? 'Agree' : 'Disagree'}</span>
                      </button>
                    </div>

                    {/* Direct Option Pills for Justin */}
                    <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                          Choice:
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                          {getOptionTitle(chosenOptions['you'] || defaultOption.id)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {agenda.dilemmaOptions.map(o => {
                          const isChosen = (chosenOptions['you'] || defaultOption.id) === o.id;
                          return (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => handleChooseOption('you', o.id)}
                              title={`Switch Justin's choice to ${o.title}`}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                isChosen
                                  ? 'bg-purple-600 text-white shadow-2xs ring-1 ring-purple-400'
                                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span>{isChosen ? '✓' : ''} {o.title.split(':')[0]}</span>
                              <span className={`text-[9px] font-normal ${isChosen ? 'text-purple-100' : 'text-gray-400'}`}>
                                ({o.cost})
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-xs text-gray-700 bg-purple-50/50 p-2.5 rounded-xl mt-1.5 border border-purple-200/80 leading-snug">
                      {speechBubbles.you || speechBubbles[currentTraveler.id]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Alice (Seat 2) */}
              <div className={`p-3 rounded-2xl border transition-all max-w-sm w-full sm:w-auto ${
                activeSpeakerId === 'alice'
                  ? 'border-purple-600 ring-4 ring-purple-100 shadow-md bg-purple-50/20'
                  : 'border-gray-200'
              }`}>
                <div className="flex items-start gap-3 sm:flex-row-reverse sm:text-right">
                  <div className="relative shrink-0 mt-0.5">
                    <img
                      src={getSeatTraveler('alice').avatar}
                      alt="Alice"
                      className={`w-11 h-11 rounded-xl object-cover border-2 transition-all ${
                        activeSpeakerId === 'alice' ? 'border-purple-600 ring-2 ring-purple-200' : 'border-gray-200'
                      }`}
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full p-0.5 border border-gray-200">
                      {getSeatTraveler('alice').agentAvatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                      <span className="text-xs font-bold text-gray-900">Alice</span>
                      {activeSpeakerId === 'alice' ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-600 text-white flex items-center gap-1 animate-pulse">
                          <Radio className="w-2.5 h-2.5" /> SPEAKING NOW
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-gray-100 text-gray-400">
                          Waiting
                        </span>
                      )}
                      
                      <div
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                          votes['alice'] === 'agree'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {votes['alice'] === 'agree' ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-600" />}
                        <span>{votes['alice'] === 'agree' ? 'Agreed' : 'Disagreed'}</span>
                      </div>
                    </div>

                    {/* Read-Only AI Choice Badge for Alice */}
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between w-full sm:justify-end sm:gap-2">
                      <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                        AI Choice:
                      </span>
                      <span className="text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                        {getOptionTitle(chosenOptions['alice'] || defaultOption.id)} ({agenda.dilemmaOptions.find(o => o.id === (chosenOptions['alice'] || defaultOption.id))?.cost})
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl mt-1.5 border border-gray-200 leading-snug sm:text-left">
                      {speechBubbles.alice}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Table Surface (Lead AI Ingesting & Compromise Proposal) */}
            <div className="relative my-6 p-6 sm:p-8 rounded-2xl bg-gray-50/80 border border-gray-200 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Aegis Consensus Engine • Shared Knowledge</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                {selectedOptionData.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-lg mx-auto">
                {speechBubbles.orchestrator || selectedOptionData.aiSummary}
              </p>

              {/* Live Agree / Disagree Tally & Consensus Status */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 py-1">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-gray-200 text-xs shadow-2xs">
                  <span className="font-semibold text-gray-500">Proposal Stance:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {agreeCount} Agree
                  </span>
                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    {disagreeCount} Disagree
                  </span>
                </div>

                {meetingEnded ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Unanimous Consensus Finalized!</span>
                  </div>
                ) : isUnanimous ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>4/4 Unanimous Agreement (All Satisfied)</span>
                  </div>
                ) : isMajority ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold">
                    <Check className="w-3.5 h-3.5 text-purple-600" />
                    <span>Majority Agreement ({agreeCount}/4 Agreed) • Threshold Met</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Contested ({disagreeCount} Disagree) • Continued Deliberation Needed</span>
                  </div>
                )}
              </div>

              {/* Finalize Consensus Button */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={handleEndMeeting}
                  disabled={!isMajority}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 ${
                    isMajority
                      ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isMajority ? 'Finalize Consensus & Update Itinerary' : `Majority Agreement Required (${agreeCount}/4)`}</span>
                </button>

                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="px-4 py-2.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>Schedule Another Meeting</span>
                </button>
              </div>
            </div>

            {/* Lower Seats: Bob (Seat 3) & Charlie (Seat 4) */}
            <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mt-8">
              {/* Bob (Seat 3) */}
              <div className={`p-3 rounded-2xl border transition-all max-w-sm w-full sm:w-auto ${
                activeSpeakerId === 'bob'
                  ? 'border-purple-600 ring-4 ring-purple-100 shadow-md bg-purple-50/20'
                  : 'border-gray-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0 mt-0.5">
                    <img
                      src={getSeatTraveler('bob').avatar}
                      alt="Bob"
                      className={`w-11 h-11 rounded-xl object-cover border-2 transition-all ${
                        activeSpeakerId === 'bob' ? 'border-purple-600 ring-2 ring-purple-200' : 'border-gray-200'
                      }`}
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full p-0.5 border border-gray-200">
                      {getSeatTraveler('bob').agentAvatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900">Bob</span>
                      {activeSpeakerId === 'bob' ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-600 text-white flex items-center gap-1 animate-pulse">
                          <Radio className="w-2.5 h-2.5" /> SPEAKING NOW
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-gray-100 text-gray-400">
                          Waiting
                        </span>
                      )}
                      
                      <div
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                          votes['bob'] === 'agree'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {votes['bob'] === 'agree' ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-600" />}
                        <span>{votes['bob'] === 'agree' ? 'Agreed' : 'Disagreed'}</span>
                      </div>
                    </div>

                    {/* Read-Only AI Choice Badge for Bob */}
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                        AI Choice:
                      </span>
                      <span className="text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                        {getOptionTitle(chosenOptions['bob'] || defaultOption.id)} ({agenda.dilemmaOptions.find(o => o.id === (chosenOptions['bob'] || defaultOption.id))?.cost})
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl mt-1.5 border border-gray-200 leading-snug">
                      {speechBubbles.bob}
                    </div>
                  </div>
                </div>
              </div>

              {/* Charlie (Seat 4) */}
              <div className={`p-3 rounded-2xl border transition-all max-w-sm w-full sm:w-auto ${
                activeSpeakerId === 'charlie'
                  ? 'border-purple-600 ring-4 ring-purple-100 shadow-md bg-purple-50/20'
                  : 'border-gray-200'
              }`}>
                <div className="flex items-start gap-3 sm:flex-row-reverse sm:text-right">
                  <div className="relative shrink-0 mt-0.5">
                    <img
                      src={getSeatTraveler('charlie').avatar}
                      alt="Charlie"
                      className={`w-11 h-11 rounded-xl object-cover border-2 transition-all ${
                        activeSpeakerId === 'charlie' ? 'border-purple-600 ring-2 ring-purple-200' : 'border-gray-200'
                      }`}
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full p-0.5 border border-gray-200">
                      {getSeatTraveler('charlie').agentAvatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                      <span className="text-xs font-bold text-gray-900">Charlie</span>
                      {activeSpeakerId === 'charlie' ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-600 text-white flex items-center gap-1 animate-pulse">
                          <Radio className="w-2.5 h-2.5" /> SPEAKING NOW
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-gray-100 text-gray-400">
                          Waiting
                        </span>
                      )}
                      
                      <div
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                          votes['charlie'] === 'agree'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {votes['charlie'] === 'agree' ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-rose-600" />}
                        <span>{votes['charlie'] === 'agree' ? 'Agreed' : 'Disagreed'}</span>
                      </div>
                    </div>

                    {/* Read-Only AI Choice Badge for Charlie */}
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between w-full sm:justify-end sm:gap-2">
                      <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                        AI Choice:
                      </span>
                      <span className="text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                        {getOptionTitle(chosenOptions['charlie'] || defaultOption.id)} ({agenda.dilemmaOptions.find(o => o.id === (chosenOptions['charlie'] || defaultOption.id))?.cost})
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl mt-1.5 border border-gray-200 leading-snug sm:text-left">
                      {speechBubbles.charlie}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Dilemma Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {agenda.dilemmaOptions.map((option) => {
              const isSelected = selectedOption === option.id;
              const isUserChosen = (chosenOptions['you'] || defaultOption.id) === option.id;

              return (
                <div
                  key={option.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-50/60 border-purple-600 shadow-xs ring-1 ring-purple-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        {option.title.split(':')[0]}
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {option.cost}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 leading-snug">
                      {option.title.split(':')[1] || option.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                      {option.aiSummary || option.description}
                    </p>
                  </div>

                  <div className="pt-2.5 mt-2.5 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <span>Vibe:</span>
                        <span className="font-semibold text-gray-800">{option.vibe}</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleSelectOption(option.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          isSelected ? 'bg-purple-600 text-white shadow-2xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected ? '★ Table Focus' : 'Set as Table Focus'}
                      </button>
                    </div>

                    {/* User Choice Button */}
                    <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-medium">Your Stance:</span>
                      <button
                        type="button"
                        onClick={() => handleChooseOption('you', option.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                          isUserChosen
                            ? 'bg-purple-600 text-white shadow-2xs ring-1 ring-purple-300'
                            : 'bg-gray-50 hover:bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        <span>{isUserChosen ? '✓ Your Choice' : 'Select as My Choice'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Feed & Turn-Taking Chat Drawer */}
        {showLogDrawer && (
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-xs h-[640px] flex flex-col">
            <div className="pb-3 border-b border-gray-100 shrink-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Deliberation Live Feed
                  </h4>
                </div>
                <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {logs.length} events
                </span>
              </div>

              {/* Floor Status Banner */}
              <div className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                activeSpeakerId === 'you'
                  ? 'bg-purple-100 text-purple-900 border border-purple-300 ring-1 ring-purple-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${activeSpeakerId === 'you' ? 'bg-purple-600 animate-ping' : 'bg-amber-500 animate-pulse'}`}></span>
                  <span>{activeSpeakerId === 'you' ? '👉 Your Turn to Speak!' : `⏳ Floor: ${currentSpeakerTraveler?.name} speaking`}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-bold bg-white px-2 py-0.5 rounded-md border border-gray-200">
                  Round {roundNumber}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-3 px-1">
              {logs.map((log, index) => {
                const isUser = log.type === 'user' || log.sender?.toLowerCase().includes('justin');
                const isOrchestrator = log.type === 'orchestrator';

                const renderLogAvatar = (avatar, fallback = '👤') => {
                  if (typeof avatar === 'string' && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/'))) {
                    return (
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-5 h-5 rounded-full object-cover shrink-0 border border-gray-200"
                      />
                    );
                  }
                  return (
                    <span className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-xs shrink-0 border border-gray-200">
                      {avatar || fallback}
                    </span>
                  );
                };

                return (
                  <div
                    key={log.id || index}
                    className={`p-2.5 rounded-xl border text-xs transition-all space-y-1 ${
                      isUser
                        ? 'bg-purple-50/70 border-purple-200/80 shadow-2xs'
                        : isOrchestrator
                        ? 'bg-amber-50/40 border-amber-200/80 shadow-2xs'
                        : 'bg-gray-50 border-gray-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {renderLogAvatar(log.avatar)}
                        <span className="font-bold text-gray-900 truncate">
                          {log.sender}
                        </span>
                        {log.roleBadge && (
                          <span className="text-[9px] font-medium bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-600 shrink-0">
                            {log.roleBadge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-normal shrink-0">
                        {log.time || 'Just now'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed pl-6.5 break-words whitespace-pre-wrap">
                      {log.text}
                    </p>

                    {/* AI Reasoning & Constraint Audit Accordion */}
                    {log.thinking && (
                      <div className="mt-1.5 pt-1.5 border-t border-gray-200/60 pl-6.5">
                        <button
                          type="button"
                          onClick={() => toggleLogThinking(log.id || index)}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-purple-700 hover:text-purple-900 cursor-pointer transition-colors"
                        >
                          <Brain className="w-3 h-3 text-purple-600" />
                          <span>🧠 AI Reasoning & Context Audit</span>
                          {expandedThinkingLogs[log.id || index] ? (
                            <ChevronUp className="w-2.5 h-2.5 text-purple-600" />
                          ) : (
                            <ChevronDown className="w-2.5 h-2.5 text-purple-600" />
                          )}
                        </button>
                        {expandedThinkingLogs[log.id || index] && (
                          <div className="mt-1 p-2 bg-purple-50/70 rounded-lg text-[10px] text-purple-950 border border-purple-200/80 font-mono leading-relaxed whitespace-pre-wrap animate-in fade-in duration-150">
                            {log.thinking}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {isAiReplying && (
                <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-200 space-y-0.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-[11px] text-purple-800 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                    <span>Squad Sub-AIs are deliberating with Gemini...</span>
                  </div>
                </div>
              )}
              <div ref={logEndRef} />
            </div>

            {/* Ingestion Input Form: User Speaks on their Turn */}
            <div className="pt-3 border-t border-gray-100 shrink-0 space-y-1.5">
              <form
                onSubmit={handleSendArgument}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={customArgument}
                  onChange={(e) => setCustomArgument(e.target.value)}
                  disabled={activeSpeakerId !== 'you' || isAiReplying}
                  placeholder={
                    activeSpeakerId === 'you'
                      ? "Your turn! Type your argument or proposal to the squad..."
                      : `Floor held by ${currentSpeakerTraveler?.name}. Waiting for your turn...`
                  }
                  className={`flex-1 px-3 py-2 border rounded-xl text-xs text-gray-900 focus:outline-none transition-colors ${
                    activeSpeakerId === 'you'
                      ? 'bg-gray-50 border-gray-300 focus:border-purple-600 focus:bg-white'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                />
                <button
                  type="submit"
                  disabled={activeSpeakerId !== 'you' || isAiReplying || !customArgument.trim()}
                  className={`px-3.5 py-2 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center gap-1 ${
                    activeSpeakerId === 'you' && customArgument.trim() && !isAiReplying
                      ? 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
                      : 'bg-gray-300 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
              
              {activeSpeakerId !== 'you' && (
                <p className="text-[10px] text-gray-400 flex items-center gap-1 px-1">
                  <Clock className="w-3 h-3 text-purple-500 shrink-0" />
                  <span>Only the active speaker may contribute. Turns advance clockwise around the table.</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-sm p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Schedule Squad Meeting</span>
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Meeting Time & Date
                </label>
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  placeholder="e.g. Tomorrow at 7:30 PM"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMeetingMode('scheduled');
                    setShowScheduleModal(false);
                  }}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Confirm Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
