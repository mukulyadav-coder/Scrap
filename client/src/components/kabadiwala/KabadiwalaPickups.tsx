import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { 
  Truck, 
  Scale, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Calendar, 
  Receipt, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export const KabadiwalaPickups: React.FC<{ 
  onOpenWeighing: (order: Order) => void 
}> = ({ onOpenWeighing }) => {
  const { orders, setSelectedReceiptOrder, currentUser, t, language } = useApp();
  const [filter, setFilter] = useState<'scheduled' | 'completed'>('scheduled');

  const myOrders = orders.filter(o => o.buyerId === currentUser.id);
  const displayedOrders = myOrders.filter(o => {
    if (filter === 'scheduled') return o.status === 'pickup_scheduled' || o.status === 'accepted';
    if (filter === 'completed') return o.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            Field Pickup Roster
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'hi' ? 'पिकअप एवं डिजिटल कांटा तौल' : 'Scheduled Visits & Digital Weighing'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visit seller addresses, verify materials, record certified scale weight and issue instant digital receipts.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'scheduled'
                ? 'bg-forest-800 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Weighing ({myOrders.filter(o => o.status === 'pickup_scheduled').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'completed'
                ? 'bg-forest-800 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Settled History ({myOrders.filter(o => o.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
          <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No Orders in this View</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filter === 'scheduled' 
              ? 'No pending doorstep pickups right now. Submit offers from the Nearby Scrap Feed!' 
              : 'Completed transactions will appear here with downloadable receipts.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const isCompleted = order.status === 'completed';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left: Seller & Material details */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {order.receiptNumber || order.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isCompleted ? 'bg-mint-100 text-forest-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {t.status[order.status] || order.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {order.sellerName} • <span className="capitalize font-semibold text-forest-900">{order.category.replace('_', ' ')} ({order.subcategory})</span>
                    </h3>

                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{order.sellerAddress}</span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-4 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Slot: <strong>{order.scheduledSlot}</strong>
                      </span>
                      <span>•</span>
                      <span>Agreed Rate: <strong>₹{order.agreedRatePerKg}/kg</strong></span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <a
                      href={`tel:${order.sellerPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Seller</span>
                    </a>

                    {!isCompleted ? (
                      <button
                        onClick={() => onOpenWeighing(order)}
                        className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-md shadow-forest-900/20 flex items-center gap-1.5 transition-colors"
                      >
                        <Scale className="w-4 h-4 text-emerald-400" />
                        <span>{t.actions.recordWeight}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="px-3.5 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-forest-200"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>{t.actions.viewReceipt}</span>
                      </button>
                    )}
                  </div>

                </div>

                {/* Completed Details pill */}
                {isCompleted && (
                  <div className="p-3 rounded-2xl bg-mint-50/70 border border-forest-100 flex items-center justify-between text-xs font-medium text-forest-900">
                    <span>Verified Net Scale Weight: <strong>{order.actualWeightKg} kg</strong></span>
                    <span className="font-mono font-bold text-sm">Settled: ₹{order.finalAmount} ({t.paymentStatus[order.paymentStatus]})</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

