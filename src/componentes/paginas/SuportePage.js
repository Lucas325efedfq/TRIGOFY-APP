import React, { useState } from 'react';
import { Send } from 'lucide-react';

const SuportePage = ({ setActiveTab, temaEscuro }) => {
  const [mensagens, setMensagens] = useState([
    { id: 1, texto: "Olá! Eu sou o Triger, seu suporte inteligente. Como posso te ajudar hoje?", bot: true }
  ]);
  const [inputChat, setInputChat] = useState('');

  const enviarMensagemChat = (e) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const novaMensagemUsuario = {
      id: mensagens.length + 1,
      texto: inputChat,
      bot: false
    };

    setMensagens([...mensagens, novaMensagemUsuario]);
    setInputChat('');

    // Simulação de resposta do bot
    setTimeout(() => {
      const respostaBot = {
        id: mensagens.length + 2,
        texto: "Obrigado pela sua mensagem! Nossa equipe está analisando e responderá em breve.",
        bot: true
      };
      setMensagens(prev => [...prev, respostaBot]);
    }, 1000);
  };

  const bgCard = temaEscuro ? 'bg-zinc-800' : 'bg-white';
  const bgInput = temaEscuro ? 'bg-zinc-700' : 'bg-zinc-100';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-800';
  const bgChat = temaEscuro ? 'bg-zinc-900' : 'bg-zinc-50';

  return (
    <div className="animate-in slide-in-from-right duration-300 flex flex-col h-full max-h-[600px] pb-20">
      <button 
        onClick={() => setActiveTab('home')} 
        className="text-zinc-400 font-bold text-xs uppercase mb-2 hover:text-yellow-500 transition-colors"
      >
        ← Voltar
      </button>
      
      <div className={`${bgCard} rounded-3xl shadow-sm border flex flex-col h-full overflow-hidden`}>
        <div className="bg-zinc-900 p-4 flex items-center gap-3">
          <div className="bg-yellow-400 w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
            <img src="/triger.png" alt="Triger" className="w-full h-full object-cover" />
          </div>
          <span className="text-yellow-400 font-black uppercase text-xs italic">Agente Triger</span>
        </div>
        
        <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${bgChat}`}>
          {mensagens.map(msg => (
            <div key={msg.id} className={`flex ${msg.bot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-bold ${
                msg.bot 
                  ? `${bgCard} ${textMain} border` 
                  : 'bg-yellow-400 text-zinc-900 shadow-sm'
              }`}>
                {msg.texto}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={enviarMensagemChat} className={`p-4 border-t ${bgCard} flex gap-2`}>
          <input 
            type="text" 
            placeholder="Sua dúvida..." 
            className={`flex-1 ${bgInput} p-3 rounded-xl text-xs outline-none focus:ring-2 focus:ring-yellow-400 ${textMain}`}
            value={inputChat}
            onChange={(e) => setInputChat(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-zinc-900 text-yellow-400 p-3 rounded-xl hover:bg-zinc-800 transition-colors active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuportePage;
