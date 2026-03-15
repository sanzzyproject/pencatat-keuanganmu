import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays, startOfDay } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const { transactions, getSummary, getTodaySummary } = useTransactions();
  const summary = getSummary();
  const today = getTodaySummary();

  // Prepare chart data (last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'yyyy-MM-dd');
  });

  const chartData = {
    labels: last7Days.map(d => format(new Date(d), 'dd MMM')),
    datasets: [
      {
        label: 'Pemasukan',
        data: last7Days.map(date => {
          return transactions
            .filter(t => t.date === date && t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        }),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 4,
      },
      {
        label: 'Pengeluaran',
        data: last7Days.map(date => {
          return transactions
            .filter(t => t.date === date && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        }),
        borderColor: '#F43F5E',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#000',
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        padding: 16,
        cornerRadius: 16,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.03)' },
        ticks: { 
          font: { size: 11, weight: 'bold' as const },
          color: 'rgba(0,0,0,0.3)',
          callback: (value: any) => {
            if (value >= 1000000) return (value / 1000000) + 'M';
            if (value >= 1000) return (value / 1000) + 'K';
            return value;
          }
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: 11, weight: 'bold' as const },
          color: 'rgba(0,0,0,0.3)'
        }
      }
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.5em] mb-2">Overview</p>
          <h1 className="text-4xl font-black tracking-tighter lg:text-5xl">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/income" 
            className="flex items-center gap-3 rounded-3xl bg-black px-8 py-4 text-sm font-black text-white shadow-2xl shadow-black/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={20} />
            Catat Transaksi
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="os-card p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
            <TrendingUp size={28} />
          </div>
          <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">Income Today</p>
          <p className="mt-2 text-3xl font-black tracking-tighter">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(today.income)}
          </p>
        </div>
        <div className="os-card p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
            <TrendingDown size={28} />
          </div>
          <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">Expense Today</p>
          <p className="mt-2 text-3xl font-black tracking-tighter">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(today.expense)}
          </p>
        </div>
        <div className="rounded-4xl bg-black p-8 shadow-2xl shadow-black/20 text-white transition-all duration-300 hover:-translate-y-1">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-white">
            <Wallet size={28} />
          </div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Total Balance</p>
          <p className="mt-2 text-3xl font-black tracking-tighter">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(summary.balance)}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="os-card p-8 lg:p-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Cashflow</h2>
            <p className="text-xs font-bold text-black/30 mt-1">7 Hari Terakhir</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Expense</span>
            </div>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="os-card p-8">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
          <Link to="/reports" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors">
            View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="group flex items-center justify-between rounded-3xl border border-black/[0.03] p-6 transition-all hover:bg-black/[0.02] hover:border-black/[0.08]">
              <div className="flex items-center gap-6">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {t.type === 'income' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                </div>
                <div>
                  <p className="text-lg font-black tracking-tight">{t.title}</p>
                  <p className="text-xs font-bold text-black/30 mt-1 uppercase tracking-wider">{format(new Date(t.date), 'dd MMM yyyy')} • {t.category}</p>
                </div>
              </div>
              <p className={`text-xl font-black tracking-tighter ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {t.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(t.amount)}
              </p>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="py-20 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-black/[0.03] flex items-center justify-center mb-4">
                <Wallet size={32} className="text-black/10" />
              </div>
              <p className="text-sm font-bold text-black/20 uppercase tracking-[0.2em]">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
