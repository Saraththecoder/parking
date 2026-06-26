import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { LayoutDashboard, Search, Calendar, Wallet, User } from 'lucide-react';
import { motion } from 'framer-motion';

const UserLayout = () => {
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/seeker/dashboard')) return 'dashboard';
    if (path.includes('/seeker/search')) return 'search';
    if (path.includes('/seeker/bookings')) return 'bookings';
    if (path.includes('/seeker/wallet')) return 'wallet';
    if (path.includes('/seeker/profile')) return 'profile';
    return '';
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen flex flex-col bg-parkbg pb-16 md:pb-0">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Pane */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <Outlet />
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation (Visible only on mobile/tablet) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg px-2 py-1.5 flex justify-around items-center z-40">
        <Link
          to="/seeker/dashboard"
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
            activeTab === 'dashboard' ? 'text-parkgreen font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <LayoutDashboard size={18} />
          <span className="text-[10px] mt-1 font-medium">Dashboard</span>
        </Link>

        <Link
          to="/seeker/search"
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
            activeTab === 'search' ? 'text-parkgreen font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Search size={18} />
          <span className="text-[10px] mt-1 font-medium">Search</span>
        </Link>

        <Link
          to="/seeker/bookings"
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
            activeTab === 'bookings' ? 'text-parkgreen font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calendar size={18} />
          <span className="text-[10px] mt-1 font-medium">Bookings</span>
        </Link>

        <Link
          to="/seeker/wallet"
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
            activeTab === 'wallet' ? 'text-parkgreen font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Wallet size={18} />
          <span className="text-[10px] mt-1 font-medium">Wallet</span>
        </Link>

        <Link
          to="/seeker/profile"
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
            activeTab === 'profile' ? 'text-parkgreen font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User size={18} />
          <span className="text-[10px] mt-1 font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default UserLayout;
