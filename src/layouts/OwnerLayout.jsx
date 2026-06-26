import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, Bell, ChevronRight, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OwnerLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Helper to construct breadcrumbs dynamically
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(p => p);
    return paths.map((path, idx) => {
      const routeTo = `/${paths.slice(0, idx + 1).join('/')}`;
      const isLast = idx === paths.length - 1;
      const formattedName = path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
      
      return (
        <span key={routeTo} className="flex items-center">
          <ChevronRight size={14} className="text-slate-300 mx-1.5" />
          {isLast ? (
            <span className="text-slate-800 font-semibold text-xs">{formattedName}</span>
          ) : (
            <Link to={routeTo} className="text-slate-500 hover:text-slate-700 text-xs transition-colors">
              {formattedName}
            </Link>
          )}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar (Hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar type="owner" />
      </div>

      {/* Mobile Sidebar Slide-in Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-64 h-full flex-shrink-0"
            >
              <Sidebar type="owner" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-slate-50 border border-slate-250 rounded-lg text-slate-500"
            >
              <Menu size={20} />
            </button>
            
            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center text-xs text-slate-400 font-medium select-none">
              <Link to="/owner/dashboard" className="text-slate-500 hover:text-slate-700 flex items-center transition-colors">
                <Home size={14} />
              </Link>
              {getBreadcrumbs()}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Host Tag Indicator */}
            <span className="bg-green-50 text-parkgreen border border-green-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Space Host Mode
            </span>
          </div>
        </header>

        {/* Page Inner Container */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
