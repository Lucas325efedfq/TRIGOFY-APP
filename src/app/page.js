"use client";
import React, { useState } from 'react';
import { LayoutGrid, ClipboardList, Settings, User, Send } from 'lucide-react';

export default function TrigofyClone() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
              <h2 className="text-xl font-bold">Olá, Bem-vindo!</h2>
              <p className="text-blue-100 text-sm">O que vamos fazer hoje no Trigofy?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => setActiveTab('form')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition">
                <div className="bg-blue-100 p-3 rounded-full mb-2 text-blue-600"><ClipboardList size={24} /></div>
                <span className="text-sm font-medium">Novo Registro</span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center opacity-60">
                <div className="bg-purple-100 p-3 rounded-full mb-2 text-purple-600"><LayoutGrid size={24} /></div>
                <span className="text-sm font-medium">Relatórios</span>
              </div>
            </div>
          </div>
        );
      case 'form':
        return (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-right duration-300">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Formulário Trigofy</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Nome Completo</label>
                <input type="text" className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" placeholder="Ex: João Silva" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">E-mail</label>
                <input type="email" className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" placeholder="email@exemplo.com" />
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2" onClick={() => alert('Dados Enviados!')}>
                <Send size={18} /> Enviar
              </button>
            </div>
          </div>
        );
      default:
        return <div className="text-center text-gray-400 mt-20">Em breve...</div>;
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen sm:py-10">
      <div className="w-full max-w-[390px] bg-gray-50 h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[40px] border-[8px] border-gray-900">
        <header className="p-6 flex justify-between items-center bg-white border-b">
          <h1 className="text-2xl font-black italic text-blue-700 tracking-tighter">TRIGOFY</h1>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600"><User size={20} /></div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 pb-24">{renderContent()}</main>
        <nav className="absolute bottom-0 w-full bg-white border-t px-6 py-4 flex justify-between items-center">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
            <LayoutGrid size={24} /><span className="text-[10px] mt-1 font-bold">Início</span>
          </button>
          <button onClick={() => setActiveTab('form')} className={`flex flex-col items-center ${activeTab === 'form' ? 'text-blue-600' : 'text-gray-400'}`}>
            <ClipboardList size={24} /><span className="text-[10px] mt-1 font-bold">App</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center ${activeTab === 'settings' ? 'text-blue-600' : 'text-gray-400'}`}>
            <Settings size={24} /><span className="text-[10px] mt-1 font-bold">Ajustes</span>
          </button>
        </nav>
      </div>
    </div>
  );
}