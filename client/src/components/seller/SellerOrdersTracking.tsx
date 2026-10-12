import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Receipt, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  AlertCircle,
  FileCheck2,
  ChevronRight
} from 'lucide-react';

export const SellerOrdersTracking: React.FC = () => {
  const { orders, setSelectedReceiptOrder, currentUser, t, language } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Filter orders for the current seller
  const sellerOrders = orders.filter(o => o.sellerId === currentUser.id);

  const displayedOrders = sellerOrders.filter(o => {
    if (filter === 'active') return o.status === 'pickup_scheduled' || o.status === 'accepted';
    if (filter === 'completed') return o.status === 'completed';
    return true;
  });

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 1;
      case 'accepted': return 2;
      case 'pickup_scheduled': return 3;
      case 'completed': return 4;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  const steps = [
    { title: 'Requested', desc: 'Listing online' },
    { title: 'Offer Accepted', desc: 'Collector assigned' },
    { title: 'Pickup Scheduled', desc: 'En route' },
    { title: 'Weighed & Paid', desc: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            Doorstep Pickup Status
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {language === 'hi' ? 'पिकअप ट्रैकिंग एवं रसीदें' : 'Track Pickups & Digital Receipts'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status of your collector visits, scale verification and settlement vouchers.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {(['all', 'active', 'completed'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === mode
                  ? 'bg-white text-forest-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode === 'all' ? 'All Orders' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
          <Clock className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No Orders in this View</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you accept an offer from a collector, you can track their arrival and view weighing receipts right here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const stepIndex = getStatusStepIndex(order.status);
            const isCompleted = order.status === 'completed';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-6"
              >
                
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
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

                    <h3 className="text-base font-bold text-slate-900 mt-1 capitalize">
                      {order.category.replace('_', ' ')} • {order.subcategory}
                    </h3>

                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {order.scheduledSlot}
                      </span>
                      <span>•</span>
                      <span>Agreed: <strong>₹{order.agreedRatePerKg}/kg</strong></span>
                    </div>
                  </div>

                  {/* Right: Collector info */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-forest-800 text-white font-bold flex items-center justify-center shrink-0">
                      {order.buyerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        {order.buyerName}
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <a
                        href={`tel:${order.buyerPhone}`}
                        className="text-[11px] text-forest-800 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        {order.buyerPhone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Real-time Visual Status Stepper */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {steps.map((st, idx) => {
                      const stepNum = idx + 1;
                      const isPastOrCurrent = stepIndex >= stepNum;
                      const isCurrent = stepIndex === stepNum;

                      return (
                        <div key={idx} className="text-center relative">
                          <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-all ${
                            isPastOrCurrent
                              ? 'bg-forest-800 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-emerald-500/20 scale-105' : ''}`}>
                            {isPastOrCurrent ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                          </div>
                          <div className="text-xs font-bold text-slate-800 mt-2">
                            {st.title}
                          </div>
                          <div className="text-[10px] text-slate-400 hidden sm:block">
                            {st.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Details / Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    {isCompleted ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <FileCheck2 className="w-4 h-4" />
                        Settled: {order.actualWeightKg} kg • Final Total: ₹{order.finalAmount} ({t.paymentStatus[order.paymentStatus]})
                      </span>
                    ) : (
                      <span>Collector scheduled for doorstep weighing. Keep materials bundled for easy verification.</span>
                    )}
                  </div>

                  {isCompleted && (
                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.actions.viewReceipt}</span>
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

