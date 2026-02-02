import React, { useState, useEffect } from 'react';
import { enviarCancelamento } from '../../servicos/cancelamentosService';

export default function CancelamentosPage({ usuarioInput, usuarioLogadoCpf, isAdmin, showToast, setActiveTab, pessoasCadastradas = [] }) {
  const [carregando, setCarregando] = useState(false);
  
  // Estados do Formulário
  const [cpf, setCpf] = useState(usuarioLogadoCpf || '');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [area, setArea] = useState('');
  
  // Dados específicos do cancelamento
  const [produto, setProduto] = useState('');
  const [qtde, setQtde] = useState('');
  const [unidade, setUnidade] = useState('CX');
  const [motivo, setMotivo] = useState('');

  // Busca automática do nome ao digitar CPF
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
    // Validação de todos os campos obrigatórios conforme solicitado
    if (!cpf || !nome || !telefone || !area || !produto || !qtde || !motivo) {
      showToast("Preencha todos os campos do formulário para prosseguir.", "error");
      return;
    }

    if (!usuarioInput) {
      showToast("Erro crítico: Usuário não identificado. Faça login novamente.", "error");
      return;
    }

    setCarregando(true);
    try {
      await enviarCancelamento({
        solicitante: usuarioInput,
        cpf,
        nome,
        telefone,
        area,
        produto,
        quantidade: qtde,
        unidade,
        motivo
      });

      showToast("✅ Solicitação enviada com sucesso!", "success");
      
      // Limpa os campos após enviar (mantendo CPF se não for admin)
      setCpf(isAdmin ? '' : (usuarioLogadoCpf || ''));
      setNome('');
      setTelefone('');
      setArea('');
      setProduto('');
      setQtde('');
      setUnidade('CX');
      setMotivo('');
      
      setActiveTab('home');
    } catch (error) {
      console.error(error);
      if (error.message && error.message.includes('422')) {
        showToast("Erro de configuração no banco de dados.", "error");
      } else {
        showToast("Erro de conexão ao enviar.", "error");
      }
    } finally {
      setCarregando(false);
    }
  };

  const inputStyle = "w-full p-4 rounded-2xl outline-none border bg-zinc-50 border-zinc-200 font-bold text-zinc-900 focus:border-yellow-500 transition-all";

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-20">
      <button onClick={() => setActiveTab('home')} className="text-zinc-500 font-bold text-xs uppercase mb-2 hover:text-zinc-800">← Voltar</button>
      
      <h2 className="text-xl font-black uppercase italic mb-4 text-zinc-900">Cancelamento de Compra</h2>
      
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="bg-red-50 p-4 rounded-xl mb-4 border border-red-100">
              <p className="text-red-600 text-xs font-bold uppercase text-center">Todos os campos abaixo são de preenchimento obrigatório.</p>
          </div>

          {/* CPF */}
          <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase px-1">CPF (Apenas números) *</label>
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

          {/* Nome Identificado */}
          <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Nome Identificado *</label>
              <input 
                type="text" 
                readOnly 
                placeholder="Aguardando CPF..."
                className="w-full p-4 border rounded-2xl font-bold bg-zinc-100 text-zinc-500 border-zinc-200" 
                value={nome} 
              />
          </div>

          {/* Telefone */}
          <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Seu Telefone / WhatsApp *</label>
              <input type="text" placeholder="(XX) 9XXXX-XXXX" className={inputStyle} value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </div>

          {/* Área */}
          <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Sua Área / Setor *</label>
              <input type="text" placeholder="Ex: Logística, RH, Cozinha..." className={inputStyle} value={area} onChange={(e) => setArea(e.target.value)} />
          </div>
          
          <div className="pt-4 border-t border-dashed border-zinc-200 mt-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Produto a Cancelar *</label>
            <input type="text" placeholder="Ex: Arroz Tipo 1" className={inputStyle} value={produto} onChange={(e) => setProduto(e.target.value)} />
          </div>

          <div className="flex gap-2">
              <div className="flex-1">
                  <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Quantidade *</label>
                  <input type="number" placeholder="0" className={inputStyle} value={qtde} onChange={(e) => setQtde(e.target.value)} />
              </div>
              <div className="w-1/3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Unidade *</label>
                  <select className={inputStyle} value={unidade} onChange={(e) => setUnidade(e.target.value)}>
                      <option value="CX">CX</option>
                      <option value="KG">KG</option>
                      <option value="BAG">BAG</option>
                  </select>
              </div>
          </div>

          <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Motivo do Cancelamento *</label>
              <textarea 
                placeholder="Descreva por que deseja cancelar..." 
                rows={3} 
                className={inputStyle} 
                value={motivo} 
                onChange={(e) => setMotivo(e.target.value)} 
              />
          </div>

          <button 
              disabled={!cpf || !nome || !telefone || !area || !produto || !qtde || !motivo || carregando}
              onClick={handleSubmit}
              className={`w-full py-4 rounded-2xl font-black uppercase shadow-lg transition-all active:scale-95 ${(!cpf || !nome || !telefone || !area || !produto || !qtde || !motivo) ? 'bg-zinc-200 text-zinc-400' : 'bg-red-500 text-white shadow-red-500/20'}`}
          >
              {carregando ? "ENVIANDO..." : "SOLICITAR CANCELAMENTO"}
          </button>
      </div>
    </div>
  );
}
