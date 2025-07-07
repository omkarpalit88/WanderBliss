// src/components/Dashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Sun, Trash2, UserCircle, LogOut, Calendar } from 'lucide-react';
import { Trip } from '../types';

interface DashboardProps {
  trips: Trip[];
  deleteTrip: (tripId: string) => Promise<void>;
}

// --- MOCK DATA: In a real app, this would come from your auth context ---
const mockUser = {
  name: 'Omi',
  // You can add an avatar URL here if you have one
  // avatarUrl: 'https://...
};

const Dashboard: React.FC<DashboardProps> = ({ trips, deleteTrip }) => {
  const navigate = useNavigate();

  const handleCreateTrip = () => {
    navigate('/create-trip');
  };

  const handleViewTrip = (tripId: string) => {
    navigate(`/trip-planner/${tripId}`);
  };
  
  const handleLogout = () => {
    // In a real app, you would call your Firebase signOut function here
    console.log("Logout clicked");
    // navigate('/login');
  };

  const handleDeleteClick = async (e: React.MouseEvent, tripId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this trip?')) {
      try {
        await deleteTrip(tripId);
      } catch (error) {
        console.error("Failed to delete trip:", error);
        alert("Could not delete the trip. Please try again.");
      }
    }
  };

  const formatCreatedDate = (trip: any) => {
    // Handle both database field name (created_at) and frontend field name (createdAt)
    const dateValue = trip.created_at || trip.createdAt;
    if (!dateValue) return 'Unknown date';
    
    try {
      return new Date(dateValue).toLocaleDateString();
    } catch (error) {
      return 'Unknown date';
    }
  };

  const formatTripDates = (trip: any) => {
    // Handle both database field names (start_date, end_date) and frontend field names (startDate, endDate)
    const startDate = trip.start_date || trip.startDate;
    const endDate = trip.end_date || trip.endDate;
    
    if (!startDate && !endDate) return null;
    
    try {
      const formatDate = (dateStr: string) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      };
      
      const formattedStart = formatDate(startDate);
      const formattedEnd = formatDate(endDate);
      
      if (formattedStart && formattedEnd) {
        return `${formattedStart} - ${formattedEnd}`;
      } else if (formattedStart) {
        return `From ${formattedStart}`;
      } else if (formattedEnd) {
        return `Until ${formattedEnd}`;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };
  const colors = {
    brightYellow: '#FFD43A',
    sunsetOrange: '#FF5841',
    white: '#FFFFFF',
    darkText: '#2D3748',
    lightGrayBg: '#F9FAFB',
  };

  return (
    <div style={{ backgroundColor: colors.lightGrayBg }} className="min-h-screen">
      
      {/* --- NEW: Branded Header with User Info --- */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* App Logo/Name */}
          <h1 className="text-2xl font-bold" style={{ color: colors.sunsetOrange }}>
            WanderBliss
          </h1>

          {/* User Account Section */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold" style={{color: colors.darkText}}>Welcome, {mockUser.name}!</p>
            </div>
            <UserCircle size={32} className="text-gray-400" />
            <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600" aria-label="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Title and Action Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold" style={{ color: colors.darkText }}>
            Your Trips
          </h2>
          <button
            onClick={handleCreateTrip}
            className="font-semibold py-2 px-5 rounded-lg transition-transform transform hover:scale-105 flex items-center gap-2"
            style={{ backgroundColor: colors.sunsetOrange, color: colors.white }}
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Create New Trip</span>
          </button>
        </div>

        {/* Trips List */}
        <div>
          {trips.length === 0 ? (
            <div className="text-center py-20 px-6 rounded-2xl" style={{ backgroundColor: colors.white }}>
              <Sun size={48} className="mx-auto mb-4" style={{ color: colors.brightYellow }} />
              <h2 className="text-2xl font-semibold mb-2">No Trips Yet!</h2>
              <p className="text-gray-600 mb-6">Your next adventure is waiting. Create a trip to start planning.</p>
              <button
                onClick={handleCreateTrip}
                className="font-semibold py-2 px-5 rounded-lg transition-transform transform hover:scale-105"
                style={{ backgroundColor: colors.sunsetOrange, color: colors.white }}
              >
                Let's Go!
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map(trip => (
                <div
                  key={trip.id}
                  onClick={() => handleViewTrip(trip.id)}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer flex justify-between items-center group"
                >
                  <div>
                    <h3 className="text-xl font-semibold" style={{ color: colors.darkText }}>{trip.name}</h3>
                    <div className="space-y-1">
                      {formatTripDates(trip) && (
                        <p className="text-sm font-medium text-gray-700 flex items-center">
                          <Calendar size={14} className="mr-2" style={{ color: colors.sunsetOrange }} />
                          {formatTripDates(trip)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Created: {formatCreatedDate(trip)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={(e) => handleDeleteClick(e, trip.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                      aria-label="Delete trip"
                    >
                      <Trash2 size={18} />
                    </button>
                    <ChevronRight size={24} className="text-gray-300 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;