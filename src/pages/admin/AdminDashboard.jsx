import React from 'react';
import { useApp } from '../../context/AppContext';
import { RevenueChart, CategoryChart } from '../../components/Charts';
import Badge from '../../components/Badge';
import { Users, Building, ShieldAlert, IndianRupee, Check, X, FileBarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { spaces, bookings, users, verifyParkingSpace } = useApp();

  // Compute platform metrics
  const totalPlatformBookings = bookings.length;
  const activeSpaces = spaces.length;
  const totalUsers = users.length;
  
  const platformRevenueTotal = bookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.subtotal, 0);
  const platformCommissionTotal = platformRevenueTotal * 0.10; // 10% Platform fee

  // Verification queue (spaces that are not verified yet)
  const pendingVerifications = spaces.filter(s => !s.isVerified);

  // Category breakdown calculation for Pie Chart
  const residentialCount = spaces.filter(s => s.parkingType === 'Residential').length;
  const commercialCount = spaces.filter(s => s.parkingType === 'Commercial').length;
  const totalCategories = residentialCount + commercialCount;
  const categoryData = [
    { name: 'Residential', value: totalCategories > 0 ? Math.round((residentialCount / totalCategories) * 100) : 50 },
    { name: 'Commercial', value: totalCategories > 0 ? Math.round((commercialCount / totalCategories) * 100) : 50 }
  ];

  // Booking history area chart data
  const revenueHistory = [
    { name: 'May 2026', value: 12000 },
    { name: 'June 2026', value: platformRevenueTotal > 0 ? platformRevenueTotal : 34000 }
  ];

  return (
    <div className="space-y-6 text-left pb-16">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Admin Panel</h1>
        <p className="text-xs text-slate-500 mt-1">Review operational metrics, verify slots, and track revenue split</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Platform Revenue</p>
              <h2 className="text-2xl font-black mt-1.5 text-slate-800">₹{platformRevenueTotal.toLocaleString('en-IN')}</h2>
            </div>
            <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center shrink-0"><IndianRupee size={16} /></div>
          </div>
          <p className="text-[10px] text-slate-450 mt-3 font-semibold">Total driver bookings processed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Platform Commission (10%)</p>
              <h2 className="text-2xl font-black mt-1.5 text-parkgreen">₹{platformCommissionTotal.toLocaleString('en-IN')}</h2>
            </div>
            <div className="w-8 h-8 bg-green-50 text-parkgreen rounded-lg flex items-center justify-center shrink-0"><FileBarChart2 size={16} /></div>
          </div>
          <p className="text-[10px] text-slate-450 mt-3 font-semibold">Earned net platform commission</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Spaces</p>
              <h2 className="text-2xl font-black mt-1.5 text-slate-800">{activeSpaces} listed</h2>
            </div>
            <div className="w-8 h-8 bg-blue-50 text-info rounded-lg flex items-center justify-center shrink-0"><Building size={16} /></div>
          </div>
          <p className="text-[10px] text-slate-450 mt-3 font-semibold">Listed parking spots total</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registered Users</p>
              <h2 className="text-2xl font-black mt-1.5 text-slate-800">{totalUsers} users</h2>
            </div>
            <div className="w-8 h-8 bg-amber-50 text-warning rounded-lg flex items-center justify-center shrink-0"><Users size={16} /></div>
          </div>
          <p className="text-[10px] text-slate-450 mt-3 font-semibold">Drivers and hosts total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-soft space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue History</h3>
              <RevenueChart data={revenueHistory} height={140} color="#16A34A" />
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-soft space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Space Categories Split</h3>
              <CategoryChart data={categoryData} height={140} />
            </div>
          </div>

          {/* Verification Queue listings */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verification Queue ({pendingVerifications.length})</h3>
            
            <div className="divide-y divide-slate-100">
              {pendingVerifications.map((space) => (
                <div key={space.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img src={space.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{space.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">{space.address}</p>
                      <p className="text-[9px] text-slate-450 mt-0.5">Listed by: {space.hostName}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => verifyParkingSpace(space.id, false)}
                      className="p-1.5 border border-red-200 text-red-650 hover:bg-red-50 rounded-lg transition-colors"
                      title="Reject Space"
                    >
                      <X size={14} />
                    </button>
                    <button
                      onClick={() => verifyParkingSpace(space.id, true)}
                      className="px-3.5 py-1.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <Check size={12} /> Verify
                    </button>
                  </div>
                </div>
              ))}

              {pendingVerifications.length === 0 && (
                <p className="text-xs text-slate-450 py-10 text-center">No listings awaiting verification approvals.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: System Notifications & Activity log */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Operations Log</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-800">Verification Pending</span>
                <p className="text-[10px] text-slate-400 leading-normal">Host Arjun Malaga submitted 'Jubilee Hills Driveway'</p>
                <p className="text-[9px] text-slate-400 mt-1.5">3 mins ago</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-850">IMPS Withdrawal processed</span>
                <p className="text-[10px] text-slate-400 leading-normal">Owner Rajesh withdrew ₹14,000</p>
                <p className="text-[9px] text-slate-400 mt-1.5">1 hour ago</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-850">System Checkup</span>
                <p className="text-[10px] text-slate-400 leading-normal">All servers, mapping APIs and wallets operational.</p>
                <p className="text-[9px] text-slate-450 mt-1.5">Today, 09:00 AM</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
