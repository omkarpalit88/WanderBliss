import { Expense, Settlement, ExpenseSummary, User } from '../types';

export function calculateExpenseSummary(expenses: Expense[], participants: User[]): ExpenseSummary {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const userExpenses: Record<string, number> = {};
  const userOwes: Record<string, number> = {};

  // Initialize records
  participants.forEach(user => {
    userExpenses[user.id] = 0;
    userOwes[user.id] = 0;
  });

  // Calculate what each user paid and owes
  expenses.forEach(expense => {
    userExpenses[expense.paidBy] = (userExpenses[expense.paidBy] || 0) + expense.amount;
    
    const splitAmount = expense.amount / expense.splitBetween.length;
    expense.splitBetween.forEach(userId => {
      userOwes[userId] = (userOwes[userId] || 0) + splitAmount;
    });
  });

  // Calculate net balances (positive = owed money, negative = owes money)
  const balances: Record<string, number> = {};
  participants.forEach(user => {
    balances[user.id] = (userExpenses[user.id] || 0) - (userOwes[user.id] || 0);
  });

  // Generate settlements using a simple algorithm
  const settlements: Settlement[] = [];
  const debtors = participants.filter(user => balances[user.id] < 0);
  const creditors = participants.filter(user => balances[user.id] > 0);

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    
    const debtAmount = Math.abs(balances[debtor.id]);
    const creditAmount = balances[creditor.id];
    
    const settlementAmount = Math.min(debtAmount, creditAmount);
    
    if (settlementAmount > 0.01) { // Ignore very small amounts
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: Math.round(settlementAmount * 100) / 100
      });
    }
    
    balances[debtor.id] += settlementAmount;
    balances[creditor.id] -= settlementAmount;
    
    if (Math.abs(balances[debtor.id]) < 0.01) debtorIndex++;
    if (Math.abs(balances[creditor.id]) < 0.01) creditorIndex++;
  }

  return {
    totalExpenses,
    userExpenses,
    userOwes,
    settlements
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}