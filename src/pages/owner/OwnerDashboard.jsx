import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RevenueChart } from '../../components/Charts';
import Badge from '../../components/Badge';
import { IndianRupee, Percent, CalendarRange, Eye, SwitchCamera, ShieldCheck, Check, X, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, spaces, bookings, toggleSpaceAvailability, approveBooking, cancelBooking, completeBooking } = useApp();

  // Filter listings belonging to this host
  const hostSpaces = spaces.filter(s => s.hostId === currentUser.id);
  const hostBookings = bookings.filter(b => b.hostId === currentUser.id);

  // Compute stats
  const totalEarnings = hostBookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + (b.subtotal * 0.9), 0);
  const activeBookingsCount = hostBookings.filter(b => b.status === 'Active').length;
  const pendingRequests = hostBookings.filter(b => b.status === 'Pending');

  // Chart data: Simulated monthly earnings
  const chartData = [
    { name: 'May 2026', value: totalEarnings * 0.4 },
    { name: 'Jun 2026', value: totalEarnings }
  ];

  return (
    <div className="space-y-6 text-left pb-16">
      
      {/* Greetings */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Host Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your parking slots and passenger bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Host Earnings</p>
              <h2 className="text-2xl font-extrabold mt-1">₹{totalEarnings.toLocaleString('en-IN')}</h2>
            </div>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-parkgreen shrink-0"><IndianRupee size={16} /></div>
          </div>
          <p className="text-[10px] text-slate-450 mt-3 font-semibold">After 10% platform commission split</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Occupancy Rate</p>
              <h2 className="text-2xl font-extrabold mt-1">{hostSpaces.length > 0 ? '78%' : '0%'}</h2>
            </div>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-info shrink-0"><Percent size={16} /></div>
          </div>
          <p className="text-[10px] text-slate-450 mt-3 font-semibold">Average occupancy this month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Bookings</p>
              <h2 className="text-2xl font-extrabold mt-1">{activeBookingsCount} active</h2>
            </div>
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-warning shrink-0"><CalendarRange size={16} /></div>
          </div>
          <p className="text-[10px] text-slate-450 mt-3 font-semibold">Cars parked on your slots right now</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Chart & Spaces List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earnings chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue Analytics</h3>
            <RevenueChart data={chartData} height={180} />
          </div>

          {/* Spaces listing overview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Listed Spaces ({hostSpaces.length})</h3>
              <Link to="/owner/add" className="text-xs font-bold text-parkgreen hover:underline">Add New Spot</Link>
            </div>

            <div className="divide-y divide-slate-100">
              {hostSpaces.map((space) => (
                <div key={space.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img src={space.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{space.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">₹{space.price}/hr | {space.parkingType}</p>
                    </div>
                  </div>
                  
                  {/* Status & Availability Switch toggle */}
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-bold ${space.isDisabled ? 'text-slate-400' : 'text-parkgreen'}`}>
                      {space.isDisabled ? 'Suspended' : 'Online'}
                    </span>
                    <button
                      onClick={() => toggleSpaceAvailability(space.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        space.isDisabled ? 'bg-slate-250' : 'bg-parkgreen'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
                          space.isDisabled ? 'translate-x-0' : 'translate-x-4'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}

              {hostSpaces.length === 0 && (
                <p className="text-xs text-slate-450 py-6 text-center">You have not listed any spaces yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Pending booking requests */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting Action ({pendingRequests.length})</h3>

            <div className="space-y-4">
              {pendingRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-150 space-y-3 bg-slate-50/50">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-850 truncate max-w-[130px]">{req.spaceName}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{req.date} | {req.startTime}</p>
                    </div>
                    <span className="font-bold text-xs text-slate-800">₹{req.totalAmount.toFixed(0)}</span>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-slate-150 text-[10px] text-slate-600 font-medium">
                    Car: <strong className="text-slate-800">{req.vehicleNumber}</strong> ({req.seekerName.split(' ')[0]})
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => cancelBooking(req.id, "Rejected by Host")}
                      className="flex-1 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <X size={12} /> Reject
                    </button>
                    <button
                      onClick={() => approveBooking(req.id)}
                      className="flex-1 py-1.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Check size={12} /> Approve
                    </button>
                  </div>
                </div>
              ))}

              {pendingRequests.length === 0 && (
                <p className="text-xs text-slate-450 py-10 text-center">No pending space booking requests.</p>
              )}
            </div>
          </div>

          {/* Active Bookings that owners can complete */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Reservations</h3>
            
            <div className="space-y-3">
              {hostBookings.filter(b => b.status === 'Active').map((b) => (
                <div key={b.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800 truncate max-w-[130px]">{b.spaceName}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{b.vehicleNumber} | {b.slot}</p>
                  </div>
                  <button
                    onClick={() => completeBooking(b.id)}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-black text-white text-[10px] font-bold rounded-lg transition-all"
                  >
                    Complete
                  </button>
                </div>
              ))}

              {hostBookings.filter(b => b.status === 'Active').length === 0 && (
                <p className="text-xs text-slate-450 py-6 text-center">No active vehicles parked.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default OwnerDashboard;
