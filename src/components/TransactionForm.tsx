import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types';
import { X, Save, Trash2, Calendar, Tag, DollarSign, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface TransactionFormProps {
  type: TransactionType;
  initialData?: Transaction;
  onSubmit: (data: Transaction) => void;
  onDelete?: (id: number) => void;
  onClose: () => void;
}

export default function TransactionForm({ type, initialData, onSubmit, onDelete, onClose }: TransactionFormProps) {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    category: type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    amount: 0,
    note: '',
    type: type,
    createdAt: Date.now(),
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || formData.amount <= 0) {
      return;
    }
    onSubmit(formData as Transaction);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-xl">
      <div className="w-full max-w-lg overflow-hidden rounded-[3rem] bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-300 ease-out">
        <div className="flex items-center justify-between border-b border-black/[0.03] p-10">
          <div>
            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.5em] mb-1">Transaction</p>
            <h2 className="text-3xl font-black tracking-tighter">
              {initialData ? 'Edit' : 'New'} {type === 'income' ? 'Income' : 'Expense'}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-full p-4 hover:bg-black/[0.03] transition-colors border border-black/[0.03]">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/30">
                <Calendar size={14} />
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-3xl border border-black/[0.05] bg-black/[0.02] px-6 py-4 font-bold focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none"
              />
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/30">
                <Tag size={14} />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-3xl border border-black/[0.05] bg-black/[0.02] px-6 py-4 font-bold focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/30">
              <FileText size={14} />
              Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sales Revenue"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-3xl border border-black/[0.05] bg-black/[0.02] px-6 py-4 font-bold focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/30">
              <DollarSign size={14} />
              Amount (IDR)
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="0"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full rounded-3xl border border-black/[0.05] bg-black/[0.02] px-6 py-5 text-2xl font-black tracking-tighter focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/30">
              <FileText size={14} />
              Note (Optional)
            </label>
            <textarea
              placeholder="Add some details..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full rounded-3xl border border-black/[0.05] bg-black/[0.02] px-6 py-4 font-bold focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none resize-none h-32"
            />
          </div>

          <div className="flex gap-4 pt-6">
            {initialData && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this transaction?')) {
                    onDelete(initialData.id!);
                  }
                }}
                className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
              >
                <Trash2 size={24} />
              </button>
            )}
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-4 rounded-3xl bg-black px-8 py-5 text-lg font-black text-white shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Save size={24} />
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
