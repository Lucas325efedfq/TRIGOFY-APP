import React from 'react';
import { 
  LayoutGrid, 
  ShoppingBag, 
  Settings,
  BookOpen
} from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, isAdmin, isAprovador, temaEscuro, totalPendencias }) => {
  const navItems = [
    { id: 'home', icon: LayoutGrid, label: 'Menu' }
  ];

  // Aba de Compras centralizada na barra inferior
  navItems.push({ id: 'compras-aba', icon: ShoppingBag, label: 'Compras' });

  // Para usuários comuns e aprovadores, mantém o Histórico na barra inferior
  if (!isAdmin || isAprovador) {
    navItems.push({ id: 'historico', icon: BookOpen, label: 'Histórico' });
  }

  // Apenas Admin vê a aba de Administração na navegação
  if (isAdmin) {
    navItems.push({ id: 'config', icon: Settings, label: 'Administração' });
  }

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${
      temaEscuro ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'
    } border-t shadow-2xl z-40`}>
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          // A aba Compras fica ativa se estiver na seleção de unidade OU no formulário de novo pedido
          const isActive = activeTab === item.id || (item.id === 'compras-aba' && (activeTab === 'novo' || activeTab === 'pedidos'));
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'bg-yellow-500 text-white scale-105' 
                  : temaEscuro 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={2.5} />
                {item.id === 'config' && totalPendencias > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-800 animate-bounce">
                    {totalPendencias}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-black uppercase tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
