import { getBaseUrl, getHeaders, TABLES } from '../configuracao/airtable';

// Busca todos os registros de uma tabela
export const fetchRecords = async (tableId) => {
  try {
    const response = await fetch(getBaseUrl(tableId), {
      headers: getHeaders()
    });
    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.error(`Erro ao buscar registros da tabela ${tableId}:`, error);
    throw error;
  }
};

// Busca registros com filtro
export const fetchRecordsWithFilter = async (tableId, formula) => {
  try {
    const encodedFormula = encodeURIComponent(formula);
    const response = await fetch(
      `${getBaseUrl(tableId)}?filterByFormula=${encodedFormula}`,
      { headers: getHeaders() }
    );
    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.error(`Erro ao buscar registros filtrados:`, error);
    throw error;
  }
};

// Cria um novo registro
export const createRecord = async (tableId, fields) => {
  try {
    const response = await fetch(getBaseUrl(tableId), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ fields })
    });
    return await response.json();
  } catch (error) {
    console.error(`Erro ao criar registro:`, error);
    throw error;
  }
};

// Atualiza um registro existente
export const updateRecord = async (tableId, recordId, fields) => {
  try {
    const response = await fetch(`${getBaseUrl(tableId)}/${recordId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ fields })
    });
    return await response.json();
  } catch (error) {
    console.error(`Erro ao atualizar registro:`, error);
    throw error;
  }
};

// Deleta um registro
export const deleteRecord = async (tableId, recordId) => {
  try {
    const response = await fetch(`${getBaseUrl(tableId)}/${recordId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return response.ok;
  } catch (error) {
    console.error(`Erro ao deletar registro:`, error);
    throw error;
  }
};

// Busca pessoas cadastradas
export const fetchPessoas = async () => {
  const records = await fetchRecords(TABLES.PESSOAS);
  return records.map(reg => ({
    id: reg.id,
    cpf: reg.fields.cpf || '',
    nome: reg.fields.nome || '',
    usuarioAirtable: reg.fields.usuario || '',
    site: (reg.fields.site || '').toUpperCase(),
    area: reg.fields.area || ''
  }));
};

// Busca produtos
export const fetchProdutos = async () => {
  const records = await fetchRecords(TABLES.PRODUTOS);
  return records.map(reg => ({
    id: reg.id,
    nome: reg.fields.nome || '',
    preco: reg.fields.preco || '',
    site: reg.fields.site || '',
    imagem: reg.fields.imagem || '',
    vencimento: reg.fields.vencimento || ''
  }));
};

// Busca usuários
export const fetchUsuarios = async () => {
  const records = await fetchRecords(TABLES.USUARIOS);
  return records.map(reg => ({
    id: reg.id,
    usuario: reg.fields.usuario || '',
    senha: reg.fields.senha || '',
    origem: reg.fields.origem || 'VR',
    funcao: reg.fields.funcao || 'USER'
  }));
};
