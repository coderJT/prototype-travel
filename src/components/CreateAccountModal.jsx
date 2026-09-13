import React, { useState } from 'react';
import { X, UserPlus, Sparkles, DollarSign, Clock, Footprints, Heart, Bot } from 'lucide-react';

export default function CreateAccountModal({ isOpen, onClose, onCreateAccount }) {
  const [name, setName] = useState('');
  const [vibe, setVibe] = useState('Culinary Explorer & Culture Buff');
  const [budgetDaily, setBudgetDaily] = useState(150);
  const [walkingLimitSteps, setWalkingLimitSteps] = useState(12000);
  const [preferredWakeUp, setPreferredWakeUp] = useState('9:00 AM');
  const [dietary, setDietary] = useState('Authentic local foods, no heavy cilantro');
  const [selectedAvatar, setSelectedAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80');
  const [agentName, setAgentName] = useState('');

  if (!isOpen) return null;

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const trimmedName = name.trim();
    const id = trimmedName.toLowerCase().replace(/\s+/g, '-');
    const autoAgentName = agentName.trim() || `${trimmedName}-Bot`;

    onCreateAccount({
      id,
      name: trimmedName,
      avatar: selectedAvatar,
      vibe,
      budgetDaily: Number(budgetDaily) || 150,
      walkingLimitSteps: Number(walkingLimitSteps) || 12000,
      preferredWakeUp,
      dietary,
      agentName: autoAgentName,
      agentAvatar: '🤖',
      agentTone: `Diplomatic, protective of ${trimmedName}'s personal preferences`,
      privateNotes: `Privately wants to maximize ${vibe.toLowerCase()} while staying within budget.`,
      identifiedPreferences: [
        `#Budget$${budgetDaily}`,
        `#${vibe.split(' ')[0]}`,
        `#WakeUp${preferredWakeUp.replace(' ', '')}`,
        `#Max${Math.round(walkingLimitSteps / 1000)}kSteps`
      ]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 tracking-tight">
                Add Traveler Profile
              </h3>
              <p className="text-xs text-gray-500">
                Set up preferences and auto-assign personal Sub-AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Choose Avatar
            </label>
            <div className="flex items-center gap-2.5">
              {sampleAvatars.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`relative rounded-xl p-0.5 transition-all cursor-pointer ${
                    selectedAvatar === url ? 'ring-2 ring-purple-600 ring-offset-2' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="avatar" className="w-10 h-10 rounded-lg object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Traveler Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!agentName) setAgentName(`${e.target.value}-Bot`);
              }}
              placeholder="e.g. Elena"
              className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Travel Style & Vibe
            </label>
            <input
              type="text"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="e.g. Culinary Explorer & Coffee Enthusiast"
              className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Daily Budget ($)
              </label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="20"
                  max="1000"
                  value={budgetDaily}
                  onChange={(e) => setBudgetDaily(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Earliest Wake Up
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={preferredWakeUp}
                  onChange={(e) => setPreferredWakeUp(e.target.value)}
                  placeholder="e.g. 9:00 AM"
                  className="w-full pl-8 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Max Steps / Day
              </label>
              <div className="relative">
                <Footprints className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="1000"
                  value={walkingLimitSteps}
                  onChange={(e) => setWalkingLimitSteps(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Sub-AI Name
              </label>
              <div className="relative">
                <Bot className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g. Elena-Bot"
                  className="w-full pl-8 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Dietary & Food Passions
            </label>
            <div className="relative">
              <Heart className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="e.g. Vegetarian, authentic ramen, no cilantro"
                className="w-full pl-8 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add Traveler</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
