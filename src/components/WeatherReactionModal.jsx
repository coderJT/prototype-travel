import React from 'react';
import { X, CloudRain, AlertTriangle, ArrowRight, ShieldCheck, SunMedium } from 'lucide-react';

export default function WeatherReactionModal({
  isOpen,
  onClose,
  threatReason = 'Coastal gale force winds warning from Tokyo Bay Maritime Authority affecting Day 3 cruise.',
  onConveneMeeting,
  onIgnoreAlert
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shadow-2xs">
              <CloudRain className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 tracking-tight">
                Weather Disruption Alert
              </h3>
              <p className="text-xs text-gray-500">
                Choose how the squad handles this weather warning
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

        {/* Content */}
        <div className="p-5 space-y-3.5">
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Meteorological Notice</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              {threatReason}
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
            <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              AI Recommendation
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sub-AIs have indoor contingency options ready at the Meeting Table. Convene the table to vote on a sheltered alternative, or choose to keep the original plan.
            </p>
          </div>

          {/* Action Choices */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onConveneMeeting();
                onClose();
              }}
              className="w-full p-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs flex items-center justify-between shadow-xs transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 text-left">
                <ShieldCheck className="w-4 h-4 text-purple-200 shrink-0" />
                <div>
                  <div className="font-bold text-xs">Convene Squad Meeting Table</div>
                  <div className="text-[11px] text-purple-100">
                    Vote on indoor contingency options
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            <button
              onClick={() => {
                onIgnoreAlert();
                onClose();
              }}
              className="w-full p-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 text-left">
                <SunMedium className="w-4 h-4 text-gray-500 shrink-0" />
                <div>
                  <div className="font-semibold text-gray-800">Proceed with Outdoor Plan</div>
                  <div className="text-[11px] text-gray-500">
                    Keep the original boat cruise on the schedule
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-gray-400">Dismiss</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
