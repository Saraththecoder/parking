import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';
import { User, Car, MapPin, Edit3, Save, Plus, LogOut, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, addVehicle, addSavedAddress, setCurrentUser, users } = useApp();

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [phoneInput, setPhoneInput] = useState(currentUser.phone);

  // New Vehicle Dialog state
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [newVehicleNumber, setNewVehicleNumber] = useState('');
  const [newVehicleName, setNewVehicleName] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('Hatchback / Sedan');

  // New Address Dialog state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressLine, setNewAddressLine] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !phoneInput.trim()) {
      toast.error("Please fill in profile details.");
      return;
    }
    
    // Update locally in Context
    currentUser.name = nameInput;
    currentUser.phone = phoneInput;
    
    toast.success("Profile details saved!");
    setIsEditing(false);
  };

  const handleAddVehicleSubmit = (e) => {
    e.preventDefault();
    if (!newVehicleNumber || !newVehicleName) {
      toast.error("Please fill in vehicle details.");
      return;
    }
    // Indian Registration plate validation check
    const cleanNumber = newVehicleNumber.toUpperCase().replace(/\s+/g, '');
    addVehicle(cleanNumber, newVehicleType, newVehicleName);
    setVehicleModalOpen(false);
    // Reset
    setNewVehicleNumber('');
    setNewVehicleName('');
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddressLabel || !newAddressLine) {
      toast.error("Please fill in address details.");
      return;
    }
    addSavedAddress(newAddressLabel, newAddressLine);
    setAddressModalOpen(false);
    setNewAddressLabel('');
    setNewAddressLine('');
  };

  return (
    <div className="space-y-6 text-left pb-16">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage vehicles, addresses, and account details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Personal Details Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Info</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-parkgreen hover:underline flex items-center gap-1 cursor-pointer"
            >
              {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="flex justify-center pb-2">
              <img
                src={currentUser.avatar}
                alt=""
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
              <input
                type="text"
                value={nameInput}
                disabled={!isEditing}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 disabled:bg-slate-50/30 border border-slate-200 focus:border-parkgreen rounded-xl text-xs font-bold text-slate-800 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
              <input
                type="text"
                value={phoneInput}
                disabled={!isEditing}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 disabled:bg-slate-50/30 border border-slate-200 focus:border-parkgreen rounded-xl text-xs font-bold text-slate-800 outline-none transition-colors"
              />
            </div>

            {isEditing && (
              <button
                type="submit"
                className="w-full py-2.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Save Details
              </button>
            )}
          </form>
        </div>

        {/* Vehicles list Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Vehicles</h3>
            <button
              onClick={() => setVehicleModalOpen(true)}
              className="text-xs font-bold text-parkgreen hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="space-y-3">
            {currentUser.vehicles?.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <Car size={18} className="text-slate-400 shrink-0" />
                <div className="flex-grow min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{v.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">{v.number} | {v.type}</p>
                </div>
              </div>
            ))}

            {(!currentUser.vehicles || currentUser.vehicles.length === 0) && (
              <p className="text-xs text-slate-450 text-center py-6">No vehicles registered yet.</p>
            )}
          </div>
        </div>

        {/* Saved Addresses list Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Addresses</h3>
            <button
              onClick={() => setAddressModalOpen(true)}
              className="text-xs font-bold text-parkgreen hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="space-y-3">
            {currentUser.savedAddresses?.map((addr) => (
              <div key={addr.id} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800">{addr.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">{addr.address}</p>
                </div>
              </div>
            ))}

            {(!currentUser.savedAddresses || currentUser.savedAddresses.length === 0) && (
              <p className="text-xs text-slate-450 text-center py-6">No saved addresses.</p>
            )}
          </div>
        </div>

      </div>

      {/* Logout button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => {
            toast.success("Signed out successfully.");
            navigate('/login');
          }}
          className="flex items-center gap-1.5 px-5 py-3 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          <LogOut size={16} /> Sign Out Account
        </button>
      </div>

      {/* Add Vehicle Modal Dialog */}
      <Modal isOpen={vehicleModalOpen} onClose={() => setVehicleModalOpen(false)} title="Register a New Vehicle">
        <form onSubmit={handleAddVehicleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Vehicle Nickname / Model</label>
            <input
              type="text"
              value={newVehicleName}
              onChange={(e) => setNewVehicleName(e.target.value)}
              placeholder="e.g. Honda City (Black)"
              required
              className="w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-250 focus:border-parkgreen rounded-xl text-xs font-bold outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Registration Number (India Format)</label>
            <input
              type="text"
              value={newVehicleNumber}
              onChange={(e) => setNewVehicleNumber(e.target.value)}
              placeholder="e.g. KA03MJ4567"
              required
              className="w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-250 focus:border-parkgreen rounded-xl text-xs font-mono font-bold uppercase outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vehicle Classification</label>
            <div className="grid grid-cols-3 gap-2">
              {['Hatchback / Sedan', 'SUV / Luxury', '2-Wheeler'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNewVehicleType(type)}
                  className={`py-2 text-[10px] font-bold rounded-xl border transition-all ${
                    newVehicleType === type
                      ? 'border-parkgreen bg-green-50 text-parkgreen font-semibold'
                      : 'border-slate-200 text-slate-500 hover:border-slate-350'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setVehicleModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Register Vehicle
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Address Modal Dialog */}
      <Modal isOpen={addressModalOpen} onClose={() => setAddressModalOpen(false)} title="Save a New Address">
        <form onSubmit={handleAddAddressSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address Label (Tag)</label>
            <input
              type="text"
              value={newAddressLabel}
              onChange={(e) => setNewAddressLabel(e.target.value)}
              placeholder="e.g. Gym, Friend's House"
              required
              className="w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-250 focus:border-parkgreen rounded-xl text-xs font-bold outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Address Location</label>
            <input
              type="text"
              value={newAddressLine}
              onChange={(e) => setNewAddressLine(e.target.value)}
              placeholder="e.g. 5th Block, Koramangala, Bangalore"
              required
              className="w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-250 focus:border-parkgreen rounded-xl text-xs font-bold outline-none transition-colors"
            />
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAddressModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Save Address
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Profile;
