import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, Mail, Award, Landmark, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { currentUser, spaces } = useApp();
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [experience, setExperience] = useState('4 years experience');
  
  const hostSpaces = spaces.filter(s => s.hostId === currentUser.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    currentUser.name = name;
    currentUser.phone = phone;
    toast.success("Host profile settings updated!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left pb-16">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Host Profile Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure your public host bio and contact info</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Avatar & Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft text-center space-y-4">
          <div className="flex justify-center">
            <img src={currentUser.avatar} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-slate-200" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">{currentUser.name}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center justify-center gap-1"><Award size={12} className="text-parkgreen" /> Verified Space Host</p>
          </div>
          <div className="border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl flex justify-around">
            <div>
              <p className="text-[8px] text-slate-400 font-bold uppercase">Total Listings</p>
              <p className="text-slate-800 font-bold mt-0.5">{hostSpaces.length}</p>
            </div>
            <div className="w-[1px] bg-slate-200" />
            <div>
              <p className="text-[8px] text-slate-400 font-bold uppercase">Average Rating</p>
              <p className="text-slate-800 font-bold mt-0.5">4.8★</p>
            </div>
          </div>
        </div>

        {/* Right Columns: Edit Bio Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-4">Edit Host Bio</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Host Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-9 w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-xs font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Phone size={14} />
                </span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="pl-9 w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-xs font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Hosting Experience</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Award size={14} />
                </span>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                  className="pl-9 w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-xs font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notification Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="pl-9 w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Save Host Settings
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Profile;
