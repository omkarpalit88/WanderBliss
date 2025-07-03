// src/App.tsx
import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './supabase'; 
import { Session } from '@supabase/supabase-js';

import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Home from './components/Home'; 
import TripPlanner from './components/TripPlanner';
import { Trip } from './types';

const AppContent = ({ session, trips, isLoading, addTrip, updateTrip, deleteTrip }: {
  session: Session | null;
  trips: Trip[];
  isLoading: boolean;
  addTrip: (newTrip: any) => Promise<string>;
  updateTrip: (updatedTrip: Trip) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#F9FAFB'}}>
            <p className="text-xl font-semibold text-gray-700">Loading WanderBliss...</p>
        </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={!session ? <LandingPage onLoginClick={() => navigate('/login')} /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/login" 
        element={!session ? <Login /> : <Navigate to="/dashboard" />} 
      />
      
      <Route 
        path="/dashboard" 
        element={session ? <Dashboard trips={trips} deleteTrip={deleteTrip} /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/create-trip" 
        element={session ? <Home addTrip={addTrip} /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/trip-planner/:tripId" 
        element={session ? <TripPlanner trips={trips} updateTrip={updateTrip} /> : <Navigate to="/login" />} 
      />
      <Route path="*" element={<Navigate to={session ? "/dashboard" : "/"} />} />
    </Routes>
  );
};

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!session) return;

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trips:', error);
      } else if (data) {
        setTrips(data as Trip[]);
      }
    };

    fetchTrips();
  }, [session]);

  const addTrip = useCallback(async (newTripData: any): Promise<string> => {
    if (!session) throw new Error("User is not authenticated");

    const tripToAdd = {
      ...newTripData,
      user_id: session.user.id,
    };

    const { data, error } = await supabase
      .from('trips')
      .insert([tripToAdd])
      .select()
      .single();

    if (error) {
      console.error('Error adding trip:', error);
      throw error;
    }
    
    setTrips(currentTrips => [data as Trip, ...currentTrips]);
    return data.id;
  }, [session]);
  
  const updateTrip = useCallback(async (updatedTrip: Trip) => {
    const { id, ...tripData } = updatedTrip;
    const { error } = await supabase
      .from('trips')
      .update(tripData)
      .eq('id', id);

    if (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
    
    setTrips(currentTrips => currentTrips.map(trip => trip.id === id ? updatedTrip : trip));
  }, []);

  const deleteTrip = useCallback(async (tripId: string) => {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);

    if (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }

    setTrips(currentTrips => currentTrips.filter(trip => trip.id !== tripId));
  }, []);

  return (
    <Router>
      <div className="App">
        <AppContent 
          session={session}
          trips={trips}
          isLoading={isLoading}
          addTrip={addTrip}
          updateTrip={updateTrip}
          deleteTrip={deleteTrip}
        />
      </div>
    </Router>
  );
}

export default App;
