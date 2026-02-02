import React, { useState } from 'react';
import { Settings, Moon, Sun, Lock, Shield, User, ArrowLeft, Save } from 'lucide-react';

const ConfiguracoesPage = ({ 
  usuarioLogado, 
  temaEscuro, 
  toggleTheme, 
  showToast, 
  setActiveTab 
}) => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Fallback seguro para evitar erros de undefined
  const user = usuarioLogado || {};
  
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-500';
  const bgCard = temaEscuro ? 'bg-zinc-900/50' : 'bg-white';
  const bgInput = temaEscuro ? 'bg-zinc-800/50' : 'bg-zinc-50';
  const borderColor = temaEscuro ? 'border-zinc-800/50' : 'border-zinc-200/50';

  const handleAlterarSenha = async () => {
    if (!novaSenha || !confirmarSenha) {
      if (showToast) showToast("Preencha todos os campos de senha.", "error");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      if (showToast) showToast("As senhas não coincidem.", "error");
      return;
    }

    if (novaSenha.length < 4) {
      if (showToast) showToast("A senha deve ter pelo menos 4 caracteres.", "error");
      return;
    }

    setCarregando(true);
    try {
      // Import dinâmico para evitar problemas de carregamento circular ou inicial
      const { updateRecord, TABLES } = await import('../../servicos/airtableService');
      
      if (!user.id) {
        if (showToast) showToast("Erro: ID do usuário não identificado. Tente relogar.", "error");
        setCarregando(false);
        return;
      }

      await updateRecord(TABLES.USUARIOS, user.id, {
        senha: novaSenha
      });

      if (showToast) showToast("✅ Senha alterada com sucesso!", "success");
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      console.error(error);
      if (showToast) showToast("Erro ao conectar ao servidor.", "error");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-700 pb-32 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveTab && setActiveTab('home')} 
          className={`flex items-center gap-2 ${textSub} font-black text-[10px] uppercase tracking-widest hover:text-yellow-500 transition-colors`}
        >
          <ArrowLeft size={14} /> Voltar
        </button>
        <h2 className={`text-xl font-black uppercase italic tracking-tighter ${textMain}`}>
          Configurações <span className="text-yellow-500">App</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className={`${bgCard} p-8 rounded-[2.5rem] border ${borderColor} shadow-xl relative overflow-hidden`}>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-yellow-500/5 blur-3xl rounded-full" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
                <User size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className={`text-lg font-black uppercase italic tracking-tight ${textMain}`}>{user.usuario || 'Usuário'}</h3>
                <p className={`text-[10px] font-black uppercase tracking-widest ${textSub}`}>
                  {user.funcao || 'Perfil'} • {user.origem || 'Unidade'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub} mb-2`}>Aparência</h4>
              <button 
                onClick={() => toggleTheme && toggleTheme()}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border ${borderColor} ${bgInput} hover:border-yellow-500/30 transition-all group`}
              >
                <div className="flex items-center gap-3">
                  {temaEscuro ? <Moon className="text-yellow-500" size={20} /> : <Sun className="text-yellow-500" size={20} />}
                  <span className={`font-bold text-sm ${textMain}`}>Modo Escuro</span>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${temaEscuro ? 'bg-yellow-500' : 'bg-zinc-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${temaEscuro ? 'right-1' : 'left-1'}`} />
                </div>
              </button>
            </div>
          </div>

          <div className={`${bgCard} p-8 rounded-[2.5rem] border ${borderColor} shadow-xl`}>
            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub} mb-4`}>Sobre o Dispositivo</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold ${textSub}`}>Versão do App</span>
                <span className={`text-xs font-black ${textMain}`}>2.0.1-PRO</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold ${textSub}`}>Status da Conexão</span>
                <span className="text-xs font-black text-green-500 flex items-center gap-1">
                  <Shield size={12} /> Protegido
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${bgCard} p-8 rounded-[2.5rem] border ${borderColor} shadow-xl space-y-6`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
              <Lock size={20} strokeWidth={2.5} />
            </div>
            <h3 className={`text-lg font-black uppercase italic tracking-tight ${textMain}`}>Segurança</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${textSub}`}>Nova Senha</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className={`w-full p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none focus:border-rose-500/50 transition-all ${textMain} font-bold`} 
                value={novaSenha} 
                onChange={(e) => setNovaSenha(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${textSub}`}>Confirmar Nova Senha</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className={`w-full p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none focus:border-rose-500/50 transition-all ${textMain} font-bold`} 
                value={confirmarSenha} 
                onChange={(e) => setConfirmarSenha(e.target.value)} 
              />
            </div>
            <button 
              onClick={handleAlterarSenha}
              disabled={carregando}
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {carregando ? "Processando..." : <><Save size={16} /> Salvar Nova Senha</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
