"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Send, ChevronRight, ShoppingBag, 
  LogOut, BookOpen, Plus, Trash2, Megaphone, Settings, Sun, Moon, User, Lock, Edit3, UserPlus, Database, Users, Package, Image as ImageIcon, CheckCircle2, Clock, AlertCircle, XCircle, Check, X
} from 'lucide-react';

// ==========================================================
// 1. CONFIGURAÇÕES DE CONEXÃO (AIRTABLE)
// ==========================================================
const AIRTABLE_TOKEN = 'patSTombPP4bmw0AK.43e89e93f885283e025cc1c7636c3af9053c953ca812746652c883757c25cd9a';
const BASE_ID = 'appj9MPXg5rVQf3zK';
const TABLE_ID = 'tblcgAQwSPe8NcvRN';
const TABLE_ID_PRODUTOS = 'tblProdutos'; // Nova tabela integrada
const TABLE_ID_PEDIDOS = 'tblPedidos'; // Tabela de Relatórios

// CONFIGURAÇÃO DOS APROVADORES (WHATSAPP)
const TELEFONE_APROVADOR = "552435110169"; // Substitua pelo número real com DDD

export default function TrigofyApp() {
  const [estaLogado, setEstaLogado] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [usuarioInput, setUsuarioInput] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [pessoasCadastradas, setPessoasCadastradas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  // Controles de Site e Filtro
  const [siteFiltro, setSiteFiltro] = useState(''); 
  const [siteUsuarioIdentificado, setSiteUsuarioIdentificado] = useState('');
  
  // Estado para armazenar a origem do usuário que fez login
  const [usuarioLogadoOrigem, setUsuarioLogadoOrigem] = useState('');

  // Estado para controle de tema (Claro/Escuro)
  const [temaEscuro, setTemaEscuro] = useState(false);

  // Estados para o Histórico de Pedidos Pessoal e Pedidos para Aprovar
  const [meusPedidosHistorico, setMeusPedidosHistorico] = useState([]);
  const [pedidosParaAprovar, setPedidosParaAprovar] = useState([]);

  // Estados para o Chat do Triger
  const [mensagens, setMensagens] = useState([
    { id: 1, texto: "Olá! Eu sou o Triger, seu suporte inteligente. Como posso te ajudar hoje?", bot: true }
  ]);
  const [inputChat, setInputChat] = useState('');

  // ==========================================================
  // 2. CADASTRO DE USUÁRIOS E PRODUTOS (AGORA COM FUNÇÃO)
  // ==========================================================
  const [usuariosAutorizados, setUsuariosAutorizados] = useState([
    { usuario: 'admin', senha: 'T!$&gur001', origem: 'ALL', funcao: 'ADMIN' },
    { usuario: 'lucas.vieira', senha: '123', origem: 'VR', funcao: 'USER' },
    { usuario: 'lucas.lopes', senha: '456', origem: 'VR', funcao: 'USER' },
  ]);

  const [produtosLancados, setProdutosLancados] = useState([]);

  const [novaSenhaInput, setNovaSenhaInput] = useState('');

  // Controle de sub-telas do Admin
  const [subAbaAdmin, setSubAbaAdmin] = useState('menu'); 

  // Estados para Cadastro de Novo Usuário (Admin)
  const [novoUserLogin, setNovoUserLogin] = useState('');
  const [novoUserSenha, setNovoUserSenha] = useState('');
  const [novoUserOrigem, setNovoUserOrigem] = useState('VR');
  const [novoUserFuncao, setNovoUserFuncao] = useState('USER'); // Nova Função

  // Estados para Edição de Usuário Existente
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editSenha, setEditSenha] = useState('');
  const [editOrigem, setEditOrigem] = useState('');

  // Estados para Cadastro de Produtos (Admin)
  const [prodNome, setProdNome] = useState('');
  const [prodPreco, setProdPreco] = useState('');
  const [prodSite, setProdSite] = useState('VR');
  const [prodImagem, setProdImagem] = useState('');

  // Estados de Compra do Usuário
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // ==========================================================
  // 3. FUNÇÕES DE BANCO DE DADOS (AIRTABLE)
  // ==========================================================
  const buscarDadosAirtable = async () => {
    setCarregando(true);
    try {
      // BUSCA PESSOAS
      const resPessoas = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
        headers: { 
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json"
        }
      });
      const dataPessoas = await resPessoas.json();
      if (dataPessoas.records) {
        const formatado = dataPessoas.records.map(reg => ({
          id: reg.id,
          cpf: reg.fields.cpf || '',
          nome: reg.fields.nome || '',
          site: (reg.fields.site || '').toUpperCase()
        }));
        setPessoasCadastradas(formatado);
      }

      // BUSCA PRODUTOS (INTEGRAÇÃO TABELA tblProdutos)
      const resProdutos = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_PRODUTOS}`, {
        headers: { 
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json"
        }
      });
      const dataProd = await resProdutos.json();
      if (dataProd.records) {
        setProdutosLancados(dataProd.records.map(reg => ({
          id: reg.id,
          nome: reg.fields.nome || '',
          preco: reg.fields.preco || '',
          site: reg.fields.site || '',
          imagem: reg.fields.imagem || ''
        })));
      }

    } catch (e) {
      console.error("Erro ao buscar dados:", e);
    }
    setCarregando(false);
  };

  // FUNÇÃO PARA BUSCAR MEUS PEDIDOS FILTRADOS PELO LOGIN
  const buscarMeusPedidos = async () => {
    setCarregando(true);
    try {
      const formula = encodeURIComponent(`{solicitante} = '${usuarioInput}'`);
      const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_PEDIDOS}?filterByFormula=${formula}`, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
      });
      const data = await res.json();
      if (data.records) {
        setMeusPedidosHistorico(data.records.map(r => ({
          id: r.id,
          produto: r.fields.produto,
          valor: r.fields.valor,
          data: r.fields.data,
          site: r.fields.site,
          status: r.fields.status || 'PENDENTE'
        })));
      }
    } catch (e) { console.error("Erro ao carregar pedidos:", e); }
    setCarregando(false);
  };

  // FUNÇÃO PARA BUSCAR PEDIDOS PENDENTES (PARA APROVADORES)
  const buscarPedidosPendentes = async () => {
    setCarregando(true);
    try {
      const formula = encodeURIComponent(`{status} = 'PENDENTE'`);
      const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_PEDIDOS}?filterByFormula=${formula}`, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
      });
      const data = await res.json();
      if (data.records) {
        setPedidosParaAprovar(data.records.map(r => ({
          id: r.id,
          solicitante: r.fields.solicitante,
          produto: r.fields.produto,
          valor: r.fields.valor,
          data: r.fields.data,
          site: r.fields.site
        })));
      }
    } catch (e) { console.error("Erro ao buscar pendentes:", e); }
    setCarregando(false);
  };

  // FUNÇÃO PARA ATUALIZAR STATUS (APROVAR/REPROVAR)
  const atualizarStatusPedido = async (id, novoStatus) => {
    setCarregando(true);
    try {
      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_PEDIDOS}/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: { status: novoStatus } })
      });
      if (response.ok) {
        alert(`Pedido ${novoStatus} com sucesso!`);
        buscarPedidosPendentes();
      }
    } catch (e) { alert("Erro ao atualizar status."); }
    setCarregando(false);
  };

  useEffect(() => {
    buscarDadosAirtable();
  }, []);

  // Monitora abas de pedidos e aprovações
  useEffect(() => {
    if (activeTab === 'pedidos' && estaLogado) buscarMeusPedidos();
    if (activeTab === 'aprovacoes' && estaLogado) buscarPedidosPendentes();
  }, [activeTab]);

  const [novoCpf, setNovoCpf] = useState('');
  const [novoNome, setNovoNome] = useState('');

  const salvarNoAirtable = async () => {
    if (!novoCpf || !novoNome) {
      alert("Por favor, preencha CPF e Nome.");
      return;
    }
    setCarregando(true);
    try {
      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            cpf: novoCpf.replace(/\D/g, ''),
            nome: novoNome.toUpperCase().trim()
          }
        })
      });
      if (response.ok) {
        setNovoCpf('');
        setNovoNome('');
        await buscarDadosAirtable();
        alert("✅ Cadastrado com sucesso!");
      }
    } catch (e) {
      alert("Erro ao salvar.");
    }
    setCarregando(false);
  };

  const excluirDoAirtable = async (id) => {
    if (!confirm("Deseja excluir permanentemente?")) return;
    try {
      await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
      });
      buscarDadosAirtable();
    } catch (e) {
      alert("Erro ao excluir.");
    }
  };

  // ==========================================================
  // 4. LÓGICA DE FORMULÁRIOS, LOGIN E CHAT
  // ==========================================================
  const [cpfDigitado, setCpfDigitado] = useState('');
  const [nomeEncontrado, setNomeEncontrado] = useState('');

  useEffect(() => {
    const pessoa = pessoasCadastradas.find(p => p.cpf === cpfDigitado.replace(/\D/g, ''));
    if (pessoa) {
      setNomeEncontrado(pessoa.nome);
      setSiteUsuarioIdentificado(pessoa.site);
    } else {
      setNomeEncontrado('');
      setSiteUsuarioIdentificado('');
    }
  }, [cpfDigitado, pessoasCadastradas]);

  const lidarComLogin = (e) => {
    e.preventDefault();
    const encontrou = usuariosAutorizados.find(
      (u) => u.usuario === usuarioInput.toLowerCase() && u.senha === senha
    );

    if (encontrou) {
      setEstaLogado(true);
      setUsuarioLogadoOrigem(encontrou.origem); 
      setErro('');
    } else {
      setErro('Usuário ou senha incorretos.');
    }
  };

  const cadastrarNovoUsuarioSistema = () => {
    if (!novoUserLogin || !novoUserSenha) return alert("Preencha login e senha.");
    const existe = usuariosAutorizados.find(u => u.usuario === novoUserLogin.toLowerCase());
    if (existe) return alert("Este usuário já existe.");

    const novo = { usuario: novoUserLogin.toLowerCase(), senha: novoUserSenha, origem: novoUserOrigem, funcao: novoUserFuncao };
    setUsuariosAutorizados([...usuariosAutorizados, novo]);
    setNovoUserLogin('');
    setNovoUserSenha('');
    alert("Usuário cadastrado com sucesso!");
    setSubAbaAdmin('lista'); 
  };

  const adminSalvarUsuario = () => {
    const novos = usuariosAutorizados.map(u => {
      if (u.usuario === usuarioEmEdicao) {
        return { usuario: editNome.toLowerCase(), senha: editSenha, origem: editOrigem };
      }
      return u;
    });
    setUsuariosAutorizados(novos);
    setUsuarioEmEdicao(null);
    alert("Dados do usuário atualizados!");
  };

  const adminExcluirUsuario = (user) => {
    if (user === 'admin') return alert("Não é possível remover o acesso do administrador.");
    if (!confirm(`Excluir login de ${user}?`)) return;
    setUsuariosAutorizados(usuariosAutorizados.filter(u => u.usuario !== user));
  };

  const alterarSenhaUsuario = () => {
    if (!novaSenhaInput) {
      alert("Digite a nova senha.");
      return;
    }
    const novosUsuarios = usuariosAutorizados.map(u => {
      if (u.usuario === usuarioInput.toLowerCase()) {
        return { ...u, senha: novaSenhaInput };
      }
      return u;
    });
    setUsuariosAutorizados(novosUsuarios);
    setNovaSenhaInput('');
    alert("Senha alterada com sucesso!");
  };

  const enviarMensagemChat = (e) => {
    e.preventDefault();
    if (!inputChat.trim()) return;
    const novaMensagemUsuario = { id: Date.now(), texto: inputChat, bot: false };
    setMensagens(prev => [...prev, novaMensagemUsuario]);
    setInputChat('');
    setTimeout(() => {
      setMensagens(prev => [...prev, { id: Date.now() + 1, texto: "Olá! Sou o Triger. Como posso ajudar?", bot: true }]);
    }, 800);
  };

  const fazerLogoff = () => {
    setEstaLogado(false);
    setActiveTab('home');
    setSubAbaAdmin('menu');
    setUsuarioInput('');
    setSenha('');
    setUsuarioLogadoOrigem('');
    setCpfDigitado('');
    setProdutoSelecionado(null);
    setMeusPedidosHistorico([]);
    setPedidosParaAprovar([]);
  };

  const handleLancarProduto = async () => {
    if(!prodNome || !prodPreco) return alert("Preencha o nome e o preço.");
    setCarregando(true);
    try {
      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_PRODUTOS}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            nome: prodNome.toUpperCase(),
            preco: prodPreco,
            site: prodSite,
            imagem: prodImagem
          }
        })
      });
      if (response.ok) {
        alert(`Produto ${prodNome} lançado no Airtable com sucesso!`);
        setProdNome('');
        setProdPreco('');
        setProdImagem('');
        await buscarDadosAirtable(); // Atualiza a lista vindo do banco
      }
    } catch (e) {
      alert("Erro ao lançar no Airtable.");
    }
    setCarregando(false);
  };

  const excluirProduto = async (id) => {
    if (!confirm("Excluir permanentemente do Airtable?")) return;
    try {
      await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_PRODUTOS}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
      });
      buscarDadosAirtable();
    } catch (e) {
      alert("Erro ao excluir.");
    }
  };

  // ==========================================================
  // REAJUSTE DA FUNÇÃO: ENVIAR PEDIDO PARA RELATÓRIO
  // ==========================================================
  const handleEnviarPedidoReal = async () => {
    if (!nomeEncontrado || !produtoSelecionado) return;
    
    const prod = produtosLancados.find(p => p.id === produtoSelecionado);
    if (!prod) return;

    setCarregando(true);
    try {
      const dataISO = new Date().toISOString().split('T')[0];

      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_PEDIDOS}`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${AIRTABLE_TOKEN}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          fields: {
            "solicitante": usuarioInput, // SALVA O LOGIN (lucas.vieira) PARA FILTRAGEM CORRETA
            "cpf": cpfDigitado.replace(/\D/g, ''),
            "produto": prod.nome,
            "valor": prod.preco.toString(),
            "site": siteFiltro,
            "data": dataISO,
            "status": "PENDENTE"
          }
        })
      });

      if (response.ok) {
        // NOTIFICAÇÃO WHATSAPP COM STATUS
        const textoWhats = `*NOVA SOLICITAÇÃO - TRIGOFY*%0A%0A*Solicitante:* ${nomeEncontrado}%0A*Produto:* ${prod.nome}%0A*Valor:* R$ ${prod.preco}%0A*Região:* ${siteFiltro}%0A*Status:* PENDENTE`;
        window.open(`https://wa.me/${TELEFONE_APROVADOR}?text=${textoWhats}`, '_blank');

        alert("✅ PEDIDO REGISTRADO NO RELATÓRIO COM SUCESSO!");
        setCpfDigitado('');
        setProdutoSelecionado(null);
        setActiveTab('home');
      } else {
        const erroLog = await response.json();
        alert("Erro no Airtable: " + (erroLog.error?.message || "Erro na tabela"));
      }
    } catch (e) {
      alert("Erro de conexão.");
    }
    setCarregando(false);
  };

  // ==========================================================
  // 5. TELA DE LOGIN
  // ==========================================================
  if (!estaLogado) {
    return (
      <div className="flex justify-center bg-zinc-200 min-h-screen sm:py-6 font-sans text-zinc-900">
        <div className="w-full max-w-[390px] bg-white h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[55px] border-[10px] border-zinc-900 p-8 justify-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black italic text-yellow-500 uppercase tracking-tighter">TRIGOFY</h1>
          </div>
          <form onSubmit={lidarComLogin} className="space-y-4">
            <input type="text" placeholder="Usuário" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none font-bold" value={usuarioInput} onChange={(e) => setUsuarioInput(e.target.value)} required />
            <input type="password" placeholder="Senha" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none font-bold" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            {erro && <p className="text-red-500 text-xs text-center font-bold">{erro}</p>}
            <button type="submit" className="w-full bg-zinc-900 text-yellow-400 py-4 rounded-2xl font-black uppercase shadow-lg active:scale-95 transition-all">ENTRAR</button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================================
  // 6. CONTEÚDO PRINCIPAL (RENDERIZAÇÃO DE ABAS)
  // ==========================================================
  const renderContent = () => {
    const dadosUserLogado = usuariosAutorizados.find(u => u.usuario === usuarioInput.toLowerCase());
    const isAdmin = dadosUserLogado?.funcao === 'ADMIN';
    const isAprovador = dadosUserLogado?.funcao === 'APROVADOR' || isAdmin;

    const bgCard = temaEscuro ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200';
    const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
    const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-500';

    switch (activeTab) {
      
      case 'home':
        return (
          <div className="space-y-4 animate-in fade-in duration-500 pb-10">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-3xl text-zinc-900 shadow-lg flex items-center gap-4 border border-yellow-300">
              <div className="bg-white p-2 rounded-2xl shadow-inner w-16 h-16 flex items-center justify-center overflow-hidden">
                <img src="/favicon.ico" alt="Logo" className="w-full h-full object-contain scale-125" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-zinc-900">Grupo Trigo</h2>
                <p className="text-yellow-900/80 text-sm font-medium italic">Olá, {usuarioInput}!</p>
              </div>
            </div>

            <h3 className={`font-extrabold text-lg px-2 mt-6 uppercase italic tracking-tighter ${textMain}`}>
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              {isAprovador && (
                <div onClick={() => setActiveTab('aprovacoes')} className="bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-800 flex items-center gap-4 cursor-pointer active:scale-95 transition-all">
                  <div className="bg-yellow-500 p-3 rounded-full text-zinc-900"><CheckCircle2 size={20} /></div>
                  <div className="flex-1 font-bold uppercase text-sm text-yellow-500 tracking-tighter">Painel de Aprovações</div>
                  <ChevronRight className="text-yellow-500" size={20} />
                </div>
              )}

              {isAdmin ? (
                <>
                  <div onClick={() => { setSubAbaAdmin('nuvem'); setActiveTab('admin-painel'); }} className={`${bgCard} p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer active:scale-95 transition-all`}>
                    <div className="bg-blue-500 p-3 rounded-full text-white"><Database size={20} /></div>
                    <div className={`flex-1 font-bold uppercase text-sm ${textMain}`}>Nuvem (Airtable)</div>
                    <ChevronRight className="text-zinc-300" size={20} />
                  </div>

                  <div onClick={() => { setSubAbaAdmin('cadastro'); setActiveTab('admin-painel'); }} className={`${bgCard} p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer active:scale-95 transition-all`}>
                    <div className="bg-green-500 p-3 rounded-full text-white"><UserPlus size={20} /></div>
                    <div className={`flex-1 font-bold uppercase text-sm ${textMain}`}>Cadastrar Novo Usuário</div>
                    <ChevronRight className="text-zinc-300" size={20} />
                  </div>

                  <div onClick={() => { setSubAbaAdmin('lista'); setActiveTab('admin-painel'); }} className={`${bgCard} p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer active:scale-95 transition-all`}>
                    <div className="bg-yellow-500 p-3 rounded-full text-white"><Users size={20} /></div>
                    <div className={`flex-1 font-bold uppercase text-sm ${textMain}`}>Lista de Usuários</div>
                    <ChevronRight className="text-zinc-300" size={20} />
                  </div>

                  <div onClick={() => { setSubAbaAdmin('produtos'); setActiveTab('admin-painel'); }} className={`${bgCard} p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer active:scale-95 transition-all`}>
                    <div className="bg-zinc-900 p-3 rounded-full text-yellow-400"><Package size={20} /></div>
                    <div className={`flex-1 font-bold uppercase text-sm ${textMain}`}>Lançar Produtos</div>
                    <ChevronRight className="text-zinc-300" size={20} />
                  </div>
                </>
              ) : (
                <>
                  <div onClick={() => setActiveTab('pedidos')} className={`${bgCard} p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer transition-all active:scale-95 group`}>
                    <div className="bg-yellow-400 p-3 rounded-full text-zinc-900"><ShoppingBag size={20} /></div>
                    <div className={`flex-1 font-bold uppercase text-sm ${textMain}`}>Meus Pedidos</div>
                    <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
                  </div>

                  <div onClick={() => setActiveTab('catalogo')} className={`${bgCard} p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer transition-all active:scale-95 group`}>
                    <div className="bg-yellow-400 p-2 rounded-full w-11 h-11 flex items-center justify-center overflow-hidden">
                      <img src="/doacao.png" alt="Doação" className="w-full h-full object-contain" />
                    </div>
                    <div className={`flex-1 font-bold uppercase text-sm ${textMain}`}>Solicitações de doações</div>
                    <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
                  </div>

                  <div 
                    onClick={() => {
                      if (usuarioLogadoOrigem === 'VR') {
                        alert("Acesso negado. Seu perfil de Volta Redonda não tem permissão para compras RIO/SP.");
                      } else {
                        setSiteFiltro('RIO/SP'); setActiveTab('novo');
                      }
                    }} 
                    className={`${bgCard} p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer transition-all active:scale-95 group ${usuarioLogadoOrigem === 'VR' ? 'opacity-30' : ''}`}
                  >
                    <div className="bg-yellow-400 p-2 rounded-full w-11 h-11 flex items-center justify-center overflow-hidden">
                      <img src="/cesta.png" alt="Cesta" className="w-full h-full object-contain" />
                    </div>
                    <div className={`flex-1 font-bold uppercase text-sm leading-tight ${textMain}`}>Produtos disponíveis para compra RIO/SP</div>
                    <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
                  </div>

                  <div 
                    onClick={() => {
                      if (usuarioLogadoOrigem === 'RIO' || usuarioLogadoOrigem === 'SP') {
                        alert("Acesso negado. Seu perfil de RIO/SP não tem permissão para compras de Volta Redonda.");
                      } else {
                        setSiteFiltro('VR'); setActiveTab('novo');
                      }
                    }} 
                    className={`${bgCard} p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer transition-all active:scale-95 group ${(usuarioLogadoOrigem === 'RIO' || usuarioLogadoOrigem === 'SP') ? 'opacity-30' : ''}`}
                  >
                    <div className="bg-yellow-400 p-2 rounded-full w-11 h-11 flex items-center justify-center overflow-hidden">
                      <img src="/pizza.png" alt="Novo" className="w-full h-full object-contain" />
                    </div>
                    <div className={`flex-1 font-bold uppercase text-sm ${textMain}`}>Produtos Disponíveis para compras Volta Redonda</div>
                    <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
                  </div>

                  <div onClick={() => setActiveTab('suporte')} className="bg-yellow-400 p-4 rounded-2xl shadow-md flex items-center gap-4 cursor-pointer active:scale-95 transition-all">
                    <div className="bg-zinc-900 p-3 rounded-full text-yellow-400"><Megaphone size={20} /></div>
                    <div className="flex-1 font-bold text-zinc-900 uppercase text-sm">Suporte</div>
                    <ChevronRight className="text-zinc-800" size={20} />
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'aprovacoes':
        return (
          <div className="animate-in slide-in-from-right duration-300 pb-20">
            <h2 className={`text-xl font-black uppercase italic mb-4 ${textMain}`}>Aprovar Pedidos</h2>
            {carregando ? (
              <p className="text-center font-bold text-xs animate-pulse">Buscando pedidos pendentes...</p>
            ) : pedidosParaAprovar.length > 0 ? (
              <div className="space-y-3">
                {pedidosParaAprovar.map(p => (
                  <div key={p.id} className={`${bgCard} p-4 rounded-2xl border shadow-sm space-y-3`}>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Solicitante: {p.solicitante}</p>
                      <p className={`font-black text-sm uppercase ${textMain}`}>{p.produto}</p>
                      <p className="text-xs font-bold text-yellow-600">R$ {p.valor} | {p.site}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => atualizarStatusPedido(p.id, 'APROVADO')} className="flex-1 bg-green-500 text-white py-2 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-1 active:scale-95 transition-all">
                        <Check size={14}/> Aprovar
                      </button>
                      <button onClick={() => atualizarStatusPedido(p.id, 'REPROVADO')} className="flex-1 bg-red-500 text-white py-2 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-1 active:scale-95 transition-all">
                        <X size={14}/> Reprovar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`${bgCard} p-8 rounded-3xl border shadow-sm text-center`}>
                <p className={`font-bold text-sm ${textSub}`}>Nenhum pedido pendente para aprovação.</p>
              </div>
            )}
          </div>
        );

      case 'novo':
        return (
          <div className="animate-in slide-in-from-right duration-300 pb-20">
            <button onClick={() => { setActiveTab('home'); setSiteFiltro(''); setCpfDigitado(''); setProdutoSelecionado(null); }} className={`${textSub} font-bold text-xs uppercase mb-2`}>← Voltar</button>
            <div className={`${bgCard} p-6 rounded-3xl shadow-sm border space-y-5`}>
              <h2 className={`text-lg font-bold uppercase italic border-b pb-2 ${textMain}`}>
                {siteFiltro === 'RIO/SP' ? 'Compras RIO/SP' : 'Compras Volta Redonda'}
              </h2>

              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase">Digite o CPF</label>
                <input type="text" placeholder="Apenas números" maxLength={11} className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={cpfDigitado} onChange={(e) => setCpfDigitado(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase">Nome do Solicitante</label>
                <input type="text" readOnly className={`w-full p-4 border rounded-2xl font-bold ${temaEscuro ? 'bg-zinc-900 text-zinc-400 border-zinc-700' : 'bg-zinc-100 text-zinc-800'}`} value={nomeEncontrado || "Aguardando CPF..."} />
              </div>

              <div className="animate-in fade-in duration-500 space-y-3 border-t pt-4">
                <label className="text-[10px] font-black text-zinc-400 uppercase italic">Selecione o Produto:</label>
                <div className="grid grid-cols-1 gap-2">
                  {produtosLancados.filter(p => p.site === siteFiltro).length > 0 ? (
                      produtosLancados.filter(p => p.site === siteFiltro).map(p => (
                          <div 
                              key={p.id} 
                              onClick={() => setProdutoSelecionado(p.id)}
                              className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${produtoSelecionado === p.id ? 'border-yellow-500 bg-yellow-50' : 'border-zinc-100'}`}
                          >
                              <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden flex items-center justify-center border">
                                  {p.imagem ? <img src={p.imagem} className="w-full h-full object-cover"/> : <Package size={20} className="text-zinc-300"/>}
                              </div>
                              <div className="flex-1">
                                  <p className="text-xs font-black uppercase tracking-tight">{p.nome}</p>
                                  <p className="text-[10px] font-bold text-yellow-600 italic">R$ {p.preco}</p>
                              </div>
                              {produtoSelecionado === p.id && <CheckCircle2 className="text-yellow-500" size={18}/>}
                          </div>
                      ))
                  ) : (
                      <p className="text-center text-[10px] text-zinc-400 font-bold uppercase italic p-4 border rounded-2xl border-dashed">Nenhum produto disponível nesta região</p>
                  )}
                </div>
              </div>

              <button 
                disabled={!nomeEncontrado || !produtoSelecionado || carregando} 
                onClick={handleEnviarPedidoReal}
                className={`w-full py-4 rounded-2xl font-black uppercase shadow-lg transition-all ${nomeEncontrado && produtoSelecionado ? 'bg-zinc-900 text-yellow-400 active:scale-95' : 'bg-zinc-200 text-zinc-400'}`}
              >
                {carregando ? "ENVIANDO..." : "ENVIAR PEDIDO"}
              </button>
            </div>
          </div>
        );

      case 'pedidos':
        return (
          <div className="animate-in slide-in-from-right duration-300 pb-20">
            <h2 className={`text-xl font-black uppercase italic mb-4 ${textMain}`}>Meus Pedidos</h2>
            {carregando ? (
              <p className="text-center font-bold text-xs animate-pulse">Carregando histórico...</p>
            ) : meusPedidosHistorico.length > 0 ? (
              <div className="space-y-3">
                {meusPedidosHistorico.map(p => (
                  <div key={p.id} className={`${bgCard} p-4 rounded-2xl border shadow-sm flex flex-col gap-1`}>
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                        p.status === 'APROVADO' ? 'bg-green-100 text-green-700' : 
                        p.status === 'REPROVADO' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {p.status}
                      </span>
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Clock size={10}/>
                        <span className="text-[10px] font-bold">{p.data}</span>
                      </div>
                    </div>
                    <p className={`font-black text-sm uppercase ${textMain}`}>{p.produto}</p>
                    <p className="text-xs font-bold text-zinc-400">VALOR: R$ {p.valor}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`${bgCard} p-8 rounded-3xl border shadow-sm text-center space-y-3`}>
                <ShoppingBag className="mx-auto text-zinc-200" size={48} />
                <p className={`font-bold text-sm ${textSub}`}>Você ainda não possui pedidos realizados.</p>
              </div>
            )}
          </div>
        );

      case 'catalogo':
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <h2 className={`text-xl font-black uppercase italic mb-4 ${textMain}`}>Doações</h2>
            <div className={`${bgCard} p-8 rounded-3xl border shadow-sm text-center space-y-3`}>
              <BookOpen className="mx-auto text-zinc-200" size={48} />
              <p className={`font-bold text-sm ${textSub}`}>Catálogo de doações indisponível no momento.</p>
            </div>
          </div>
        );

      case 'suporte':
        return (
          <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
            <div className="flex-1 space-y-4 mb-4">
              {mensagens.map(m => (
                <div key={m.id} className={`flex ${m.bot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl font-medium text-sm shadow-sm ${m.bot ? (temaEscuro ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-800') : 'bg-yellow-400 text-zinc-900'}`}>
                    {m.texto}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={enviarMensagemChat} className="flex gap-2 mb-20">
              <input type="text" placeholder="Como podemos ajudar?" className={`flex-1 p-4 rounded-2xl outline-none border shadow-sm ${temaEscuro ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white'}`} value={inputChat} onChange={(e) => setInputChat(e.target.value)} />
              <button type="submit" className="bg-zinc-900 text-yellow-400 p-4 rounded-2xl shadow-lg active:scale-95 transition-all"><Send size={20}/></button>
            </form>
          </div>
        );

      case 'config':
        return (
          <div className="animate-in slide-in-from-bottom duration-300 space-y-4">
            <h2 className={`text-xl font-black uppercase italic ${textMain}`}>Configurações</h2>
            <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-6`}>
              <div className="flex items-center gap-4 border-b pb-4 border-zinc-100 dark:border-zinc-700">
                <div className="bg-yellow-400 p-3 rounded-full"><User className="text-zinc-900" size={24}/></div>
                <div>
                  <p className={`font-black uppercase text-sm ${textMain}`}>{usuarioInput}</p>
                  <p className="text-[10px] text-zinc-400 uppercase">Usuário Ativo</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase">Alterar Minha Senha</label>
                <div className="flex gap-2">
                  <input type="password" placeholder="Nova senha" className={`flex-1 p-3 rounded-xl border text-sm outline-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={novaSenhaInput} onChange={(e) => setNovaSenhaInput(e.target.value)} />
                  <button onClick={alterarSenhaUsuario} className="bg-zinc-900 text-yellow-400 px-4 rounded-xl font-bold text-xs uppercase">Salvar</button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {temaEscuro ? <Moon className="text-yellow-400" size={20}/> : <Sun className="text-yellow-500" size={20}/>}
                  <span className={`font-bold text-sm ${textMain}`}>Tema do Aplicativo</span>
                </div>
                <button onClick={() => setTemaEscuro(!temaEscuro)} className={`w-12 h-6 rounded-full relative transition-colors ${temaEscuro ? 'bg-yellow-400' : 'bg-zinc-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${temaEscuro ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <button onClick={fazerLogoff} className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors">
                <LogOut size={18}/> SAIR DA CONTA
              </button>
            </div>
          </div>
        );

      case 'admin-painel':
        return (
          <div className="animate-in slide-in-from-right duration-300 space-y-6 pb-20">
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase`}>← Voltar</button>
            </div>

            {subAbaAdmin === 'nuvem' && (
              <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-4 animate-in fade-in`}>
                <h2 className={`text-lg font-bold uppercase italic border-b pb-2 ${textMain}`}>Nuvem (Airtable)</h2>
                <input type="text" placeholder="CPF" className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={novoCpf} onChange={(e) => setNovoCpf(e.target.value)} />
                <input type="text" placeholder="Nome Completo" className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
                <button onClick={salvarNoAirtable} className="w-full bg-yellow-400 text-zinc-900 py-3 rounded-2xl font-black uppercase shadow-md active:scale-95 transition-all">
                  {carregando ? "Salvando..." : "Salvar no Airtable"}
                </button>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pt-4">
                  {pessoasCadastradas.map(p => (
                    <div key={p.id} className={`flex justify-between items-center p-3 rounded-xl border ${temaEscuro ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50'}`}>
                      <div>
                        <p className={`font-bold text-xs ${textMain}`}>{p.nome}</p>
                        <p className="text-[10px] text-zinc-400">{p.cpf}</p>
                      </div>
                      <button onClick={() => excluirDoAirtable(p.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subAbaAdmin === 'cadastro' && (
              <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-4 animate-in fade-in`}>
                <h2 className={`text-lg font-bold uppercase italic border-b pb-2 ${textMain}`}>Novo Usuário do App</h2>
                <input type="text" placeholder="Nome de Usuário" className={`w-full p-4 rounded-2xl border outline-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={novoUserLogin} onChange={(e) => setNovoUserLogin(e.target.value)} />
                <input type="text" placeholder="Senha de Acesso" className={`w-full p-4 rounded-2xl border outline-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={novoUserSenha} onChange={(e) => setNovoUserSenha(e.target.value)} />
                <select className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={novoUserOrigem} onChange={(e) => setNovoUserOrigem(e.target.value)}>
                  <option value="VR">Volta Redonda (VR)</option>
                  <option value="RIO">Rio de Janeiro (RIO)</option>
                  <option value="SP">São Paulo (SP)</option>
                  <option value="ALL">Administrador (ALL)</option>
                </select>
                <select className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={novoUserFuncao} onChange={(e) => setNovoUserFuncao(e.target.value)}>
                  <option value="USER">USUÁRIO COMUM</option>
                  <option value="APROVADOR">APROVADOR</option>
                  <option value="ADMIN">ADMINISTRADOR TOTAL</option>
                </select>
                <button onClick={cadastrarNovoUsuarioSistema} className="w-full bg-zinc-900 text-yellow-400 py-3 rounded-2xl font-black uppercase shadow-md active:scale-95 transition-all">CADASTRAR ACESSO</button>
              </div>
            )}

            {subAbaAdmin === 'lista' && (
              <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-4 animate-in fade-in`}>
                <h2 className={`text-lg font-bold uppercase italic border-b pb-2 ${textMain}`}>Usuários Ativos</h2>
                <div className="space-y-2">
                  {usuariosAutorizados.map(u => (
                    <div key={u.usuario} className={`flex justify-between items-center p-4 rounded-2xl border ${temaEscuro ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                      <div>
                        <p className={`font-black uppercase text-xs ${textMain}`}>{u.usuario}</p>
                        <p className="text-[9px] text-zinc-400 uppercase font-bold">Função: {u.funcao} | Origem: {u.origem}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => adminExcluirUsuario(u.usuario)} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subAbaAdmin === 'produtos' && (
              <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-4 animate-in fade-in`}>
                <h2 className={`text-lg font-bold uppercase italic border-b pb-2 ${textMain}`}>Lançar Produtos (Airtable)</h2>
                <div className="space-y-4">
                   <input type="text" placeholder="Nome do Produto" className={`w-full p-4 rounded-2xl border outline-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={prodNome} onChange={(e) => setProdNome(e.target.value)} />
                   <input type="text" placeholder="Preço (Ex: 25.00)" className={`w-full p-4 rounded-2xl border outline-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={prodPreco} onChange={(e) => setProdPreco(e.target.value)} />
                   <select className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={prodSite} onChange={(e) => setProdSite(e.target.value)}>
                    <option value="VR">Volta Redonda (VR)</option>
                    <option value="RIO/SP">Rio de Janeiro / São Paulo</option>
                  </select>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-400 uppercase px-1">URL da Imagem do Produto</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="http://..." className={`flex-1 p-4 rounded-2xl border outline-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={prodImagem} onChange={(e) => setProdImagem(e.target.value)} />
                      <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center border overflow-hidden">
                        {prodImagem ? <img src={prodImagem} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="text-zinc-300" size={24} />}
                      </div>
                    </div>
                  </div>
                  <button onClick={handleLancarProduto} className="w-full bg-zinc-900 text-yellow-400 py-3 rounded-2xl font-black uppercase shadow-md active:scale-95 transition-all">
                    {carregando ? "Lançando..." : "LANÇAR NO AIRTABLE"}
                  </button>
                  
                  <div className="pt-4 border-t space-y-2 max-h-[200px] overflow-y-auto">
                    <p className="text-[10px] font-black text-zinc-400 uppercase italic">Produtos em Estoque:</p>
                    {produtosLancados.map(p => (
                        <div key={p.id} className="flex justify-between items-center p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center overflow-hidden">
                                    {p.imagem ? <img src={p.imagem} className="w-full h-full object-cover"/> : <Package size={14}/>}
                                </div>
                                <span className="text-[10px] font-bold uppercase">{p.nome} ({p.site})</span>
                            </div>
                            <button onClick={() => excluirProduto(p.id)} className="text-red-400 p-1"><Trash2 size={14}/></button>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex justify-center min-h-screen font-sans transition-colors duration-300 ${temaEscuro ? 'bg-zinc-950 text-white' : 'bg-zinc-200 text-zinc-900'}`}>
      <div className={`w-full max-w-[390px] h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[55px] border-[10px] border-zinc-900 transition-colors ${temaEscuro ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
        <header className={`p-6 flex justify-between items-center border-b transition-colors ${temaEscuro ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <h1 className="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter">TRIGOFY</h1>
          <button onClick={fazerLogoff} className="text-zinc-400 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-5 pb-32">
          {renderContent()}
        </main>

        <nav className={`absolute bottom-8 left-4 right-4 px-4 py-3 flex justify-between rounded-full shadow-2xl border transition-colors ${temaEscuro ? 'bg-zinc-800/90 border-zinc-700 backdrop-blur-md' : 'bg-white/95 border-zinc-200 backdrop-blur-sm'}`}>
          <button onClick={() => { setActiveTab('home'); setSiteFiltro(''); setCpfDigitado(''); setSubAbaAdmin('menu'); }} className={activeTab === 'home' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}><LayoutGrid size={22} /></button>
          <button onClick={() => setActiveTab('pedidos')} className={activeTab === 'pedidos' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}><ShoppingBag size={22} /></button>
          <button onClick={() => setActiveTab('catalogo')} className={activeTab === 'catalogo' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}><BookOpen size={22} /></button>
          <button onClick={() => setActiveTab('config')} className={activeTab === 'config' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}><Settings size={22} /></button>
        </nav>
      </div>
    </div>
  );
}