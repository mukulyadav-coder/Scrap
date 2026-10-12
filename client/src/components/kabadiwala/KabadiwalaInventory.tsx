import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Warehouse, 
  TrendingUp, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Boxes, 
  Plus 
} from 'lucide-react';

export const KabadiwalaInventory: React.FC = () => {
  const { inventory, setActiveTab, indicativeRates, language } = useApp();

  const totalStockKg = inventory.reduce((acc, curr) => acc + curr.currentStockKg, 0);
  const totalCost = inventory.reduce((acc, curr) => acc + (curr.currentStockKg * curr.avgPurchaseCostPerKg), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
            <Warehouse className="w-3.5 h-3.5 text-emerald-500" />
            Godown & Depot Stockpile
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'hi' ? 'गोदाम स्टॉक एवं इन्वेंटरी' : 'Godown Inventory Management'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track collected recyclable materials, average purchase costs, and ready-to-sell bulk bundles.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('bulk_market')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-md shadow-forest-900/20 shrink-0"
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Sell Stock to Bulk Buyers</span>
        </button>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Accumulated Stock
          </span>
          <div className="text-2xl font-black font-mono text-forest-900 mt-1">
            {totalStockKg} <span className="text-xs text-slate-500 font-normal">kg</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Across all sorted categories</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Capital In Stock
          </span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            ₹{Math.round(totalCost)}
          </div>
          <span className="text-[11px] text-slate-500">Based on purchase rates paid to sellers</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Estimated Bulk Liquidation Value
          </span>
          <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
            ₹{Math.round(totalCost * 1.25)}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">~25% Gross Profit Margin upon sale</span>
        </div>
      </div>

      {/* Inventory Item Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventory.map((item) => {
          const rateInfo = indicativeRates.find(r => r.category === item.category);
          const estSellingRate = rateInfo ? rateInfo.maxPrice : (item.avgPurchaseCostPerKg * 1.2);
          const grossProfit = Math.round(item.currentStockKg * (estSellingRate - item.avgPurchaseCostPerKg));

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-forest-50 text-forest-800">
                    {item.category.replace('_', ' ')}
                  </span>
                  <Boxes className="w-4 h-4 text-slate-400" />
                </div>

                <h3 className="font-bold text-slate-900 text-base mt-2">
                  {item.subcategory}
                </h3>

                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quantity in Stock:</span>
                    <span className="font-black font-mono text-forest-900 text-sm">
                      {item.currentStockKg} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Avg Cost Price:</span>
                    <span className="font-mono text-slate-700">₹{item.avgPurchaseCostPerKg}/kg</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/60 pt-1.5">
                    <span className="text-slate-500">Bulk Sell Target:</span>
                    <span className="font-mono font-bold text-emerald-700">₹{estSellingRate}/kg</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Est. Net Profit:</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">
                  +₹{grossProfit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

