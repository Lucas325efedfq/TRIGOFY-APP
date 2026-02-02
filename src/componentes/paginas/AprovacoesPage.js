import React from 'react';
import { Check, X, ArrowLeft, ShoppingBag, Gift, Clock, User, ExternalLink } from 'lucide-react';

const AprovacoesPage = ({ 
  pedidosParaAprovar, 
  onAtualizarStatus, 
  temaEscuro, 
  setActiveTab 
}) => {
  const bgCard = temaEscuro ? 'bg-zinc-900/50' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-500';
  const borderColor = temaEscuro ? 'border-zinc-800/50' : 'border-zinc-200/50';

  const formatarData = (dataStr) => {
    if (!dataStr) return '';
    try {
      const data = new Date(dataStr);
      return data.toLocaleDateString('pt-BR');
    } catch (e) {
      return dataStr;
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-700 pb-32 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('home')} 
          className={`flex items-center gap-2 ${textSub} font-black text-[10px] uppercase tracking-widest hover:text-yellow-500 transition-colors`}
        >
          <ArrowLeft size={14} /> Voltar
        </button>
        <h2 className={`text-xl font-black uppercase italic tracking-tighter ${textMain}`}>
          Fila de <span className="text-yellow-500">Aprovações</span>
        </h2>
      </div>

      {pedidosParaAprovar.length === 0 ? (
        <div className={`${bgCard} p-12 rounded-[2.5rem] border ${borderColor} shadow-xl flex flex-col items-center justify-center text-center space-y-4`}>
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
            <Check size={32} strokeWidth={3} />
          </div>
          <div className="space-y-1">
            <h3 className={`font-black uppercase tracking-tight ${textMain}`}>Tudo em dia!</h3>
            <p className={`text-xs font-bold ${textSub}`}>Não há solicitações pendentes de aprovação no momento.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidosParaAprovar.map((item) => (
            <div 
              key={item.id} 
              className={`${bgCard} p-6 rounded-[2rem] border ${borderColor} shadow-lg space-y-4 relative overflow-hidden group hover:border-yellow-500/30 transition-all`}
            >
              {/* Badge de Tipo */}
              <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl font-black text-[9px] uppercase tracking-widest ${
                item.tipo === 'COMPRA' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {item.tipo}
              </div>

              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  item.tipo === 'COMPRA' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                }`}>
                  {item.tipo === 'COMPRA' ? <ShoppingBag size={24} /> : <Gift size={24} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-black uppercase tracking-tight truncate ${textMain}`}>
                    {item.produto}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${textSub}`}>
                      <User size={12} /> {item.solicitante}
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${textSub}`}>
                      <Clock size={12} /> {formatarData(item.data)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalhes Específicos */}
              <div className={`p-4 ${temaEscuro ? 'bg-zinc-800/30' : 'bg-zinc-50'} rounded-2xl border ${borderColor} grid grid-cols-2 gap-4`}>
                {item.tipo === 'COMPRA' ? (
                  <>
                    <div>
                      <p className={`text-[8px] font-black uppercase tracking-widest ${textSub} mb-0.5`}>Valor</p>
                      <p className={`text-xs font-black ${textMain}`}>R$ {item.valor}</p>
                    </div>
                    <div>
                      <p className={`text-[8px] font-black uppercase tracking-widest ${textSub} mb-0.5`}>Site</p>
                      <p className={`text-xs font-black text-yellow-500 flex items-center gap-1`}>
                        {item.site} <ExternalLink size={10} />
                      </p>
                    </div>
                    <div>
                      <p className={`text-[8px] font-black uppercase tracking-widest ${textSub} mb-0.5`}>Área</p>
                      <p className={`text-xs font-black ${textMain}`}>{item.area || '-'}</p>
                    </div>
                    <div>
                      <p className={`text-[8px] font-black uppercase tracking-widest ${textSub} mb-0.5`}>Retirada</p>
                      <p className={`text-xs font-black ${textMain}`}>{formatarData(item.data_retirada) || '-'}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className={`text-[8px] font-black uppercase tracking-widest ${textSub} mb-0.5`}>Área</p>
                      <p className={`text-xs font-black ${textMain}`}>{item.area}</p>
                    </div>
                    <div>
                      <p className={`text-[8px] font-black uppercase tracking-widest ${textSub} mb-0.5`}>Vencimento</p>
                      <p className={`text-xs font-black ${textMain}`}>{item.vencimento}</p>
                    </div>
                    <div className="col-span-2">
                      <p className={`text-[8px] font-black uppercase tracking-widest ${textSub} mb-0.5`}>Motivo</p>
                      <p className={`text-[10px] font-bold ${textMain} italic`}>"{item.motivo}"</p>
                    </div>
                  </>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => onAtualizarStatus(item.id, 'APROVADO', item.tabelaOrigem)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 active:scale-95"
                >
                  <Check size={14} strokeWidth={3} /> Aprovar
                </button>
                <button 
                  onClick={() => onAtualizarStatus(item.id, 'REPROVADO', item.tabelaOrigem)}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                >
                  <X size={14} strokeWidth={3} /> Reprovar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AprovacoesPage;
