import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ChevronRight, ArrowLeft, Plus, Trash2, ShieldCheck, MapPin, DollarSign, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const AddSpace = () => {
  const navigate = useNavigate();
  const { addParkingSpace } = useApp();

  const [step, setStep] = useState(1);

  // Form parameters state
  const [name, setName] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [address, setAddress] = useState('');
  const [parkingType, setParkingType] = useState('Residential');
  
  const [price, setPrice] = useState(40);
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState(['CCTV Surveillance']);
  const [vehicleTypes, setVehicleTypes] = useState(['Hatchback / Sedan']);

  const [newRule, setNewRule] = useState('');
  const [rules, setRules] = useState([
    "Only registered vehicles allowed",
    "Maintain low speed on ramp"
  ]);
  const [imagePlaceholder, setImagePlaceholder] = useState('https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800');

  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleVehicleToggle = (type) => {
    if (vehicleTypes.includes(type)) {
      setVehicleTypes(vehicleTypes.filter(t => t !== type));
    } else {
      setVehicleTypes([...vehicleTypes, type]);
    }
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const handleRemoveRule = (index) => {
    setRules(rules.filter((_, idx) => idx !== index));
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!name || !address || !description) {
      toast.error("Please fill in listing details.");
      return;
    }

    const spaceData = {
      name,
      city,
      address,
      price: parseFloat(price),
      parkingType,
      description,
      amenities: selectedAmenities,
      vehicleTypes,
      rules,
      image: imagePlaceholder,
      cancellationPolicy: "Free cancellation up to 1 hour before booking start time."
    };

    addParkingSpace(spaceData);
    navigate('/owner/spaces');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left pb-16">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">List Your Parking Spot</h1>
          <p className="text-xs text-slate-500 mt-1">Setup your listing profile in three easy steps</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
          <span className={step >= 1 ? 'text-parkgreen font-bold' : ''}>1. Info</span>
          <ChevronRight size={12} />
          <span className={step >= 2 ? 'text-parkgreen font-bold' : ''}>2. Setup</span>
          <ChevronRight size={12} />
          <span className={step === 3 ? 'text-parkgreen font-bold' : ''}>3. Guidelines</span>
        </div>
      </div>

      {/* STEP 1: Basic Info */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-5">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-4">Step 1: Spot Location & Type</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Listing Title / Spot Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Prestige Gated Cellar Parking"
                className="w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-xs font-bold outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Select City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-parkgreen rounded-xl text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Tirupati">Tirupati</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Listing Category</label>
                <select
                  value={parkingType}
                  onChange={(e) => setParkingType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-parkgreen rounded-xl text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="Residential">Residential (Driveways/Bungalows)</option>
                  <option value="Commercial">Commercial (Office Cellars/Hubs)</option>
                  <option value="Monthly">Monthly Subscriptions Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Physical Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <MapPin size={16} />
                </span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="e.g. 10th Cross Road, HAL 2nd Stage, Indiranagar, Bangalore"
                  className="pl-10 w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-xs font-bold outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 mt-6">
            <button
              type="button"
              onClick={() => {
                if (!name.trim() || !address.trim()) {
                  toast.error("Please fill in required fields.");
                  return;
                }
                setStep(2);
              }}
              className="px-5 py-2.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Pricing & Amenities */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-5">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-4">Step 2: Pricing & Setup</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Hourly Pricing Rate (₹/hr)</label>
              <div className="relative max-w-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="10"
                  max="500"
                  required
                  className="pl-7 w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-xs font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Spot Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe your parking layout (e.g., clearance limits, proximity to main streets, security guards presence)..."
                className="w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-parkgreen rounded-xl text-xs font-medium outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Offered Amenities</label>
              <div className="flex flex-wrap gap-2 select-none">
                {['CCTV Surveillance', 'Covered Parking', 'EV Charging', '24/7 Security', 'Gated Entry'].map((amenity) => {
                  const active = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                        active
                          ? 'border-parkgreen bg-green-50/50 text-parkgreen font-bold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-350'
                      }`}
                    >
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Supported Vehicles</label>
              <div className="flex gap-3 select-none">
                {['Hatchback / Sedan', 'SUV / Luxury', '2-Wheeler'].map((type) => {
                  const active = vehicleTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleVehicleToggle(type)}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                        active
                          ? 'border-parkgreen bg-green-50 text-parkgreen shadow-sm'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-350'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 mt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!description.trim() || vehicleTypes.length === 0) {
                  toast.error("Please fill in description and select at least one vehicle type.");
                  return;
                }
                setStep(3);
              }}
              className="px-5 py-2.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Guidelines</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Rules & Photo Upload Simulator */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-5">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-4">Step 3: Guidelines & Confirmation</h3>

          <div className="space-y-5">
            {/* Photo simulator */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Property Listing Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imagePlaceholder}
                  onChange={(e) => setImagePlaceholder(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 focus:border-parkgreen rounded-xl text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePlaceholder("https://images.unsplash.com/photo-1506521788701-1e13a4e83f2a?w=800");
                    toast.success("Loaded clean basement photo!");
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Defaults
                </button>
              </div>
              <div className="aspect-video max-w-sm rounded-xl overflow-hidden border border-slate-150 mt-3.5 bg-slate-50 flex items-center justify-center text-slate-400">
                {imagePlaceholder ? (
                  <img src={imagePlaceholder} alt="Listing Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <Image size={24} className="mx-auto" />
                    <p className="text-[10px]">Preview will load here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rules manager */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Configure Spot Rules</label>
              <form onSubmit={handleAddRule} className="flex gap-2">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="e.g. Only 4-wheelers allowed"
                  className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 focus:border-parkgreen rounded-xl text-xs outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center cursor-pointer"
                >
                  Add Rule
                </button>
              </form>

              <div className="space-y-2 mt-4 select-none">
                {rules.map((rule, index) => (
                  <div key={index} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-150 rounded-lg text-xs">
                    <span className="font-semibold text-slate-700">{rule}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 mt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-5 py-2.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck size={14} />
              <span>List Space</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddSpace;
