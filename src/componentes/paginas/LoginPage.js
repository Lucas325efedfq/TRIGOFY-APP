import React, { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';

const LoginPage = ({ 
  onLogin, 
  usuariosAutorizados, 
  temaEscuro 
}) => {
  const [usuarioInput, setUsuarioInput] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const usuarioEncontrado = usuariosAutorizados.find(
      u => u.usuario && u.usuario.toLowerCase() === usuarioInput.toLowerCase() && u.senha === senha
    );

    if (usuarioEncontrado) {
      onLogin(usuarioEncontrado.usuario, usuarioEncontrado.origem, usuarioEncontrado.funcao);
      setErro('');
    } else {
      setErro('Usuário ou senha incorretos!');
    }
  };

  const bgMain = temaEscuro ? 'bg-zinc-950' : 'bg-zinc-50';
  const bgCard = temaEscuro ? 'bg-zinc-900/50' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';

  return (
    <div className={`min-h-screen ${bgMain} flex items-center justify-center p-6 relative overflow-hidden`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-500/5 blur-[100px] rounded-full" />
      </div>

      <div className={`${bgCard} p-10 rounded-[2.5rem] shadow-2xl border ${temaEscuro ? 'border-zinc-800/50' : 'border-zinc-200/50'} w-full max-w-md space-y-8 relative z-10 backdrop-blur-xl animate-in fade-in zoom-in duration-700`}>
        <div className="text-center space-y-4">
          <div className="relative inline-block group">
            <div className="w-24 h-24 rounded-[2rem] overflow-hidden mx-auto shadow-2xl shadow-yellow-500/20 group-hover:scale-105 transition-transform duration-500">
              <img src="/logo.png" alt="Trigofy Logo" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -inset-2 bg-yellow-500/20 blur-xl rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div>
            <h1 className={`text-4xl font-black uppercase italic tracking-tighter ${textMain}`}>
              Trigofy
            </h1>
            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] mt-1">
              Vendas e Doações - TRIGO
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">
              Usuário
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-yellow-500 transition-colors">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="Seu identificador"
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none font-bold transition-all ${
                  temaEscuro 
                    ? 'bg-zinc-800/50 border-zinc-700 text-white focus:border-yellow-500/50 focus:bg-zinc-800' 
                    : 'bg-zinc-50 border-zinc-200 focus:border-yellow-500/50 focus:bg-white'
                }`}
                value={usuarioInput}
                onChange={(e) => setUsuarioInput(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">
              Senha
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-yellow-500 transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none font-bold transition-all ${
                  temaEscuro 
                    ? 'bg-zinc-800/50 border-zinc-700 text-white focus:border-yellow-500/50 focus:bg-zinc-800' 
                    : 'bg-zinc-50 border-zinc-200 focus:border-yellow-500/50 focus:bg-white'
                }`}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          {erro && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl text-xs font-bold animate-in shake duration-300">
              {erro}
            </div>
          )}

          <button
            type="submit"
            className="group w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:shadow-yellow-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Entrar no Sistema
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
            © 2026 Trigofy App 
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
