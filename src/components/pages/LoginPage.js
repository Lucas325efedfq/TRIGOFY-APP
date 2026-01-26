import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

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
      u => u.usuario === usuarioInput && u.senha === senha
    );

    if (usuarioEncontrado) {
      onLogin(usuarioInput, usuarioEncontrado.origem, usuarioEncontrado.funcao);
      setErro('');
    } else {
      setErro('Usuário ou senha incorretos!');
    }
  };

  const bgMain = temaEscuro ? 'bg-zinc-900' : 'bg-gradient-to-br from-yellow-50 to-yellow-100';
  const bgCard = temaEscuro ? 'bg-zinc-800' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';

  return (
    <div className={`min-h-screen ${bgMain} flex items-center justify-center p-4`}>
      <div className={`${bgCard} p-8 rounded-3xl shadow-2xl border w-full max-w-md space-y-6`}>
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white font-black text-4xl">T</span>
          </div>
          <h1 className={`text-3xl font-black uppercase italic ${textMain}`}>
            Trigofy
          </h1>
          <p className="text-sm font-bold text-zinc-400 uppercase">
            Sistema de Pedidos
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-black text-zinc-400 uppercase block mb-2">
              Usuário
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                placeholder="Digite seu usuário"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none font-bold ${
                  temaEscuro 
                    ? 'bg-zinc-700 border-zinc-600 text-white' 
                    : 'bg-zinc-50 border-zinc-200'
                }`}
                value={usuarioInput}
                onChange={(e) => setUsuarioInput(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-zinc-400 uppercase block mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="password"
                placeholder="Digite sua senha"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none font-bold ${
                  temaEscuro 
                    ? 'bg-zinc-700 border-zinc-600 text-white' 
                    : 'bg-zinc-50 border-zinc-200'
                }`}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          {erro && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-bold">
              {erro}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-4 rounded-xl font-black uppercase shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
