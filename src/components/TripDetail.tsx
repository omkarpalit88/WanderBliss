import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Receipt, TrendingUp, DollarSign, Calendar, ShieldCheck, CheckCircle } from 'lucide-react';
// --- FINAL FIX: Removed unused 'Settlement' and 'User' imports ---
import { Trip, Expense } from '../types';
import { calculateExpenseSummary, formatCurrency } from '../utils/calculations';
import AddExpenseModal from './AddExpenseModal';

interface TripDetailProps {
  trips: Trip[];
  updateTrip: (updatedTrip: Trip) => Promise<void>;
}

type TabType = 'expenses' | 'balances' | 'settlements';

export default function TripDetail({ trips, updateTrip }: TripDetailProps) {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('expenses');
  const [showAddExpense, setShowAddExpense] = useState(false);

  const trip = trips.find(t => t.id === tripId);

  const summary = useMemo(() => {
    if (!trip) return null;
    return calculateExpenseSummary(trip.expenses, trip.participants);
  }, [trip]);

  const handleAddExpense = async (newExpense: Expense) => {
    if (!trip) return;
    const newExpenses = [...trip.expenses, newExpense];
    const newSummary = calculateExpenseSummary(newExpenses, trip.participants);
    
    const updatedTrip: Trip = {
      ...trip,
      expenses: newExpenses,
      settlements: newSummary.settlements, 
    };
    await updateTrip(updatedTrip);
    setShowAddExpense(false);
  };
  
  const handleMarkAsSettled = async (settlementId: string) => {
    if (!trip || !trip.settlements) return;
    const updatedSettlements = trip.settlements.map(s => 
      s.id === settlementId ? { ...s, status: 'settled' as const } : s
    );
    
    const updatedTrip: Trip = {
      ...trip,
      settlements: updatedSettlements,
    };
    await updateTrip(updatedTrip);
  };

  if (!trip || !summary) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Trip not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-vibrant-orange hover:text-soft-orange"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const getUserName = (userId: string) => trip.participants.find(p => p.id === userId)?.name || 'Unknown';

  const tabs = [
    { id: 'expenses' as TabType, label: 'Expenses', icon: Receipt },
    { id: 'balances' as TabType, label: 'Balances', icon: TrendingUp },
    { id: 'settlements' as TabType, label: 'Settlements', icon: ShieldCheck },
  ];

  const settlementsToDisplay = trip.settlements || summary.settlements;

  return (
    <div className="min-h-screen bg-off-white pb-24">
      {/* Header */}
      <div className="bg-muted-teal text-white">
        <div className="flex items-center px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-3 p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{trip.name}</h1>
            <p className="text-blue-100 text-sm">{trip.description}</p>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm">Participants</span>
              </div>
              <p className="text-lg font-semibold">{trip.participants.length}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <DollarSign className="w-4 h-4 mr-2" />
                <span className="text-sm">Total Spent</span>
              </div>
              <p className="text-lg font-semibold">{formatCurrency(summary.totalExpenses)}</p>
            </div>
          </div>
        </div>
        <div className="flex px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-vibrant-orange text-white'
                    : 'border-transparent text-blue-200 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            {trip.expenses.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
                <p className="text-gray-600 mb-6">Add your first expense to get started</p>
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="bg-vibrant-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
                >
                  Add First Expense
                </button>
              </div>
            ) : (
              trip.expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense, index) => (
                <div
                  key={expense.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{expense.description}</h3>
                      <p className="text-sm text-gray-500">
                        Paid by <span className="font-semibold text-soft-orange">{getUserName(expense.paidBy)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Split {expense.splitBetween.length} ways</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'balances' && (
          <div className="space-y-4">
            {trip.expenses.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No balances yet</h3>
                <p className="text-gray-600">Add an expense to see who owes who.</p>
              </div>
            ) : (
              trip.participants.map((participant) => {
                const balance = summary.balances[participant.id] || 0;
                return (
                  <div
                    key={participant.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vibrant-orange to-soft-orange flex items-center justify-center text-white font-medium mr-3">
                          {participant.name.charAt(0)}
                        </div>
                        <h3 className="font-medium text-gray-900">{participant.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${
                          balance > 0.01 ? 'text-green-600' : balance < -0.01 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {balance > 0.01 ? 'Is owed' : balance < -0.01 ? 'Owes' : 'Settled'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'settlements' && (
          <div className="space-y-4">
            {settlementsToDisplay.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">All settled up!</h3>
                <p className="text-gray-600">Everyone's expenses are balanced.</p>
              </div>
            ) : (
              <>
                <div className="bg-vibrant-orange bg-opacity-10 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-vibrant-orange mb-2">Settle Up</h3>
                  <p className="text-sm text-gray-700">
                    Make the following payments to clear all debts:
                  </p>
                </div>
                {settlementsToDisplay.map((settlement, index) => (
                  <div
                    key={settlement.id}
                    className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-slide-up transition-opacity ${
                      settlement.status === 'settled' ? 'opacity-50' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium mr-3">
                          {getUserName(settlement.from).charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {getUserName(settlement.from)}
                          </p>
                           <p className="text-sm text-gray-500">pays</p>
                           <p className="font-medium text-gray-900">
                            {getUserName(settlement.to)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-4">
                        <p className="text-xl font-bold text-vibrant-orange">
                          {formatCurrency(settlement.amount)}
                        </p>
                        {settlement.status === 'pending' ? (
                          <button
                            onClick={() => handleMarkAsSettled(settlement.id)}
                            className="px-4 py-2 text-xs font-semibold text-white bg-vibrant-orange rounded-lg hover:bg-opacity-80 transition-all"
                          >
                            Settle
                          </button>
                        ) : (
                          <div className="flex items-center px-4 py-2 text-xs font-semibold text-green-600 bg-green-100 rounded-lg">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Settled
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {activeTab === 'expenses' && (
        <button
          onClick={() => setShowAddExpense(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-vibrant-orange text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-20"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {showAddExpense && trip && (
        <AddExpenseModal
          trip={trip}
          onClose={() => setShowAddExpense(false)}
          onAdd={handleAddExpense}
        />
      )}
    </div>
  );
}
