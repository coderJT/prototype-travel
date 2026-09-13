import React, { useState } from 'react';
import { X, Compass, KeyRound, Plus, Copy, Check, Sparkles, Users, ArrowRight } from 'lucide-react';

export default function TripGateModal({
  isOpen,
  onClose,
  onJoinTrip,
  onCreateTrip,
  activeTripInviteCode
}) {
  const [tab, setTab] = useState('join'); // 'join' | 'create'
  
  // Join Tab State
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');

  // Create Tab State
  const [destination, setDestination] = useState('Kyoto');
  const [title, setTitle] = useState('Kyoto Autumn Zen & Culture Escape');
  const [durationDays, setDurationDays] = useState(4);
  const [targetBudget, setTargetBudget] = useState(160);
  const [vibe, setVibe] = useState('Relaxed Culture & Culinary');
  const [generatedCode, setGeneratedCode] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Sample quick-join rooms
  const sampleRooms = [
    { code: 'TOKYO-77', title: 'Tokyo 4-Day Squad Expedition', dest: 'Tokyo', count: 3 },
    { code: 'KYOTO-24', title: 'Kyoto Zen & Food Walk', dest: 'Kyoto', count: 2 },
    { code: 'SEOUL-18', title: 'Seoul K-Wave & Street Food', dest: 'Seoul', count: 4 }
  ];

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    setJoinError('');
    const code = inviteCodeInput.trim().toUpperCase();
    if (!code) {
      setJoinError('Please enter a trip invite code.');
      return;
    }
    const matched = sampleRooms.find(r => r.code === code);
    onJoinTrip({
      inviteCode: code,
      title: matched ? matched.title : `${code} Squad Trip`,
      destination: matched ? matched.dest : code.split('-')[0] || 'Tokyo'
    });
    onClose();
  };

  const handleQuickJoin = (room) => {
    onJoinTrip({
      inviteCode: room.code,
      title: room.title,
      destination: room.dest
    });
    onClose();
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!destination.trim() || !title.trim()) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newInviteCode = `${destination.trim().toUpperCase().slice(0, 5)}-${randomSuffix}`;

    const newTrip = {
      destination: destination.trim(),
      title: title.trim(),
      durationDays: Number(durationDays) || 4,
      targetBudget: Number(targetBudget) || 150,
      vibe,
      inviteCode: newInviteCode
    };

    setGeneratedCode(newInviteCode);
    onCreateTrip(newTrip);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 tracking-tight">
                Trip Portal
              </h3>
              <p className="text-xs text-gray-500">
                Join an existing squad trip or start a new group itinerary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 px-5 pt-2 shrink-0">
          <button
            type="button"
            onClick={() => { setTab('join'); setGeneratedCode(null); }}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors mr-6 cursor-pointer flex items-center gap-1.5 ${
              tab === 'join'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Join with Invite Code</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              tab === 'create'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Trip & Get Code</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {tab === 'join' ? (
            <div className="space-y-4">
              <form onSubmit={handleJoinSubmit} className="space-y-3">
                {joinError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {joinError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Enter Trip Invite Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={inviteCodeInput}
                      onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. TOKYO-77"
                      className="flex-1 px-3.5 py-2 uppercase tracking-wider font-bold rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      Join Trip
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Ask your squad organizer for their 6-character room invite code.
                  </p>
                </div>
              </form>

              {/* Sample Quick Join Rooms */}
              <div className="pt-3 border-t border-gray-100">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Demo Squad Rooms Ready to Join
                </div>
                <div className="space-y-2">
                  {sampleRooms.map((room) => (
                    <div
                      key={room.code}
                      onClick={() => handleQuickJoin(room)}
                      className="p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/40 transition-colors flex items-center justify-between cursor-pointer group shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900">{room.title}</span>
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-mono font-bold">
                            {room.code}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-purple-600" />
                          <span>{room.count} travelers already consulting Sub-AIs</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-purple-600 group-hover:translate-x-0.5 transition-transform">
                        Join →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {generatedCode ? (
                <div className="space-y-4 text-center py-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center mx-auto shadow-2xs">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900">
                      Trip Created Successfully!
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Share this invite code with friends so their Sub-AIs can join the squad:
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between max-w-xs mx-auto">
                    <span className="font-mono text-base font-black text-gray-900 tracking-wider">
                      {generatedCode}
                    </span>
                    <button
                      onClick={() => copyCode(generatedCode)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Enter Trip Workspace →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Destination City
                    </label>
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        setTitle(`${e.target.value} Squad Trip`);
                      }}
                      placeholder="e.g. Kyoto, Seoul, Tokyo"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Trip Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Kyoto Food & Zen Adventure"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Duration (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="14"
                        value={durationDays}
                        onChange={(e) => setDurationDays(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Daily Budget Cap ($)
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="1000"
                        value={targetBudget}
                        onChange={(e) => setTargetBudget(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Travel Vibe
                    </label>
                    <input
                      type="text"
                      value={vibe}
                      onChange={(e) => setVibe(e.target.value)}
                      placeholder="e.g. Cultural sights, food gems, relaxed pace"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create Trip & Generate Share Code</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
