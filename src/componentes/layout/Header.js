import React from 'react';
import { Sun, Moon, LogOut, User } from 'lucide-react';

const Header = ({ 
  usuarioInput, 
  temaEscuro, 
  toggleTheme, 
  onLogout 
}) => {
  return (
    <header className={`sticky top-0 z-40 w-full px-4 py-3 ${
      temaEscuro ? 'bg-zinc-950/80' : 'bg-white/80'
    } backdrop-blur-xl border-b ${
      temaEscuro ? 'border-zinc-800/50' : 'border-zinc-200/50'
    }`}>
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform duration-300">
              <img src="/logo.png" alt="Trigofy Logo" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -inset-1 bg-yellow-500/20 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className={`text-lg font-black uppercase italic tracking-tight leading-none ${
              temaEscuro ? 'text-white' : 'text-zinc-900'
            }`}>
              Trigofy
            </h1>
            <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mt-0.5">
              Premium System
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border ${
            temaEscuro ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className={`text-xs font-bold ${
              temaEscuro ? 'text-zinc-300' : 'text-zinc-600'
            }`}>
              {usuarioInput}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-300 ${
                temaEscuro 
                  ? 'bg-zinc-900 text-yellow-400 hover:bg-zinc-800 border border-zinc-800' 
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
              }`}
            >
              {temaEscuro ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
