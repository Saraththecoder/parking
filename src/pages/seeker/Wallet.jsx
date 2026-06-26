import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RevenueChart } from '../../components/Charts';
import Modal from '../../components/Modal';
import { Landmark, Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, Landmark as BankIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Wallet = () => {
  const { currentUser, transactions, addMoneyToWallet } = useApp();
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [fundsAmount, setFundsAmount] = useState('500');

  // Filter transactions for current user
  const userTx = transactions.filter(t => t.userId === currentUser.id);

  const handleAddFunds = (e) => {
    e.preventDefault();
    const parsed = parseFloat(fundsAmount);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    addMoneyToWallet(parsed);
    setAddFundsOpen(false);
  };

  // Convert transactions to chart format: cumulative balance simulation
  const getChartData = () => {
    let balance = currentUser.walletBalance;
    const chartPoints = [];
    
    // We reverse transactions to compute chronologically, then reverse again
    const sortedTx = [...userTx].reverse();
    
    // Base starting point
    chartPoints.push({ name: 'Start', value: Math.max(0, balance - sortedTx.reduce((sum, tx) => sum + tx.amount, 0)) });
    
    let current = chartPoints[0].value;
    sortedTx.forEach((tx, idx) => {
      current += tx.amount;
      chartPoints.push({
        name: tx.date.split(',')[0], // Day
        value: current
      });
    });

    // Limit to last 6 points for cleaner graph
    return chartPoints.slice(-6);
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6 text-left pb-16">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Wallet</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your funds and transactions</p>
        </div>
        
        <button
          onClick={() => setAddFundsOpen(true)}
          className="px-4 py-2.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} /> Add Funds
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Card (Virtual Card style) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-premium flex flex-col justify-between h-[200px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Virtual Balance Card</p>
              <h2 className="text-3xl font-extrabold mt-1.5">₹{currentUser.walletBalance.toLocaleString('en-IN')}</h2>
            </div>
            <span className="text-base font-bold text-parkgreen italic">Plantopark</span>
          </div>

          <div>
            <p className="text-[9px] text-slate-500 font-mono tracking-widest">CARD HOLDER</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs font-bold tracking-wider">{currentUser.name.toUpperCase()}</span>
              <span className="text-[10px] text-slate-400 font-mono">•••• 9876</span>
            </div>
          </div>
        </div>

        {/* Analytics spending Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Balance History</h3>
          <RevenueChart data={chartData} height={140} color="#16A34A" />
        </div>

      </div>

      {/* Transaction History log */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-5">Transaction History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-medium text-slate-500 text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] font-bold">
                <th className="pb-3.5 pl-2">Description</th>
                <th className="pb-3.5">Method</th>
                <th className="pb-3.5">Date</th>
                <th className="pb-3.5 text-right pr-2">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userTx.map((tx) => {
                const isDeposit = tx.type === 'deposit' || tx.type === 'earnings';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pl-2 flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isDeposit ? 'bg-green-50 text-parkgreen' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isDeposit ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      </div>
                      <span className="font-bold text-slate-800 truncate max-w-xs">{tx.description}</span>
                    </td>
                    <td className="py-3.5 text-slate-500">{tx.method}</td>
                    <td className="py-3.5 text-slate-400">{tx.date}</td>
                    <td className={`py-3.5 text-right pr-2 font-bold ${
                      isDeposit ? 'text-parkgreen' : 'text-slate-800'
                    }`}>
                      {isDeposit ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                    </td>
                  </tr>
                );
              })}

              {userTx.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400">No transaction logs available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Funds Modal */}
      <Modal isOpen={addFundsOpen} onClose={() => setAddFundsOpen(false)} title="Add Money to Wallet">
        <form onSubmit={handleAddFunds} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Amount (INR)</label>
            <div className="grid grid-cols-3 gap-2">
              {['200', '500', '1000'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setFundsAmount(amt)}
                  className={`py-2 text-sm font-bold rounded-xl border transition-all ${
                    fundsAmount === amt
                      ? 'border-parkgreen bg-green-50 text-parkgreen font-semibold'
                      : 'border-slate-200 text-slate-500 hover:border-slate-350'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Custom Amount (₹)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={fundsAmount}
                onChange={(e) => setFundsAmount(e.target.value)}
                min="50"
                required
                className="pl-7 w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-250 focus:border-parkgreen rounded-xl text-sm outline-none transition-colors"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAddFundsOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Add ₹{fundsAmount}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Wallet;
