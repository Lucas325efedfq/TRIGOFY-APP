"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, ClipboardList, Send, ChevronRight, ShoppingBag, 
  Lock, UserCircle, LogOut, BookOpen, Plus, Trash2, Megaphone, History
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
        const formatado = data.records.map(reg => {
          let areaFinal = reg.fields.area || '';
          
          // TRAVA ABSOLUTA: Corrige nomes errados vindos do banco
          if (areaFinal.trim().toLowerCase() === "suplementos") areaFinal = "Suprimentos";
          if (areaFinal.trim().toLowerCase() === "painal") areaFinal = "Pane";
          if (areaFinal.trim().toLowerCase() === "centra de medidas") areaFinal = "Cozinha Central";

          return {
            id: reg.id,
            cpf: reg.fields.cpf || '',
            nome: reg.fields.nome || '',
            area: areaFinal
          };
        });
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

  const salvarNoAirtable = async () => {
    if (!novoCpf || !novoNome || !novaAreaAdmin) {
      alert("Por favor, preencha o CPF, o Nome e a Área.");
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
            area: novaAreaAdmin.trim() 
          }
        })
      });
      if (response.ok) {
        setNovoCpf('');
        setNovoNome('');
        setNovaAreaAdmin('');
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
  const [areaEncontrada, setAreaEncontrada] = useState('');
  const [novoCpf, setNovoCpf] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novaAreaAdmin, setNovaAreaAdmin] = useState('');

  useEffect(() => {
    const pessoa = pessoasCadastradas.find(p => p.cpf === cpfDigitado.replace(/\D/g, ''));
    if (pessoa) {
      setNomeEncontrado(pessoa.nome);
      // Segunda trava de segurança na busca local
      let areaLimpa = pessoa.area;
      if (areaLimpa.trim().toLowerCase() === "suplementos") areaLimpa = "Suprimentos";
      setAreaEncontrada(areaLimpa);
    } else {
      setNomeEncontrado('');
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

            <h3 className="text-zinc-800 font-extrabold text-lg px-2 mt-6 uppercase italic tracking-tighter">Ações Rápidas</h3>
            <div className="space-y-3">
              <div onClick={() => setActiveTab('pedidos')} className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-all group">
                <div className="bg-yellow-400 p-3 rounded-full text-zinc-900"><ShoppingBag size={20} /></div>
                <div className="flex-1 font-bold text-zinc-800 uppercase text-sm">Meus Pedidos</div>
                <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
              </div>

              <div onClick={() => setActiveTab('catalogo')} className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer hover:bg-yellow-50">
                <div className="bg-yellow-400 p-2 rounded-full w-11 h-11 flex items-center justify-center overflow-hidden">
                  <img src="/doacao.png" alt="Doação" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 font-bold text-zinc-800 uppercase text-sm">Solicitações de doações</div>
                <ChevronRight className="text-zinc-300" size={20} />
              </div>

              <div onClick={() => setActiveTab('rio-sp')} className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer hover:bg-yellow-50">
                <div className="bg-yellow-400 p-2 rounded-full w-11 h-11 flex items-center justify-center overflow-hidden">
                  <img src="/cesta.png" alt="Cesta" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 font-bold text-zinc-800 uppercase text-sm leading-tight">solicitações de compras RIO/SP</div>
                <ChevronRight className="text-zinc-300" size={20} />
              </div>

              <div onClick={() => setActiveTab('novo')} className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer hover:bg-yellow-50">
                <div className="bg-yellow-400 p-2 rounded-full w-11 h-11 flex items-center justify-center overflow-hidden">
                  <img src="/pizza.png" alt="Novo" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 font-bold text-zinc-800 uppercase text-sm">Produtos Disponíveis para compras</div>
                <ChevronRight className="text-zinc-300" size={20} />
              </div>

              {usuarioInput.toLowerCase() !== 'admin' && (
                <div onClick={() => setActiveTab('suporte')} className="bg-yellow-400 p-4 rounded-2xl shadow-md flex items-center gap-4 cursor-pointer active:scale-95 transition-all">
                  <div className="bg-zinc-900 p-3 rounded-full text-yellow-400"><Megaphone size={20} /></div>
                  <div className="flex-1 font-bold text-zinc-900 uppercase text-sm">Suporte</div>
                  <ChevronRight className="text-zinc-800" size={20} />
                </div>
              )}

              {usuarioInput.toLowerCase() === 'admin' && (
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
            <button onClick={() => setActiveTab('home')} className="text-zinc-400 font-bold text-xs uppercase mb-2">← Voltar</button>
            <div className="bg-white rounded-3xl shadow-sm border flex flex-col h-full overflow-hidden">
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
            <button onClick={() => setActiveTab('home')} className="text-zinc-400 font-bold text-xs uppercase mb-2">← Voltar</button>
            <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-5">
              <h2 className="text-lg font-bold text-zinc-800 uppercase italic border-b pb-2">Novo Pedido</h2>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase">Digite o CPF</label>
                <input type="text" placeholder="Apenas números" maxLength={11} className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={cpfDigitado} onChange={(e) => setCpfDigitado(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase">Nome do Solicitante</label>
                <input type="text" readOnly className="w-full p-4 border rounded-2xl font-bold bg-zinc-100 text-zinc-800" value={nomeEncontrado || "Aguardando CPF..."} />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase">Sua Área</label>
                <input type="text" readOnly className="w-full p-4 border rounded-2xl font-bold bg-zinc-100 text-zinc-800" value={areaEncontrada || "Aguardando Área..."} />
              </div>
              <button disabled={!nomeEncontrado} className={`w-full py-4 rounded-2xl font-black uppercase ${nomeEncontrado ? 'bg-zinc-900 text-yellow-400' : 'bg-zinc-200 text-zinc-400'}`}>ENVIAR PEDIDO</button>
            </div>
          </div>
        );

      case 'admin-painel':
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <button onClick={() => setActiveTab('home')} className="text-zinc-400 font-bold text-xs uppercase mb-2">← Voltar</button>
            <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
              <h2 className="text-lg font-bold uppercase italic border-b pb-2">Cadastrar na Nuvem</h2>
              <input type="text" placeholder="CPF" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={novoCpf} onChange={(e) => setNovoCpf(e.target.value)} />
              <input type="text" placeholder="Nome Completo" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
              <input type="text" placeholder="Área" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={novaAreaAdmin} onChange={(e) => setNovaAreaAdmin(e.target.value)} spellCheck="false" autoComplete="off" />
              
              <button onClick={salvarNoAirtable} className="w-full bg-yellow-400 text-zinc-900 py-3 rounded-2xl font-black uppercase text-sm">
                {carregando ? "Salvando..." : "Salvar no Airtable"}
              </button>
              
              <div className="pt-4 space-y-2">
                <h3 className="text-xs font-black text-zinc-400 uppercase">Lista Sincronizada</h3>
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {pessoasCadastradas.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border">
                      <div>
                        <p className="font-bold text-xs text-zinc-800">{p.nome}</p>
                        <p className="text-[10px] text-zinc-400">{p.cpf} - <span className="text-yellow-600 font-bold">{p.area}</span></p>
                      </div>
                      <button onClick={() => excluirDoAirtable(p.id)} className="text-red-400 p-2"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ==========================================================
  // 9. ESTRUTURA VISUAL FIXA (HEADER E MENU DE BAIXO)
  // ==========================================================
  return (
    <div className="flex justify-center bg-zinc-200 min-h-screen font-sans text-zinc-900">
      <div className="w-full max-w-[390px] bg-zinc-50 h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[55px] border-[10px] border-zinc-900 text-zinc-900">
        <header className="p-6 flex justify-between items-center bg-white border-b">
          <h1 className="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter">TRIGOFY</h1>
          <button onClick={fazerLogoff} className="text-zinc-400 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
        </header>
        <main className="flex-1 overflow-y-auto p-5 pb-32">{renderContent()}</main>
        <nav className="absolute bottom-8 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-3 flex justify-between rounded-full shadow-2xl border">
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-yellow-500' : 'text-zinc-300'}><LayoutGrid size={22} /></button>
          <button onClick={() => setActiveTab('pedidos')} className={activeTab === 'pedidos' ? 'text-yellow-500' : 'text-zinc-300'}><ShoppingBag size={22} /></button>
          <button onClick={() => setActiveTab('catalogo')} className={activeTab === 'catalogo' ? 'text-yellow-500' : 'text-zinc-300'}><BookOpen size={22} /></button>
          <button onClick={() => setActiveTab('novo')} className={activeTab === 'novo' ? 'text-yellow-500' : 'text-zinc-300'}><ClipboardList size={22} /></button>
        </nav>
      </div>
    </div>
  );
}