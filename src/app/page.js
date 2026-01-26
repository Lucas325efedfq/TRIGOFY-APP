"use client";
import React, { useState, useEffect } from 'react';

// Hooks
import { useToast } from '../ganchos/useToast';
import { useTheme } from '../ganchos/useTheme';

// Services
import { 
  fetchPessoas, 
  fetchProdutos, 
  fetchUsuarios 
} from '../servicos/airtableService';
import { 
  buscarPedidosUsuario,
  buscarPedidosPendentes as buscarPedidosPendentesService,
} from '../servicos/pedidosService';
import { 
  buscarDoacoesPendentes 
} from '../servicos/doacoesService';


// Components
import Toast from '../componentes/ui/Toast';
import Header from '../componentes/layout/Header';
import Navigation from '../componentes/layout/Navigation';
import LoginPage from '../componentes/paginas/LoginPage';
import HomePage from '../componentes/paginas/HomePage';
import NovoPedidoPage from '../componentes/paginas/NovoPedidoPage';
import DoacoesPage from '../componentes/paginas/DoacoesPage';
import CancelamentosPage from '../componentes/paginas/CancelamentosPage';
import SuportePage from '../componentes/paginas/SuportePage';
import AdminPainelPage from '../componentes/paginas/AdminPainelPage';
import SelecaoUnidadePage from '../componentes/paginas/SelecaoUnidadePage';


// Constants
import { ADMIN_USER } from '../constantes/roles';
import { updateRecord } from '../servicos/airtableService';

export default function TrigofyApp() {
  // Estados de autenticação
  const [estaLogado, setEstaLogado] = useState(false);
  const [usuarioInput, setUsuarioInput] = useState('');
  const [usuarioLogadoOrigem, setUsuarioLogadoOrigem] = useState('');
  const [usuarioLogadoFuncao, setUsuarioLogadoFuncao] = useState('');

  // Estados de navegação
  const [activeTab, setActiveTab] = useState('home');
  
  // Estados de dados
  const [pessoasCadastradas, setPessoasCadastradas] = useState([]);
  const [produtosLancados, setProdutosLancados] = useState([]);
  const [usuariosAutorizados, setUsuariosAutorizados] = useState([ADMIN_USER]);
  const [carregando, setCarregando] = useState(true);

  // Estados de filtros
  const [siteFiltro, setSiteFiltro] = useState('');
  
  // Estados de pedidos
  const [meusPedidosHistorico, setMeusPedidosHistorico] = useState([]);
  const [pedidosParaAprovar, setPedidosParaAprovar] = useState([]);
  
  // Hooks customizados
  const { toast, showToast } = useToast();
  const { temaEscuro, toggleTheme, bgMain, bgCard, textMain, textSub } = useTheme();

  // Carrega dados iniciais
  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    setCarregando(true);
    try {
      const [pessoas, produtos, usuarios] = await Promise.all([
        fetchPessoas(),
        fetchProdutos(),
        fetchUsuarios()
      ]);
      
      setPessoasCadastradas(pessoas);
      setProdutosLancados(produtos);
      setUsuariosAutorizados([ADMIN_USER, ...usuarios]);
    } catch (error) {
      showToast('Erro ao carregar dados', 'error');
    }
    setCarregando(false);
  };

  const handleLogin = (usuario, origem, funcao) => {
    setEstaLogado(true);
    setUsuarioInput(usuario);
    setUsuarioLogadoOrigem(origem);
    setUsuarioLogadoFuncao(funcao);
    showToast(`Bem-vindo, ${usuario}!`, 'success');
  };

  const handleLogout = () => {
    setEstaLogado(false);
    setActiveTab('home');
    setUsuarioInput('');
    setUsuarioLogadoOrigem('');
    setUsuarioLogadoFuncao('');
    setSiteFiltro('');
    setMeusPedidosHistorico([]);
    setPedidosParaAprovar([]);
    showToast('Logout realizado', 'success');
  };

  const carregarMeusPedidos = async () => {
    setCarregando(true);
    try {
      const pedidos = await buscarPedidosUsuario(usuarioInput);
      setMeusPedidosHistorico(pedidos);
    } catch (error) {
      showToast('Erro ao carregar pedidos', 'error');
    }
    setCarregando(false);
  };

  const carregarPedidosPendentes = async () => {
    setCarregando(true);
    try {
      const pedidosComuns = await buscarPedidosPendentesService();
      const doacoes = await buscarDoacoesPendentes();
      setPedidosParaAprovar([...pedidosComuns, ...doacoes]);
    } catch (error) {
      showToast('Erro ao carregar pedidos pendentes', 'error');
    }
    setCarregando(false);
  };

  const handleAtualizarStatus = async (recordId, novoStatus, tabelaOrigem) => {
    try {
      await updateRecord(tabelaOrigem, recordId, { status: novoStatus });
      showToast(`Pedido ${novoStatus.toLowerCase()} com sucesso!`, 'success');
      await carregarPedidosPendentes();
    } catch (error) {
      showToast('Erro ao atualizar status', 'error');
    }
  };

  // Efeito para carregar pedidos quando necessário
  useEffect(() => {
    if (activeTab === 'historico' || activeTab === 'pedidos') {
      carregarMeusPedidos();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'aprovacoes') {
      carregarPedidosPendentes();
    }
  }, [activeTab]);

  // Renderização
  if (!estaLogado) {
    return (
      <>
        <Toast toast={toast} />
        <LoginPage 
          onLogin={handleLogin}
          usuariosAutorizados={usuariosAutorizados}
          temaEscuro={temaEscuro}
        />
      </>
    );
  }

  const isAdmin = usuarioLogadoFuncao === 'ADMIN';
  const isAprovador = usuarioLogadoFuncao === 'APROVADOR';

  return (
    <div className={`min-h-screen ${bgMain}`}>
      <Toast toast={toast} />
      
      <Header 
        usuarioInput={usuarioInput}
        temaEscuro={temaEscuro}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <main className="p-4 max-w-2xl mx-auto">
        {activeTab === 'home' && (
          <HomePage 
            setActiveTab={setActiveTab}
            setSiteFiltro={setSiteFiltro}
            isAdmin={isAdmin}
            isAprovador={isAprovador}
            temaEscuro={temaEscuro}
          />
        )}

        {activeTab === 'compras-aba' && (
          <SelecaoUnidadePage 
            setActiveTab={setActiveTab}
            setSiteFiltro={setSiteFiltro}
            temaEscuro={temaEscuro}
          />
        )}

        {activeTab === 'novo' && (
          <NovoPedidoPage 
            usuarioInput={usuarioInput}
            pessoasCadastradas={pessoasCadastradas}
            produtosLancados={produtosLancados}
            siteFiltro={siteFiltro}
            temaEscuro={temaEscuro}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'doacoes' && (
          <DoacoesPage 
            usuarioInput={usuarioInput}
            pessoasCadastradas={pessoasCadastradas}
            temaEscuro={temaEscuro}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'cancelamentos' && (
          <CancelamentosPage 
            usuarioInput={usuarioInput}
            pessoasCadastradas={pessoasCadastradas}
            temaEscuro={temaEscuro}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'suporte' && (
          <SuportePage 
            setActiveTab={setActiveTab}
            temaEscuro={temaEscuro}
          />
        )}

        {activeTab === 'admin-painel' && isAdmin && (
          <AdminPainelPage 
            setActiveTab={setActiveTab}
            temaEscuro={temaEscuro}
            showToast={showToast}
          />
        )}

        {/* Outras páginas */}
        {activeTab !== 'home' && activeTab !== 'compras-aba' && activeTab !== 'novo' && activeTab !== 'doacoes' && activeTab !== 'cancelamentos' && activeTab !== 'suporte' && activeTab !== 'admin-painel' && (
          <div className={`${bgCard} p-6 rounded-3xl shadow-sm border`}>
            <p className={`${textMain} font-bold`}>
              Página: {activeTab}
            </p>
            <button 
              onClick={() => setActiveTab('home')}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-xl font-bold"
            >
              Voltar ao Menu
            </button>
          </div>
        )}
      </main>

      <Navigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        isAprovador={isAprovador}
        temaEscuro={temaEscuro}
      />
    </div>
  );
}
