import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/Badge';
import StarRating from '../../components/StarRating';
import Modal from '../../components/Modal';
import { Calendar, Clock, Car, MapPin, MessageSquare, AlertCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Bookings = () => {
  const { bookings, currentUser, cancelBooking, addReview } = useApp();
  const [activeTab, setActiveTab] = useState('active'); // active, completed, cancelled

  // Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewSpaceId, setReviewSpaceId] = useState(null);
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewContent, setReviewContent] = useState('');

  // Filter bookings for current seeker
  const seekerBookings = bookings.filter(b => b.seekerId === currentUser.id);

  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'active':
        return seekerBookings.filter(b => b.status === 'Active' || b.status === 'Pending');
      case 'completed':
        return seekerBookings.filter(b => b.status === 'Completed');
      case 'cancelled':
        return seekerBookings.filter(b => b.status === 'Cancelled');
      default:
        return seekerBookings;
    }
  };

  const filtered = getFilteredBookings();

  const handleCancelClick = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking? You will receive a full refund in your wallet.")) {
      cancelBooking(bookingId, "Cancelled by user");
    }
  };

  const handleOpenReview = (spaceId) => {
    setReviewSpaceId(spaceId);
    setRatingInput(5);
    setReviewContent('');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewContent.trim()) {
      toast.error("Please enter a review message.");
      return;
    }
    addReview(reviewSpaceId, ratingInput, reviewContent);
    setReviewModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
        <p className="text-xs text-slate-500 mt-1">Track and manage your parking reservations</p>
      </div>

      {/* Tabs selectors */}
      <div className="flex border-b border-slate-200 select-none">
        {['active', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold capitalize border-b-2 transition-all -mb-px ${
              activeTab === tab
                ? 'border-parkgreen text-slate-900 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab === 'active' ? 'Active / Upcoming' : tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filtered.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden p-5 flex flex-col md:flex-row justify-between gap-6"
          >
            {/* Left Content */}
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-start gap-4 md:justify-start">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">{booking.spaceName}</h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1"><MapPin size={12} /> {booking.spaceAddress}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 my-2" />

              {/* Grid details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-500">
                <div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Date</p>
                  <p className="text-slate-850 font-bold mt-1 flex items-center gap-1"><Calendar size={12} className="text-slate-400" /> {booking.date}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Time</p>
                  <p className="text-slate-850 font-bold mt-1 flex items-center gap-1"><Clock size={12} className="text-slate-400" /> {booking.startTime} - {booking.endTime}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Allocated Slot</p>
                  <p className="text-slate-850 font-bold mt-1 uppercase"><span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">{booking.slot}</span></p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Vehicle</p>
                  <p className="text-slate-850 font-bold mt-1 flex items-center gap-1 truncate"><Car size={12} className="text-slate-400" /> {booking.vehicleNumber}</p>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3.5 shrink-0 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
              <div className="text-left md:text-right">
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Payment</p>
                <p className="text-sm font-black text-slate-800 mt-0.5">₹{booking.totalAmount.toFixed(0)}</p>
                <div className="mt-1"><Badge status={booking.status} /></div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {(booking.status === 'Active' || booking.status === 'Pending') && (
                  <button
                    onClick={() => handleCancelClick(booking.id)}
                    className="flex items-center gap-1 px-3.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-all"
                  >
                    <XCircle size={14} />
                    <span>Cancel</span>
                  </button>
                )}
                {booking.status === 'Completed' && (
                  <button
                    onClick={() => handleOpenReview(booking.spaceId)}
                    className="flex items-center gap-1 px-3.5 py-2 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>Write Review</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <AlertCircle size={32} className="mx-auto text-slate-300" />
            <p className="font-bold text-slate-600 mt-4">No bookings found</p>
            <p className="text-xs mt-1 text-slate-400">You don't have any bookings listed in the "{activeTab}" filter.</p>
          </div>
        )}
      </div>

      {/* Review input modal overlay */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Write a review for this spot">
        <form onSubmit={handleReviewSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Rating</label>
            <div className="flex gap-2">
              <StarRating rating={ratingInput} onChange={setRatingInput} size={28} />
              <span className="text-sm font-bold text-amber-500 ml-2 mt-1">{ratingInput} / 5 stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Review Message</label>
            <textarea
              rows={4}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-250 focus:border-parkgreen rounded-xl text-sm outline-none transition-colors"
              placeholder="Tell other drivers about your parking experience..."
            />
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Submit Review
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Bookings;
