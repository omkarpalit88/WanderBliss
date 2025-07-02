import { useState } from 'react';
import { X } from 'lucide-react';
import { Trip, Expense } from '../types';

// Define the structure for props
interface AddExpenseModalProps {
  trip: Trip;
  onClose: () => void;
  onAdd: (newExpense: Expense) => void;
}

export default function AddExpenseModal({ trip, onClose, onAdd }: AddExpenseModalProps) {
  // State for the form fields
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(trip.participants[0]?.id || '');
  
  // State to hold the IDs of participants included in the split
  const [splitBetween, setSplitBetween] = useState<string[]>(
    trip.participants.map((p) => p.id) // Default to everyone being selected
  );

  const handleSplitChange = (participantId: string) => {
    setSplitBetween(prev => 
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId) // Uncheck: remove from array
        : [...prev, participantId] // Check: add to array
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one person is selected for the split
    if (splitBetween.length === 0) {
      alert('Please select at least one person to split the expense with.');
      return;
    }
    
    // Create the new expense object
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      tripId: trip.id,
      description,
      amount: parseFloat(amount) || 0,
      date: new Date(),
      paidBy,
      splitBetween,
      category: 'General', // You can enhance this later
    };

    onAdd(newExpense); // Pass the new expense back to TripDetail
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add an Expense</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                placeholder="e.g., Dinner, Taxi fare"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                placeholder="0.00"
                required
                step="0.01"
              />
            </div>

            {/* Paid By */}
            <div>
              <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-1">
                Paid by
              </label>
              <select
                id="paidBy"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
              >
                {trip.participants.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Split Between */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Split between
              </label>
              <div className="space-y-2">
                {trip.participants.map((p) => (
                  <div key={p.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`split-${p.id}`}
                      checked={splitBetween.includes(p.id)}
                      onChange={() => handleSplitChange(p.id)}
                      className="h-4 w-4 rounded border-gray-300 text-vibrant-orange focus:ring-vibrant-orange"
                    />
                    <label htmlFor={`split-${p.id}`} className="ml-3 text-sm text-gray-600">
                      {p.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-white bg-vibrant-orange hover:bg-opacity-90"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
