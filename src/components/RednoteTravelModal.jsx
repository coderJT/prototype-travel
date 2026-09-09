import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ExternalLink,
  Heart,
  Bookmark,
  MapPin,
  Camera,
  ShieldAlert,
  Code2,
  Terminal,
  CheckCircle2,
  Search,
  BookMarked
} from 'lucide-react';
import {
  getRednoteNotesForDestination,
  generateRednoteSearchUrl,
  PYTHON_BACKEND_SNIPPET
} from '../services/rednoteService';

export default function RednoteTravelModal({
  isOpen,
  onClose,
  currentDestination = 'Tokyo',
  initialSearchQuery = ''
}) {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'developer'
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const notes = getRednoteNotesForDestination(currentDestination);

  if (!isOpen) return null;

  const filteredNotes = searchQuery.trim()
    ? notes.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
              📕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  RedNote (小红书) Travel Intelligence
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200/60">
                  Trending Feed
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Aesthetic photo spots, hidden dining gems, and anti-tourist trap guides.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'notes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Travel Guides
              </button>
              <button
                onClick={() => setActiveTab('developer')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'developer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>GitHub Libs</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {activeTab === 'notes' ? (
            <>
              {/* Search & Direct RedNote Link Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={`Search RedNote notes for ${currentDestination}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-400"
                  />
                </div>
                <a
                  href={generateRednoteSearchUrl(searchQuery || '旅游攻略 避坑', currentDestination)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all"
                >
                  <span>Open on Xiaohongshu Web</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Grid of Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-rose-300 hover:shadow-sm transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image header with tag */}
                      <div className="relative h-44 overflow-hidden bg-slate-100">
                        <img
                          src={note.coverImage}
                          alt={note.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-xs ${note.tagColor}`}>
                            {note.tag}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-medium">
                          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                          <span>{note.likes}</span>
                          <span className="opacity-40">•</span>
                          <Bookmark className="w-3 h-3 text-amber-300 fill-amber-300" />
                          <span>{note.collected}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={note.authorAvatar}
                            alt={note.author}
                            className="w-5 h-5 rounded-full object-cover border"
                          />
                          <span className="text-xs font-semibold text-slate-700">{note.author}</span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{note.location}</span>
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {note.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {note.summary}
                        </p>

                        {/* Tips bullets */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1 mt-2">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-amber-500" />
                            <span>Key Tips & 避坑指南</span>
                          </div>
                          {note.tips.map((tip, idx) => (
                            <div key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="px-4 pb-4 pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Query: "{note.xhsSearchQuery}"
                      </span>
                      <a
                        href={generateRednoteSearchUrl(note.xhsSearchQuery, currentDestination)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                      >
                        <span>View on XHS</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Developer / Frameworks Reference Tab */
            <div className="space-y-6">
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-indigo-950">
                    Open-Source Frameworks & Libraries Supporting RedNote / Xiaohongshu
                  </h4>
                </div>
                <p className="text-xs text-indigo-900/80 leading-relaxed">
                  Xiaohongshu does not offer an unrestricted public REST API for personal developers. However, the open-source developer community maintains high-quality Python libraries that emulate API request signing or use browser automation.
                </p>
              </div>

              {/* Framework Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. ReaJason/xhs */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Recommended SDK
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">pip install xhs</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">ReaJason / xhs</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Python client library for Xiaohongshu web APIs with built-in request signing.
                    </p>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Implements signature algorithms (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">x-s</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">x-t</code>)</li>
                    <li>Search notes by keyword with pagination and sort options</li>
                    <li>Extract note detail, likes, photo URLs, and user comments</li>
                  </ul>
                  <a
                    href="https://github.com/ReaJason/xhs"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>View GitHub Repository (ReaJason/xhs)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* 2. NanmiCoder/MediaCrawler */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      20k+ Stars Crawler
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Playwright + Async</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">NanmiCoder / MediaCrawler</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Comprehensive social media crawler supporting Xiaohongshu, Douyin, Bilibili, and Weibo.
                    </p>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Stealth headless browser scraping to bypass bot detection</li>
                    <li>Preserves login cookies across multiple runs</li>
                    <li>Saves notes, tags, and comments directly to SQLite / MySQL / CSV</li>
                  </ul>
                  <a
                    href="https://github.com/NanmiCoder/MediaCrawler"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>View GitHub Repository (NanmiCoder/MediaCrawler)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="bg-slate-950 text-slate-100 rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span>Python FastAPI Integration Snippet (`pip install xhs fastapi`)</span>
                  <span className="text-[11px] text-emerald-400">Ready to run</span>
                </div>
                <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
                  {PYTHON_BACKEND_SNIPPET.trim()}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-500">
            Grounding AI itineraries with real social travel sentiment.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
