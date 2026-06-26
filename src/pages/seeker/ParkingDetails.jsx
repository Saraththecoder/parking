import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StarRating from '../../components/StarRating';
import Modal from '../../components/Modal';
import { Shield, ShieldAlert, Award, Clock, Sparkles, Check, ChevronRight, MapPin, Calendar, User, Eye, ArrowLeft, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

const ParkingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { spaces, reviews, currentUser } = useApp();

  const space = spaces.find(s => s.id === id);

  // States for Booking Sidebar Widget
  const [bookingDate, setBookingDate] = useState('2026-06-27');
  const [bookingTime, setBookingTime] = useState('09:00 AM');
  const [duration, setDuration] = useState(3); // 3 Hours
  const [selectedVehicleId, setSelectedVehicleId] = useState(currentUser.vehicles[0]?.id || '');
  const [galleryOpen, setGalleryOpen] = useState(false);

  if (!space) {
    return (
      <div className="py-20 text-center text-slate-500">
        <h3 className="font-bold text-lg">Parking spot not found</h3>
        <Link to="/seeker/search" className="text-parkgreen hover:underline mt-2 inline-block">Back to search</Link>
      </div>
    );
  }

  // Filter reviews matching this space
  const spaceReviews = reviews.filter(r => r.spaceId === space.id);

  // Price Calculation details
  const subtotal = space.price * duration;
  const serviceFee = 20.0;
  const tax = subtotal * 0.18;
  const totalAmount = subtotal + serviceFee + tax;

  const handleLaunchCheckout = (e) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      toast.error("Please add a vehicle to your profile first!");
      navigate('/seeker/profile');
      return;
    }
    
    // Pass booking parameters via state to the booking page
    navigate(`/seeker/book/${space.id}`, {
      state: {
        date: bookingDate,
        startTime: bookingTime,
        durationHours: duration,
        vehicleId: selectedVehicleId,
        totalAmount
      }
    });
  };

  return (
    <div className="space-y-6 text-left pb-16">
      
      {/* Back button & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
        <div className="flex items-center text-xs text-slate-400 font-medium select-none">
          <Link to="/seeker/search" className="text-slate-500 hover:text-slate-700 flex items-center transition-colors">
            Search
          </Link>
          <ChevronRight size={12} className="mx-1.5" />
          <span className="text-slate-500">{space.city}</span>
          <ChevronRight size={12} className="mx-1.5" />
          <span className="text-slate-800 font-semibold truncate max-w-xs">{space.name}</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg bg-white"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Spot Title & Main Stats summary */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{space.name}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-0.5 text-amber-500 font-semibold">
            <span>★</span>
            <span>{space.rating}</span>
            <span className="text-slate-400 font-medium ml-0.5">({space.reviewsCount} reviews)</span>
          </div>
          <span>•</span>
          <span className="flex items-center gap-1"><Shield size={12} className="text-parkgreen fill-green-50 animate-pulse" /> Verified Space</span>
          <span>•</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> {space.address}</span>
        </div>
      </div>

      {/* 1. Gallery Layout (Standard Airbnb style: 1 large, 4 small grid) */}
      <section className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Main Large Image */}
          <div className="md:col-span-2 aspect-[4/3] md:aspect-auto md:h-[350px] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setGalleryOpen(true)}>
            <img src={space.images[0]} alt={space.name} className="w-full h-full object-cover hover:scale-102 transition-transform duration-300" />
          </div>

          {/* Grid blocks */}
          <div className="hidden md:grid grid-cols-2 col-span-2 gap-2 h-[350px]">
            <div className="bg-slate-150 overflow-hidden cursor-pointer" onClick={() => setGalleryOpen(true)}>
              <img src={space.images[1] || space.images[0]} alt="" className="w-full h-full object-cover hover:scale-102 transition-transform" />
            </div>
            <div className="bg-slate-150 overflow-hidden cursor-pointer" onClick={() => setGalleryOpen(true)}>
              <img src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400" alt="" className="w-full h-full object-cover hover:scale-102 transition-transform" />
            </div>
            <div className="bg-slate-150 overflow-hidden cursor-pointer" onClick={() => setGalleryOpen(true)}>
              <img src="https://images.unsplash.com/photo-1590674488059-d8e7e1e695d7?w=400" alt="" className="w-full h-full object-cover hover:scale-102 transition-transform" />
            </div>
            <div className="bg-slate-150 overflow-hidden cursor-pointer relative" onClick={() => setGalleryOpen(true)}>
              <img src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=400" alt="" className="w-full h-full object-cover blur-[1px] hover:blur-0 transition-all" />
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-white text-xs font-bold gap-1.5 select-none">
                <Eye size={16} />
                <span>Show all photos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Layout: Left Content & Right Sticky Sidebar widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column Pane */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Host Card */}
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
            <div className="flex items-center gap-4">
              <img
                src={space.hostAvatar}
                alt={space.hostName}
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Hosted by {space.hostName}</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">{space.hostExperience || "Experienced Host"}</p>
              </div>
            </div>
            <span className="flex items-center gap-1 bg-green-50 border border-green-150 px-2 py-0.5 rounded text-[10px] font-bold text-parkgreen uppercase tracking-wide">
              Verified Space Owner
            </span>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <h3 className="font-bold text-slate-800 text-base mb-3">About this spot</h3>
            <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">
              {space.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <h3 className="font-bold text-slate-800 text-base mb-4">What this spot offers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {space.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <div className="w-6 h-6 bg-slate-50 rounded-lg border border-slate-150 flex items-center justify-center text-parkgreen">
                    <Check size={12} />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Map location wrapper */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Location</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> {space.address}</p>
            
            {/* Visual map placeholder */}
            <div className="h-64 rounded-xl overflow-hidden border border-slate-150 bg-slate-100 relative">
              <MapPlaceholder variant="search" spaces={[space]} selectedSpaceId={space.id} />
            </div>
          </div>

          {/* Security Features & Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft text-center flex flex-col items-center">
              <Award size={24} className="text-parkgreen mb-2" />
              <h4 className="font-bold text-xs text-slate-800">Verified Spot</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">Physical layout validation checked</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft text-center flex flex-col items-center">
              <Clock size={24} className="text-parkgreen mb-2" />
              <h4 className="font-bold text-xs text-slate-800">Instant Refund</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">100% back if slot occupies on arrival</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft text-center flex flex-col items-center">
              <Shield size={24} className="text-parkgreen mb-2" />
              <h4 className="font-bold text-xs text-slate-800">24/7 Support</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">Dedicated platform assistance line</p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-base">Reviews ({spaceReviews.length})</h3>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <span className="text-amber-500">★</span>
                <span>{space.rating} average</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {spaceReviews.map((rev) => (
                <div key={rev.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img src={rev.authorAvatar} alt={rev.authorName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{rev.authorName}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{rev.date}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <StarRating rating={rev.rating} size={10} />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {rev.content}
                  </p>
                </div>
              ))}

              {spaceReviews.length === 0 && (
                <p className="text-xs text-slate-400 py-6 text-center">No reviews listed yet for this host. Be the first to park here!</p>
              )}
            </div>
          </div>

          {/* Things to Know */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <h3 className="font-bold text-slate-800 text-base mb-5">Things to Know</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-left">
              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-3">Spot Rules</h4>
                <ul className="space-y-2 text-slate-500 list-disc pl-4 font-medium">
                  {space.rules.map((rule, idx) => <li key={idx}>{rule}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-3">Security & Safety</h4>
                <ul className="space-y-2 text-slate-500 list-disc pl-4 font-medium">
                  <li>CCTV Active 24/7</li>
                  <li>Valuables left at owner's risk</li>
                  <li>Property entry restricted to bookers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-3">Cancellation Policy</h4>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {space.cancellationPolicy}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sticky Booking Calculator Widget */}
        <div className="relative">
          <form
            onSubmit={handleLaunchCheckout}
            className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-200 shadow-premium space-y-5"
          >
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-black text-slate-800">
                ₹{space.price}
                <span className="text-xs font-semibold text-slate-400">/hr</span>
              </span>
              <div className="flex items-center gap-0.5 text-xs font-bold text-slate-800">
                <span className="text-amber-500">★</span>
                <span>{space.rating}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 my-4" />

            {/* Inputs layout */}
            <div className="space-y-3.5 text-left">
              {/* Date */}
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Date</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Calendar size={14} />
                  </span>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    className="pl-9 w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-parkgreen transition-colors"
                  />
                </div>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Start Time</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Clock size={14} />
                  </span>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="pl-9 w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-parkgreen transition-colors cursor-pointer"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-parkgreen transition-colors cursor-pointer"
                >
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="5">5 Hours</option>
                  <option value="12">12 Hours</option>
                </select>
              </div>

              {/* Vehicle Select */}
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Select Vehicle</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User size={14} />
                  </span>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    required
                    className="pl-9 w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-parkgreen transition-colors cursor-pointer"
                  >
                    {currentUser.vehicles?.map(v => (
                      <option key={v.id} value={v.id}>{v.number} ({v.name.split(' ')[0]})</option>
                    ))}
                    {(!currentUser.vehicles || currentUser.vehicles.length === 0) && (
                      <option value="">No vehicles found</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit checkout redirect */}
            <button
              type="submit"
              className="w-full py-3 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-extrabold rounded-xl transition-all shadow-md mt-4 cursor-pointer"
            >
              Book Spot Now
            </button>

            <p className="text-[10px] text-slate-400 text-center font-medium mt-2">You won't be charged yet</p>

            {/* Pricing Details */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>₹{space.price} × {duration} hours</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking fee</span>
                <span>₹{serviceFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (GST 18%)</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-slate-800 font-bold text-sm border-t border-slate-100 pt-2.5 mt-2">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(0)}</span>
              </div>
            </div>

            {/* Plantopark protection footer */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2 text-[10px] text-slate-500 mt-4 leading-normal">
              <ShieldAlert size={14} className="text-parkgreen shrink-0 mt-0.5" />
              <span>
                <strong>Plantopark Protection.</strong> We cover damages and disputes during your active booking period.
              </span>
            </div>

          </form>
        </div>

      </div>

      {/* Gallery Modal view */}
      <Modal isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} title="Photos of this parking spot">
        <div className="grid grid-cols-1 gap-3">
          {space.images.map((img, idx) => (
            <img key={idx} src={img} alt="" className="w-full rounded-xl object-cover aspect-video" />
          ))}
          <img src="https://images.unsplash.com/photo-1590674488059-d8e7e1e695d7?w=800" alt="" className="w-full rounded-xl object-cover aspect-video" />
          <img src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800" alt="" className="w-full rounded-xl object-cover aspect-video" />
        </div>
      </Modal>

    </div>
  );
};

export default ParkingDetails;
