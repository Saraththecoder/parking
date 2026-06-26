import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/Badge';
import { Calendar, Clock, Car, User, Check, X, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const OwnerBookings = () => {
  const { bookings, currentUser, approveBooking, cancelBooking, completeBooking } = useApp();
  const [activeTab, setActiveTab] = useState('pending'); // pending, active, completed, cancelled

  // Filter bookings belonging to spaces owned by this user
  const hostBookings = bookings.filter(b => b.hostId === currentUser.id);

  const getFiltered = () => {
    switch (activeTab) {
      case 'pending':
        return hostBookings.filter(b => b.status === 'Pending');
      case 'active':
        return hostBookings.filter(b => b.status === 'Active');
      case 'completed':
        return hostBookings.filter(b => b.status === 'Completed');
      case 'cancelled':
        return hostBookings.filter(b => b.status === 'Cancelled');
      default:
        return hostBookings;
    }
  };

  const filtered = getFiltered();

  return (
    <div className="space-y-6 text-left pb-16">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Bookings</h1>
        <p className="text-xs text-slate-500 mt-1">Approve, verify, and complete visitor parking bookings</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 select-none">
        {['pending', 'active', 'completed', 'cancelled'].map((tab) => {
          const count = tab === 'pending'
            ? hostBookings.filter(b => b.status === 'Pending').length
            : tab === 'active'
              ? hostBookings.filter(b => b.status === 'Active').length
              : 0;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-bold capitalize border-b-2 transition-all -mb-px flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'border-parkgreen text-slate-900 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-650'
              }`}
            >
              <span>{tab === 'active' ? 'Currently Parked' : tab}</span>
              {count > 0 && (
                <span className="bg-green-150 text-parkgreen-dark text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Booking Requests List */}
      <div className="space-y-4">
        {filtered.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft flex flex-col md:flex-row justify-between gap-5"
          >
            {/* Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">{booking.spaceName}</h3>
                <p className="text-[10px] text-slate-450 mt-1 uppercase font-bold">Booking ID: {booking.id} • Allocated Spot: <span className="text-slate-800 font-extrabold">{booking.slot}</span></p>
              </div>

              <div className="border-t border-slate-100 my-2" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-500">
                <div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Driver / Seeker</p>
                  <p className="text-slate-850 font-bold mt-1 flex items-center gap-1"><User size={12} className="text-slate-400" /> {booking.seekerName}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Vehicle number</p>
                  <p className="text-slate-850 font-bold mt-1 flex items-center gap-1"><Car size={12} className="text-slate-400" /> {booking.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider font-mono">Date</p>
                  <p className="text-slate-850 font-bold mt-1 flex items-center gap-1"><Calendar size={12} className="text-slate-400" /> {booking.date}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Time Window</p>
                  <p className="text-slate-850 font-bold mt-1 flex items-center gap-1"><Clock size={12} className="text-slate-400" /> {booking.startTime} - {booking.endTime}</p>
                </div>
              </div>
            </div>

            {/* Payout & Actions */}
            <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3.5 shrink-0 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
              <div className="text-left md:text-right">
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Owner Payout</p>
                <p className="text-sm font-black text-parkgreen mt-0.5">₹{(booking.subtotal * 0.90).toFixed(0)}</p>
                <div className="mt-1"><Badge status={booking.status} /></div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {booking.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => cancelBooking(booking.id, "Rejected by space host")}
                      className="flex items-center gap-1 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-all"
                    >
                      <X size={12} /> Reject
                    </button>
                    <button
                      onClick={() => approveBooking(booking.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      <Check size={12} /> Approve
                    </button>
                  </>
                )}
                {booking.status === 'Active' && (
                  <button
                    onClick={() => completeBooking(booking.id)}
                    className="flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Complete Booking
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-400 border border-dashed border-slate-200 bg-white rounded-3xl">
            <ShieldAlert size={36} className="mx-auto text-slate-300" />
            <p className="font-bold text-slate-600 mt-4">No bookings found</p>
            <p className="text-xs mt-1 text-slate-400">There are no client bookings under the "{activeTab}" category.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default OwnerBookings;
