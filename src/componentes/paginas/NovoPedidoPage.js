import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import ProductCard from '../ui/ProductCard';
import { criarPedidosEmLote } from '../../servicos/pedidosService';

const NovoPedidoPage = ({ 
  usuarioInput, 
  pessoasCadastradas, 
  produtosLancados, 
  siteFiltro, 
  temaEscuro, 
  showToast, 
  setActiveTab 
}) => {
  const [cpfPedido, setCpfPedido] = useState('');
  const [nomePedido, setNomePedido] = useState('');
  const [telefonePedido, setTelefonePedido] = useState('');
  const [cesta, setCesta] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [buscaProduto, setBuscaProduto] = useState('');

  // Busca nome pelo CPF
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
      showToast("✅ PEDIDO REALIZADO COM SUCESSO!", "success");
      setCesta([]);
      setCpfPedido('');
      setTelefonePedido('');
      setActiveTab('home');
    } catch (error) {
      showToast("Erro ao finalizar pedido.", "error");
    }
    setCarregando(false);
  };

  // Filtra produtos: deve ser da unidade atual OU estar marcado como 'AMBOS'
  const produtosFiltrados = produtosLancados.filter(p => 
    (p.site === siteFiltro || p.site === 'AMBOS') && 
    p.nome.toLowerCase().includes(buscaProduto.toLowerCase())
  );

  const totalCesta = cesta.reduce((acc, item) => acc + parseFloat(item.preco || 0), 0);

  const bgCard = temaEscuro ? 'bg-zinc-800' : 'bg-white';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-600';

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-24 space-y-6">
      <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase mb-2`}>← Voltar</button>
      
      <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-4`}>
        <h2 className={`text-xl font-black uppercase italic ${textMain}`}>Novo Pedido - {siteFiltro}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase">CPF (Apenas números)</label>
            <input 
              type="text" 
              placeholder="000.000.000-00" 
              maxLength={11} 
              className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} 
              value={cpfPedido} 
              onChange={(e) => setCpfPedido(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase">Nome Identificado</label>
            <input 
              type="text" 
              readOnly 
              className={`w-full p-4 border rounded-2xl font-bold ${temaEscuro ? 'bg-zinc-900 text-zinc-400 border-zinc-700' : 'bg-zinc-100 text-zinc-800'}`} 
              value={nomePedido || "Aguardando CPF..."} 
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase">Seu Telefone / WhatsApp</label>
            <input 
              type="text" 
              placeholder="(XX) 9XXXX-XXXX" 
              className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} 
              value={telefonePedido} 
              onChange={(e) => setTelefonePedido(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* Catálogo de Produtos */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-black uppercase italic ${textMain}`}>Catálogo</h3>
          <input 
            type="text" 
            placeholder="Buscar produto..." 
            className={`p-2 px-4 rounded-xl border text-xs outline-none ${temaEscuro ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white'}`}
            value={buscaProduto}
            onChange={(e) => setBuscaProduto(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {produtosFiltrados.map(produto => {
            const isSelected = cesta.some(item => item.id === produto.id);
            return (
              <ProductCard 
                key={produto.id} 
                produto={produto} 
                temaEscuro={temaEscuro} 
                isSelected={isSelected}
                onToggle={() => toggleNoCarrinho(produto)}
              />
            );
          })}
          {produtosFiltrados.length === 0 && (
            <p className="text-center py-10 text-zinc-400 font-bold">Nenhum produto encontrado para {siteFiltro}.</p>
          )}
        </div>
      </div>

      {/* Carrinho Flutuante / Resumo */}
      {cesta.length > 0 && (
        <div className={`fixed bottom-20 left-4 right-4 ${bgCard} p-4 rounded-2xl border shadow-2xl z-30 animate-in slide-in-from-bottom duration-300`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`font-black uppercase italic ${textMain}`}>Sua Cesta ({cesta.length})</span>
            <span className="text-yellow-500 font-black">R$ {totalCesta.toFixed(2)}</span>
          </div>
          <div className="max-h-32 overflow-y-auto mb-4 space-y-2">
            {cesta.map(item => (
              <div key={item.idCesta} className="flex justify-between items-center bg-zinc-50 p-2 rounded-lg dark:bg-zinc-700">
                <span className="text-[10px] font-bold uppercase truncate flex-1">{item.nome}</span>
                <button onClick={() => removerDoCarrinho(item.idCesta)} className="text-red-500 p-1"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <button 
            onClick={finalizarPedido}
            disabled={carregando}
            className="w-full bg-yellow-500 text-white py-3 rounded-xl font-black uppercase shadow-lg active:scale-95"
          >
            {carregando ? "PROCESSANDO..." : "FINALIZAR PEDIDO"}
          </button>
        </div>
      )}
    </div>
  );
};

export default NovoPedidoPage;
