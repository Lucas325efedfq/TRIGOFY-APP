import React from 'react';
import { Clock, ShoppingBag, Gift, CheckCircle2, XCircle, AlertCircle, ArrowLeft, Tag, X } from 'lucide-react';

const HistoricoPage = ({ 
  historico, 
  temaEscuro, 
  setActiveTab,
  carregando 
}) => {
  const bgCard = temaEscuro ? 'bg-zinc-900/50' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-500';
  const borderColor = temaEscuro ? 'border-zinc-800/50' : 'border-zinc-200/50';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APROVADO':
        return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'REPROVADO':
        return <XCircle className="text-rose-500" size={16} />;
      default:
        return <AlertCircle className="text-yellow-500" size={16} />;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'APROVADO':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'REPROVADO':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  const getTypeStyles = (tipo) => {
    switch (tipo) {
      case 'COMPRA':
        return 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-blue-500/20';
      case 'DOACAO':
        return 'bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-purple-500/20';
      case 'CANCELAMENTO':
        return 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-red-500/20';
      case 'VENDA':
        return 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/20';
      default:
        return 'bg-gradient-to-br from-zinc-400 to-zinc-600 text-white shadow-zinc-500/20';
    }
  };

  const getTypeBadge = (tipo) => {
    switch (tipo) {
      case 'COMPRA':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'DOACAO':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'CANCELAMENTO':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'VENDA':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'COMPRA':
        return <ShoppingBag size={24} strokeWidth={2.5} />;
      case 'DOACAO':
        return <Gift size={24} strokeWidth={2.5} />;
      case 'CANCELAMENTO':
        return <X size={24} strokeWidth={2.5} />;
      case 'VENDA':
        return <Tag size={24} strokeWidth={2.5} />;
      default:
        return <Clock size={24} strokeWidth={2.5} />;
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'Data não disponível';
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dataString;
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
        <h2 className={`text-xl font-black uppercase italic tracking-tighter ${textMain}`}>Meu <span className="text-yellow-500">Histórico</span></h2>
      </div>

      {carregando ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-zinc-200 dark:border-zinc-800 border-t-yellow-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock size={24} className="text-yellow-500 animate-pulse" />
            </div>
          </div>
          <p className={`${textSub} font-black text-[10px] uppercase tracking-[0.3em] animate-pulse`}>Sincronizando dados...</p>
        </div>
      ) : historico.length === 0 ? (
        <div className={`${bgCard} p-12 rounded-[2.5rem] border ${borderColor} shadow-xl text-center space-y-6 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full" />
          <div className="bg-zinc-100 dark:bg-zinc-800 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
            <Clock className="text-zinc-400 dark:text-zinc-600" size={32} />
          </div>
          <div className="space-y-2">
            <p className={`${textMain} font-black uppercase italic text-lg`}>Nada por aqui ainda</p>
            <p className={`${textSub} text-xs font-medium max-w-[200px] mx-auto`}>Você ainda não possui solicitações registradas no sistema.</p>
          </div>
          <button 
            onClick={() => setActiveTab('home')}
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Começar Agora
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {historico.map((item) => (
            <div key={item.id} className={`${bgCard} p-5 rounded-3xl border ${borderColor} shadow-lg hover:shadow-yellow-500/5 transition-all duration-300 flex items-center gap-5 group`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110 ${getTypeStyles(item.tipo)}`}>
                {getTypeIcon(item.tipo)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`font-black uppercase text-sm truncate tracking-tight ${textMain}`}>{item.produto}</h3>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${getTypeBadge(item.tipo)}`}>
                    {item.tipo}
                  </span>
                </div>
                
                <p className={`text-[11px] font-bold ${textSub} mt-1 line-clamp-1`}>{item.detalhes}</p>
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">{formatarData(item.data)}</span>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${getStatusStyles(item.status)}`}>
                    {getStatusIcon(item.status)}
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoricoPage;
