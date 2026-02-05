import React, { useState, useEffect } from 'react';
import { ArrowLeft, ClipboardEdit, Save } from 'lucide-react';
import { criarSolicitacaoFichaTecnica } from '../../servicos/fichaTecnicaService';

const FichaTecnicaPage = ({ 
  setActiveTab, 
  temaEscuro, 
  showToast, 
  usuarioInput, 
  usuarioLogadoCpf, 
  isAdmin, 
  pessoasCadastradas 
}) => {
  const [carregando, setCarregando] = useState(false);
  
  // Campos do formulário
  const [cpf, setCpf] = useState(usuarioLogadoCpf || '');
  const [nome, setNome] = useState('');
  const [area, setArea] = useState('');
  const [tipoSolicitacao, setTipoSolicitacao] = useState('');
  const [produto, setProduto] = useState('');
  const [motivo, setMotivo] = useState('');

  // Lógica de busca automática por CPF (Idêntica ao Compras VR)
  useEffect(() => {
    if (!isAdmin && usuarioLogadoCpf && cpf !== usuarioLogadoCpf) {
      setCpf(usuarioLogadoCpf);
      return;
    }

    if (cpf.length === 11) {
      const pessoa = pessoasCadastradas.find(p => p.cpf === cpf);
      if (pessoa) {
        setNome(pessoa.nome);
        setArea(pessoa.area || '');
      } else {
        setNome('');
        setArea('');
        if (cpf.length === 11) showToast("CPF não encontrado.", "error");
      }
    } else {
      setNome('');
      setArea('');
    }
  }, [cpf, pessoasCadastradas, isAdmin, usuarioLogadoCpf, showToast]);

  const handleSubmit = async () => {
    // Validação de campos obrigatórios
    if (!cpf || !nome || !area || !tipoSolicitacao || !produto || !motivo) {
      return showToast("Todos os campos são obrigatórios!", "error");
    }

    setCarregando(true);
    try {
      await criarSolicitacaoFichaTecnica({
        solicitante: usuarioInput,
        cpf,
        nome,
        area,
        tipo_solicitacao: tipoSolicitacao,
        produto,
        motivo
      });

      showToast("Solicitação de Alteração enviada com sucesso!", "success");
      
      // Limpar campos e voltar
      setTipoSolicitacao('');
      setProduto('');
      setMotivo('');
      setActiveTab('home');
    } catch (error) {
      showToast("Erro ao enviar solicitação.", "error");
    } finally {
      setCarregando(false);
    }
  };

  const bgCard = temaEscuro ? 'bg-zinc-900/50' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-500';
  const borderColor = temaEscuro ? 'border-zinc-800/50' : 'border-zinc-200/50';
  const inputStyle = `w-full p-4 rounded-2xl outline-none border transition-all ${
    temaEscuro 
      ? 'bg-zinc-800/50 border-zinc-700 text-white focus:border-yellow-500/50' 
      : 'bg-zinc-50 border-zinc-200 focus:border-yellow-500/50 font-bold'
  }`;
  const labelStyle = "text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 mb-1 block";

  return (
    <div className="animate-in slide-in-from-right duration-700 pb-32 space-y-8">
      <button 
        onClick={() => setActiveTab('home')} 
        className={`flex items-center gap-2 ${textSub} font-black text-[10px] uppercase tracking-widest hover:text-yellow-500 transition-colors`}
      >
        <ArrowLeft size={14} /> Voltar ao Menu
      </button>

      <div className={`${bgCard} p-8 rounded-[2.5rem] border ${borderColor} shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full" />
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-yellow-500/20">
            <ClipboardEdit size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className={`text-xl font-black uppercase italic tracking-tighter ${textMain}`}>
              Alteração de <span className="text-yellow-500">Ficha Técnica</span>
            </h2>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">P&D - Pesquisa e Desenvolvimento</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Identificação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>CPF (Apenas números) *</label>
              <input 
                type="text" 
                placeholder="00000000000" 
                maxLength={11} 
                className={inputStyle} 
                value={cpf} 
                onChange={(e) => setCpf(e.target.value)} 
                required
              />
            </div>
            <div>
              <label className={labelStyle}>Nome Identificado *</label>
              <input 
                type="text" 
                readOnly 
                placeholder="Aguardando CPF..." 
                className={`w-full p-4 border rounded-2xl font-bold ${
                  temaEscuro ? 'bg-zinc-900/50 text-zinc-400 border-zinc-800' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                }`} 
                value={nome} 
              />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Sua Área / Setor *</label>
            <input 
              type="text" 
              placeholder="Ex: P&D, Qualidade..." 
              className={inputStyle} 
              value={area} 
              onChange={(e) => setArea(e.target.value)} 
              required
            />
          </div>

          {/* Dados da Solicitação */}
          <div className="pt-6 border-t border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="space-y-6">
              <div>
                <label className={labelStyle}>Tipo de Solicitação *</label>
                <select 
                  className={inputStyle} 
                  value={tipoSolicitacao} 
                  onChange={(e) => setTipoSolicitacao(e.target.value)}
                  required
                >
                  <option value="">Selecione uma opção...</option>
                  <option value="Revisão / Alteração de Processo">Revisão / Alteração de Processo</option>
                  <option value="Rendimento">Rendimento</option>
                  <option value="Perda de FT">Perda de FT</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className={labelStyle}>Nome do Produto *</label>
                <input 
                  type="text" 
                  placeholder="Informe o nome do produto" 
                  className={inputStyle} 
                  value={produto} 
                  onChange={(e) => setProduto(e.target.value)} 
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Motivo da Solicitação *</label>
                <textarea 
                  placeholder="Descreva detalhadamente o motivo da solicitação..." 
                  rows={4} 
                  className={inputStyle} 
                  value={motivo} 
                  onChange={(e) => setMotivo(e.target.value)} 
                  required
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={carregando}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
              carregando 
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-[1.02]'
            }`}
          >
            {carregando ? "PROCESSANDO..." : <><Save size={18} /> ENVIAR SOLICITAÇÃO</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FichaTecnicaPage;
