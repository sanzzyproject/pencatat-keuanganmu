import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { 
  Download, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Calculator
} from 'lucide-react';
import { 
  format, 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  isWithinInterval,
  parseISO,
  subMonths,
  addMonths,
  subWeeks,
  addWeeks,
  subDays,
  addDays
} from 'date-fns';
import { id } from 'date-fns/locale';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from '../lib/utils';

type ReportType = 'daily' | 'weekly' | 'monthly';

export default function ReportsPage() {
  const { transactions } = useTransactions();
  const [reportType, setReportType] = useState<ReportType>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateRange = useMemo(() => {
    switch (reportType) {
      case 'daily':
        return { start: startOfDay(currentDate), end: endOfDay(currentDate) };
      case 'weekly':
        return { start: startOfWeek(currentDate, { weekStartsOn: 1 }), end: endOfWeek(currentDate, { weekStartsOn: 1 }) };
      case 'monthly':
        return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
    }
  }, [reportType, currentDate]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = parseISO(t.date);
      return isWithinInterval(tDate, dateRange);
    });
  }, [transactions, dateRange]);

  const stats = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, profit: income - expense };
  }, [filteredTransactions]);

  const handlePrev = () => {
    switch (reportType) {
      case 'daily': setCurrentDate(subDays(currentDate, 1)); break;
      case 'weekly': setCurrentDate(subWeeks(currentDate, 1)); break;
      case 'monthly': setCurrentDate(subMonths(currentDate, 1)); break;
    }
  };

  const handleNext = () => {
    switch (reportType) {
      case 'daily': setCurrentDate(addDays(currentDate, 1)); break;
      case 'weekly': setCurrentDate(addWeeks(currentDate, 1)); break;
      case 'monthly': setCurrentDate(addMonths(currentDate, 1)); break;
    }
  };

  const exportPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Laporan_${reportType}_${format(currentDate, 'yyyy-MM-dd')}.pdf`);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.5em] mb-2">Finance</p>
          <h1 className="text-4xl font-black tracking-tighter lg:text-5xl">Laporan</h1>
        </div>
        <button 
          onClick={exportPDF}
          className="flex items-center justify-center gap-3 rounded-3xl bg-black px-8 py-4 text-sm font-black text-white shadow-2xl shadow-black/20 transition-all hover:scale-105 active:scale-95"
        >
          <Download size={20} />
          Export PDF
        </button>
      </header>

      {/* Report Type Selector */}
      <div className="flex rounded-4xl border border-black/[0.03] bg-white p-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        {(['daily', 'weekly', 'monthly'] as ReportType[]).map((type) => (
          <button
            key={type}
            onClick={() => {
              setReportType(type);
              setCurrentDate(new Date());
            }}
            className={cn(
              "flex-1 rounded-3xl py-4 text-xs font-black uppercase tracking-widest transition-all duration-300",
              reportType === type ? "bg-black text-white shadow-xl shadow-black/10 scale-105" : "text-black/30 hover:text-black"
            )}
          >
            {type === 'daily' ? 'Harian' : type === 'weekly' ? 'Mingguan' : 'Bulanan'}
          </button>
        ))}
      </div>

      {/* Date Navigator */}
      <div className="flex items-center justify-between rounded-5xl border border-black/[0.03] bg-white p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]">
        <button onClick={handlePrev} className="rounded-2xl p-4 hover:bg-black/[0.02] transition-colors border border-black/[0.03]">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">Periode</p>
          <span className="text-2xl font-black tracking-tighter">
            {reportType === 'daily' && format(currentDate, 'dd MMMM yyyy', { locale: id })}
            {reportType === 'weekly' && `${format(dateRange.start, 'dd MMM')} - ${format(dateRange.end, 'dd MMM yyyy')}`}
            {reportType === 'monthly' && format(currentDate, 'MMMM yyyy', { locale: id })}
          </span>
        </div>
        <button onClick={handleNext} className="rounded-2xl p-4 hover:bg-black/[0.02] transition-colors border border-black/[0.03]">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Report Content for Export */}
      <div id="report-content" className="space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="os-card p-8">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={28} />
            </div>
            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em]">Total Pemasukan</p>
            <p className="mt-2 text-3xl font-black tracking-tighter text-emerald-600">{formatCurrency(stats.income)}</p>
          </div>
          <div className="os-card p-8">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
              <TrendingDown size={28} />
            </div>
            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em]">Total Pengeluaran</p>
            <p className="mt-2 text-3xl font-black tracking-tighter text-rose-600">{formatCurrency(stats.expense)}</p>
          </div>
          <div className={cn(
            "os-card p-8 transition-colors duration-500",
            stats.profit >= 0 ? "bg-black text-white" : "bg-rose-600 text-white"
          )}>
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-white">
              <Calculator size={28} />
            </div>
            <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", stats.profit >= 0 ? "text-white/30" : "text-white/50")}>Profit / Loss</p>
            <p className="mt-2 text-3xl font-black tracking-tighter">{formatCurrency(stats.profit)}</p>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="os-card overflow-hidden">
          <div className="p-8 border-b border-black/[0.03]">
            <h2 className="text-2xl font-black tracking-tighter">Rincian Transaksi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20">
                  <th className="px-8 py-6">Tanggal</th>
                  <th className="px-8 py-6">Nama Transaksi</th>
                  <th className="px-8 py-6">Kategori</th>
                  <th className="px-8 py-6 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.03]">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="group transition-colors hover:bg-black/[0.01]">
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-black/40">{format(parseISO(t.date), 'dd/MM/yyyy')}</td>
                    <td className="px-8 py-6 text-base font-black tracking-tight">{t.title}</td>
                    <td className="px-8 py-6">
                      <span className="rounded-xl bg-black/[0.03] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-black/40">
                        {t.category}
                      </span>
                    </td>
                    <td className={cn(
                      "px-8 py-6 text-right text-lg font-black tracking-tighter",
                      t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    )}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <p className="text-[10px] font-black text-black/10 uppercase tracking-[0.3em]">No transactions in this period</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
