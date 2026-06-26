import React, { useState } from 'react';
import { Plus, Minus, Navigation, MapPin } from 'lucide-react';

const MapPlaceholder = ({
  spaces = [],
  selectedSpaceId = null,
  onPinClick = () => {},
  variant = 'search' // 'search' or 'dashboard'
}) => {
  const [zoom, setZoom] = useState(14);
  const [isLocating, setIsLocating] = useState(false);

  const handleRecenter = () => {
    setIsLocating(true);
    setTimeout(() => setIsLocating(false), 1200);
  };

  if (variant === 'dashboard') {
    return (
      <div className="relative w-full h-[300px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-premium">
        {/* Animated Perspective Grid */}
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px]" style={{ transform: 'perspective(500px) rotateX(60deg) translateY(-50px) scale(1.5)' }} />
        
        {/* Radar scan / pulse overlay */}
        <div className="absolute inset-0 bg-radial-gradient-radar pointer-events-none" />

        {/* Floating Pins */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-32">
            {/* Center dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="flex h-6 w-6 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-parkgreen opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-parkgreen-hover border-2 border-white shadow-lg"></span>
              </span>
            </div>
            
            {/* Spot 1 */}
            <div className="absolute left-[20%] top-[40%] text-center animate-bounce-slow">
              <MapPin size={24} className="text-parkgreen fill-parkgreen-light drop-shadow-[0_0_10px_rgba(22,163,74,0.5)]" />
              <div className="bg-slate-950/80 text-[10px] text-white px-1.5 py-0.5 rounded border border-slate-700 font-semibold mt-1">₹35/hr</div>
            </div>

            {/* Spot 2 */}
            <div className="absolute right-[25%] top-[20%] text-center animate-bounce-normal">
              <MapPin size={24} className="text-parkgreen fill-parkgreen-light drop-shadow-[0_0_10px_rgba(22,163,74,0.5)]" />
              <div className="bg-slate-950/80 text-[10px] text-white px-1.5 py-0.5 rounded border border-slate-700 font-semibold mt-1">₹45/hr</div>
            </div>

            {/* Spot 3 */}
            <div className="absolute right-[40%] bottom-[10%] text-center animate-bounce-fast">
              <MapPin size={24} className="text-parkgreen fill-parkgreen-light drop-shadow-[0_0_10px_rgba(22,163,74,0.5)]" />
              <div className="bg-slate-950/80 text-[10px] text-white px-1.5 py-0.5 rounded border border-slate-700 font-semibold mt-1">₹60/hr</div>
            </div>
          </div>
        </div>

        {/* Locating HUD indicator */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur shadow-md px-3.5 py-2 rounded-lg border border-slate-100 flex items-center gap-2">
          <Navigation size={14} className={`text-parkgreen ${isLocating ? 'animate-spin' : ''}`} />
          <span className="text-xs font-semibold text-slate-800">
            {isLocating ? 'Re-centering GPS...' : 'Locating you...'}
          </span>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
          <button onClick={handleRecenter} className="bg-white hover:bg-slate-50 text-slate-700 p-2 rounded-lg shadow-md border border-slate-150 transition-colors">
            <Navigation size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Search Map View
  return (
    <div className="relative w-full h-full bg-slate-50 overflow-hidden border border-slate-200">
      {/* City Street Simulation Grid */}
      <svg className="absolute inset-0 w-full h-full text-slate-200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="street-grid" width="160" height="160" patternUnits="userSpaceOnUse">
            {/* Streets */}
            <path d="M 0 40 L 160 40 M 0 120 L 160 120 M 40 0 L 40 160 M 120 0 L 120 160" fill="none" stroke="currentColor" strokeWidth="20" />
            <path d="M 0 40 L 160 40 M 0 120 L 160 120 M 40 0 L 40 160 M 120 0 L 120 160" fill="none" stroke="#fff" strokeWidth="8" />
            {/* Expressways */}
            <line x1="80" y1="0" x2="80" y2="160" stroke="#fef08a" strokeWidth="6" strokeDasharray="6,4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#f1f5f9" />
        <rect width="100%" height="100%" fill="url(#street-grid)" />
        
        {/* Park / Greenery Areas */}
        <circle cx="280" cy="180" r="70" fill="#dcfce7" className="opacity-70" />
        <rect x="50" y="450" width="140" height="90" rx="10" fill="#dcfce7" className="opacity-70" />
        
        {/* Water body */}
        <path d="M -50 80 Q 80 150 150 50 T 400 120 L 400 0 L -50 0 Z" fill="#e0f2fe" />
      </svg>

      {/* Render Active Parking Pins */}
      <div className="absolute inset-0">
        {spaces.filter(s => !s.isDisabled).map((space) => {
          const isSelected = selectedSpaceId === space.id;
          return (
            <button
              key={space.id}
              onClick={() => onPinClick(space.id)}
              className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{
                left: `${space.lng || 50}%`,
                top: `${space.lat || 50}%`,
                zIndex: isSelected ? 40 : 20
              }}
            >
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm shadow-md border transition-all ${
                  isSelected
                    ? 'bg-parkgreen text-white border-parkgreen scale-110 ring-4 ring-green-100'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-parkgreen'
                }`}
              >
                <span>₹{space.price}</span>
                <span className={`text-[10px] uppercase font-semibold px-1 rounded ${isSelected ? 'bg-parkgreen-dark text-green-200' : 'bg-slate-100 text-slate-500'}`}>
                  {space.parkingType === 'Residential' ? 'Res' : 'Com'}
                </span>
              </div>
              
              {/* Pin indicator pointer */}
              <div className={`w-2 h-2 rotate-45 mx-auto -mt-1 border-r border-b ${
                isSelected ? 'bg-parkgreen border-parkgreen' : 'bg-white border-slate-200'
              }`} />
            </button>
          );
        })}
      </div>

      {/* Floating HUD controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <button onClick={handleRecenter} className="bg-white hover:bg-slate-50 text-slate-700 p-2.5 rounded-xl shadow-lg border border-slate-150 transition-all active:scale-95">
          <Navigation size={18} className="fill-slate-600 text-slate-600" />
        </button>
        <div className="flex flex-col rounded-xl shadow-lg border border-slate-150 bg-white overflow-hidden">
          <button onClick={() => setZoom(z => Math.min(z + 1, 18))} className="hover:bg-slate-50 text-slate-700 p-2.5 transition-colors border-b border-slate-100">
            <Plus size={18} />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 1, 10))} className="hover:bg-slate-50 text-slate-700 p-2.5 transition-colors">
            <Minus size={18} />
          </button>
        </div>
      </div>
      
      {/* Zoom / Scale visual info */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
        Map Scale: {zoom}x | Indiranagar GPS
      </div>
    </div>
  );
};

export default MapPlaceholder;
