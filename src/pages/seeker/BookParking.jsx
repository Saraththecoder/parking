import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/Badge';
import { ShieldCheck, Calendar, Car, Clock, CreditCard, ChevronRight, CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const BookParking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { spaces, currentUser, createBooking } = useApp();

  const space = spaces.find(s => s.id === id);

  // Read passed state from ParkingDetails.jsx or set defaults
  const bookingState = location.state || {
    date: '2026-06-27',
    startTime: '09:00 AM',
    durationHours: 3,
    vehicleId: currentUser.vehicles[0]?.id || '',
    totalAmount: space ? (space.price * 3) + 20 + ((space.price * 3) * 0.18) : 150
  };

  const [step, setStep] = useState(2); // Starts at Step 2: Review & Payment
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, upi, netbanking
  const [upiProvider, setUpiProvider] = useState('gpay'); // gpay, phonepe, other
  const [agreed, setAgreed] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!space) {
    return (
      <div className="py-20 text-center text-slate-500">
        <h3 className="font-bold text-lg">Invalid Booking request</h3>
        <Link to="/seeker/search" className="text-parkgreen hover:underline">Back to search</Link>
      </div>
    );
  }

  const selectedVehicle = currentUser.vehicles?.find(v => v.id === bookingState.vehicleId) || currentUser.vehicles[0];

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the terms to proceed.");
      return;
    }

    setIsPaying(true);

    // Simulate mock payment auth delay
    setTimeout(() => {
      setIsPaying(false);

      const payMethodLabel = paymentMethod === 'card'
        ? "HDFC Bank Debit Card (•••• 4567)"
        : paymentMethod === 'upi'
          ? `UPI (${upiProvider.toUpperCase()})`
          : "Net Banking";

      // Call context to create booking
      const newBook = createBooking({
        spaceId: space.id,
        startTime: bookingState.startTime,
        endTime: calculateEndTime(bookingState.startTime, bookingState.durationHours),
        date: bookingState.date,
        durationHours: bookingState.durationHours,
        vehicleId: selectedVehicle?.id,
        paymentMethod: payMethodLabel
      });

      if (newBook) {
        setConfirmedBooking(newBook);
        setStep(3); // Go to step 3: Confirmed
      }
    }, 1500);
  };

  // End time helper
  const calculateEndTime = (start, duration) => {
    const [time, modifier] = start.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    let endHours = (hours + parseInt(duration)) % 24;
    const endModifier = endHours >= 12 ? 'PM' : 'AM';
    if (endHours > 12) endHours -= 12;
    if (endHours === 0) endHours = 12;

    const paddedHours = String(endHours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    return `${paddedHours}:${paddedMinutes} ${endModifier}`;
  };

  return (
    <div className="space-y-8 text-left pb-16">
      
      {/* 1. Header & Step indicators */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Secure Checkout</h1>
          <p className="text-xs text-slate-500 mt-1">Complete your parking reservation</p>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="flex items-center gap-2">
          {/* Step 1 */}
          <div className="flex items-center text-xs font-semibold text-green-700">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[10px] font-bold border border-green-300">✓</span>
            <span className="ml-1.5 hidden sm:inline">Time & Date</span>
          </div>
          <div className="w-8 h-[1px] bg-slate-200" />

          {/* Step 2 */}
          <div className={`flex items-center text-xs font-semibold ${step >= 2 ? 'text-parkgreen' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${step >= 2 ? 'bg-green-50 border-parkgreen text-parkgreen' : 'bg-slate-50 border-slate-200'}`}>2</span>
            <span className="ml-1.5 hidden sm:inline">Review & Payment</span>
          </div>
          <div className="w-8 h-[1px] bg-slate-200" />

          {/* Step 3 */}
          <div className={`flex items-center text-xs font-semibold ${step === 3 ? 'text-parkgreen' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${step === 3 ? 'bg-green-50 border-parkgreen text-parkgreen' : 'bg-slate-50 border-slate-200'}`}>3</span>
            <span className="ml-1.5 hidden sm:inline">Confirmed</span>
          </div>
        </div>
      </div>

      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Summary Card */}
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">Booking Summary</h2>
            
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                <img src={space.images[0]} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 bg-green-950/80 text-white border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  {space.isInstantBooking ? '⚡ Instant Booking' : 'Requested Spot'}
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{space.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">{space.address}</p>
                </div>

                <div className="border-t border-slate-100 my-3" />

                {/* Date & Time parameters */}
                <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-600">
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Date</p>
                      <p className="text-slate-800 font-bold mt-0.5">{bookingState.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Time Slot</p>
                      <p className="text-slate-800 font-bold mt-0.5">{bookingState.startTime} - {calculateEndTime(bookingState.startTime, bookingState.durationHours)}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle card */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <Car size={16} className="text-slate-400" />
                  <div>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">Vehicle Selected</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedVehicle?.number} • {selectedVehicle?.name}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 my-3" />

                {/* Cost breakup */}
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({bookingState.durationHours} hours)</span>
                    <span>₹{(space.price * bookingState.durationHours).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>₹20.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (GST 18%)</span>
                    <span>₹{((space.price * bookingState.durationHours) * 0.18).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-bold text-sm border-t border-slate-100 pt-2.5 mt-2">
                    <span>Total Amount</span>
                    <span>₹{bookingState.totalAmount.toFixed(0)}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Host message block */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={space.hostAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Hosted by {space.hostName}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Verified Space Host</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.success(`Chat simulation opened with host ${space.hostName}`)}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-600 border border-slate-200 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100"
              >
                <MessageSquare size={12} /> Message Host
              </button>
            </div>

          </div>

          {/* Right Column: Payment Method Picker */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">Payment Method</h2>
            
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              
              {/* Option 1: Saved Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  paymentMethod === 'card' ? 'border-parkgreen bg-green-50/10' : 'border-slate-200 bg-white hover:border-slate-350'
                }`}
              >
                <input
                  type="radio"
                  name="paymentOption"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="text-parkgreen focus:ring-parkgreen mt-1"
                />
                <div className="flex-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm">HDFC Bank Debit Card</span>
                    <span className="bg-slate-100 text-slate-500 font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold border border-slate-200">VISA</span>
                  </div>
                  <p className="text-slate-400 mt-1.5">•••• •••• •••• 4567 | Exp 12/26</p>
                </div>
              </div>

              {/* Option 2: UPI Apps */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3.5 ${
                  paymentMethod === 'upi' ? 'border-parkgreen bg-green-50/10' : 'border-slate-200 bg-white hover:border-slate-350'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="text-parkgreen focus:ring-parkgreen mt-1"
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-slate-800 text-sm">UPI (Google Pay, PhonePe, Paytm)</span>
                    <p className="text-slate-400 mt-1">Instant authorization using your mobile UPI handles.</p>
                  </div>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="grid grid-cols-3 gap-2.5 pl-7 mt-1 select-none">
                    <button
                      type="button"
                      onClick={() => setUpiProvider('gpay')}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                        upiProvider === 'gpay' ? 'border-parkgreen bg-green-50 text-parkgreen' : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      Google Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiProvider('phonepe')}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                        upiProvider === 'phonepe' ? 'border-parkgreen bg-green-50 text-parkgreen' : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      PhonePe
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiProvider('other')}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                        upiProvider === 'other' ? 'border-parkgreen bg-green-50 text-parkgreen' : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      Other UPI ID
                    </button>
                  </div>
                )}
              </div>

              {/* Option 3: Netbanking */}
              <div
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  paymentMethod === 'netbanking' ? 'border-parkgreen bg-green-50/10' : 'border-slate-200 bg-white hover:border-slate-350'
                }`}
              >
                <input
                  type="radio"
                  name="paymentOption"
                  checked={paymentMethod === 'netbanking'}
                  onChange={() => setPaymentMethod('netbanking')}
                  className="text-parkgreen focus:ring-parkgreen mt-1"
                />
                <div className="flex-1 text-xs">
                  <span className="font-bold text-slate-800 text-sm">Net Banking</span>
                  <p className="text-slate-400 mt-1">Select from major Indian banks (SBI, ICICI, HDFC, Axis).</p>
                </div>
              </div>

              {/* Checkbox Agreement */}
              <div className="pt-3">
                <label className="flex items-start gap-2.5 text-xs text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="rounded border-slate-300 text-parkgreen focus:ring-parkgreen mt-0.5"
                  />
                  <span className="leading-tight">
                    I agree to the Plantopark <a href="#" className="font-bold text-parkgreen hover:underline">Terms of Service</a>,{' '}
                    <a href="#" className="font-bold text-parkgreen hover:underline">Cancellation Policy</a>, and Host Rules.
                  </span>
                </label>
              </div>

              {/* Confirm Pay Button */}
              <button
                type="submit"
                disabled={isPaying}
                className="w-full py-4 bg-parkgreen hover:bg-parkgreen-hover text-white text-sm font-bold rounded-xl transition-all shadow-md mt-6 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isPaying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>Authorizing Transaction...</span>
                  </>
                ) : (
                  <span>Confirm & Pay ₹{bookingState.totalAmount.toFixed(0)}</span>
                )}
              </button>

              <div className="text-center text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-4 flex items-center justify-center gap-1.5 select-none">
                <ShieldCheck size={14} className="text-parkgreen" />
                <span>SSL Encrypted Secure Payment Gateway</span>
              </div>

            </form>
          </div>

        </div>
      )}

      {/* Step 3: Success Confirmation Screen */}
      {step === 3 && confirmedBooking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-premium p-8 text-center space-y-6"
        >
          {/* Green Checkmark Circle animate */}
          <div className="w-16 h-16 bg-green-50 border border-green-200 text-parkgreen rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={36} className="stroke-[2.5]" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Booking Confirmed!</h2>
            <p className="text-xs text-slate-400 mt-1">Your reservation ID is <strong className="text-slate-700">{confirmedBooking.id}</strong></p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left text-xs font-semibold text-slate-700 space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold uppercase text-[9px]">Location</span>
              <span className="text-slate-800 text-right max-w-[70%] truncate">{confirmedBooking.spaceName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold uppercase text-[9px]">Date & Time</span>
              <span className="text-slate-800">{confirmedBooking.date} | {confirmedBooking.startTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold uppercase text-[9px]">Allocated Slot</span>
              <span className="bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded font-bold uppercase">{confirmedBooking.slot}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold uppercase text-[9px]">Vehicle</span>
              <span className="text-slate-800">{confirmedBooking.vehicleNumber} ({confirmedBooking.vehicleName})</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Please display your booking confirmation card or scan the QR code at the property entrance gate to check in.
          </p>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/seeker/bookings')}
              className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Go to My Bookings
            </button>
            <button
              onClick={() => navigate('/seeker/dashboard')}
              className="flex-1 py-3 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>

        </motion.div>
      )}

    </div>
  );
};

export default BookParking;
