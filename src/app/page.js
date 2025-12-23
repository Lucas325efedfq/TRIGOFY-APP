"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, ClipboardList, Send, ChevronRight, ShoppingBag, 
  Lock, UserCircle, LogOut, BookOpen, Plus, Trash2, Megaphone, History
} from 'lucide-react';

// ==========================================================
// CONFIGURAÇÕES DE CONEXÃO
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

  // Estados de Cadastro e Busca
  const [cpfDigitado, setCpfDigitado] = useState('');
  const [nomeEncontrado, setNomeEncontrado] = useState('');
  const [areaEncontrada, setAreaEncontrada] = useState('');
  const [novoCpf, setNovoCpf] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novaAreaAdmin, setNovaAreaAdmin] = useState('');

  const usuariosAutorizados = [
    { usuario: 'admin', senha: 'T!$&gur001' },
    { usuario: 'lucas.vieira', senha: '123' },
    { usuario: 'lucas.lopes', senha: '456' },
  ];

  const buscarDadosAirtable = async () => {
    setCarregando(true);
    try {
      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, "Content-Type": "application/json" }
      });
      const data = await response.json();
      if (data.records) {
        const formatado = data.records.map(reg => ({
          id: reg.id,
          cpf: reg.fields.cpf || '',
          nome: reg.fields.nome || '',
          area: reg.fields.area || ''
        }));
        setPessoasCadastradas(formatado);
      }
    } catch (e) { console.error("Erro ao buscar:", e); }
    setCarregando(false);
  };

  useEffect(() => { buscarDadosAirtable(); }, []);

  const salvarNoAirtable = async (e) => {
    if(e) e.preventDefault();
    if (!novoCpf || !novoNome || !novaAreaAdmin) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
    setCarregando(true);
    try {
      const corpoParaEnviar = {
        fields: {
          cpf: novoCpf.replace(/\D/g, ''),
          nome: novoNome.toUpperCase().trim(),
          area: novaAreaAdmin.trim() // Envia exatamente o que você digitou
        }
      };

      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(corpoParaEnviar)
      });

      if (response.ok) {
        setNovoCpf(''); setNovoNome(''); setNovaAreaAdmin('');
        await buscarDadosAirtable();
        alert("✅ Cadastro realizado com sucesso!");
      } else {
        alert("Erro ao salvar no Airtable. Verifique se o nome da coluna está correto.");
      }
    } catch (e) { alert("Erro de conexão."); }
    setCarregando(false);
  };

  const excluirDoAirtable = async (id) => {
    if (!confirm("Deseja excluir este registro?")) return;
    await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
    });
    buscarDadosAirtable();
  };

  useEffect(() => {
    const pessoa = pessoasCadastradas.find(p => p.cpf === cpfDigitado.replace(/\D/g, ''));
    if (pessoa) {
      setNomeEncontrado(pessoa.nome);
      setAreaEncontrada(pessoa.area);
    } else {
      setNomeEncontrado('');
      setAreaEncontrada('');
    }
  }, [cpfDigitado, pessoasCadastradas]);

  const lidarComLogin = (e) => {
    e.preventDefault();
    const encontrou = usuariosAutorizados.find(u => u.usuario === usuarioInput.toLowerCase() && u.senha === senha);
    if (encontrou) { setEstaLogado(true); setErro(''); } else { setErro('Usuário ou senha inválidos.'); }
  };

  const fazerLogoff = () => { setEstaLogado(false); setActiveTab('home'); };

  if (!estaLogado) {
    return (
      <div className="flex justify-center bg-zinc-200 min-h-screen font-sans">
        <div className="w-full max-w-[390px] bg-white h-[844px] shadow-2xl flex flex-col p-8 justify-center border-[10px] border-zinc-900 sm:rounded-[55px]">
          <h1 className="text-4xl font-black italic text-yellow-500 uppercase text-center mb-10 tracking-tighter">TRIGOFY</h1>
          <form onSubmit={lidarComLogin} className="space-y-4">
            <input type="text" placeholder="Usuário" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={usuarioInput} onChange={(e) => setUsuarioInput(e.target.value)} required />
            <input type="password" placeholder="Senha" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            {erro && <p className="text-red-500 text-xs text-center font-bold">{erro}</p>}
            <button type="submit" className="w-full bg-zinc-900 text-yellow-400 py-4 rounded-2xl font-black uppercase">ENTRAR</button>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-4 pb-10">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-3xl flex items-center gap-4">
              <div className="bg-white p-2 rounded-2xl w-16 h-16 flex items-center justify-center overflow-hidden">
                <img src="/favicon.ico" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div><h2 className="text-xl font-black text-zinc-900">Grupo Trigo</h2><p className="italic text-zinc-800 text-sm">Olá, {usuarioInput}!</p></div>
            </div>
            <div className="space-y-3">
              <div onClick={() => setActiveTab('novo')} className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4 cursor-pointer">
                <div className="bg-yellow-400 p-2 rounded-full w-11 h-11 flex items-center justify-center"><img src="/pizza.png" className="w-8 h-8 object-contain" /></div>
                <div className="flex-1 font-bold uppercase text-sm">Produtos para compras</div>
                <ChevronRight size={20} className="text-zinc-300" />
              </div>
              {usuarioInput.toLowerCase() === 'admin' && (
                <div onClick={() => setActiveTab('admin-painel')} className="bg-zinc-900 p-4 rounded-2xl flex items-center gap-4 cursor-pointer">
                  <div className="bg-yellow-400 p-3 rounded-full text-zinc-900"><Plus size={20} /></div>
                  <div className="flex-1 text-white font-bold uppercase text-sm italic">Painel Admin - Nuvem</div>
                  <ChevronRight className="text-zinc-600" size={20} />
                </div>
              )}
            </div>
          </div>
        );
      case 'novo':
        return (
          <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-5">
            <button onClick={() => setActiveTab('home')} className="text-xs font-bold uppercase text-zinc-400">← Voltar</button>
            <h2 className="text-lg font-bold italic border-b pb-2">NOVO PEDIDO</h2>
            <input type="text" placeholder="CPF" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={cpfDigitado} onChange={(e) => setCpfDigitado(e.target.value)} />
            <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase">Nome</label>
                <input type="text" readOnly className="w-full p-4 border rounded-2xl bg-zinc-100 font-bold" value={nomeEncontrado || "Aguardando CPF..."} />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase">Sua Área</label>
                <input type="text" readOnly className="w-full p-4 border rounded-2xl bg-zinc-100 font-bold" value={areaEncontrada || "Aguardando CPF..."} />
            </div>
            <button disabled={!nomeEncontrado} className={`w-full py-4 rounded-2xl font-black uppercase ${nomeEncontrado ? 'bg-zinc-900 text-yellow-400 shadow-lg' : 'bg-zinc-200 text-zinc-400'}`}>ENVIAR</button>
          </div>
        );
      case 'admin-painel':
        return (
          <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
            <button onClick={() => setActiveTab('home')} className="text-xs font-bold uppercase text-zinc-400">← Voltar</button>
            <h2 className="text-lg font-bold italic border-b pb-2 uppercase">Cadastrar na Nuvem</h2>
            <input type="text" placeholder="CPF" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={novoCpf} onChange={(e) => setNovoCpf(e.target.value)} autoComplete="off" />
            <input type="text" placeholder="Nome" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none uppercase" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} autoComplete="off" spellCheck="false" />
            <input type="text" placeholder="Área Exata (Ex: Suprimentos, Pane...)" className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none" value={novaAreaAdmin} onChange={(e) => setNovaAreaAdmin(e.target.value)} autoComplete="off" spellCheck="false" />
            <button onClick={salvarNoAirtable} className="w-full bg-yellow-400 text-zinc-900 py-4 rounded-2xl font-black uppercase shadow-md">{carregando ? "Salvando..." : "Salvar no Airtable"}</button>
            <div className="pt-4 space-y-2 h-[320px] overflow-y-auto">
              {pessoasCadastradas.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div><p className="font-bold text-xs">{p.nome}</p><p className="text-[10px] text-zinc-400">{p.cpf} - <span className="text-yellow-600 font-bold">{p.area}</span></p></div>
                  <button onClick={() => excluirDoAirtable(p.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex justify-center bg-zinc-200 min-h-screen text-zinc-900">
      <div className="w-full max-w-[390px] bg-zinc-50 h-[844px] shadow-2xl flex flex-col relative sm:rounded-[55px] border-[10px] border-zinc-900 overflow-hidden">
        <header className="p-6 flex justify-between items-center bg-white border-b">
          <h1 className="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter">TRIGOFY</h1>
          <button onClick={fazerLogoff} className="text-zinc-400 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
        </header>
        <main className="flex-1 overflow-y-auto p-5 pb-32">{renderContent()}</main>
        <nav className="absolute bottom-8 left-4 right-4 bg-white/95 px-4 py-3 flex justify-between rounded-full shadow-2xl border">
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-yellow-500' : 'text-zinc-300'}><LayoutGrid size={22} /></button>
          <button onClick={() => setActiveTab('novo')} className={activeTab === 'novo' ? 'text-yellow-500' : 'text-zinc-300'}><ClipboardList size={22} /></button>
        </nav>
      </div>
    </div>
  );
}