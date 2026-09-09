import React, { useState } from 'react';
import {
  X,
  Play,
  Heart,
  MessageCircle,
  ExternalLink,
  Search,
  Code2,
  Terminal,
  MapPin,
  Sparkles,
  Share2,
  Film,
  Camera
} from 'lucide-react';
import {
  getInstagramPostsForDestination,
  generateInstagramTagUrl,
  INSTAGRAPI_BACKEND_SNIPPET,
  NODE_INSTAGRAM_API_SNIPPET
} from '../services/instagramService';

const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function InstagramTravelModal({
  isOpen,
  onClose,
  currentDestination = 'Tokyo',
  initialSearchQuery = ''
}) {
  const [activeTab, setActiveTab] = useState('reels'); // 'reels' | 'frameworks'
  const [searchTag, setSearchTag] = useState(initialSearchQuery || `${currentDestination.toLowerCase()}travel`);
  const posts = getInstagramPostsForDestination(currentDestination);

  if (!isOpen) return null;

  const filteredPosts = searchTag.trim()
    ? posts.filter(p =>
        p.caption.toLowerCase().includes(searchTag.toLowerCase().replace(/^#/, '')) ||
        p.hashtags.some(h => h.toLowerCase().includes(searchTag.toLowerCase().replace(/^#/, ''))) ||
        p.location.toLowerCase().includes(searchTag.toLowerCase().replace(/^#/, ''))
      )
    : posts;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header with Instagram Aesthetic */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <InstagramIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Instagram Visual Travel Radar
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200/60 flex items-center gap-1">
                  <Film className="w-3 h-3 text-rose-500" />
                  <span>Reels & Aesthetics</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Trending viral reels, photo spot framing, and high-energy creator guides.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('reels')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'reels' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reels & Visuals
              </button>
              <button
                onClick={() => setActiveTab('frameworks')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'frameworks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Frameworks</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {activeTab === 'reels' ? (
            <>
              {/* Search & Direct Explore Link */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search hashtag or location (e.g. #tokyocafes, Shibuya, Sensoji)..."
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-400"
                  />
                </div>
                <a
                  href={generateInstagramTagUrl(searchTag || `${currentDestination.toLowerCase()}travel`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Open Tag on Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Grid of Reels / Posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-purple-300 hover:shadow-sm transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Visual Header */}
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img
                          src={post.thumbnail}
                          alt={post.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Reel Play Badge */}
                        {post.mediaType === 'reel' && (
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                            <Play className="w-3 h-3 fill-white" />
                            <span>Reel {post.duration}</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          {post.category}
                        </div>

                        {/* Engagement stats */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-2.5 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-medium border border-white/20">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                            <span>{post.likes}</span>
                          </span>
                          <span className="opacity-40">•</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-slate-300" />
                            <span>{post.comments}</span>
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={post.userAvatar}
                              alt={post.username}
                              className="w-6 h-6 rounded-full object-cover border"
                            />
                            <span className="text-xs font-bold text-slate-800">
                              @{post.username}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            <span>{post.location}</span>
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {post.caption}
                        </p>

                        {/* Hashtag tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {post.hashtags.map((tag, idx) => (
                            <a
                              key={idx}
                              href={generateInstagramTagUrl(tag)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition-colors"
                            >
                              {tag}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom action link */}
                    <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-slate-50">
                      <span className="text-[10px] text-slate-400">
                        Geo-verified spot
                      </span>
                      <a
                        href={`https://www.instagram.com/explore/tags/${post.hashtags[0].replace(/^#/, '')}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      >
                        <span>Watch on Instagram</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Frameworks & Architecture Tab */
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm font-bold text-purple-950">
                    Existing Open-Source Frameworks for Instagram Integration
                  </h4>
                </div>
                <p className="text-xs text-purple-900/80 leading-relaxed">
                  Avoid manual scraping or reverse engineering. The developer community maintains production-grade frameworks in both Python and Node.js to query Instagram hashtags, geotagged spots, and reels.
                </p>
              </div>

              {/* Framework Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. subzeroid/instagrapi */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      Top Python Framework
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">pip install instagrapi</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">subzeroid / instagrapi</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fast, full-featured Python client for Instagram's private mobile API (over 5,000 GitHub stars).
                    </p>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li><code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">hashtag_medias_top(tag, amount)</code> for viral reels</li>
                    <li><code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">location_search()</code> + <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">location_medias_top()</code> for exact venues</li>
                    <li>Extracts captions, like counts, thumbnails, creator handles</li>
                  </ul>
                  <a
                    href="https://github.com/subzeroid/instagrapi"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800"
                  >
                    <span>View GitHub Repo (subzeroid/instagrapi)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* 2. dilame/instagram-private-api */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      Top Node.js Framework
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">npm i instagram-private-api</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">dilame / instagram-private-api</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      TypeScript/JavaScript library emulating official mobile app endpoints.
                    </p>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li><code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">ig.feed.tag(tag).items()</code> feeds</li>
                    <li>Direct TypeScript definitions for all media objects</li>
                    <li>Ideal for integrating into Next.js / Express / Node microservices</li>
                  </ul>
                  <a
                    href="https://github.com/dilame/instagram-private-api"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>View GitHub Repo (dilame/instagram-private-api)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="bg-slate-950 text-slate-100 rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span>Python FastAPI Backend Implementation (`pip install instagrapi`)</span>
                  <span className="text-[11px] text-purple-400">instagrapi v2.1+</span>
                </div>
                <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
                  {INSTAGRAPI_BACKEND_SNIPPET.trim()}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-500">
            Enriching itineraries with viral reels & aesthetic framing.
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
