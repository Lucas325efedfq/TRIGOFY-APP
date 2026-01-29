import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const SelecaoUnidadePage = ({ setActiveTab, setSiteFiltro, temaEscuro }) => {
  const bgCard = temaEscuro ? 'bg-zinc-900/50' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-500';
  const borderColor = temaEscuro ? 'border-zinc-800/50' : 'border-zinc-200/50';

  const unidades = [
    {
      id: 'VR',
      title: 'Compras VR',
      description: 'Unidade Volta Redonda',
      color: 'from-blue-400 to-blue-600',
      shadow: 'shadow-blue-500/20',
    },
    {
      id: 'RIO/SP',
      title: 'Compras RIO/SP',
      description: 'Unidade Rio de Janeiro / SP',
      color: 'from-purple-400 to-purple-600',
      shadow: 'shadow-purple-500/20',
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-32">
      <div className={`${bgCard} p-8 rounded-[2.5rem] border ${borderColor} shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full" />
        <h2 className={`text-2xl font-black uppercase italic tracking-tighter mb-2 ${textMain}`}>
          Fazer <span className="text-yellow-500">Pedido</span>
        </h2>
        <p className={`text-sm font-medium ${textSub}`}>
          Selecione a unidade para ver os produtos disponíveis
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {unidades.map((unidade) => (
          <button
            key={unidade.id}
            onClick={() => {
              setSiteFiltro(unidade.id);
              setActiveTab('novo');
            }}
            className={`group relative ${bgCard} p-6 rounded-3xl border ${borderColor} hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/5 active:scale-95 text-left overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${unidade.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
            
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 bg-gradient-to-br ${unidade.color} rounded-2xl flex items-center justify-center shadow-lg ${unidade.shadow} group-hover:scale-110 transition-transform duration-500`}>
                <ShoppingBag size={32} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-black uppercase tracking-tight ${textMain}`}>
                  {unidade.title}
                </h3>
                <p className={`text-xs font-bold ${textSub}`}>
                  {unidade.description}
                </p>
              </div>
              <div className={`p-2 rounded-full ${temaEscuro ? 'bg-zinc-800' : 'bg-zinc-100'} group-hover:bg-yellow-500 group-hover:text-white transition-colors`}>
                <ArrowRight size={20} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelecaoUnidadePage;
