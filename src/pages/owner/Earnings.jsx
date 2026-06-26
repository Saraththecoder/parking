import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RevenueChart } from '../../components/Charts';
import Modal from '../../components/Modal';
import { Landmark, ArrowUpRight, ArrowDownLeft, Plus, DollarSign, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

const Earnings = () => {
  const { currentUser, transactions, withdrawFunds } = useApp();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('500');

  // Filter transactions for this host
  const hostTx = transactions.filter(t => t.userId === currentUser.id);

  // Compute stats
  const totalWithdrawn = hostTx.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalEarnings = hostTx.filter(t => t.type === 'earnings').reduce((sum, t) => sum + t.amount, 0);

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(withdrawAmount);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    const success = withdrawFunds(parsed);
    if (success) {
      setWithdrawOpen(false);
    }
  };

  // Convert earnings transaction to chart format
  const getChartData = () => {
    const chartPoints = [];
    const sortedTx = [...hostTx].filter(t => t.type === 'earnings').reverse();
    
    chartPoints.push({ name: 'Start', value: 0 });
    
    let current = 0;
    sortedTx.forEach((tx) => {
      current += tx.amount;
      chartPoints.push({
        name: tx.date.split(',')[0],
        value: current
      });
    });

    return chartPoints.slice(-6);
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6 text-left pb-16">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Earnings Tracker</h1>
          <p className="text-xs text-slate-500 mt-1">Review payouts, verify revenue, and request bank withdrawals</p>
        </div>

        <button
          onClick={() => setWithdrawOpen(true)}
          className="px-4 py-2.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Landmark size={14} /> Withdraw to Bank
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Statistics cards */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Withdrawable Balance</p>
            <h2 className="text-2xl font-black text-slate-800 mt-1">₹{currentUser.walletBalance.toLocaleString('en-IN')}</h2>
            <div className="border-t border-slate-100 my-3" />
            <p className="text-[10px] text-slate-450 font-medium">Ready for immediate transfer.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Withdrawn to Bank</p>
            <h2 className="text-2xl font-black text-slate-800 mt-1">₹{totalWithdrawn.toLocaleString('en-IN')}</h2>
            <div className="border-t border-slate-100 my-3" />
            <p className="text-[10px] text-slate-450 font-medium">Sent to your HDFC bank account.</p>
          </div>
        </div>

        {/* Analytics spending Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cumulative Income</h3>
          <RevenueChart data={chartData.length > 1 ? chartData : [{ name: 'A', value: 0 }, { name: 'B', value: totalEarnings }]} height={140} color="#16A34A" />
        </div>

      </div>

      {/* Host transaction history table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-5">Transactions & Payouts</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-medium text-slate-505 text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] font-bold">
                <th className="pb-3.5 pl-2">Description</th>
                <th className="pb-3.5">Method</th>
                <th className="pb-3.5">Date</th>
                <th className="pb-3.5 text-right pr-2">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hostTx.map((tx) => {
                const isEarn = tx.type === 'earnings';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pl-2 flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isEarn ? 'bg-green-50 text-parkgreen' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isEarn ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      </div>
                      <span className="font-bold text-slate-800 truncate max-w-xs">{tx.description}</span>
                    </td>
                    <td className="py-3.5 text-slate-500">{tx.method}</td>
                    <td className="py-3.5 text-slate-400">{tx.date}</td>
                    <td className={`py-3.5 text-right pr-2 font-bold ${
                      isEarn ? 'text-parkgreen' : 'text-slate-800'
                    }`}>
                      {isEarn ? `+₹${tx.amount.toFixed(0)}` : `-₹${Math.abs(tx.amount).toFixed(0)}`}
                    </td>
                  </tr>
                );
              })}

              {hostTx.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400">No transaction logs available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal popup */}
      <Modal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} title="Withdraw Funds to Bank">
        <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-left">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs font-semibold text-slate-700 flex items-center gap-3">
            <Landmark size={18} className="text-slate-500 shrink-0" />
            <div>
              <p className="text-slate-800 font-bold">HDFC Bank India</p>
              <p className="text-[10px] text-slate-450 mt-0.5">Account ending in •••• 1234</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Withdrawable Amount (₹)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="100"
                max={currentUser.walletBalance}
                required
                className="pl-7 w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-250 focus:border-parkgreen rounded-xl text-sm font-bold outline-none"
                placeholder="Enter amount"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Available balance: ₹{currentUser.walletBalance.toLocaleString('en-IN')}</p>
          </div>

          <div className="border-t border-slate-105 pt-4 mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setWithdrawOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-605 text-xs font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Request Payout
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Earnings;
