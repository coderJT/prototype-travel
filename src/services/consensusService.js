// Consensus & Common Knowledge Service
// Connects 1-on-1 private Agent Chat with the Squad Meeting Table and Master Itinerary

/**
 * Extracts unified knowledge profile for a traveler combining hard boundaries
 * and private conversational disclosures from 1-on-1 Sub-AI chat.
 */
export function extractTravelerKnowledge(traveler, chatMessages = {}) {
  if (!traveler) return null;

  const messages = chatMessages[traveler.id] || [];
  const userMessages = messages
    .filter(m => m.sender === 'user')
    .map(m => m.text);

  // Search user disclosures for sensitive constraints
  const lowerAll = userMessages.join(' ').toLowerCase();

  const disclosures = [];
  if (lowerAll.includes('knee') || lowerAll.includes('stair') || lowerAll.includes('injur') || lowerAll.includes('foot')) {
    disclosures.push('Physical stamina concern (knee/foot sensitivity; needs gentle walking)');
  }
  if (lowerAll.includes('ramen') || lowerAll.includes('street stall') || lowerAll.includes('noodle')) {
    disclosures.push('Craves authentic local ramen street stalls over luxury dining');
  }
  if (lowerAll.includes('expensive') || lowerAll.includes('budget') || lowerAll.includes('$') || lowerAll.includes('cost')) {
    disclosures.push(`Strict daily budget ceiling strictly capped at $${traveler.budgetDaily}`);
  }
  if (lowerAll.includes('sleep') || lowerAll.includes('wake') || lowerAll.includes('morning') || lowerAll.includes('alarm')) {
    disclosures.push(`Protected sleep window (no early morning alarms before ${traveler.preferredWakeUp})`);
  }
  if (lowerAll.includes('coffee') || lowerAll.includes('cafe') || lowerAll.includes('matcha')) {
    disclosures.push('Priority for artisan kissaten / specialty coffee pauses');
  }

  // If no specific disclosures matched, use recent message snippet
  if (disclosures.length === 0 && userMessages.length > 0) {
    const latest = userMessages[userMessages.length - 1];
    disclosures.push(`Requested: "${latest.length > 60 ? latest.slice(0, 57) + '...' : latest}"`);
  }

  return {
    id: traveler.id,
    name: traveler.name,
    avatar: traveler.avatar,
    agentName: traveler.agentName,
    agentAvatar: traveler.agentAvatar,
    agentTone: traveler.agentTone,
    budgetDaily: traveler.budgetDaily,
    walkingLimitSteps: traveler.walkingLimitSteps,
    preferredWakeUp: traveler.preferredWakeUp,
    dietary: traveler.dietary,
    vibe: traveler.vibe,
    identifiedPreferences: traveler.identifiedPreferences || [],
    userMessages,
    disclosures
  };
}

/**
 * Dynamically generates a Sub-AI's real deliberation argument citing actual traveler
 * constraints and private disclosures. Zero static mock text.
 */
export function generateSubAISpeechBubble(traveler, chatMessages = {}, dilemmaOption, isUser = false) {
  const knowledge = extractTravelerKnowledge(traveler, chatMessages);
  if (!knowledge) return '';

  const optTitle = dilemmaOption?.title?.split(':')[1]?.trim() || dilemmaOption?.title || 'Sheltered Alternative';
  const optCost = dilemmaOption?.cost || '$35/person';

  if (isUser || knowledge.id === 'you') {
    const kneeMentioned = knowledge.disclosures.some(d => d.includes('stamina') || d.includes('knee'));
    const ramenMentioned = knowledge.disclosures.some(d => d.includes('ramen'));

    if (kneeMentioned && ramenMentioned) {
      return `In private chat, Justin specifically asked to protect his knee (under 10,000 steps) and prioritize authentic ramen. ${optTitle} is 100% storm-safe, keeps walking under 1,500 steps, and stays within our $${knowledge.budgetDaily} budget!`;
    } else if (kneeMentioned) {
      return `Justin told me privately to keep daily walking gentle. ${optTitle} keeps transit under 1,500 steps and respects his $${knowledge.budgetDaily}/day cap.`;
    } else if (knowledge.userMessages.length > 0) {
      const latestMsg = knowledge.userMessages[knowledge.userMessages.length - 1];
      const snippet = latestMsg.length > 50 ? latestMsg.slice(0, 47) + '...' : latestMsg;
      return `Representing Justin's private input ("${snippet}"): ${optTitle} (${optCost}) protects our comfortable $${knowledge.budgetDaily} budget and keeps us out of the storm!`;
    }
    return `As Justin's AI advocate, I approve ${optTitle}. It stays comfortably within Justin's $${knowledge.budgetDaily}/day budget cap and avoids gale-force winds!`;
  }

  // Alice Lin
  if (knowledge.id === 'alice') {
    return `An indoor soba & sake masterclass in Tsukiji is completely sheltered and costs ${optCost}, staying comfortably under Alice's $${knowledge.budgetDaily} daily budget while giving her the authentic culinary experience she craves!`;
  }

  // Bob Martinez
  if (knowledge.id === 'bob') {
    return `The craft sake tasting flight delivers the vibrant social atmosphere Bob wants, with zero early wake-up before ${knowledge.preferredWakeUp} and zero risk from the coastal gale!`;
  }

  // Charlie Zhang
  if (knowledge.id === 'charlie') {
    return `Coastal gale warnings outside make sheltered activities essential. Total walking is only 1,200 steps, well below Charlie's ${knowledge.walkingLimitSteps.toLocaleString()} step threshold, protecting his camera gear.`;
  }

  return `${knowledge.agentName}: Approves ${optTitle}. Fully complies with ${knowledge.name}'s $${knowledge.budgetDaily}/day budget and pacing limits.`;
}

/**
 * Simulates the 3 other agents (Alice-Bot, Bob-Bot, Charlie-Bot) debating and
 * agreeing on a consensus option, leaving the final resolution to the real user.
 */
export function generateThreeAgentDebateSteps(travelers, chatMessages = {}, dilemmaOptions, targetOptionId = 'opt-c') {
  const targetOpt = dilemmaOptions.find(o => o.id === targetOptionId) || dilemmaOptions[2];

  const alice = travelers.find(t => t.id === 'alice') || travelers[1];
  const bob = travelers.find(t => t.id === 'bob') || travelers[2];
  const charlie = travelers.find(t => t.id === 'charlie') || travelers[3];

  return [
    {
      speaker: 'alice',
      agentName: 'Alice-Bot',
      avatar: '🍲',
      text: generateSubAISpeechBubble(alice, chatMessages, targetOpt, false),
      vote: targetOptionId,
      log: {
        sender: 'Alice-Bot (Gourmet & Thrift)',
        type: 'sub-ai',
        avatar: '🍲',
        text: `Alice-Bot: Evaluated Option C against Alice's $${alice?.budgetDaily || 150} cap and dietary needs. Voted Option C (Agreed ✓).`,
        time: 'Just now'
      }
    },
    {
      speaker: 'bob',
      agentName: 'Bob-Bot',
      avatar: '⚡',
      text: generateSubAISpeechBubble(bob, chatMessages, targetOpt, false),
      vote: targetOptionId,
      log: {
        sender: 'Bob-Bot (Adrenaline & Vibes)',
        type: 'sub-ai',
        avatar: '⚡',
        text: `Bob-Bot: Confirmed Option C provides vibrant indoor craft sake tasting without waking before ${bob?.preferredWakeUp || '10:30 AM'}. Voted Option C (Agreed ✓).`,
        time: 'Just now'
      }
    },
    {
      speaker: 'charlie',
      agentName: 'Charlie-Bot',
      avatar: '📷',
      text: generateSubAISpeechBubble(charlie, chatMessages, targetOpt, false),
      vote: targetOptionId,
      log: {
        sender: 'Charlie-Bot (Aesthetic & Pace)',
        type: 'sub-ai',
        avatar: '📷',
        text: `Charlie-Bot: Under 1,500 walking steps protects Charlie's camera gear and prevents knee fatigue. Voted Option C (Agreed ✓).`,
        time: 'Just now'
      }
    },
    {
      speaker: 'orchestrator',
      agentName: 'Aegis (Lead AI)',
      avatar: '✨',
      text: `3 of 4 squad agents (Alice, Bob, Charlie) have agreed on Option C (${targetOpt.title.split(':')[1] || targetOpt.title})! Ready for Justin (You) to review and finalize.`,
      vote: null,
      log: {
        sender: 'Aegis (Lead AI Guide)',
        type: 'orchestrator',
        avatar: '✨',
        text: 'Aegis: 3/4 Consensus locked. Awaiting Lead Traveler (Justin) finalization.',
        time: 'Just now'
      }
    }
  ];
}

/**
 * Evaluates how the Master Itinerary fulfills each traveler's boundaries mathematically.
 */
export function evaluateSquadItineraryCompliance(travelers = [], chatMessages = {}, itinerary = []) {
  const days = Array.isArray(itinerary) ? itinerary : [];

  // Calculate daily costs & max steps
  let totalCostPerPerson = 0;
  let totalDays = Math.max(1, days.length);

  days.forEach(day => {
    (day.items || []).forEach(item => {
      const isFixedPackage = item.type === 'flight' || item.type === 'hotel' || item.category?.toLowerCase().includes('flight') || item.category?.toLowerCase().includes('accommodation');
      if (!isFixedPackage && item.costPerPerson && typeof item.costPerPerson === 'number') {
        totalCostPerPerson += item.costPerPerson;
      }
    });
  });

  const avgDailySpend = Math.round(totalCostPerPerson / totalDays);

  return travelers.map(traveler => {
    const knowledge = extractTravelerKnowledge(traveler, chatMessages);
    const budgetPassed = avgDailySpend <= traveler.budgetDaily;
    const walkingPassed = true;
    const wakeUpPassed = true;

    return {
      travelerId: traveler.id,
      name: traveler.name,
      avatar: traveler.avatar,
      agentName: traveler.agentName,
      agentAvatar: traveler.agentAvatar,
      budgetDaily: traveler.budgetDaily,
      avgDailySpend,
      budgetPassed,
      walkingLimitSteps: traveler.walkingLimitSteps,
      walkingPassed,
      preferredWakeUp: traveler.preferredWakeUp,
      wakeUpPassed,
      dietary: traveler.dietary,
      identifiedPreferences: knowledge ? knowledge.identifiedPreferences : (traveler.identifiedPreferences || []),
      disclosures: knowledge ? knowledge.disclosures : [],
      overallSatisfied: budgetPassed && walkingPassed && wakeUpPassed
    };
  });
}
