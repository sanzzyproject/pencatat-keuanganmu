import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { Plus, Search, TrendingDown } from 'lucide-react';
import TransactionForm from '../components/TransactionForm';
import { Transaction } from '../types';
import { format } from 'date-fns';

import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function ExpensePage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, loading } = useTransactions();
  const { toast, showToast, hideToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const filteredTransactions = expenseTransactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (t.note?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Semua', 'Bahan baku', 'Operasional', 'Gaji', 'Transport', 'Listrik', 'Lainnya'];

  const handleEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  const handleSubmit = async (data: Transaction) => {
    try {
      if (editingTransaction) {
        await updateTransaction(data);
        showToast('Pengeluaran berhasil diperbarui');
      } else {
        await addTransaction(data);
        showToast('Pengeluaran berhasil disimpan');
      }
      handleClose();
    } catch (error) {
      showToast('Gagal menyimpan transaksi', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      showToast('Pengeluaran berhasil dihapus');
      handleClose();
    } catch (error) {
      showToast('Gagal menghapus transaksi', 'error');
    }
  };

  return (
    <div className="space-y-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.5em] mb-2">Finance</p>
          <h1 className="text-4xl font-black tracking-tighter lg:text-5xl">Pengeluaran</h1>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-3 rounded-3xl bg-black px-8 py-4 text-sm font-black text-white shadow-2xl shadow-black/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          Tambah Pengeluaran
        </button>
      </header>

      {/* Filters */}
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={20} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-4xl border border-black/[0.03] bg-white px-16 py-5 text-sm font-bold focus:border-black/[0.1] focus:outline-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all"
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "whitespace-nowrap rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all duration-300",
                selectedCategory === cat 
                  ? "bg-black text-white shadow-xl shadow-black/10 scale-105" 
                  : "bg-white text-black/30 border border-black/[0.03] hover:bg-black/[0.02] hover:text-black"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
          </div>
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={t.id} 
              onClick={() => handleEdit(t)}
              className="group os-card p-6 lg:p-8 flex cursor-pointer items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 transition-transform duration-500 group-hover:scale-110">
                  <TrendingDown size={28} />
                </div>
                <div>
                  <p className="text-xl font-black tracking-tight">{t.title}</p>
                  <p className="text-xs font-bold text-black/30 mt-1 uppercase tracking-wider">{format(new Date(t.date), 'dd MMMM yyyy')} • {t.category}</p>
                  {t.note && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-black/[0.03] px-3 py-1.5">
                      <p className="text-[10px] font-bold text-black/40 italic">"{t.note}"</p>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-2xl font-black tracking-tighter text-rose-600">
                - {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(t.amount)}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="py-32 text-center rounded-5xl border-4 border-dashed border-black/[0.03]">
            <div className="mx-auto h-20 w-20 rounded-full bg-black/[0.02] flex items-center justify-center mb-6">
              <TrendingDown size={40} className="text-black/10" />
            </div>
            <p className="text-sm font-black text-black/20 uppercase tracking-[0.3em]">No expense records found</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <TransactionForm
          type="expense"
          initialData={editingTransaction}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
