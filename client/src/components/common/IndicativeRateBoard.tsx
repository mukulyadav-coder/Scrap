import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MaterialCategory, IndicativeRate } from '../../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info, 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  Layers, 
  Search,
  Filter
} from 'lucide-react';

export const IndicativeRateBoard: React.FC = () => {
  const { indicativeRates, language, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: language === 'hi' ? 'सभी श्रेणियां' : 'All Materials' },
    { id: 'paper', label: t.categories.paper },
    { id: 'cardboard', label: t.categories.cardboard },
    { id: 'plastic', label: t.categories.plastic },
    { id: 'metal', label: t.categories.metal },
    { id: 'e_waste', label: t.categories.e_waste },
  ];

  const filteredRates = indicativeRates.filter(rate => {
    const matchesCat = selectedCategory === 'all' || rate.category === selectedCategory;
    const nameToSearch = language === 'hi' ? rate.hindiName : rate.name;
    const matchesSearch = nameToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rate.marketSource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner with Explicit Mandi Disclaimer */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-forest-900 to-forest-800 text-white shadow-soft relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Live Delhi-NCR Mandi Benchmarks 2026
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {language === 'hi' ? 'दैनिक कबाड़ मंडी भाव' : 'Indicative Scrap Rate Directory'}
          </h2>
          <p className="text-xs sm:text-sm text-forest-200 leading-relaxed">
            Transparent market rates updated from Mayapuri, Naraina & Bawana scrap hubs.
          </p>
        </div>

        {/* Disclaimer Callout Box inside banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-2.5 text-xs text-forest-100">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span className="leading-snug">
            <strong>{language === 'hi' ? 'महत्वपूर्ण सूचना:' : 'Notice:'}</strong> {t.disclaimer.rateNotice}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-forest-800 text-white shadow-xs font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t.actions.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-hidden focus:border-forest-500 shadow-2xs"
          />
        </div>

      </div>

      {/* Rate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRates.map((rate) => {
          const isEwaste = rate.isRegulated;

          return (
            <div
              key={rate.id}
              className={`rounded-3xl p-5 border bg-white shadow-card hover:shadow-soft transition-all duration-200 flex flex-col justify-between ${
                isEwaste ? 'border-amber-300 ring-1 ring-amber-300/40' : 'border-slate-200/90'
              }`}
            >
              <div>
                {/* Category & Trend Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md ${
                    rate.category === 'paper' ? 'bg-amber-100 text-amber-800' :
                    rate.category === 'cardboard' ? 'bg-orange-100 text-orange-800' :
                    rate.category === 'plastic' ? 'bg-blue-100 text-blue-800' :
                    rate.category === 'metal' ? 'bg-slate-100 text-slate-800' :
                    'bg-purple-100 text-purple-900'
                  }`}>
                    {rate.category.replace('_', ' ')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {rate.trend === 'up' && (
                      <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" /> ↑ {language === 'hi' ? 'बढ़त' : 'Bullish'}
                      </span>
                    )}
                    {rate.trend === 'down' && (
                      <span className="flex items-center gap-0.5 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        <TrendingDown className="w-3 h-3" /> ↓ {language === 'hi' ? 'गिरावट' : 'Dip'}
                      </span>
                    )}
                    {rate.trend === 'stable' && (
                      <span className="flex items-center gap-0.5 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Minus className="w-3 h-3" /> {language === 'hi' ? 'स्थिर' : 'Steady'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Item Name */}
                <h3 className="text-base font-bold text-slate-900 mt-2.5">
                  {language === 'hi' ? rate.hindiName : rate.name}
                </h3>
                {language === 'hi' && (
                  <div className="text-xs text-slate-400 font-medium">({rate.name})</div>
                )}

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {rate.description}
                </p>

                {/* Price Display */}
                <div className="mt-4 p-3.5 rounded-2xl bg-forest-50/70 border border-forest-100/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-forest-800 tracking-wider">
                      Indicative Mandi Range
                    </span>
                    <div className="text-xl font-black text-forest-950 font-mono">
                      ₹{rate.minPrice} – ₹{rate.maxPrice}
                      <span className="text-xs font-semibold text-slate-600 ml-1">
                        / kg
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-forest-700 bg-forest-100 px-2 py-1 rounded-lg">
                    Estimated
                  </span>
                </div>
              </div>

              {/* Source & Updated Time footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Benchmark Source:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[170px]" title={rate.marketSource}>
                    {rate.marketSource}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Updated:
                  </span>
                  <span>{rate.lastUpdated}</span>
                </div>

                {isEwaste && (
                  <div className="mt-2 text-[10px] text-amber-700 font-semibold flex items-center gap-1 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    CPCB authorization required for handling.
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

