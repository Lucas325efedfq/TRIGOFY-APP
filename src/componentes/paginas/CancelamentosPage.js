import React, { useState, useEffect } from 'react';
import { XCircle, Clock } from 'lucide-react';
import { criarCancelamento } from '../../servicos/cancelamentosService';

const CancelamentosPage = ({ 
  usuarioInput, 
  pessoasCadastradas, 
  temaEscuro, 
  showToast,
  setActiveTab 
}) => {
  const [cpfCancelamento, setCpfCancelamento] = useState('');
  const [nomeCancelamento, setNomeCancelamento] = useState('');
  const [telefoneCancelamento, setTelefoneCancelamento] = useState('');
  const [areaCancelamento, setAreaCancelamento] = useState('');
  const [produtoCancelamento, setProdutoCancelamento] = useState('');
  const [qtdeCancelamento, setQtdeCancelamento] = useState('');
  const [unidadeCancelamento, setUnidadeCancelamento] = useState('CX');
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Busca nome pelo CPF
  useEffect(() => {
    if (cpfCancelamento.length === 11) {
      const pessoa = pessoasCadastradas.find(p => p.cpf === cpfCancelamento);
      if (pessoa) {
        setNomeCancelamento(pessoa.nome);
        setAreaCancelamento(pessoa.area || '');
      } else {
        setNomeCancelamento('');
        showToast("CPF não encontrado na base de dados.", "error");
      }
    } else {
      setNomeCancelamento('');
    }
  }, [cpfCancelamento, pessoasCadastradas]);

  const handleEnviar = async () => {
    if (!nomeCancelamento || !telefoneCancelamento || !areaCancelamento || !produtoCancelamento || !qtdeCancelamento || !unidadeCancelamento || !motivoCancelamento) {
      return showToast("Preencha todos os campos obrigatórios.", "error");
    }

    setCarregando(true);
    try {
      const dados = {
        solicitante: usuarioInput,
        cpf: cpfCancelamento,
        nomeCompleto: nomeCancelamento,
        telefone: telefoneCancelamento,
        area: areaCancelamento,
        produto: produtoCancelamento,
        quantidade: qtdeCancelamento,
        unidade: unidadeCancelamento,
        motivo: motivoCancelamento
      };

      const response = await criarCancelamento(dados);
      
      if (response && response.id) {
        showToast("✅ SOLICITAÇÃO DE CANCELAMENTO ENVIADA!", "success");
        setActiveTab('home');
      } else {
        showToast("Erro ao registrar cancelamento no Airtable.", "error");
      }
    } catch (error) {
      console.error("Erro ao enviar cancelamento:", error);
      showToast("Erro de conexão ao enviar cancelamento.", "error");
    }
    setCarregando(false);
  };

  const bgCard = temaEscuro ? 'bg-zinc-800' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-600';

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-20">
      <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase mb-2`}>← Voltar</button>
      <h2 className={`text-xl font-black uppercase italic mb-4 ${textMain}`}>Cancelamentos</h2>
      
      <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-4`}>
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
          <div className="bg-red-500 p-2 rounded-xl text-white"><XCircle size={20} /></div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-red-400 uppercase">Atenção</p>
            <p className="text-xs font-bold text-red-700">Preencha os dados abaixo para solicitar o cancelamento de um registro.</p>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-zinc-400 uppercase">CPF (Apenas números)</label>
          <input 
            type="text" 
            placeholder="Digite o CPF" 
            maxLength={11} 
            className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} 
            value={cpfCancelamento} 
            onChange={(e) => setCpfCancelamento(e.target.value)} 
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-zinc-400 uppercase">Nome Identificado</label>
          <input 
            type="text" 
            readOnly 
            className={`w-full p-4 border rounded-2xl font-bold ${temaEscuro ? 'bg-zinc-900 text-zinc-400 border-zinc-700' : 'bg-zinc-100 text-zinc-800'}`} 
            value={nomeCancelamento || "Aguardando CPF..."} 
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-zinc-400 uppercase">Seu Telefone / WhatsApp</label>
          <input 
            type="text" 
            placeholder="(XX) 9XXXX-XXXX" 
            className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} 
            value={telefoneCancelamento} 
            onChange={(e) => setTelefoneCancelamento(e.target.value)} 
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-zinc-400 uppercase">Sua Área / Setor</label>
          <input 
            type="text" 
            placeholder="Ex: Logística, RH, Cozinha..." 
            className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} 
            value={areaCancelamento} 
            onChange={(e) => setAreaCancelamento(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="text-[10px] font-black text-zinc-400 uppercase">Produto a Cancelar</label>
          <input 
            type="text" 
            placeholder="Ex: Arroz Tipo 1" 
            className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} 
            value={produtoCancelamento} 
            onChange={(e) => setProdutoCancelamento(e.target.value)} 
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase">Quantidade</label>
            <input 
              type="number" 
              placeholder="0" 
              className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} 
              value={qtdeCancelamento} 
              onChange={(e) => setQtdeCancelamento(e.target.value)} 
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase">Unidade de Medida (Sobra)</label>
            <select 
              className={`w-full p-4 rounded-2xl outline-none border font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} 
              value={unidadeCancelamento} 
              onChange={(e) => setUnidadeCancelamento(e.target.value)}
            >
              <option value="CX">CX</option>
              <option value="KG">KG</option>
              <option value="BAG">BAG</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-zinc-400 uppercase">Motivo do Cancelamento</label>
          <textarea 
            placeholder="Por que deseja cancelar?" 
            rows={3} 
            className={`w-full p-4 rounded-2xl border outline-none font-bold resize-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`} 
            value={motivoCancelamento} 
            onChange={(e) => setMotivoCancelamento(e.target.value)} 
          />
        </div>

        <button 
          disabled={!nomeCancelamento || !telefoneCancelamento || !areaCancelamento || !produtoCancelamento || !qtdeCancelamento || !unidadeCancelamento || !motivoCancelamento || carregando}
          onClick={handleEnviar}
          className={`w-full py-4 rounded-2xl font-black uppercase shadow-lg transition-all ${nomeCancelamento ? 'bg-red-500 text-white active:scale-95' : 'bg-zinc-200 text-zinc-400'}`}
        >
          {carregando ? "ENVIANDO..." : "SOLICITAR CANCELAMENTO"}
        </button>
      </div>
    </div>
  );
};

export default CancelamentosPage;
