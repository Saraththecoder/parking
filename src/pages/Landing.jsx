import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CITIES } from '../data/mockData';
import { Search, MapPin, Calendar, Car, Star, ShieldCheck, BadgePercent, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();
  const { spaces } = useApp();
  
  // Search inputs
  const [cityInput, setCityInput] = useState('Bangalore');
  const [vehicleType, setVehicleType] = useState('Hatchback / Sedan');
  const [duration, setDuration] = useState('2 Hours');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/seeker/search?city=${cityInput}&vehicle=${encodeURIComponent(vehicleType)}`);
  };

  const faqs = [
    { q: "Is my vehicle safe in peer-to-peer parking spots?", a: "Yes, every spot on Plantopark goes through a physical verification check. Many listings feature CCTV surveillance, 24/7 security guards, and gated entrances. Additionally, bookings are covered under our Host Protection guidelines." },
    { q: "How do I list my driveway or unused parking slot?", a: "Click on 'Become a Host' or navigate to the Owner page. Enter details about your parking space including location, rules, images, and price. Once verified by our admin, your spot goes live instantly!" },
    { q: "How do payments and withdrawals work?", a: "Seekers pay securely online (via UPI, Debit/Credit Card, or Wallet). Earnings are instantly logged in your Owner Wallet upon booking completion. You can withdraw directly to your Indian bank account via IMPS in seconds." }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      
      {/* 1. Large Hero Section */}
      <section className="relative bg-white pt-12 pb-20 border-b border-slate-200 overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-50 rounded-full blur-3xl opacity-60 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-bold text-parkgreen tracking-wide mb-6 uppercase"
          >
            <CheckCircle2 size={12} /> India's #1 P2P Parking Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Smart Park. <span className="text-parkgreen">Smart Earn.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            Unlock convenient city parking or monetize your empty driveway with India's most trusted peer-to-peer parking network.
          </motion.p>

          {/* 2. Floating Search Parking CTA Box */}
          <motion.form
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-premium border border-slate-200 flex flex-col md:flex-row items-center gap-4 text-left"
          >
            {/* Location selector */}
            <div className="flex-1 w-full flex items-center gap-3 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <MapPin className="text-slate-400 shrink-0" size={18} />
              <div className="flex-1">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location</label>
                <select
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none border-none p-0 cursor-pointer"
                >
                  <option value="Bangalore">Indiranagar, Bangalore</option>
                  <option value="Hyderabad">Hitech City, Hyderabad</option>
                  <option value="Vijayawada">Benz Circle, Vijayawada</option>
                  <option value="Tirupati">Alipiri, Tirupati</option>
                </select>
              </div>
            </div>

            {/* Duration selector */}
            <div className="w-full md:w-48 flex items-center gap-3 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <Calendar className="text-slate-400 shrink-0" size={18} />
              <div className="flex-1">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none border-none p-0 cursor-pointer"
                >
                  <option value="2 Hours">2 Hours</option>
                  <option value="4 Hours">4 Hours</option>
                  <option value="1 Day">Full Day</option>
                  <option value="1 Week">1 Week</option>
                </select>
              </div>
            </div>

            {/* Vehicle dropdown */}
            <div className="w-full md:w-56 flex items-center gap-3 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <Car className="text-slate-400 shrink-0" size={18} />
              <div className="flex-1">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vehicle</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none border-none p-0 cursor-pointer"
                >
                  <option value="Hatchback / Sedan">Hatchback / Sedan</option>
                  <option value="SUV / Luxury">SUV / Luxury</option>
                  <option value="2-Wheeler">2-Wheeler</option>
                </select>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-4 bg-parkgreen hover:bg-parkgreen-hover text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search size={16} />
              <span>Find Space</span>
            </button>
          </motion.form>

          {/* Social Proof */}
          <div className="mt-8 flex justify-center items-center gap-3 text-xs text-slate-400 font-medium">
            <div className="flex -space-x-2">
              <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50" alt="" />
              <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50" alt="" />
              <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50" alt="" />
            </div>
            <span>Trusted by 50,000+ commuters & hosts across India</span>
          </div>
        </div>
      </section>

      {/* 3. Statistics Cards */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-soft">
            <p className="text-3xl font-extrabold text-slate-900">10,000+</p>
            <p className="text-slate-500 font-medium text-sm mt-1">Verified Parking Spots</p>
            <p className="text-xs text-slate-400 mt-2">Checked for height, gates, and safety features.</p>
          </div>
          <div className="bg-parkgreen text-white p-8 rounded-2xl border border-green-700 shadow-soft relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
              <BadgePercent size={180} />
            </div>
            <p className="text-3xl font-extrabold">₹5,00,00,000+</p>
            <p className="text-green-150 font-medium text-sm mt-1">Earned by our Hosts</p>
            <p className="text-xs text-green-100 mt-2">Monetizing unused driveways, basements, and offices.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-soft">
            <p className="text-3xl font-extrabold text-slate-900">100% Secure</p>
            <p className="text-slate-500 font-medium text-sm mt-1">Insured & Verified Bookings</p>
            <p className="text-xs text-slate-400 mt-2">Secured online transactions and dedicated support hotline.</p>
          </div>
        </div>
      </section>

      {/* 4. How It Works (Simple as 1-2-3) */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Simple as 1-2-3</h2>
          <p className="text-slate-500 mt-2 text-sm">Experience seamless parking in the most congested cities with our streamlined process.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 relative">
            {/* Left step */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center font-bold text-sm text-slate-800 shadow-sm">1</div>
              <h3 className="text-lg font-bold text-slate-900 mt-5">Search</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs">Enter your destination and vehicle type to browse available spots in real-time.</p>
            </div>

            {/* Center step */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center font-bold text-sm text-slate-800 shadow-sm">2</div>
              <h3 className="text-lg font-bold text-slate-900 mt-5">Reserve</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs">Choose your perfect spot and pay securely via UPI, Cards, or Netbanking.</p>
            </div>

            {/* Right step */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center font-bold text-sm text-slate-800 shadow-sm">3</div>
              <h3 className="text-lg font-bold text-slate-900 mt-5">Park</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs">Follow navigation to your spot and park with ease. Smart check-in via QR.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Parking Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight text-center">Parking for Every Need</h2>
        <p className="text-slate-500 text-sm text-center mt-2">From short-term visits to monthly subscriptions, we've got you covered.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Card 1 */}
          <div className="group relative h-96 rounded-2xl overflow-hidden shadow-soft border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600"
              alt="Residential"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-white text-xl font-bold">Residential</h3>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                Safe private driveways and residential communities for your peace of mind.
              </p>
              <Link to="/seeker/search?type=Residential" className="inline-flex items-center gap-1 text-xs text-white font-semibold mt-4 hover:underline">
                Explore Spots <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative h-96 rounded-2xl overflow-hidden shadow-soft border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1506521788701-1e13a4e83f2a?w=600"
              alt="Commercial"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-white text-xl font-bold">Commercial</h3>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                Prime locations near IT parks and shopping malls for business professionals.
              </p>
              <Link to="/seeker/search?type=Commercial" className="inline-flex items-center gap-1 text-xs text-white font-semibold mt-4 hover:underline">
                Explore Spots <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative h-96 rounded-2xl overflow-hidden shadow-soft border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=600"
              alt="Monthly"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-white text-xl font-bold">Monthly</h3>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                Long-term subscription options at discounted rates for residents and offices.
              </p>
              <Link to="/seeker/search?type=Monthly" className="inline-flex items-center gap-1 text-xs text-white font-semibold mt-4 hover:underline">
                Explore Plans <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Active Cities */}
      <section className="py-16 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Active Cities</h2>
              <p className="text-slate-500 text-xs mt-1">Expanding peer-to-peer parking networks in major hubs.</p>
            </div>
            <Link to="/seeker/search" className="text-sm font-semibold text-parkgreen hover:underline flex items-center gap-1">All Cities <ArrowRight size={14} /></Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CITIES.slice(0, 3).map((city) => (
              <Link
                key={city.id}
                to={`/seeker/search?city=${city.name}`}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft hover:shadow-md transition-all flex items-center gap-4 group"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-parkgreen transition-colors">{city.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{city.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Earn Money Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-parkgreen rounded-3xl p-8 sm:p-16 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-premium relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-green-500 rounded-full blur-2xl opacity-20" />
          
          <div className="max-w-xl text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Have an empty parking spot?</h2>
            <p className="mt-4 text-green-100 text-sm sm:text-base leading-relaxed">
              Start earning passive income by listing your unused space on Plantopark. Join 15,000+ hosts making up to ₹8,000 monthly.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/login?role=owner"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-parkgreen font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
              >
                Become a Host
              </Link>
              <a
                href="#how-earnings-work"
                className="px-6 py-3 bg-green-700/60 hover:bg-green-700 text-white font-bold text-sm rounded-xl border border-green-600 transition-colors"
              >
                How Earnings Work
              </a>
            </div>
          </div>

          {/* Earnings UI Visual Showcase mockup */}
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-slate-100 text-slate-800 text-left shrink-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Earnings Dashboard</p>
            <h4 className="text-2xl font-bold text-slate-900 mt-1">₹14,580.00</h4>
            <div className="border-t border-slate-100 my-4" />
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700">Booking #1024</span>
                <span className="font-bold text-parkgreen">+ ₹153.00</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700">Booking #1023</span>
                <span className="font-bold text-parkgreen">+ ₹81.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight text-center">Frequently Asked Questions</h2>
          <div className="mt-12 space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left">
                <h4 className="font-bold text-slate-900 flex items-start gap-2.5 text-base">
                  <Info size={18} className="text-parkgreen shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-sm text-slate-500 mt-3 leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
