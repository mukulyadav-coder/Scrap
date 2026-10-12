import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BulkRequirement } from '../../types';
import { 
  Layers, 
  TrendingUp, 
  Calculator, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Building2, 
  Scale 
} from 'lucide-react';

export const KabadiwalaBulkMarket: React.FC = () => {
  const { bulkRequirements, inventory, showToast, language } = useApp();
  const [transportCostPerKg, setTransportCostPerKg] = useState<number>(1.5);
  const [selectedReq, setSelectedReq] = useState<BulkRequirement | null>(null);

  const handleSellLot = (req: BulkRequirement) => {
    showToast(`Bulk supply inquiry dispatched to ${req.companyName}! Weighbridge slot booked.`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            Wholesale Aggregator Market
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'hi' ? 'थोक खरीदार और मार्जिन तुलना' : 'Discover Bulk Buyers & Net Margins'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare industrial factory gate buying prices against local purchase costs and freight to maximize margins.
          </p>
        </div>

        {/* Handling & Freight Adjuster */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-3">
          <Truck className="w-4 h-4 text-slate-500 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Estimated Freight & Handling</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-bold text-slate-900 font-mono">₹{transportCostPerKg}/kg</span>
              <button
                onClick={() => setTransportCostPerKg(prev => prev === 1.5 ? 2.0 : 1.5)}
                className="text-[10px] text-purple-700 font-bold ml-1 hover:underline"
              >
                (Toggle ₹1.5 / ₹2.0)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Buyer Offer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {bulkRequirements.map((req) => {
          // Find matching item in collector inventory to calculate net profit
          const matchingInv = inventory.find(i => i.category === req.category);
          const myCost = matchingInv ? matchingInv.avgPurchaseCostPerKg : 12.0;
          const netMarginPerKg = Number((req.offeredRatePerKg - myCost - transportCostPerKg).toFixed(1));
          const totalEstimatedProfit = matchingInv 
            ? Math.round(matchingInv.currentStockKg * netMarginPerKg)
            : Math.round(req.minQuantityKg * netMarginPerKg);

          return (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-card hover:shadow-soft transition-all duration-200 p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-800">
                      {req.category.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-2 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                      {req.companyName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Factory Gate</span>
                    <div className="text-xl font-black font-mono text-purple-900">
                      ₹{req.offeredRatePerKg}
                      <span className="text-xs font-semibold text-slate-500"> / kg</span>
                    </div>
                  </div>
                </div>

                {/* Subcategory & Specifications */}
                <div className="text-xs text-slate-600 space-y-1 mt-2">
                  <div className="font-semibold text-slate-800">{req.subcategory}</div>
                  <div className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{req.locality}</span>
                  </div>
                  <div className="text-[11px] text-purple-700 font-medium">
                    Specification: {req.purityGrade}
                  </div>
                </div>

                {/* Net Profit Spread Calculation Box */}
                <div className="mt-4 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Your Purchase Cost:</span>
                    <span className="font-mono">₹{myCost}/kg</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Est. Transport/Freight:</span>
                    <span className="font-mono">-₹{transportCostPerKg}/kg</span>
                  </div>
                  <div className="flex justify-between border-t border-purple-200/60 pt-1.5 font-bold text-purple-950">
                    <span>Net Margin Spread:</span>
                    <span className="font-mono text-emerald-600">+₹{netMarginPerKg}/kg</span>
                  </div>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Min Quantity: <strong>{req.minQuantityKg} kg</strong></span>
                  <span className="text-emerald-700 font-bold">
                    Est. Gain: ~₹{totalEstimatedProfit}
                  </span>
                </div>

                <button
                  onClick={() => handleSellLot(req)}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-purple-300" />
                  <span>Send Supply Quote & Dispatch</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

