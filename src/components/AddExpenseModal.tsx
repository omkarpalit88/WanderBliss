import React, { useState } from 'react';
import { X, DollarSign, Users, Calendar, Tag } from 'lucide-react';
import { Trip, Expense } from '../types';

interface AddExpenseModalProps {
  trip: Trip;
  onClose: () => void;
  onAdd: (expense: Expense) => void;
}

const expenseCategories = [
  'Food & Dining',
  'Transportation',
  'Accommodation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Other'
];

export default function AddExpenseModal({ trip, onClose, onAdd }: AddExpenseModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(trip.participants[0]?.id || '');
  const [category, setCategory] = useState(expenseCategories[0]);
  const [splitBetween, setSplitBetween] = useState<string[]>(trip.participants.map(p => p.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !amount || !paidBy || splitBetween.length === 0) {
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy,
      splitBetween,
      category,
      date: new Date(),
      tripId: trip.id
    };

    onAdd(expense);
  };

  const handleParticipantToggle = (participantId: string) => {
    setSplitBetween(prev => 
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const splitAmount = parseFloat(amount) / splitBetween.length || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Expense</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-orange focus:border-soft-orange transition-colors"
              placeholder="What did you spend on?"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-orange focus:border-soft-orange transition-colors"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-orange focus:border-soft-orange transition-colors appearance-none bg-white"
              >
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Paid By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paid by
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-orange focus:border-soft-orange transition-colors appearance-none bg-white"
                required
              >
                {trip.participants.map(participant => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Split Between */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Split between
            </label>
            <div className="space-y-3">
              {trip.participants.map(participant => {
                const isSelected = splitBetween.includes(participant.id);
                return (
                  <div
                    key={participant.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-soft-orange bg-soft-orange bg-opacity-10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleParticipantToggle(participant.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vibrant-orange to-soft-orange flex items-center justify-center text-white text-sm font-medium mr-3">
                        {participant.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{participant.name}</span>
                    </div>
                    <div className="text-right">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'border-soft-orange bg-soft-orange' : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      {isSelected && splitAmount > 0 && (
                        <p className="text-xs text-soft-orange mt-1">
                          ${splitAmount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Split Summary */}
          {splitBetween.length > 0 && parseFloat(amount) > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Each person pays:</span>
                <span className="font-semibold text-vibrant-orange">
                  ${splitAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!description.trim() || !amount || splitBetween.length === 0}
            className="w-full bg-vibrant-orange text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}