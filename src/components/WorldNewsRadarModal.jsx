import React from 'react';
import {
  X,
  Radio,
  AlertTriangle,
  ArrowRight,
  CloudSun,
  Sparkles
} from 'lucide-react';

export default function WorldNewsRadarModal({
  isOpen,
  onClose,
  newsAlerts,
  onTriggerDisruption,
  onNavigateToMeeting
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">World News & Disruption Radar 📡</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500">
                AI cross-references meteorological satellites, transport feeds & local bulletins.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 text-xs text-indigo-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                <strong>Anticipatory Re-Planning:</strong> When weather or flights change, Aegis drafts happy indoor contingencies.
              </span>
            </div>
            <button
              onClick={() => {
                onTriggerDisruption();
                onClose();
              }}
              className="shrink-0 px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 text-[11px] font-bold rounded-xl transition-all"
            >
              Simulate Surge
            </button>
          </div>

          <div className="space-y-3">
            {newsAlerts.map(alert => {
              const isHigh = alert.severity === 'high';
              const isMed = alert.severity === 'medium';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-3xl border transition-all ${
                    isHigh
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                      : isMed
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{alert.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900">{alert.headline}</h4>
                          <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isHigh
                              ? 'bg-amber-200 text-amber-900'
                              : isMed
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {alert.severity} Priority
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Source: {alert.source} • {alert.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200">
                    <div className="font-bold text-slate-900 mb-0.5">Trip Impact:</div>
                    <p className="leading-relaxed">{alert.impact}</p>
                  </div>

                  <div className="mt-2.5 text-xs bg-indigo-50/60 p-3 rounded-2xl border border-indigo-100 flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-indigo-900 flex items-center gap-1 mb-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>AI Suggestion:</span>
                      </div>
                      <p className="text-slate-700">{alert.aiRecommendation}</p>
                    </div>

                    {isHigh && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToMeeting();
                        }}
                        className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        <span>Discuss at Table</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Continuous feed sync</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl font-bold transition-colors"
          >
            Close Radar
          </button>
        </div>
      </div>
    </div>
  );
}
