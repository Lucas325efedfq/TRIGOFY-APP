import React from 'react';
import { Clock, ShoppingBag, Gift, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const HistoricoPage = ({ 
  historico, 
  temaEscuro, 
  setActiveTab,
  carregando 
}) => {
  const bgCard = temaEscuro ? 'bg-zinc-800' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-600';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APROVADO':
        return <CheckCircle2 className="text-green-500" size={18} />;
      case 'REPROVADO':
        return <XCircle className="text-red-500" size={18} />;
      default:
        return <AlertCircle className="text-yellow-500" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APROVADO':
        return 'text-green-500';
      case 'REPROVADO':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
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
    <div className="animate-in slide-in-from-right duration-300 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase`}>← Voltar</button>
        <h2 className={`text-xl font-black uppercase italic ${textMain}`}>Meu Histórico</h2>
      </div>

      {carregando ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          <p className={`${textSub} font-bold animate-pulse`}>CARREGANDO HISTÓRICO...</p>
        </div>
      ) : historico.length === 0 ? (
        <div className={`${bgCard} p-10 rounded-3xl border shadow-sm text-center space-y-4`}>
          <div className="bg-zinc-100 dark:bg-zinc-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Clock className="text-zinc-400" size={32} />
          </div>
          <p className={`${textSub} font-bold`}>Você ainda não possui pedidos ou doações registradas.</p>
          <button 
            onClick={() => setActiveTab('home')}
            className="bg-yellow-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-sm"
          >
            Começar Agora
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {historico.map((item) => (
            <div key={item.id} className={`${bgCard} p-4 rounded-2xl border shadow-sm flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                item.tipo === 'COMPRA' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
              }`}>
                {item.tipo === 'COMPRA' ? <ShoppingBag size={24} /> : <Gift size={24} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className={`font-black uppercase text-sm truncate ${textMain}`}>{item.produto}</h3>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-700 ${textSub}`}>
                    {item.tipo}
                  </span>
                </div>
                
                <p className={`text-xs font-bold ${textSub} mt-1`}>{item.detalhes}</p>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-zinc-400 font-medium">{formatarData(item.data)}</span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(item.status)}
                    <span className={`text-[10px] font-black uppercase ${getStatusColor(item.status)}`}>
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
