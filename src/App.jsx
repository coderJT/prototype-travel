import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MeetingTable from './components/MeetingTable';
import PersonalizationStudio from './components/PersonalizationStudio';
import TravelerProfileView from './components/TravelerProfileView';
import ItineraryView from './components/ItineraryView';
import BudgetSplitter from './components/BudgetSplitter';
import BookingHub from './components/BookingHub';
import ApiKeyModal from './components/ApiKeyModal';
import PlanGeneratorModal from './components/PlanGeneratorModal';
import CreateTripModal from './components/CreateTripModal';
import CreateAccountModal from './components/CreateAccountModal';
import WeatherReactionModal from './components/WeatherReactionModal';
import AuthModal from './components/AuthModal';
import TripGateModal from './components/TripGateModal';
import {
  INITIAL_TRAVELERS,
  INITIAL_ITINERARY,
  INITIAL_MEETING_AGENDA,
  INITIAL_CHAT_MESSAGES
} from './data/mockData';
import { getInitialUser, signOutUser } from './services/supabaseClient';
import { chatWithSubAI, generatePlanWithAI, hasApiKey, getActiveModelName } from './services/geminiService';

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [travelers, setTravelers] = useState(INITIAL_TRAVELERS);
  const [currentTraveler, setCurrentTraveler] = useState(INITIAL_TRAVELERS[0]); // Alice
  const [itinerary, setItinerary] = useState(INITIAL_ITINERARY);
  const [currentDestination, setCurrentDestination] = useState('Tokyo');
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [agenda, setAgenda] = useState(INITIAL_MEETING_AGENDA);
  const [emergencySimulated, setEmergencySimulated] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isChatThinking, setIsChatThinking] = useState(false);

  // Active Trip State & Gate
  const [activeTrip, setActiveTrip] = useState({
    id: 'trip-1',
    title: 'Tokyo 4-Day Squad Expedition',
    destination: 'Tokyo',
    inviteCode: 'TOKYO-77',
    intakeDeadline: 'Today at 6:00 PM',
    meetingScheduledTime: 'Tonight at 8:00 PM'
  });
  const [isTripGateOpen, setIsTripGateOpen] = useState(false);
  const [lastMeetingUpdate, setLastMeetingUpdate] = useState(null);

  // Modals & Auth State
  const [authUser, setAuthUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isPlanGeneratorOpen, setIsPlanGeneratorOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load Supabase Session on Mount
  useEffect(() => {
    getInitialUser().then(user => {
      if (user) setAuthUser(user);
    });
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setAuthUser(null);
    showToast('Signed out of Supabase.');
  };

  // Handle 1-on-1 chat message to personal Sub-AI (Gemini Live API or Smart Conversational Engine)
  const handleSendMessage = async (travelerId, text) => {
    const userMsg = { id: Date.now(), sender: 'user', text };
    
    setChatMessages(prev => ({
      ...prev,
      [travelerId]: [...(prev[travelerId] || []), userMsg]
    }));

    const traveler = travelers.find(t => t.id === travelerId) || currentTraveler;
    const history = chatMessages[travelerId] || [];

    setIsChatThinking(true);
    try {
      // Call LangGraph-powered intelligent Sub-AI engine (Live Gemini with full Ground Truth context)
      const graphResult = await chatWithSubAI({
        traveler,
        userMessage: text,
        chatHistory: history,
        destination: currentDestination,
        itinerary,
        travelers,
        activeTrip,
        dilemma: agenda,
        returnFull: true
      });

      const botReply = typeof graphResult === 'string' ? graphResult : (graphResult?.reply || 'Noted!');
      const botThinking = typeof graphResult === 'object' ? graphResult?.thinking : null;
      const learned = typeof graphResult === 'object' ? graphResult?.learnedParameters : null;

      const botMsg = { id: Date.now() + 1, sender: 'bot', text: botReply, thinking: botThinking };
      setChatMessages(prev => ({
        ...prev,
        [travelerId]: [...(prev[travelerId] || []), botMsg]
      }));

      // Apply any learned parameters (budget, step limit, wake-up, dietary, tags) extracted by LangGraph
      if (learned && learned.hasUpdates) {
        let updated = { ...traveler };
        const updatesList = [];

        if (learned.budgetDaily && learned.budgetDaily !== traveler.budgetDaily) {
          updated.budgetDaily = learned.budgetDaily;
          updated.chips = learned.budgetDaily;
          updatesList.push(`Budget: $${learned.budgetDaily}/day`);
        }
        if (learned.walkingLimitSteps && learned.walkingLimitSteps !== traveler.walkingLimitSteps) {
          updated.walkingLimitSteps = learned.walkingLimitSteps;
          updatesList.push(`Step Limit: ${learned.walkingLimitSteps.toLocaleString()} steps`);
        }
        if (learned.preferredWakeUp && learned.preferredWakeUp !== traveler.preferredWakeUp) {
          updated.preferredWakeUp = learned.preferredWakeUp;
          updatesList.push(`Wake-up: ${learned.preferredWakeUp}`);
        }
        if (learned.dietary && learned.dietary !== traveler.dietary) {
          updated.dietary = learned.dietary;
          updatesList.push(`Dietary: ${learned.dietary}`);
        }
        if (learned.privateNotes && learned.privateNotes !== traveler.privateNotes) {
          updated.privateNotes = learned.privateNotes;
        }
        if (learned.newPreferences && learned.newPreferences.length > 0) {
          const currentPrefs = updated.identifiedPreferences || [];
          const merged = [...new Set([...currentPrefs, ...learned.newPreferences])];
          updated.identifiedPreferences = merged;
        }

        if (updatesList.length > 0 || (learned.newPreferences && learned.newPreferences.length > 0)) {
          handleUpdateTraveler(updated);
          if (updatesList.length > 0) {
            showToast(`✨ Learned Parameters Updated: ${updatesList.join(', ')}`);
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatThinking(false);
    }
  };

  const handleResolveDilemma = (optionId) => {
    const selected = agenda.dilemmaOptions.find(o => o.id === optionId) || agenda.dilemmaOptions[2];
    const updateSummary = `Updated from Squad Meeting #1: Day 3 cruise replaced with ${selected.title.replace(/Option [A-C]:\s*/i, '')} (Unanimous 3/3 Agreement)`;
    setLastMeetingUpdate(updateSummary);

    setItinerary(prev => prev.map(day => {
      if (day.day === 3) {
        return {
          ...day,
          consensusScore: 98,
          disruptionRisk: null,
          items: day.items.map(item => {
            if (item.id === 'item-3-3') {
              return {
                ...item,
                title: selected.title.replace('Option C: ', '').replace('Option A: ', '').replace('Option B: ', ''),
                status: 'replaced',
                advocate: 'Unanimous Squad Agreement (Storm-Safe Soba & Sake)',
                description: selected.aiSummary,
                disruptionReason: null,
                costPerPerson: parseInt(selected.cost.replace(/[^0-9]/g, '')) || 35
              };
            }
            return item;
          })
        };
      }
      return day;
    }));

    setEmergencySimulated(false);
    showToast(`🎉 Squad Agreement Locked! Day 3 updated to ${selected.title.split(':')[0]}!`);
    setActiveTab('itinerary');
  };

  const handleSimulateEmergency = () => {
    setEmergencySimulated(true);
    setItinerary(prev => prev.map(day => {
      if (day.day === 3) {
        return {
          ...day,
          disruptionRisk: '⚠️ Coastal Storm Warning Active',
          items: day.items.map(item => {
            if (item.id === 'item-3-3') {
              return {
                ...item,
                status: 'threatened',
                disruptionReason: 'Coastal gale force winds warning from Tokyo Bay Maritime Authority'
              };
            }
            return item;
          })
        };
      }
      return day;
    }));
    showToast('⚠️ Storm Alert Simulated: Day 3 cruise affected.', 'warning');
  };

  const handlePlanGenerated = (newItinerary, dest, options = {}) => {
    setItinerary(newItinerary);
    setCurrentDestination(dest);
    setEmergencySimulated(false);
    if (options.autoBooked) {
      showToast(`✨ Generated ${dest} plan & autonomously reserved Flights & Hotel!`);
    } else {
      showToast(`✨ Successfully generated custom ${dest} Escape Plan!`);
    }
    setActiveTab('itinerary');
  };

  // Join Trip via Invite Code Handler
  const handleJoinTrip = ({ inviteCode, title, destination }) => {
    setActiveTrip(prev => ({
      ...prev,
      inviteCode,
      title: title || `${destination} Squad Trip`,
      destination: destination || prev.destination
    }));
    if (destination) {
      setCurrentDestination(destination);
    }
    showToast(`Joined trip: ${title || destination} (${inviteCode})!`);
    setActiveTab('personal');
  };

  // Create Trip Handler with Gemini LLM Itinerary Generation
  const handleCreateTrip = async (newTrip) => {
    const inviteCode = newTrip.inviteCode || `${(newTrip.destination || 'TRIP').toUpperCase().slice(0, 5)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveTrip({
      id: `trip-${Date.now()}`,
      title: newTrip.title,
      destination: newTrip.destination,
      inviteCode,
      intakeDeadline: 'Today at 6:00 PM',
      meetingScheduledTime: 'Tonight at 8:00 PM'
    });
    setCurrentDestination(newTrip.destination);
    setEmergencySimulated(false);
    setLastMeetingUpdate(null);
    showToast(`🎉 Created trip: "${newTrip.title}"! Generating Gemini itinerary...`);

    setIsGeneratingPlan(true);
    try {
      const realPlan = await generatePlanWithAI({
        destination: newTrip.destination,
        durationDays: 4,
        theme: newTrip.vibe || 'Cultural Discovery & Local Dining',
        pace: 'Balanced',
        travelers
      });
      if (Array.isArray(realPlan) && realPlan.length > 0) {
        setItinerary(realPlan);
        showToast(`✨ Real itinerary generated by Gemini LLM for ${newTrip.destination}!`);
      }
    } catch (err) {
      console.error('Error generating plan for new trip:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
    setActiveTab('personal');
  };

  // Instant Synthesis from Squad Sub-AIs via Gemini LLM
  const handleGeneratePlanNow = async () => {
    setIsGeneratingPlan(true);
    showToast(`⚡ Gemini LLM is synthesizing master itinerary for ${currentDestination}...`);
    try {
      const newPlan = await generatePlanWithAI({
        destination: currentDestination,
        durationDays: 4,
        theme: 'Squad Cultural & Foodie Alignment',
        pace: 'Balanced',
        travelers
      });
      if (Array.isArray(newPlan) && newPlan.length > 0) {
        setItinerary(newPlan);
        setActiveTab('itinerary');
        showToast(`✨ Master itinerary synthesized by Gemini LLM for ${currentDestination}!`);
      } else {
        setActiveTab('itinerary');
      }
    } catch (err) {
      console.error('Gemini synthesis error:', err);
      showToast('Error synthesizing plan with Gemini LLM', 'error');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Create Account Handler
  const handleCreateAccount = (newAccount) => {
    setTravelers(prev => [...prev, newAccount]);
    setCurrentTraveler(newAccount);
    setChatMessages(prev => ({
      ...prev,
      [newAccount.id]: [
        {
          id: 1,
          sender: 'bot',
          text: `Hi ${newAccount.name}! I'm ${newAccount.agentName || 'your Sub-AI'}. I've recorded your $${newAccount.budgetDaily}/day budget cap and ${newAccount.vibe} preference. Chat with me anytime here or fine-tune your parameters in your Profile tab!`
        }
      ]
    }));
    showToast(`✨ Added traveler ${newAccount.name}! Your Sub-AI is online.`);
    setActiveTab('personal');
  };

  // Update Traveler Profile & Identified Preferences
  const handleUpdateTraveler = (updated) => {
    setTravelers(prev => prev.map(t => t.id === updated.id ? updated : t));
    if (currentTraveler.id === updated.id) {
      setCurrentTraveler(updated);
    }
    showToast(`Updated ${updated.name}'s profile.`);
  };

  // Weather Disruption Reaction Handlers
  const handleWeatherConveneMeeting = () => {
    setIsWeatherModalOpen(false);
    setActiveTab('meeting');
    showToast('Convened Meeting Table to deliberate on weather disruption.', 'warning');
  };

  const handleWeatherIgnoreAlert = () => {
    setIsWeatherModalOpen(false);
    showToast('Acknowledged storm alert: Proceeding with outdoor schedule.');
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 ${
            notification.type === 'warning'
              ? 'bg-gray-900 text-white border-gray-700'
              : 'bg-white border-gray-200 text-gray-900 shadow-md'
          }`}>
            <span className="text-base">{notification.type === 'warning' ? '⚠️' : '✨'}</span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Clean Minimalist Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTraveler={currentTraveler}
        setCurrentTraveler={setCurrentTraveler}
        travelers={travelers}
        currentDestination={currentDestination}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(prev => !prev)}
        onOpenCreateTrip={() => setIsCreateTripOpen(true)}
        onOpenCreateAccount={() => setIsCreateAccountOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        authUser={authUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        activeTrip={activeTrip}
        onOpenTripPortal={() => setIsTripGateOpen(true)}
      />

      {/* Main Workspace Area with Clean TopBar */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#f9fafb]">
        <TopBar
          activeTab={activeTab}
          currentDestination={currentDestination}
          emergencySimulated={emergencySimulated}
          onOpenCreateTrip={() => setIsCreateTripOpen(true)}
          onOpenWeatherModal={() => setIsWeatherModalOpen(true)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          currentTraveler={currentTraveler}
          activeTrip={activeTrip}
          onOpenTripPortal={() => setIsTripGateOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 pb-16 overflow-y-auto">
          {/* Agent Chat */}
          {activeTab === 'personal' && (
            <PersonalizationStudio
              currentTraveler={currentTraveler}
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
              onUpdateTraveler={handleUpdateTraveler}
              onNavigateToMeeting={() => setActiveTab('meeting')}
              onNavigateToProfile={() => setActiveTab('profile')}
              activeTrip={activeTrip}
              travelers={travelers}
              itinerary={itinerary}
              agenda={agenda}
              onGeneratePlanNow={handleGeneratePlanNow}
              isThinking={isChatThinking}
            />
          )}

          {/* Meeting Table */}
          {activeTab === 'meeting' && (
            <MeetingTable
              currentTraveler={currentTraveler}
              travelers={travelers}
              agenda={agenda}
              itinerary={itinerary}
              onResolveDilemma={handleResolveDilemma}
              dilemmaResolved={!emergencySimulated}
              onNavigateToItinerary={() => setActiveTab('itinerary')}
              onNavigateToPersonal={() => setActiveTab('personal')}
              chatMessages={chatMessages}
              destination={currentDestination}
            />
          )}

          {/* Traveler Profile */}
          {activeTab === 'profile' && (
            <TravelerProfileView
              currentTraveler={currentTraveler}
              onUpdateTraveler={handleUpdateTraveler}
              onNavigateToChat={() => setActiveTab('personal')}
              onNavigateToMeeting={() => setActiveTab('meeting')}
            />
          )}

          {/* Master Itinerary */}
          {activeTab === 'itinerary' && (
            <ItineraryView
              itinerary={itinerary}
              travelers={travelers}
              currentDestination={currentDestination}
              onSimulateEmergency={handleSimulateEmergency}
              onNavigateToMeeting={() => setActiveTab('meeting')}
              onNavigateToPersonal={() => setActiveTab('personal')}
              onNavigateToProfile={() => setActiveTab('profile')}
              onOpenWeatherModal={() => setIsWeatherModalOpen(true)}
              emergencySimulated={emergencySimulated}
              onResolveEmergencyDirectly={() => handleResolveDilemma('opt-c')}
              onOpenPlanGenerator={() => setIsPlanGeneratorOpen(true)}
              onRegenerateWithAI={handleGeneratePlanNow}
              isGeneratingPlan={isGeneratingPlan}
              onNavigateToBookings={() => setActiveTab('bookings')}
              onLoadDemoItinerary={() => {
                setItinerary(INITIAL_ITINERARY);
                setCurrentDestination('Tokyo');
                showToast('Loaded Tokyo 4-Day Trip!');
              }}
              onResetItinerary={() => {
                setItinerary([]);
                showToast('Cleared itinerary.');
              }}
              lastMeetingUpdate={lastMeetingUpdate}
              chatMessages={chatMessages}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingHub
              currentDestination={currentDestination}
              travelers={travelers}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetSplitter
              travelers={travelers}
              itinerary={itinerary}
            />
          )}
        </main>
      </div>

      {/* Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={(key) => {
          showToast(key ? 'Gemini API Key updated!' : 'Gemini API Key cleared.');
        }}
      />

      {/* AI Plan Generator Modal */}
      <PlanGeneratorModal
        isOpen={isPlanGeneratorOpen}
        onClose={() => setIsPlanGeneratorOpen(false)}
        travelers={travelers}
        onPlanGenerated={handlePlanGenerated}
      />

      {/* Supabase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user, profile) => {
          setAuthUser(user);
          if (profile) {
            setTravelers(prev => [...prev.filter(t => t.id !== profile.id), profile]);
            setCurrentTraveler(profile);
            setChatMessages(prev => ({
              ...prev,
              [profile.id]: [
                {
                  id: 1,
                  sender: 'bot',
                  text: `Hi ${profile.name}! I'm ${profile.agentName}. I've saved your $${profile.budgetDaily}/day budget cap and ${profile.vibe} preference. Let's join your squad's trip using an invite code or start a new trip!`
                }
              ]
            }));
            showToast(`Welcome, ${profile.name}! Personal Sub-AI assigned.`);
            setIsTripGateOpen(true);
          } else {
            showToast(`Welcome back, ${user.email}!`);
            setIsTripGateOpen(true);
          }
        }}
      />

      {/* Trip Gate Modal (Join with invite code or create trip) */}
      <TripGateModal
        isOpen={isTripGateOpen}
        onClose={() => setIsTripGateOpen(false)}
        onJoinTrip={handleJoinTrip}
        onCreateTrip={handleCreateTrip}
        activeTripInviteCode={activeTrip.inviteCode}
      />

      {/* Modal: Create Trip */}
      <CreateTripModal
        isOpen={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
        onCreateTrip={handleCreateTrip}
      />

      {/* Modal: Create Account */}
      <CreateAccountModal
        isOpen={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
        onCreateAccount={handleCreateAccount}
      />

      {/* Modal: Clickable Weather Reaction Decision */}
      <WeatherReactionModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        threatReason="Coastal gale force winds warning from Tokyo Bay Maritime Authority affecting Day 3 cruise."
        onConveneMeeting={handleWeatherConveneMeeting}
        onIgnoreAlert={handleWeatherIgnoreAlert}
      />
    </div>
  );
}
