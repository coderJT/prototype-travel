import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  Building2,
  MapPin,
  QrCode,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Code2,
  Bot,
  Zap,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import {
  executeDemandAiAutonomousBooking,
  DEMAND_API_BASE_URL
} from '../services/bookingDemandAiService';

export default function DemandAiBookingModal({
  isOpen,
  onClose,
  hotel,
  travelers = [],
  existingBooking = null,
  onBookingSuccess = () => {},
  onBookingCancel = () => {}
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepLogs, setStepLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setConfirmedData(null);
      setStepLogs([]);
      setCurrentStep(1);
      setShowJsonInspector(false);
      return;
    }

    if (existingBooking) {
      setConfirmedData(existingBooking);
      setIsProcessing(false);
      setCurrentStep(4);
    } else if (hotel) {
      // Start autonomous pipeline
      startAutonomousPipeline();
    }
  }, [isOpen, existingBooking, hotel]);

  const startAutonomousPipeline = async () => {
    setIsProcessing(true);
    setConfirmedData(null);
    setStepLogs([]);
    setCurrentStep(1);

    try {
      const result = await executeDemandAiAutonomousBooking({
        hotel,
        travelers,
        onStepChange: (stepData) => {
          setCurrentStep(stepData.step);
          setStepLogs(prev => [...prev, stepData]);
        }
      });

      setConfirmedData(result);
      setIsProcessing(false);
      onBookingSuccess(result);
    } catch (err) {
      console.error('Booking failed:', err);
      setIsProcessing(false);
    }
  };

  const handleCopyRef = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-7 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-indigo-100 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                Booking.com Demand API • Sandbox v3.2
              </span>
              <span className="text-[11px] text-indigo-200 font-semibold hidden sm:inline">
                Zero Human Interaction Mode
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Autonomous Demand AI Booking</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-[#f8fafc]">
          {/* PROCESSING STATE: 4-Step Pipeline Terminal */}
          {isProcessing && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-200">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-indigo-950">
                    Aegis Concierge is executing autonomous reservation...
                  </h4>
                  <p className="text-xs text-indigo-800/80 mt-0.5">
                    Zero human typing required. Auto-synthesizing Alice, Bob, and Charlie's constraints into Booking.com Demand API.
                  </p>
                </div>
              </div>

              {/* Step Progress Checklist */}
              <div className="space-y-3 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                {[
                  {
                    step: 1,
                    title: 'Querying Demand API Sandbox Inventory',
                    endpoint: 'POST /accommodations/search',
                    desc: `Matching ${hotel?.name} with 3-guest room requirements`
                  },
                  {
                    step: 2,
                    title: 'Rate Lock & Free Cancellation Validation',
                    endpoint: 'POST /accommodations/availability',
                    desc: `Securing group rate block & verifying 100% refund policy`
                  },
                  {
                    step: 3,
                    title: 'Zero-Touch Guest Synthesis',
                    endpoint: 'POST /orders/preview',
                    desc: `Binding Alice Lin (Lead), Bob Martinez, Charlie Zhang`
                  },
                  {
                    step: 4,
                    title: 'Issuing Demand API Instant Voucher',
                    endpoint: 'POST /orders/confirm',
                    desc: `Minting PNR, Booking Reference, and QR room key`
                  }
                ].map((s) => {
                  const isDone = currentStep > s.step;
                  const isCurrent = currentStep === s.step;
                  return (
                    <div
                      key={s.step}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : isCurrent
                          ? 'bg-indigo-50/90 border-indigo-300 text-indigo-950 ring-2 ring-indigo-200/50'
                          : 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold">
                            {s.step}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="font-extrabold text-xs">{s.title}</h5>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-black/5 font-semibold">
                            {s.endpoint}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* COMPLETED / CONFIRMED VOUCHER STATE */}
          {!isProcessing && confirmedData && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* Success Badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-200">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                        Autonomous Mock Reservation Confirmed!
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-extrabold">
                        Sandbox v3.2
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-0.5 font-medium">
                      Executed end-to-end via Booking.com Demand API with zero human input.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-emerald-200 text-xs font-mono font-black text-slate-900 shadow-xs">
                  <span>PNR: {confirmedData.pnr}</span>
                  <button
                    onClick={() => handleCopyRef(confirmedData.reference)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                    title="Copy Reference"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Digital Hotel Voucher Card */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Voucher Top Details */}
                <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={confirmedData.image || hotel?.image}
                      alt={confirmedData.hotelName}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{confirmedData.neighborhood}</span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mt-0.5">
                        {confirmedData.hotelName}
                      </h4>
                      <p className="text-xs text-indigo-700 font-bold mt-1">
                        {confirmedData.roomType}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center shrink-0 w-full md:w-auto">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Booking Reference</div>
                    <div className="text-sm font-black text-slate-900 font-mono mt-0.5">
                      {confirmedData.reference}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold mt-1">
                      Check-in PIN: {confirmedData.pin}
                    </div>
                  </div>
                </div>

                {/* Dates & Guests Manifest */}
                <div className="p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50/50 border-b border-slate-100">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Check-In</span>
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-1">
                      {confirmedData.checkIn}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">From 15:00 JST</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Check-Out</span>
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-1">
                      {confirmedData.checkOut}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">Until 11:00 JST (4 nights)</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>Guests Manifest</span>
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-1">
                      {confirmedData.guestCount} Travelers
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                      Lead: {confirmedData.leadGuestName}
                    </div>
                  </div>
                </div>

                {/* Auto-Bound Guest Details */}
                <div className="p-6 sm:p-7 space-y-3">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Autonomous Guest Binding (Auto-Filled from Squad Profiles)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {confirmedData.guests.map((g, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
                        <div className="font-extrabold text-slate-900 flex items-center justify-between">
                          <span>{g.fullName}</span>
                          {g.isLead && (
                            <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">
                              Lead
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 truncate">
                          {g.preferences}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500">
                        {confirmedData.cancellationPolicy}
                      </div>
                      <div className="text-xs text-slate-400">
                        Payment: {confirmedData.paymentMethod}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-400 font-bold">Total Stay (Split: ${confirmedData.pricePerPerson}/ea)</div>
                      <div className="text-2xl font-black text-slate-900">
                        ${confirmedData.totalPrice} <span className="text-xs font-bold text-slate-500">USD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Developer / Hackathon Judge Mode: Raw Demand API v3.2 JSON */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
                <button
                  onClick={() => setShowJsonInspector(!showJsonInspector)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-600" />
                    <span>Booking.com Demand API v3.2 Sandbox Payload Inspector</span>
                  </div>
                  <span className="text-slate-400">{showJsonInspector ? 'Hide JSON ▲' : 'Inspect JSON ▼'}</span>
                </button>

                {showJsonInspector && (
                  <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed">
                    <pre>{JSON.stringify(confirmedData.apiSimulationLogs, null, 2)}</pre>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    onBookingCancel(confirmedData.id);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                >
                  Cancel Mock Reservation (Sandbox Refund)
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print / Save Voucher</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
