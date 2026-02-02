import React from 'react';
import { 
  LayoutGrid, 
  ShoppingBag, 
  Settings,
  BookOpen,
  CheckCircle2,
  Database
} from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, isAdmin, isAprovador, temaEscuro, totalPendencias }) => {
  const navItems = [
    { id: 'home', icon: LayoutGrid, label: 'Menu' }
  ];

  navItems.push({ id: 'compras-aba', icon: ShoppingBag, label: 'Compras' });

  if (!isAdmin || isAprovador) {
    navItems.push({ id: 'historico', icon: BookOpen, label: 'Histórico' });
  }

  if (isAdmin || isAprovador) {
    navItems.push({ id: 'aprovacoes', icon: CheckCircle2, label: 'Aprovações' });
  }

  if (isAdmin) {
    navItems.push({ id: 'admin-painel', icon: Database, label: 'Admin' });
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-50 pointer-events-none">
      <nav className={`flex items-center gap-1 p-2 rounded-2xl border shadow-2xl pointer-events-auto ${
        temaEscuro 
          ? 'bg-zinc-900/80 border-zinc-800/50 text-zinc-400' 
          : 'bg-white/80 border-zinc-200/50 text-zinc-500'
      } backdrop-blur-xl`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'compras-aba' && (activeTab === 'novo' || activeTab === 'pedidos'));
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-yellow-500' 
                  : 'hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-yellow-500/10 rounded-xl animate-in fade-in zoom-in duration-300" />
              )}
              
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.id === 'aprovacoes' && totalPendencias > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 animate-bounce">
                    {totalPendencias}
                  </span>
                )}
              </div>
              
              <span className={`text-[9px] font-bold uppercase tracking-tighter mt-1 ${
                isActive ? 'opacity-100' : 'opacity-60'
              }`}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;
