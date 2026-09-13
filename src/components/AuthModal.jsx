import React, { useState } from 'react';
import { X, LogIn, UserPlus, Key, Settings, CheckCircle2, AlertCircle, DollarSign, Footprints, Clock, Heart } from 'lucide-react';
import {
  signInWithEmail,
  signUpWithEmail,
  getSavedSupabaseConfig,
  saveSupabaseConfig
} from '../services/supabaseClient';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Profile Setup fields on Sign Up
  const [name, setName] = useState('');
  const [vibe, setVibe] = useState('Culture & Local Food Enthusiast');
  const [budgetDaily, setBudgetDaily] = useState(150);
  const [walkingLimitSteps, setWalkingLimitSteps] = useState(12000);
  const [preferredWakeUp, setPreferredWakeUp] = useState('9:00 AM');
  const [dietary, setDietary] = useState('Authentic local gems, loves ramen');
  const [selectedAvatar, setSelectedAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Optional developer Supabase configuration drawer
  const [showConfig, setShowConfig] = useState(false);
  const currentConfig = getSavedSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(currentConfig.anonKey);
  const [configSaved, setConfigSaved] = useState(false);

  if (!isOpen) return null;

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await signInWithEmail(email, password);
        if (error) throw error;
        setSuccessMsg('Logged in successfully!');
        if (data?.user) {
          onAuthSuccess(data.user, null);
        }
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your traveler name.');
        }

        const { data, error } = await signUpWithEmail(email, password);
        if (error) throw error;

        // Construct traveler profile from sign-up onboarding
        const trimmedName = name.trim();
        const travelerProfile = {
          id: trimmedName.toLowerCase().replace(/\s+/g, '-'),
          name: trimmedName,
          email,
          avatar: selectedAvatar,
          vibe,
          budgetDaily: Number(budgetDaily) || 150,
          walkingLimitSteps: Number(walkingLimitSteps) || 12000,
          preferredWakeUp,
          dietary,
          agentName: `${trimmedName}-Bot`,
          agentAvatar: '🤖',
          agentTone: `Diplomatic, protective of ${trimmedName}'s personal preferences`,
          identifiedPreferences: [
            `#Budget$${budgetDaily}`,
            `#${vibe.split(' ')[0]}`,
            `#Max${Math.round(walkingLimitSteps / 1000)}kSteps`,
            '#AuthenticLocal'
          ]
        };

        setSuccessMsg('Account & traveler profile created!');
        if (data?.user) {
          onAuthSuccess(data.user, travelerProfile);
        }
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {mode === 'login' ? 'Sign In' : 'Create Account & Travel Profile'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === 'login' 
                ? 'Access your squad trips and personal Sub-AI'
                : 'Set up your preferences to auto-generate your personal Sub-AI'}
            </p>
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
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors mr-6 cursor-pointer ${
              mode === 'login'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Account Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          {/* Onboarding Profile Fields (Only in Sign Up Mode) */}
          {mode === 'signup' && (
            <div className="pt-2 border-t border-gray-100 space-y-3.5 animate-in fade-in duration-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                Personal Travel Profile Setup
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
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
                      <img src={url} alt="avatar" className="w-9 h-9 rounded-lg object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Travel Style & Vibe
                  </label>
                  <input
                    type="text"
                    required
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    placeholder="e.g. Food Explorer & Night Owl"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Daily Budget ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="30"
                      max="1000"
                      value={budgetDaily}
                      onChange={(e) => setBudgetDaily(e.target.value)}
                      className="w-full pl-7 pr-2.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Max Steps / Day
                  </label>
                  <div className="relative">
                    <Footprints className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="1000"
                      value={walkingLimitSteps}
                      onChange={(e) => setWalkingLimitSteps(e.target.value)}
                      className="w-full pl-7 pr-2.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Earliest Wake-Up
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={preferredWakeUp}
                      onChange={(e) => setPreferredWakeUp(e.target.value)}
                      placeholder="9:00 AM"
                      className="w-full pl-7 pr-2.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Food & Dietary Notes
                </label>
                <div className="relative">
                  <Heart className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    placeholder="e.g. Vegetarian, loves local izakayas, no cilantro"
                    className="w-full pl-7 pr-2.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Creating Profile & Sub-AI...' : 'Create Account & Join'}</span>
              </>
            )}
          </button>

          {/* Collapsible Developer Supabase Config Drawer */}
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowConfig(prev => !prev)}
              className="text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-3 h-3" />
              <span>{showConfig ? 'Hide' : 'Developer'} Settings</span>
            </button>

            {showConfig && (
              <div className="mt-2.5 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-left">
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 mb-0.5">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyz.supabase.co"
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 mb-0.5">
                    Supabase Anon Key
                  </label>
                  <input
                    type="password"
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-gray-400">
                    Leave blank to use local demo storage
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="px-2 py-1 bg-gray-800 text-white rounded text-[11px] hover:bg-black transition-colors cursor-pointer"
                  >
                    {configSaved ? 'Saved!' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
