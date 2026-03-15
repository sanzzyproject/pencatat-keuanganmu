import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Smartphone,
  BarChart3,
  Download,
  FileText,
  Lock,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-40 text-center lg:pt-48">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-black rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-black rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl relative z-10"
        >
          <div className="mb-10 inline-flex items-center rounded-full border border-black/[0.05] bg-black/[0.02] px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
            <Sparkles size={14} className="mr-3 text-black/40" />
            <span>Modern Finance for UMKM</span>
          </div>
          
          <h1 className="mb-10 text-6xl font-black tracking-tighter lg:text-9xl leading-[0.9]">
            Catatan Keuangan <br />
            <span className="text-black/10">UMKM</span>
          </h1>
          
          <p className="mx-auto mb-16 max-w-2xl text-lg font-medium text-black/40 lg:text-2xl leading-relaxed">
            Kelola aliran kas usahamu dengan presisi tinggi. 
            Tanpa registrasi, tanpa server, data sepenuhnya milikmu.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative inline-flex items-center gap-4 rounded-full bg-black px-10 py-6 text-lg font-black text-white transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            >
              Mulai Sekarang
              <ArrowRight className="transition-transform group-hover:translate-x-2" size={24} />
            </button>
            
            <div className="flex items-center gap-3 text-black/30 font-black uppercase tracking-widest text-[10px]">
              <Lock size={14} />
              Privacy First
            </div>
          </div>
        </motion.div>

        {/* Floating Elements Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 w-full max-w-6xl"
        >
          <div className="os-card p-4 lg:p-12 bg-white/40 backdrop-blur-2xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-4xl bg-white p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-black/[0.02]">
                <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em]">Saldo Saat Ini</p>
                <p className="text-4xl font-black mt-3 tracking-tighter">Rp 12.450.000</p>
              </div>
              <div className="rounded-4xl bg-white p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-black/[0.02]">
                <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em]">Pemasukan Hari Ini</p>
                <p className="text-4xl font-black mt-3 tracking-tighter text-emerald-600">+ Rp 850.000</p>
              </div>
              <div className="rounded-4xl bg-white p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-black/[0.02]">
                <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em]">Pengeluaran Hari Ini</p>
                <p className="text-4xl font-black mt-3 tracking-tighter text-rose-600">- Rp 210.000</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-black text-white py-40 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-32">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Capabilities</p>
            <h2 className="text-5xl font-black tracking-tighter lg:text-7xl">Fitur Utama</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: 'Input Kilat', desc: 'Catat transaksi dalam hitungan detik dengan interface yang dioptimalkan.' },
              { icon: Smartphone, title: 'Mobile First', desc: 'Didesain khusus untuk layar sentuh dengan navigasi jempol yang intuitif.' },
              { icon: BarChart3, title: 'Visual Analytics', desc: 'Pahami kondisi keuangan bisnismu lewat grafik yang elegan dan informatif.' },
              { icon: FileText, title: 'Auto Reports', desc: 'Laporan harian, mingguan, dan bulanan dihasilkan secara otomatis.' },
              { icon: Download, title: 'PDF Export', desc: 'Unduh laporan profesional siap cetak untuk keperluan administrasi.' },
              { icon: ShieldCheck, title: 'Local Storage', desc: 'Data tersimpan di browser Anda. Privasi total tanpa database eksternal.' },
            ].map((feature, i) => (
              <div key={i} className="group rounded-5xl bg-white/5 p-12 transition-all hover:bg-white/10 border border-white/5">
                <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-black transition-transform group-hover:scale-110">
                  <feature.icon size={32} />
                </div>
                <h3 className="mb-4 text-2xl font-black tracking-tight">{feature.title}</h3>
                <p className="text-lg text-white/40 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-40 px-6 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-24 text-center">
            <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.5em] mb-4">Why Choose Us</p>
            <h2 className="text-5xl font-black tracking-tighter lg:text-7xl">Keunggulan</h2>
          </div>
          
          <div className="space-y-6">
            {[
              'Tanpa registrasi, langsung pakai',
              'Data 100% aman di perangkat sendiri',
              'Akses offline tanpa koneksi internet',
              'Desain minimalis & profesional',
              'Gratis selamanya untuk UMKM',
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                viewport={{ once: true }}
                className="flex items-center gap-8 rounded-4xl border border-black/[0.03] p-10 transition-all hover:bg-black hover:text-white group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black group-hover:bg-white text-white group-hover:text-black transition-colors">
                  <CheckCircle2 size={24} />
                </div>
                <span className="text-2xl font-black tracking-tight">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.03] py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-10">
          <div className="h-16 w-16 rounded-3xl bg-black flex items-center justify-center text-white shadow-2xl shadow-black/20">
            <span className="text-2xl font-black italic">S</span>
          </div>
          <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.5em]">
            Developed by <span className="text-black">SANN404 FORUM</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
