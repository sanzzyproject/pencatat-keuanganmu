import { useState, useEffect, useCallback } from 'react';
import { Transaction, FinancialSummary } from '../types';
import * as db from '../lib/db';
import { isToday, parseISO } from 'date-fns';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.getAllTransactions();
      // Sort by date descending
      setTransactions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const addTransaction = async (t: Transaction) => {
    await db.addTransaction(t);
    await refreshTransactions();
  };

  const updateTransaction = async (t: Transaction) => {
    await db.updateTransaction(t);
    await refreshTransactions();
  };

  const deleteTransaction = async (id: number) => {
    await db.deleteTransaction(id);
    await refreshTransactions();
  };

  const getSummary = (): FinancialSummary => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  };

  const getTodaySummary = () => {
    const todayTransactions = transactions.filter((t) => isToday(parseISO(t.date)));
    const income = todayTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = todayTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { income, expense };
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary,
    getTodaySummary,
    refreshTransactions,
  };
}
