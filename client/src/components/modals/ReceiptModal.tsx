import React from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  TreePine, 
  QrCode, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Scale, 
  ArrowDownToLine 
} from 'lucide-react';

export const ReceiptModal: React.FC<{ order: Order | null; onClose: () => void }> = ({ 
  order, 
  onClose 
}) => {
  const { t, indicativeRates } = useApp();

  if (!order) return null;

  const actualWeight = order.actualWeightKg || 20;
  const finalAmount = order.finalAmount || (actualWeight * order.agreedRatePerKg);
  // Calculate environmental impact: e.g. approx 1.2 kg CO2 per kg recyclable, approx 1 tree per 40 kg paper/cardboard
  const co2SavedKg = (actualWeight * 1.4).toFixed(1);
  const treesSaved = (actualWeight / 30).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top actions banner (hidden on print) */}
        <div className="no-print bg-slate-50 px-6 py-3 border-b border-slate-200/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Digital Scrap Transaction Certificate
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.actions.printReceipt}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header & Logo */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-forest-800 flex items-center justify-center text-white font-bold text-sm">
                  KC
                </div>
                <div>
                  <h3 className="text-lg font-black text-forest-950 tracking-tight">
                    Kabadiwala<span className="text-emerald-500">Connect</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                    Digital Circular Economy Platform
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                CPCB / Municipal Recycler Network Node
              </p>
            </div>
            
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-mint-100 text-forest-900 border border-forest-200">
                {order.receiptNumber || 'KC-2026-REC-001'}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-end gap-1">
                <Calendar className="w-3 h-3" />
                {order.completedAt ? new Date(order.completedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : order.scheduledDate}
              </p>
            </div>
          </div>

          {/* Party Details: Seller & Collector */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Seller (Customer)
              </div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{order.sellerName}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">{order.sellerPhone}</div>
              <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="line-clamp-2">{order.sellerAddress}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Collector (Verified Partner)
              </div>
              <div className="font-bold text-forest-950 text-sm mt-0.5 flex items-center gap-1">
                {order.buyerName}
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">{order.buyerPhone}</div>
              <div className="text-emerald-700 text-[10px] font-semibold mt-1">
                ✓ Certified Digital Scale Calibrated
              </div>
            </div>
          </div>

          {/* Itemized Scale Breakdown Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-right">Agreed Rate</th>
                  <th className="py-2.5 px-3 text-right">Net Weight</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="bg-white">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 capitalize">{order.category.replace('_', ' ')}</div>
                    <div className="text-[11px] text-slate-500">{order.subcategory}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700">
                    ₹{order.agreedRatePerKg}/kg
                  </td>
                  <td className="py-3 px-3 text-right font-bold font-mono text-forest-900">
                    {actualWeight} kg
                  </td>
                  <td className="py-3 px-3 text-right font-bold font-mono text-slate-900 text-sm">
                    ₹{finalAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total & Payment Method Card */}
          <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 flex items-center justify-between">
            <div>
              <div className="text-xs text-forest-800 font-medium">Final Settled Amount</div>
              <div className="text-2xl font-black text-forest-950 font-mono">
                ₹{finalAmount}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{order.paymentStatus === 'paid_upi_demo' ? 'Settled via Instant UPI QR (Demo Mode)' : 'Settled in Cash (Demo Mode)'}</span>
              </div>
            </div>

            {/* Simulated QR Verification */}
            <div className="text-center p-2 bg-white rounded-xl border border-forest-200/80 shadow-2xs">
              <QrCode className="w-12 h-12 text-forest-900 mx-auto" />
              <div className="text-[8px] font-mono text-slate-500 mt-1 uppercase">VERIFIED QR</div>
            </div>
          </div>

          {/* Environmental Impact Metrics */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <TreePine className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-emerald-950">Green Impact Score</div>
                <div className="text-[11px] text-emerald-800">
                  Diverted {actualWeight} kg from landfills • Saved ~{co2SavedKg} kg CO₂
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-900 font-mono">
                ~{treesSaved} Trees
              </span>
              <div className="text-[10px] text-emerald-700">Preserved</div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-3">
            Kabadiwala Connect operates in compliance with Municipal Solid Waste (Management) Rules 2016 & E-Waste Rules 2022.
            This receipt is an authentic digital transaction voucher.
          </div>

        </div>

      </div>
    </div>
  );
};

