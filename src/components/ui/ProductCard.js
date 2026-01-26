import React from 'react';
import { Package } from 'lucide-react';

const ProductCard = ({ produto, isSelected, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
        isSelected ? 'border-yellow-500 bg-yellow-50' : 'border-zinc-100'
      }`}
    >
      <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden flex items-center justify-center border">
        {produto.imagem ? (
          <img src={produto.imagem} className="w-full h-full object-cover" alt={produto.nome} />
        ) : (
          <Package size={20} className="text-zinc-300" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs font-black uppercase tracking-tight">{produto.nome}</p>
        <p className="text-[10px] font-bold text-yellow-600">R$ {produto.preco}</p>
        <p className="text-[9px] text-zinc-400">Venc: {produto.vencimento}</p>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
        isSelected ? 'border-yellow-500 bg-yellow-500' : 'border-zinc-300'
      }`}>
        {isSelected && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
