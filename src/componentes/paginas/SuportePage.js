import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { perguntarAoTriger } from '../../servicos/iaService';

const SuportePage = ({ setActiveTab, temaEscuro }) => {
  const [mensagens, setMensagens] = useState([
    { id: 1, texto: "Olá! Eu sou o Triger, seu suporte inteligente. Como posso te ajudar hoje?", bot: true }
  ]);
  const [inputChat, setInputChat] = useState('');
  const [estaDigitando, setEstaDigitando] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens, estaDigitando]);

  const enviarMensagemChat = async (e) => {
    e.preventDefault();
    if (!inputChat.trim() || estaDigitando) return;

    const textoUsuario = inputChat;
    const novaMensagemUsuario = {
      id: Date.now(),
      texto: textoUsuario,
      bot: false
    };

    setMensagens(prev => [...prev, novaMensagemUsuario]);
    setInputChat('');
    setEstaDigitando(true);

    try {
      const resposta = await perguntarAoTriger(textoUsuario);
      
      const respostaBot = {
        id: Date.now() + 1,
        texto: resposta,
        bot: true
      };
      setMensagens(prev => [...prev, respostaBot]);
    } catch (error) {
      const erroMsg = {
        id: Date.now() + 1,
        texto: "Ops, tive um probleminha técnico. Pode tentar perguntar de novo?",
        bot: true
      };
      setMensagens(prev => [...prev, erroMsg]);
    } finally {
      setEstaDigitando(false);
    }
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
        
        <div 
          ref={scrollRef}
          className={`flex-1 overflow-y-auto p-4 space-y-4 ${bgChat} scroll-smooth`}
        >
          {mensagens.map(msg => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.bot ? 'justify-start' : 'justify-end'}`}>
              {msg.bot && (
                <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 border border-yellow-500/30">
                  <Bot size={12} className="text-yellow-400" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-bold shadow-sm ${
                msg.bot 
                  ? `${bgCard} ${textMain} border border-zinc-200 dark:border-zinc-700 rounded-bl-none` 
                  : 'bg-yellow-400 text-zinc-900 rounded-br-none'
              }`}>
                {msg.texto}
              </div>
              {!msg.bot && (
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
                  <User size={12} className="text-zinc-900" />
                </div>
              )}
            </div>
          ))}
          {estaDigitando && (
            <div className="flex items-center gap-2 text-zinc-400 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center border border-yellow-500/30">
                <Bot size={12} className="text-yellow-400" />
              </div>
              <span className="text-[10px] font-black uppercase italic">Triger está pensando...</span>
            </div>
          )}
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
