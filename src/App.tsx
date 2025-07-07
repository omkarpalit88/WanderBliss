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
        element={session ? <Dashboard trips={trips} deleteTrip={deleteTrip} updateTrip={updateTrip} session={session} /> : <Navigate to="/login" />}
      />
      <Route
        path="/create-trip"
        element={session ? <Home addTrip={addTrip} currentUserEmail={session.user.email} /> : <Navigate to="/login" />}
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

      // Fetch trips where user is either the creator OR a participant
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .or(`user_id.eq.${session.user.id},participants.cs.[{"email":"${session.user.email}"}]`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trips:', error);
      } else if (data) {
        // Filter trips to ensure user has access (either as creator or participant)
        const accessibleTrips = data.filter(trip => {
          // User is the creator
          if (trip.user_id === session.user.id) return true;
          
          // User is a participant
          const participants = trip.participants || [];
          return participants.some((p: any) => p.email === session.user.email);
        });
        
        setTrips(accessibleTrips as Trip[]);
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

    // --- This is the line to check for in your browser's console ---
    console.log("DEBUG: User ID being used for insert:", session.user.id);

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
  }, [session]); // The dependency array for useCallback was misplaced and incorrect.

  const updateTrip = useCallback(async (updatedTrip: Trip) => {
    if (!session) throw new Error("User is not authenticated");
    
    const { id, ...tripData } = updatedTrip;
    
    // Check if user has permission to update this trip
    const canUpdate = updatedTrip.user_id === session.user.id || 
      (updatedTrip.participants || []).some((p: any) => p.email === session.user.email);
    
    if (!canUpdate) {
      throw new Error("You don't have permission to update this trip");
    }
    
    // Map frontend field names to database column names
    const dbTripData = {
      ...tripData,
      travel_legs: tripData.travelLegs || tripData.travel_legs, // Handle both field names
      todos: tripData.todos, // Add todos to database update
    };
    
    // Remove the frontend field names to avoid conflicts
    delete (dbTripData as any).travelLegs;
    delete (dbTripData as any).travel_legs;
    
    // Add the correct database field name
    if (tripData.travelLegs) {
      dbTripData.travel_legs = tripData.travelLegs;
    } else if (tripData.travel_legs) {
      dbTripData.travel_legs = tripData.travel_legs;
    }
    
    const { error } = await supabase
      .from('trips')
      .update(dbTripData)
      .eq('id', id);

    if (error) {
      console.error('Error updating trip:', error);
      throw error;
    }

    setTrips(currentTrips => currentTrips.map(trip => trip.id === id ? updatedTrip : trip));
  }, []);

  const deleteTrip = useCallback(async (tripId: string) => {
    if (!session) throw new Error("User is not authenticated");
    
    // Check if user is the creator (only creators can delete trips)
    const trip = trips.find(t => t.id === tripId);
    if (!trip || trip.user_id !== session.user.id) {
      throw new Error("Only the trip creator can delete this trip");
    }
    
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