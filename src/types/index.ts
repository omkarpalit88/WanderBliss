export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: 'pending' | 'settled';
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  category: string;
  date: Date;
  tripId: string;
}

export interface TravelLeg {
  id: string;
  travellerNames: string;
  mode: 'flight' | 'train' | 'car' | 'bus' | null;
  startCity: string;
  destinationCity: string;
  details: string;
  etd: string;
  eta: string;
}

// --- NEW: A type for a single lodging entry ---
export interface LodgingEntry {
    id: string;
    guestNames: string;
    placeName: string;
    city: string;
    area: string;
    checkIn: string;
    checkOut: string;
}

export interface ItineraryItem {
  id: string;
  name: string;
  category: 'place' | 'food';
  date: string | null;
  status: 'pending' | 'done';
}

export interface Trip {
  id: string;
  name: string;
  description: string;
  participants: User[];
  createdBy: string;
  createdAt: Date;
  expenses: Expense[];
  settlements?: Settlement[];
  inspiration?: {
    places: string[];
    foods: string[];
    selectedPlaces?: string[];
    selectedFoods?: string[];
  };
  itinerary?: ItineraryItem[];
  travelLegs?: TravelLeg[];
  travel_legs?: TravelLeg[]; // Add database field name for compatibility
  // --- NEW: An array to hold lodging entries ---
  lodging?: LodgingEntry[];
}

export interface ExpenseSummary {
  totalExpenses: number;
  userExpenses: Record<string, number>;
  userOwes: Record<string, number>;
  balances: Record<string, number>;
  settlements: Settlement[];
}
