import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// --- UPDATED: Removed unused 'deleteDoc' import ---
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

import Home from './components/Home';
import TripPlanner from './components/TripPlanner';
import { Trip } from './types';

function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      const tripsCollectionRef = collection(db, "trips");
      const querySnapshot = await getDocs(tripsCollectionRef);
      
      const tripsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
          expenses: data.expenses ? data.expenses.map((exp: any) => ({
            ...exp,
            date: exp.date instanceof Timestamp ? exp.date.toDate() : new Date()
          })) : []
        } as Trip;
      });

      setTrips(tripsData);
      setIsLoading(false);
    };

    fetchTrips();
  }, []);

  const addTrip = async (newTripData: any): Promise<string> => {
    const docRef = await addDoc(collection(db, "trips"), {
      ...newTripData,
      createdAt: Timestamp.fromDate(newTripData.createdAt)
    });
    const newTripWithId = { ...newTripData, id: docRef.id };
    setTrips([newTripWithId, ...trips]);
    return docRef.id;
  };
  
  const updateTrip = async (updatedTrip: Trip) => {
    const tripDocRef = doc(db, "trips", updatedTrip.id);
    const firestoreTripData = {
        ...updatedTrip,
        createdAt: Timestamp.fromDate(new Date(updatedTrip.createdAt)),
        expenses: updatedTrip.expenses.map((exp: any) => ({
            ...exp,
            date: Timestamp.fromDate(new Date(exp.date))
        }))
    };
    delete (firestoreTripData as any).id;
    await updateDoc(tripDocRef, firestoreTripData);
    setTrips(trips.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip));
  };
  
  // --- REMOVED: The unused deleteTrip function ---

  if (isLoading) {
    return (
        <div className="min-h-screen bg-off-white flex items-center justify-center">
            <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home addTrip={addTrip} />} />
          
          {/* The new Trip Planner is now the main detail view */}
          <Route 
            path="/trip-planner/:tripId" 
            element={<TripPlanner trips={trips} updateTrip={updateTrip} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
