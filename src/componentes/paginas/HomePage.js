import React from 'react';
import { ShoppingBag, Megaphone, XCircle, CheckCircle2, BookOpen, Settings } from 'lucide-react';

const HomePage = ({ 
  setActiveTab, 
  setSiteFiltro, 
  isAdmin, 
  temaEscuro 
}) => {
  const bgCard = temaEscuro ? 'bg-zinc-800' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-600';

  const menuItems = [
    {
      id: 'pedidos-vr',
      title: 'Compras VR',
      description: 'Fazer pedidos Volta Redonda',
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
      action: () => {
        setSiteFiltro('VR');
        setActiveTab('novo');
      }
    },
    {
      id: 'pedidos-rio',
      title: 'Compras RIO/SP',
      description: 'Fazer pedidos Rio/SP',
      icon: ShoppingBag,
      color: 'from-purple-500 to-purple-600',
      action: () => {
        setSiteFiltro('RIO/SP');
        setActiveTab('novo');
      }
    },
    {
      id: 'doacoes',
      title: 'Doações',
      description: 'Solicitar doação de produtos',
      icon: Megaphone,
      color: 'from-green-500 to-green-600',
      action: () => setActiveTab('doacoes')
    },
    {
      id: 'cancelamentos',
      title: 'Cancelamentos',
      description: 'Cancelar pedidos',
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      action: () => setActiveTab('cancelamentos')
    },
    {
      id: 'historico',
      title: 'Meu Histórico',
      description: 'Ver meus pedidos',
      icon: BookOpen,
      color: 'from-yellow-500 to-yellow-600',
      action: () => setActiveTab('historico')
    }
  ];

  if (isAdmin) {
    menuItems.push({
      id: 'aprovacoes',
      title: 'Aprovar Pedidos',
      description: 'Gerenciar aprovações',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-emerald-600',
      action: () => setActiveTab('aprovacoes')
    });
    menuItems.push({
      id: 'config',
      title: 'Administração',
      description: 'Configurações do sistema',
      icon: Settings,
      color: 'from-zinc-500 to-zinc-600',
      action: () => setActiveTab('config')
    });
  }

  return (
    <div className="pb-20 space-y-6 animate-in fade-in duration-500">
      <div className={`${bgCard} p-6 rounded-3xl shadow-sm border`}>
        <h2 className={`text-xl font-black uppercase italic mb-2 ${textMain}`}>
          Bem-vindo ao Trigofy!
        </h2>
        <p className={`text-sm font-bold ${textSub}`}>
          Escolha uma opção abaixo para começar
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`${bgCard} p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all active:scale-95 text-left`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon size={28} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-base font-black uppercase ${textMain}`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs font-bold ${textSub}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
