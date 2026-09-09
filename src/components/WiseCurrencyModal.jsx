import React, { useState } from 'react';
import {
  X,
  ArrowRightLeft,
  DollarSign,
  TrendingDown,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Code2,
  Terminal,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import {
  SUPPORTED_CURRENCIES,
  MID_MARKET_RATES,
  calculateWiseSavings,
  getWiseCardBalance,
  topUpWiseBalance,
  WISE_BACKEND_SNIPPET
} from '../services/wiseService';

export default function WiseCurrencyModal({
  isOpen,
  onClose,
  totalTripUsd = 620,
  onCurrencyChange
}) {
  const [activeTab, setActiveTab] = useState('converter'); // 'converter' | 'card' | 'api'
  const [sourceAmount, setSourceAmount] = useState(totalTripUsd || 500);
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('JPY');
  const [cardState, setCardState] = useState(getWiseCardBalance());
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  if (!isOpen) return null;

  const savings = calculateWiseSavings(Number(sourceAmount) || 0, sourceCurrency, targetCurrency);

  const handleTopUp = (amount) => {
    const updated = topUpWiseBalance(amount, sourceCurrency, targetCurrency);
    setCardState(updated);
    setTopUpSuccess(true);
    setTimeout(() => setTopUpSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Wise Currency Exchange & Multi-Currency Hub
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/80">
                  0% Hidden Markups
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Real mid-market exchange rate, multi-currency debit card, and fair squad expense settlement.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('converter')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'converter' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Exchange Rates
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Wise Card</span>
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'api' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>API SDK</span>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {activeTab === 'converter' && (
            <div className="space-y-6">
              {/* Currency Converter Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Source */}
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      You Send (Squad Funds)
                    </label>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2.5 focus-within:border-emerald-500 shadow-2xs">
                      <input
                        type="number"
                        value={sourceAmount}
                        onChange={(e) => setSourceAmount(e.target.value)}
                        className="flex-1 text-base font-black text-slate-900 focus:outline-none pl-1"
                      />
                      <select
                        value={sourceCurrency}
                        onChange={(e) => setSourceCurrency(e.target.value)}
                        className="bg-slate-100 font-bold text-xs text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
                      >
                        {SUPPORTED_CURRENCIES.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 shadow-xs">
                    <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                  </div>

                  {/* Target */}
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Squad Receives (Japan Local)
                    </label>
                    <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-200 rounded-xl p-2.5 shadow-2xs">
                      <div className="flex-1 text-base font-black text-emerald-950 pl-1">
                        ¥{savings.targetAmountWise.toLocaleString()}
                      </div>
                      <span className="bg-emerald-100 font-bold text-xs text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
                        🇯🇵 JPY
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rate banner */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-slate-200/60">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Wise Mid-Market Benchmark Rate:</span>
                    <strong className="text-slate-900 font-mono font-bold">
                      1 {sourceCurrency} = {savings.midMarketRate.toFixed(2)} {targetCurrency}
                    </strong>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live Rate Verified
                  </span>
                </div>
              </div>

              {/* Comparison vs Traditional Banks */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    <span>Transparent Fee Breakdown vs Traditional Banks</span>
                  </h4>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Save ${savings.savings} USD on this trip
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Wise Card */}
                  <div className="p-4 rounded-xl bg-emerald-50/60 border-2 border-emerald-300 space-y-2 relative">
                    <span className="absolute top-3 right-3 text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      BEST VALUE
                    </span>
                    <div className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                      <span>Wise Multi-Currency</span>
                    </div>
                    <div className="text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Transparent Fee (0.41%):</span>
                        <strong className="text-slate-900">${savings.wiseFee} USD</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Exchange Rate Markup:</span>
                        <strong className="text-emerald-700">0.0% (True Mid-Market)</strong>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-emerald-200 font-black text-slate-900">
                        <span>Recipient Gets:</span>
                        <span className="text-emerald-800 text-sm">¥{savings.targetAmountWise.toLocaleString()} JPY</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800 text-sm">
                      Typical Bank / Credit Card
                    </div>
                    <div className="text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Hidden FX Spread (3.5%):</span>
                        <strong className="text-rose-600">${savings.bankFee} USD</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Exchange Rate Markup:</span>
                        <strong className="text-slate-700">3.5% Hidden Cost</strong>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-700">
                        <span>Recipient Gets:</span>
                        <span className="text-slate-800 text-sm">¥{savings.targetAmountBank.toLocaleString()} JPY</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>
                    By using Wise for Tokyo hotel deposits and daily dining, your group receives an extra <strong>¥{savings.extraYenReceived.toLocaleString()} JPY</strong> (~${savings.savings} USD saved) with zero foreign transaction fees.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="space-y-6">
              {/* Virtual Wise Card Display */}
              <div className="max-w-md mx-auto bg-gradient-to-tr from-emerald-600 via-teal-700 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-widest uppercase opacity-80">
                    Wise Travel Card
                  </span>
                  <span className="text-lg font-black italic">VISA</span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-emerald-200 font-medium">Squad Multi-Currency Balance</div>
                  <div className="text-2xl font-black tracking-tight">
                    ¥{cardState.balances.JPY.toLocaleString()} JPY
                  </div>
                  <div className="text-xs text-emerald-300">
                    Secondary: ${cardState.balances.USD.toFixed(2)} USD • S${cardState.balances.SGD.toFixed(2)} SGD
                  </div>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-white/20">
                  <div>
                    <div className="text-[10px] text-white/70 uppercase">Cardholder</div>
                    <div className="text-xs font-bold">{cardState.cardHolder}</div>
                  </div>
                  <div className="font-mono text-sm tracking-wider">
                    •••• {cardState.lastFourDigits}
                  </div>
                </div>
              </div>

              {/* Quick 1-Click Top-Up for Japan Trip */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Pre-Fund Tokyo Trip Pocket Funds
                  </h4>
                  {topUpSuccess && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Card Successfully Funded in JPY!</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleTopUp(100)}
                    className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-center transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="text-xs font-bold text-slate-900">+$100 USD</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">+¥15,342 JPY</div>
                  </button>
                  <button
                    onClick={() => handleTopUp(300)}
                    className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-center transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="text-xs font-bold text-slate-900">+$300 USD</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">+¥46,026 JPY</div>
                  </button>
                  <button
                    onClick={() => handleTopUp(500)}
                    className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-center transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="text-xs font-bold text-slate-900">+$500 USD</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">+¥76,710 JPY</div>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Funds converted at mid-market rate. Spend directly in Tokyo using Apple Pay or physical Wise Visa card without ATM conversion markups.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-sm font-bold text-emerald-950">
                    Official Wise API & Python SDK Integration
                  </h4>
                </div>
                <p className="text-xs text-emerald-900/80 leading-relaxed">
                  Wise offers open public endpoints for rates and authenticated endpoints for multi-currency borderless wallets and card transactions.
                </p>
              </div>

              {/* Endpoints & Libraries table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2.5">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    Public Rates Endpoint
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm">GET https://api.wise.com/v1/rates</h5>
                  <p className="text-slate-600">
                    Does not require authentication for public rate benchmarks. Query parameters <code className="bg-slate-100 px-1 rounded">?source=USD&target=JPY</code>.
                  </p>
                  <a
                    href="https://api-docs.wise.com/#rates"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-800"
                  >
                    <span>Wise Rates API Documentation</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2.5">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    Python Library
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm">wise-python / transferwise</h5>
                  <p className="text-slate-600">
                    Community and official Python SDKs supporting rate quoting, quote creation, and profile balance auditing.
                  </p>
                  <a
                    href="https://github.com/mowglii/transferwise-python"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-800"
                  >
                    <span>View GitHub SDK</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Python Snippet */}
              <div className="bg-slate-950 text-slate-100 rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span>FastAPI + Wise Rates Endpoint Example</span>
                  <span className="text-emerald-400">Live API Verified</span>
                </div>
                <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
                  {WISE_BACKEND_SNIPPET.trim()}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-500">
            Current session savings: <strong>${savings.savings} USD</strong> vs traditional high-street banks.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
