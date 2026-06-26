import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  PlusCircle,
  MapPin,
  CalendarCheck,
  IndianRupee,
  Users,
  Building,
  History,
  FileBarChart2,
  ArrowLeftRight,
  LogOut,
  UserCheck
} from 'lucide-react';

const Sidebar = ({ type = 'owner' }) => {
  const { currentUser, switchUserRole } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const getLinks = () => {
    if (type === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'User Management', path: '/admin/users', icon: Users },
        { name: 'Parking Spaces', path: '/admin/spaces', icon: Building },
        { name: 'Platform Bookings', path: '/admin/bookings', icon: CalendarCheck },
        { name: 'Revenue Reports', path: '/admin/revenue', icon: FileBarChart2 }
      ];
    }
    
    // Default: Owner
    return [
      { name: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
      { name: 'Add Parking Space', path: '/owner/add', icon: PlusCircle },
      { name: 'My Listed Spaces', path: '/owner/spaces', icon: MapPin },
      { name: 'Customer Bookings', path: '/owner/bookings', icon: CalendarCheck },
      { name: 'Earnings Tracker', path: '/owner/earnings', icon: IndianRupee },
      { name: 'Profile Settings', path: '/owner/profile', icon: UserCheck }
    ];
  };

  const menuItems = getLinks();

  return (
    <aside className="w-64 bg-darksidebar text-slate-300 flex flex-col h-screen fixed top-0 left-0 z-30 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex flex-col justify-center px-6 bg-darknav border-b border-slate-800">
        <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-parkgreen inline-block animate-pulse" />
          Plantopark
        </span>
        <span className="text-[8px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
          {type.toUpperCase()} CONTROL PANEL
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-parkgreen text-white font-semibold shadow-md shadow-green-950/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Role Switcher Button */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={() => {
            switchUserRole('seeker');
            navigate('/seeker/dashboard');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
        >
          <ArrowLeftRight size={14} />
          <span>Switch to Seeker View</span>
        </button>
      </div>

      {/* Bottom Profile Details */}
      <div className="p-4 border-t border-slate-800 bg-darknav flex items-center gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-9 h-9 rounded-full border border-slate-700 object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate leading-none">{currentUser.name}</p>
          <p className="text-[10px] text-slate-400 truncate mt-1">{currentUser.email}</p>
        </div>
        <Link
          to="/login"
          title="Sign Out"
          className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
        >
          <LogOut size={16} />
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
