import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/Badge';
import { Search, Building, Check, X, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const ParkingManagement = () => {
  const { spaces, verifyParkingSpace, toggleSpaceAvailability } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleVerify = (spaceId, verify) => {
    verifyParkingSpace(spaceId, verify);
  };

  const getFiltered = () => {
    return spaces.filter(space => {
      const matchSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          space.hostName.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchStatus = true;
      if (statusFilter === 'Verified') matchStatus = space.isVerified;
      if (statusFilter === 'Pending') matchStatus = !space.isVerified;
      if (statusFilter === 'Suspended') matchStatus = space.isDisabled;

      return matchSearch && matchStatus;
    });
  };

  const filtered = getFiltered();

  return (
    <div className="space-y-6 text-left pb-16">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Parking Management</h1>
        <p className="text-xs text-slate-500 mt-1">Verify new properties listings and monitor space availabilities</p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row justify-between gap-4 select-none">
        <div className="flex-grow max-w-md flex items-center gap-2 border border-slate-250 rounded-xl px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:border-parkgreen transition-colors">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent"
            placeholder="Search spaces by spot title or owner name..."
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-250 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending">Pending Verification</option>
            <option value="Suspended">Suspended Listings</option>
          </select>
        </div>
      </div>

      {/* Spaces Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-medium text-slate-505 text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] font-bold">
                <th className="py-4 pl-6">Parking Spot Details</th>
                <th className="py-4">Listed Owner</th>
                <th className="py-4">City</th>
                <th className="py-4">Pricing</th>
                <th className="py-4">Verification</th>
                <th className="py-4 text-right pr-6">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((space) => (
                <tr key={space.id} className="hover:bg-slate-55 transition-colors">
                  <td className="py-4 pl-6 flex items-center gap-3">
                    <img src={space.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border shrink-0" />
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-800 text-sm leading-none truncate max-w-xs">{space.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1 truncate max-w-xs">{space.address}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-slate-800">{space.hostName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Space Category: {space.parkingType}</p>
                  </td>
                  <td className="py-4 font-semibold text-slate-700">{space.city}</td>
                  <td className="py-4 font-black text-slate-850">₹{space.price}/hr</td>
                  <td className="py-4">
                    <Badge status={space.isVerified ? 'Verified' : 'Pending'} />
                  </td>
                  <td className="py-4 text-right pr-6">
                    <div className="flex justify-end gap-2">
                      {!space.isVerified ? (
                        <button
                          onClick={() => handleVerify(space.id, true)}
                          className="px-3 py-1.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={12} /> Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerify(space.id, false)}
                          className="px-3 py-1.5 border border-red-200 text-red-650 hover:bg-red-50 text-xs font-bold rounded-lg transition-all"
                        >
                          Revoke Verification
                        </button>
                      )}

                      <button
                        onClick={() => toggleSpaceAvailability(space.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          space.isDisabled
                            ? 'bg-green-50 border-green-200 text-parkgreen'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {space.isDisabled ? 'Resume' : 'Suspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">No listed spaces matching filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ParkingManagement;
