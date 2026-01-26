// src/services/api.js

// CONFIGURAÇÕES
const AIRTABLE_TOKEN = 'patSTombPP4bmw0AK.43e89e93f885283e025cc1c7636c3af9053c953ca812746652c883757c25cd9a';
const BASE_ID = 'appj9MPXg5rVQf3zK';

// NOMES DAS TABELAS (Exportamos para usar nos outros arquivos se precisar)
export const TABELAS = {
  PESSOAS: 'tblpfxnome',
  PRODUTOS: 'tblProdutos',
  PEDIDOS: 'tblPedidos',
  USUARIOS: 'tblUsuarios',
  DOACOES: 'tblDoacoes',
  CANCELAMENTOS: 'tblCancelamentos'
};

// FUNÇÃO GENÉRICA PARA CHAMADAS API (Evita repetir código fetch)
export const apiAirtable = async (tabela, method = 'GET', body = null, filtro = '') => {
  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${tabela}${filtro ? `?filterByFormula=${encodeURIComponent(filtro)}` : ''}`;
    
    const options = {
      method: method,
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    // Se der erro de autenticação ou servidor
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Erro API Airtable (${tabela}):`, errorData);
      throw new Error(`Erro ${response.status}: Falha na requisição ao Airtable.`);
    }

    // Se for DELETE, o Airtable retorna status diferente, mas vamos padronizar
    if (method === 'DELETE') return { deleted: true };

    return await response.json();
  } catch (error) {
    console.error("Erro na conexão:", error);
    throw error;
  }
};