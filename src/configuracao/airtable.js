// Configurações de conexão com Airtable
export const AIRTABLE_TOKEN = 'patSTombPP4bmw0AK.43e89e93f885283e025cc1c7636c3af9053c953ca812746652c883757c25cd9a';
export const BASE_ID = 'appj9MPXg5rVQf3zK';

// IDs das tabelas
export const TABLES = {
  PESSOAS: 'tblpfxnome',
  PRODUTOS: 'tblProdutos',
  PEDIDOS: 'tblPedidos',
  USUARIOS: 'tblUsuarios',
  DOACOES: 'tblDoacoes',
  CANCELAMENTOS: 'tblCancelamentos',
};

// Headers padrão para requisições
export const getHeaders = () => ({
  Authorization: `Bearer ${AIRTABLE_TOKEN}`,
  'Content-Type': 'application/json'
});

// URL base da API
export const getBaseUrl = (tableId) => 
  `https://api.airtable.com/v0/${BASE_ID}/${tableId}`;
