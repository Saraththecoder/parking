import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/Badge';
import { Search, ShieldAlert, Shield, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const { users, setCurrentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [userList, setUserList] = useState(users);

  // Toggle user active status
  const toggleUserStatus = (userId) => {
    setUserList(userList.map(user => {
      if (user.id === userId) {
        const updated = { ...user, isSuspended: !user.isSuspended };
        toast.success(updated.isSuspended ? `User ${user.name} suspended` : `User ${user.name} restored active`);
        return updated;
      }
      return user;
    }));
  };

  const getFilteredUsers = () => {
    return userList.filter(user => {
      const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === 'All' ? true : user.role === roleFilter.toLowerCase();
      return matchSearch && matchRole;
    });
  };

  const filtered = getFilteredUsers();

  return (
    <div className="space-y-6 text-left pb-16">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
        <p className="text-xs text-slate-500 mt-1">Review profiles, update roles, and manage active platform accounts</p>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row justify-between gap-4 select-none">
        <div className="flex-grow max-w-md flex items-center gap-2 border border-slate-250 rounded-xl px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:border-parkgreen transition-colors">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent"
            placeholder="Search users by name or email..."
          />
        </div>

        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-250 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value="Seeker">Drivers / Seekers</option>
            <option value="Owner">Space Hosts / Owners</option>
            <option value="Admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-medium text-slate-500 text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] font-bold">
                <th className="py-4 pl-6">Profile Details</th>
                <th className="py-4">Role</th>
                <th className="py-4">Phone Number</th>
                <th className="py-4">Status</th>
                <th className="py-4 text-right pr-6">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pl-6 flex items-center gap-3">
                    <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover border" />
                    <div>
                      <p className="font-extrabold text-slate-800 text-sm leading-none">{user.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 capitalize font-semibold">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      user.role === 'admin'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : user.role === 'owner'
                          ? 'bg-blue-50 text-info border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 font-mono font-semibold">{user.phone || 'N/A'}</td>
                  <td className="py-4">
                    <Badge status={user.isSuspended ? 'Suspended' : 'Active'} />
                  </td>
                  <td className="py-4 text-right pr-6">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`font-semibold text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        user.isSuspended
                          ? 'bg-green-50 border-green-200 text-parkgreen hover:bg-green-100'
                          : 'bg-red-50 border-red-200 text-red-650 hover:bg-red-100'
                      }`}
                    >
                      {user.isSuspended ? 'Activate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">No users found matching filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default UserManagement;
