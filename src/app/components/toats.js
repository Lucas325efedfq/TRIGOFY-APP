// src/components/Toast.js
import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type, onClose }) {
  // Define cores baseadas no tipo (sucesso ou erro)
  const styles = type === 'success' 
    ? 'bg-zinc-900 border-yellow-500 text-yellow-500' 
    : 'bg-red-500 border-red-400 text-white';

  return (
    <div className={`absolute top-10 left-6 right-6 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 z-50 border ${styles}`}>
      {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <span className="font-black text-[11px] uppercase tracking-tighter flex-1">{message}</span>
      {/* Botão de fechar opcional */}
      {onClose && (
        <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      )}
    </div>
  );
}