import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 left-1/2 z-[100] w-full max-w-xs -translate-x-1/2 px-4 lg:bottom-10 lg:left-auto lg:right-10 lg:translate-x-0">
      <div className={`flex items-center gap-3 rounded-2xl p-4 shadow-2xl backdrop-blur-xl border ${
        type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : 'bg-rose-500/90 border-rose-400 text-white'
      } animate-in slide-in-from-bottom-5 duration-300`}>
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
        <p className="flex-1 text-sm font-bold">{message}</p>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-white/20 transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
