import { User, Trip, Expense } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com' },
  { id: '4', name: 'Diana Ross', email: 'diana@example.com' },
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Hotel Room - Downtown',
    amount: 320.00,
    paidBy: '1',
    splitBetween: ['1', '2', '3', '4'],
    category: 'Accommodation',
    date: new Date('2024-01-15'),
    tripId: '1'
  },
  {
    id: '2',
    description: 'Dinner at Italian Restaurant',
    amount: 85.50,
    paidBy: '2',
    splitBetween: ['1', '2', '3'],
    category: 'Food',
    date: new Date('2024-01-15'),
    tripId: '1'
  },
  {
    id: '3',
    description: 'Uber to Airport',
    amount: 45.75,
    paidBy: '3',
    splitBetween: ['1', '2', '3', '4'],
    category: 'Transportation',
    date: new Date('2024-01-16'),
    tripId: '1'
  },
  {
    id: '4',
    description: 'Museum Tickets',
    amount: 60.00,
    paidBy: '4',
    splitBetween: ['2', '3', '4'],
    category: 'Entertainment',
    date: new Date('2024-01-16'),
    tripId: '1'
  },
];

export const mockTrips: Trip[] = [
  {
    id: '1',
    name: 'Weekend in NYC',
    description: 'Fun weekend trip to New York City',
    participants: mockUsers,
    createdBy: '1',
    createdAt: new Date('2024-01-14'),
    expenses: mockExpenses
  },
  {
    id: '2',
    name: 'Beach House Getaway',
    description: 'Relaxing beach house rental',
    participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
    createdBy: '1',
    createdAt: new Date('2024-02-01'),
    expenses: []
  },
  {
    id: '3',
    name: 'Ski Trip Colorado',
    description: 'Winter skiing adventure',
    participants: [mockUsers[0], mockUsers[3]],
    createdBy: '1',
    createdAt: new Date('2024-03-01'),
    expenses: []
  }
];

export const currentUser = mockUsers[0];