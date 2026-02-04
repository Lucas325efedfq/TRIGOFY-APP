import React, { useState, useEffect } from 'react';
import { criarSolicitacaoMateriais } from '../../servicos/materiaisService';

export default function MateriaisEscritorioPage({ usuarioInput, usuarioLogadoCpf, isAdmin, showToast, setActiveTab, pessoasCadastradas = [] }) {
  const [carregando, setCarregando] = useState(false);
  
  // Estados do Formulário
  const [cpf, setCpf] = useState(usuarioLogadoCpf || '');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [area, setArea] = useState('');
  const [motivo, setMotivo] = useState('');
  const [material, setMaterial] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [prioridade, setPrioridade] = useState('Preciso em 7 dias');
  const [especificacao, setEspecificacao] = useState('');

  // Busca automática do nome ao digitar CPF (Lógica idêntica ao Compras VR)
  useEffect(() => {
    if (!isAdmin && usuarioLogadoCpf && cpf !== usuarioLogadoCpf) {
      setCpf(usuarioLogadoCpf);
      return;
    }

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length === 11 && pessoasCadastradas.length > 0) {
      const pessoa = pessoasCadastradas.find(p => p.cpf === cpfLimpo);
      if (pessoa) {
        setNome(pessoa.nome);
        if (pessoa.area) setArea(pessoa.area);
      } else {
        setNome('');
      }
    }
  }, [cpf, pessoasCadastradas, isAdmin, usuarioLogadoCpf]);

  const handleSubmit = async () => {
    // Validação de campos obrigatórios (exceto especificação que é opcional conforme contexto, mas o usuário disse "coloque um campo para ela colocar se tem alguma especificação", vou colocar como obrigatório para seguir a regra de "todos os campos precisam ser colocados como obrigatório" da última instrução similar)
    if (!cpf || !nome || !telefone || !area || !motivo || !material || !quantidade || !prioridade || !especificacao) {
      showToast("Preencha todos os campos obrigatórios para prosseguir.", "error");
      return;
    }

    setCarregando(true);
    try {
      await criarSolicitacaoMateriais({
        solicitante: usuarioInput,
        cpf,
        nome,
        telefone,
        area,
        motivo,
        material,
        quantidade,
        prioridade,
        especificacao
      });

      showToast("✅ Solicitação de materiais enviada com sucesso!", "success");
      setActiveTab('home');
    } catch (error) {
      console.error(error);
      showToast("Erro ao enviar solicitação.", "error");
    } finally {
      setCarregando(false);
    }
  };

  const inputStyle = "w-full p-4 rounded-2xl outline-none border bg-zinc-50 border-zinc-200 font-bold text-zinc-900 focus:border-yellow-500 transition-all";
  const labelStyle = "text-[10px] font-black text-zinc-400 uppercase px-1";

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-20">
      <button onClick={() => setActiveTab('home')} className="text-zinc-500 font-bold text-xs uppercase mb-2 hover:text-zinc-800">← Voltar</button>
      
      <h2 className="text-xl font-black uppercase italic mb-4 text-zinc-900">Solicitação de Materiais</h2>
      
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-100">
              <p className="text-blue-600 text-xs font-bold uppercase text-center">Todos os campos são obrigatórios.</p>
          </div>

          {/* CPF e Identificação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className={labelStyle}>CPF (Apenas números) *</label>
                <input 
                  type="text" 
                  placeholder="Digite o CPF" 
                  maxLength={11} 
                  className={inputStyle} 
                  value={cpf} 
                  onChange={(e) => setCpf(e.target.value)}
                  readOnly={!isAdmin && !!usuarioLogadoCpf}
                />
            </div>
            <div>
                <label className={labelStyle}>Nome Identificado *</label>
                <input type="text" readOnly placeholder="Aguardando CPF..." className="w-full p-4 border rounded-2xl font-bold bg-zinc-100 text-zinc-500 border-zinc-200" value={nome} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className={labelStyle}>Seu Telefone / WhatsApp *</label>
                <input type="text" placeholder="(XX) 9XXXX-XXXX" className={inputStyle} value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            </div>
            <div>
                <label className={labelStyle}>Sua Área / Setor *</label>
                <input type="text" placeholder="Ex: Logística, RH..." className={inputStyle} value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
          </div>

          {/* Dados do Material */}
          <div className="pt-4 border-t border-dashed border-zinc-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Nome do Material *</label>
                <input type="text" placeholder="Ex: Caneta, Papel A4..." className={inputStyle} value={material} onChange={(e) => setMaterial(e.target.value)} />
              </div>
              <div>
                <label className={labelStyle}>Quantidade *</label>
                <input type="number" placeholder="0" className={inputStyle} value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
              </div>
            </div>
          </div>

          <div>
              <label className={labelStyle}>Prioridade da Solicitação *</label>
              <select className={inputStyle} value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                  <option value="Preciso em 7 dias">Preciso em 7 dias</option>
                  <option value="Sem urgência">Sem urgência</option>
                  <option value="Urgência">Urgência</option>
              </select>
          </div>

          <div>
              <label className={labelStyle}>Especificação do Produto *</label>
              <input type="text" placeholder="Ex: Cor azul, marca específica..." className={inputStyle} value={especificacao} onChange={(e) => setEspecificacao(e.target.value)} />
          </div>

          <div>
              <label className={labelStyle}>Motivo da Solicitação *</label>
              <textarea placeholder="Descreva o motivo..." rows={2} className={inputStyle} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </div>

          <button 
              disabled={carregando}
              onClick={handleSubmit}
              className={`w-full py-4 rounded-2xl font-black uppercase shadow-lg transition-all active:scale-95 ${carregando ? 'bg-zinc-200 text-zinc-400' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}
          >
              {carregando ? "ENVIANDO..." : "SOLICITAR MATERIAIS"}
          </button>
      </div>
    </div>
  );
}
