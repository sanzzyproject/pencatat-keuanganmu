export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id?: number;
  date: string;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  note?: string;
  createdAt: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const INCOME_CATEGORIES = ['Penjualan', 'Investasi', 'Bonus', 'Lainnya'];
export const EXPENSE_CATEGORIES = ['Bahan baku', 'Operasional', 'Gaji', 'Transport', 'Listrik', 'Lainnya'];
