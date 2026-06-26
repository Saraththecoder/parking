import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/Badge';
import { Search, History, HelpCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingManagement = () => {
  const { bookings, cancelBooking } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleAdminCancel = (bookingId) => {
    if (window.confirm(`Are you sure you want to cancel booking ${bookingId} and issue a full refund to the seeker's wallet?`)) {
      cancelBooking(bookingId, "Cancelled by Admin");
    }
  };

  const getFilteredBookings = () => {
    return bookings.filter(b => {
      const matchSearch = b.spaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.seekerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.hostName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'All' ? true : b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  };

  const filtered = getFilteredBookings();

  return (
    <div className="space-y-6 text-left pb-16">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Booking Management</h1>
        <p className="text-xs text-slate-500 mt-1">Monitor passenger bookings history and trigger refund cancellations</p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row justify-between gap-4 select-none">
        <div className="flex-grow max-w-md flex items-center gap-2 border border-slate-250 rounded-xl px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:border-parkgreen transition-colors">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent"
            placeholder="Search bookings by spot name, host, or driver..."
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-250 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-medium text-slate-505 text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] font-bold">
                <th className="py-4 pl-6">Booking details</th>
                <th className="py-4">Commuter / Seeker</th>
                <th className="py-4">Host / Space Owner</th>
                <th className="py-4">Date & Time</th>
                <th className="py-4">Total Amount</th>
                <th className="py-4">Status</th>
                <th className="py-4 text-right pr-6">Refund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pl-6">
                    <p className="font-extrabold text-slate-800 text-sm leading-none">{booking.spaceName}</p>
                    <p className="text-[10px] text-slate-400 mt-1">ID: {booking.id} | Slot: {booking.slot}</p>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-slate-850">{booking.seekerName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Car: {booking.vehicleNumber}</p>
                  </td>
                  <td className="py-4 font-semibold text-slate-700">{booking.hostName}</td>
                  <td className="py-4">
                    <p className="font-semibold text-slate-700">{booking.date}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{booking.startTime}</p>
                  </td>
                  <td className="py-4 font-black text-slate-800">₹{booking.totalAmount.toFixed(0)}</td>
                  <td className="py-4">
                    <Badge status={booking.status} />
                  </td>
                  <td className="py-4 text-right pr-6">
                    {(booking.status === 'Active' || booking.status === 'Pending') ? (
                      <button
                        onClick={() => handleAdminCancel(booking.id)}
                        className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1 text-[10px] font-bold"
                        title="Cancel Booking & Refund Seeker"
                      >
                        <XCircle size={12} /> Cancel & Refund
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold select-none">No Action</span>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">No platform bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default BookingManagement;
