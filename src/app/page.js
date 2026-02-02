'use client';

import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Lock, User, ArrowLeft, Save, Settings, Shield
} from 'lucide-react';

// Hooks
import { useToast } from '../ganchos/useToast';
import { useTheme } from '../ganchos/useTheme';

// Services
import { 
  fetchPessoas, 
  fetchProdutos, 
  fetchUsuarios,
  updateRecord
} from '../servicos/airtableService';
import { 
  buscarPedidosPendentes as buscarPedidosPendentesService,
} from '../servicos/pedidosService';
import { buscarHistoricoCompleto } from '../servicos/historicoService';
import { 
  buscarDoacoesPendentes 
} from '../servicos/doacoesService';
import { buscarPendenciasContagem, enviarNotificacaoWhatsApp } from '../servicos/notificacaoService';


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
import HistoricoPage from '../componentes/paginas/HistoricoPage';
import AprovacoesPage from '../componentes/paginas/AprovacoesPage';


// Constants
import { ADMIN_USER } from '../constantes/roles';

export default function TrigofyApp() {
  // Estados de autenticação
  const [estaLogado, setEstaLogado] = useState(false);
  const [usuarioInput, setUsuarioInput] = useState('');
  const [usuarioLogadoOrigem, setUsuarioLogadoOrigem] = useState('');
  const [usuarioLogadoFuncao, setUsuarioLogadoFuncao] = useState('');
  const [usuarioLogadoCpf, setUsuarioLogadoCpf] = useState('');
  const [usuarioObjeto, setUsuarioObjeto] = useState(null);

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
  const [totalPendencias, setTotalPendencias] = useState(0);

  // Estados locais para Configurações (integrado)
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  
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

  const handleLogin = (usuario, origem, funcao, cpf) => {
    setEstaLogado(true);
    setUsuarioInput(usuario);
    setUsuarioLogadoOrigem(origem);
    setUsuarioLogadoFuncao(funcao);
    setUsuarioLogadoCpf(cpf || '');
    
    // Busca o objeto completo do usuário para uso em configurações
    const obj = usuariosAutorizados.find(u => u.usuario === usuario);
    setUsuarioObjeto(obj);

    showToast(`Bem-vindo, ${usuario}!`, 'success');
  };

  const handleLogout = () => {
    setEstaLogado(false);
    setActiveTab('home');
    setUsuarioInput('');
    setUsuarioLogadoOrigem('');
    setUsuarioLogadoFuncao('');
    setUsuarioLogadoCpf('');
    setUsuarioObjeto(null);
    setSiteFiltro('');
    setMeusPedidosHistorico([]);
    setPedidosParaAprovar([]);
    showToast('Logout realizado', 'success');
  };

  const carregarMeusPedidos = async () => {
    setCarregando(true);
    try {
      const historico = await buscarHistoricoCompleto(usuarioInput);
      setMeusPedidosHistorico(historico);
    } catch (error) {
      showToast('Erro ao carregar histórico', 'error');
    }
    setCarregando(false);
  };

  const carregarPedidosPendentes = async () => {
    setCarregando(true);
    try {
      const pedidosComuns = await buscarPedidosPendentesService();
      const doacoes = await buscarDoacoesPendentes();
      const listaCompleta = [...pedidosComuns, ...doacoes];
      setPedidosParaAprovar(listaCompleta);
      setTotalPendencias(listaCompleta.length);
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

  const handleAlterarSenhaInterno = async () => {
    if (!novaSenha || !confirmarSenha) return showToast("Preencha as senhas.", "error");
    if (novaSenha !== confirmarSenha) return showToast("As senhas não coincidem.", "error");
    
    setSalvandoSenha(true);
    try {
      if (!usuarioObjeto?.id) {
        showToast("Erro: Usuário não identificado. Tente relogar.", "error");
        return;
      }
      await updateRecord('USUARIOS', usuarioObjeto.id, { senha: novaSenha });
      
      // Recarregar a lista de usuários para que a nova senha seja reconhecida no sistema
      const novosUsuarios = await fetchUsuarios();
      setUsuariosAutorizados([ADMIN_USER, ...novosUsuarios]);
      
      // Atualizar o objeto do usuário logado no estado local
      const objAtualizado = novosUsuarios.find(u => u.id === usuarioObjeto.id);
      if (objAtualizado) setUsuarioObjeto(objAtualizado);

      showToast("✅ Senha alterada com sucesso!", "success");
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (e) {
      showToast("Erro ao salvar senha.", "error");
    } finally {
      setSalvandoSenha(false);
    }
  };

  const isAdmin = usuarioLogadoFuncao === 'ADMIN';
  const isAprovador = usuarioLogadoFuncao === 'APROVADOR';

  if (!estaLogado) {
    return (
      <div className={bgMain}>
        <LoginPage 
          onLogin={handleLogin} 
          usuariosAutorizados={usuariosAutorizados} 
          temaEscuro={temaEscuro} 
          toggleTheme={toggleTheme}
        />
        <Toast toast={toast} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgMain} transition-colors duration-500`}>
      <Header 
        usuarioInput={usuarioInput} 
        usuarioLogadoOrigem={usuarioLogadoOrigem}
        usuarioLogadoFuncao={usuarioLogadoFuncao}
        onLogout={handleLogout}
        temaEscuro={temaEscuro}
        toggleTheme={toggleTheme}
      />

      <main className="container mx-auto px-4 pt-24 pb-32">
        <Toast toast={toast} />

        {activeTab === 'home' && (
          <HomePage 
            usuarioInput={usuarioInput}
            usuarioLogadoFuncao={usuarioLogadoFuncao}
            setActiveTab={setActiveTab}
            temaEscuro={temaEscuro}
            totalPendencias={totalPendencias}
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
            usuarioLogadoCpf={usuarioLogadoCpf}
            isAdmin={isAdmin}
            siteFiltro={siteFiltro}
            pessoasCadastradas={pessoasCadastradas}
            produtosLancados={produtosLancados}
            temaEscuro={temaEscuro}
            showToast={showToast}
            setActiveTab={setActiveTab}
            onNotificarAprovador={enviarNotificacaoWhatsApp}
          />
        )}

        {activeTab === 'doacoes' && (
          <DoacoesPage 
            usuarioInput={usuarioInput}
            usuarioLogadoCpf={usuarioLogadoCpf}
            isAdmin={isAdmin}
            pessoasCadastradas={pessoasCadastradas}
            temaEscuro={temaEscuro}
            showToast={showToast}
            setActiveTab={setActiveTab}
            onNotificarAprovador={enviarNotificacaoWhatsApp}
          />
        )}

        {activeTab === 'cancelamentos' && (
          <CancelamentosPage 
            usuarioInput={usuarioInput}
            usuarioLogadoCpf={usuarioLogadoCpf}
            isAdmin={isAdmin}
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

        {activeTab === 'historico' && (
          <HistoricoPage 
            historico={meusPedidosHistorico}
            temaEscuro={temaEscuro}
            setActiveTab={setActiveTab}
            carregando={carregando}
          />
        )}

        {activeTab === 'aprovacoes' && (isAdmin || isAprovador) && (
          <AprovacoesPage 
            pedidosParaAprovar={pedidosParaAprovar}
            onAtualizarStatus={handleAtualizarStatus}
            temaEscuro={temaEscuro}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'configuracoes' && (
          <div className="animate-in fade-in duration-500 pb-32 space-y-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setActiveTab('home')} className={`${textSub} flex items-center gap-2 font-bold text-xs uppercase`}>
                <ArrowLeft size={16} /> Voltar
              </button>
              <h2 className={`text-lg font-black uppercase italic ${textMain}`}>Ajustes</h2>
            </div>

            <div className={`${bgCard} p-6 rounded-3xl border shadow-xl`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
                  <User size={24} />
                </div>
                <div>
                  <h3 className={`font-black uppercase ${textMain}`}>{usuarioInput || 'Usuário'}</h3>
                  <p className={`text-[10px] font-bold uppercase opacity-60 ${textSub}`}>
                    {usuarioLogadoFuncao} • {usuarioLogadoOrigem}
                  </p>
                </div>
              </div>

              <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-4 rounded-2xl border ${bgMain}`}>
                <div className="flex items-center gap-3">
                  {temaEscuro ? <Moon className="text-yellow-500" size={20} /> : <Sun className="text-yellow-500" size={20} />}
                  <span className={`font-bold text-sm ${textMain}`}>Modo Escuro</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative ${temaEscuro ? 'bg-yellow-500' : 'bg-zinc-300'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${temaEscuro ? 'right-1' : 'left-1'}`} />
                </div>
              </button>
            </div>

            <div className={`${bgCard} p-6 rounded-3xl border shadow-xl space-y-4`}>
              <div className="flex items-center gap-3 mb-2">
                <Lock className="text-rose-500" size={20} />
                <h3 className={`font-black uppercase italic ${textMain}`}>Segurança</h3>
              </div>
              <input 
                type="password" placeholder="Nova Senha" 
                className={`w-full p-4 ${bgMain} border rounded-2xl outline-none ${textMain} font-bold`} 
                value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} 
              />
              <input 
                type="password" placeholder="Confirmar Senha" 
                className={`w-full p-4 ${bgMain} border rounded-2xl outline-none ${textMain} font-bold`} 
                value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} 
              />
              <button 
                onClick={handleAlterarSenhaInterno} disabled={salvandoSenha}
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2"
              >
                {salvandoSenha ? "Salvando..." : <><Save size={16} /> Salvar Senha</>}
              </button>
            </div>
          </div>
        )}

        {/* Fallback para abas não implementadas */}
        {activeTab !== 'home' && activeTab !== 'compras-aba' && activeTab !== 'novo' && activeTab !== 'doacoes' && activeTab !== 'cancelamentos' && activeTab !== 'suporte' && activeTab !== 'admin-painel' && activeTab !== 'historico' && activeTab !== 'aprovacoes' && activeTab !== 'configuracoes' && (
          <div className={`${bgCard} p-6 rounded-3xl shadow-sm border`}>
            <p className={`${textMain} font-bold`}>Página: {activeTab}</p>
            <button onClick={() => setActiveTab('home')} className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-xl font-bold">Voltar ao Menu</button>
          </div>
        )}
      </main>

      <Navigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        isAprovador={isAprovador}
        temaEscuro={temaEscuro}
        totalPendencias={totalPendencias}
      />
    </div>
  );
}
