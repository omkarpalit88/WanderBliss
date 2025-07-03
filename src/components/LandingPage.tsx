// src/components/LandingPage.tsx
import React from 'react';
import { Plane, Wallet, ClipboardList, ArrowRight } from 'lucide-react';

// You can pass a function from App.tsx to handle the navigation
interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  // Define colors for easy reuse - Reverted to the first color scheme
  const colors = {
    brightYellow: '#FFD43A',
    sunsetOrange: '#FF5841',
    pastelPurple: '#C5ADC5',
    white: '#FFFFFF',
    darkText: '#2D3748', // A dark gray for readability
  };

  return (
    <div style={{ backgroundColor: colors.white, color: colors.darkText }} className="min-h-screen font-sans">
      {/* Header */}
      <header className="p-4 md:p-6 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: colors.sunsetOrange }}>
          WanderBliss
        </h1>
        <button
          onClick={onLoginClick}
          className="font-semibold py-2 px-5 rounded-lg transition-transform transform hover:scale-105"
          style={{ backgroundColor: colors.brightYellow, color: colors.darkText }}
        >
          Login / Sign Up
        </button>
      </header>

      <main>
        {/* Hero Section */}
        <section className="text-center py-20 px-4" style={{ backgroundColor: '#FFFBF0' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4" style={{ color: colors.darkText }}>
              From Dream to Destination. <span style={{ color: colors.sunsetOrange }}>Effortlessly.</span>
            </h2>
            <p className="text-lg md:text-xl mb-8 text-gray-600">
              WanderBliss is your all-in-one app for planning unforgettable trips. Collaborate with friends, track expenses, and build the perfect itinerary, all in one place.
            </p>
            <button
              onClick={onLoginClick}
              className="font-bold py-4 px-8 rounded-full text-lg inline-flex items-center gap-2 transition-all transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: colors.sunsetOrange, color: colors.white }}
            >
              Start Planning Now <ArrowRight size={20} />
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">Everything You Need for the Perfect Trip</h3>
            <div className="grid md:grid-cols-3 gap-10 text-center">
              
              {/* Feature 1: Collaborative Planning */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: '#F7F1FF' }}>
                <div className="inline-block p-4 rounded-full mb-4" style={{ backgroundColor: colors.pastelPurple }}>
                  <Plane size={32} style={{ color: colors.white }} />
                </div>
                <h4 className="text-xl font-bold mb-2">Collaborative Itineraries</h4>
                <p className="text-gray-600">
                  Plan your adventure together. Add places to visit, foods to try, and activities in a shared space that updates for everyone in real-time.
                </p>
              </div>

              {/* Feature 2: Expense Splitting */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: '#FFF8E1' }}>
                <div className="inline-block p-4 rounded-full mb-4" style={{ backgroundColor: colors.brightYellow }}>
                  <Wallet size={32} style={{ color: colors.darkText }} />
                </div>
                <h4 className="text-xl font-bold mb-2">Simple Expense Tracking</h4>
                <p className="text-gray-600">
                  Forget the headache of who paid for what. Easily add expenses, see who owes who, and settle up with a single tap.
                </p>
              </div>

              {/* Feature 3: Checklist */}
              <div className="p-6 rounded-2xl" style={{ backgroundColor: '#FFEBE8' }}>
                <div className="inline-block p-4 rounded-full mb-4" style={{ backgroundColor: colors.sunsetOrange }}>
                  <ClipboardList size={32} style={{ color: colors.white }} />
                </div>
                <h4 className="text-xl font-bold mb-2">Organized Checklists</h4>
                <p className="text-gray-600">
                  From packing essentials to must-try restaurants, keep everything organized with simple, satisfying checklists so you never miss a thing.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8" style={{ backgroundColor: '#F9FAFB' }}>
        <p className="text-gray-500">&copy; {new Date().getFullYear()} WanderBliss. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
