import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { EXPENSE_CATEGORIES } from '../types';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement,
  Filler
);

export default function AnalyticsPage() {
  const { transactions } = useTransactions();

  // 1. Pie Chart: Expense by Category
  const expenseByCategory = EXPENSE_CATEGORIES.map(cat => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const pieData = {
    labels: EXPENSE_CATEGORIES,
    datasets: [
      {
        data: expenseByCategory,
        backgroundColor: [
          '#000000',
          '#333333',
          '#666666',
          '#999999',
          '#CCCCCC',
          '#EEEEEE',
        ],
        borderWidth: 0,
      },
    ],
  };

  // 2. Bar Chart: Daily Income (Last 14 Days)
  const last14Days = Array.from({ length: 14 }).map((_, i) => {
    const date = subDays(new Date(), 13 - i);
    return format(date, 'yyyy-MM-dd');
  });

  const barData = {
    labels: last14Days.map(d => format(new Date(d), 'dd MMM')),
    datasets: [
      {
        label: 'Pemasukan Harian',
        data: last14Days.map(date => {
          return transactions
            .filter(t => t.date === date && t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        }),
        backgroundColor: '#000000',
        borderRadius: 12,
        barThickness: 12,
      },
    ],
  };

  // 3. Line Chart: Monthly Cashflow Trend
  const currentMonthDays = eachDayOfInterval({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });

  const lineData = {
    labels: currentMonthDays.map(d => format(d, 'dd')),
    datasets: [
      {
        label: 'Pemasukan',
        data: currentMonthDays.map(d => {
          const dateStr = format(d, 'yyyy-MM-dd');
          return transactions
            .filter(t => t.date === dateStr && t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        }),
        borderColor: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 4,
      },
      {
        label: 'Pengeluaran',
        data: currentMonthDays.map(d => {
          const dateStr = format(d, 'yyyy-MM-dd');
          return transactions
            .filter(t => t.date === dateStr && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        }),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor: 'transparent',
        borderDash: [10, 10],
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
      }
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#000',
        titleFont: { family: 'Plus Jakarta Sans', weight: 'bold' as const, size: 12 },
        bodyFont: { family: 'Plus Jakarta Sans', weight: 'bold' as const, size: 12 },
        padding: 16,
        cornerRadius: 16,
        displayColors: false
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: { display: false },
        ticks: { 
          font: { family: 'Plus Jakarta Sans', weight: 'bold' as const, size: 10 },
          callback: (value: any) => `Rp ${Number(value) / 1000}k`
        }
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Plus Jakarta Sans', weight: 'bold' as const, size: 10 } }
      }
    }
  };

  return (
    <div className="space-y-12">
      <header>
        <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.5em] mb-2">Finance</p>
        <h1 className="text-4xl font-black tracking-tighter lg:text-5xl">Analytics</h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Cashflow Trend */}
        <div className="os-card p-10 lg:col-span-2">
          <div className="mb-10">
            <h2 className="text-2xl font-black tracking-tighter">Tren Cashflow Bulan Ini</h2>
            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em] mt-2">Daily income vs expense performance</p>
          </div>
          <div className="h-[400px] w-full">
            <Line data={lineData} options={commonOptions} />
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="os-card p-10">
          <div className="mb-10">
            <h2 className="text-2xl font-black tracking-tighter">Distribusi Pengeluaran</h2>
            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em] mt-2">Category breakdown</p>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            <Pie 
              data={pieData} 
              options={{ 
                ...commonOptions, 
                plugins: { 
                  ...commonOptions.plugins, 
                  legend: { 
                    display: true, 
                    position: 'bottom',
                    labels: {
                      font: { family: 'Plus Jakarta Sans', weight: 'bold' as const, size: 10 },
                      padding: 20,
                      usePointStyle: true,
                      pointStyle: 'circle'
                    }
                  } 
                } 
              }} 
            />
          </div>
        </div>

        {/* Daily Income */}
        <div className="os-card p-10">
          <div className="mb-10">
            <h2 className="text-2xl font-black tracking-tighter">Pemasukan 14 Hari Terakhir</h2>
            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em] mt-2">Recent daily earnings</p>
          </div>
          <div className="h-[300px] w-full">
            <Bar data={barData} options={commonOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
