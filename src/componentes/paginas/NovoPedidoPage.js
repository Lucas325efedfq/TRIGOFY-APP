import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, CheckCircle2, ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import ProductCard from '../ui/ProductCard';
import { criarPedidosEmLote } from '../../servicos/pedidosService';

const NovoPedidoPage = ({ 
  usuarioInput, 
  pessoasCadastradas, 
  produtosLancados, 
  siteFiltro, 
  temaEscuro, 
  showToast, 
  setActiveTab,
  onNotificarAprovador
}) => {
  const [cpfPedido, setCpfPedido] = useState('');
  const [nomePedido, setNomePedido] = useState('');
  const [telefonePedido, setTelefonePedido] = useState('');
  const [cesta, setCesta] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [buscaProduto, setBuscaProduto] = useState('');

  useEffect(() => {
    if (cpfPedido.length === 11) {
      const pessoa = pessoasCadastradas.find(p => p.cpf === cpfPedido);
      if (pessoa) {
        setNomePedido(pessoa.nome);
      } else {
        setNomePedido('');
        showToast("CPF não encontrado.", "error");
      }
    } else {
      setNomePedido('');
    }
  }, [cpfPedido, pessoasCadastradas]);

  const toggleNoCarrinho = (produto) => {
    const jaEstaNaCesta = cesta.find(item => item.id === produto.id);
    if (jaEstaNaCesta) {
      setCesta(cesta.filter(item => item.id !== produto.id));
    } else {
      setCesta([...cesta, { ...produto, idCesta: Date.now() }]);
      showToast(`${produto.nome} selecionado!`, "success");
    }
  };

  const removerDoCarrinho = (idCesta) => {
    setCesta(cesta.filter(item => item.idCesta !== idCesta));
  };

  const finalizarPedido = async () => {
    if (!nomePedido || !telefonePedido || cesta.length === 0) {
      return showToast("Preencha os dados e adicione produtos.", "error");
    }

    setCarregando(true);
    try {
      const pedidos = cesta.map(item => ({
        solicitante: usuarioInput,
        cpf: cpfPedido,
        produto: item.nome,
        valor: item.preco,
        site: siteFiltro,
        telefone: telefonePedido
      }));

      await criarPedidosEmLote(pedidos);
      showToast("✅ SOLICITAÇÃO ENVIADA PARA APROVAÇÃO!", "success");
      
      if (onNotificarAprovador) {
        onNotificarAprovador({
          solicitante: nomePedido,
          produto: cesta.map(i => i.nome).join(', '),
          site: siteFiltro,
          valor: totalCesta.toFixed(2)
        });
      }

      setCesta([]);
      setCpfPedido('');
      setTelefonePedido('');
      setActiveTab('home');
    } catch (error) {
      showToast("Erro ao finalizar pedido.", "error");
    }
    setCarregando(false);
  };

  const produtosFiltrados = produtosLancados.filter(p => 
    (p.site === siteFiltro || p.site === 'AMBOS') && 
    p.nome.toLowerCase().includes(buscaProduto.toLowerCase())
  );

  const totalCesta = cesta.reduce((acc, item) => acc + parseFloat(item.preco || 0), 0);

  const bgCard = temaEscuro ? 'bg-zinc-900/50' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-500';
  const borderColor = temaEscuro ? 'border-zinc-800/50' : 'border-zinc-200/50';

  return (
    <div className="animate-in slide-in-from-right duration-700 pb-48 space-y-8">
      <button 
        onClick={() => setActiveTab('home')} 
        className={`flex items-center gap-2 ${textSub} font-black text-[10px] uppercase tracking-widest hover:text-yellow-500 transition-colors`}
      >
        <ArrowLeft size={14} /> Voltar ao Menu
      </button>
      
      <div className={`${bgCard} p-8 rounded-[2.5rem] border ${borderColor} shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full" />
        <h2 className={`text-2xl font-black uppercase italic tracking-tighter mb-6 ${textMain}`}>
          Novo <span className="text-yellow-500">Pedido</span>
          <span className="block text-[10px] not-italic font-black text-zinc-400 tracking-[0.3em] mt-1">{siteFiltro}</span>
        </h2>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">CPF (Apenas números)</label>
            <input 
              type="text" 
              placeholder="00000000000" 
              maxLength={11} 
              className={`w-full p-4 rounded-2xl outline-none border transition-all ${
                temaEscuro 
                  ? 'bg-zinc-800/50 border-zinc-700 text-white focus:border-yellow-500/50' 
                  : 'bg-zinc-50 border-zinc-200 focus:border-yellow-500/50 font-bold'
              }`} 
              value={cpfPedido} 
              onChange={(e) => setCpfPedido(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nome Identificado</label>
            <div className={`w-full p-4 border rounded-2xl font-bold ${
              temaEscuro ? 'bg-zinc-950/50 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
            }`}>
              {nomePedido || "Aguardando CPF..."}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
            <input 
              type="text" 
              placeholder="249XXXXXXXX" 
              className={`w-full p-4 rounded-2xl outline-none border transition-all ${
                temaEscuro 
                  ? 'bg-zinc-800/50 border-zinc-700 text-white focus:border-yellow-500/50' 
                  : 'bg-zinc-50 border-zinc-200 focus:border-yellow-500/50 font-bold'
              }`} 
              value={telefonePedido} 
              onChange={(e) => setTelefonePedido(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* Catálogo de Produtos */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className={`text-xl font-black uppercase italic tracking-tighter ${textMain}`}>Catálogo</h3>
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-yellow-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar produto..." 
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs outline-none transition-all ${
                temaEscuro ? 'bg-zinc-900 border-zinc-800 text-white focus:border-yellow-500/50' : 'bg-white border-zinc-200 focus:border-yellow-500/50'
              }`}
              value={buscaProduto}
              onChange={(e) => setBuscaProduto(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {produtosFiltrados.map(produto => {
            const isSelected = cesta.some(item => item.id === produto.id);
            return (
              <ProductCard 
                key={produto.id} 
                produto={produto} 
                isSelected={isSelected}
                onToggle={() => toggleNoCarrinho(produto)}
              />
            );
          })}
          {produtosFiltrados.length === 0 && (
            <div className={`text-center py-16 rounded-[2rem] border-2 border-dashed ${borderColor}`}>
              <ShoppingBag size={48} className="mx-auto text-zinc-300 mb-4 opacity-20" />
              <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Carrinho Flutuante / Resumo */}
      {cesta.length > 0 && (
        <div className={`fixed bottom-24 left-4 right-4 ${
          temaEscuro ? 'bg-zinc-900/90' : 'bg-white/90'
        } backdrop-blur-xl p-6 rounded-[2rem] border ${borderColor} shadow-2xl z-40 animate-in slide-in-from-bottom-10 duration-500`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-yellow-500/20">
                <ShoppingCart size={16} strokeWidth={3} />
              </div>
              <span className={`font-black uppercase italic tracking-tight ${textMain}`}>Sua Cesta ({cesta.length})</span>
            </div>
            <span className="text-yellow-500 font-black text-lg">R$ {totalCesta.toFixed(2)}</span>
          </div>
          
          <div className="max-h-32 overflow-y-auto mb-6 space-y-2 pr-2 custom-scrollbar">
            {cesta.map(item => (
              <div key={item.idCesta} className={`flex justify-between items-center p-3 rounded-xl ${
                temaEscuro ? 'bg-zinc-800/50' : 'bg-zinc-50'
              }`}>
                <span className={`text-[10px] font-black uppercase truncate flex-1 ${textMain}`}>{item.nome}</span>
                <button 
                  onClick={() => removerDoCarrinho(item.idCesta)} 
                  className="text-red-500 p-1 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={finalizarPedido}
            disabled={carregando}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {carregando ? "PROCESSANDO..." : "FINALIZAR PEDIDO"}
          </button>
        </div>
      )}
    </div>
  );
};

export default NovoPedidoPage;
