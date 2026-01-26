import React from 'react';
import { CheckCircle2, Settings, Database } from 'lucide-react';

const HomePage = ({ 
  setActiveTab, 
  isAdmin, 
  temaEscuro 
}) => {
  const bgCard = temaEscuro ? 'bg-zinc-800' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-600';

  const menuItems = [];

  if (isAdmin) {
    menuItems.push({
      id: 'admin-painel',
      title: 'Painel Admin',
      description: 'Gerenciar cadastros na nuvem',
      icon: Database,
      color: 'from-indigo-500 to-indigo-600',
      action: () => setActiveTab('admin-painel')
    });
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
          {isAdmin ? 'Escolha uma opção administrativa abaixo' : 'Acesso restrito a administradores'}
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
        {!isAdmin && (
          <div className={`${bgCard} p-6 rounded-2xl border shadow-sm text-center`}>
            <p className={`${textSub} font-bold`}>Você não tem permissão para acessar esta área.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
