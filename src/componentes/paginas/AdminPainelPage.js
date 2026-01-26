import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { TABLES, getHeaders, getBaseUrl } from '../../configuracao/airtable';

const AdminPainelPage = ({ setActiveTab, temaEscuro, showToast }) => {
  const [novoCpf, setNovoCpf] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [pessoasCadastradas, setPessoasCadastradas] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const bgCard = temaEscuro ? 'bg-zinc-800' : 'bg-white';
  const bgInput = temaEscuro ? 'bg-zinc-700' : 'bg-zinc-50';
  const textMain = temaEscuro ? 'text-white' : 'text-zinc-900';
  const textSub = temaEscuro ? 'text-zinc-400' : 'text-zinc-600';

  const buscarDadosAirtable = async () => {
    setCarregando(true);
    try {
      const response = await fetch(getBaseUrl(TABLES.PESSOAS), {
        headers: getHeaders()
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
      showToast?.("Erro ao buscar dados da nuvem", "error");
    }
    setCarregando(false);
  };

  useEffect(() => {
    buscarDadosAirtable();
  }, []);

  const salvarNoAirtable = async () => {
    if (!novoCpf || !novoNome) {
      showToast?.("Por favor, preencha o CPF e o Nome Completo.", "error");
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
        showToast?.("✅ Cadastrado com sucesso na Nuvem!", "success");
      }
    } catch (e) {
      showToast?.("Erro ao salvar.", "error");
    }
    setCarregando(false);
  };

  const excluirDoAirtable = async (recordId) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;
    
    setCarregando(true);
    try {
      const response = await fetch(`${getBaseUrl(TABLES.PESSOAS)}/${recordId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (response.ok) {
        await buscarDadosAirtable();
        showToast?.("Registro excluído com sucesso!", "success");
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
        className="text-zinc-400 font-bold text-xs uppercase mb-2 hover:text-yellow-500 transition-colors"
      >
        ← Voltar
      </button>
      
      <div className={`${bgCard} p-6 rounded-3xl border shadow-sm space-y-4`}>
        <h2 className={`text-lg font-bold uppercase italic border-b pb-2 ${textMain}`}>
          Cadastrar na Nuvem
        </h2>
        
        <input 
          type="text" 
          placeholder="CPF" 
          className={`w-full p-4 ${bgInput} border rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 ${textMain}`}
          value={novoCpf} 
          onChange={(e) => setNovoCpf(e.target.value)} 
        />
        
        <input 
          type="text" 
          placeholder="Nome Completo" 
          className={`w-full p-4 ${bgInput} border rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 ${textMain}`}
          value={novoNome} 
          onChange={(e) => setNovoNome(e.target.value)} 
        />
        
        <button 
          onClick={salvarNoAirtable} 
          className="w-full bg-yellow-400 text-zinc-900 py-3 rounded-2xl font-black uppercase text-sm hover:bg-yellow-500 transition-colors active:scale-95"
          disabled={carregando}
        >
          {carregando ? "Salvando..." : "Salvar no Airtable"}
        </button>
        
        <div className="pt-4 space-y-2">
          <h3 className={`text-xs font-black uppercase ${textSub}`}>
            Lista Sincronizada ({pessoasCadastradas.length})
          </h3>
          
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {pessoasCadastradas.map(p => (
              <div 
                key={p.id} 
                className={`flex justify-between items-center p-3 ${bgInput} rounded-xl border`}
              >
                <div>
                  <p className={`font-bold text-xs ${textMain}`}>{p.nome}</p>
                  <p className={`text-[10px] ${textSub}`}>{p.cpf}</p>
                </div>
                <button 
                  onClick={() => excluirDoAirtable(p.id)} 
                  className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={carregando}
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPainelPage;
