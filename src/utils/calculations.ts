import { Expense, Settlement, ExpenseSummary, User } from '../types';

export function calculateExpenseSummary(expenses: Expense[], participants: User[]): ExpenseSummary {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const userExpenses: Record<string, number> = {};
  const userOwes: Record<string, number> = {};

  participants.forEach(user => {
    userExpenses[user.id] = 0;
    userOwes[user.id] = 0;
  });

  expenses.forEach(expense => {
    userExpenses[expense.paidBy] = (userExpenses[expense.paidBy] || 0) + expense.amount;
    
    if (expense.splitBetween.length > 0) {
      const splitAmount = expense.amount / expense.splitBetween.length;
      expense.splitBetween.forEach(userId => {
        userOwes[userId] = (userOwes[userId] || 0) + splitAmount;
      });
    }
  });

  const balances: Record<string, number> = {};
  participants.forEach(user => {
    balances[user.id] = (userExpenses[user.id] || 0) - (userOwes[user.id] || 0);
  });

  const settlementBalances = { ...balances };
  const settlements: Settlement[] = [];
  const debtors = participants.filter(user => settlementBalances[user.id] < -0.01);
  const creditors = participants.filter(user => settlementBalances[user.id] > 0.01);

  debtors.sort((a, b) => settlementBalances[a.id] - settlementBalances[b.id]);
  creditors.sort((a, b) => settlementBalances[b.id] - settlementBalances[a.id]);

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    
    const debtAmount = Math.abs(settlementBalances[debtor.id]);
    const creditAmount = settlementBalances[creditor.id];
    
    const settlementAmount = Math.min(debtAmount, creditAmount);
    
    if (settlementAmount > 0.01) {
      settlements.push({
        // NEW: Add a unique ID and a default status
        id: `settle-${debtor.id}-${creditor.id}-${settlementAmount.toFixed(2)}`,
        from: debtor.id,
        to: creditor.id,
        amount: settlementAmount,
        status: 'pending', 
      });
    }
    
    settlementBalances[debtor.id] += settlementAmount;
    settlementBalances[creditor.id] -= settlementAmount;
    
    if (Math.abs(settlementBalances[debtor.id]) < 0.01) debtorIndex++;
    if (Math.abs(settlementBalances[creditor.id]) < 0.01) creditorIndex++;
  }

  return {
    totalExpenses,
    userExpenses,
    userOwes,
    balances,
    settlements // This now includes settlements with status
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}
