// src/components/Home.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, PlusCircle, ArrowLeft, UserCircle, LogOut } from 'lucide-react';

// --- MOCK DATA: In a real app, this would come from your auth context ---
const mockUser = {
  name: 'Omi',
};

interface HomeProps {
  addTrip: (newTrip: any) => Promise<string>;
}

const Home: React.FC<HomeProps> = ({ addTrip }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    const newTrip = {
      name: destination,
      description: `A trip to ${destination}`, // A default description
      startDate: startDate,
      endDate: endDate,
      createdAt: new Date(),
      participants: [],
      expenses: [],
      inspiration: {
        places: [],
        foods: [],
        selectedPlaces: [],
        selectedFoods: [],
      }
    };

    try {
      const newTripId = await addTrip(newTrip);
      navigate(`/trip-planner/${newTripId}`);
    } catch (err: any) {
      console.error("Failed to create trip:", err);
      setError("Could not create the trip. Please try again.");
      setIsCreating(false);
    }
  };
  
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const colors = {
    sunsetOrange: '#FF5841',
    white: '#FFFFFF',
    darkText: '#2D3748',
    lightGrayBg: '#F9FAFB',
  };

  return (
    <div style={{ backgroundColor: colors.lightGrayBg }} className="min-h-screen">
      {/* --- NEW: Consistent Header --- */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: colors.sunsetOrange }}>
            WanderBliss
          </h1>
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
        {/* --- NEW: Back to Dashboard Link --- */}
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>

        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold" style={{color: colors.darkText}}>Create a New Trip</h1>
            <p className="text-gray-600">Where are you dreaming of going next?</p>
          </div>
          <form onSubmit={handleCreateTrip} className="space-y-4 bg-white p-8 rounded-2xl shadow-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text" value={destination} onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2"
                  style={{'--tw-ring-color': colors.sunsetOrange} as React.CSSProperties}
                  placeholder="e.g., Varanasi" required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2" 
                  style={{'--tw-ring-color': colors.sunsetOrange} as React.CSSProperties} required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2" 
                  style={{'--tw-ring-color': colors.sunsetOrange} as React.CSSProperties} required
                />
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button
              type="submit"
              disabled={isCreating}
              className="w-full text-white py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center disabled:bg-opacity-50"
              style={{backgroundColor: colors.sunsetOrange}}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              {isCreating ? 'Creating Trip...' : 'Start Planning'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Home;
