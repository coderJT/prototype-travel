import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Sparkles,
  Zap,
  Play,
  Pause,
  Download,
  Key,
  Layers,
  Wand2,
  Film,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { generateImageWithAI, generateVideoWithAI, hasApiKey } from '../services/geminiService';

export default function MediaStudio({ onOpenApiKeyModal }) {
  const [activeTab, setActiveTab] = useState('images');

  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState('Steaming bowl of spicy artisan ramen under glowing red paper lanterns in Tokyo alley');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
      prompt: 'Spicy artisan ramen under glowing red paper lanterns in Tokyo alley',
      source: 'Gemini Imagen 3',
      date: 'Just now'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
      prompt: 'Akihabara neon arcade alley at dusk with cyberpunk reflections',
      source: 'Gemini Imagen 3',
      date: '3m ago'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      prompt: 'Arashiyama bamboo grove sunbeams with ancient stone pagoda',
      source: 'Gemini Imagen 3',
      date: '10m ago'
    }
  ]);

  // Video Generation State
  const [videoPrompt, setVideoPrompt] = useState('Cinematic aerial drone flight over Tokyo Tower at sunset with Mount Fuji in the golden horizon');
  const [videoStyle, setVideoStyle] = useState('Cinematic Drone 4K');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [activeVideo, setActiveVideo] = useState({
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41549-large.mp4',
    poster: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Aerial drone flight over Tokyo city lights at dusk',
    style: 'Cinematic Drone 4K',
    source: hasApiKey() ? 'Google Veo 2 (Live API)' : 'Google Veo Trailer Preview (Demo Mode)'
  });

  const sampleImagePrompts = [
    "Cozy kissaten coffee house in Shimokitazawa with vintage record player",
    "teamLab Planets crystal cosmos with reflective barefoot pool",
    "Gion canalside tea house with falling autumn maple leaves",
    "Tsukiji morning fish market tuna auction with steam"
  ];

  const sampleVideoPrompts = [
    "10s drone swoop across Shibuya crossing scramble at twilight",
    "Slow-motion steam rising from hand-cut soba noodles",
    "First-person walk through rain-slicked Golden Gai lantern alleys",
    "Scenic train ride through Japanese mountain maple trees"
  ];

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);

    try {
      const result = await generateImageWithAI(imagePrompt, aspectRatio);
      setGeneratedImages(prev => [
        {
          id: Date.now(),
          url: result.url,
          prompt: result.prompt,
          source: result.source,
          date: 'Just now'
        },
        ...prev
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async (e) => {
    e.preventDefault();
    if (!videoPrompt.trim()) return;
    setIsGeneratingVideo(true);

    try {
      const result = await generateVideoWithAI(videoPrompt, videoStyle);
      setActiveVideo(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Top Banner with API Key Status */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Creative AI Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Travel Visuals & Video Trailers 🎨🎬
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Bring your dream escape to life before packing. Generate photorealistic activity scenes with <strong>Imagen 3</strong> and cinematic trailers with <strong>Google Veo</strong>.
          </p>
        </div>

        <button
          onClick={onOpenApiKeyModal}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold border transition-all shadow-xs shrink-0 ${
            hasApiKey()
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              : 'bg-white border-purple-200 text-purple-800 hover:bg-purple-50'
          }`}
        >
          <Key className="w-4 h-4 text-purple-600" />
          <span>{hasApiKey() ? '🔑 Gemini Key Active' : '🔑 Set Gemini API Key'}</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-2xl w-fit shadow-xs">
        <button
          onClick={() => setActiveTab('images')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'images'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image Generator (Imagen 3)</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'video'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <VideoIcon className="w-4 h-4" />
          <span>Video Generator (Google Veo)</span>
        </button>
      </div>

      {/* IMAGE GENERATOR TAB */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <form onSubmit={handleGenerateImage} className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe an activity, scenery, or street food scene..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />

                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-indigo-500"
                >
                  <option value="16:9">16:9 Landscape</option>
                  <option value="1:1">1:1 Square</option>
                  <option value="9:16">9:16 Portrait</option>
                </select>

                <button
                  type="submit"
                  disabled={isGeneratingImage || !imagePrompt.trim()}
                  className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                >
                  {isGeneratingImage ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin" />
                      <span>Generating with Imagen 3...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Generate Image</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sample Prompts */}
              <div className="flex items-center gap-2.5 overflow-x-auto text-xs pt-1">
                <span className="text-slate-400 font-bold whitespace-nowrap">Quick suggestions:</span>
                {sampleImagePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImagePrompt(prompt)}
                    className="whitespace-nowrap px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium text-xs"
                  >
                    "{prompt.slice(0, 34)}..."
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Generated Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedImages.map((img) => (
              <div key={img.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs group flex flex-col justify-between">
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white font-bold text-[10px] px-3 py-1 rounded-full">
                    {img.source}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed">
                    "{img.prompt}"
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                    <span>{img.date}</span>
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline font-bold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Full Size</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIDEO GENERATOR TAB */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <form onSubmit={handleGenerateVideo} className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Describe your cinematic video trailer (e.g. Drone flight over Tokyo at dusk)..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white"
                />

                <select
                  value={videoStyle}
                  onChange={(e) => setVideoStyle(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-purple-500"
                >
                  <option value="Cinematic Drone 4K">Cinematic Drone 4K</option>
                  <option value="Cyberpunk Hyperlapse">Cyberpunk Hyperlapse</option>
                  <option value="Vintage 8mm Nostalgia">Vintage 8mm Nostalgia</option>
                  <option value="Smooth 60fps Steadicam">Smooth 60fps Steadicam</option>
                </select>

                <button
                  type="submit"
                  disabled={isGeneratingVideo || !videoPrompt.trim()}
                  className="px-7 py-3.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                >
                  {isGeneratingVideo ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Veo Video...</span>
                    </>
                  ) : (
                    <>
                      <Film className="w-4 h-4" />
                      <span>Generate Video Trailer</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sample Video Prompts */}
              <div className="flex items-center gap-2.5 overflow-x-auto text-xs pt-1">
                <span className="text-slate-400 font-bold whitespace-nowrap">Trailer Ideas:</span>
                {sampleVideoPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setVideoPrompt(prompt)}
                    className="whitespace-nowrap px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl transition-colors font-medium text-xs"
                  >
                    "{prompt.slice(0, 34)}..."
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Main Video Player Showcase */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="relative rounded-3xl overflow-hidden shadow-lg bg-black aspect-video flex items-center justify-center group">
                <video
                  src={activeVideo.videoUrl}
                  poster={activeVideo.poster}
                  controls
                  loop
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-2 pointer-events-none">
                  <Film className="w-4 h-4 text-purple-400" />
                  <span>{activeVideo.source}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
                    <span>Style: {activeVideo.style}</span>
                    <span>•</span>
                    <span>Ultra HD 4K Render</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mt-1">
                    "{activeVideo.prompt}"
                  </h4>
                </div>

                <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Trailer Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
