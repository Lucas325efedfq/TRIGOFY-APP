import React, { useState, useEffect } from 'react';
import { Trash2, UserPlus, Users, PackagePlus } from 'lucide-react';
import { TABLES, getHeaders, getBaseUrl } from '../../configuracao/airtable';

const AdminPainelPage = ({ setActiveTab, temaEscuro, showToast }) => {
  const [abaInterna, setAbaInterna] = useState('pessoas'); // 'pessoas', 'usuarios' ou 'produtos'
  
  // Estados para Pessoas
  const [novoCpf, setNovoCpf] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [pessoasCadastradas, setPessoasCadastradas] = useState([]);
  
  // Estados para Usuários (Logins)
  const [novoUsuario, setNovoUsuario] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [novaOrigem, setNovaOrigem] = useState('VR');
  const [novaFuncao, setNovaFuncao] = useState('USER');
  const [usuariosCadastrados, setUsuariosCadastrados] = useState([]);

  // Estados para Produtos
  const [novoProdNome, setNovoProdNome] = useState('');
  const [novoProdPreco, setNovoProdPreco] = useState('');
  const [novoProdSite, setNovoProdSite] = useState('AMBOS');
  const [novoProdImagem, setNovoProdImagem] = useState('');
  const [produtosCadastrados, setProdutosCadastrados] = useState([]);
  
  const [carregando, setCarregando] = useState(false);

  const bgCard = temaEscuro ? 'bg-zinc-800' : 'bg-white';
  const bgInput = temaEscuro ? 'bg-zinc-700' : 'bg-zinc-50';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-600';

  const buscarDadosAirtable = async () => {
    setCarregando(true);
    try {
      // Busca Pessoas
      const respPessoas = await fetch(getBaseUrl(TABLES.PESSOAS), { headers: getHeaders() });
      const dataPessoas = await respPessoas.json();
      if (dataPessoas.records) {
        setPessoasCadastradas(dataPessoas.records.map(reg => ({
          id: reg.id,
          cpf: reg.fields.cpf || '',
          nome: reg.fields.nome || ''
        })));
      }

      // Busca Usuários (Logins)
      const respUsuarios = await fetch(getBaseUrl(TABLES.USUARIOS), { headers: getHeaders() });
      const dataUsuarios = await respUsuarios.json();
      if (dataUsuarios.records) {
        setUsuariosCadastrados(dataUsuarios.records.map(reg => ({
          id: reg.id,
          usuario: reg.fields.usuario || '',
          origem: reg.fields.origem || '',
          funcao: reg.fields.funcao || ''
        })));
      }

      // Busca Produtos
      const respProdutos = await fetch(getBaseUrl(TABLES.PRODUTOS), { headers: getHeaders() });
      const dataProdutos = await respProdutos.json();
      if (dataProdutos.records) {
        setProdutosCadastrados(dataProdutos.records.map(reg => ({
          id: reg.id,
          nome: reg.fields.nome || '',
          preco: reg.fields.preco || '',
          site: reg.fields.site || ''
        })));
      }
    } catch (e) {
      console.error("Erro ao buscar dados:", e);
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
            nome: novoNome.toUpperCase().trim()
          }
        })
      });
      if (response.ok) {
        setNovoCpf('');
        setNovoNome('');
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
    console.log("Iniciando salvamento de produto...");
    if (!novoProdNome || !novoProdPreco) {
      console.warn("Campos obrigatórios faltando:", { novoProdNome, novoProdPreco });
      showToast?.("Preencha Nome e Preço do produto.", "error");
      return;
    }
    
    setCarregando(true);
    try {
      const payload = {
        fields: {
          nome: novoProdNome.toUpperCase().trim(),
          preco: novoProdPreco.toString(),
          site: novoProdSite,
          imagem: novoProdImagem.trim()
        }
      };
      
      console.log("Enviando payload para Airtable:", payload);
      
      const response = await fetch(getBaseUrl(TABLES.PRODUTOS), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      console.log("Resposta do Airtable:", { status: response.status, ok: response.ok, data });

      if (response.ok) {
        setNovoProdNome('');
        setNovoProdPreco('');
        setNovoProdImagem('');
        await buscarDadosAirtable();
        showToast?.("✅ Produto cadastrado com sucesso!", "success");
      } else {
        const erroMsg = data.error?.message || "Erro desconhecido na API";
        console.error("Erro retornado pelo Airtable:", erroMsg);
        showToast?.(`Erro: ${erroMsg}`, "error");
      }
    } catch (e) {
      console.error("Exceção ao cadastrar produto:", e);
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
    <div className="animate-in slide-in-from-right duration-300 pb-20">
      <button 
        onClick={() => setActiveTab('home')} 
        className="text-zinc-400 font-bold text-xs uppercase mb-4 hover:text-yellow-500 transition-colors flex items-center gap-1"
      >
        ← Voltar ao Menu
      </button>

      {/* Seleção de Aba Interna */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
        <button 
          onClick={() => setAbaInterna('pessoas')}
          className={`flex-none px-4 py-3 rounded-2xl font-black uppercase text-[10px] transition-all flex items-center justify-center gap-2 ${abaInterna === 'pessoas' ? 'bg-yellow-400 text-zinc-900 shadow-lg' : 'bg-zinc-100 text-zinc-400'}`}
        >
          <Users size={14} /> Pessoas
        </button>
        <button 
          onClick={() => setAbaInterna('usuarios')}
          className={`flex-none px-4 py-3 rounded-2xl font-black uppercase text-[10px] transition-all flex items-center justify-center gap-2 ${abaInterna === 'usuarios' ? 'bg-yellow-400 text-zinc-900 shadow-lg' : 'bg-zinc-100 text-zinc-400'}`}
        >
          <UserPlus size={14} /> Logins
        </button>
        <button 
          onClick={() => setAbaInterna('produtos')}
          className={`flex-none px-4 py-3 rounded-2xl font-black uppercase text-[10px] transition-all flex items-center justify-center gap-2 ${abaInterna === 'produtos' ? 'bg-yellow-400 text-zinc-900 shadow-lg' : 'bg-zinc-100 text-zinc-400'}`}
        >
          <PackagePlus size={14} /> Produtos
        </button>
      </div>
      
      <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-4`}>
        {abaInterna === 'pessoas' && (
          <>
            <h2 className={`text-lg font-bold uppercase italic border-b pb-2 ${textMain}`}>Cadastrar Pessoa</h2>
            <input type="text" placeholder="CPF" className={`w-full p-4 ${bgInput} border rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 ${textMain}`} value={novoCpf} onChange={(e) => setNovoCpf(e.target.value)} />
            <input type="text" placeholder="Nome Completo" className={`w-full p-4 ${bgInput} border rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 ${textMain}`} value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
            <button onClick={salvarPessoa} className="w-full bg-yellow-400 text-zinc-900 py-3 rounded-2xl font-black uppercase text-sm hover:bg-yellow-500 transition-colors active:scale-95" disabled={carregando}>{carregando ? "Salvando..." : "Salvar no Airtable"}</button>
            <div className="pt-4 space-y-2">
              <h3 className={`text-xs font-black uppercase ${textSub}`}>Lista de Pessoas ({pessoasCadastradas.length})</h3>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {pessoasCadastradas.map(p => (
                  <div key={p.id} className={`flex justify-between items-center p-3 ${bgInput} rounded-xl border`}>
                    <div><p className={`font-bold text-xs ${textMain}`}>{p.nome}</p><p className={`text-[10px] ${textSub}`}>{p.cpf}</p></div>
                    <button onClick={() => excluirRegistro(TABLES.PESSOAS, p.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {abaInterna === 'usuarios' && (
          <>
            <h2 className={`text-lg font-bold uppercase italic border-b pb-2 ${textMain}`}>Criar Acesso (Login)</h2>
            <input type="text" placeholder="Usuário" className={`w-full p-4 ${bgInput} border rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 ${textMain}`} value={novoUsuario} onChange={(e) => setNovoUsuario(e.target.value)} />
            <input type="password" placeholder="Senha" className={`w-full p-4 ${bgInput} border rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 ${textMain}`} value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
            <div className="flex gap-2">
              <select className={`flex-1 p-4 ${bgInput} border rounded-2xl outline-none ${textMain}`} value={novaOrigem} onChange={(e) => setNovaOrigem(e.target.value)}><option value="VR">VR</option><option value="RIO/SP">RIO/SP</option></select>
              <select className={`flex-1 p-4 ${bgInput} border rounded-2xl outline-none ${textMain}`} value={novaFuncao} onChange={(e) => setNovaFuncao(e.target.value)}><option value="USER">USUÁRIO</option><option value="APROVADOR">APROVADOR</option><option value="ADMIN">ADMIN</option></select>
            </div>
            <button onClick={salvarUsuario} className="w-full bg-zinc-900 text-white py-3 rounded-2xl font-black uppercase text-sm hover:bg-zinc-800 transition-colors active:scale-95" disabled={carregando}>{carregando ? "Criando..." : "Criar Login"}</button>
            <div className="pt-4 space-y-2">
              <h3 className={`text-xs font-black uppercase ${textSub}`}>Logins Ativos ({usuariosCadastrados.length})</h3>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {usuariosCadastrados.map(u => (
                  <div key={u.id} className={`flex justify-between items-center p-3 ${bgInput} rounded-xl border`}>
                    <div><p className={`font-bold text-xs ${textMain}`}>{u.usuario}</p><p className={`text-[10px] ${textSub}`}>{u.origem} • {u.funcao}</p></div>
                    <button onClick={() => excluirRegistro(TABLES.USUARIOS, u.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {abaInterna === 'produtos' && (
          <>
            <h2 className={`text-lg font-bold uppercase italic border-b pb-2 ${textMain}`}>Cadastrar Produto</h2>
            <input type="text" placeholder="Nome do Produto" className={`w-full p-4 ${bgInput} border rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 ${textMain}`} value={novoProdNome} onChange={(e) => setNovoProdNome(e.target.value)} />
            <input type="number" placeholder="Preço (ex: 10.50)" className={`w-full p-4 ${bgInput} border rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 ${textMain}`} value={novoProdPreco} onChange={(e) => setNovoProdPreco(e.target.value)} />
            <input type="text" placeholder="URL da Imagem do Produto" className={`w-full p-4 ${bgInput} border rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 ${textMain}`} value={novoProdImagem} onChange={(e) => setNovoProdImagem(e.target.value)} />
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase ml-2">Disponível em:</label>
              <select className={`w-full p-4 ${bgInput} border rounded-2xl outline-none ${textMain}`} value={novoProdSite} onChange={(e) => setNovoProdSite(e.target.value)}>
                <option value="VR">VOLTA REDONDA (VR)</option>
                <option value="RIO/SP">RIO/SP</option>
                <option value="AMBOS">AMBOS (VR e RIO/SP)</option>
              </select>
            </div>
            <button onClick={salvarProduto} className="w-full bg-emerald-500 text-white py-3 rounded-2xl font-black uppercase text-sm hover:bg-emerald-600 transition-colors active:scale-95" disabled={carregando}>{carregando ? "Cadastrando..." : "Cadastrar Produto"}</button>
            <div className="pt-4 space-y-2">
              <h3 className={`text-xs font-black uppercase ${textSub}`}>Produtos no Catálogo ({produtosCadastrados.length})</h3>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {produtosCadastrados.map(p => (
                  <div key={p.id} className={`flex justify-between items-center p-3 ${bgInput} rounded-xl border`}>
                    <div><p className={`font-bold text-xs ${textMain}`}>{p.nome}</p><p className={`text-[10px] ${textSub}`}>R$ {parseFloat(p.preco).toFixed(2)} • {p.site}</p></div>
                    <button onClick={() => excluirRegistro(TABLES.PRODUTOS, p.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPainelPage;
