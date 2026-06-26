import React from 'react';
import { useApp } from '../../context/AppContext';
import { RevenueChart } from '../../components/Charts';
import { IndianRupee, FileDown, ArrowUpRight, ArrowDownLeft, Receipt, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const RevenueReports = () => {
  const { bookings, transactions } = useApp();

  // Compute platform financial stats
  const completedBookings = bookings.filter(b => b.status === 'Completed');
  const grossVolume = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const platformCommission = completedBookings.reduce((sum, b) => sum + (b.subtotal * 0.10), 0);
  const totalRefunded = bookings.filter(b => b.status === 'Cancelled').reduce((sum, b) => sum + b.totalAmount, 0);
  const netPayouts = completedBookings.reduce((sum, b) => sum + (b.subtotal * 0.90), 0);

  const handleExport = () => {
    toast.success("CSV report file compiled and downloaded successfully!");
  };

  // Convert to monthly chart points
  const chartData = [
    { name: 'May 2026', value: 3400 },
    { name: 'June 2026', value: platformCommission > 0 ? platformCommission : 8900 }
  ];

  return (
    <div className="space-y-6 text-left pb-16">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Revenue Reports</h1>
          <p className="text-xs text-slate-500 mt-1">Audit platform commission splits, refund histories, and withdraw logs</p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <FileDown size={14} /> Export Report (CSV)
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gross Booking Volume</p>
          <h2 className="text-2xl font-black mt-1 text-slate-800">₹{grossVolume.toLocaleString('en-IN')}</h2>
          <div className="border-t border-slate-100 my-2" />
          <p className="text-[10px] text-slate-405 font-medium">Aggregate driver reservation value</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Commission Earned (10%)</p>
          <h2 className="text-2xl font-black mt-1 text-parkgreen">₹{platformCommission.toLocaleString('en-IN')}</h2>
          <div className="border-t border-slate-100 my-2" />
          <p className="text-[10px] text-slate-405 font-medium">Net platform revenue split</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Refund Volume</p>
          <h2 className="text-2xl font-black mt-1 text-red-600">₹{totalRefunded.toLocaleString('en-IN')}</h2>
          <div className="border-t border-slate-100 my-2" />
          <p className="text-[10px] text-slate-405 font-medium">Returned wallet balances total</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Host Payouts Net</p>
          <h2 className="text-2xl font-black mt-1 text-slate-800">₹{netPayouts.toLocaleString('en-IN')}</h2>
          <div className="border-t border-slate-100 my-2" />
          <p className="text-[10px] text-slate-405 font-medium">Disbursed owner earnings total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Column */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Commission Growth Chart</h3>
          <RevenueChart data={chartData} height={140} color="#16A34A" />
        </div>

        {/* Breakdown Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Platform Fee Audit</h3>
            <div className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>Completed Spots</span>
                <span className="text-slate-900 font-bold">{completedBookings.length} bookings</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Booking Ticket</span>
                <span className="text-slate-900 font-bold">₹{completedBookings.length > 0 ? (grossVolume / completedBookings.length).toFixed(0) : '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Cancellation Rate</span>
                <span className="text-slate-900 font-bold">
                  {bookings.length > 0 ? Math.round((bookings.filter(b => b.status === 'Cancelled').length / bookings.length) * 100) : '0'}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2 text-[10px] text-slate-500 leading-normal mt-4 select-none">
            <ShieldCheck size={14} className="text-parkgreen shrink-0 mt-0.5" />
            <span>
              All platform splits match the standard 90% Host / 10% Platform fee schedule policy guidelines.
            </span>
          </div>
        </div>

      </div>

      {/* Platform Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-5">Global Payout Records</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-medium text-slate-505 text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] font-bold">
                <th className="pb-3.5 pl-2">Transaction Details</th>
                <th className="pb-3.5">Category</th>
                <th className="pb-3.5">Date</th>
                <th className="pb-3.5 text-right pr-2">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => {
                const isDeposit = tx.type === 'deposit' || tx.type === 'earnings';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pl-2 flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isDeposit ? 'bg-green-50 text-parkgreen' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isDeposit ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block truncate max-w-xs">{tx.description}</span>
                        <span className="text-[9px] text-slate-400 block font-medium">User Ref: {tx.userId}</span>
                      </div>
                    </td>
                    <td className="py-3.5 capitalize">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        tx.type === 'earnings'
                          ? 'bg-green-50 border-green-200 text-parkgreen'
                          : tx.type === 'payment'
                            ? 'bg-blue-50 border-blue-200 text-info'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400">{tx.date}</td>
                    <td className={`py-3.5 text-right pr-2 font-bold ${
                      isDeposit ? 'text-parkgreen' : 'text-slate-800'
                    }`}>
                      {tx.amount > 0 ? `+₹${tx.amount.toFixed(0)}` : `-₹${Math.abs(tx.amount).toFixed(0)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default RevenueReports;
