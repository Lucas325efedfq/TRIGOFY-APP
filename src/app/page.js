"use client";
import React, { useState, useEffect } from 'react';
import {
  LayoutGrid, Send, ChevronRight, ShoppingBag,
  LogOut, BookOpen, Plus, Trash2, Megaphone, Settings, Sun, Moon, User, Lock, Edit3, UserPlus, Database, Users, Package, Image as ImageIcon, CheckCircle2, Clock, AlertCircle, XCircle, Check, X, Camera
} from 'lucide-react';

// ==========================================================
// 1. CONFIGURAÇÕES DE CONEXÃO (AIRTABLE)
// ==========================================================
const AIRTABLE_TOKEN = 'patSTombPP4bmw0AK.43e89e93f885283e025cc1c7636c3af9053c953ca812746652c883757c25cd9a';
const BASE_ID = 'appj9MPXg5rVQf3zK';

const TABLE_ID = 'tblpfxnome'; 
const TABLE_ID_PRODUTOS = 'tblProdutos'; 
const TABLE_ID_PEDIDOS = 'tblPedidos'; 
const TABLE_ID_USUARIOS = 'tblUsuarios'; 
const TABLE_ID_DOACOES = 'tblDoacoes'; 
const TABLE_ID_CANCELAMENTOS = 'tblCancelamentos'; 

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
   
  // *** NOVOS CAMPOS DOACOES ***
  const [nomeProdutoDoacao, setNomeProdutoDoacao] = useState('');
  const [codigoProdutoDoacao, setCodigoProdutoDoacao] = useState('');
  
  // *** NOVOS CAMPOS SOLICITADOS PARA DOACOES ***
  const [localArmazenamentoDoacao, setLocalArmazenamentoDoacao] = useState('');
  const [qtdeDoacao, setQtdeDoacao] = useState('');
  const [unidadeDoacao, setUnidadeDoacao] = useState('CX');
  const [porcionamentoDoacao, setPorcionamentoDoacao] = useState('');
  const [fotoDoacao, setFotoDoacao] = useState(''); // Armazenará Base64 da imagem

  // *** NOVOS CAMPOS PARA CANCELAMENTO ***
  const [cpfCancelamento, setCpfCancelamento] = useState('');
  const [nomeCancelamento, setNomeCancelamento] = useState('');
  const [telefoneCancelamento, setTelefoneCancelamento] = useState('');
  const [areaCancelamento, setAreaCancelamento] = useState('');
  
  // *** ALTERAÇÃO CANCELAMENTO: REMOVIDO "produtoQtdeCancelamento" ***
  const [produtoCancelamento, setProdutoCancelamento] = useState('');
  const [qtdeCancelamento, setQtdeCancelamento] = useState('');
  const [unidadeCancelamento, setUnidadeCancelamento] = useState('CX'); // Default CX
  
  const [motivoCancelamento, setMotivoCancelamento] = useState('');

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

  // ==========================================================
  // FUNÇÃO CORRIGIDA: BUSCAR PEDIDOS E DOAÇÕES PENDENTES
  // ==========================================================
  const buscarPedidosPendentes = async () => {
    setCarregando(true);
    try {
      const formula = encodeURIComponent(`{status} = 'PENDENTE'`);
      
      // 1. Busca Pedidos Comuns
      const reqPedidos = fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_PEDIDOS}?filterByFormula=${formula}`, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
      });

      // 2. Busca Doações
      const reqDoacoes = fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_DOACOES}?filterByFormula=${formula}`, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
      });

      const [resPedidos, resDoacoes] = await Promise.all([reqPedidos, reqDoacoes]);
      
      const dataPedidos = await resPedidos.json();
      const dataDoacoes = await resDoacoes.json();

      let listaCombinada = [];

      // Processa Pedidos
      if (dataPedidos.records) {
        const pedidosNormais = dataPedidos.records.map(r => ({
          id: r.id,
          tabelaOrigem: TABLE_ID_PEDIDOS, // Importante: Marca de onde veio
          solicitante: r.fields.solicitante,
          produto: r.fields.produto,
          valor: r.fields.valor,
          data: r.fields.data,
          site: r.fields.site,
          tipo: 'COMPRA'
        }));
        listaCombinada = [...listaCombinada, ...pedidosNormais];
      }

      // Processa Doações
      if (dataDoacoes.records) {
        const doacoesPendentes = dataDoacoes.records.map(r => ({
          id: r.id,
          tabelaOrigem: TABLE_ID_DOACOES, // Importante: Marca de onde veio
          solicitante: r.fields.solicitante,
          produto: r.fields.produto, // Nome do produto doado
          valor: "0.00",
          data: r.fields.data,
          site: r.fields.origem || 'VR', // Usa origem como local
          tipo: 'DOACAO',
          // Campos Extras
          motivo: r.fields.motivo,
          codigo: r.fields.codigo_produto,
          area: r.fields.area_solicitante,
          origem: r.fields.origem,
          vencimento: r.fields.vencimento,
          area_produto: r.fields.area_produto
        }));
        listaCombinada = [...listaCombinada, ...doacoesPendentes];
      }

      setPedidosParaAprovar(listaCombinada);

    } catch (e) { 
        console.error("Erro ao buscar pendentes:", e); 
        showToast("Erro ao carregar aprovações.", "error");
    }
    setCarregando(false);
  };

  // FUNÇÃO ATUALIZADA: ATUALIZAR STATUS (AGORA SUPORTA MÚLTIPLAS TABELAS)
  const atualizarStatusPedido = async (id, novoStatus, tabelaOrigem) => {
    // Se tabelaOrigem não for passada, assume PEDIDOS por compatibilidade
    const tabelaDestino = tabelaOrigem || TABLE_ID_PEDIDOS;

    setCarregando(true);
    try {
      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${tabelaDestino}/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: { status: novoStatus } })
      });
      if (response.ok) {
        showToast(`Solicitação ${novoStatus} com sucesso!`, 'success');
        buscarPedidosPendentes(); // Recarrega a lista mista
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
  const [areaEncontrada, setAreaEncontrada] = useState('');

  // Lógica de busca de nome para PEDIDOS
  useEffect(() => {
    const pessoa = pessoasCadastradas.find(p => p.cpf === cpfDigitado.replace(/\D/g, ''));
    if (pessoa) {
      setNomeEncontrado(pessoa.nome);
      setSiteUsuarioIdentificado(pessoa.site);
      setAreaEncontrada(pessoa.area || ''); 
    } else {
      setNomeEncontrado('');
      setSiteUsuarioIdentificado('');
      setAreaEncontrada('');
    }
  }, [cpfDigitado, pessoasCadastradas]);

  // Lógica de busca de nome para CANCELAMENTO
  useEffect(() => {
    const pessoa = pessoasCadastradas.find(p => p.cpf === cpfCancelamento.replace(/\D/g, ''));
    if (pessoa) {
        setNomeCancelamento(pessoa.nome);
    } else {
        setNomeCancelamento('');
    }
  }, [cpfCancelamento, pessoasCadastradas]);

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
    setCpfCancelamento('');
    setNomeCancelamento('');
    setTelefoneCancelamento('');
    setAreaCancelamento('');
     
    // Limpeza novos campos
    setProdutoCancelamento('');
    setQtdeCancelamento('');
    setUnidadeCancelamento('CX');
    setMotivoCancelamento('');
     
    // Limpeza Doações
    setLocalArmazenamentoDoacao('');
    setQtdeDoacao('');
    setUnidadeDoacao('CX');
    setPorcionamentoDoacao('');
    setFotoDoacao('');

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

  // Função auxiliar para converter imagem
  const handleFotoDoacaoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoDoacao(reader.result); // Base64
      };
      reader.readAsDataURL(file);
    }
  };

  // ==========================================================
  // CORREÇÃO DO ENVIO DE DOAÇÃO
  // ==========================================================
  const handleEnviarDoacao = async () => {
    // Validação dos campos (incluindo os novos)
    if (!nomeProdutoDoacao || !codigoProdutoDoacao || !areaSolicitante || !motivoDoacao || !areaProdutoDoado || !dataVencimento || !origemProduto || !localArmazenamentoDoacao || !qtdeDoacao || !unidadeDoacao || !porcionamentoDoacao) {
        return showToast("Preencha todos os campos da doação.", "error");
    }

    setCarregando(true);
    try {
      const dataISO = new Date().toISOString().split('T')[0];

      // VOLTANDO A ENVIAR PARA A TABELA DE DOAÇÕES CORRETA (EVITA ERRO 422)
      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_DOACOES}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            "solicitante": usuarioInput,
            "produto": nomeProdutoDoacao.toUpperCase(),
            "codigo_produto": codigoProdutoDoacao,
            "area_solicitante": areaSolicitante,
            "motivo": motivoDoacao,
            "area_produto": areaProdutoDoado,
            "vencimento": dataVencimento,
            "origem": origemProduto,
            "data": dataISO,
            "status": "PENDENTE",
            // Novos Campos Mapeados
            "local_armazenamento": localArmazenamentoDoacao,
            "quantidade_doacao": qtdeDoacao,
            "unidade_medida": unidadeDoacao,
            "porcionamento": porcionamentoDoacao,
            "foto_etiqueta": fotoDoacao ? fotoDoacao.substring(0, 100000) : "Sem foto" // Limita tamanho por precaução se for campo texto
          }
        })
      });

      if (response.ok) {
        showToast("✅ SOLICITAÇÃO ENVIADA COM SUCESSO!", "success");
        setNomeProdutoDoacao('');
        setCodigoProdutoDoacao('');
        setAreaSolicitante('');
        setMotivoDoacao('');
        setAreaProdutoDoado('');
        setDataVencimento('');
        setOrigemProduto('');
         
        // Limpa novos
        setLocalArmazenamentoDoacao('');
        setQtdeDoacao('');
        setUnidadeDoacao('CX');
        setPorcionamentoDoacao('');
        setFotoDoacao('');

        setActiveTab('home');
      } else {
        // Se der erro, tenta logar
        const errData = await response.json();
        console.error("Erro Airtable:", errData);
        showToast("Erro no Airtable. Verifique se as colunas existem.", "error");
      }
    } catch (e) {
      showToast("Erro de conexão.", "error");
    }
    setCarregando(false);
  };

  // ==========================================================
  // FUNÇÃO: ENVIAR CANCELAMENTO
  // ==========================================================
  const handleEnviarCancelamento = async () => {
    // Validação Atualizada
    if (!nomeCancelamento || !telefoneCancelamento || !areaCancelamento || !produtoCancelamento || !qtdeCancelamento || !unidadeCancelamento || !motivoCancelamento) {
      return showToast("Preencha todos os campos obrigatórios.", "error");
    }

    setCarregando(true);
    try {
      const dataISO = new Date().toISOString().split('T')[0];

      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID_CANCELAMENTOS}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            "solicitante": usuarioInput,
            "cpf": cpfCancelamento.replace(/\D/g, ''),
            "nome_completo": nomeCancelamento,
            "telefone": telefoneCancelamento,
            "area": areaCancelamento,
            // Novos campos separados
            "produto_cancelar": produtoCancelamento,
            "quantidade": qtdeCancelamento,
            "unidade_medida": unidadeCancelamento,
            "motivo_cancelamento": motivoCancelamento,
            "data": dataISO,
            "status": "PENDENTE"
          }
        })
      });

      if (response.ok) {
        showToast("✅ SOLICITAÇÃO DE CANCELAMENTO ENVIADA!", "success");
        setCpfCancelamento('');
        setNomeCancelamento('');
        setTelefoneCancelamento('');
        setAreaCancelamento('');
        setProdutoCancelamento('');
        setQtdeCancelamento('');
        setUnidadeCancelamento('CX');
        setMotivoCancelamento('');
        setActiveTab('home');
      } else {
        showToast("Erro ao registrar cancelamento.", "error");
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
    const u = usuariosAutorizados.find(x => x.usuario === usuarioInput.toLowerCase());
    const isAdmin = u?.funcao === 'ADMIN';
    const isAprovador = u?.funcao === 'APROVADOR' || isAdmin;
    const glass = temaEscuro ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/70 border-white/40';
    const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
    const inputStyle = `w-full p-4 rounded-[24px] outline-none border transition-all focus:ring-4 focus:ring-yellow-400/20 ${temaEscuro ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200'}`;

    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 animate-in fade-in duration-700 pb-10">
            {/* Header Card Premium */}
            <div className="bg-gradient-to-br from-yellow-400 via-yellow-400 to-yellow-500 p-8 rounded-[40px] text-zinc-900 shadow-[0_20px_50px_rgba(234,179,8,0.3)] relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex items-center gap-5">
                <div className="bg-white p-3 rounded-[24px] shadow-xl w-20 h-20 flex items-center justify-center overflow-hidden">
                  <img src="/favicon.ico" className="w-full h-full object-contain scale-110" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase italic">Grupo Trigo</h2>
                  <p className="opacity-80 font-bold text-sm italic">Olá, {usuarioInput}!</p>
                </div>
              </div>
            </div>

            <h3 className={`font-black text-lg px-2 mt-6 uppercase italic tracking-tighter ${textMain}`}>Ações Rápidas</h3>
            <div className="grid grid-cols-2 gap-4">
              {isAprovador && (
                <div onClick={() => setActiveTab('aprovacoes')} className="col-span-2 bg-zinc-900 p-6 rounded-[32px] flex items-center gap-4 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                  <div className="bg-yellow-400 p-3 rounded-2xl text-zinc-900 shadow-lg shadow-yellow-400/20"><CheckCircle2 size={24} /></div>
                  <div className="flex-1"><p className="font-black uppercase text-sm text-yellow-400 italic">Painel Admin</p><p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Aprovações Pendentes</p></div>
                  <ChevronRight className="text-yellow-400" size={24} />
                </div>
              )}
              {isAdmin ? (
                <>
                  <div onClick={() => { setSubAbaAdmin('nuvem'); setActiveTab('admin-painel'); }} className={`${glass} backdrop-blur-xl p-5 rounded-[32px] border flex flex-col gap-3 cursor-pointer hover:shadow-2xl transition-all shadow-sm`}><div className="bg-blue-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30"><Database size={24} /></div><p className="font-black uppercase text-xs tracking-tighter text-center">Nuvem</p></div>
                  <div onClick={() => { setSubAbaAdmin('cadastro'); setActiveTab('admin-painel'); }} className={`${glass} backdrop-blur-xl p-5 rounded-[32px] border flex flex-col gap-3 cursor-pointer hover:shadow-2xl transition-all shadow-sm`}><div className="bg-green-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/30"><UserPlus size={24} /></div><p className="font-black uppercase text-xs tracking-tighter text-center">Novo Usuário</p></div>
                  <div onClick={() => { setSubAbaAdmin('lista'); setActiveTab('admin-painel'); }} className={`${glass} backdrop-blur-xl p-5 rounded-[32px] border flex flex-col gap-3 cursor-pointer hover:shadow-2xl transition-all shadow-sm`}><div className="bg-yellow-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-yellow-500/30"><Users size={24} /></div><p className="font-black uppercase text-xs tracking-tighter text-center">Lista Usuários</p></div>
                  <div onClick={() => { setSubAbaAdmin('produtos'); setActiveTab('admin-painel'); }} className={`${glass} backdrop-blur-xl p-5 rounded-[32px] border flex flex-col gap-3 cursor-pointer hover:shadow-2xl transition-all shadow-sm`}><div className="bg-zinc-900 w-12 h-12 rounded-2xl flex items-center justify-center text-yellow-400 shadow-lg"><Package size={24} /></div><p className="font-black uppercase text-xs tracking-tighter text-center">Produtos</p></div>
                </>
              ) : (
                <>
                  <div onClick={() => setActiveTab('pedidos')} className={`${glass} backdrop-blur-xl p-6 rounded-[32px] border flex flex-col gap-4 cursor-pointer hover:shadow-xl transition-all`}><div className="bg-yellow-400 w-14 h-14 rounded-2xl flex items-center justify-center text-zinc-900 shadow-lg shadow-yellow-400/20"><ShoppingBag size={28} /></div><p className="font-black uppercase text-sm italic text-center">Meus Pedidos</p></div>
                  <div onClick={() => setActiveTab('catalogo')} className={`${glass} backdrop-blur-xl p-6 rounded-[32px] border flex flex-col gap-4 cursor-pointer hover:shadow-xl transition-all`}><div className="bg-yellow-400 w-14 h-14 rounded-2xl flex items-center justify-center text-zinc-900 shadow-lg shadow-yellow-400/20"><BookOpen size={28} /></div><p className="font-black uppercase text-sm italic text-center">Doações</p></div>
                  <div onClick={() => setActiveTab('cancelamento')} className={`${glass} backdrop-blur-xl p-6 rounded-[32px] border flex flex-col gap-4 cursor-pointer hover:shadow-xl transition-all`}><div className="bg-red-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20"><XCircle size={28} /></div><p className="font-black uppercase text-sm italic text-red-500 text-center">Cancelamentos</p></div>
                  <div onClick={() => { if(usuarioLogadoOrigem !== 'VR') { setSiteFiltro('RIO/SP'); setActiveTab('novo'); } else showToast("Acesso Negado", "error"); }} className={`${glass} backdrop-blur-xl p-6 rounded-[32px] border flex flex-col gap-4 cursor-pointer transition-all ${usuarioLogadoOrigem === 'VR' ? 'opacity-30' : ''}`}><div className="bg-yellow-400 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"><img src="/cesta.png" className="w-8 h-8" /></div><p className="font-black uppercase text-xs italic tracking-tighter text-center">Compras RIO/SP</p></div>
                  <div onClick={() => { if(usuarioLogadoOrigem === 'VR' || usuarioLogadoOrigem === 'ALL') { setSiteFiltro('VR'); setActiveTab('novo'); } else showToast("Acesso Negado", "error"); }} className={`${glass} backdrop-blur-xl p-6 rounded-[32px] border flex flex-col gap-4 cursor-pointer transition-all ${usuarioLogadoOrigem !== 'VR' && usuarioLogadoOrigem !== 'ALL' ? 'opacity-30' : ''}`}><div className="bg-yellow-400 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"><img src="/pizza.png" className="w-8 h-8" /></div><p className="font-black uppercase text-xs italic tracking-tighter text-center">Compras VR</p></div>
                  <div onClick={() => setActiveTab('suporte')} className="bg-yellow-400 p-4 rounded-[32px] flex items-center justify-between gap-4 cursor-pointer active:scale-95 transition-all shadow-xl shadow-yellow-400/20"><div className="bg-zinc-900 p-3 rounded-full text-yellow-400"><Megaphone size={20} /></div><div className="flex-1 font-bold text-zinc-900 uppercase text-sm text-center">Suporte</div><ChevronRight size={20} /></div>
                </>
              )}
            </div>
          </div>
        );

      case 'novo':
        return (
          <div className="animate-in slide-in-from-right duration-500 pb-20">
            <button onClick={() => { setActiveTab('home'); setSiteFiltro(''); setCpfDigitado(''); setTelefone(''); setProdutosSelecionados([]); setAreaEncontrada(''); }} className="mb-4 font-black text-[10px] uppercase text-zinc-500">← Voltar</button>
            <div className={`${glass} backdrop-blur-xl p-8 rounded-[40px] border shadow-2xl space-y-6`}>
              <h2 className="text-xl font-black uppercase italic tracking-tighter border-b pb-4">{siteFiltro}</h2>
              <input type="text" placeholder="Digite seu CPF" className={inputStyle} value={cpfDigitado} onChange={(e) => setCpfDigitado(e.target.value)} />
              <input type="text" readOnly className="w-full p-4 rounded-[24px] bg-zinc-100 dark:bg-zinc-800 font-black uppercase text-zinc-400 text-sm border-none" value={nomeEncontrado || "Aguardando CPF..."} />
              <input type="text" readOnly className="w-full p-4 rounded-[24px] bg-zinc-100 dark:bg-zinc-800 font-black uppercase text-zinc-400 text-sm border-none" value={areaEncontrada || "---"} />
              <input type="text" placeholder="WhatsApp (XX) 9XXXX-XXXX" className={inputStyle} value={telefone} onChange={(e) => setTelefone(e.target.value)} />
              
              <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Produtos (Máx 5):</p>
                {produtosLancados.filter(p => p.site === siteFiltro).map(p => {
                  const s = produtosSelecionados.includes(p.id);
                  return (
                    <div key={p.id} onClick={() => toggleProduto(p.id)} className={`flex items-center gap-4 p-4 rounded-[28px] border transition-all ${s ? 'bg-yellow-400 border-yellow-500 shadow-lg shadow-yellow-400/20' : 'bg-white/50 border-zinc-100'}`}>
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden border">{p.imagem ? <img src={p.imagem} className="w-full h-full object-cover" /> : <Package className="text-zinc-300" />}</div>
                      <div className="flex-1"><p className={`font-black text-xs uppercase tracking-tight ${s ? 'text-zinc-900' : ''}`}>{p.nome}</p><p className={`text-[10px] font-bold ${s ? 'text-zinc-800' : 'text-yellow-600'}`}>R$ {p.preco}</p></div>
                      {s && <CheckCircle2 className="text-zinc-900" size={20} />}
                    </div>
                  );
                })}
              </div>
              <button disabled={!nomeEncontrado || !produtosSelecionados.length} onClick={handleEnviarPedidoReal} className="w-full bg-zinc-900 text-yellow-400 py-5 rounded-[28px] font-black uppercase shadow-2xl active:scale-95 transition-all disabled:opacity-30">Finalizar Pedido</button>
            </div>
          </div>
        );

      case 'catalogo':
        const nomeCompletoUsuarioLogado = pessoasCadastradas.find(p => p.usuarioAirtable === usuarioInput.toLowerCase())?.nome || usuarioInput.toUpperCase();
        return (
          <div className="animate-in slide-in-from-right duration-500 pb-20">
            <button onClick={() => setActiveTab('home')} className="mb-4 font-black text-[10px] uppercase text-zinc-500">← Voltar</button>
            <div className={`${glass} backdrop-blur-xl p-8 rounded-[40px] border shadow-2xl space-y-4`}>
              <h2 className="text-xl font-black uppercase italic border-b pb-4">Doações</h2>
              <input type="text" readOnly className="w-full p-4 rounded-[24px] bg-zinc-100 dark:bg-zinc-800 font-black uppercase text-zinc-400 text-sm border-none" value={nomeCompletoUsuarioLogado} />
              <input type="text" placeholder="Produto" className={inputStyle} value={nomeProdutoDoacao} onChange={(e) => setNomeProdutoDoacao(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Código" className={inputStyle} value={codigoProdutoDoacao} onChange={(e) => setCodigoProdutoDoacao(e.target.value)} />
                <input type="number" placeholder="Quantidade" className={inputStyle} value={qtdeDoacao} onChange={(e) => setQtdeDoacao(e.target.value)} />
              </div>
              <select className={inputStyle} value={unidadeDoacao} onChange={(e) => setUnidadeDoacao(e.target.value)}><option value="CX">CX</option><option value="KG">KG</option><option value="BAG">BAG</option></select>
              <textarea placeholder="Porcionamento" rows={2} className={inputStyle} value={porcionamentoDoacao} onChange={(e) => setPorcionamentoDoacao(e.target.value)} />
              <textarea placeholder="Motivo da Doação" rows={2} className={inputStyle} value={motivoDoacao} onChange={(e) => setMotivoDoacao(e.target.value)} />
              <input type="text" placeholder="Sua Área" className={inputStyle} value={areaSolicitante} onChange={(e) => setAreaSolicitante(e.target.value)} />
              <input type="text" placeholder="Local Armazenamento" className={inputStyle} value={localArmazenamentoDoacao} onChange={(e) => setLocalArmazenamentoDoacao(e.target.value)} />
              <input type="text" placeholder="Área do Produto" className={inputStyle} value={areaProdutoDoado} onChange={(e) => setAreaProdutoDoado(e.target.value)} />
              <input type="date" className={inputStyle} value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} />
              <input type="text" placeholder="Origem" className={inputStyle} value={origemProduto} onChange={(e) => setOrigemProduto(e.target.value)} />
              <div className="flex items-center gap-3 p-4 rounded-3xl border border-dashed border-zinc-300">
                <Camera className="text-zinc-400" />
                <input type="file" capture="environment" accept="image/*" className="text-xs" onChange={handleFotoDoacaoChange} />
              </div>
              <button onClick={handleEnviarDoacao} className="w-full bg-zinc-900 text-yellow-400 py-5 rounded-[28px] font-black uppercase active:scale-95 transition-all">Enviar Doação</button>
            </div>
          </div>
        );

      case 'cancelamento':
        return (
          <div className="animate-in slide-in-from-right duration-500 pb-20">
            <button onClick={() => setActiveTab('home')} className="mb-4 font-black text-[10px] uppercase text-zinc-500">← Voltar</button>
            <div className={`${glass} backdrop-blur-xl p-8 rounded-[40px] border shadow-2xl space-y-4`}>
              <h2 className="text-xl font-black uppercase italic border-b pb-4 text-red-500">Cancelar Compra</h2>
              <input type="text" placeholder="Seu CPF" className={inputStyle} value={cpfCancelamento} onChange={(e) => setCpfCancelamento(e.target.value)} />
              <input type="text" readOnly className="w-full p-4 rounded-[24px] bg-zinc-100 dark:bg-zinc-800 font-bold text-sm" value={nomeCancelamento || "Identificando..."} />
              <input type="text" placeholder="Telefone" className={inputStyle} value={telefoneCancelamento} onChange={(e) => setTelefoneCancelamento(e.target.value)} />
              <input type="text" placeholder="Sua Área" className={inputStyle} value={areaCancelamento} onChange={(e) => setAreaCancelamento(e.target.value)} />
              <input type="text" placeholder="Produto a cancelar" className={inputStyle} value={produtoCancelamento} onChange={(e) => setProdutoCancelamento(e.target.value)} />
              <div className="flex gap-2">
                <input type="number" placeholder="Qtd" className="w-24 p-4 rounded-[24px] border" value={qtdeCancelamento} onChange={(e) => setQtdeCancelamento(e.target.value)} />
                <select className="flex-1 p-4 rounded-[24px] border" value={unidadeCancelamento} onChange={(e) => setUnidadeCancelamento(e.target.value)}><option value="CX">CX</option><option value="KG">KG</option><option value="BAG">BAG</option></select>
              </div>
              <textarea placeholder="Motivo do Cancelamento" rows={3} className={inputStyle} value={motivoCancelamento} onChange={(e) => setMotivoCancelamento(e.target.value)} />
              <button onClick={handleEnviarCancelamento} className="w-full bg-red-500 text-white py-5 rounded-[28px] font-black uppercase active:scale-95 transition-all shadow-xl shadow-red-500/20">Solicitar Cancelamento</button>
            </div>
          </div>
        );

      case 'admin-painel':
        return (
          <div className="animate-in slide-in-from-bottom duration-500 pb-20 space-y-6">
            <button onClick={() => setActiveTab('home')} className="font-black text-[10px] uppercase text-zinc-500">← Voltar</button>
            <div className={`${glass} backdrop-blur-xl p-8 rounded-[40px] border shadow-2xl space-y-6`}>
              <h2 className="text-xl font-black uppercase italic tracking-tighter border-b pb-4">Gerenciamento</h2>
              {subAbaAdmin === 'nuvem' && (
                <div className="space-y-4">
                  <input type="text" placeholder="CPF" className={inputStyle} value={novoCpf} onChange={(e) => setNovoCpf(e.target.value)} />
                  <input type="text" placeholder="Nome Completo" className={inputStyle} value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
                  <input type="text" placeholder="Área" className={inputStyle} value={novaArea} onChange={(e) => setNovaArea(e.target.value)} />
                  <button onClick={salvarNoAirtable} className="w-full bg-yellow-400 text-zinc-900 py-4 rounded-[24px] font-black uppercase">Salvar Dados</button>
                  <div className="max-h-60 overflow-y-auto space-y-2 pt-4 border-t">
                    {pessoasCadastradas.map(p => (
                      <div key={p.id} className="flex justify-between items-center p-4 rounded-3xl bg-zinc-500/5 border"><div><p className="font-bold text-xs uppercase">{p.nome}</p><p className="text-[10px] text-zinc-400">{p.cpf}</p></div><button onClick={() => excluirDoAirtable(p.id)} className="text-red-400"><Trash2 size={16} /></button></div>
                    ))}
                  </div>
                </div>
              )}
              {subAbaAdmin === 'cadastro' && (
                <div className="space-y-4">
                  <input type="text" placeholder="Usuário" className={inputStyle} value={novoUserLogin} onChange={(e) => setNovoUserLogin(e.target.value)} />
                  <input type="password" placeholder="Senha" className={inputStyle} value={novoUserSenha} onChange={(e) => setNovoUserSenha(e.target.value)} />
                  <select className={inputStyle} value={novoUserOrigem} onChange={(e) => setNovoUserOrigem(e.target.value)}><option value="VR">VR</option><option value="RIO">RIO</option><option value="SP">SP</option><option value="ALL">ALL</option></select>
                  <select className={inputStyle} value={novoUserFuncao} onChange={(e) => setNovoUserFuncao(e.target.value)}><option value="USER">USER</option><option value="APROVADOR">APROVADOR</option><option value="ADMIN">ADMIN</option></select>
                  <button onClick={cadastrarNovoUsuarioSistema} className="w-full bg-zinc-900 text-yellow-400 py-4 rounded-[24px] font-black uppercase">Criar Acesso</button>
                </div>
              )}
              {subAbaAdmin === 'lista' && (
                 <div className="space-y-4">
                    {usuariosAutorizados.map(u => (
                      <div key={u.usuario} className="flex justify-between items-center p-4 rounded-3xl bg-zinc-500/5 border"><div><p className="font-bold text-xs uppercase">{u.usuario}</p><p className="text-[10px] text-zinc-400">{u.funcao} | {u.origem}</p></div><button onClick={() => adminExcluirUsuario(u.usuario)} className="text-red-400"><Trash2 size={16} /></button></div>
                    ))}
                 </div>
              )}
              {subAbaAdmin === 'produtos' && (
                <div className="space-y-4">
                  <input type="text" placeholder="Nome" className={inputStyle} value={prodNome} onChange={(e) => setProdNome(e.target.value)} />
                  <input type="text" placeholder="Preço" className={inputStyle} value={prodPreco} onChange={(e) => setProdPreco(e.target.value)} />
                  <select className={inputStyle} value={prodSite} onChange={(e) => setProdSite(e.target.value)}><option value="VR">VR</option><option value="RIO/SP">RIO/SP</option></select>
                  <input type="date" className={inputStyle} value={prodVencimento} onChange={(e) => setProdVencimento(e.target.value)} />
                  <div className="flex gap-2">
                     <input type="text" placeholder="http://..." className={inputStyle} value={prodImagem} onChange={(e) => setProdImagem(e.target.value)} />
                     <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center border overflow-hidden">{prodImagem ? <img src={prodImagem} className="w-full h-full object-cover" /> : <ImageIcon size={20}/>}</div>
                  </div>
                  <button onClick={handleLancarProduto} className="w-full bg-yellow-400 text-zinc-900 py-4 rounded-[24px] font-black uppercase">Lançar Produto</button>
                  <div className="max-h-60 overflow-y-auto space-y-2 pt-4 border-t">
                    {produtosLancados.map(p => (
                      <div key={p.id} className="flex justify-between items-center p-3 rounded-2xl bg-zinc-500/5 border"><span className="text-[10px] font-black uppercase">{p.nome}</span><button onClick={() => excluirProduto(p.id)} className="text-red-400"><Trash2 size={16} /></button></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'aprovacoes':
        return (
          <div className="animate-in slide-in-from-right duration-500 pb-20">
            <button onClick={() => setActiveTab('home')} className="mb-4 font-black text-[10px] uppercase text-zinc-500">← Voltar</button>
            <h2 className="text-xl font-black uppercase italic mb-4">Aprovações</h2>
            <div className="space-y-4">
              {pedidosParaAprovar.length > 0 ? pedidosParaAprovar.map(p => (
                <div key={p.id} className={`${glass} backdrop-blur-xl p-6 rounded-[32px] border shadow-sm space-y-3`}>
                  <div className="flex justify-between items-start">
                    <div><p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{p.solicitante}</p><p className={`font-black text-sm uppercase ${textMain}`}>{p.produto}</p></div>
                    <span className={`text-[8px] font-bold px-3 py-1 rounded-full uppercase ${p.tipo === 'DOACAO' ? 'bg-blue-500 text-white' : 'bg-yellow-400 text-zinc-900'}`}>{p.tipo}</span>
                  </div>
                  {p.tipo === 'DOACAO' && <div className="text-[10px] text-zinc-500 italic space-y-1"><p>Motivo: {p.motivo}</p><p>Area: {p.area} | Cod: {p.codigo}</p></div>}
                  {p.tipo !== 'DOACAO' && <p className="text-[10px] text-yellow-600 font-bold">R$ {p.valor}</p>}
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => atualizarStatusPedido(p.id, 'APROVADO', p.tabelaOrigem)} className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-green-500/20 active:scale-95 transition-all">Aprovar</button>
                    <button onClick={() => atualizarStatusPedido(p.id, 'REPROVADO', p.tabelaOrigem)} className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-red-500/20 active:scale-95 transition-all">Reprovar</button>
                  </div>
                </div>
              )) : <p className="text-center text-zinc-400 text-xs font-bold p-8">Nenhum pedido pendente.</p>}
            </div>
          </div>
        );

      case 'pedidos':
        return (
          <div className="animate-in slide-in-from-right duration-500 pb-20">
            <button onClick={() => setActiveTab('home')} className="mb-4 font-black text-[10px] uppercase text-zinc-500">← Voltar</button>
            <h2 className="text-xl font-black uppercase italic mb-4">Meu Histórico</h2>
            <div className="space-y-3">
              {meusPedidosHistorico.length > 0 ? meusPedidosHistorico.map(p => (
                <div key={p.id} className={`${glass} backdrop-blur-xl p-5 rounded-[32px] border shadow-sm flex flex-col gap-1`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${p.status === 'APROVADO' ? 'bg-green-100 text-green-700' : p.status === 'REPROVADO' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
                    <span className="text-[10px] font-bold text-zinc-400">{p.data}</span>
                  </div>
                  <p className={`font-black text-sm uppercase ${textMain}`}>{p.produto}</p>
                  <p className="text-[10px] font-bold text-zinc-400">R$ {p.valor}</p>
                </div>
              )) : <div className="text-center p-10"><ShoppingBag className="mx-auto text-zinc-300 mb-2"/><p className="text-zinc-400 text-xs font-bold">Sem histórico.</p></div>}
            </div>
          </div>
        );

      case 'config':
        return (
          <div className="animate-in slide-in-from-bottom duration-500 pb-20">
            <button onClick={() => setActiveTab('home')} className="mb-4 font-black text-[10px] uppercase text-zinc-500">← Voltar</button>
            <h2 className="text-xl font-black uppercase italic mb-4">Configurações</h2>
            <div className={`${glass} backdrop-blur-xl p-8 rounded-[40px] border shadow-2xl space-y-6`}>
              <div className="flex items-center gap-4 border-b pb-4"><div className="bg-yellow-400 p-4 rounded-3xl shadow-lg"><User size={24} /></div><div><p className={`font-black uppercase text-sm ${textMain}`}>{usuarioInput}</p><p className="text-[10px] text-zinc-400">ID Ativo</p></div></div>
              <div className="space-y-3"><label className="text-[10px] font-black text-zinc-400 uppercase">Alterar Senha</label><div className="flex gap-2"><input type="password" placeholder="Nova senha" className={`flex-1 p-3 rounded-2xl border text-sm outline-none ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={novaSenhaInput} onChange={(e) => setNovaSenhaInput(e.target.value)} /><button onClick={alterarSenhaUsuario} className="bg-zinc-900 text-yellow-400 px-4 rounded-2xl font-bold text-xs uppercase">Salvar</button></div></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">{temaEscuro ? <Moon className="text-yellow-400" size={20} /> : <Sun className="text-yellow-500" size={20} />}<span className={`font-bold text-sm ${textMain}`}>Modo Escuro</span></div>
                <button onClick={() => setTemaEscuro(!temaEscuro)} className={`w-14 h-7 rounded-full relative transition-colors ${temaEscuro ? 'bg-yellow-400' : 'bg-zinc-300'}`}><div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${temaEscuro ? 'left-8' : 'left-1'}`} /></button>
              </div>
              <button onClick={fazerLogoff} className="w-full flex items-center justify-center gap-2 p-5 bg-red-50 text-red-500 rounded-[28px] font-black text-sm active:scale-95 transition-all"><LogOut size={20} /> ENCERRAR SESSÃO</button>
            </div>
          </div>
        );

      case 'suporte':
        return (
          <div className="flex flex-col h-full animate-in slide-in-from-right duration-500 pb-20">
            <button onClick={() => setActiveTab('home')} className="mb-4 font-black text-[10px] uppercase text-zinc-500">← Voltar</button>
            <div className="flex-1 space-y-4 mb-4 overflow-y-auto px-2">
              {mensagens.map(m => (
                <div key={m.id} className={`flex ${m.bot ? 'justify-start' : 'justify-end'}`}><div className={`max-w-[80%] p-4 rounded-[24px] font-bold text-sm shadow-sm ${m.bot ? (temaEscuro ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-800') : 'bg-yellow-400 text-zinc-900'}`}>{m.texto}</div></div>
              ))}
            </div>
            <form onSubmit={enviarMensagemChat} className="flex gap-2 mb-20">
              <input type="text" placeholder="Diga algo..." className={`flex-1 p-4 rounded-[24px] outline-none border shadow-sm ${temaEscuro ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white'}`} value={inputChat} onChange={(e) => setInputChat(e.target.value)} />
              <button type="submit" className="bg-zinc-900 text-yellow-400 p-4 rounded-[20px] shadow-lg active:scale-95 transition-all"><Send size={20} /></button>
            </form>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className={`flex justify-center min-h-screen font-sans transition-all duration-500 ${temaEscuro ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-900'}`}>
      <div className={`w-full h-full md:h-[860px] md:max-w-[500px] lg:max-w-[1000px] lg:h-[95vh] shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative md:rounded-[60px] lg:rounded-[40px] border-0 md:border-[12px] border-zinc-900 transition-colors ${temaEscuro ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
        {toast.show && (
          <div className={`absolute top-20 left-4 right-4 p-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 z-50 border ${toast.type === 'success' ? 'bg-zinc-900 border-yellow-500 text-yellow-500' : 'bg-red-500 border-red-400 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-black text-[11px] uppercase tracking-tighter flex-1">{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })}><X size={16} /></button>
          </div>
        )}
        <header className={`p-8 flex justify-between items-center z-20 ${temaEscuro ? 'bg-zinc-900/50 backdrop-blur-md' : 'bg-white/50 backdrop-blur-md'}`}>
          <h1 className="text-3xl font-black italic text-yellow-500 tracking-tighter uppercase">Trigofy</h1>
          <button onClick={fazerLogoff} className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-2xl hover:text-red-500 transition-colors"><LogOut size={22} /></button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 pb-32 z-10">{renderContent()}</main>
        <nav className={`absolute bottom-8 left-6 right-6 p-4 flex justify-between items-center rounded-[32px] shadow-2xl border backdrop-blur-2xl z-20 transition-all ${temaEscuro ? 'bg-zinc-800/80 border-zinc-700' : 'bg-white/80 border-white/50'}`}>
          <button onClick={() => setActiveTab('home')} className={`p-4 rounded-2xl transition-all ${activeTab === 'home' ? 'bg-yellow-400 text-zinc-900 shadow-lg shadow-yellow-400/30' : 'text-zinc-400 hover:bg-zinc-100'}`}><LayoutGrid size={24} /></button>
          <button onClick={() => setActiveTab('pedidos')} className={`p-4 rounded-2xl transition-all ${activeTab === 'pedidos' ? 'bg-yellow-400 text-zinc-900 shadow-lg shadow-yellow-400/30' : 'text-zinc-400 hover:bg-zinc-100'}`}><ShoppingBag size={24} /></button>
          <button onClick={() => setActiveTab('catalogo')} className={`p-4 rounded-2xl transition-all ${activeTab === 'catalogo' ? 'bg-yellow-400 text-zinc-900 shadow-lg shadow-yellow-400/30' : 'text-zinc-400 hover:bg-zinc-100'}`}><BookOpen size={24} /></button>
          <button onClick={() => setActiveTab('config')} className={`p-4 rounded-2xl transition-all ${activeTab === 'config' ? 'bg-yellow-400 text-zinc-900 shadow-lg shadow-yellow-400/30' : 'text-zinc-400 hover:bg-zinc-100'}`}><Settings size={24} /></button>
        </nav>
      </div>
    </div>
  );
}