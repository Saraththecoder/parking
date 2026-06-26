import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, User, Layout, Landmark, ShieldCheck, ChevronDown, Menu, X, LogOut } from 'lucide-react';
import Drawer from './Drawer';

const Navbar = () => {
  const { currentUser, switchUserRole, bookings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/seeker/dashboard')) return 'dashboard';
    if (path.includes('/seeker/search')) return 'search';
    if (path.includes('/seeker/bookings')) return 'bookings';
    if (path.includes('/seeker/wallet')) return 'wallet';
    return '';
  };

  const activeTab = getActiveTab();

  // Notification items
  const activeBookingsCount = bookings.filter(b => b.seekerId === currentUser.id && b.status === 'Active').length;
  const notifications = [
    { id: 1, title: "Booking Confirmed", body: "Your spot at Elite Tower is ready.", time: "10 mins ago", read: false },
    { id: 2, title: "Wallet Alert", body: "₹500 successfully added via UPI.", time: "1 hour ago", read: true },
    { id: 3, title: "Special Discount", body: "10% off on your next booking in Hyderabad.", time: "1 day ago", read: true }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex flex-col flex-shrink-0 justify-center">
              <span className="text-xl font-extrabold text-parkgreen tracking-tight leading-none flex items-center gap-1">
                Plantopark
              </span>
              <span className="text-[9px] text-slate-500 font-medium tracking-widest mt-0.5 uppercase">Smart Park. Smart Earn.</span>
            </Link>

            {/* Navigation Tabs (Desktop Seeker) */}
            {currentUser.role === 'seeker' && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8 h-full">
                <Link
                  to="/seeker/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors ${
                    activeTab === 'dashboard'
                      ? 'border-parkgreen text-slate-900 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/seeker/search"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors ${
                    activeTab === 'search'
                      ? 'border-parkgreen text-slate-900 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Find Parking
                </Link>
                <Link
                  to="/seeker/bookings"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors ${
                    activeTab === 'bookings'
                      ? 'border-parkgreen text-slate-900 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Bookings
                </Link>
                <Link
                  to="/seeker/wallet"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors ${
                    activeTab === 'wallet'
                      ? 'border-parkgreen text-slate-900 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Wallet
                </Link>
              </div>
            )}
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher Indicator pill */}
            <div className="hidden md:flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => { switchUserRole('seeker'); navigate('/seeker/dashboard'); }}
                className={`px-3 py-1 rounded-md transition-all ${
                  currentUser.role === 'seeker' ? 'bg-white text-parkgreen shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Seeker
              </button>
              <button
                onClick={() => { switchUserRole('owner'); navigate('/owner/dashboard'); }}
                className={`px-3 py-1 rounded-md transition-all ${
                  currentUser.role === 'owner' ? 'bg-white text-parkgreen shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Owner
              </button>
              <button
                onClick={() => { switchUserRole('admin'); navigate('/admin/dashboard'); }}
                className={`px-3 py-1 rounded-md transition-all ${
                  currentUser.role === 'admin' ? 'bg-white text-parkgreen shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setNotifDrawerOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full relative transition-colors"
            >
              <Bell size={20} />
              {activeBookingsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                />
                <span className="hidden md:block text-sm font-medium text-slate-700">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop close click area */}
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1.5 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs text-slate-400 font-semibold uppercase">Current Role</p>
                      <p className="text-sm font-bold text-slate-800 uppercase mt-0.5 text-parkgreen flex items-center gap-1">
                        {currentUser.role === 'admin' ? <ShieldCheck size={14} /> : currentUser.role === 'owner' ? <Landmark size={14} /> : <Layout size={14} />}
                        {currentUser.role} View
                      </p>
                    </div>

                    <div className="py-1">
                      {currentUser.role === 'seeker' ? (
                        <Link
                          to="/seeker/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User size={16} /> My Profile
                        </Link>
                      ) : currentUser.role === 'owner' ? (
                        <Link
                          to="/owner/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User size={16} /> Space Profile
                        </Link>
                      ) : null}

                      {/* Mobile friendly role togglers inside dropdown */}
                      <div className="border-t border-slate-100 my-1 py-1 md:hidden">
                        <button
                          onClick={() => { switchUserRole('seeker'); setDropdownOpen(false); navigate('/seeker/dashboard'); }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentUser.role === 'seeker' ? 'text-parkgreen font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          Switch to Seeker
                        </button>
                        <button
                          onClick={() => { switchUserRole('owner'); setDropdownOpen(false); navigate('/owner/dashboard'); }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentUser.role === 'owner' ? 'text-parkgreen font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          Switch to Host/Owner
                        </button>
                        <button
                          onClick={() => { switchUserRole('admin'); setDropdownOpen(false); navigate('/admin/dashboard'); }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentUser.role === 'admin' ? 'text-parkgreen font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          Switch to Admin
                        </button>
                      </div>

                      <div className="border-t border-slate-100 my-1" />
                      
                      <Link
                        to="/login"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LogOut size={16} /> Log Out
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger (Seeker) */}
            {currentUser.role === 'seeker' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 sm:hidden text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && currentUser.role === 'seeker' && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-2 pt-2 pb-3 space-y-1 shadow-inner">
          <Link
            to="/seeker/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
              activeTab === 'dashboard'
                ? 'bg-green-50 text-parkgreen'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/seeker/search"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
              activeTab === 'search'
                ? 'bg-green-50 text-parkgreen'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Find Parking
          </Link>
          <Link
            to="/seeker/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
              activeTab === 'bookings'
                ? 'bg-green-50 text-parkgreen'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Bookings
          </Link>
          <Link
            to="/seeker/wallet"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
              activeTab === 'wallet'
                ? 'bg-green-50 text-parkgreen'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Wallet
          </Link>
        </div>
      )}

      {/* Notification Drawer */}
      <Drawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        title="Notifications"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-all ${
                notif.read ? 'bg-white border-slate-100' : 'bg-green-50/50 border-green-100'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-sm font-bold text-slate-800">{notif.title}</h4>
                {!notif.read && (
                  <span className="w-1.5 h-1.5 rounded-full bg-parkgreen flex-shrink-0 mt-1.5" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{notif.body}</p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">{notif.time}</p>
            </div>
          ))}
          <button
            onClick={() => {
              toast.success("All notifications marked as read.");
              setNotifDrawerOpen(false);
            }}
            className="text-xs font-semibold text-center text-parkgreen hover:text-parkgreen-hover py-2 transition-colors mt-2"
          >
            Mark all as read
          </button>
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar;
