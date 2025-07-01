export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Trip {
  id: string;
  name: string;
  description: string;
  participants: User[];
  createdBy: string;
  createdAt: Date;
  expenses: Expense[];
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

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface ExpenseSummary {
  totalExpenses: number;
  userExpenses: Record<string, number>;
  userOwes: Record<string, number>;
  settlements: Settlement[];
}