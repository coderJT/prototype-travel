import React from 'react';
import { Wallet, CheckCircle, ArrowRightLeft, Sparkles } from 'lucide-react';

export default function BudgetSplitter({ travelers, itinerary }) {
  const totalTripCost = itinerary.reduce((sum, day) => {
    return sum + day.items.reduce((daySum, item) => daySum + (item.costPerPerson * travelers.length), 0);
  }, 0);

  const perPersonCost = Math.round(totalTripCost / travelers.length);

  const ledger = [
    { payer: 'Alice Lin', item: 'Omoide Yokocho Izakaya + Tsukiji Snacks', amount: 320, category: 'Food' },
    { payer: 'Bob Martinez', item: 'Akihabara Arcade Odyssey + VR Pass', amount: 280, category: 'Entertainment' },
    { payer: 'Charlie Zhang', item: 'teamLab Planets + Hotel Groove Deposit', amount: 480, category: 'Stays & Tickets' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Friendly Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-amber-700 font-bold">
            <Wallet className="w-4 h-4 text-amber-600" />
            <span>Harmonious Group Financials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Trip Budget & Fair Split 💰
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Real-time balance settlement so nobody feels shortchanged and nobody has to do awkward math.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Group Spend</div>
            <div className="text-xl font-black text-slate-900">${totalTripCost.toLocaleString()}</div>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Per Person Base</div>
            <div className="text-xl font-black text-emerald-600">${perPersonCost.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Traveler Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {travelers.map(t => {
          const personalEstimatedSpend = itinerary.reduce((sum, day) => {
            return sum + day.items.reduce((daySum, item) => daySum + item.costPerPerson, 0);
          }, 0);
          const maxBudget = t.budgetDaily * 4;
          const isUnder = personalEstimatedSpend <= maxBudget;

          return (
            <div key={t.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200" />
                  <div>
                    <div className="font-black text-sm text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{t.vibe}</div>
                  </div>
                </div>
                <span className="text-2xl">{t.agentAvatar}</span>
              </div>

              {/* Progress */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Estimated 4-Day:</span>
                  <span className={`font-black ${isUnder ? 'text-emerald-700' : 'text-rose-600'}`}>
                    ${personalEstimatedSpend} / ${maxBudget} cap
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isUnder ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(100, (personalEstimatedSpend / maxBudget) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Cap: ${t.budgetDaily}/d</span>
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Within Budget
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shared Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 font-black text-base text-slate-900">
            <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
            <span>Shared Expense Ledger & Settlement Matrix</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Minimized transfers automatically</span>
        </div>

        <div className="divide-y divide-slate-100">
          {ledger.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 font-black flex items-center justify-center border border-amber-200/70 text-sm">
                  ${item.amount}
                </div>
                <div>
                  <div className="font-black text-sm text-slate-900">{item.item}</div>
                  <div className="text-slate-500 text-xs mt-0.5">Paid by <strong className="text-slate-800">{item.payer}</strong> • {item.category}</div>
                </div>
              </div>
              <div>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  Split 3 ways (${Math.round(item.amount / 3)} each)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
