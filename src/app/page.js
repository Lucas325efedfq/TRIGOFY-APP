"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  ClipboardList, 
  Settings, 
  User, 
  Send, 
  ChevronRight, 
  ShoppingBag, 
  Package, 
  Megaphone, 
  Lock, 
  UserCircle, 
  LogOut,
  BookOpen,
  History,
  Plus,
  Trash2
} from 'lucide-react';

export default function TrigofyApp() {
  const [estaLogado, setEstaLogado] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [usuarioInput, setUsuarioInput] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // --- BANCO DE DADOS DE PESSOAS (Simulado) ---
  const [listaPessoas, setListaPessoas] = useState([
    { cpf: '12345678900', nome: 'LUCAS VIEIRA' },
    { cpf: '98765432100', nome: 'JOÃO SILVA' }
  ]);

  // --- ESTADOS DO FORMULÁRIO DE PEDIDO ---
  const [cpfBusca, setCpfBusca] = useState('');
  const [nomeSolicitante, setNomeSolicitante] = useState('');

  // --- ESTADOS DO PAINEL ADMIN ---
  const [novoCpf, setNovoCpf] = useState('');
  const [novoNome, setNovoNome] = useState('');

  // Lógica para preencher nome automaticamente ao digitar CPF
  useEffect(() => {
    const pessoa = listaPessoas.find(p => p.cpf === cpfBusca.replace(/\D/g, ''));
    if (pessoa) {
      setNomeSolicitante(pessoa.nome);
    } else {
      setNomeSolicitante('');
    }
  }, [cpfBusca, listaPessoas]);

  const usuariosAutorizados = [
    { usuario: 'lucas.vieira', senha: '123' },
    { usuario: 'admin', senha: 'admin' }
  ];

  const lidarComLogin = (e) => {
    e.preventDefault();
    const usuarioEncontrado = usuariosAutorizados.find(
      (u) => u.usuario === usuarioInput.toLowerCase() && u.senha === senha
    );

    if (usuarioEncontrado) {
      setEstaLogado(true);
      setErro('');
    } else {
      setErro('Usuário ou senha incorretos.');
    }
  };

  const fazerLogoff = () => {
    setEstaLogado(false);
    setUsuarioInput('');
    setSenha('');
    setActiveTab('home');
  };

  const adicionarPessoa = () => {
    if (novoCpf && novoNome) {
      setListaPessoas([...listaPessoas, { cpf: novoCpf.replace(/\D/g, ''), nome: novoNome.toUpperCase() }]);
      setNovoCpf('');
      setNovoNome('');
      alert('Cadastro realizado com sucesso!');
    }
  };

  const removerPessoa = (cpf) => {
    setListaPessoas(listaPessoas.filter(p => p.cpf !== cpf));
  };

  if (!estaLogado) {
    return (
      <div className="flex justify-center bg-zinc-200 min-h-screen sm:py-6 font-sans text-zinc-900">
        <div className="w-full max-w-[390px] bg-white h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[55px] border-[10px] border-zinc-900 p-8 justify-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black italic text-yellow-500 tracking-tighter mb-2 text-center uppercase">TRIGOFY</h1>
          </div>
          <form onSubmit={lidarComLogin} className="space-y-4">
            <div className="relative">
              <UserCircle className="absolute left-4 top-4 text-zinc-400" size={20} />
              <input type="text" placeholder="Nome de Usuário" className="w-full p-4 pl-12 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 text-zinc-800" value={usuarioInput} onChange={(e) => setUsuarioInput(e.target.value)} required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-zinc-400" size={20} />
              <input type="password" placeholder="Sua senha" className="w-full p-4 pl-12 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 text-zinc-800" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            {erro && <p className="text-red-500 text-xs font-bold text-center">{erro}</p>}
            <button type="submit" className="w-full bg-zinc-900 text-yellow-400 py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all uppercase tracking-widest">ENTRAR</button>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-4 animate-in fade-in duration-500 pb-10 text-zinc-900">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-3xl text-zinc-900 shadow-lg flex items-center gap-4 border border-yellow-300">
              <div className="bg-white p-2 rounded-2xl shadow-inner w-16 h-16 flex items-center justify-center overflow-hidden text-zinc-900">
                <img src="/favicon.ico" alt="Logo" className="w-full h-full object-contain scale-125 text-zinc-900" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Grupo Trigo</h2>
                <p className="text-yellow-900/80 text-sm font-medium italic">Olá, {usuarioInput}!</p>
              </div>
            </div>

            <h3 className="text-zinc-800 font-extrabold text-lg px-2 mt-6 uppercase italic tracking-tighter">Ações Rápidas</h3>
            
            <div className="space-y-3">
              <div onClick={() => setActiveTab('pedidos')} className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-all group">
                <div className="bg-yellow-400 p-3 rounded-full text-zinc-900 shadow-sm"><ShoppingBag size={20} /></div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-800 uppercase text-sm">Meus Pedidos</p>
                  <p className="text-[10px] text-zinc-400 font-bold">HISTÓRICO E STATUS</p>
                </div>
                <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
              </div>

              {usuarioInput.toLowerCase() === 'admin' && (
                <div onClick={() => setActiveTab('admin-painel')} className="bg-zinc-900 p-4 rounded-2xl shadow-sm flex items-center gap-4 cursor-pointer hover:bg-zinc-800 transition-all group">
                  <div className="bg-yellow-400 p-3 rounded-full text-zinc-900 shadow-sm"><Plus size={20} /></div>
                  <div className="flex-1">
                    <p className="font-bold text-white uppercase text-sm italic">Painel Admin - Cadastros</p>
                    <p className="text-[10px] text-zinc-500 font-bold">VINCULAR CPF A NOMES</p>
                  </div>
                  <ChevronRight className="text-zinc-600 group-hover:text-yellow-500" size={20} />
                </div>
              )}

              <div onClick={() => setActiveTab('catalogo')} className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-all group">
                <div className="bg-yellow-400 p-2 rounded-full text-zinc-900 shadow-sm flex items-center justify-center w-11 h-11 overflow-hidden">
                  <img src="/doacao.png" alt="Doações" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-800 uppercase text-sm">Solicitações de doações</p>
                  <p className="text-[10px] text-zinc-400 font-bold">GESTÃO DE DOAÇÕES</p>
                </div>
                <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
              </div>

              <div onClick={() => setActiveTab('novo')} className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 cursor-pointer hover:bg-yellow-50 transition-all group">
                <div className="bg-yellow-400 p-2 rounded-full text-zinc-900 shadow-sm flex items-center justify-center w-11 h-11 overflow-hidden">
                  <img src="/pizza.png" alt="Novo Pedido" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-800 uppercase text-sm">Novo Pedido</p>
                  <p className="text-[10px] text-zinc-400 font-bold">SOLICITAR COMPRA</p>
                </div>
                <ChevronRight className="text-zinc-300 group-hover:text-yellow-500" size={20} />
              </div>
            </div>
          </div>
        );

      case 'novo':
        return (
          <div className="animate-in slide-in-from-right duration-300 text-zinc-900">
            <button onClick={() => setActiveTab('home')} className="text-zinc-400 font-bold text-xs uppercase mb-2 flex items-center gap-1">← Voltar</button>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 space-y-5">
              <h2 className="text-lg font-bold text-zinc-800 uppercase italic tracking-tighter border-b pb-2">Novo Pedido</h2>
              
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Digite o CPF</label>
                <input 
                  type="text" 
                  placeholder="Ex: 12345678900" 
                  maxLength={11}
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400"
                  value={cpfBusca}
                  onChange={(e) => setCpfBusca(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Nome do Solicitante</label>
                <input 
                  type="text" 
                  readOnly 
                  placeholder={cpfBusca.length === 11 ? "CPF não cadastrado" : "Aguardando CPF..."}
                  className={`w-full p-4 border rounded-2xl outline-none font-bold ${nomeSolicitante ? 'bg-yellow-50 border-yellow-200 text-zinc-800' : 'bg-zinc-100 text-zinc-400 border-zinc-100'}`}
                  value={nomeSolicitante}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Observações</label>
                <textarea placeholder="Detalhes do pedido..." rows="3" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400"></textarea>
              </div>

              <button disabled={!nomeSolicitante} className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg active:scale-95 transition-all ${nomeSolicitante ? 'bg-zinc-900 text-yellow-400' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}>
                <Send size={18} /> ENVIAR PEDIDO
              </button>
            </div>
          </div>
        );

      case 'admin-painel':
        return (
          <div className="animate-in slide-in-from-right duration-300 text-zinc-900">
            <button onClick={() => setActiveTab('home')} className="text-zinc-400 font-bold text-xs uppercase mb-2 flex items-center gap-1">← Voltar</button>
            <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-4">
              <h2 className="text-lg font-bold uppercase italic tracking-tighter border-b pb-2">Cadastrar Colaborador</h2>
              <input type="text" placeholder="CPF (apenas números)" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={novoCpf} onChange={(e) => setNovoCpf(e.target.value)} />
              <input type="text" placeholder="Nome Completo" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
              <button onClick={adicionarPessoa} className="w-full bg-yellow-400 text-zinc-900 py-3 rounded-2xl font-black uppercase text-sm">Salvar Cadastro</button>
              
              <div className="pt-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase mb-3">Pessoas no Sistema</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {listaPessoas.map(p => (
                    <div key={p.cpf} className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                      <div>
                        <p className="font-bold text-[11px] text-zinc-800">{p.nome}</p>
                        <p className="text-[10px] text-zinc-400 font-medium">{p.cpf}</p>
                      </div>
                      <button onClick={() => removerPessoa(p.cpf)} className="text-red-400 p-2"><Trash2 size={16}/></button>
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

  return (
    <div className="flex justify-center bg-zinc-200 min-h-screen sm:py-6 font-sans">
      <div className="w-full max-w-[390px] bg-zinc-50 h-[844px] shadow-2xl overflow-hidden flex flex-col relative sm:rounded-[55px] border-[10px] border-zinc-900 text-zinc-900">
        <div className="h-7 w-full bg-white flex justify-center items-start">
          <div className="w-32 h-5 bg-zinc-900 rounded-b-2xl"></div>
        </div>
        <header className="p-6 flex justify-between items-center bg-white border-b border-zinc-50">
          <h1 className="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter">TRIGOFY</h1>
          <button onClick={fazerLogoff} className="flex items-center gap-2 bg-zinc-100 px-3 py-2 rounded-xl text-zinc-500 border border-zinc-100 active:bg-red-50 transition-all">
            <span className="text-[10px] font-black uppercase tracking-tighter">Sair</span>
            <LogOut size={16} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-5 pb-32 text-zinc-900">
          {renderContent()}
        </main>
        <nav className="absolute bottom-8 left-4 right-4 bg-white/95 backdrop-blur-md border border-zinc-100 px-4 py-3 flex justify-between items-center rounded-full shadow-2xl">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'home' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}`}>
            <LayoutGrid size={22} />
          </button>
          <button onClick={() => setActiveTab('pedidos')} className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'pedidos' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}`}>
            <ShoppingBag size={22} />
          </button>
          <button onClick={() => setActiveTab('catalogo')} className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'catalogo' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}`}>
            <BookOpen size={22} />
          </button>
          <button onClick={() => setActiveTab('novo')} className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === 'novo' ? 'text-yellow-500 scale-110' : 'text-zinc-300'}`}>
            <ClipboardList size={22} />
          </button>
        </nav>
        <div className="absolute bottom-2 w-full flex justify-center">
          <div className="w-28 h-1 bg-zinc-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}