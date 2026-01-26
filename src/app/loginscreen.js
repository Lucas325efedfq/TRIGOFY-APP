// src/components/LoginScreen.js
import React from 'react';
import Toast from './Toast'; // Importa nosso componente de notificação

export default function LoginScreen({ 
  usuario, 
  setUsuario, 
  senha, 
  setSenha, 
  onLogin, 
  erro, 
  toast, 
  onCloseToast 
}) {
  return (
    <div className="flex justify-center items-center bg-zinc-200 min-h-screen font-sans text-zinc-900">
      <div className="w-full h-full md:h-auto md:min-h-[600px] md:max-w-[600px] lg:max-w-[900px] bg-white shadow-2xl overflow-hidden flex flex-col relative md:rounded-[40px] lg:rounded-[30px] border-0 md:border-[10px] lg:border-[12px] border-zinc-900 p-8 justify-center">
        
        {/* Renderiza o Toast aqui dentro se houver mensagem */}
        {toast.show && (
          <Toast message={toast.message} type={toast.type} onClose={onCloseToast} />
        )}

        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black italic text-yellow-500 uppercase tracking-tighter">TRIGOFY</h1>
          </div>
          
          <form onSubmit={onLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Usuário" 
              className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none font-bold" 
              value={usuario} 
              onChange={(e) => setUsuario(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none font-bold" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
            />
            
            {erro && <p className="text-red-500 text-xs text-center font-bold">{erro}</p>}
            
            <button type="submit" className="w-full bg-zinc-900 text-yellow-400 py-4 rounded-2xl font-black uppercase shadow-lg active:scale-95 transition-all">
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}