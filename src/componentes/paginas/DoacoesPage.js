import React, { useState, useEffect } from 'react';
import { Megaphone, Camera } from 'lucide-react';
import { criarDoacao } from '../../servicos/doacoesService';

const DoacoesPage = ({ 
  usuarioInput, 
  usuarioLogadoCpf,
  isAdmin,
  pessoasCadastradas, 
  temaEscuro, 
  showToast, 
  setActiveTab,
  onNotificarAprovador
}) => {
  const [cpfDoacao, setCpfDoacao] = useState(usuarioLogadoCpf || '');
  const [nomeDoacao, setNomeDoacao] = useState('');
  const [areaDoacao, setAreaDoacao] = useState('');
  const [produtoDoacao, setProdutoDoacao] = useState('');
  const [codigoDoacao, setCodigoDoacao] = useState('');
  const [motivoDoacao, setMotivoDoacao] = useState('');
  const [areaProdutoDoacao, setAreaProdutoDoacao] = useState('');
  const [vencimentoDoacao, setVencimentoDoacao] = useState('');
  const [origemDoacao, setOrigemDoacao] = useState('');
  const [localDoacao, setLocalDoacao] = useState('');
  const [quantidadeDoacao, setQuantidadeDoacao] = useState('');
  const [unidadeDoacao, setUnidadeDoacao] = useState('CX');
  const [porcionamentoDoacao, setPorcionamentoDoacao] = useState('');
  const [fotoDoacao, setFotoDoacao] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Busca nome pelo CPF
  useEffect(() => {
    if (!isAdmin && usuarioLogadoCpf && cpfDoacao !== usuarioLogadoCpf) {
      setCpfDoacao(usuarioLogadoCpf);
      return;
    }

    if (cpfDoacao.length === 11) {
      const pessoa = pessoasCadastradas.find(p => p.cpf === cpfDoacao);
      if (pessoa) {
        setNomeDoacao(pessoa.nome);
        setAreaDoacao(pessoa.area || '');
      } else {
        setNomeDoacao('');
        if (cpfDoacao.length === 11) showToast("CPF não encontrado.", "error");
      }
    } else {
      setNomeDoacao('');
    }
  }, [cpfDoacao, pessoasCadastradas, isAdmin, usuarioLogadoCpf]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoDoacao(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEnviar = async () => {
    // Todos os campos agora são obrigatórios conforme solicitado
    if (
      !nomeDoacao || 
      !produtoDoacao || 
      !codigoDoacao ||
      !quantidadeDoacao || 
      !motivoDoacao || 
      !areaProdutoDoacao || 
      !vencimentoDoacao || 
      !origemDoacao || 
      !localDoacao || 
      !porcionamentoDoacao ||
      !fotoDoacao
    ) {
      return showToast("Todos os campos são obrigatórios, incluindo a foto.", "error");
    }

    setCarregando(true);
    try {
      const dados = {
        solicitante: usuarioInput,
        produto: produtoDoacao,
        codigoProduto: codigoDoacao,
        areaSolicitante: areaDoacao,
        motivo: motivoDoacao,
        areaProduto: areaProdutoDoacao,
        vencimento: vencimentoDoacao,
        origem: origemDoacao,
        localArmazenamento: localDoacao,
        quantidade: quantidadeDoacao,
        unidade: unidadeDoacao,
        porcionamento: porcionamentoDoacao,
        foto: fotoDoacao
      };

      await criarDoacao(dados);
      showToast("✅ SOLICITAÇÃO ENVIADA PARA APROVAÇÃO!", "success");
      
      if (onNotificarAprovador) {
        onNotificarAprovador({
          solicitante: nomeDoacao,
          produto: produtoDoacao,
          quantidade: quantidadeDoacao,
          unidade: unidadeDoacao,
          motivo: motivoDoacao,
          site: origemDoacao
        });
      }

      setActiveTab('home');
    } catch (error) {
      showToast("Erro ao registrar doação.", "error");
    }
    setCarregando(false);
  };

  const bgCard = temaEscuro ? 'bg-zinc-800' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-600';

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-24 space-y-6">
      <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase mb-2`}>← Voltar</button>
      
      <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-4`}>
        <h2 className={`text-xl font-black uppercase italic ${textMain}`}>Solicitar Doação</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase">CPF do Solicitante *</label>
            <input 
              type="text" 
              placeholder="000.000.000-00" 
              maxLength={11} 
              className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} 
              value={cpfDoacao} 
              onChange={(e) => setCpfDoacao(e.target.value)}
              readOnly={!isAdmin && !!usuarioLogadoCpf}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase">Nome Identificado</label>
            <input 
              type="text" 
              readOnly 
              className={`w-full p-4 border rounded-2xl font-bold ${temaEscuro ? 'bg-zinc-900 text-zinc-400 border-zinc-700' : 'bg-zinc-100 text-zinc-800'}`} 
              value={nomeDoacao || "Aguardando CPF..."} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase">Produto *</label>
              <input type="text" placeholder="Ex: Arroz" className={`w-full p-4 rounded-2xl border outline-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={produtoDoacao} onChange={(e) => setProdutoDoacao(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase">Código *</label>
              <input type="text" placeholder="Ex: 1234" className={`w-full p-4 rounded-2xl border outline-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={codigoDoacao} onChange={(e) => setCodigoDoacao(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase">Área do produto a ser doado *</label>
            <select className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={areaProdutoDoacao} onChange={(e) => setAreaProdutoDoacao(e.target.value)}>
              <option value="">Selecione a área...</option>
              <option value="Lasagna">Lasagna</option>
              <option value="Pesagem">Pesagem</option>
              <option value="Cozinha Central">Cozinha Central</option>
              <option value="Pane">Pane</option>
              <option value="Massa">Massa</option>
              <option value="Molho">Molho</option>
              <option value="Qualidade">Qualidade</option>
              <option value="P&D">P&D</option>
              <option value="Estoque">Estoque</option>
              <option value="Suprimentos">Suprimentos</option>
              <option value="Meio Ambiente">Meio Ambiente</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase">Data de Vencimento *</label>
              <input type="date" className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={vencimentoDoacao} onChange={(e) => setVencimentoDoacao(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase">Origem do Produto *</label>
              <select className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={origemDoacao} onChange={(e) => setOrigemDoacao(e.target.value)}>
                <option value="">Selecione a origem...</option>
                <option value="Insumo / Produto Fábrica">Insumo / Produto Fábrica</option>
                <option value="Produto Fora do Padrão">Produto Fora do Padrão</option>
                <option value="Produto Teste">Produto Teste</option>
                <option value="Produto Distribuidora">Produto Distribuidora</option>
                <option value="Estoque de Contingência">Estoque de Contingência</option>
                <option value="Produto Varejo">Produto Varejo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase">Em qual câmara/local está armazenado? *</label>
            <input type="text" placeholder="Ex: Câmara Fria 01" className={`w-full p-4 rounded-2xl border outline-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={localDoacao} onChange={(e) => setLocalDoacao(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase">Quantidade *</label>
              <input type="number" placeholder="0" className={`w-full p-4 rounded-2xl border outline-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={quantidadeDoacao} onChange={(e) => setQuantidadeDoacao(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase">Unidade *</label>
              <select className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={unidadeDoacao} onChange={(e) => setUnidadeDoacao(e.target.value)}>
                <option value="CX">CX</option>
                <option value="KG">KG</option>
                <option value="UN">UN</option>
                <option value="PCT">PCT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase">Como está porcionado o volume total? *</label>
            <input type="text" placeholder="Ex: 10 pacotes de 1kg" className={`w-full p-4 rounded-2xl border outline-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={porcionamentoDoacao} onChange={(e) => setPorcionamentoDoacao(e.target.value)} />
          </div>

          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase">Motivo da Doação *</label>
            <textarea rows={2} placeholder="Ex: Vencimento próximo" className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={motivoDoacao} onChange={(e) => setMotivoDoacao(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase block">Foto da Etiqueta *</label>
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="foto-upload" />
              <label htmlFor="foto-upload" className={`w-full p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${temaEscuro ? 'border-zinc-600 hover:bg-zinc-700' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                <Camera size={24} className="text-zinc-400" />
                <span className="text-[10px] font-black text-zinc-400 uppercase">{fotoDoacao ? "Foto Selecionada ✅" : "Tirar Foto ou Upload"}</span>
              </label>
            </div>
          </div>

          <button 
            onClick={handleEnviar}
            disabled={carregando || !nomeDoacao}
            className="w-full bg-green-500 text-white py-4 rounded-2xl font-black uppercase shadow-lg active:scale-95 disabled:opacity-50"
          >
            {carregando ? "ENVIANDO..." : "SOLICITAR DOAÇÃO"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoacoesPage;
