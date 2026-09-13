import React, { useState } from 'react';
import {
  Sliders,
  DollarSign,
  Footprints,
  Clock,
  Heart,
  Tag,
  Plus,
  X,
  Save,
  CheckCircle2,
  ShieldCheck,
  Bot
} from 'lucide-react';

export default function TravelerProfileView({
  currentTraveler,
  onUpdateTraveler,
  onNavigateToChat,
  onNavigateToMeeting
}) {
  const [budgetDaily, setBudgetDaily] = useState(currentTraveler.budgetDaily);
  const [walkingLimitSteps, setWalkingLimitSteps] = useState(currentTraveler.walkingLimitSteps);
  const [preferredWakeUp, setPreferredWakeUp] = useState(currentTraveler.preferredWakeUp);
  const [dietary, setDietary] = useState(currentTraveler.dietary);
  const [vibe, setVibe] = useState(currentTraveler.vibe);
  const [name, setName] = useState(currentTraveler.name);
  const [tags, setTags] = useState(
    currentTraveler.identifiedPreferences || [
      '#AuthenticLocalFood',
      `#Budget$${currentTraveler.budgetDaily}`,
      '#ShelteredWeatherGems',
      '#ZeroRushedMornings'
    ]
  );
  const [newTagInput, setNewTagInput] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const updated = {
      ...currentTraveler,
      name: name.trim(),
      vibe: vibe.trim(),
      budgetDaily: Number(budgetDaily),
      walkingLimitSteps: Number(walkingLimitSteps),
      preferredWakeUp: preferredWakeUp.trim(),
      dietary: dietary.trim(),
      identifiedPreferences: tags
    };
    onUpdateTraveler(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    let formatted = newTagInput.trim();
    if (!formatted.startsWith('#')) formatted = `#${formatted}`;
    if (!tags.includes(formatted)) {
      setTags(prev => [...prev, formatted]);
    }
    setNewTagInput('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast */}
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-gray-700 flex items-center gap-2 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile saved successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentTraveler.avatar}
                alt={currentTraveler.name}
                className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
              />
              <span className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full p-0.5 border border-gray-200">
                {currentTraveler.agentAvatar}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {name}’s Profile
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Set budget caps, stamina limits, and preferences for {currentTraveler.agentName} to represent.
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {/* Main Profile Editor Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-sm text-gray-900">Travel Limits & Parameters</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Informs Agent Strategy</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name, Vibe & Wake Up */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Traveler Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Travel Style & Vibe
              </label>
              <input
                type="text"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Preferred Wake-Up Time
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={preferredWakeUp}
                  onChange={(e) => setPreferredWakeUp(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Budget Slider & Step Limits */}
          <div className="space-y-3.5">
            {/* Daily Budget Slider */}
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700 font-medium flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-purple-600" />
                  Daily Budget Cap
                </span>
                <span className="font-bold text-gray-900 text-sm">
                  ${budgetDaily} <span className="text-xs font-normal text-gray-500">/ day</span>
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="500"
                step="10"
                value={budgetDaily}
                onChange={(e) => setBudgetDaily(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                <span>$40 (Budget)</span>
                <span>$250 (Comfort)</span>
                <span>$500 (Luxury)</span>
              </div>
            </div>

            {/* Walking Steps Limit */}
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700 font-medium flex items-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5 text-purple-600" />
                  Step Fatigue Limit
                </span>
                <span className="font-bold text-gray-900 text-sm">
                  {Number(walkingLimitSteps).toLocaleString()} <span className="text-xs font-normal text-gray-500">steps</span>
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="30000"
                step="1000"
                value={walkingLimitSteps}
                onChange={(e) => setWalkingLimitSteps(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                <span>5k (Relaxed)</span>
                <span>15k (Active)</span>
                <span>30k (Trekker)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dietary */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Dietary Preferences & Dining Passions
          </label>
          <div className="relative">
            <Heart className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              placeholder="e.g. Authentic ramen, vegetarian, no cilantro"
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
            />
          </div>
        </div>

        {/* Dynamic Identified Preferences */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-600" />
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Identified Preference Tags
              </h4>
            </div>
            <span className="text-[10px] text-gray-500">
              Click &times; to remove tags
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-gray-800 text-xs font-medium border border-gray-200 shadow-2xs"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="w-3.5 h-3.5 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  title="Remove preference"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add custom tag */}
          <form onSubmit={handleAddTag} className="flex gap-2 pt-1.5">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Add tag (e.g. #QuietCafes, #NoHighEndDining)..."
              className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Action Links */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            Preferences directly influence {currentTraveler.agentName} during squad voting.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateToChat}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-purple-600" />
              <span>Chat with Agent →</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToMeeting}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Meeting Table →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
