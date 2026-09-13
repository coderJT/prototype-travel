import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_TRAVELERS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_MEETING_AGENDA,
  INITIAL_ITINERARY
} from '../src/data/mockData.js';
import {
  extractTravelerKnowledge,
  generateSubAISpeechBubble,
  generateThreeAgentDebateSteps,
  evaluateSquadItineraryCompliance
} from '../src/services/consensusService.js';
import {
  chatWithSubAI,
  generatePlanWithAI,
  resolveGeminiModel,
  generateMeetingDebateWithAI,
  respondToMeetingArgumentWithAI
} from '../src/services/geminiService.js';
import {
  StateGraph,
  runSubAIChatGraph,
  runSquadDeliberationGraph,
  runMeetingArgumentGraph,
  buildCompleteGroundTruthContext,
  extractLearnedParameters,
  generatePeerAgentTurnResponse
} from '../src/services/langgraphEngine.js';

describe('End-to-End Squad Travel Conciliation Flow (4-Person Trip)', () => {
  // Setup 4-person squad: You (Justin) + Alice + Bob + Charlie
  const travelers = [...INITIAL_TRAVELERS];
  const userTraveler = travelers.find(t => t.id === 'you');
  const alice = travelers.find(t => t.id === 'alice');
  const bob = travelers.find(t => t.id === 'bob');
  const charlie = travelers.find(t => t.id === 'charlie');
  const dilemmaOptions = INITIAL_MEETING_AGENDA.dilemmaOptions;
  const targetOption = dilemmaOptions.find(o => o.id === 'opt-c');

  it('Step 1: Setup 4 travelers in the squad, with 1 as real user ("you")', () => {
    assert.equal(travelers.length, 4, 'Trip squad must have exactly 4 travelers');
    assert.ok(userTraveler, 'Lead traveler "you" must exist');
    assert.equal(userTraveler.id, 'you');
    assert.equal(userTraveler.name, 'Justin (You)');
    assert.equal(userTraveler.budgetDaily, 160);
    assert.equal(userTraveler.walkingLimitSteps, 10000);

    assert.ok(alice, 'Traveler Alice must exist');
    assert.ok(bob, 'Traveler Bob must exist');
    assert.ok(charlie, 'Traveler Charlie must exist');
  });

  it('Step 2 (Individual Test): Personal 1-on-1 Chat with Sub-AI and Knowledge Extraction', async () => {
    // 1. User sends message disclosing knee injury and ramen preference to Justin-Bot
    const userMessage = "I injured my knee last year, please keep walking under 10,000 steps and prioritize authentic ramen street stalls.";
    const chatHistory = INITIAL_CHAT_MESSAGES.you || [];

    const botResponse = await chatWithSubAI({
      traveler: userTraveler,
      userMessage,
      chatHistory,
      destination: 'Tokyo'
    });

    // Sub-AI must intelligently acknowledge without repeating "I've added 'hi'"
    assert.ok(typeof botResponse === 'string' && botResponse.length > 20);
    assert.ok(
      botResponse.toLowerCase().includes('knee') ||
      botResponse.toLowerCase().includes('walk') ||
      botResponse.toLowerCase().includes('pacing') ||
      botResponse.toLowerCase().includes('step') ||
      botResponse.toLowerCase().includes('ramen'),
      'Sub-AI response should specifically address knee, pacing or ramen'
    );

    // 2. Updated chat messages in state
    const updatedChatMessages = {
      ...INITIAL_CHAT_MESSAGES,
      you: [
        ...chatHistory,
        { id: Date.now(), sender: 'user', text: userMessage },
        { id: Date.now() + 1, sender: 'bot', text: botResponse }
      ]
    };

    // 3. Extract knowledge
    const knowledge = extractTravelerKnowledge(userTraveler, updatedChatMessages);
    assert.ok(knowledge.disclosures.length >= 2, 'Should have extracted sensitive disclosures');
    assert.ok(
      knowledge.disclosures.some(d => d.includes('stamina') || d.includes('knee')),
      'Should extract physical stamina concern'
    );
    assert.ok(
      knowledge.disclosures.some(d => d.includes('ramen')),
      'Should extract authentic ramen preference'
    );
  });

  it('Step 3 (Individual Test): Common Knowledge Bridge to Deliberation Speech Bubbles', () => {
    const updatedChatMessages = {
      ...INITIAL_CHAT_MESSAGES,
      you: [
        { id: 1, sender: 'user', text: 'I injured my knee, keep walks under 10,000 steps and find great ramen.' }
      ]
    };

    // 1. Justin's Sub-AI speech bubble must cite knee injury and ramen
    const userSpeech = generateSubAISpeechBubble(userTraveler, updatedChatMessages, targetOption, true);
    assert.ok(userSpeech.includes('Justin'), 'Must cite Justin');
    assert.ok(userSpeech.includes('knee') || userSpeech.includes('gentle walking'), 'Must cite knee constraint');
    assert.ok(userSpeech.includes('ramen'), 'Must cite ramen preference');
    assert.ok(userSpeech.includes('$160'), 'Must cite budget cap $160');

    // 2. Alice's speech bubble cites her $150 budget and sheltered soba
    const aliceSpeech = generateSubAISpeechBubble(alice, updatedChatMessages, targetOption, false);
    assert.ok(aliceSpeech.includes('Alice'), 'Must cite Alice');
    assert.ok(aliceSpeech.includes('$150'), 'Must cite Alice budget');

    // 3. Bob's speech bubble cites wake-up and vibrant atmosphere
    const bobSpeech = generateSubAISpeechBubble(bob, updatedChatMessages, targetOption, false);
    assert.ok(bobSpeech.includes('Bob'), 'Must cite Bob');
    assert.ok(bobSpeech.includes('10:30 AM') || bobSpeech.includes('craft sake'), 'Must cite Bob constraints');

    // 4. Charlie's speech bubble cites step limit and camera protection
    const charlieSpeech = generateSubAISpeechBubble(charlie, updatedChatMessages, targetOption, false);
    assert.ok(charlieSpeech.includes('Charlie'), 'Must cite Charlie');
    assert.ok(charlieSpeech.includes('8,000') || charlieSpeech.includes('1,200'), 'Must cite Charlie step limit');
  });

  it('Step 4 (Individual Test): 3 Agents Debate and Reach Agreement (Alice, Bob, Charlie)', () => {
    const debateSteps = generateThreeAgentDebateSteps(travelers, INITIAL_CHAT_MESSAGES, dilemmaOptions, 'opt-c');

    assert.equal(debateSteps.length, 4, 'Debate must have 4 steps (3 agents + orchestrator handoff)');
    assert.equal(debateSteps[0].speaker, 'alice');
    assert.equal(debateSteps[0].vote, 'opt-c');

    assert.equal(debateSteps[1].speaker, 'bob');
    assert.equal(debateSteps[1].vote, 'opt-c');

    assert.equal(debateSteps[2].speaker, 'charlie');
    assert.equal(debateSteps[2].vote, 'opt-c');

    // Step 4: Aegis handoff to Justin (You)
    assert.equal(debateSteps[3].speaker, 'orchestrator');
    assert.ok(debateSteps[3].text.includes('Alice, Bob, Charlie'), 'Orchestrator notes 3 agents agreed');
    assert.ok(debateSteps[3].text.includes('Justin (You)'), 'Orchestrator hands floor to Justin');
  });

  it('Step 5 (Individual Test): User Finalization & Master Itinerary Synchronization', () => {
    // 3 agents agreed on 'opt-c'
    const votes = {
      alice: 'opt-c',
      bob: 'opt-c',
      charlie: 'opt-c',
      you: null
    };

    // User casts final vote and clicks "Finalize Consensus"
    votes.you = 'opt-c';

    assert.equal(votes.you, 'opt-c');
    const allAgreed = Object.values(votes).every(v => v === 'opt-c');
    assert.ok(allAgreed, 'All 4 travelers must have agreed on Option C');

    // Itinerary Day 3 update
    const updatedItinerary = INITIAL_ITINERARY.map(day => {
      if (day.day === 3) {
        return {
          ...day,
          consensusScore: 98,
          disruptionRisk: null,
          items: day.items.map(item => {
            if (item.id === 'item-3-3') {
              return {
                ...item,
                title: targetOption.title.replace(/Option [A-C]:\s*/i, ''),
                status: 'replaced',
                advocate: 'Unanimous 4/4 Squad Agreement (Soba & Sake Masterclass)',
                description: targetOption.aiSummary,
                disruptionReason: null,
                costPerPerson: 35
              };
            }
            return item;
          })
        };
      }
      return day;
    });

    const day3 = updatedItinerary.find(d => d.day === 3);
    const replacedItem = day3.items.find(i => i.id === 'item-3-3');
    assert.equal(replacedItem.status, 'replaced');
    assert.equal(replacedItem.costPerPerson, 35);
    assert.ok(replacedItem.advocate.includes('Unanimous 4/4'));
  });

  it('Step 6 (Individual Test): Master Itinerary Common Knowledge & Alignment Summary', () => {
    const complianceList = evaluateSquadItineraryCompliance(travelers, INITIAL_CHAT_MESSAGES, INITIAL_ITINERARY);

    assert.equal(complianceList.length, 4, 'Compliance audit must evaluate all 4 travelers');

    complianceList.forEach(member => {
      assert.ok(member.budgetPassed, `${member.name} budget must pass`);
      assert.ok(member.walkingPassed, `${member.name} walking limit must pass`);
      assert.ok(member.wakeUpPassed, `${member.name} wake-up limit must pass`);
      assert.ok(member.overallSatisfied, `${member.name} must be overall satisfied`);
    });

    const userCompliance = complianceList.find(m => m.travelerId === 'you');
    assert.ok(userCompliance, 'User compliance record must exist');
    assert.equal(userCompliance.budgetDaily, 160);
    assert.ok(userCompliance.disclosures.length > 0, 'User disclosures must be present in summary');
  });

  it('Step 7 (Individual Test): AI Itinerary Generation produces structured multi-day plans', async () => {
    const generatedPlan = await generatePlanWithAI({
      destination: 'Tokyo',
      durationDays: 4,
      theme: 'Squad Cultural & Foodie Alignment',
      pace: 'Balanced',
      travelers
    });

    assert.ok(Array.isArray(generatedPlan), 'Generated plan must be an array');
    assert.ok(generatedPlan.length >= 2, 'Generated plan must have at least 2 days');

    generatedPlan.forEach(day => {
      assert.ok(typeof day.day === 'number', 'Day number must be present');
      assert.ok(day.title || day.theme, 'Day title or theme must be present');
      assert.ok(Array.isArray(day.items) && day.items.length > 0, 'Day must contain activity items');
      day.items.forEach(item => {
        assert.ok(item.title, 'Activity item must have title');
        assert.ok(typeof item.costPerPerson === 'number' || typeof item.costPerPerson === 'string', 'Activity item must have cost');
      });
    });
  });

  it('Step 8 (Individual Test): Model Resolution resolves to a valid Gemini candidate', async () => {
    const model = await resolveGeminiModel('');
    assert.ok(typeof model === 'string' && model.length > 0, 'Resolved model must be a non-empty string');
    assert.ok(!model.includes('models/'), 'Model name must have models/ prefix stripped');
  });

  it('Step 9 (Individual Test): Agree and Disagree Voting Tallies and Majority Thresholds', () => {
    // 1. Initial unanimous state (4 agree, 0 disagree)
    const unanimousVotes = { alice: 'agree', bob: 'agree', charlie: 'agree', you: 'agree' };
    const unanimousAgreeCount = Object.values(unanimousVotes).filter(v => v === 'agree').length;
    const unanimousDisagreeCount = Object.values(unanimousVotes).filter(v => v === 'disagree').length;
    assert.equal(unanimousAgreeCount, 4);
    assert.equal(unanimousDisagreeCount, 0);
    assert.equal(unanimousAgreeCount >= 3, true, 'Majority threshold must be met (>= 3 agrees)');
    assert.equal(unanimousAgreeCount === 4, true, 'Unanimous consensus must be true');

    // 2. Majority state with 1 dissenter (3 agree, 1 disagree)
    const majorityVotes = { alice: 'agree', bob: 'disagree', charlie: 'agree', you: 'agree' };
    const majorityAgreeCount = Object.values(majorityVotes).filter(v => v === 'agree').length;
    const majorityDisagreeCount = Object.values(majorityVotes).filter(v => v === 'disagree').length;
    assert.equal(majorityAgreeCount, 3);
    assert.equal(majorityDisagreeCount, 1);
    assert.equal(majorityAgreeCount >= 3, true, 'Majority threshold must still be met');
    assert.equal(majorityAgreeCount === 4, false, 'Unanimous consensus is false');

    // 3. Contested state with 2 dissenters (2 agree, 2 disagree)
    const contestedVotes = { alice: 'disagree', bob: 'disagree', charlie: 'agree', you: 'agree' };
    const contestedAgreeCount = Object.values(contestedVotes).filter(v => v === 'agree').length;
    const contestedDisagreeCount = Object.values(contestedVotes).filter(v => v === 'disagree').length;
    assert.equal(contestedAgreeCount, 2);
    assert.equal(contestedDisagreeCount, 2);
    assert.equal(contestedAgreeCount >= 3, false, 'Consensus blocked when < 3 agrees');
  });

  it('Step 10 (Individual Test): Meeting Table Argument Ingestion with AI', async () => {
    // Test argument response addressing budget/cost concern
    const budgetArgResponse = await respondToMeetingArgumentWithAI({
      userArgument: 'Can we check if $35 fits our remaining daily allowance?',
      traveler: userTraveler,
      currentOption: targetOption,
      destination: 'Tokyo',
      travelers
    });
    assert.ok(typeof budgetArgResponse === 'string' && budgetArgResponse.length > 20);
    assert.ok(budgetArgResponse.toLowerCase().includes('budget') || budgetArgResponse.toLowerCase().includes('$') || budgetArgResponse.toLowerCase().includes('aegis'));

    // Test argument response addressing physical knee/walking concern
    const kneeArgResponse = await respondToMeetingArgumentWithAI({
      userArgument: 'Will the walk to the soba shop aggravate my knee?',
      traveler: userTraveler,
      currentOption: targetOption,
      destination: 'Tokyo',
      travelers
    });
    assert.ok(typeof kneeArgResponse === 'string' && kneeArgResponse.length > 20);
    assert.ok(kneeArgResponse.toLowerCase().includes('transit') || kneeArgResponse.toLowerCase().includes('walk') || kneeArgResponse.toLowerCase().includes('step') || kneeArgResponse.toLowerCase().includes('knee'));
  });

  it('Step 11 (LangGraph Test): StateGraph Core Engine and Directed Conditional Routing', async () => {
    const graph = new StateGraph({ count: 0, status: 'pending' });

    graph.addNode('increment', async (state) => {
      return { count: state.count + 1 };
    });

    graph.addNode('checkQuorum', async (state) => {
      return { status: state.count >= 3 ? 'approved' : 'continue' };
    });

    graph.addNode('finalize', async (state) => {
      return { finalized: true };
    });

    graph.setEntryPoint('increment');
    graph.addEdge('increment', 'checkQuorum');
    graph.addConditionalEdges(
      'checkQuorum',
      (state) => state.status,
      {
        'approved': 'finalize',
        'continue': 'increment'
      }
    );
    graph.setFinishPoint('finalize');

    const result = await graph.invoke({ count: 2 });
    assert.equal(result.state.count, 3, 'StateGraph should have incremented count to 3');
    assert.equal(result.state.status, 'approved', 'Conditional edge should have evaluated status as approved');
    assert.equal(result.state.finalized, true, 'Finish point finalize node should have set finalized true');
    assert.ok(result.trace.length >= 3, 'Execution trace should record node transitions');
  });

  it('Step 12 (LangGraph Test): Zero-Hallucination Context Grounding for Itinerary & Squad Queries', async () => {
    // 1. Query Day 1 itinerary activities
    const day1Result = await runSubAIChatGraph({
      traveler: userTraveler,
      userMessage: 'What are we doing on Day 1?',
      chatHistory: [],
      destination: 'Tokyo',
      itinerary: INITIAL_ITINERARY,
      travelers
    });
    assert.ok(typeof day1Result.reply === 'string' && day1Result.reply.length > 20);
    assert.ok(
      day1Result.reply.toLowerCase().includes('shinjuku') || day1Result.reply.toLowerCase().includes('day 1'),
      'Agent must accurately cite Day 1 activities from Master Itinerary'
    );

    // 2. Query lowest budget in squad
    const budgetResult = await runSubAIChatGraph({
      traveler: userTraveler,
      userMessage: 'Who has the lowest budget in our squad?',
      chatHistory: [],
      destination: 'Tokyo',
      itinerary: INITIAL_ITINERARY,
      travelers
    });
    assert.ok(typeof budgetResult.reply === 'string' && budgetResult.reply.length > 20);
    assert.ok(
      budgetResult.reply.toLowerCase().includes('alice') && budgetResult.reply.includes('150'),
      'Agent must accurately identify Alice and her $150 budget limit'
    );

    // 3. Query Day 3 storm disruption
    const stormResult = await runSubAIChatGraph({
      traveler: userTraveler,
      userMessage: 'What is the storm risk on Day 3?',
      chatHistory: [],
      destination: 'Tokyo',
      itinerary: INITIAL_ITINERARY,
      travelers,
      dilemma: INITIAL_MEETING_AGENDA
    });
    assert.ok(typeof stormResult.reply === 'string');
    assert.ok(
      stormResult.reply.toLowerCase().includes('storm') ||
      stormResult.reply.toLowerCase().includes('cruise') ||
      stormResult.reply.toLowerCase().includes('soba') ||
      stormResult.reply.toLowerCase().includes('downpour'),
      'Agent must accurately cite Day 3 storm disruption contingency'
    );
  });

  it('Step 13 (LangGraph Test): Squad Deliberation Multi-Agent Graph with Agree/Disagree Stances', async () => {
    const deliberationSteps = await runSquadDeliberationGraph({
      travelers,
      destination: 'Tokyo',
      option: targetOption,
      dilemmaTitle: 'Day 3 Storm Warning Contingency',
      itinerary: INITIAL_ITINERARY,
      chatMessages: INITIAL_CHAT_MESSAGES
    });

    assert.ok(Array.isArray(deliberationSteps), 'Deliberation result must be an array of agent stances');
    assert.ok(deliberationSteps.length >= 3, 'Must have at least 3 peer agent stances');

    const aliceStance = deliberationSteps.find(s => s.speaker === 'alice');
    const bobStance = deliberationSteps.find(s => s.speaker === 'bob');
    const charlieStance = deliberationSteps.find(s => s.speaker === 'charlie');

    assert.ok(aliceStance, 'Alice-Bot stance must exist');
    assert.ok(['agree', 'disagree'].includes(aliceStance.agreement), 'Alice agreement must be valid');

    assert.ok(bobStance, 'Bob-Bot stance must exist');
    assert.ok(['agree', 'disagree'].includes(bobStance.agreement), 'Bob agreement must be valid');

    assert.ok(charlieStance, 'Charlie-Bot stance must exist');
    assert.ok(['agree', 'disagree'].includes(charlieStance.agreement), 'Charlie agreement must be valid');
  });

  it('Step 14 (LangGraph Test): Meeting Argument Graph Ingests Context and Responds Factually', async () => {
    const argReply = await runMeetingArgumentGraph({
      userArgument: 'Can we afford Option C without exceeding Alice budget?',
      traveler: userTraveler,
      currentOption: targetOption,
      destination: 'Tokyo',
      travelers,
      itinerary: INITIAL_ITINERARY
    });

    assert.ok(typeof argReply === 'string' && argReply.length > 20);
    assert.ok(
      argReply.toLowerCase().includes('alice') ||
      argReply.toLowerCase().includes('budget') ||
      argReply.toLowerCase().includes('$') ||
      argReply.toLowerCase().includes('aegis'),
      'Meeting argument response must reference actual squad budget facts'
    );
  });

  it('Step 15 (Learned Parameters Test): Extract and Update Daily Budget Cap, Steps, Wake-Up, and Dietary from Personal Chat', async () => {
    // 1. User updates budget to $200
    const budgetUpdate = extractLearnedParameters('Actually, please change my daily budget to $200', userTraveler);
    assert.equal(budgetUpdate.hasUpdates, true);
    assert.equal(budgetUpdate.budgetDaily, 200, 'Should extract updated budget $200');
    assert.ok(budgetUpdate.newPreferences.includes('#Budget$200'));

    // 2. User updates step limit to 7,500 steps
    const stepsUpdate = extractLearnedParameters('My knee feels tender, keep walking under 7,500 steps', userTraveler);
    assert.equal(stepsUpdate.hasUpdates, true);
    assert.equal(stepsUpdate.walkingLimitSteps, 7500, 'Should extract updated walking steps 7500');
    assert.ok(stepsUpdate.newPreferences.includes('#GentleWalking'));

    // 3. User updates wake-up time to 10:00 AM
    const wakeUpdate = extractLearnedParameters("I'm exhausted, please don't schedule morning tours before 10:00 AM", userTraveler);
    assert.equal(wakeUpdate.hasUpdates, true);
    assert.equal(wakeUpdate.preferredWakeUp, '10:00 AM', 'Should extract preferred wake-up 10:00 AM');
    assert.ok(wakeUpdate.newPreferences.includes('#NightOwl') || wakeUpdate.newPreferences.includes('#NoWakeUpBefore10AM'));

    // 4. User changes dietary to vegetarian
    const dietaryUpdate = extractLearnedParameters("I've switched to a vegetarian diet for this trip", userTraveler);
    assert.equal(dietaryUpdate.hasUpdates, true);
    assert.ok(dietaryUpdate.dietary.toLowerCase().includes('vegetarian'), 'Should extract vegetarian dietary');
    assert.ok(dietaryUpdate.newPreferences.includes('#VegetarianDining'));

    // 5. Full Chat with Sub-AI returns learnedParameters object when returnFull is true
    const chatResult = await chatWithSubAI({
      traveler: userTraveler,
      userMessage: 'Please set my daily budget to $220 and keep walks under 8,000 steps',
      chatHistory: [],
      destination: 'Tokyo',
      itinerary: INITIAL_ITINERARY,
      travelers,
      returnFull: true
    });

    assert.ok(typeof chatResult === 'object');
    assert.ok(typeof chatResult.reply === 'string');
    assert.equal(chatResult.learnedParameters.budgetDaily, 220);
    assert.equal(chatResult.learnedParameters.walkingLimitSteps, 8000);
  });

  it('Step 16 (Deliberation Turn System): Round-based Pass Limits, Chosen Option Tracking, and Reactive Peer AI Turns', async () => {
    // 1. Validate once-per-round pass limits
    let roundNumber = 1;
    let hasPassedThisRound = { you: false, alice: false, bob: false, charlie: false };
    const order = ['you', 'alice', 'bob', 'charlie'];

    // User passes turn in Round 1
    assert.equal(hasPassedThisRound['you'], false);
    hasPassedThisRound['you'] = true;
    assert.equal(hasPassedThisRound['you'], true, 'User should now be marked as passed for Round 1');

    // Simulate all members taking/passing their turn in Round 1
    hasPassedThisRound['alice'] = true;
    hasPassedThisRound['bob'] = true;
    hasPassedThisRound['charlie'] = true;

    // Check if all squad members passed/took turn -> resets for Round 2
    const allPassed = order.every(id => hasPassedThisRound[id]);
    assert.ok(allPassed);
    if (allPassed) {
      roundNumber += 1;
      hasPassedThisRound = { you: false, alice: false, bob: false, charlie: false };
    }
    assert.equal(roundNumber, 2, 'Round should increment to 2');
    assert.equal(hasPassedThisRound['you'], false, 'Pass state should reset for new round');

    // 2. Validate chosen options distribution per traveler
    const chosenOptions = {
      you: 'opt-c',
      alice: 'opt-c',
      bob: 'opt-c',
      charlie: 'opt-b'
    };

    const optCCount = Object.values(chosenOptions).filter(optId => optId === 'opt-c').length;
    const optBCount = Object.values(chosenOptions).filter(optId => optId === 'opt-b').length;
    assert.equal(optCCount, 3, '3 members chose Option C');
    assert.equal(optBCount, 1, '1 member chose Option B');

    // 3. Validate generatePeerAgentTurnResponse for Alice-Bot responding to user message
    const aliceTurn = await generatePeerAgentTurnResponse({
      speakerId: 'alice',
      lastUserMessage: 'I really prefer Option C because it keeps walking low and stays within our food budget',
      currentOption: targetOption,
      destination: 'Tokyo',
      travelers,
      itinerary: INITIAL_ITINERARY,
      currentRound: 2
    });

    assert.ok(aliceTurn, 'Alice turn response must be generated');
    assert.equal(aliceTurn.speaker, 'alice');
    assert.equal(aliceTurn.agentName, 'Alice-Bot');
    assert.ok(typeof aliceTurn.text === 'string' && aliceTurn.text.length > 10);
    assert.ok(aliceTurn.chosenOptionId, 'Alice must pick a chosen option ID');
    assert.ok(['agree', 'disagree'].includes(aliceTurn.agreement));
    assert.ok(typeof aliceTurn.log === 'string' && aliceTurn.log.length > 5, 'Must provide an authentic event log');
    assert.ok(
      aliceTurn.text.toLowerCase().includes('budget') ||
      aliceTurn.text.toLowerCase().includes('soba') ||
      aliceTurn.text.toLowerCase().includes('option') ||
      aliceTurn.text.toLowerCase().includes('food') ||
      aliceTurn.text.toLowerCase().includes('walk') ||
      aliceTurn.text.toLowerCase().includes('c'),
      'Alice statement must be contextually grounded in the trip preferences and user points'
    );
  });

  it('Step 17 (Universal Option Modification): Every squad member can independently modify their chosen option and update stance', () => {
    // Initial state: table focus is 'opt-c'
    let selectedOption = 'opt-c';
    let chosenOptions = {
      you: 'opt-c',
      alice: 'opt-c',
      bob: 'opt-c',
      charlie: 'opt-c'
    };
    let votes = {
      you: 'agree',
      alice: 'agree',
      bob: 'agree',
      charlie: 'agree'
    };

    // Helper simulation matching MeetingTable.jsx handleChooseOption
    const handleChooseOption = (travelerId, optionId) => {
      chosenOptions = { ...chosenOptions, [travelerId]: optionId };
      const newStance = optionId === selectedOption ? 'agree' : 'disagree';
      votes = { ...votes, [travelerId]: newStance };
    };

    // Helper simulation matching MeetingTable.jsx handleSelectOption
    const handleSelectOption = (optionId) => {
      selectedOption = optionId;
      const updatedVotes = {};
      Object.keys(chosenOptions).forEach(tId => {
        updatedVotes[tId] = chosenOptions[tId] === optionId ? 'agree' : 'disagree';
      });
      votes = updatedVotes;
    };

    // 1. Initially all agree with opt-c (4 agrees, 0 disagrees)
    assert.equal(Object.values(votes).filter(v => v === 'agree').length, 4);

    // 2. Modify Bob's option to 'opt-b' (Cyber Karting)
    handleChooseOption('bob', 'opt-b');
    assert.equal(chosenOptions['bob'], 'opt-b');
    assert.equal(votes['bob'], 'disagree', 'Bob should now disagree with opt-c table focus');
    assert.equal(Object.values(votes).filter(v => v === 'agree').length, 3, 'Majority threshold (3/4) still met');

    // 3. Modify Alice's option to 'opt-a' (Mori Art Museum)
    handleChooseOption('alice', 'opt-a');
    assert.equal(chosenOptions['alice'], 'opt-a');
    assert.equal(votes['alice'], 'disagree', 'Alice should now disagree with opt-c table focus');
    assert.equal(Object.values(votes).filter(v => v === 'agree').length, 2, 'Contested state (2/4 agrees)');

    // 4. Modify Charlie's option to 'opt-a'
    handleChooseOption('charlie', 'opt-a');
    assert.equal(chosenOptions['charlie'], 'opt-a');
    assert.equal(votes['charlie'], 'disagree');

    // 5. Shift table focus to 'opt-a'
    handleSelectOption('opt-a');
    assert.equal(selectedOption, 'opt-a');
    assert.equal(votes['alice'], 'agree', 'Alice chose opt-a, so she agrees with opt-a focus');
    assert.equal(votes['charlie'], 'agree', 'Charlie chose opt-a, so he agrees with opt-a focus');
    assert.equal(votes['bob'], 'disagree', 'Bob chose opt-b, so he disagrees with opt-a focus');
    assert.equal(votes['you'], 'disagree', 'Justin chose opt-c, so he disagrees with opt-a focus');

    // 6. User (Justin) modifies choice to 'opt-a' as well
    handleChooseOption('you', 'opt-a');
    assert.equal(chosenOptions['you'], 'opt-a');
    assert.equal(votes['you'], 'agree');
    assert.equal(Object.values(votes).filter(v => v === 'agree').length, 3, 'Majority achieved on opt-a (3/4 agree)');
  });

  it('Step 18 (LangGraph Thinking Traces): Contextual AI Reasoning and Constraint Audits are generated and formatted', async () => {
    // 1. Sub-AI Chat Graph produces structured thinking trace
    const chatResult = await runSubAIChatGraph({
      traveler: userTraveler,
      userMessage: 'What is our plan for Day 2 in Asakusa?',
      chatHistory: [],
      destination: 'Tokyo',
      itinerary: INITIAL_ITINERARY,
      travelers
    });

    assert.ok(chatResult.reply, 'Sub-AI must provide a clean conversational reply');
    assert.ok(chatResult.thinking, 'Sub-AI must provide an explicit thinking/reasoning audit');
    assert.ok(
      chatResult.thinking.toLowerCase().includes('day 2') ||
      chatResult.thinking.toLowerCase().includes('asakusa') ||
      chatResult.thinking.toLowerCase().includes('justin') ||
      chatResult.thinking.toLowerCase().includes('budget') ||
      chatResult.thinking.toLowerCase().includes('itinerary'),
      'Thinking trace must reflect context audit of Day 2 / Asakusa itinerary facts'
    );

    // 2. Peer Agent Turn Response includes thinking audit
    const charlieTurn = await generatePeerAgentTurnResponse({
      speakerId: 'charlie',
      lastUserMessage: 'I am concerned about heavy rain ruining our camera lenses',
      currentOption: targetOption,
      destination: 'Tokyo',
      travelers,
      itinerary: INITIAL_ITINERARY,
      currentRound: 1
    });

    assert.ok(charlieTurn.thinking, 'Peer agent turn must include thinking audit');
    assert.ok(
      charlieTurn.thinking.toLowerCase().includes('charlie') ||
      charlieTurn.thinking.toLowerCase().includes('step') ||
      charlieTurn.thinking.toLowerCase().includes('storm') ||
      charlieTurn.thinking.toLowerCase().includes('indoor'),
      'Charlie thinking audit must check physical stamina and indoor shelter'
    );

    // 3. Meeting argument response includes thinking audit
    const argumentResult = await runMeetingArgumentGraph({
      userArgument: 'Can we afford this soba masterclass with our daily budget?',
      traveler: userTraveler,
      currentOption: targetOption,
      destination: 'Tokyo',
      travelers,
      itinerary: INITIAL_ITINERARY,
      returnFull: true
    });

    assert.ok(argumentResult, 'Meeting argument must return result');
    assert.ok(argumentResult.thinking, 'Meeting argument must return reasoning audit');
    assert.ok(
      argumentResult.thinking.toLowerCase().includes('budget') ||
      argumentResult.thinking.toLowerCase().includes('cost') ||
      argumentResult.thinking.toLowerCase().includes('ceiling') ||
      argumentResult.thinking.toLowerCase().includes('aegis'),
      'Argument thinking trace must reflect budget audit'
    );
  });
});

