import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Plane, Hotel, IndianRupee, Globe, Wand2, Plus, RefreshCw, Calendar, Edit, Save, Train, Car, BusFront, Trash2, Building2, Users2, Mail, User as UserIcon } from 'lucide-react';
import { Trip, ItineraryItem, TravelLeg, LodgingEntry, Expense, Settlement, User as UserType } from '../types';
import { debounce } from 'lodash';
import { calculateExpenseSummary, formatCurrency } from '../utils/calculations';

// --- MODAL for adding/editing an Expense ---
const ExpenseModal = ({ trip, onSave, onClose }: { trip: Trip, onSave: (expense: Expense) => void, onClose: () => void }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(trip.participants[0]?.id || '');
  const [splitBetween, setSplitBetween] = useState<string[]>(trip.participants.map(p => p.id));

  const handleSplitChange = (participantId: string) => {
    setSplitBetween(prev => prev.includes(participantId) ? prev.filter(id => id !== participantId) : [...prev, participantId]);
  };

  const handleSave = () => {
    if (!description || !amount || !paidBy || splitBetween.length === 0) {
      alert('Please fill out all fields.');
      return;
    }
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      tripId: trip.id,
      description,
      amount: parseFloat(amount),
      paidBy,
      splitBetween,
      date: new Date(),
      category: 'General',
    };
    onSave(newExpense);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Expense</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Dinner at the Ghats" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0.00" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label><select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">{trip.participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Split Between</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {trip.participants.map(p => (
                <div key={p.id} onClick={() => handleSplitChange(p.id)} className={`flex items-center p-2 rounded-lg cursor-pointer border-2 ${splitBetween.includes(p.id) ? 'border-vibrant-orange' : 'border-gray-200'}`}>
                  <div className={`w-4 h-4 rounded-sm mr-2 ${splitBetween.includes(p.id) ? 'bg-vibrant-orange' : 'bg-gray-200'}`}></div>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3"><button onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg">Cancel</button><button onClick={handleSave} className="bg-vibrant-orange text-white py-2 px-4 rounded-lg">Add Expense</button></div>
      </div>
    </div>
  );
};

// --- Other Modals and Components ---
const TravelLegModal = ({ leg, onSave, onClose }: { leg: Partial<TravelLeg>, onSave: (leg: TravelLeg) => void, onClose: () => void }) => {
  const [currentLeg, setCurrentLeg] = useState<Partial<TravelLeg>>(leg);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { const { name, value } = e.target; setCurrentLeg(prev => ({ ...prev, [name]: value })); };
  const handleSave = () => onSave(currentLeg as TravelLeg);
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg"><h2 className="text-2xl font-bold text-gray-800 mb-6">{leg.id ? 'Edit' : 'Add'} Travel Leg</h2><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Traveller(s)</label><input type="text" name="travellerNames" value={currentLeg.travellerNames || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Omi, Shagun" /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Mode</label><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{(['flight', 'train', 'car', 'bus'] as const).map(mode => { const Icon = mode === 'flight' ? Plane : mode === 'train' ? Train : mode === 'car' ? Car : BusFront; return <button key={mode} onClick={() => setCurrentLeg(prev => ({...prev, mode}))} className={`flex items-center justify-center p-3 rounded-lg border-2 ${currentLeg.mode === mode ? 'border-vibrant-orange' : 'border-gray-200'}`}><Icon className={`w-5 h-5 mr-2 ${currentLeg.mode === mode ? 'text-vibrant-orange' : 'text-gray-500'}`} /><span className="capitalize">{mode}</span></button> })}</div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">From</label><input type="text" name="startCity" value={currentLeg.startCity || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Start City" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">To</label><input type="text" name="destinationCity" value={currentLeg.destinationCity || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Destination City" /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Details (Flight/Train/Bus No.)</label><input type="text" name="details" value={currentLeg.details || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 6E 2341" /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Departure (ETD)</label><input type="datetime-local" name="etd" value={currentLeg.etd || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Arrival (ETA)</label><input type="datetime-local" name="eta" value={currentLeg.eta || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div></div></div><div className="mt-8 flex justify-end gap-3"><button onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg">Cancel</button><button onClick={handleSave} className="bg-vibrant-orange text-white py-2 px-4 rounded-lg">Save Travel Leg</button></div></div></div>;
};
const LodgingModal = ({ entry, onSave, onClose }: { entry: Partial<LodgingEntry>, onSave: (entry: LodgingEntry) => void, onClose: () => void }) => {
  const [currentEntry, setCurrentEntry] = useState<Partial<LodgingEntry>>(entry);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setCurrentEntry(prev => ({ ...prev, [name]: value })); };
  const handleSave = () => onSave(currentEntry as LodgingEntry);
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg"><h2 className="text-2xl font-bold text-gray-800 mb-6">{entry.id ? 'Edit' : 'Add'} Lodging</h2><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Guest(s)</label><input type="text" name="guestNames" value={currentEntry.guestNames || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Omi, Shagun" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Hotel / Place Name</label><input type="text" name="placeName" value={currentEntry.placeName || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Taj Ganges" /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" name="city" value={currentEntry.city || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Varanasi" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Area</label><input type="text" name="area" value={currentEntry.area || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Nadesar Palace Grounds" /></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label><input type="date" name="checkIn" value={currentEntry.checkIn || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label><input type="date" name="checkOut" value={currentEntry.checkOut || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div></div></div><div className="mt-8 flex justify-end gap-3"><button onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg">Cancel</button><button onClick={handleSave} className="bg-vibrant-orange text-white py-2 px-4 rounded-lg">Save Lodging</button></div></div></div>;
};
const ChecklistItem = ({ item, isChecked, onToggle }: { item: string, isChecked: boolean, onToggle: () => void }) => {
  return <div onClick={onToggle} className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${isChecked ? 'bg-vibrant-orange bg-opacity-10 text-gray-800 font-medium' : 'bg-gray-50 hover:bg-gray-100'}`}><div className={`w-5 h-5 rounded mr-4 flex items-center justify-center border-2 transition-all ${isChecked ? 'bg-vibrant-orange border-vibrant-orange' : 'border-gray-300'}`}>{isChecked && <CheckSquare className="w-3 h-3 text-white" strokeWidth={3} />}</div><span>{item}</span></div>;
};


interface TripPlannerProps { trips: Trip[]; updateTrip: (updatedTrip: Trip) => Promise<void>; }
type TabType = 'checklist' | 'itinerary' | 'travel' | 'lodging' | 'expenses' | 'participants';
type ExpenseSubTabType = 'list' | 'balances' | 'settlements';

export default function TripPlanner({ trips, updateTrip }: TripPlannerProps) {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('checklist');
  const trip = trips.find((t: Trip) => t.id === tripId);

  // State for various planner sections
  const [allPlaces, setAllPlaces] = useState<string[]>([]);
  const [allFoods, setAllFoods] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [newPlace, setNewPlace] = useState('');
  const [newFood, setNewFood] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [isEditingItinerary, setIsEditingItinerary] = useState(false);
  const [travelLegs, setTravelLegs] = useState<TravelLeg[]>([]);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [editingLeg, setEditingLeg] = useState<Partial<TravelLeg> | null>(null);
  const [lodgingEntries, setLodgingEntries] = useState<LodgingEntry[]>([]);
  const [isLodgingModalOpen, setIsLodgingModalOpen] = useState(false);
  const [editingLodging, setEditingLodging] = useState<Partial<LodgingEntry> | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [activeExpenseTab, setActiveExpenseTab] = useState<ExpenseSubTabType>('list');
  const [participants, setParticipants] = useState<UserType[]>([]);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantEmail, setNewParticipantEmail] = useState('');

  const debouncedUpdate = useCallback(debounce((updatedTrip: Trip) => { updateTrip(updatedTrip); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); }, 1500), []);
  const triggerAutoSave = (updatedTrip: Trip) => { setSaveStatus('saving'); debouncedUpdate(updatedTrip); };

  useEffect(() => {
    if (trip) {
      setAllPlaces(trip.inspiration?.places || []);
      setAllFoods(trip.inspiration?.foods || []);
      setSelectedPlaces(trip.inspiration?.selectedPlaces || []);
      setSelectedFoods(trip.inspiration?.selectedFoods || []);
      setItinerary(trip.itinerary || []);
      setTravelLegs(trip.travelLegs || []);
      setLodgingEntries(trip.lodging || []);
      setExpenses(trip.expenses || []);
      setParticipants(trip.participants || []);
    }
  }, [trip]);

  const generatedItinerary = useMemo(() => {
    const placesItems: ItineraryItem[] = selectedPlaces.map(p => ({ id: `place-${p.replace(/\s+/g, '-').toLowerCase()}`, name: p, category: 'place', date: null, status: 'pending' }));
    const foodsItems: ItineraryItem[] = selectedFoods.map(f => ({ id: `food-${f.replace(/\s+/g, '-').toLowerCase()}`, name: f, category: 'food', date: null, status: 'pending' }));
    const combined = [...placesItems, ...foodsItems];
    return combined.map(item => itinerary.find(i => i.id === item.id) || item);
  }, [selectedPlaces, selectedFoods, itinerary]);

  const expenseSummary = useMemo(() => {
    if (!trip) return null;
    return calculateExpenseSummary(expenses, participants);
  }, [expenses, participants]);

  const handleUpdateItineraryItem = (itemId: string, newDate: string | null, newStatus: 'pending' | 'done') => { const updatedItinerary = generatedItinerary.map(item => item.id === itemId ? { ...item, date: newDate, status: newStatus } : item); setItinerary(updatedItinerary); };
  const handleSaveItinerary = () => { if (!trip) return; triggerAutoSave({ ...trip, itinerary: generatedItinerary }); setIsEditingItinerary(false); };
  const handleTogglePlace = (place: string) => { const newSelection = selectedPlaces.includes(place) ? selectedPlaces.filter(p => p !== place) : [...selectedPlaces, place]; setSelectedPlaces(newSelection); triggerAutoSave({ ...trip!, inspiration: { ...trip!.inspiration, places: allPlaces, foods: allFoods, selectedPlaces: newSelection, selectedFoods } }); };
  const handleToggleFood = (food: string) => { const newSelection = selectedFoods.includes(food) ? selectedFoods.filter(f => f !== food) : [...selectedFoods, food]; setSelectedFoods(newSelection); triggerAutoSave({ ...trip!, inspiration: { ...trip!.inspiration, places: allPlaces, foods: allFoods, selectedPlaces, selectedFoods: newSelection } }); };
  const handleAddNewPlace = () => { if (newPlace && !allPlaces.includes(newPlace)) { const newAllPlaces = [...allPlaces, newPlace]; setAllPlaces(newAllPlaces); const newSelectedPlaces = [...selectedPlaces, newPlace]; setSelectedPlaces(newSelectedPlaces); setNewPlace(''); triggerAutoSave({ ...trip!, inspiration: { ...trip!.inspiration, places: newAllPlaces, foods: allFoods, selectedPlaces: newSelectedPlaces, selectedFoods } }); } };
  const handleAddNewFood = () => { if (newFood && !allFoods.includes(newFood)) { const newAllFoods = [...allFoods, newFood]; setAllFoods(newAllFoods); const newSelectedFoods = [...selectedFoods, newFood]; setSelectedFoods(newSelectedFoods); setNewFood(''); triggerAutoSave({ ...trip!, inspiration: { ...trip!.inspiration, places: allPlaces, foods: newAllFoods, selectedPlaces, selectedFoods: newSelectedFoods } }); } };
  const handleSaveTravelLeg = (leg: TravelLeg) => { const updatedLegs = leg.id ? travelLegs.map(l => l.id === leg.id ? leg : l) : [...travelLegs, { ...leg, id: `leg-${Date.now()}` }]; setTravelLegs(updatedLegs); triggerAutoSave({ ...trip!, travelLegs: updatedLegs }); setIsTravelModalOpen(false); setEditingLeg(null); };
  const handleDeleteTravelLeg = (legId: string) => { if (window.confirm('Are you sure you want to delete this travel leg?')) { const updatedLegs = travelLegs.filter(l => l.id !== legId); setTravelLegs(updatedLegs); triggerAutoSave({ ...trip!, travelLegs: updatedLegs }); } };
  const handleSaveLodging = (entry: LodgingEntry) => { const updatedLodging = entry.id ? lodgingEntries.map(l => l.id === entry.id ? entry : l) : [...lodgingEntries, { ...entry, id: `lodge-${Date.now()}` }]; setLodgingEntries(updatedLodging); triggerAutoSave({ ...trip!, lodging: updatedLodging }); setIsLodgingModalOpen(false); setEditingLodging(null); };
  const handleDeleteLodging = (entryId: string) => { if (window.confirm('Are you sure you want to delete this lodging entry?')) { const updatedLodging = lodgingEntries.filter(l => l.id !== entryId); setLodgingEntries(updatedLodging); triggerAutoSave({ ...trip!, lodging: updatedLodging }); } };
  const handleAddExpense = (expense: Expense) => { const newExpenses = [...expenses, expense]; setExpenses(newExpenses); triggerAutoSave({ ...trip!, expenses: newExpenses }); setIsExpenseModalOpen(false); };
  const handleDeleteExpense = (expenseId: string) => { if (window.confirm('Are you sure you want to delete this expense?')) { const newExpenses = expenses.filter(e => e.id !== expenseId); setExpenses(newExpenses); triggerAutoSave({ ...trip!, expenses: newExpenses }); } };
  
  const handleAddParticipant = () => {
    if (newParticipantName && newParticipantEmail) {
      const newParticipant: UserType = {
        id: `user-${Date.now()}`,
        name: newParticipantName,
        email: newParticipantEmail,
      };
      const updatedParticipants = [...participants, newParticipant];
      setParticipants(updatedParticipants);
      triggerAutoSave({ ...trip!, participants: updatedParticipants });
      setNewParticipantName('');
      setNewParticipantEmail('');
    }
  };

  const handleDeleteParticipant = (participantId: string) => {
    if (window.confirm('Are you sure you want to remove this participant?')) {
      const updatedParticipants = participants.filter(p => p.id !== participantId);
      setParticipants(updatedParticipants);
      triggerAutoSave({ ...trip!, participants: updatedParticipants });
    }
  };
  
  const formatDisplayDate = (dateString: string) => { if (!dateString) return 'N/A'; const date = new Date(dateString); return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }); };
  const formatShortDate = (dateString: string) => { if (!dateString) return 'N/A'; const date = new Date(dateString); return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); };

  if (!trip || !expenseSummary) { return <div className="min-h-screen bg-off-white flex items-center justify-center"><p>Trip not found or error calculating summary.</p></div>; }
  const getUserName = (userId: string) => participants.find((p: UserType) => p.id === userId)?.name || 'Unknown';

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [ { id: 'checklist', label: 'Checklist', icon: CheckSquare }, { id: 'itinerary', label: 'Itinerary', icon: Calendar }, { id: 'participants', label: 'Participants', icon: Users2 }, { id: 'travel', label: 'Travel', icon: Plane }, { id: 'lodging', label: 'Lodging', icon: Hotel }, { id: 'expenses', label: 'Expenses', icon: IndianRupee }, ];

  return (
    <div className="min-h-screen bg-off-white">
      {isTravelModalOpen && editingLeg && <TravelLegModal leg={editingLeg} onSave={handleSaveTravelLeg} onClose={() => setIsTravelModalOpen(false)} />}
      {isLodgingModalOpen && editingLodging && <LodgingModal entry={editingLodging} onSave={handleSaveLodging} onClose={() => setIsLodgingModalOpen(false)} />}
      {isExpenseModalOpen && <ExpenseModal trip={trip} onSave={handleAddExpense} onClose={() => setIsExpenseModalOpen(false)} />}
      <div className="bg-muted-teal text-white shadow-lg">
        <div className="max-w-5xl mx-auto p-4"><button onClick={() => navigate('/')} className="flex items-center text-sm text-blue-200 hover:text-white mb-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</button><h1 className="text-3xl font-bold">{trip.name}</h1><p className="text-blue-100">{trip.description}</p></div>
        <div className="max-w-5xl mx-auto px-4 flex border-b border-white border-opacity-20">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center justify-center px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id ? 'border-vibrant-orange text-white' : 'border-transparent text-blue-200 hover:text-white'}`}><tab.icon className="w-4 h-4 mr-2" /> <span className="text-sm font-medium">{tab.label}</span></button>)}</div>
      </div>

      <div className="max-w-5xl mx-auto p-4">
        {activeTab === 'checklist' && ( <div><div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex justify-between items-center"><div><h2 className="text-xl font-bold text-gray-800 mb-1">Build Your Wishlist</h2><p className="text-gray-600">Select items here to add them to your Itinerary.</p></div><div className="text-sm text-gray-500">{saveStatus === 'saving' && <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin"/> Saving...</span>}{saveStatus === 'saved' && <span className="text-green-600">Saved!</span>}</div></div><div className="grid md:grid-cols-2 gap-6"><div><h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center"><Globe className="w-5 h-5 mr-3 text-vibrant-orange"/> Places to Visit</h3><div className="space-y-2">{allPlaces.map((place) => (<ChecklistItem key={place} item={place} isChecked={selectedPlaces.includes(place)} onToggle={() => handleTogglePlace(place)} />))}</div><div className="mt-4 flex gap-2"><input type="text" value={newPlace} onChange={(e) => setNewPlace(e.target.value)} placeholder="Add a new place..." className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-orange"/><button onClick={handleAddNewPlace} disabled={!newPlace.trim()} className="bg-soft-orange text-white p-2 rounded-lg transition-colors disabled:bg-gray-300"><Plus/></button></div></div><div><h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center"><Wand2 className="w-5 h-5 mr-3 text-soft-orange"/> Must-Try Foods</h3><div className="space-y-2">{allFoods.map((food) => (<ChecklistItem key={food} item={food} isChecked={selectedFoods.includes(food)} onToggle={() => handleToggleFood(food)} />))}</div><div className="mt-4 flex gap-2"><input type="text" value={newFood} onChange={(e) => setNewFood(e.target.value)} placeholder="Add a new food..." className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-orange"/><button onClick={handleAddNewFood} disabled={!newFood.trim()} className="bg-soft-orange text-white p-2 rounded-lg transition-colors disabled:bg-gray-300"><Plus/></button></div></div></div></div> )}
        {activeTab === 'itinerary' && ( <div><div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex justify-between items-center"><div><h2 className="text-xl font-bold text-gray-800 mb-1">Trip Itinerary</h2><p className="text-gray-600">Assign dates to your selected activities.</p></div><div>{!isEditingItinerary ? <button onClick={() => setIsEditingItinerary(true)} className="flex items-center bg-vibrant-orange text-white py-2 px-4 rounded-lg font-medium hover:bg-opacity-90"><Edit className="w-4 h-4 mr-2"/> Edit Plan</button> : <div className="flex items-center gap-4"><span className="text-sm text-gray-500">{saveStatus === 'saving' && <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin"/> Saving...</span>}{saveStatus === 'saved' && <span className="text-green-600">Saved!</span>}</span><button onClick={handleSaveItinerary} className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-opacity-90"><Save className="w-4 h-4 mr-2"/> Save Plan</button></div>}</div></div><div className="bg-white rounded-xl shadow-sm overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50 text-xs text-gray-700 uppercase"><tr><th scope="col" className="px-6 py-3">Activity</th><th scope="col" className="px-6 py-3">Category</th><th scope="col" className="px-6 py-3">Date</th><th scope="col" className="px-6 py-3 text-center">Done</th></tr></thead><tbody>{generatedItinerary.map(item => (<tr key={item.id} className={`border-b hover:bg-gray-50 ${item.status === 'done' ? 'bg-green-50' : ''}`}><td className={`px-6 py-4 font-medium ${item.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{item.name}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${item.category === 'place' ? 'bg-orange-100 text-orange-800' : 'bg-teal-100 text-teal-800'}`}>{item.category}</span></td><td className="px-6 py-4"><input type="date" value={item.date || ''} onChange={(e) => handleUpdateItineraryItem(item.id, e.target.value, item.status)} className="p-1 border border-gray-300 rounded-md disabled:bg-gray-100" disabled={!isEditingItinerary}/></td><td className="px-6 py-4 text-center"><input type="checkbox" checked={item.status === 'done'} onChange={(e) => handleUpdateItineraryItem(item.id, item.date, e.target.checked ? 'done' : 'pending')} className="w-5 h-5 text-vibrant-orange rounded focus:ring-vibrant-orange" disabled={!isEditingItinerary}/></td></tr>))}</tbody></table></div></div> )}
        {activeTab === 'participants' && (
          <div>
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Trip Participants</h2>
              <p className="text-gray-600">Manage the members of this trip.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Add New Participant</h3>
                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" value={newParticipantName} onChange={(e) => setNewParticipantName(e.target.value)} placeholder="Enter name" className="w-full px-3 py-2 border border-gray-300 rounded-lg"/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={newParticipantEmail} onChange={(e) => setNewParticipantEmail(e.target.value)} placeholder="Enter email" className="w-full px-3 py-2 border border-gray-300 rounded-lg"/></div>
                  <button onClick={handleAddParticipant} className="w-full flex items-center justify-center bg-vibrant-orange text-white py-2 px-4 rounded-lg font-medium"><Plus className="w-4 h-4 mr-2"/>Add to Trip</button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Current Members</h3>
                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-3">
                  {participants.length === 0 ? <p className="text-gray-500">No participants added yet.</p> : participants.map(p => (
                    <div key={p.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.email}</p>
                      </div>
                      <button onClick={() => handleDeleteParticipant(p.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'travel' && ( <div><div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex justify-between items-center"><div><h2 className="text-xl font-bold text-gray-800 mb-1">Travel Legs</h2><p className="text-gray-600">Log each individual journey for the trip.</p></div><button onClick={() => { setEditingLeg({}); setIsTravelModalOpen(true); }} className="flex items-center bg-vibrant-orange text-white py-2 px-4 rounded-lg font-medium hover:bg-opacity-90"><Plus className="w-4 h-4 mr-2"/> Add Travel Leg</button></div><div className="space-y-4">{travelLegs.length === 0 ? <div className="text-center text-gray-500 py-12"><Plane className="mx-auto w-12 h-12 text-gray-300" /><p className="mt-4">No travel legs added yet.</p></div> : travelLegs.map(leg => { const Icon = leg.mode === 'flight' ? Plane : leg.mode === 'train' ? Train : leg.mode === 'car' ? Car : BusFront; return (<div key={leg.id} className="bg-white p-6 rounded-xl shadow-sm border"><div className="flex justify-between items-start"><div className="flex items-center gap-4">{Icon && <Icon className="w-10 h-10 p-2 bg-gray-100 rounded-full text-muted-teal"/>}<div><p className="font-semibold text-gray-500 text-xs uppercase">Travellers</p><p className="font-bold text-lg text-gray-800">{leg.travellerNames}</p></div></div><div className="flex gap-2"><button onClick={() => { setEditingLeg(leg); setIsTravelModalOpen(true); }} className="p-2 text-gray-500 hover:text-blue-600"><Edit className="w-4 h-4"/></button><button onClick={() => handleDeleteTravelLeg(leg.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4"/></button></div></div><div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-3 gap-4 text-sm"><div><p className="font-semibold text-gray-500 text-xs uppercase">Route</p><p className="text-gray-800">{leg.startCity} → {leg.destinationCity}</p></div><div><p className="font-semibold text-gray-500 text-xs uppercase">Details</p><p className="text-gray-800">{leg.details || 'N/A'}</p></div><div><p className="font-semibold text-gray-500 text-xs uppercase">Departure</p><p className="text-gray-800">{formatDisplayDate(leg.etd)}</p></div><div><p className="font-semibold text-gray-500 text-xs uppercase">Arrival</p><p className="text-gray-800">{formatDisplayDate(leg.eta)}</p></div></div></div>)})}</div></div> )}
        {activeTab === 'lodging' && ( <div><div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex justify-between items-center"><div><h2 className="text-xl font-bold text-gray-800 mb-1">Accommodation</h2><p className="text-gray-600">Log each place you're staying at during the trip.</p></div><button onClick={() => { setEditingLodging({}); setIsLodgingModalOpen(true); }} className="flex items-center bg-vibrant-orange text-white py-2 px-4 rounded-lg font-medium hover:bg-opacity-90"><Plus className="w-4 h-4 mr-2"/> Add Lodging</button></div><div className="space-y-4">{lodgingEntries.length === 0 ? <div className="text-center text-gray-500 py-12"><Hotel className="mx-auto w-12 h-12 text-gray-300" /><p className="mt-4">No lodging entries added yet.</p></div> : lodgingEntries.map(entry => (<div key={entry.id} className="bg-white p-6 rounded-xl shadow-sm border"><div className="flex justify-between items-start"><div className="flex items-center gap-4"><Building2 className="w-10 h-10 p-2 bg-gray-100 rounded-full text-muted-teal"/><div><p className="font-semibold text-gray-500 text-xs uppercase">Guests</p><p className="font-bold text-lg text-gray-800">{entry.guestNames}</p></div></div><div className="flex gap-2"><button onClick={() => { setEditingLodging(entry); setIsLodgingModalOpen(true); }} className="p-2 text-gray-500 hover:text-blue-600"><Edit className="w-4 h-4"/></button><button onClick={() => handleDeleteLodging(entry.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4"/></button></div></div><div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-3 gap-4 text-sm"><div><p className="font-semibold text-gray-500 text-xs uppercase">Place</p><p className="text-gray-800">{entry.placeName}</p></div><div><p className="font-semibold text-gray-500 text-xs uppercase">Location</p><p className="text-gray-800">{entry.area}, {entry.city}</p></div><div><p className="font-semibold text-gray-500 text-xs uppercase">Check-in</p><p className="text-gray-800">{formatShortDate(entry.checkIn)}</p></div><div><p className="font-semibold text-gray-500 text-xs uppercase">Check-out</p><p className="text-gray-800">{formatShortDate(entry.checkOut)}</p></div></div></div>))}</div></div> )}
        
        {activeTab === 'expenses' && (
          <div>
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex justify-between items-center">
              <div><h2 className="text-xl font-bold text-gray-800 mb-1">Expense Manager</h2><p className="text-gray-600">Track all your trip-related spending here.</p></div>
              <button onClick={() => setIsExpenseModalOpen(true)} className="flex items-center bg-vibrant-orange text-white py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 disabled:bg-gray-300" disabled={participants.length === 0}>
                <Plus className="w-4 h-4 mr-2"/> Add Expense
              </button>
            </div>
            {participants.length === 0 ? <p className="text-center text-gray-500 py-8">Please add participants to the trip before adding expenses.</p> : (
            <>
              <div className="mb-4 border-b border-gray-200">
                <nav className="flex space-x-4" aria-label="Tabs">
                  {(['list', 'balances', 'settlements'] as ExpenseSubTabType[]).map(tab => (
                    <button key={tab} onClick={() => setActiveExpenseTab(tab)} className={`px-3 py-2 font-medium text-sm rounded-t-lg ${activeExpenseTab === tab ? 'border-b-2 border-vibrant-orange text-vibrant-orange' : 'text-gray-500 hover:text-gray-700'}`}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {activeExpenseTab === 'list' && (
                <div className="space-y-3">
                  {expenses.length === 0 ? <p className="text-center text-gray-500 py-8">No expenses added yet.</p> : expenses.map(exp => (
                    <div key={exp.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                      <div>
                        <p className="font-bold">{exp.description}</p>
                        <p className="text-sm text-gray-500">Paid by {getUserName(exp.paidBy)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(exp.amount)}</p>
                        <button onClick={() => handleDeleteExpense(exp.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeExpenseTab === 'balances' && (
                <div className="space-y-3">
                  {expenseSummary.balances && Object.entries(expenseSummary.balances).map(([userId, balance]) => (
                    <div key={userId} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                      <p className="font-medium">{getUserName(userId)}</p>
                      <p className={`font-bold ${balance > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(balance)}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeExpenseTab === 'settlements' && (
                <div className="space-y-3">
                  {expenseSummary.settlements.length === 0 ? <p className="text-center text-gray-500 py-8">Everyone is settled up!</p> : expenseSummary.settlements.map(settle => (
                    <div key={settle.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                      <p>{getUserName(settle.from)} owes {getUserName(settle.to)}</p>
                      <p className="font-bold">{formatCurrency(settle.amount)}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
