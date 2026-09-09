import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MeetingPokerTable from './components/MeetingPokerTable';
import PersonalizationStudio from './components/PersonalizationStudio';
import ItineraryView from './components/ItineraryView';
import BudgetSplitter from './components/BudgetSplitter';
import WorldNewsRadarModal from './components/WorldNewsRadarModal';
import BookingHub from './components/BookingHub';
import ApiKeyModal from './components/ApiKeyModal';
import PlanGeneratorModal from './components/PlanGeneratorModal';
import {
  INITIAL_TRAVELERS,
  INITIAL_ITINERARY,
  WORLD_NEWS_ALERTS,
  INITIAL_POKER_AGENDA,
  INITIAL_CHAT_MESSAGES
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('meeting');
  const [travelers, setTravelers] = useState(INITIAL_TRAVELERS);
  const [currentTraveler, setCurrentTraveler] = useState(INITIAL_TRAVELERS[0]); // Alice
  const [itinerary, setItinerary] = useState(INITIAL_ITINERARY);
  const [currentDestination, setCurrentDestination] = useState('Tokyo');
  const [newsAlerts, setNewsAlerts] = useState(WORLD_NEWS_ALERTS);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [agenda, setAgenda] = useState(INITIAL_POKER_AGENDA);
  const [emergencySimulated, setEmergencySimulated] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modals
  const [isNewsRadarOpen, setIsNewsRadarOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isPlanGeneratorOpen, setIsPlanGeneratorOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Handle 1-on-1 offline chat message to personal Sub-AI
  const handleSendMessage = (travelerId, text) => {
    const userMsg = { id: Date.now(), sender: 'user', text };
    
    setChatMessages(prev => ({
      ...prev,
      [travelerId]: [...(prev[travelerId] || []), userMsg]
    }));

    setTimeout(() => {
      let botReply = `Got it! I’ve added "${text}" into your private preferences. When we meet at the Squad Table, I’ll diplomatically represent this so you get what you love without any friction! ✨`;

      const lower = text.toLowerCase();
      if (lower.includes('budget') || lower.includes('cost') || lower.includes('expensive') || lower.includes('dollar') || lower.includes('$')) {
        botReply = `Understood! I'll protect your comfortable budget during the round table and suggest yummy, high-value gems. 🍲`;
      } else if (lower.includes('tired') || lower.includes('step') || lower.includes('walk') || lower.includes('sleep') || lower.includes('morning')) {
        botReply = `Got your back on pacing! I'll ensure we have plenty of cafe stops and no early morning wake-up alarms. ☕`;
      } else if (lower.includes('food') || lower.includes('ramen') || lower.includes('sushi') || lower.includes('vegan') || lower.includes('vegetarian')) {
        botReply = `Delicious! I've noted your culinary preferences and will make sure our group dining spots hit the spot. 🍜`;
      }

      const botMsg = { id: Date.now() + 1, sender: 'bot', text: botReply };
      setChatMessages(prev => ({
        ...prev,
        [travelerId]: [...(prev[travelerId] || []), botMsg]
      }));
    }, 600);
  };

  const handleResolveDilemma = (optionId) => {
    const selected = agenda.dilemmaOptions.find(o => o.id === optionId) || agenda.dilemmaOptions[2];

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
    showToast('⚠️ Storm Alert Simulated: Day 3 cruise affected. Ready for squad discussion!', 'warning');
  };

  const handlePlanGenerated = (newItinerary, dest) => {
    setItinerary(newItinerary);
    setCurrentDestination(dest);
    setEmergencySimulated(false);
    showToast(`✨ Successfully generated custom ${dest} Escape Plan with multi-agent constraints!`);
    setActiveTab('itinerary');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className={`px-5 py-3.5 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-3 ${
            notification.type === 'warning'
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-emerald-100 border-emerald-300 text-emerald-900'
          }`}>
            <span className="text-lg">{notification.type === 'warning' ? '⚠️' : '🎉'}</span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Spacious Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTraveler={currentTraveler}
        setCurrentTraveler={setCurrentTraveler}
        travelers={travelers}
        newsAlerts={newsAlerts}
        onOpenNewsRadar={() => setIsNewsRadarOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        currentDestination={currentDestination}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Main Workspace Area with Spacious TopBar */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#f8fafc]">
        <TopBar
          activeTab={activeTab}
          currentDestination={currentDestination}
          emergencySimulated={emergencySimulated}
          onOpenPlanGenerator={() => setIsPlanGeneratorOpen(true)}
          onSimulateEmergency={handleSimulateEmergency}
          onOpenNewsRadar={() => setIsNewsRadarOpen(true)}
          newsAlerts={newsAlerts}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />

        {/* Spacious Main Content Area */}
        <main className="flex-1 pb-16 overflow-y-auto">
          {activeTab === 'meeting' && (
            <MeetingPokerTable
              currentTraveler={currentTraveler}
              travelers={travelers}
              agenda={agenda}
              onResolveDilemma={handleResolveDilemma}
              dilemmaResolved={!emergencySimulated}
            />
          )}

          {activeTab === 'personal' && (
            <PersonalizationStudio
              currentTraveler={currentTraveler}
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
              onUpdateTraveler={(updated) => {
                setTravelers(prev => prev.map(t => t.id === updated.id ? updated : t));
                setCurrentTraveler(updated);
              }}
            />
          )}

          {activeTab === 'itinerary' && (
            <ItineraryView
              itinerary={itinerary}
              onSimulateEmergency={handleSimulateEmergency}
              onNavigateToMeeting={() => setActiveTab('meeting')}
              emergencySimulated={emergencySimulated}
              onResolveEmergencyDirectly={() => handleResolveDilemma('opt-c')}
              onOpenPlanGenerator={() => setIsPlanGeneratorOpen(true)}
              onNavigateToBookings={() => setActiveTab('bookings')}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingHub
              currentDestination={currentDestination}
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

      {/* World News Radar Modal */}
      <WorldNewsRadarModal
        isOpen={isNewsRadarOpen}
        onClose={() => setIsNewsRadarOpen(false)}
        newsAlerts={newsAlerts}
        onTriggerDisruption={handleSimulateEmergency}
        onNavigateToMeeting={() => {
          setIsNewsRadarOpen(false);
          setActiveTab('meeting');
        }}
      />

      {/* Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={(key) => {
          showToast(key ? 'Gemini API Key updated successfully!' : 'Gemini API Key cleared.');
        }}
      />

      {/* AI Plan Generator Modal */}
      <PlanGeneratorModal
        isOpen={isPlanGeneratorOpen}
        onClose={() => setIsPlanGeneratorOpen(false)}
        travelers={travelers}
        onPlanGenerated={handlePlanGenerated}
      />
    </div>
  );
}
