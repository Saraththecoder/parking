import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/Badge';
import { Plus, Eye, Trash2, Sliders, CalendarClock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const MySpaces = () => {
  const navigate = useNavigate();
  const { currentUser, spaces, bookings, toggleSpaceAvailability, deleteParkingSpace } = useApp();

  // Filter listings belonging to this host
  const hostSpaces = spaces.filter(s => s.hostId === currentUser.id);

  const getSpaceBookingCount = (spaceId) => {
    return bookings.filter(b => b.spaceId === spaceId).length;
  };

  const handleDelete = (spaceId) => {
    if (window.confirm("Are you sure you want to delete this parking spot listing permanently?")) {
      deleteParkingSpace(spaceId);
    }
  };

  return (
    <div className="space-y-6 text-left pb-16">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Listed Spaces</h1>
          <p className="text-xs text-slate-500 mt-1">Manage physical slots availability and parameters</p>
        </div>

        <Link
          to="/owner/add"
          className="px-4 py-2.5 bg-parkgreen hover:bg-parkgreen-hover text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} /> Add New Parking
        </Link>
      </div>

      {/* Grid of Spaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostSpaces.map((space) => {
          const bookingCount = getSpaceBookingCount(space.id);
          return (
            <div
              key={space.id}
              className={`bg-white rounded-2xl border p-4 hover:shadow-soft transition-all flex flex-col justify-between ${
                space.isDisabled ? 'border-slate-200 opacity-75' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3.5 bg-slate-100">
                  <img src={space.images[0]} alt="" className="w-full h-full object-cover" />
                  
                  {/* Status badges overlay */}
                  <span className={`absolute top-2.5 left-2.5 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm border ${
                    space.isVerified
                      ? 'bg-green-50 text-parkgreen border-green-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {space.isVerified ? 'Verified' : 'Verification Pending'}
                  </span>

                  <span className="absolute bottom-2.5 right-2.5 bg-slate-950/80 text-white font-bold text-xs px-2 py-0.5 rounded border border-slate-700">
                    ₹{space.price}/hr
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-800 text-sm truncate">{space.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 truncate"><MapPin size={12} /> {space.address}</p>
                </div>

                <div className="border-t border-slate-105 my-3" />

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Bookings</p>
                    <p className="text-slate-800 font-bold mt-0.5">{bookingCount} reservations</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Category</p>
                    <p className="text-slate-800 font-bold mt-0.5">{space.parkingType}</p>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSpaceAvailability(space.id)}
                    className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                      space.isDisabled ? 'bg-slate-200' : 'bg-parkgreen'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
                        space.isDisabled ? 'translate-x-0' : 'translate-x-3'
                      }`}
                    />
                  </button>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Online</span>
                </div>

                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => navigate(`/seeker/parking/${space.id}`)}
                    className="p-2 border border-slate-200 hover:bg-slate-55 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
                    title="View Spot details"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(space.id)}
                    className="p-2 border border-red-205 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition-colors"
                    title="Delete spot"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

            </div>
          );
        })}

        {hostSpaces.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 border border-dashed border-slate-200 bg-white rounded-3xl">
            <CalendarClock size={36} className="mx-auto text-slate-300" />
            <p className="font-bold text-slate-600 mt-4">No listed parking spots found</p>
            <p className="text-xs mt-1 text-slate-400">Click on "Add New Parking" to list your first space.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default MySpaces;
