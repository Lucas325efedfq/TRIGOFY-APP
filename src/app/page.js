"use client";
import React, { useState } from 'react';
import { 
  LayoutGrid, ClipboardList, Settings, User, Send, 
  ChevronRight, ShoppingBag, Package, Megaphone, Lock, UserCircle, LogOut 
} from 'lucide-react';

export default function TrigofyApp() {
  const [estaLogado, setEstaLogado] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [usuarioInput, setUsuarioInput] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // --- ÁREA DO ADMINISTRADOR (VOCÊ) ---
  const usuariosAutorizados = [
    { usuario: 'lucas.vieira', senha: '123' },
    { usuario: 'admin', senha: 'admin' },
    { usuario: 'trigo.fabrica', senha: '789' }
  ];

  const lidarComLogin = (e) => {
    e.preventDefault();
    const usuarioEncontrado = usuariosAutorizados.find(
      (u) => u.usuario === usuarioInput.toLowerCase() && u.senha === senha
    );

    if (usuarioEncontrado) {
      setEstaLogado(true);
      setErro('');
    } else {
      setErro('Usuário ou senha incorretos.');
    }
  };

  // FUNÇÃO DE LOGOFF (SAIR)
  const fazerLogoff = () => {
    setEstaLogado(false);
    setUsuarioInput(''); // Limpa o nome para o próximo login
    setSenha('');        // Limpa a senha
    setActiveTab('home'); // Reseta a aba para o início
  };

  // TELA DE LOGIN
  if (!estaLogado) {
    return (
      <div className="flex justify-center bg-zinc-200 min-h-screen sm:py-6 font-sans">
        <div className="w-full max-w-[390px] bg-white h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[55px] border-[10px] border-zinc-900 p-8 justify-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black italic text-yellow-500 tracking-tighter mb-2">TRIGOFY</h1>
            <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">Acesso Restrito</p>
          </div>

          <form onSubmit={lidarComLogin} className="space-y-4">
            <div className="relative">
              <UserCircle className="absolute left-4 top-4 text-zinc-400" size={20} />
              <input 
                type="text" 
                placeholder="Nome de Usuário" 
                className="w-full p-4 pl-12 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 text-zinc-800"
                value={usuarioInput}
                onChange={(e) => setUsuarioInput(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 text-zinc-400" size={20} />
              <input 
                type="password" 
                placeholder="Sua senha" 
                className="w-full p-4 pl-12 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 text-zinc-800"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && <p className="text-red-500 text-xs font-bold text-center">{erro}</p>}

            <button type="submit" className="w-full bg-zinc-900 text-yellow-400 py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all">
              ENTRAR NO APP
            </button>
          </form>
        </div>
      </div>
    );
  }

  // TELA PRINCIPAL (PÓS-LOGIN)
  const renderContent = () => {
    if (activeTab === 'home') {
      return (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-3xl text-zinc-900 shadow-lg flex items-center gap-4 border border-yellow-300">
            <div className="bg-white p-2 rounded-2xl shadow-inner w-16 h-16 flex items-center justify-center overflow-hidden">
              <img src="/favicon.ico" alt="Logo" className="w-full h-full object-contain scale-125" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Grupo Trigo</h2>
              <p className="text-yellow-900/80 text-sm font-medium italic">Olá, {usuarioInput}!</p>
            </div>
          </div>

          <h3 className="text-zinc-800 font-extrabold text-lg px-2 mt-6 tracking-tight">Formulário de Compra</h3>
          
          <div className="space-y-3">
            <div onClick={() => setActiveTab('form')} className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-colors group">
              <div className="bg-yellow-400 p-3 rounded-full text-zinc-900 shadow-sm font-black flex items-center justify-center w-11 h-11">24</div>
              <div className="flex-1">
                <p className="font-bold text-zinc-800">Novo Pedido</p>
                <p className="text-xs text-zinc-400 font-medium italic">Toque para solicitar produtos</p>
              </div>
              <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'form') {
      return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 animate-in slide-in-from-bottom duration-300">
          <h2 className="text-lg font-bold mb-4 text-zinc-800">Novo Pedido</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Nome Completo" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 text-zinc-800" />
            <textarea placeholder="Descrição do Pedido" rows="4" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 text-zinc-800"></textarea>
            <button className="w-full bg-zinc-900 text-yellow-400 py-4 rounded-2xl font-black flex items-center justify-center gap-2">
              <Send size={18} /> ENVIAR PEDIDO
            </button>
            <button onClick={() => setActiveTab('home')} className="w-full text-zinc-400 font-bold text-sm uppercase pt-2">Voltar</button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex justify-center bg-zinc-200 min-h-screen sm:py-6 font-sans">
      <div className="w-full max-w-[390px] bg-zinc-50 h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[55px] border-[10px] border-zinc-900">
        
        <div className="h-7 w-full bg-white flex justify-center items-start">
          <div className="w-32 h-5 bg-zinc-900 rounded-b-2xl"></div>
        </div>

        <header className="p-6 flex justify-between items-center bg-white border-b border-zinc-50">
          <div>
            <h1 className="text-2xl font-black italic text-yellow-500 tracking-tighter leading-none uppercase">TRIGOFY</h1>
          </div>
          
          {/* BOTÃO DE LOGOFF (Ícone de Sair) */}
          <button 
            onClick={fazerLogoff} 
            className="flex items-center gap-2 bg-zinc-100 px-3 py-2 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-50 transition-all border border-zinc-100"
            title="Sair do App"
          >
            <span className="text-[10px] font-black uppercase">Sair</span>
            <LogOut size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-5 pb-28">
          {renderContent()}
        </main>

        <nav className="absolute bottom-8 left-6 right-6 bg-white/90 backdrop-blur-md border border-zinc-100 px-8 py-3 flex justify-between items-center rounded-full shadow-2xl">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-yellow-500' : 'text-zinc-300'}`}>
            <LayoutGrid size={24} />
          </button>
          <button onClick={() => setActiveTab('form')} className={`flex flex-col items-center ${activeTab === 'form' ? 'text-yellow-500' : 'text-zinc-300'}`}>
            <ClipboardList size={24} />
          </button>
          <button className="text-zinc-300"><Settings size={24} /></button>
        </nav>
      </div>
    </div>
  );
}