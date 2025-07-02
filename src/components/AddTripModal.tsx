import React, { useState } from 'react';
import { X } from 'lucide-react';

// Define the structure of the props this component will receive
interface AddTripModalProps {
  onClose: () => void;
  onAdd: (newTrip: any) => void;
}

export default function AddTripModal({ onClose, onAdd }: AddTripModalProps) {
  // State for each form field
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the browser from refreshing

    // Basic validation to ensure trip name is not empty
    if (!name.trim()) {
      alert('Please enter a trip name.');
      return;
    }

    // Create a new trip object from the form data
    const newTrip = {
      id: Date.now().toString(), // A simple unique ID for the new trip
      name: name,
      description: description,
      createdAt: new Date(),
      expenses: [],
      // Split the comma-separated string of names into participant objects
      participants: participants.split(',').map(p => p.trim()).filter(p => p).map(pName => ({
        id: `${pName.toLowerCase()}-${Date.now()}`,
        name: pName,
        owes: 0,
        paid: 0,
      })),
    };

    onAdd(newTrip); // Send the new trip back to the Dashboard
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal content */}
      <div className="bg-white rounded-xl shadow-2xl p-8 m-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create a New Trip</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="tripName" className="block text-sm font-medium text-gray-700 mb-1">
                Trip Name
              </label>
              <input
                type="text"
                id="tripName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                placeholder="e.g., Weekend in NYC"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                rows={3}
                placeholder="e.g., Fun weekend trip to New York City"
              ></textarea>
            </div>
            <div>
              <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
                Add Participants
              </label>
              <input
                type="text"
                id="participants"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                placeholder="e.g., Alice, Bob, Charlie"
              />
               <p className="text-xs text-gray-500 mt-1">Separate names with a comma.</p>
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
              Create Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}