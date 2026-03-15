import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  FileText, 
  PieChart, 
  Settings 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ArrowUpCircle, label: 'Pemasukan', path: '/income' },
  { icon: ArrowDownCircle, label: 'Pengeluaran', path: '/expense' },
  { icon: FileText, label: 'Laporan', path: '/reports' },
  { icon: PieChart, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Pengaturan', path: '/settings' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1C1E] font-sans selection:bg-black selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="fixed left-4 top-4 bottom-4 hidden w-72 rounded-5xl glass lg:block z-50">
        <div className="flex h-full flex-col p-8">
          <div className="mb-12 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center shadow-lg shadow-black/20">
              <div className="h-6 w-6 rounded-full border-4 border-white/30 border-t-white animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight leading-none">Finance</h1>
              <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mt-1">OS Edition</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-4 rounded-3xl px-6 py-4 transition-all duration-500",
                    isActive 
                      ? "bg-black text-white shadow-2xl shadow-black/20 scale-[1.02]" 
                      : "text-black/50 hover:bg-black/[0.03] hover:text-black"
                  )
                }
              >
                <item.icon size={22} className="transition-transform duration-500 group-hover:scale-110" />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <div className="rounded-4xl bg-black/[0.03] p-6 border border-black/[0.02]">
              <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.3em] mb-2">Developed By</p>
              <p className="text-sm font-extrabold">SANN404 FORUM</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 flex h-20 items-center justify-around rounded-5xl glass lg:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500",
                isActive ? "text-black" : "text-black/30"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} className={cn("transition-all duration-500", isActive ? "scale-110 -translate-y-1" : "")} />
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-black"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Main Content */}
      <main className="pb-32 lg:pb-10 lg:pl-80">
        <div className="mx-auto max-w-7xl p-6 lg:p-12">
          {children}
          <footer className="mt-32 border-t border-black/[0.05] pt-12 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="h-1 w-12 rounded-full bg-black/10" />
              <p className="text-xs font-bold text-black/30 uppercase tracking-[0.4em]">
                Developed by <span className="text-black font-black">SANN404 FORUM</span>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
