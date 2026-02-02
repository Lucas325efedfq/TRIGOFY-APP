import React, { useState } from 'react';
// Importando apenas o necessário de lucide-react
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

  // Estilos baseados no tema
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-500';
  const bgCard = temaEscuro ? 'bg-zinc-900/50' : 'bg-white';
  const bgInput = temaEscuro ? 'bg-zinc-800/50' : 'bg-zinc-50';
  const borderColor = temaEscuro ? 'border-zinc-800/50' : 'border-zinc-200/50';

  const handleAlterarSenha = async () => {
    if (!novaSenha || !confirmarSenha) {
      if (showToast) showToast("Preencha as senhas.", "error");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      if (showToast) showToast("As senhas não batem.", "error");
      return;
    }

    setCarregando(true);
    try {
      // Import dinâmico para evitar que o arquivo quebre se o serviço falhar no topo
      const airtable = await import('../../servicos/airtableService');
      
      if (!usuarioLogado || !usuarioLogado.id) {
        if (showToast) showToast("ID do usuário não encontrado.", "error");
        return;
      }

      await airtable.updateRecord('USUARIOS', usuarioLogado.id, {
        senha: novaSenha
      });

      if (showToast) showToast("✅ Senha alterada!", "success");
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (e) {
      if (showToast) showToast("Erro ao salvar.", "error");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="pb-32 space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveTab && setActiveTab('home')} 
          className={`flex items-center gap-2 ${textSub} font-bold text-xs uppercase`}
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <h2 className={`text-lg font-black uppercase italic ${textMain}`}>
          Ajustes
        </h2>
      </div>

      <div className={`${bgCard} p-6 rounded-3xl border ${borderColor} shadow-xl`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
            <User size={24} />
          </div>
          <div>
            <h3 className={`font-black uppercase ${textMain}`}>{usuarioLogado?.usuario || 'Usuário'}</h3>
            <p className={`text-[10px] font-bold uppercase opacity-60 ${textSub}`}>
              {usuarioLogado?.funcao || 'Nível'} • {usuarioLogado?.origem || 'Unidade'}
            </p>
          </div>
        </div>

        <button 
          onClick={() => toggleTheme && toggleTheme()}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border ${borderColor} ${bgInput}`}
        >
          <div className="flex items-center gap-3">
            {temaEscuro ? <Moon className="text-yellow-500" size={20} /> : <Sun className="text-yellow-500" size={20} />}
            <span className={`font-bold text-sm ${textMain}`}>Modo Escuro</span>
          </div>
          <div className={`w-10 h-5 rounded-full relative ${temaEscuro ? 'bg-yellow-500' : 'bg-zinc-300'}`}>
            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${temaEscuro ? 'right-1' : 'left-1'}`} />
          </div>
        </button>
      </div>

      <div className={`${bgCard} p-6 rounded-3xl border ${borderColor} shadow-xl space-y-4`}>
        <div className="flex items-center gap-3 mb-2">
          <Lock className="text-rose-500" size={20} />
          <h3 className={`font-black uppercase italic ${textMain}`}>Segurança</h3>
        </div>

        <input 
          type="password" 
          placeholder="Nova Senha" 
          className={`w-full p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none ${textMain} font-bold`} 
          value={novaSenha} 
          onChange={(e) => setNovaSenha(e.target.value)} 
        />
        
        <input 
          type="password" 
          placeholder="Confirmar Senha" 
          className={`w-full p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none ${textMain} font-bold`} 
          value={confirmarSenha} 
          onChange={(e) => setConfirmarSenha(e.target.value)} 
        />

        <button 
          onClick={handleAlterarSenha}
          disabled={carregando}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-black uppercase text-xs disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {carregando ? "Salvando..." : <><Save size={16} /> Salvar Senha</>}
        </button>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
