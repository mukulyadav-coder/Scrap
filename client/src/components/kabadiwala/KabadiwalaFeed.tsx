import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteListing, MaterialCategory } from '../../types';
import { 
  Radio, 
  MapPin, 
  Weight, 
  Clock, 
  Send, 
  Filter, 
  CheckCircle2, 
  ShieldAlert, 
  Info, 
  Sparkles,
  Search
} from 'lucide-react';

export const KabadiwalaFeed: React.FC<{ 
  onOpenOfferModal: (listing: WasteListing) => void 
}> = ({ onOpenOfferModal }) => {
  const { listings, offers, currentUser, language, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(5);
  const [search, setSearch] = useState<string>('');

  const pendingListings = listings.filter(l => l.status === 'pending');

  const filteredListings = pendingListings.filter(l => {
    const matchesCat = selectedCategory === 'all' || l.category === selectedCategory;
    const matchesSearch = l.subcategory.toLowerCase().includes(search.toLowerCase()) ||
                          l.locality.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            Live Marketplace Radar
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'hi' ? 'आस-पास का कबाड़ फीड' : 'Nearby Scrap Listings Feed'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct doorstep scrap requests posted by households and businesses within your service radius.
          </p>
        </div>

        {/* Distance Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold shrink-0">
          <span className="text-slate-500 px-2 text-[11px] uppercase">Radius:</span>
          {[1.5, 3, 5, 10].map((dist) => (
            <button
              key={dist}
              onClick={() => setMaxDistance(dist)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                maxDistance === dist
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              &lt;{dist}km
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'paper', 'cardboard', 'plastic', 'metal', 'e_waste'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-forest-800 text-white shadow-xs font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Materials' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by area or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-hidden focus:border-forest-500 shadow-2xs"
          />
        </div>

      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
          <Radio className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No Pending Scrap Requests</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are currently no open listings matching this filter. Try expanding your radius or changing the category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((listing) => {
            const myOffer = offers.find(o => o.listingId === listing.id && o.buyerId === currentUser.id);

            return (
              <div
                key={listing.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-card hover:shadow-soft transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  
                  {/* Photo Container */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={listing.photos[0] || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400'}
                      alt={listing.category}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />

                    {/* Top badging */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-white/95 backdrop-blur-md text-forest-900 shadow-xs">
                        {listing.category.replace('_', ' ')}
                      </span>
                      {listing.isEwaste && (
                        <span className="px-2 py-0.5 rounded-xl text-[10px] font-bold bg-purple-600 text-white shadow-xs">
                          Regulated
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-slate-900/85 backdrop-blur-md text-white shadow-xs flex items-center gap-1">
                      <Weight className="w-3.5 h-3.5 text-emerald-400" />
                      ~{listing.estimatedWeightKg} kg
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {listing.subcategory}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{listing.locality}</span>
                        <span className="text-emerald-700 font-semibold ml-1">
                          (~1.2 km away)
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Condition:</span>
                        <span className="font-bold text-slate-800 capitalize">
                          {listing.condition.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Preferred Slot:</span>
                        <span className="font-bold text-forest-900">
                          {listing.preferredSlot}
                        </span>
                      </div>
                      {listing.notes && (
                        <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                          "{listing.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="p-5 pt-0">
                  {myOffer ? (
                    <div className="p-3 rounded-2xl bg-mint-50 border border-forest-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-forest-700 font-bold uppercase">Your Bid</span>
                        <div className="font-bold text-forest-950 font-mono">
                          ₹{myOffer.offeredRatePerKg}/kg (₹{myOffer.totalEstimatedAmount})
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-forest-800 text-white">
                        Submitted
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenOfferModal(listing)}
                      className="w-full py-3 px-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md shadow-forest-900/20 flex items-center justify-center gap-2 transition-all active:scale-98"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.actions.submitOffer}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

