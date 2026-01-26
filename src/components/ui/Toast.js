import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const Toast = ({ toast }) => {
  if (!toast.show) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      default:
        return <CheckCircle2 size={20} />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
      <div className={`${getBackgroundColor()} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm`}>
        {getIcon()}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
