import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Globe, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-parkbg">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Premium Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-parkgreen" />
                Plantopark
              </span>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
                India's leading peer-to-peer parking marketplace connecting unused spaces with drivers in need.
              </p>
              <div className="mt-4 flex gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Globe size={12} /> English (IN)</span>
                <span className="flex items-center gap-1">₹ INR</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Top Cities</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link to="/seeker/search?city=Bangalore" className="hover:text-white transition-colors">Bangalore (4,200+ spots)</Link></li>
                <li><Link to="/seeker/search?city=Hyderabad" className="hover:text-white transition-colors">Hyderabad (3,200+ spots)</Link></li>
                <li><Link to="/seeker/search?city=Vijayawada" className="hover:text-white transition-colors">Vijayawada (800+ spots)</Link></li>
                <li><Link to="/seeker/search?city=Tirupati" className="hover:text-white transition-colors">Tirupati (650+ spots)</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">For Property Owners</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">List Your Parking Spot</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">How Hosting Works</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Earnings Calculator</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Host Insurance & Protection</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Helpdesk</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© {new Date().getFullYear()} Plantopark India. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors flex items-center gap-1"><ShieldCheck size={14} className="text-parkgreen" /> ISO 27001 Certified</a>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1">Made with <Heart size={10} className="fill-red-500 text-red-500" /> for Indian Cities</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
