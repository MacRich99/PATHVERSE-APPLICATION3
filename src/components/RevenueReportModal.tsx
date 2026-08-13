import React, { useState, useEffect } from 'react';
import { DollarSign, X, ShieldCheck, Download, RefreshCw, BarChart2, CheckCircle2, Smartphone, Gift, CreditCard } from 'lucide-react';
import { PaymentRecord } from '../types';

interface RevenueReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RevenueReportModal: React.FC<RevenueReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [reportData, setReportData] = useState<{
    summary: {
      totalRevenueUSD: number;
      cardRevenueUSD?: number;
      bundleRevenueUSD?: number;
      totalMbConverted?: number;
      totalTransactions: number;
      pricePerPath: number;
      conversionRate?: string;
      currency: string;
      breakdown?: {
        cardCount: number;
        dataBundleCount: number;
        freeModeSponsoredCount: number;
      };
      generatedAt: string;
    };
    payments: PaymentRecord[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchReport = () => {
    setLoading(true);
    fetch('/api/payments/report')
      .then((res) => res.json())
      .then((data) => setReportData(data))
      .catch((err) => console.error('Failed to fetch revenue report:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchReport();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    if (!reportData) return;
    const headers = ['Transaction ID', 'User ID', 'User Name', 'Email', 'Path Title', 'Method', 'Amount ($)', 'Timestamp', 'Status'];
    const rows = (reportData?.payments || []).map((p) => [
      p.id,
      p.userId,
      p.userName,
      p.userEmail,
      `"${p.pathTitle}"`,
      p.paymentMethod || 'card',
      p.amount,
      p.timestamp,
      p.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PathVerse_Revenue_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0D17]/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6 max-h-[90vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#0B0D17] border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-[#F2AF29]" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/40 flex items-center justify-center text-[#F2AF29] shrink-0 shadow-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#F2AF29] uppercase tracking-widest block">
              Monetization Evidence & Payment Ledger
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              PathVerse Revenue & Access Report
            </h3>
          </div>
        </div>

        {loading || !reportData ? (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#F2AF29] animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading payment ledger...</p>
          </div>
        ) : (
          <div className="space-y-6 overflow-y-auto pr-1">
            {/* Summary Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[#0B0D17] border border-white/5">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-1">
                  Total Revenue
                </span>
                <span className="text-2xl font-black text-[#F2AF29]">
                  ${reportData.summary.totalRevenueUSD.toFixed(2)}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">USD Converted Funds</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/30">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-1">
                  Data Converted Money
                </span>
                <span className="text-2xl font-black text-emerald-400">
                  ${(reportData.summary.bundleRevenueUSD || 0).toFixed(2)}
                </span>
                <span className="text-[9px] text-[#F2AF29] block mt-0.5 font-bold">
                  {reportData.summary.totalMbConverted || 0} MB Liquidated
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0D17] border border-white/5">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-1">
                  Completed Unlocks
                </span>
                <span className="text-2xl font-black text-white">
                  {reportData.summary.totalTransactions}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Total Accesses</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0D17] border border-white/5">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-1">
                  Payment Channels
                </span>
                <div className="text-[10px] font-bold text-slate-300 space-y-0.5 pt-0.5">
                  <div className="flex items-center justify-between">
                    <span>Card:</span>
                    <span className="text-white">{reportData.summary.breakdown?.cardCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Bundle:</span>
                    <span className="text-[#F2AF29]">{reportData.summary.breakdown?.dataBundleCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Free Mode:</span>
                    <span className="text-emerald-400">{reportData.summary.breakdown?.freeModeSponsoredCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Payment Ledger Audit Log
                </h4>

                <button
                  onClick={handleDownloadCSV}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0B0D17] border border-white/10 hover:border-white/20 text-[#F2AF29] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="bg-[#0B0D17] border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#1C1F37] border-b border-white/10 text-slate-400 uppercase text-[9px] font-bold tracking-widest">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Unlocked Path</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                    {(reportData?.payments || []).map((p) => {
                      const method = p.paymentMethod || 'card';
                      return (
                        <tr key={p.id} className="hover:bg-white/5">
                          <td className="p-3 font-sans">
                            <div className="font-semibold text-white">{p.userName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{p.userEmail}</div>
                          </td>
                          <td className="p-3 font-sans text-slate-300">
                            {p.pathTitle}
                          </td>
                          <td className="p-3 font-sans">
                            {method === 'data_bundle' ? (
                              <span className="px-2 py-0.5 rounded bg-[#F2AF29]/20 border border-[#F2AF29]/40 text-[#F2AF29] text-[9px] font-bold uppercase flex items-center gap-1 w-max">
                                <Smartphone className="w-3 h-3" />
                                <span>{p.bundleDetails?.provider || 'Mobile Data'} ({p.bundleDetails?.bundleMb || 100}MB)</span>
                              </span>
                            ) : method === 'free_mode_sponsored' ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] font-bold uppercase flex items-center gap-1 w-max">
                                <Gift className="w-3 h-3" />
                                <span>Free Mode</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[9px] font-bold uppercase flex items-center gap-1 w-max">
                                <CreditCard className="w-3 h-3" />
                                <span>Card</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-[#F2AF29] font-bold">
                            ${p.amount.toFixed(2)}
                          </td>
                          <td className="p-3 text-[10px] text-slate-500">
                            {new Date(p.timestamp).toLocaleDateString()} {new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F2AF29]" />
            <span>Audited Stripe, Mobile Data & Free Mode Revenue Ledger</span>
          </span>
          <button
            onClick={fetchReport}
            className="text-[#F2AF29] hover:underline text-xs flex items-center gap-1 cursor-pointer font-bold"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
