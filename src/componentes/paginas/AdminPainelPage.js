import React, { useState, useEffect } from 'react';
import { Trash2, UserPlus, Users, PackagePlus, Camera, Image as ImageIcon, ArrowLeft, Plus, Database } from 'lucide-react';
import { TABLES, getHeaders, getBaseUrl } from '../../configuracao/airtable';

const AdminPainelPage = ({ setActiveTab, temaEscuro, showToast }) => {
  const [abaInterna, setAbaInterna] = useState('pessoas');
  
  const [novoCpf, setNovoCpf] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novaArea, setNovaArea] = useState('');
  const [pessoasCadastradas, setPessoasCadastradas] = useState([]);
  
  const [novoUsuario, setNovoUsuario] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [novaOrigem, setNovaOrigem] = useState('VR');
  const [novaFuncao, setNovaFuncao] = useState('USER');
  const [usuariosCadastrados, setUsuariosCadastrados] = useState([]);

  const [novoProdNome, setNovoProdNome] = useState('');
  const [novoProdPreco, setNovoProdPreco] = useState('');
  const [novoProdSite, setNovoProdSite] = useState('AMBOS');
  const [novoProdImagem, setNovoProdImagem] = useState('');
  const [produtosCadastrados, setProdutosCadastrados] = useState([]);
  
  const [carregando, setCarregando] = useState(false);

  const bgCard = temaEscuro ? 'bg-zinc-900/50' : 'bg-white';
  const bgInput = temaEscuro ? 'bg-zinc-800/50' : 'bg-zinc-50';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-500';
  const borderColor = temaEscuro ? 'border-zinc-800/50' : 'border-zinc-200/50';

  const buscarDadosAirtable = async () => {
    setCarregando(true);
    try {
      const [respPessoas, respUsuarios, respProdutos] = await Promise.all([
        fetch(getBaseUrl(TABLES.PESSOAS), { headers: getHeaders() }),
        fetch(getBaseUrl(TABLES.USUARIOS), { headers: getHeaders() }),
        fetch(getBaseUrl(TABLES.PRODUTOS), { headers: getHeaders() })
      ]);

      const [dataPessoas, dataUsuarios, dataProdutos] = await Promise.all([
        respPessoas.json(),
        respUsuarios.json(),
        respProdutos.json()
      ]);

      if (dataPessoas.records) {
        setPessoasCadastradas(dataPessoas.records.map(reg => ({
          id: reg.id,
          cpf: reg.fields.cpf || '',
          nome: reg.fields.nome || '',
          area: reg.fields.area || ''
        })));
      }

      if (dataUsuarios.records) {
        setUsuariosCadastrados(dataUsuarios.records.map(reg => ({
          id: reg.id,
          usuario: reg.fields.usuario || '',
          origem: reg.fields.origem || '',
          funcao: reg.fields.funcao || ''
        })));
      }

      if (dataProdutos.records) {
        setProdutosCadastrados(dataProdutos.records.map(reg => ({
          id: reg.id,
          nome: reg.fields.nome || '',
          preco: reg.fields.preco || '',
          site: reg.fields.site || ''
        })));
      }
    } catch (e) {
      showToast?.("Erro ao buscar dados da nuvem", "error");
    }
    setCarregando(false);
  };

  useEffect(() => {
    buscarDadosAirtable();
  }, []);

  const salvarPessoa = async () => {
    if (!novoCpf || !novoNome) {
      showToast?.("Preencha CPF e Nome.", "error");
      return;
    }
    setCarregando(true);
    try {
      const response = await fetch(getBaseUrl(TABLES.PESSOAS), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          fields: {
            cpf: novoCpf.replace(/\D/g, ''),
            nome: novoNome.toUpperCase().trim(),
            area: novaArea.trim()
          }
        })
      });
      if (response.ok) {
        setNovoCpf('');
        setNovoNome('');
        setNovaArea('');
        await buscarDadosAirtable();
        showToast?.("✅ Pessoa cadastrada!", "success");
      }
    } catch (e) {
      showToast?.("Erro ao salvar.", "error");
    }
    setCarregando(false);
  };

  const salvarUsuario = async () => {
    if (!novoUsuario || !novaSenha) {
      showToast?.("Preencha Usuário e Senha.", "error");
      return;
    }
    setCarregando(true);
    try {
      const response = await fetch(getBaseUrl(TABLES.USUARIOS), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          fields: {
            usuario: novoUsuario.trim(),
            senha: novaSenha,
            origem: novaOrigem,
            funcao: novaFuncao
          }
        })
      });
      if (response.ok) {
        setNovoUsuario('');
        setNovaSenha('');
        await buscarDadosAirtable();
        showToast?.("✅ Login criado com sucesso!", "success");
      }
    } catch (e) {
      showToast?.("Erro ao criar login.", "error");
    }
    setCarregando(false);
  };

  const salvarProduto = async () => {
    if (!novoProdNome || !novoProdPreco) {
      showToast?.("Preencha Nome e Preço do produto.", "error");
      return;
    }
    
    setCarregando(true);
    try {
      const response = await fetch(getBaseUrl(TABLES.PRODUTOS), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          fields: {
            nome: novoProdNome.toUpperCase().trim(),
            preco: novoProdPreco.toString(),
            site: novoProdSite,
            imagem: novoProdImagem
          }
        })
      });
      
      if (response.ok) {
        setNovoProdNome('');
        setNovoProdPreco('');
        setNovoProdImagem('');
        await buscarDadosAirtable();
        showToast?.("✅ Produto cadastrado com sucesso!", "success");
      }
    } catch (e) {
      showToast?.(`Erro de conexão: ${e.message}`, "error");
    } finally {
      setCarregando(false);
    }
  };

  const excluirRegistro = async (tableId, recordId) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    setCarregando(true);
    try {
      const response = await fetch(`${getBaseUrl(tableId)}/${recordId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (response.ok) {
        await buscarDadosAirtable();
        showToast?.("Excluído com sucesso!", "success");
      }
    } catch (e) {
      showToast?.("Erro ao excluir.", "error");
    }
    setCarregando(false);
  };

  return (
    <div className="animate-in slide-in-from-right duration-700 pb-32 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('home')} 
          className={`flex items-center gap-2 ${textSub} font-black text-[10px] uppercase tracking-widest hover:text-yellow-500 transition-colors`}
        >
          <ArrowLeft size={14} /> Voltar
        </button>
        <h2 className={`text-xl font-black uppercase italic tracking-tighter ${textMain}`}>Painel <span className="text-yellow-500">Admin</span></h2>
      </div>

      {/* Seleção de Aba Interna */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'pessoas', icon: Users, label: 'Pessoas' },
          { id: 'usuarios', icon: UserPlus, label: 'Logins' },
          { id: 'produtos', icon: PackagePlus, label: 'Produtos' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setAbaInterna(item.id)}
            className={`flex-none px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 border ${
              abaInterna === item.id 
                ? 'bg-yellow-500 text-white border-yellow-500 shadow-lg shadow-yellow-500/20' 
                : `${bgCard} ${textSub} ${borderColor}`
            }`}
          >
            <item.icon size={14} strokeWidth={3} /> {item.label}
          </button>
        ))}
      </div>
      
      <div className={`${bgCard} p-8 rounded-[2.5rem] border ${borderColor} shadow-xl space-y-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full" />
        
        {abaInterna === 'pessoas' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
                <Users size={20} strokeWidth={2.5} />
              </div>
              <h3 className={`text-lg font-black uppercase italic tracking-tight ${textMain}`}>Cadastrar Pessoa</h3>
            </div>
            
            <div className="space-y-4">
              <input type="text" placeholder="CPF (apenas números)" className={`w-full p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none focus:border-yellow-500/50 transition-all ${textMain} font-bold`} value={novoCpf} onChange={(e) => setNovoCpf(e.target.value)} />
              <input type="text" placeholder="Nome Completo" className={`w-full p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none focus:border-yellow-500/50 transition-all ${textMain} font-bold`} value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
              <input type="text" placeholder="Área / Setor (Ex: Logística)" className={`w-full p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none focus:border-yellow-500/50 transition-all ${textMain} font-bold`} value={novaArea} onChange={(e) => setNovaArea(e.target.value)} />
              <button onClick={salvarPessoa} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50" disabled={carregando}>
                {carregando ? "Processando..." : "Salvar na Nuvem"}
              </button>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub}`}>Base de Dados ({pessoasCadastradas.length})</h4>
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {pessoasCadastradas.map(p => (
                  <div key={p.id} className={`flex justify-between items-center p-4 ${bgInput} rounded-2xl border ${borderColor} group hover:border-yellow-500/30 transition-all`}>
                    <div>
                      <p className={`font-black uppercase text-[11px] tracking-tight ${textMain}`}>{p.nome}</p>
                      <p className={`text-[10px] font-bold ${textSub}`}>{p.cpf} • {p.area || 'Sem Área'}</p>
                    </div>
                    <button onClick={() => excluirRegistro(TABLES.PESSOAS, p.id)} className="text-zinc-400 hover:text-rose-500 p-2 hover:bg-rose-500/10 rounded-xl transition-all">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {abaInterna === 'usuarios' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
                <UserPlus size={20} strokeWidth={2.5} />
              </div>
              <h3 className={`text-lg font-black uppercase italic tracking-tight ${textMain}`}>Criar Acesso</h3>
            </div>

            <div className="space-y-4">
              <input type="text" placeholder="Usuário" className={`w-full p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none focus:border-yellow-500/50 transition-all ${textMain} font-bold`} value={novoUsuario} onChange={(e) => setNovoUsuario(e.target.value)} />
              <input type="password" placeholder="Senha" className={`w-full p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none focus:border-yellow-500/50 transition-all ${textMain} font-bold`} value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
              <div className="flex gap-3">
                <select className={`flex-1 p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none ${textMain} font-bold text-xs`} value={novaOrigem} onChange={(e) => setNovaOrigem(e.target.value)}>
                  <option value="VR">UNIDADE VR</option>
                  <option value="RIO/SP">UNIDADE RIO/SP</option>
                </select>
                <select className={`flex-1 p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none ${textMain} font-bold text-xs`} value={novaFuncao} onChange={(e) => setNovaFuncao(e.target.value)}>
                  <option value="USER">USUÁRIO</option>
                  <option value="APROVADOR">APROVADOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <button onClick={salvarUsuario} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50" disabled={carregando}>
                {carregando ? "Processando..." : "Criar Login"}
              </button>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub}`}>Logins Ativos ({usuariosCadastrados.length})</h4>
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {usuariosCadastrados.map(u => (
                  <div key={u.id} className={`flex justify-between items-center p-4 ${bgInput} rounded-2xl border ${borderColor} group hover:border-yellow-500/30 transition-all`}>
                    <div>
                      <p className={`font-black uppercase text-[11px] tracking-tight ${textMain}`}>{u.usuario}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[8px] font-black px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-500">{u.origem}</span>
                        <span className="text-[8px] font-black px-1.5 py-0.5 bg-yellow-500/10 text-yellow-600 rounded">{u.funcao}</span>
                      </div>
                    </div>
                    <button onClick={() => excluirRegistro(TABLES.USUARIOS, u.id)} className="text-zinc-400 hover:text-rose-500 p-2 hover:bg-rose-500/10 rounded-xl transition-all">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {abaInterna === 'produtos' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
                <PackagePlus size={20} strokeWidth={2.5} />
              </div>
              <h3 className={`text-lg font-black uppercase italic tracking-tight ${textMain}`}>Novo Produto</h3>
            </div>

            <div className="space-y-4">
              <input type="text" placeholder="Nome do Produto" className={`w-full p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none focus:border-yellow-500/50 transition-all ${textMain} font-bold`} value={novoProdNome} onChange={(e) => setNovoProdNome(e.target.value)} />
              <div className="flex gap-3">
                <input type="number" placeholder="Preço" className={`flex-1 p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none focus:border-yellow-500/50 transition-all ${textMain} font-bold`} value={novoProdPreco} onChange={(e) => setNovoProdPreco(e.target.value)} />
                <select className={`flex-1 p-4 ${bgInput} border ${borderColor} rounded-2xl outline-none ${textMain} font-bold text-xs`} value={novoProdSite} onChange={(e) => setNovoProdSite(e.target.value)}>
                  <option value="AMBOS">AMBOS</option>
                  <option value="VR">VR</option>
                  <option value="RIO/SP">RIO/SP</option>
                </select>
              </div>
              <button onClick={salvarProduto} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50" disabled={carregando}>
                {carregando ? "Processando..." : "Cadastrar Produto"}
              </button>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${textSub}`}>Catálogo Atual ({produtosCadastrados.length})</h4>
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {produtosCadastrados.map(p => (
                  <div key={p.id} className={`flex justify-between items-center p-4 ${bgInput} rounded-2xl border ${borderColor} group hover:border-yellow-500/30 transition-all`}>
                    <div>
                      <p className={`font-black uppercase text-[11px] tracking-tight ${textMain}`}>{p.nome}</p>
                      <p className="text-[10px] font-bold text-yellow-600">R$ {p.preco} • {p.site}</p>
                    </div>
                    <button onClick={() => excluirRegistro(TABLES.PRODUTOS, p.id)} className="text-zinc-400 hover:text-rose-500 p-2 hover:bg-rose-500/10 rounded-xl transition-all">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPainelPage;
