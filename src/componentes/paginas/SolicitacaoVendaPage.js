import React, { useState, useEffect } from 'react';
import { criarVenda } from '../../servicos/vendasService';

export default function SolicitacaoVendaPage({ usuarioInput, usuarioLogadoCpf, isAdmin, showToast, setActiveTab, pessoasCadastradas = [] }) {
  const [carregando, setCarregando] = useState(false);
  
  // Estados do Formulário
  const [cpf, setCpf] = useState(usuarioLogadoCpf || '');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [area, setArea] = useState('');
  const [motivo, setMotivo] = useState('');
  const [produto, setProduto] = useState('');
  const [codigoProduto, setCodigoProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('UNIDADE');
  const [porcionamento, setPorcionamento] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [origem, setOrigem] = useState('Insumo / Produto');
  const [camara, setCamara] = useState('');
  const [valorVenda, setValorVenda] = useState('');

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
    // Validação de todos os campos obrigatórios
    if (!cpf || !nome || !telefone || !area || !motivo || !produto || !codigoProduto || !quantidade || !unidade || !porcionamento || !vencimento || !origem || !camara || !valorVenda) {
      showToast("Preencha todos os campos obrigatórios para prosseguir.", "error");
      return;
    }

    setCarregando(true);
    try {
      await criarVenda({
        solicitante: usuarioInput,
        cpf,
        nome,
        telefone,
        area,
        motivo,
        produto,
        codigoProduto,
        quantidade,
        unidade,
        porcionamento,
        vencimento,
        origem,
        camara,
        valorVenda
      });

      showToast("✅ Solicitação de venda enviada com sucesso!", "success");
      setActiveTab('home');
    } catch (error) {
      console.error(error);
      showToast("Erro ao enviar solicitação de venda.", "error");
    } finally {
      setCarregando(false);
    }
  };

  const inputStyle = "w-full p-4 rounded-2xl outline-none border bg-zinc-50 border-zinc-200 font-bold text-zinc-900 focus:border-yellow-500 transition-all";
  const labelStyle = "text-[10px] font-black text-zinc-400 uppercase px-1";

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-20">
      <button onClick={() => setActiveTab('home')} className="text-zinc-500 font-bold text-xs uppercase mb-2 hover:text-zinc-800">← Voltar</button>
      
      <h2 className="text-xl font-black uppercase italic mb-4 text-zinc-900">Solicitação de Venda</h2>
      
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

          {/* Dados do Produto */}
          <div className="pt-4 border-t border-dashed border-zinc-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Produto a ser vendido *</label>
                <input type="text" placeholder="Nome do Produto" className={inputStyle} value={produto} onChange={(e) => setProduto(e.target.value)} />
              </div>
              <div>
                <label className={labelStyle}>Código do Produto *</label>
                <input type="text" placeholder="Código" className={inputStyle} value={codigoProduto} onChange={(e) => setCodigoProduto(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className={labelStyle}>Quantidade *</label>
                <input type="number" placeholder="0" className={inputStyle} value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
            </div>
            <div>
                <label className={labelStyle}>Unidade *</label>
                <select className={inputStyle} value={unidade} onChange={(e) => setUnidade(e.target.value)}>
                    <option value="KG">KG</option>
                    <option value="CAIXA">CAIXA</option>
                    <option value="BAG">BAG</option>
                    <option value="PACOTE">PACOTE</option>
                    <option value="UNIDADE">UNIDADE</option>
                </select>
            </div>
            <div>
                <label className={labelStyle}>Valor de Venda (R$) *</label>
                <input type="text" placeholder="0,00" className={inputStyle} value={valorVenda} onChange={(e) => setValorVenda(e.target.value)} />
            </div>
          </div>

          <div>
              <label className={labelStyle}>Porcionamento (Volume Total) *</label>
              <input type="text" placeholder="Ex: 10 pacotes de 1kg" className={inputStyle} value={porcionamento} onChange={(e) => setPorcionamento(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className={labelStyle}>Data de Vencimento *</label>
                <input type="date" className={inputStyle} value={vencimento} onChange={(e) => setVencimento(e.target.value)} />
            </div>
            <div>
                <label className={labelStyle}>Câmara de Armazenamento *</label>
                <input type="text" placeholder="Ex: Câmara 01" className={inputStyle} value={camara} onChange={(e) => setCamara(e.target.value)} />
            </div>
          </div>

          <div>
              <label className={labelStyle}>Origem do Produto *</label>
              <select className={inputStyle} value={origem} onChange={(e) => setOrigem(e.target.value)}>
                  <option value="Insumo / Produto">Insumo / Produto</option>
                  <option value="Fábrica">Fábrica</option>
                  <option value="Produto Teste">Produto Teste</option>
                  <option value="Produto Distribuidora">Produto Distribuidora</option>
                  <option value="Estoque de Contingência">Estoque de Contingência</option>
              </select>
          </div>

          <div>
              <label className={labelStyle}>Motivo da Venda *</label>
              <textarea placeholder="Descreva o motivo..." rows={2} className={inputStyle} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </div>

          <button 
              disabled={carregando}
              onClick={handleSubmit}
              className={`w-full py-4 rounded-2xl font-black uppercase shadow-lg transition-all active:scale-95 ${carregando ? 'bg-zinc-200 text-zinc-400' : 'bg-green-600 text-white shadow-green-500/20'}`}
          >
              {carregando ? "ENVIANDO..." : "SOLICITAR VENDA"}
          </button>
      </div>
    </div>
  );
}
