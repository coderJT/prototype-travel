import React, { useState } from 'react';
import { X, Compass, DollarSign, Sparkles } from 'lucide-react';

export default function CreateTripModal({ isOpen, onClose, onCreateTrip }) {
  const [destination, setDestination] = useState('Kyoto');
  const [title, setTitle] = useState('Kyoto Autumn Zen & Culture Escape');
  const [durationDays, setDurationDays] = useState(4);
  const [targetBudget, setTargetBudget] = useState(160);
  const [vibe, setVibe] = useState('Relaxed Culture & Culinary');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination.trim() || !title.trim()) return;

    onCreateTrip({
      destination: destination.trim(),
      title: title.trim(),
      durationDays: Number(durationDays) || 4,
      targetBudget: Number(targetBudget) || 150,
      vibe
    });
    onClose();
  };

  const destinations = ['Tokyo', 'Kyoto', 'Osaka', 'Sapporo', 'Seoul', 'Paris'];
  const vibes = [
    'Relaxed Culture & Culinary',
    'Tech, Gaming & Nightlife',
    'Scenic Photography & Nature',
    'Budget-Friendly Local Gems',
    'Balanced Squad Harmony'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 tracking-tight">
                Create New Trip
              </h3>
              <p className="text-xs text-gray-500">
                Initialize itinerary and multi-agent consensus
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Select City
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {destinations.map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => {
                    setDestination(d);
                    setTitle(`${d} Squad Trip`);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    destination === d
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Or enter any city (e.g. Taipei, Rome)..."
              className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Trip Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kyoto Food & Zen Adventure"
              className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
              />
            </div>

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
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Trip Vibe
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-purple-600 cursor-pointer"
            >
              {vibes.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
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
              <span>Create Trip</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
