import React from 'react';
import { 
  LayoutGrid, 
  ShoppingBag, 
  Megaphone, 
  Settings, 
  BookOpen 
} from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, isAdmin, isAprovador, temaEscuro }) => {
  const navItems = [
    { id: 'home', icon: LayoutGrid, label: 'Menu' }
  ];

  // Usuários comuns e Aprovadores veem as abas de compras/doações
  if (!isAdmin || isAprovador) {
    navItems.push({ id: 'pedidos', icon: ShoppingBag, label: 'Compras' });
    navItems.push({ id: 'doacoes', icon: Megaphone, label: 'Doações' });
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
          const isActive = activeTab === item.id;
          
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
              <Icon size={20} strokeWidth={2.5} />
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
