import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import MapPlaceholder from '../../components/MapPlaceholder';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { Search, Car, HelpCircle, ArrowRight, Share2, Wallet, Plus, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, spaces, bookings, transactions, addMoneyToWallet } = useApp();
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [fundsAmount, setFundsAmount] = useState('500');

  // Filter local Hyderabad/Bangalore spaces depending on city
  const localSpaces = spaces.filter(s => s.city === 'Hyderabad' || s.city === 'Bangalore').slice(0, 2);

  // Active bookings seeker
  const activeBooking = bookings.find(b => b.seekerId === currentUser.id && (b.status === 'Active' || b.status === 'Pending'));

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

  const handleShareLink = () => {
    navigator.clipboard.writeText("https://plantopark.in/invite/arjun-malhotra");
    toast.success("Referral link copied to clipboard!");
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Good morning, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-sm text-slate-500 mt-1">Your city is busy today. We've secured your spot.</p>
        </div>
      </div>

      {/* Main Core Layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Active Booking & Map Spots */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Booking Card (Simulating Hitech City in screenshot) */}
          {activeBooking ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-200 shrink-0">
                  <span className="text-lg font-bold text-parkgreen">P</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{activeBooking.spaceName}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase font-mono tracking-wider">{activeBooking.vehicleNumber}</span>
                    <span>•</span>
                    <span>{activeBooking.slot}</span>
                    <span>•</span>
                    <span>{activeBooking.startTime} departure</span>
                  </div>
                </div>
              </div>
              <Badge status={activeBooking.status === 'Active' ? 'IN PROGRESS' : 'PENDING'} />
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft text-center py-8">
              <p className="text-slate-400 text-sm">No active reservations at the moment.</p>
              <Link
                to="/seeker/search"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-parkgreen hover:underline mt-2.5"
              >
                Find a parking spot now <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Nearby Spots Container */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Nearby Spots</h2>
              <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">3 found</span>
            </div>

            {/* SVG Perspective Map Placeholder */}
            <MapPlaceholder variant="dashboard" />

            {/* Local Spaces Card List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localSpaces.map((space) => (
                <div key={space.id} className="border border-slate-200 rounded-2xl p-4 hover:border-parkgreen hover:shadow-soft transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                      <img src={space.images[0]} alt={space.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 right-2.5 bg-slate-950/80 text-white font-bold text-xs px-2 py-0.5 rounded border border-slate-700">₹{space.price}/hr</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm truncate">{space.name}</h4>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-0.5 text-amber-500"><Star size={12} className="fill-amber-500" /> {space.rating}</span>
                      <span>•</span>
                      <span>{space.distance}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/seeker/parking/${space.id}`)}
                    className="w-full py-2.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm mt-4 cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Wallet Card & Quick Actions */}
        <div className="space-y-6">
          
          {/* Wallet Balance Card */}
          <div className="bg-parkgreen text-white p-6 rounded-2xl border border-green-700 shadow-soft relative overflow-hidden flex flex-col justify-between h-[155px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-green-200 font-bold uppercase tracking-wider">Wallet Balance</p>
                <h2 className="text-3xl font-extrabold mt-1.5">₹{currentUser.walletBalance.toLocaleString('en-IN')}</h2>
              </div>
              <Wallet size={20} className="text-green-200" />
            </div>
            <button
              onClick={() => setAddFundsOpen(true)}
              className="text-left text-xs font-bold text-white hover:text-green-150 transition-colors flex items-center gap-1.5 cursor-pointer self-start"
            >
              Add Funds &rsaquo;
            </button>
          </div>

          {/* Quick Actions List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/seeker/search" className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all group">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-parkgreen shrink-0 group-hover:scale-105 transition-transform"><Search size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Find Parking</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Nearby or at destination</p>
                </div>
              </Link>
              <Link to="/seeker/profile" className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all group">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-info shrink-0 group-hover:scale-105 transition-transform"><Car size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">My Vehicles</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Manage {(currentUser.vehicles || []).length} vehicles</p>
                </div>
              </Link>
              <a href="#" className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all group">
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-warning shrink-0 group-hover:scale-105 transition-transform"><HelpCircle size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Support Desk</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">24/7 help desk hotline</p>
                </div>
              </a>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
              <Link to="/seeker/wallet" className="text-[10px] font-bold text-parkgreen hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {transactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-start gap-3.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${tx.type === 'deposit' || tx.type === 'earnings' ? 'bg-parkgreen' : 'bg-slate-300'}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{tx.description}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{tx.date} • {tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite & Earn gold block */}
          <div className="bg-yellow-950 text-amber-200 p-6 rounded-2xl border border-amber-900 shadow-soft relative overflow-hidden flex flex-col justify-between h-[155px]">
            <div className="max-w-[80%]">
              <h3 className="font-extrabold text-sm text-white">Invite & Earn</h3>
              <p className="text-[10px] text-amber-300 mt-1 leading-relaxed">
                Refer a friend and get 10% off your next 3 bookings.
              </p>
            </div>
            <button
              onClick={handleShareLink}
              className="px-3.5 py-1.5 bg-white text-yellow-950 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm self-start flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 size={12} />
              <span>Share Link</span>
            </button>
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 font-mono text-8xl font-black">🎁</div>
          </div>

        </div>

      </div>

      {/* Add Funds Modal Dialog */}
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
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
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
              className="px-5 py-2 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add ₹{fundsAmount}</span>
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Dashboard;
