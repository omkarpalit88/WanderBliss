import React from 'react';
import { Plus, MapPin, Users, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockTrips } from '../data/mockData';
import { formatCurrency } from '../utils/calculations';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleTripClick = (tripId: string) => {
    navigate(`/trip/${tripId}`);
  };

  const handleCreateTrip = () => {
    // In a real app, this would open a create trip modal
    console.log('Create new trip');
  };

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <div className="bg-muted-teal text-white px-4 py-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">My Trips</h1>
          <p className="text-blue-100">Manage and track your shared expenses</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-vibrant-orange bg-opacity-10 rounded-full p-2 mr-3">
                <MapPin className="w-5 h-5 text-vibrant-orange" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Trips</p>
                <p className="text-xl font-semibold text-gray-900">{mockTrips.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-soft-orange bg-opacity-20 rounded-full p-2 mr-3">
                <DollarSign className="w-5 h-5 text-soft-orange" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(mockTrips.reduce((sum, trip) => 
                    sum + trip.expenses.reduce((expSum, exp) => expSum + exp.amount, 0), 0
                  ))}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-muted-teal bg-opacity-10 rounded-full p-2 mr-3">
                <Users className="w-5 h-5 text-muted-teal" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Trip Partners</p>
                <p className="text-xl font-semibold text-gray-900">
                  {new Set(mockTrips.flatMap(trip => trip.participants.map(p => p.id))).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trips List */}
        <div className="space-y-4">
          {mockTrips.map((trip, index) => (
            <div
              key={trip.id}
              onClick={() => handleTripClick(trip.id)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-soft-orange transition-all cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {trip.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{trip.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                  <p className="text-lg font-semibold text-vibrant-orange">
                    {formatCurrency(trip.expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{trip.participants.length} people</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{trip.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>{trip.expenses.length} expenses</span>
                </div>
              </div>

              {/* Participants avatars */}
              <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                <div className="flex -space-x-2">
                  {trip.participants.slice(0, 4).map((participant, i) => (
                    <div
                      key={participant.id}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-vibrant-orange to-soft-orange flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                    >
                      {participant.name.charAt(0)}
                    </div>
                  ))}
                  {trip.participants.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                      +{trip.participants.length - 4}
                    </div>
                  )}
                </div>
                <span className="ml-3 text-sm text-gray-600">
                  {trip.participants.map(p => p.name.split(' ')[0]).join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state for when no trips exist */}
        {mockTrips.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-6">Create your first trip to start splitting expenses</p>
            <button
              onClick={handleCreateTrip}
              className="bg-vibrant-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
            >
              Create Your First Trip
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleCreateTrip}
        className="fixed bottom-6 right-6 w-14 h-14 bg-vibrant-orange text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all animate-bounce-gentle flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}