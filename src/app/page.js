"use client";
import React, { useState } from 'react';
import { LayoutGrid, ClipboardList, Settings, User, Send, ChevronRight, ShoppingBag, Package, Megaphone } from 'lucide-react';

export default function TrigofyApp() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-4 animate-in fade-in duration-500">
            {/* Banner Amarelo - Grupo Trigo */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-3xl text-zinc-900 shadow-lg flex items-center gap-4 border border-yellow-300">
              <div className="bg-white p-3 rounded-2xl shadow-inner">
                <Package className="text-yellow-600" size={32} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Grupo Trigo</h2>
                <p className="text-yellow-900/80 text-sm font-medium">O que vamos fazer hoje no Trigofy?</p>
              </div>
            </div>

            <h3 className="text-zinc-800 font-extrabold text-lg px-2 mt-6 tracking-tight">Formulário de Compra (Fábrica)</h3>

            {/* Lista de Opções Estilo Card - Baseado na sua imagem */}
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-colors group">
                <div className="bg-yellow-400 p-3 rounded-full text-zinc-900 shadow-sm">
                  <Megaphone size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-800">Produtos Disponíveis para Compra</p>
                  <p className="text-xs text-zinc-400 font-medium">E-mail para contato</p>
                </div>
                <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
              </div>

              <div onClick={() => setActiveTab('form')} className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-colors group">
                <div className="bg-yellow-400 p-3 rounded-full text-zinc-900 shadow-sm font-black flex items-center justify-center w-11 h-11">
                  24
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-800">Produto Desejado</p>
                  <p className="text-xs text-zinc-400 font-medium">Veja os produtos que você quer! Solicite aqui.</p>
                </div>
                <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-colors group">
                <div className="bg-yellow-400 p-3 rounded-full text-zinc-900 shadow-sm">
                  <ShoppingBag size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-800">Status do Pedido</p>
                  <p className="text-xs text-zinc-400 font-medium">Acompanhe suas compras em tempo real</p>
                </div>
                <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
              </div>
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 animate-in slide-in-from-bottom duration-300">
            <h2 className="text-lg font-bold mb-4 text-zinc-800">Novo Pedido de Compra</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Nome Completo</label>
                <input type="text" placeholder="Ex: João Silva" className="w-full mt-1 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase ml-1">E-mail de Contato</label>
                <input type="email" placeholder="contato@exemplo.com" className="w-full mt-1 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Mensagem ou Lista de Produtos</label>
                <textarea placeholder="Descreva o que você precisa..." rows="4" className="w-full mt-1 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 transition-all"></textarea>
              </div>
              <button className="w-full bg-zinc-900 text-yellow-400 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-zinc-800 shadow-lg active:scale-95 transition-all">
                <Send size={18} /> ENVIAR PEDIDO
              </button>
              <button onClick={() => setActiveTab('home')} className="w-full text-zinc-400 font-bold text-sm uppercase tracking-widest pt-2">Cancelar e Voltar</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center bg-zinc-200 min-h-screen sm:py-6 font-sans">
      {/* Moldura do Celular */}
      <div className="w-full max-w-[390px] bg-zinc-50 h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[55px] border-[10px] border-zinc-900">

        {/* Notch Superior */}
        <div className="h-7 w-full bg-white flex justify-center items-start">
          <div className="w-32 h-5 bg-zinc-900 rounded-b-2xl"></div>
        </div>

        {/* Cabeçalho do App */}
        <header className="p-6 flex justify-between items-center bg-white border-b border-zinc-50">
          <div>
            <h1 className="text-2xl font-black italic text-blue-700 tracking-tighter leading-none">TRIGOFY</h1>
            <span className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] uppercase">Brasil</span>
          </div>
          <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center text-blue-600 border border-zinc-100 shadow-sm cursor-pointer">
            <User size={20} />
          </div>
        </header>

        {/* Área de Conteúdo */}
        <main className="flex-1 overflow-y-auto p-5 pb-28">
          {renderContent()}
        </main>

        {/* Barra de Navegação Flutuante */}
        <nav className="absolute bottom-8 left-6 right-6 bg-white/90 backdrop-blur-md border border-zinc-100 px-8 py-3 flex justify-between items-center rounded-full shadow-2xl">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center transition-all ${activeTab === 'home' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}`}>
            <LayoutGrid size={24} />
            <span className="text-[8px] font-bold uppercase mt-1">Início</span>
          </button>
          <button onClick={() => setActiveTab('form')} className={`flex flex-col items-center transition-all ${activeTab === 'form' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}`}>
            <ClipboardList size={24} />
            <span className="text-[8px] font-bold uppercase mt-1">Pedido</span>
          </button>
          <button className="flex flex-col items-center text-zinc-300">
            <Settings size={24} />
            <span className="text-[8px] font-bold uppercase mt-1">Ajustes</span>
          </button>
        </nav>

        {/* Indicador de Home do Celular */}
        <div className="absolute bottom-2 w-full flex justify-center">
          <div className="w-28 h-1 bg-zinc-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}