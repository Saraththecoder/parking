import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import MapPlaceholder from '../../components/MapPlaceholder';
import StarRating from '../../components/StarRating';
import { Search as SearchIcon, Filter, Map, List, Calendar, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { spaces } = useApp();

  // Search input values from query params or default
  const [searchInput, setSearchInput] = useState(searchParams.get('city') || 'Bangalore');
  const [selectedVehicleType, setSelectedVehicleType] = useState(searchParams.get('vehicle') || 'Hatchback / Sedan');
  const [priceRange, setPriceRange] = useState(200); // Max price limit slider
  const [minRating, setMinRating] = useState(null); // null, 4.0, 4.5
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedParkingType, setSelectedParkingType] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [highlightedSpaceId, setHighlightedSpaceId] = useState(null);

  // Mobile layout toggling: 'list' or 'map'
  const [mobileView, setMobileView] = useState('list');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync state if query params change
  useEffect(() => {
    const city = searchParams.get('city');
    if (city) setSearchInput(city);
    const vehicle = searchParams.get('vehicle');
    if (vehicle) setSelectedVehicleType(vehicle);
    const type = searchParams.get('type');
    if (type) setSelectedParkingType(type);
  }, [searchParams]);

  // Handle amenities checking
  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Perform client-side filter
  const getFilteredSpaces = () => {
    let result = spaces.filter(space => !space.isDisabled);

    // City Match (case insensitive partial match)
    if (searchInput) {
      result = result.filter(space =>
        space.city.toLowerCase().includes(searchInput.toLowerCase()) ||
        space.address.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // Vehicle Type Match (space must support this vehicle)
    if (selectedVehicleType) {
      result = result.filter(space =>
        space.vehicleTypes.includes(selectedVehicleType)
      );
    }

    // Parking Category Match
    if (selectedParkingType !== 'All') {
      result = result.filter(space =>
        space.parkingType === selectedParkingType
      );
    }

    // Price Filter
    result = result.filter(space => space.price <= priceRange);

    // Rating Filter
    if (minRating) {
      if (minRating === 'Top Host') {
        result = result.filter(space => space.rating >= 4.8 && space.isVerified);
      } else {
        result = result.filter(space => space.rating >= parseFloat(minRating));
      }
    }

    // Amenities Filter
    if (selectedAmenities.length > 0) {
      result = result.filter(space =>
        selectedAmenities.every(amenity => space.amenities.includes(amenity))
      );
    }

    // Sorting logic
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Distance') {
      result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    return result;
  };

  const filteredSpaces = getFilteredSpaces();

  const handleBookNow = (spaceId) => {
    navigate(`/seeker/parking/${spaceId}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-84px)] -m-6 overflow-hidden">
      
      {/* Top Search Action Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <div className="w-full md:w-auto flex-1 flex items-center gap-2 border border-slate-250 rounded-xl px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:border-parkgreen transition-colors">
          <SearchIcon size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent"
            placeholder="Search city, e.g. Indiranagar, Hitech City..."
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-600">
            <ArrowUpDown size={14} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer border-none font-semibold text-slate-700"
            >
              <option value="Recommended">Recommended</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Rating">Top Rated</option>
              <option value="Distance">Nearest</option>
            </select>
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 border border-slate-250 text-slate-600 text-xs font-bold rounded-xl active:scale-95 transition-all"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          {/* Mobile Toggle List/Map View */}
          <div className="md:hidden flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
            <button
              onClick={() => setMobileView('list')}
              className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                mobileView === 'list' ? 'bg-white text-parkgreen shadow-sm' : 'text-slate-500'
              }`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                mobileView === 'map' ? 'bg-white text-parkgreen shadow-sm' : 'text-slate-500'
              }`}
            >
              <Map size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Core Layout: Double pane */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side Filter Panel (Sidebar - Desktop only, or mobile slide overlay) */}
        <aside
          className={`w-64 bg-white border-r border-slate-250 flex flex-col p-6 overflow-y-auto shrink-0 select-none ${
            showFiltersMobile ? 'fixed inset-0 z-40 md:relative md:z-auto block' : 'hidden md:block'
          }`}
        >
          {/* Header Mobile Filter */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5 md:hidden">
            <h3 className="font-bold text-slate-800">Filter Spots</h3>
            <button
              onClick={() => setShowFiltersMobile(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Done
            </button>
          </div>

          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filters</h3>
              <button
                onClick={() => {
                  setSelectedVehicleType('Hatchback / Sedan');
                  setPriceRange(200);
                  setMinRating(null);
                  setSelectedAmenities([]);
                  setSelectedParkingType('All');
                  toast.success("Filters cleared.");
                }}
                className="text-[10px] font-bold text-parkgreen hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Vehicle Selection */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Vehicle Type</h4>
              <div className="space-y-2">
                {['Hatchback / Sedan', 'SUV / Luxury', '2-Wheeler'].map((type) => (
                  <label key={type} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="vehicleType"
                      checked={selectedVehicleType === type}
                      onChange={() => setSelectedVehicleType(type)}
                      className="text-parkgreen focus:ring-parkgreen border-slate-300"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                <span>Price (per hour)</span>
                <span className="text-parkgreen">Max: ₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="5"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-parkgreen h-1.5 bg-slate-100 rounded-lg cursor-pointer appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1.5">
                <span>₹20</span>
                <span>₹200</span>
              </div>
            </div>

            {/* Min Rating */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Minimum Rating</h4>
              <div className="flex flex-wrap gap-1.5">
                {['4.0', '4.5', 'Top Host'].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setMinRating(minRating === rate ? null : rate)}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      minRating === rate
                        ? 'bg-parkgreen text-white border-parkgreen font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-350'
                    }`}
                  >
                    {rate} {rate !== 'Top Host' ? '★+' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Parking space types */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Listing Category</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {['All', 'Residential', 'Commercial'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedParkingType(cat)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      selectedParkingType === cat
                        ? 'border-parkgreen text-parkgreen bg-green-50/50 font-bold'
                        : 'border-slate-200 text-slate-500 hover:border-slate-350'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities checklist */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Amenities</h4>
              <div className="space-y-2">
                {['CCTV Surveillance', 'Covered Parking', 'EV Charging', '24/7 Security', 'Gated Entry'].map((amenity) => {
                  const checked = selectedAmenities.includes(amenity);
                  return (
                    <label key={amenity} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleAmenityChange(amenity)}
                        className="rounded border-slate-300 text-parkgreen focus:ring-parkgreen"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        </aside>

        {/* Results Listings column (Middle/Left) */}
        <section
          className={`flex-1 flex flex-col p-6 overflow-y-auto ${
            mobileView === 'list' ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="text-left mb-5">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Available Spots in {searchInput}</h2>
            <p className="text-xs text-slate-500 mt-1">{filteredSpaces.length} spots matched your criteria</p>
          </div>

          {/* Space Card list grid */}
          <div className="space-y-4">
            {filteredSpaces.map((space) => {
              const isSelected = highlightedSpaceId === space.id;
              return (
                <div
                  key={space.id}
                  onMouseEnter={() => setHighlightedSpaceId(space.id)}
                  onMouseLeave={() => setHighlightedSpaceId(null)}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row gap-5 hover:shadow-soft transition-all duration-300 text-left ${
                    isSelected ? 'border-parkgreen ring-1 ring-green-100 shadow-soft' : 'border-slate-200'
                  }`}
                >
                  {/* Photo area */}
                  <div className="w-full sm:w-44 aspect-[4/3] rounded-xl overflow-hidden shrink-0 bg-slate-100 relative">
                    <img
                      src={space.images[0]}
                      alt={space.name}
                      className="w-full h-full object-cover"
                    />
                    {space.isVerified && (
                      <span className="absolute top-2.5 left-2.5 bg-green-50 text-parkgreen border border-green-200 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                        Verified Host
                      </span>
                    )}
                    {space.isInstantBooking && (
                      <span className="absolute top-2.5 right-2.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shadow-sm">
                        ⚡ Instant
                      </span>
                    )}
                  </div>

                  {/* Info details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base tracking-tight truncate hover:text-parkgreen transition-colors cursor-pointer" onClick={() => handleBookNow(space.id)}>
                          {space.name}
                        </h3>
                        <div className="flex items-center gap-0.5 text-xs font-semibold text-slate-800">
                          <StarRating rating={space.rating} size={12} />
                          <span className="text-[10px] text-slate-400 font-medium ml-1">({space.reviewsCount})</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 truncate">{space.address}</p>
                      
                      {/* Amenities pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {space.amenities.slice(0, 3).map((amenity) => (
                          <span key={amenity} className="bg-slate-50 text-slate-500 border border-slate-150 px-2 py-0.5 rounded text-[10px] font-semibold">
                            {amenity}
                          </span>
                        ))}
                        {space.amenities.length > 3 && (
                          <span className="bg-slate-50 text-slate-400 border border-slate-150 px-2 py-0.5 rounded text-[10px] font-semibold">
                            +{space.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Hourly Price</p>
                        <p className="text-lg font-black text-slate-800 mt-0.5">₹{space.price}<span className="text-xs font-semibold text-slate-400">/hr</span></p>
                      </div>
                      
                      <button
                        onClick={() => handleBookNow(space.id)}
                        className="px-5 py-2.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}

            {filteredSpaces.length === 0 && (
              <div className="py-20 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <SlidersHorizontal size={32} className="mx-auto text-slate-300" />
                <p className="font-bold text-slate-600 mt-4">No parking spots found</p>
                <p className="text-xs mt-1 text-slate-400">Try adjusting your filters or searching a different area.</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Map visual pane (Desktop side map, or mobile map overlay) */}
        <section
          className={`w-full md:w-[450px] lg:w-[500px] border-l border-slate-200 h-full shrink-0 ${
            mobileView === 'map' ? 'block' : 'hidden md:block'
          }`}
        >
          <MapPlaceholder
            spaces={filteredSpaces}
            selectedSpaceId={highlightedSpaceId}
            onPinClick={(id) => {
              setHighlightedSpaceId(id);
              // Scroll to card
              toast.success("Spot highlighted on list!");
            }}
            variant="search"
          />
        </section>

      </div>

    </div>
  );
};

export default Search;
