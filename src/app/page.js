"use client";
import React, { useState } from 'react';
import { 
  LayoutGrid, 
  ClipboardList, 
  Settings, 
  User, 
  Send, 
  ChevronRight, 
  ShoppingBag, 
  Package, 
  Megaphone, 
  Lock, 
  UserCircle, 
  LogOut,
  BookOpen
} from 'lucide-react';

export default function TrigofyApp() {
  const [estaLogado, setEstaLogado] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [usuarioInput, setUsuarioInput] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // --- ÁREA DO ADMINISTRADOR ---
  const usuariosAutorizados = [
    { usuario: 'lucas.vieira', senha: '123' },
    { usuario: 'admin', senha: 'admin' }
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

  const fazerLogoff = () => {
    setEstaLogado(false);
    setUsuarioInput('');
    setSenha('');
    setActiveTab('home');
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

  // RENDERIZAÇÃO DAS ABAS
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
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
            <h3 className="text-zinc-800 font-extrabold text-lg px-2 mt-6">Destaques</h3>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-full text-yellow-600"><Megaphone size={20} /></div>
              <div className="flex-1">
                <p className="font-bold text-zinc-800">Novos Produtos</p>
                <p className="text-xs text-zinc-400">Confira as novidades da fábrica.</p>
              </div>
            </div>
          </div>
        );

      case 'pedidos':
        return (
          <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-lg font-bold text-zinc-800 px-2">Meus Pedidos</h2>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 text-center py-10">
              <ShoppingBag className="mx-auto text-zinc-200 mb-4" size={48} />
              <p className="text-zinc-400 font-medium">Você ainda não realizou pedidos.</p>
              <button onClick={() => setActiveTab('form')} className="mt-4 text-yellow-500 font-bold text-sm">Fazer novo pedido</button>
            </div>
          </div>
        );

      case 'catalogo':
        return (
          <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-lg font-bold text-zinc-800 px-2">Catálogo de Produtos</h2>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
                  <div className="bg-zinc-100 h-24 rounded-xl mb-2 flex items-center justify-center text-zinc-300 font-bold">FOTO</div>
                  <p className="font-bold text-sm text-zinc-800">Produto {i}</p>
                  <p className="text-xs text-yellow-600 font-black">R$ 00,00</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-lg font-bold mb-4 text-zinc-800">Novo Pedido</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Nome Completo" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 text-zinc-800" />
              <textarea placeholder="Descrição do Pedido" rows="4" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 text-zinc-800"></textarea>
              <button className="w-full bg-zinc-900 text-yellow-400 py-4 rounded-2xl font-black flex items-center justify-center gap-2">
                <Send size={18} /> ENVIAR PEDIDO
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center bg-zinc-200 min-h-screen sm:py-6 font-sans">
      <div className="w-full max-w-[390px] bg-zinc-50 h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[55px] border-[10px] border-zinc-900">
        
        <div className="h-7 w-full bg-white flex justify-center items-start">
          <div className="w-32 h-5 bg-zinc-900 rounded-b-2xl"></div>
        </div>

        <header className="p-6 flex justify-between items-center bg-white border-b border-zinc-50">
          <h1 className="text-2xl font-black italic text-yellow-500 uppercase">TRIGOFY</h1>
          <button onClick={fazerLogoff} className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-xl text-zinc-400 border border-zinc-100">
            <span className="text-[10px] font-black uppercase">Sair</span>
            <LogOut size={16} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-5 pb-28">
          {renderContent()}
        </main>

        {/* NAVEGAÇÃO INFERIOR COM AS NOVAS ABAS */}
        <nav className="absolute bottom-8 left-4 right-4 bg-white/90 backdrop-blur-md border border-zinc-100 px-6 py-3 flex justify-between items-center rounded-full shadow-2xl">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-yellow-500' : 'text-zinc-300'}`}>
            <LayoutGrid size={22} />
            <span className="text-[9px] font-bold uppercase">Início</span>
          </button>
          
          <button onClick={() => setActiveTab('pedidos')} className={`flex flex-col items-center gap-1 ${activeTab === 'pedidos' ? 'text-yellow-500' : 'text-zinc-300'}`}>
            <ShoppingBag size={22} />
            <span className="text-[9px] font-bold uppercase">Pedidos</span>
          </button>

          <button onClick={() => setActiveTab('catalogo')} className={`flex flex-col items-center gap-1 ${activeTab === 'catalogo' ? 'text-yellow-500' : 'text-zinc-300'}`}>
            <BookOpen size={22} />
            <span className="text-[9px] font-bold uppercase">Catálogo</span>
          </button>

          <button onClick={() => setActiveTab('form')} className={`flex flex-col items-center gap-1 ${activeTab === 'form' ? 'text-yellow-500' : 'text-zinc-300'}`}>
            <ClipboardList size={22} />
            <span className="text-[9px] font-bold uppercase">Novo</span>
          </button>
        </nav>
      </div>
    </div>
  );
}