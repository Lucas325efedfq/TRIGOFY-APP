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

const TABLE_ID = 'tblpfxnome'; // Tabela de Pessoas
const TABLE_ID_PRODUTOS = 'tblProdutos'; // Nova tabela integrada
const TABLE_ID_PEDIDOS = 'tblPedidos'; // Tabela de Relatórios
const TABLE_ID_USUARIOS = 'tblUsuarios'; // Tabela de Usuários

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

  // SISTEMA DE NOTIFICAÇÃO (TOAST)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // NOVO: Estados para a aba de Doações
  const [areaSolicitante, setAreaSolicitante] = useState('');
  const [motivoDoacao, setMotivoDoacao] = useState('');
  const [areaProdutoDoado, setAreaProdutoDoado] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [origemProduto, setOrigemProduto] = useState('');

  // NOVO: Estado para Telefone na compra
  const [telefone, setTelefone] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // Estados para o Chat do Triger
  const [mensagens, setMensagens] = useState([
    { id: 1, texto: "Olá! Eu sou o Triger, seu suporte inteligente. Como posso te ajudar hoje?", bot: true }
  ]);
  const [inputChat, setInputChat] = useState('');

  // ==========================================================
  // 2. CADASTRO DE USUÁRIOS E PRODUTOS (SINCRONIZADO COM AIRTABLE)
  // ==========================================================
  const [usuariosAutorizados, setUsuariosAutorizados] = useState([
    { usuario: 'admin', senha: 'T!$&gur001', origem: 'ALL', funcao: 'ADMIN' },
  ]);

  const [produtosLancados, setProdutosLancados] = useState([]);

  const [novaSenhaInput, setNovaSenhaInput] = useState('');

  // Controle de sub-telas do Admin
  const [subAbaAdmin, setSubAbaAdmin] = useState('menu');

  // Estados para Cadastro de Novo Usuário (Admin)
  const [novoUserLogin, setNovoUserLogin] = useState('');
  const [novoUserSenha, setNovoUserSenha] = useState('');
  const [novoUserOrigem, setNovoUserOrigem] = useState('VR');
  const [novoUserFuncao, setNovoUserFuncao] = useState('USER');

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
  const [prodVencimento, setProdVencimento] = useState('');

  // Estados de Compra do Usuário
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);

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
          usuarioAirtable: reg.fields.usuario || '',
          site: (reg.fields.site || '').toUpperCase(),
          area: reg.fields.area || '' // Carrega a área
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
          imagem: reg.fields.imagem || '',
          vencimento: reg.fields.vencimento || ''
        })));
      }

      // BUSCA USUÁRIOS NA TABELA tblUsuarios
      const resUsers = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_USUARIOS}`, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
      });
      const dataUsers = await resUsers.json();
      if (dataUsers.records) {
        const usersCarregados = dataUsers.records.map(reg => ({
          id: reg.id,
          usuario: reg.fields.usuario || '',
          senha: reg.fields.senha || '',
          origem: reg.fields.origem || 'VR',
          funcao: reg.fields.funcao || 'USER'
        }));
        // Junta o admin master fixo com os do banco
        setUsuariosAutorizados([
          { usuario: 'admin', senha: 'T!$&gur001', origem: 'ALL', funcao: 'ADMIN' },
          ...usersCarregados
        ]);
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
        showToast(`Pedido ${novoStatus} com sucesso!`, 'success');
        buscarPedidosPendentes();
      }
    } catch (e) { showToast("Erro ao atualizar status.", "error"); }
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

  // Estados para Cadastro na Nuvem
  const [novoCpf, setNovoCpf] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novaArea, setNovaArea] = useState('');

  const salvarNoAirtable = async () => {
    if (!novoCpf || !novoNome || !novaArea) {
      showToast("Por favor, preencha CPF, Nome e Área.", "error");
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
            nome: novoNome.toUpperCase().trim(),
            area: novaArea.toUpperCase().trim()
          }
        })
      });
      if (response.ok) {
        setNovoCpf('');
        setNovoNome('');
        setNovaArea('');
        await buscarDadosAirtable();
        showToast("✅ Cadastrado com sucesso!", "success");
      }
    } catch (e) {
      showToast("Erro ao salvar.", "error");
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
      showToast("Removido com sucesso!", "success");
      buscarDadosAirtable();
    } catch (e) {
      showToast("Erro ao excluir.", "error");
    }
  };

  // ==========================================================
  // 4. LÓGICA DE FORMULÁRIOS, LOGIN E CHAT
  // ==========================================================
  const [cpfDigitado, setCpfDigitado] = useState('');
  const [nomeEncontrado, setNomeEncontrado] = useState('');
  
  // *** NOVO: Estado para armazenar a área encontrada ***
  const [areaEncontrada, setAreaEncontrada] = useState('');

  useEffect(() => {
    const pessoa = pessoasCadastradas.find(p => p.cpf === cpfDigitado.replace(/\D/g, ''));
    if (pessoa) {
      setNomeEncontrado(pessoa.nome);
      setSiteUsuarioIdentificado(pessoa.site);
      // *** Puxa a área do cadastro ***
      setAreaEncontrada(pessoa.area || ''); 
    } else {
      setNomeEncontrado('');
      setSiteUsuarioIdentificado('');
      setAreaEncontrada('');
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
      showToast(`Bem-vindo, ${usuarioInput}!`, "success");
    } else {
      setErro('Usuário ou senha incorretos.');
      showToast("Usuário ou senha incorretos.", "error");
    }
  };

  const cadastrarNovoUsuarioSistema = async () => {
    if (!novoUserLogin || !novoUserSenha) return showToast("Preencha login e senha.", "error");
    const existe = usuariosAutorizados.find(u => u.usuario === novoUserLogin.toLowerCase());
    if (existe) return showToast("Este usuário já existe.", "error");

    setCarregando(true);
    try {
      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_USUARIOS}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            usuario: novoUserLogin.toLowerCase(),
            senha: novoUserSenha,
            origem: novoUserOrigem,
            funcao: novoUserFuncao
          }
        })
      });

      if (response.ok) {
        showToast("Usuário cadastrado com sucesso!", "success");
        setNovoUserLogin('');
        setNovoUserSenha('');
        await buscarDadosAirtable();
        setSubAbaAdmin('lista');
      }
    } catch (e) {
      showToast("Erro ao salvar usuário.", "error");
    }
    setCarregando(false);
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
    showToast("Dados do usuário atualizados!", "success");
  };

  const adminExcluirUsuario = async (user) => {
    if (user === 'admin') return showToast("Não é possível remover o administrador.", "error");
    if (!confirm(`Excluir login de ${user}?`)) return;

    const uNoBanco = usuariosAutorizados.find(u => u.usuario === user);
    if (uNoBanco && uNoBanco.id) {
      try {
        await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_USUARIOS}/${uNoBanco.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
        });
        showToast("Usuário excluído!", "success");
        buscarDadosAirtable();
      } catch (e) {
        showToast("Erro ao excluir do Airtable.", "error");
      }
    } else {
      setUsuariosAutorizados(usuariosAutorizados.filter(u => u.usuario !== user));
      showToast("Removido da lista temporária.", "success");
    }
  };

  const alterarSenhaUsuario = () => {
    if (!novaSenhaInput) {
      showToast("Digite a nova senha.", "error");
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
    showToast("Senha alterada com sucesso!", "success");
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
    setProdutosSelecionados([]);
    setMeusPedidosHistorico([]);
    setPedidosParaAprovar([]);
    setAreaSolicitante('');
    setMotivoDoacao('');
    setAreaProdutoDoado('');
    setDataVencimento('');
    setOrigemProduto('');
    setTelefone('');
    setAreaEncontrada('');
    showToast("Logout realizado.", "success");
  };

  const handleLancarProduto = async () => {
    if (!prodNome || !prodPreco || !prodVencimento) return showToast("Preencha nome, preço e data de vencimento.", "error");

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
            imagem: prodImagem,
            vencimento: prodVencimento
          }
        })
      });
      if (response.ok) {
        showToast(`Produto ${prodNome} lançado com sucesso!`, "success");
        setProdNome('');
        setProdPreco('');
        setProdImagem('');
        setProdVencimento('');
        await buscarDadosAirtable();
      }
    } catch (e) {
      showToast("Erro ao lançar no Airtable.", "error");
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
      showToast("Produto excluído!", "success");
      buscarDadosAirtable();
    } catch (e) {
      showToast("Erro ao excluir.", "error");
    }
  };

  const toggleProduto = (id) => {
    if (produtosSelecionados.includes(id)) {
      setProdutosSelecionados(prev => prev.filter(pid => pid !== id));
    } else {
      if (produtosSelecionados.length < 5) {
        setProdutosSelecionados(prev => [...prev, id]);
      } else {
        showToast("Máximo de 5 produtos por compra!", "error");
      }
    }
  };

  const handleEnviarPedidoReal = async () => {
    if (!nomeEncontrado || produtosSelecionados.length === 0) return;

    setCarregando(true);
    try {
      const dataISO = new Date().toISOString().split('T')[0];

      const promises = produtosSelecionados.map(async (prodId) => {
        const prod = produtosLancados.find(p => p.id === prodId);
        if (!prod) return null;

        return fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_PEDIDOS}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${AIRTABLE_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              "solicitante": usuarioInput,
              "cpf": cpfDigitado.replace(/\D/g, ''),
              "produto": prod.nome,
              "valor": prod.preco.toString(),
              "site": siteFiltro,
              "data": dataISO,
              "status": "PENDENTE",
              "telefone": telefone
            }
          })
        });
      });

      const responses = await Promise.all(promises);
      const allOk = responses.every(r => r && r.ok);

      if (allOk) {
        showToast("✅ PEDIDOS REGISTRADOS COM SUCESSO!", "success");
        setCpfDigitado('');
        setProdutosSelecionados([]);
        setTelefone('');
        setActiveTab('home');
      } else {
        showToast("Erro ao registrar um ou mais produtos.", "error");
      }
    } catch (e) {
      showToast("Erro de conexão.", "error");
    }
    setCarregando(false);
  };

  // ==========================================================
  // 5. TELA DE LOGIN (RESPONSIVA)
  // ==========================================================
  if (!estaLogado) {
    return (
      <div className="flex justify-center items-center bg-zinc-200 min-h-screen font-sans text-zinc-900">
        <div className="w-full h-full md:h-auto md:min-h-[600px] md:max-w-[600px] lg:max-w-[900px] bg-white shadow-2xl overflow-hidden flex flex-col relative md:rounded-[40px] lg:rounded-[30px] border-0 md:border-[10px] lg:border-[12px] border-zinc-900 p-8 justify-center">
          {toast.show && (
            <div className={`absolute top-10 left-6 right-6 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 z-50 border ${toast.type === 'success' ? 'bg-zinc-900 border-yellow-500 text-yellow-500' : 'bg-red-500 border-red-400 text-white'}`}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-black text-[11px] uppercase tracking-tighter flex-1">{toast.message}</span>
            </div>
          )}

          <div className="max-w-md w-full mx-auto">
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
            <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4">
              {isAprovador && (
                <div onClick={() => setActiveTab('aprovacoes')} className="bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-800 flex items-center gap-4 cursor-pointer active:scale-95 transition-all">
                  <div className="bg-yellow-50 p-3 rounded-full text-zinc-900"><CheckCircle2 size={20} /></div>
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
                        showToast("Acesso negado para RIO/SP.", "error");
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
                        showToast("Acesso negado para Volta Redonda.", "error");
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
            <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase mb-2`}>← Voltar</button>
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
                        <Check size={14} /> Aprovar
                      </button>
                      <button onClick={() => atualizarStatusPedido(p.id, 'REPROVADO')} className="flex-1 bg-red-500 text-white py-2 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-1 active:scale-95 transition-all">
                        <X size={14} /> Reprovar
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
            <button onClick={() => { setActiveTab('home'); setSiteFiltro(''); setCpfDigitado(''); setTelefone(''); setProdutosSelecionados([]); setAreaEncontrada(''); }} className={`${textSub} font-bold text-xs uppercase mb-2`}>← Voltar</button>
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

              {/* *** NOVO CAMPO DE ÁREA VISUAL (READ-ONLY) *** */}
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase">Área / Setor</label>
                <input type="text" readOnly className={`w-full p-4 border rounded-2xl font-bold ${temaEscuro ? 'bg-zinc-900 text-zinc-400 border-zinc-700' : 'bg-zinc-100 text-zinc-800'}`} value={areaEncontrada || "---"} />
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase">Seu Telefone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="(XX) 9XXXX-XXXX"
                  className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`}
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>

              <div className="animate-in fade-in duration-500 space-y-3 border-t pt-4">
                <label className="text-[10px] font-black text-zinc-400 uppercase italic">
                  Selecione os Produtos (Máx: 5):
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {produtosLancados.filter(p => p.site === siteFiltro).length > 0 ? (
                    produtosLancados.filter(p => p.site === siteFiltro).map(p => {
                      const isSelected = produtosSelecionados.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleProduto(p.id)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'border-yellow-500 bg-yellow-50' : 'border-zinc-100'}`}
                        >
                          <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden flex items-center justify-center border">
                            {p.imagem ? <img src={p.imagem} className="w-full h-full object-cover" /> : <Package size={20} className="text-zinc-300" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-black uppercase tracking-tight">{p.nome}</p>
                            <p className="text-[10px] font-bold text-yellow-600 italic">R$ {p.preco}</p>
                            <p className="text-[10px] font-bold text-zinc-400">Venc: {p.vencimento ? p.vencimento.split('-').reverse().join('/') : 'N/A'}</p>
                          </div>
                          {isSelected && <CheckCircle2 className="text-yellow-500" size={18} />}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-[10px] text-zinc-400 font-bold uppercase italic p-4 border rounded-2xl border-dashed">Nenhum produto disponível nesta região</p>
                  )}
                </div>
              </div>

              <button
                disabled={!nomeEncontrado || produtosSelecionados.length === 0 || carregando || !telefone}
                onClick={handleEnviarPedidoReal}
                className={`w-full py-4 rounded-2xl font-black uppercase shadow-lg transition-all ${nomeEncontrado && produtosSelecionados.length > 0 && telefone ? 'bg-zinc-900 text-yellow-400 active:scale-95' : 'bg-zinc-200 text-zinc-400'}`}
              >
                {carregando ? "ENVIANDO..." : `ENVIAR PEDIDO (${produtosSelecionados.length})`}
              </button>
            </div>
          </div>
        );

      case 'pedidos':
        return (
          <div className="animate-in slide-in-from-right duration-300 pb-20">
            <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase mb-2`}>← Voltar</button>
            <h2 className={`text-xl font-black uppercase italic mb-4 ${textMain}`}>Meus Pedidos</h2>
            {carregando ? (
              <p className="text-center font-bold text-xs animate-pulse">Carregando histórico...</p>
            ) : meusPedidosHistorico.length > 0 ? (
              <div className="space-y-3">
                {meusPedidosHistorico.map(p => (
                  <div key={p.id} className={`${bgCard} p-4 rounded-2xl border shadow-sm flex flex-col gap-1`}>
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${p.status === 'APROVADO' ? 'bg-green-100 text-green-700' :
                          p.status === 'REPROVADO' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                        {p.status}
                      </span>
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Clock size={10} />
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
        const nomeCompletoUsuarioLogado = pessoasCadastradas.find(p =>
          p.usuarioAirtable === usuarioInput.toLowerCase()
        )?.nome || usuarioInput.toUpperCase();

        return (
          <div className="animate-in slide-in-from-right duration-300 pb-20">
            <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase mb-2`}>← Voltar</button>
            <h2 className={`text-xl font-black uppercase italic mb-4 ${textMain}`}>Doações</h2>

            <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-4`}>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Nome do Solicitante</label>
                <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex items-center gap-3">
                  <div className="bg-yellow-400 p-2 rounded-xl text-zinc-900"><User size={20} /></div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-zinc-900 uppercase">
                      {nomeCompletoUsuarioLogado}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Qual a sua Área?</label>
                <input
                  type="text"
                  placeholder="Digite sua área/setor"
                  className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}
                  value={areaSolicitante}
                  onChange={(e) => setAreaSolicitante(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Motivo da Doação</label>
                <textarea
                  placeholder="Descreva o motivo da sua solicitação..."
                  rows={3}
                  className={`w-full p-4 rounded-2xl border outline-none font-bold resize-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}
                  value={motivoDoacao}
                  onChange={(e) => setMotivoDoacao(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Área do produto a ser doado</label>
                <input
                  type="text"
                  placeholder="Ex: Cozinha, TI, Logística..."
                  className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}
                  value={areaProdutoDoado}
                  onChange={(e) => setAreaProdutoDoado(e.target.value)}
                />
              </div>

              {/* NOVO CAMPO: Data de Vencimento do Produto */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Data de Vencimento do Produto</label>
                <input
                  type="date"
                  className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}
                  value={dataVencimento}
                  onChange={(e) => setDataVencimento(e.target.value)}
                />
              </div>

              {/* NOVO CAMPO: Origem do Produto */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Origem do Produto</label>
                <input
                  type="text"
                  placeholder="De onde vem o produto?"
                  className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}
                  value={origemProduto}
                  onChange={(e) => setOrigemProduto(e.target.value)}
                />
              </div>

              <div className="text-center py-6 space-y-3 border-t border-dashed">
                <BookOpen className="mx-auto text-zinc-200" size={48} />
                <p className={`font-bold text-sm ${textSub}`}>O catálogo de doações está sendo preparado para você.</p>
              </div>
            </div>
          </div>
        );

      case 'suporte':
        return (
          <div className="flex flex-col h-full animate-in slide-in-from-right duration-300 pb-20">
            <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase mb-4`}>← Voltar</button>
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
              <button type="submit" className="bg-zinc-900 text-yellow-400 p-4 rounded-2xl shadow-lg active:scale-95 transition-all"><Send size={20} /></button>
            </form>
          </div>
        );

      case 'config':
        return (
          <div className="animate-in slide-in-from-bottom duration-300 space-y-4 pb-20">
            <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase mb-2`}>← Voltar</button>
            <h2 className={`text-xl font-black uppercase italic ${textMain}`}>Configurações</h2>
            <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-6`}>
              <div className="flex items-center gap-4 border-b pb-4 border-zinc-100 dark:border-zinc-700">
                <div className="bg-yellow-400 p-3 rounded-full"><User className="text-zinc-900" size={24} /></div>
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
                  {temaEscuro ? <Moon className="text-yellow-400" size={20} /> : <Sun className="text-yellow-500" size={20} />}
                  <span className={`font-bold text-sm ${textMain}`}>Tema do Aplicativo</span>
                </div>
                <button onClick={() => setTemaEscuro(!temaEscuro)} className={`w-12 h-6 rounded-full relative transition-colors ${temaEscuro ? 'bg-yellow-400' : 'bg-zinc-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${temaEscuro ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <button onClick={fazerLogoff} className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors">
                <LogOut size={18} /> SAIR DA CONTA
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

                {/* *** ATUALIZADO: CAMPO PARA ÁREA/SETOR *** */}
                <input type="text" placeholder="Área / Setor" className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`} value={novaArea} onChange={(e) => setNovaArea(e.target.value)} />

                <button onClick={salvarNoAirtable} className="w-full bg-yellow-400 text-zinc-900 py-3 rounded-2xl font-black uppercase shadow-md active:scale-95 transition-all">
                  {carregando ? "Salvando..." : "Salvar no Airtable"}
                </button>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pt-4">
                  {pessoasCadastradas.map(p => (
                    <div key={p.id} className={`flex justify-between items-center p-3 rounded-xl border ${temaEscuro ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50'}`}>
                      <div>
                        <p className={`font-bold text-xs ${textMain}`}>{p.nome}</p>
                        {/* *** ATUALIZADO: MOSTRA A ÁREA NA LISTA *** */}
                        <p className="text-[10px] text-zinc-400">{p.cpf} {p.area ? `| ${p.area}` : ''}</p>
                      </div>
                      <button onClick={() => excluirDoAirtable(p.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
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
                        <button onClick={() => adminExcluirUsuario(u.usuario)} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={16} /></button>
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
                    <label className="text-[10px] font-black text-zinc-400 uppercase px-1">Data de Vencimento (Obrigatório)</label>
                    <input
                      type="date"
                      className={`w-full p-4 rounded-2xl border outline-none font-bold ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50 font-bold'}`}
                      value={prodVencimento}
                      onChange={(e) => setProdVencimento(e.target.value)}
                    />
                  </div>

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
                            {p.imagem ? <img src={p.imagem} className="w-full h-full object-cover" /> : <Package size={14} />}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase block">{p.nome} ({p.site})</span>
                            <span className="text-[9px] text-zinc-400 block">Venc: {p.vencimento ? p.vencimento.split('-').reverse().join('/') : '-'}</span>
                          </div>
                        </div>
                        <button onClick={() => excluirProduto(p.id)} className="text-red-400 p-1"><Trash2 size={14} /></button>
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
      {/* Container Principal Responsivo: Mobile (full), Tablet (Card Médio), PC (Card Grande) */}
      <div className={`w-full h-full md:h-[844px] md:max-w-[600px] lg:max-w-[1200px] lg:h-[90vh] shadow-2xl overflow-hidden flex flex-col relative md:rounded-[55px] lg:rounded-[30px] border-0 md:border-[10px] lg:border-[12px] border-zinc-900 transition-colors ${temaEscuro ? 'bg-zinc-900' : 'bg-zinc-50'}`}>

        {/* TOAST NOTIFICATION COMPONENT */}
        {toast.show && (
          <div className={`absolute top-20 left-4 right-4 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 z-50 border ${toast.type === 'success' ? (temaEscuro ? 'bg-zinc-900 border-yellow-500 text-yellow-500' : 'bg-zinc-900 border-zinc-800 text-yellow-400') : 'bg-red-500 border-red-400 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-black text-[11px] uppercase tracking-tighter flex-1">{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="opacity-50"><X size={16} /></button>
          </div>
        )}

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
};