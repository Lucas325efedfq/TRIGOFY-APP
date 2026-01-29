import React from 'react';
import { Package, Check } from 'lucide-react';

const ProductCard = ({ produto, isSelected, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-yellow-500 bg-yellow-500/5 shadow-lg shadow-yellow-500/10' 
          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-yellow-500/30'
      }`}
    >
      {/* Image/Icon Container */}
      <div className={`relative w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${
        isSelected ? 'border-yellow-500/50' : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800'
      }`}>
        {produto.imagem ? (
          <img src={produto.imagem} className="w-full h-full object-cover" alt={produto.nome} />
        ) : (
          <Package size={24} className={isSelected ? 'text-yellow-500' : 'text-zinc-300 dark:text-zinc-600'} />
        )}
        
        {isSelected && (
          <div className="absolute inset-0 bg-yellow-500/10 backdrop-blur-[1px]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-black uppercase tracking-tight truncate ${
          isSelected ? 'text-yellow-600 dark:text-yellow-500' : 'text-zinc-900 dark:text-zinc-100'
        }`}>
          {produto.nome}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] font-black text-yellow-600 bg-yellow-500/10 px-1.5 py-0.5 rounded-md">
            R$ {produto.preco}
          </span>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
            Venc: {produto.vencimento}
          </span>
        </div>
      </div>

      {/* Selection Indicator */}
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
        isSelected 
          ? 'border-yellow-500 bg-yellow-500 scale-110 shadow-glow' 
          : 'border-zinc-300 dark:border-zinc-700 group-hover:border-yellow-500/50'
      }`}>
        {isSelected && (
          <Check size={14} className="text-white" strokeWidth={4} />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
