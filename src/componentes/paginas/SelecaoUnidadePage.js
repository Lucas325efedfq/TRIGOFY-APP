import React from 'react';
import { ShoppingBag } from 'lucide-react';

const SelecaoUnidadePage = ({ setActiveTab, setSiteFiltro, temaEscuro }) => {
  const bgCard = temaEscuro ? 'bg-zinc-800' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-600';

  const unidades = [
    {
      id: 'VR',
      title: 'Compras VR',
      description: 'Fazer pedidos Volta Redonda',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'RIO/SP',
      title: 'Compras RIO/SP',
      description: 'Fazer pedidos Rio/SP',
      color: 'from-purple-500 to-purple-600',
    }
  ];

  return (
    <div className="animate-in fade-in zoom-in duration-300 space-y-6">
      <div className={`${bgCard} p-6 rounded-3xl shadow-sm border`}>
        <h2 className={`text-xl font-black uppercase italic mb-2 ${textMain}`}>
          Fazer Pedido
        </h2>
        <p className={`text-sm font-bold ${textSub}`}>
          Selecione a unidade desejada para continuar
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
            className={`${bgCard} p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all active:scale-95 text-left`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${unidade.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <ShoppingBag size={28} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className={`text-base font-black uppercase ${textMain}`}>
                  {unidade.title}
                </h3>
                <p className={`text-xs font-bold ${textSub}`}>
                  {unidade.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelecaoUnidadePage;
