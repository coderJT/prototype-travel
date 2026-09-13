import React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  CloudRain
} from 'lucide-react';

export default function TopBar({
  activeTab,
  currentDestination = 'Tokyo',
  emergencySimulated,
  onOpenCreateTrip,
  onOpenWeatherModal,
  isSidebarOpen,
  onToggleSidebar,
  currentTraveler,
  activeTrip,
  onOpenTripPortal
}) {
  const getTabInfo = () => {
    switch (activeTab) {
      case 'personal':
        return {
          title: `Chat with ${currentTraveler?.agentName || 'Sub-AI'}`,
          subtitle: 'Private 1-on-1 agent conversation'
        };
      case 'meeting':
        return {
          title: 'Squad Meeting Table',
          subtitle: 'Consensus deliberation & dilemma resolution'
        };
      case 'profile':
        return {
          title: `${currentTraveler?.name || 'Traveler'} Profile`,
          subtitle: 'Daily budget cap, pacing limit & preferences'
        };
      case 'itinerary':
      default:
        return {
          title: 'Trip Itinerary',
          subtitle: 'Synthesized timeline with live contingency checks'
        };
    }
  };

  const tabInfo = getTabInfo();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 lg:px-8 py-3.5 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Sidebar Toggle Button + Breadcrumb & Section Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200 shadow-2xs cursor-pointer"
            title={isSidebarOpen ? "Collapse Sidebar" : "Open Sidebar"}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-4 h-4 text-gray-700" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-gray-700" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              <span>{currentDestination}</span>
              <span>/</span>
              <span className="text-gray-700">{tabInfo.subtitle}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              {tabInfo.title}
            </h2>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Active Trip Code Badge */}
          {activeTrip?.inviteCode && (
            <button
              onClick={onOpenTripPortal}
              title="Click to view trip invite code or join squad"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span className="text-[10px] uppercase font-bold text-purple-600">Trip:</span>
              <span className="font-mono">{activeTrip.inviteCode}</span>
            </button>
          )}

          {/* Active Traveler Pill */}
          {currentTraveler && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-medium">
              <span className="text-sm">{currentTraveler.agentAvatar}</span>
              <span>{currentTraveler.name} (${currentTraveler.budgetDaily}/d)</span>
            </div>
          )}

          {/* Clickable Weather Alert Pill if active */}
          {emergencySimulated && (
            <button
              onClick={onOpenWeatherModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              title="Click to resolve weather alert"
            >
              <CloudRain className="w-3.5 h-3.5 text-purple-600" />
              <span>Storm Alert</span>
              <span className="text-[11px] font-bold text-purple-700 underline">Decide →</span>
            </button>
          )}

          {/* New Trip Button */}
          <button
            onClick={onOpenCreateTrip}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
}
