"use client";
import React, { useState } from 'react';
import { LayoutGrid, ClipboardList, Settings, User, Send, Smartphone } from 'lucide-react';

export default function TrigofyClone() {
  const [activeTab, setActiveTab] = useState('home');
  const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' });

  // Função para enviar os dados via WhatsApp
  const enviarWhatsApp = () => {
    const texto = `Olá! Novo registro via Trigofy:\n\n*Nome:* ${formData.nome}\n*E-mail:* ${formData.email}\n*Mensagem:* ${formData.mensagem}`;
    const url = `https://wa.me/5500000000000?text=${encodeURIComponent(texto)}`; // Troque os zeros pelo seu número
    window.open(url, '_blank');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
              <h2 className="text-xl font-bold font-sans">Olá, Bem-vindo!</h2>
              <p className="text-blue-100 text-sm">O que vamos fazer hoje no Trigofy?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => setActiveTab('form')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition active:scale-95">
                <div className="bg-blue-100 p-3 rounded-full mb-2 text-blue-600"><ClipboardList size={24} /></div>
                <span className="text-sm font-bold text-gray-700">Novo Registro</span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center opacity-60">
                <div className="bg-purple-100 p-3 rounded-full mb-2 text-purple-600"><LayoutGrid size={24} /></div>
                <span className="text-sm font-bold text-gray-700">Relatórios</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-dashed border-gray-300 flex items-center gap-3 text-gray-500">
              <Smartphone size={20} />
              <span className="text-xs italic">Versão 1.0 - Desenvolvido no VS Code</span>
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-right duration-300">
            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Formulário de Entrada</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seu Nome</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Ex: João Silva"
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail para Contato</label>
                <input
                  type="email"
                  className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="exemplo@email.com"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Observações</label>
                <textarea
                  className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Digite aqui..."
                  rows="3"
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                />
              </div>
              <button
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition active:scale-95 shadow-md"
                onClick={enviarWhatsApp}
              >
                <Send size={18} /> ENVIAR DADOS
              </button>
              <button
                onClick={() => setActiveTab('home')}
                className="w-full text-gray-400 text-sm py-2 hover:text-gray-600"
              >
                Cancelar e Voltar
              </button>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="p-4 text-center">
            <h2 className="font-bold text-gray-700">Configurações</h2>
            <p className="text-sm text-gray-400 mt-2">Personalize sua conta aqui.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center bg-zinc-900 min-h-screen sm:py-6">
      {/* Moldura do Celular */}
      <div className="w-full max-w-[390px] bg-gray-50 h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[50px] border-[12px] border-zinc-800">

        {/* Notch do iPhone */}
        <div className="h-8 w-full bg-white flex justify-center items-start">
          <div className="w-32 h-6 bg-zinc-800 rounded-b-3xl"></div>
        </div>

        {/* Cabeçalho */}
        <header className="p-6 pt-2 flex justify-between items-center bg-white">
          <div>
            <h1 className="text-2xl font-black italic text-blue-700 tracking-tighter leading-none">TRIGOFY</h1>
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Brasil</span>
          </div>
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
            <User size={20} />
          </div>
        </header>

        {/* Conteúdo Central */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 bg-gray-50/50">
          {renderContent()}
        </main>

        {/* Barra de Navegação Inferior */}
        <nav className="absolute bottom-6 left-4 right-4 bg-white/80 backdrop-blur-md border border-gray-200 px-6 py-3 flex justify-between items-center rounded-3xl shadow-xl">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center transition-all ${activeTab === 'home' ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
            <LayoutGrid size={22} />
            <span className="text-[10px] mt-1 font-bold">Início</span>
          </button>
          <button onClick={() => setActiveTab('form')} className={`flex flex-col items-center transition-all ${activeTab === 'form' ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
            <ClipboardList size={22} />
            <span className="text-[10px] mt-1 font-bold">App</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center transition-all ${activeTab === 'settings' ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
            <Settings size={22} />
            <span className="text-[10px] mt-1 font-bold">Ajustes</span>
          </button>
        </nav>

        {/* Linha Home do iPhone */}
        <div className="absolute bottom-1 w-full flex justify-center pb-1">
          <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}