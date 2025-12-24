"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Send, ChevronRight, ShoppingBag, 
  LogOut, BookOpen, Plus, Trash2, Megaphone, Settings, Sun, Moon, User
} from 'lucide-react';

// ==========================================================
// 1. CONFIGURAÇÕES DE CONEXÃO (AIRTABLE)
// ==========================================================
const AIRTABLE_TOKEN = 'patSTombPP4bmw0AK.43e89e93f885283e025cc1c7636c3af9053c953ca812746652c883757c25cd9a';
const BASE_ID = 'appj9MPXg5rVQf3zK';
const TABLE_ID = 'tblcgAQwSPe8NcvRN';

export default function TrigofyApp() {
  const [estaLogado, setEstaLogado] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [usuarioInput, setUsuarioInput] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [pessoasCadastradas, setPessoasCadastradas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  // NOVO: Estado para controle de tema (Claro/Escuro)
  const [temaEscuro, setTemaEscuro] = useState(false);

  // Estados para o Chat do Triger
  const [mensagens, setMensagens] = useState([
    { id: 1, texto: "Olá! Eu sou o Triger, seu suporte inteligente. Como posso te ajudar hoje?", bot: true }
  ]);
  const [inputChat, setInputChat] = useState('');

  // ==========================================================
  // 2. CADASTRO DE USUÁRIOS (LOGINS DO APP)
  // ==========================================================
  const usuariosAutorizados = [
    { usuario: 'admin', senha: 'T!$&gur001' },
    { usuario: 'lucas.vieira', senha: '123' },
    { usuario: 'lucas.lopes', senha: '456'  },
  ];

  // ==========================================================
  // 3. FUNÇÕES DE BANCO DE DADOS (COMUNICAÇÃO COM NUVEM)
  // ==========================================================
  const buscarDadosAirtable = async () => {
    setCarregando(true);
    try {
      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
        headers: { 
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (data.records) {
        const formatado = data.records.map(reg => ({
          id: reg.id,
          cpf: reg.fields.cpf || '',
          nome: reg.fields.nome || ''
        }));
        setPessoasCadastradas(formatado);
      }
    } catch (e) {
      console.error("Erro ao buscar dados:", e);
    }
    setCarregando(false);
  };

  useEffect(() => {
    buscarDadosAirtable();
  }, []);

  const [novoCpf, setNovoCpf] = useState('');
  const [novoNome, setNovoNome] = useState('');

  const salvarNoAirtable = async () => {
    if (!novoCpf || !novoNome) {
      alert("Por favor, preencha o CPF e o Nome.");
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
    } else {
      setNomeEncontrado('');
    }
  }, [cpfDigitado, pessoasCadastradas]);

  const lidarComLogin = (e) => {
    e.preventDefault();
    const encontrou = usuariosAutorizados.find(
      (u) => u.usuario === usuarioInput.toLowerCase() && u.senha === senha
    );

    if (encontrou) {
      setEstaLogado(true);
      setErro('');
    } else {
      setErro('Usuário ou senha incorretos.');
    }
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
    setUsuarioInput(''); // Limpa o campo de usuário
    setSenha('');        // Limpa o campo de senha
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
            <input type="text" placeholder="Usuário" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={usuarioInput} onChange={(e) => setUsuarioInput(e.target.value)} required />
            <input type="password" placeholder="Senha" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            {erro && <p className="text-red-500 text-xs text-center font-bold">{erro}</p>}
            <button type="submit" className="w-full bg-zinc-900 text-yellow-400 py-4 rounded-2xl font-black uppercase shadow-lg">ENTRAR</button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================================
  // 6. CONTEÚDO PRINCIPAL (RENDERIZAÇÃO DE ABAS)
  // ==========================================================
  const renderContent = () => {
    const isAdmin = usuarioInput.toLowerCase() === 'admin';
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
              {isAdmin ? 'Controle Admin' : 'Ações Rápidas'}
            </h3>
            <div className="space-y-3">
              {!isAdmin ? (
                <>
                  <div onClick={() => setActiveTab('pedidos')} className={`${bgCard} p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-all group`}>
                    <div className="bg-yellow-400 p-3 rounded-full text-zinc-900"><ShoppingBag size={20} /></div>
                    <div className={`flex-1 font-bold uppercase text-sm ${textMain}`}>Meus Pedidos</div>
                    <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
                  </div>

                  <div onClick={() => setActiveTab('catalogo')} className={`${bgCard} p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer hover:bg-yellow-50`}>
                    <div className="bg-yellow-400 p-2 rounded-full w-11 h-11 flex items-center justify-center overflow-hidden">
                      <img src="/doacao.png" alt="Doação" className="w-full h-full object-contain" />
                    </div>
                    <div className={`flex-1 font-bold uppercase text-sm ${textMain}`}>Solicitações de doações</div>
                    <ChevronRight className="text-zinc-300" size={20} />
                  </div>

                  <div onClick={() => setActiveTab('rio-sp')} className={`${bgCard} p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer hover:bg-yellow-50`}>
                    <div className="bg-yellow-400 p-2 rounded-full w-11 h-11 flex items-center justify-center overflow-hidden">
                      <img src="/cesta.png" alt="Cesta" className="w-full h-full object-contain" />
                    </div>
                    <div className={`flex-1 font-bold uppercase text-sm leading-tight ${textMain}`}>solicitações de compras RIO/SP</div>
                    <ChevronRight className="text-zinc-300" size={20} />
                  </div>

                  <div onClick={() => setActiveTab('novo')} className={`${bgCard} p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer hover:bg-yellow-50`}>
                    <div className="bg-yellow-400 p-2 rounded-full w-11 h-11 flex items-center justify-center overflow-hidden">
                      <img src="/pizza.png" alt="Novo" className="w-full h-full object-contain" />
                    </div>
                    <div className={`flex-1 font-bold uppercase text-sm ${textMain}`}>Produtos Disponíveis para compras</div>
                    <ChevronRight className="text-zinc-300" size={20} />
                  </div>

                  <div onClick={() => setActiveTab('suporte')} className="bg-yellow-400 p-4 rounded-2xl shadow-md flex items-center gap-4 cursor-pointer active:scale-95 transition-all">
                    <div className="bg-zinc-900 p-3 rounded-full text-yellow-400"><Megaphone size={20} /></div>
                    <div className="flex-1 font-bold text-zinc-900 uppercase text-sm">Suporte</div>
                    <ChevronRight className="text-zinc-800" size={20} />
                  </div>
                </>
              ) : (
                <div onClick={() => setActiveTab('admin-painel')} className="bg-zinc-900 p-4 rounded-2xl shadow-sm flex items-center gap-4 cursor-pointer hover:bg-zinc-800">
                  <div className="bg-yellow-400 p-3 rounded-full text-zinc-900"><Plus size={20} /></div>
                  <div className="flex-1 text-white font-bold uppercase text-sm italic">Painel Admin - Nuvem</div>
                  <ChevronRight className="text-zinc-600" size={20} />
                </div>
              )}
            </div>
          </div>
        );

      case 'suporte':
        return (
          <div className="animate-in slide-in-from-right duration-300 flex flex-col h-full max-h-[600px]">
            <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase mb-2`}>← Voltar</button>
            <div className={`${bgCard} rounded-3xl shadow-sm border flex flex-col h-full overflow-hidden`}>
              <div className="bg-zinc-900 p-4 flex items-center gap-3">
                <div className="bg-yellow-400 w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                  <img src="/triger.png" alt="Triger" className="w-full h-full object-cover" />
                </div>
                <span className="text-yellow-400 font-black uppercase text-xs italic">Agente Triger</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50">
                {mensagens.map(msg => (
                  <div key={msg.id} className={`flex ${msg.bot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-bold ${msg.bot ? 'bg-white text-zinc-800 border' : 'bg-yellow-400 text-zinc-900 shadow-sm'}`}>
                      {msg.texto}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={enviarMensagemChat} className="p-4 border-t bg-white flex gap-2">
                <input type="text" placeholder="Sua dúvida..." className="flex-1 bg-zinc-100 p-3 rounded-xl text-xs outline-none focus:ring-2 focus:ring-yellow-400" value={inputChat} onChange={(e) => setInputChat(e.target.value)} />
                <button type="submit" className="bg-zinc-900 text-yellow-400 p-3 rounded-xl"><Send size={18} /></button>
              </form>
            </div>
          </div>
        );

      case 'novo':
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase mb-2`}>← Voltar</button>
            <div className={`${bgCard} p-6 rounded-3xl shadow-sm border space-y-5`}>
              <h2 className={`text-lg font-bold uppercase italic border-b pb-2 ${textMain}`}>Novo Pedido</h2>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase">Digite o CPF</label>
                <input type="text" placeholder="Apenas números" maxLength={11} className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={cpfDigitado} onChange={(e) => setCpfDigitado(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase">Nome do Solicitante</label>
                <input type="text" readOnly className={`w-full p-4 border rounded-2xl font-bold ${temaEscuro ? 'bg-zinc-900 text-zinc-400 border-zinc-700' : 'bg-zinc-100 text-zinc-800'}`} value={nomeEncontrado || "Aguardando CPF..."} />
              </div>
              <button disabled={!nomeEncontrado} className={`w-full py-4 rounded-2xl font-black uppercase ${nomeEncontrado ? 'bg-zinc-900 text-yellow-400' : 'bg-zinc-200 text-zinc-400'}`}>ENVIAR PEDIDO</button>
            </div>
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
          <div className="animate-in slide-in-from-right duration-300">
            <button onClick={() => setActiveTab('home')} className={`${textSub} font-bold text-xs uppercase mb-2`}>← Voltar</button>
            <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-4`}>
              <h2 className={`text-lg font-bold uppercase italic border-b pb-2 ${textMain}`}>Cadastrar na Nuvem</h2>
              <input type="text" placeholder="CPF" className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={novoCpf} onChange={(e) => setNovoCpf(e.target.value)} />
              <input type="text" placeholder="Nome Completo" className={`w-full p-4 rounded-2xl outline-none border ${temaEscuro ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-50'}`} value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
              <button onClick={salvarNoAirtable} className="w-full bg-yellow-400 text-zinc-900 py-3 rounded-2xl font-black uppercase text-sm">
                {carregando ? "Salvando..." : "Salvar no Airtable"}
              </button>
              <div className="max-h-[250px] overflow-y-auto space-y-2 pt-4">
                {pessoasCadastradas.map(p => (
                  <div key={p.id} className={`flex justify-between items-center p-3 rounded-xl border ${temaEscuro ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50'}`}>
                    <div>
                      <p className={`font-bold text-xs ${textMain}`}>{p.nome}</p>
                      <p className="text-[10px] text-zinc-400">{p.cpf}</p>
                    </div>
                    <button onClick={() => excluirDoAirtable(p.id)} className="text-red-400 p-2"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ==========================================================
  // 7. ESTRUTURA VISUAL (HEADER, MAIN E NAV)
  // ==========================================================
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
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-yellow-500' : 'text-zinc-300'}><LayoutGrid size={22} /></button>
          <button onClick={() => setActiveTab('pedidos')} className={activeTab === 'pedidos' ? 'text-yellow-500' : 'text-zinc-300'}><ShoppingBag size={22} /></button>
          <button onClick={() => setActiveTab('catalogo')} className={activeTab === 'catalogo' ? 'text-yellow-500' : 'text-zinc-300'}><BookOpen size={22} /></button>
          <button onClick={() => setActiveTab('config')} className={activeTab === 'config' ? 'text-yellow-500' : 'text-zinc-300'}><Settings size={22} /></button>
        </nav>
      </div>
    </div>
  );
}