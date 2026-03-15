import React, { useRef } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { 
  Download, 
  Upload, 
  Trash2, 
  Shield,
  Settings as SettingsIcon,
  Database,
  Info
} from 'lucide-react';
import * as db from '../lib/db';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

export default function SettingsPage() {
  const { transactions, refreshTransactions } = useTransactions();
  const { showToast, toast, hideToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (transactions.length === 0) {
      showToast('Tidak ada data untuk diekspor', 'error');
      return;
    }
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `backup_umkm_finance_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast('Data berhasil diekspor');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!Array.isArray(data)) {
          throw new Error('Format data tidak valid.');
        }

        if (confirm('Mengimpor data akan menghapus data saat ini. Lanjutkan?')) {
          await db.importTransactions(data);
          await refreshTransactions();
          showToast('Data berhasil diimpor');
        }
      } catch (error) {
        showToast('Gagal mengimpor data. Pastikan file JSON valid.', 'error');
        console.error(error);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearData = async () => {
    if (confirm('PERINGATAN: Semua data akan dihapus permanen. Tindakan ini tidak dapat dibatalkan. Hapus semua data?')) {
      await db.clearAllTransactions();
      await refreshTransactions();
      showToast('Semua data telah dihapus');
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      
      <header>
        <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.5em] mb-2">System</p>
        <h1 className="text-4xl font-black tracking-tighter lg:text-5xl">Settings</h1>
      </header>

      <div className="space-y-8">
        {/* Data Management */}
        <section className="os-card p-10">
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter">Data Management</h2>
              <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em] mt-1">Backup and restore your records</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <button
              onClick={handleExport}
              className="group flex items-center gap-6 rounded-4xl border border-black/[0.03] bg-black/[0.02] p-8 transition-all hover:bg-black hover:text-white"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl group-hover:bg-white/10 group-hover:text-white transition-colors">
                <Download size={28} />
              </div>
              <div className="text-left">
                <p className="text-lg font-black tracking-tight">Export Data</p>
                <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Download JSON backup</p>
              </div>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center gap-6 rounded-4xl border border-black/[0.03] bg-black/[0.02] p-8 transition-all hover:bg-black hover:text-white"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl group-hover:bg-white/10 group-hover:text-white transition-colors">
                <Upload size={28} />
              </div>
              <div className="text-left">
                <p className="text-lg font-black tracking-tight">Import Data</p>
                <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Restore from backup</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
              />
            </button>

            <button
              onClick={handleClearData}
              className="group flex items-center gap-6 rounded-4xl border border-rose-100 bg-rose-50/30 p-8 transition-all hover:bg-rose-600 hover:text-white md:col-span-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl group-hover:bg-white/10 group-hover:text-white transition-colors text-rose-600">
                <Trash2 size={28} />
              </div>
              <div className="text-left">
                <p className="text-lg font-black tracking-tight">Clear All Data</p>
                <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Permanently delete everything</p>
              </div>
            </button>
          </div>
        </section>

        {/* About */}
        <section className="os-card p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <Shield size={200} />
          </div>
          
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
              <Info size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter">About App</h2>
              <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em] mt-1">Application information</p>
            </div>
          </div>

          <div className="space-y-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-4xl bg-black flex items-center justify-center text-white shadow-2xl shadow-black/20">
                <span className="text-3xl font-black italic">S</span>
              </div>
              <div>
                <p className="text-2xl font-black tracking-tighter">SANN404 Finance</p>
                <p className="text-xs font-bold text-black/30 uppercase tracking-[0.3em]">Version 2.0.26 • OS Theme</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-8 border-t border-black/[0.03]">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-black/20 uppercase tracking-widest">Developer</p>
                <p className="text-sm font-black tracking-tight">SANN404 FORUM</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-black/20 uppercase tracking-widest">Platform</p>
                <p className="text-sm font-black tracking-tight">Web (IndexedDB)</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-black/20 uppercase tracking-widest">Security</p>
                <p className="text-sm font-black tracking-tight">Local Storage Only</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
