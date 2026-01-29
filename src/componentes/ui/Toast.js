import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const Toast = ({ toast }) => {
  if (!toast.show) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} strokeWidth={3} />;
      case 'error':
        return <XCircle size={18} strokeWidth={3} />;
      case 'warning':
        return <AlertCircle size={18} strokeWidth={3} />;
      default:
        return <CheckCircle2 size={18} strokeWidth={3} />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-500 text-white shadow-emerald-500/20';
      case 'error':
        return 'bg-rose-500 text-white shadow-rose-500/20';
      case 'warning':
        return 'bg-yellow-500 text-white shadow-yellow-500/20';
      default:
        return 'bg-zinc-900 text-white shadow-black/20';
    }
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-[90%] sm:max-w-md animate-in slide-in-from-top-10 duration-500">
      <div className={`${getStyles()} px-6 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-lg`}>
        <div className="bg-white/20 p-1.5 rounded-lg">
          {getIcon()}
        </div>
        <span className="font-black uppercase italic text-xs tracking-tight">{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
