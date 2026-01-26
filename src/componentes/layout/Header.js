import React from 'react';
import { Sun, Moon, LogOut, User } from 'lucide-react';

const Header = ({ 
  usuarioInput, 
  temaEscuro, 
  toggleTheme, 
  onLogout 
}) => {
  return (
    <header className={`sticky top-0 z-30 ${
      temaEscuro ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'
    } border-b shadow-sm`}>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-lg">T</span>
          </div>
          <div>
            <h1 className={`text-lg font-black uppercase italic ${
              temaEscuro ? 'text-white' : 'text-zinc-900'
            }`}>
              Trigofy
            </h1>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
              Sistema de Pedidos
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
            temaEscuro ? 'bg-zinc-700' : 'bg-zinc-100'
          }`}>
            <User size={14} className="text-yellow-500" />
            <span className={`text-xs font-bold ${
              temaEscuro ? 'text-white' : 'text-zinc-900'
            }`}>
              {usuarioInput}
            </span>
          </div>
          
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all ${
              temaEscuro 
                ? 'bg-zinc-700 text-yellow-400 hover:bg-zinc-600' 
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {temaEscuro ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
