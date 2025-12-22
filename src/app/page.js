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
  BookOpen,
  History,
  Factory 
} from 'lucide-react';

export default function TrigofyApp() {
  const [estaLogado, setEstaLogado] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [usuarioInput, setUsuarioInput] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // --- ÁREA DO ADMINISTRADOR (CADASTRO DE USUÁRIOS) ---
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
      <div className="flex justify-center bg-zinc-200 min-h-screen sm:py-6 font-sans text-zinc-900">
        <div className="w-full max-w-[390px] bg-white h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[55px] border-[10px] border-zinc-900 p-8 justify-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black italic text-yellow-500 tracking-tighter mb-2 text-center uppercase">TRIGOFY</h1>
            <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest text-center">Acesso Restrito</p>
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

            {/* BOTÃO ALTERADO PARA APENAS "ENTRAR" */}
            <button type="submit" className="w-full bg-zinc-900 text-yellow-400 py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all uppercase tracking-widest">
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  // CONTEÚDO DA TELA INICIAL
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-4 animate-in fade-in duration-500 pb-10 text-zinc-900">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-3xl text-zinc-900 shadow-lg flex items-center gap-4 border border-yellow-300">
              <div className="bg-white p-2 rounded-2xl shadow-inner w-16 h-16 flex items-center justify-center overflow-hidden">
                <img src="/favicon.ico" alt="Logo" className="w-full h-full object-contain scale-125" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Grupo Trigo</h2>
                <p className="text-yellow-900/80 text-sm font-medium italic">Olá, {usuarioInput}!</p>
              </div>
            </div>

            <h3 className="text-zinc-800 font-extrabold text-lg px-2 mt-6 uppercase italic tracking-tighter">Ações Rápidas</h3>
            
            <div className="space-y-3">
              <div onClick={() => setActiveTab('pedidos')} className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-all group">
                <div className="bg-yellow-400 p-3 rounded-full text-zinc-900 shadow-sm"><ShoppingBag size={20} /></div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-800 uppercase text-sm">Meus Pedidos</p>
                  <p className="text-[10px] text-zinc-400 font-bold">HISTÓRICO E STATUS</p>
                </div>
                <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
              </div>

              <div onClick={() => setActiveTab('catalogo')} className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-all group">
                <div className="bg-yellow-400 p-2 rounded-full text-zinc-900 shadow-sm flex items-center justify-center w-11 h-11 overflow-hidden">
                  <img src="/doacao.png" alt="Doações" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-800 uppercase text-sm">Solicitações de doações</p>
                  <p className="text-[10px] text-zinc-400 font-bold">GESTÃO DE DOAÇÕES</p>
                </div>
                <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
              </div>

              <div onClick={() => setActiveTab('rio-sp')} className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-all group">
                <div className="bg-yellow-400 p-2 rounded-full text-zinc-900 shadow-sm flex items-center justify-center w-11 h-11 overflow-hidden">
                  <img src="/cesta.png" alt="Compras RIO/SP" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-800 uppercase text-sm leading-tight">solicitações de compras produtos fabrica RIO/SP</p>
                  <p className="text-[10px] text-zinc-400 font-bold">COMPRAS REGIONAIS</p>
                </div>
                <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
              </div>

              <div onClick={() => setActiveTab('novo')} className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-all group">
                <div className="bg-yellow-400 p-2 rounded-full text-zinc-900 shadow-sm flex items-center justify-center w-11 h-11 overflow-hidden">
                  <img src="/pizza.png" alt="Novo Pedido" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-800 uppercase text-sm">Novo Pedido</p>
                  <p className="text-[10px] text-zinc-400 font-bold">SOLICITAR COMPRA</p>
                </div>
                <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-all group">
                <div className="bg-yellow-400 p-3 rounded-full text-zinc-900 shadow-sm"><Megaphone size={20} /></div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-800 uppercase text-sm">Suporte</p>
                  <p className="text-[10px] text-zinc-400 font-bold">FALAR COM A FÁBRICA</p>
                </div>
                <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
              </div>
            </div>
          </div>
        );

      case 'pedidos':
        return (
          <div className="space-y-4 animate-in slide-in-from-right duration-300 text-zinc-900">
             <button onClick={() => setActiveTab('home')} className="text-zinc-400 font-bold text-xs uppercase mb-2 flex items-center gap-1">← Voltar</button>
            <h2 className="text-xl font-black text-zinc-800 uppercase italic tracking-tighter">Meus Pedidos</h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 text-center flex flex-col items-center">
              <History className="text-zinc-200 mb-4" size={48} />
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Nenhum pedido encontrado</p>
            </div>
          </div>
        );

      case 'catalogo':
        return (
          <div className="space-y-4 animate-in slide-in-from-right duration-300 text-zinc-900">
            <button onClick={() => setActiveTab('home')} className="text-zinc-400 font-bold text-xs uppercase mb-2 flex items-center gap-1">← Voltar</button>
            <h2 className="text-xl font-black text-zinc-800 uppercase italic tracking-tighter">Doações</h2>
            <p className="px-2 text-zinc-500 font-medium">Gestão de solicitações de doações.</p>
          </div>
        );

      case 'rio-sp':
        return (
          <div className="space-y-4 animate-in slide-in-from-right duration-300 text-zinc-900">
            <button onClick={() => setActiveTab('home')} className="text-zinc-400 font-bold text-xs uppercase mb-2 flex items-center gap-1">← Voltar</button>
            <h2 className="text-xl font-black text-zinc-800 uppercase italic tracking-tighter">RIO / SP</h2>
            <div className="bg-white p-6 rounded-3xl border border-zinc-100 text-zinc-800">
                <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mb-4">Solicitações Fábrica RIO e SP</p>
                <p className="text-sm text-zinc-400 italic">Área destinada a compras regionais da fábrica.</p>
            </div>
          </div>
        );

      case 'novo':
        return (
          <div className="animate-in slide-in-from-right duration-300 text-zinc-900">
            <button onClick={() => setActiveTab('home')} className="text-zinc-400 font-bold text-xs uppercase mb-2 flex items-center gap-1">← Voltar</button>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
              <h2 className="text-lg font-bold mb-4 text-zinc-800 uppercase italic tracking-tighter">Formulário de Compra</h2>
              <div className="space-y-4 text-zinc-800">
                <input type="text" placeholder="Nome Completo" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400" />
                <textarea placeholder="Descrição do que você precisa..." rows="4" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400"></textarea>
                <button className="w-full bg-zinc-900 text-yellow-400 py-4 rounded-2xl font-black flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                  <Send size={18} /> ENVIAR PEDIDO
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center bg-zinc-200 min-h-screen sm:py-6 font-sans">
      <div className="w-full max-w-[390px] bg-zinc-50 h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[55px] border-[10px] border-zinc-900 text-zinc-900">
        <div className="h-7 w-full bg-white flex justify-center items-start">
          <div className="w-32 h-5 bg-zinc-900 rounded-b-2xl"></div>
        </div>
        <header className="p-6 flex justify-between items-center bg-white border-b border-zinc-50">
          <h1 className="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter">TRIGOFY</h1>
          <button onClick={fazerLogoff} className="flex items-center gap-2 bg-zinc-100 px-3 py-2 rounded-xl text-zinc-500 border border-zinc-100 active:bg-red-50 active:text-red-500 transition-all">
            <span className="text-[10px] font-black uppercase tracking-tighter">Sair</span>
            <LogOut size={16} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-5 pb-32">
          {renderContent()}
        </main>
        <nav className="absolute bottom-8 left-4 right-4 bg-white/95 backdrop-blur-md border border-zinc-100 px-4 py-3 flex justify-between items-center rounded-full shadow-2xl">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'home' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}`}>
            <LayoutGrid size={22} />
            <span className="text-[8px] font-black uppercase tracking-tighter text-center">Início</span>
          </button>
          <button onClick={() => setActiveTab('pedidos')} className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'pedidos' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}`}>
            <ShoppingBag size={22} />
            <span className="text-[8px] font-black uppercase tracking-tighter text-center">Pedidos</span>
          </button>
          <button onClick={() => setActiveTab('catalogo')} className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'catalogo' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}`}>
            <BookOpen size={22} />
            <span className="text-[8px] font-black uppercase tracking-tighter text-center">Doações</span>
          </button>
          <button onClick={() => setActiveTab('novo')} className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'novo' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}`}>
            <ClipboardList size={22} />
            <span className="text-[8px] font-black uppercase tracking-tighter text-center">Novo</span>
          </button>
        </nav>
        <div className="absolute bottom-2 w-full flex justify-center">
          <div className="w-28 h-1 bg-zinc-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}