import { TABLES } from '../configuracao/airtable';
import { createRecord, updateRecord, fetchRecordsWithFilter } from './airtableService';
import { formatDateToISO } from '../utilitarios/formatters';

// Cria um novo pedido
export const criarPedido = async (pedidoData) => {
  const fields = {
    solicitante: pedidoData.solicitante,
    cpf: pedidoData.cpf,
    produto: pedidoData.produto,
    valor: pedidoData.valor.toString(),
    site: pedidoData.site,
    data: formatDateToISO(),
    status: 'PENDENTE',
    telefone: pedidoData.telefone || '',
    area: pedidoData.area || '',
    data_retirada: pedidoData.dataRetirada || ''
  };

  return await createRecord(TABLES.PEDIDOS, fields);
};

// Cria múltiplos pedidos
export const criarPedidosEmLote = async (pedidos) => {
  const promises = pedidos.map(pedido => criarPedido(pedido));
  return await Promise.all(promises);
};

// Busca pedidos de um usuário específico
export const buscarPedidosUsuario = async (usuario) => {
  const formula = `{solicitante} = '${usuario}'`;
  const records = await fetchRecordsWithFilter(TABLES.PEDIDOS, formula);
  
  return records.map(r => ({
    id: r.id,
    produto: r.fields.produto,
    valor: r.fields.valor,
    data: r.fields.data,
    site: r.fields.site,
    status: r.fields.status || 'PENDENTE'
  }));
};

// Busca pedidos pendentes
export const buscarPedidosPendentes = async () => {
  const formula = `{status} = 'PENDENTE'`;
  const records = await fetchRecordsWithFilter(TABLES.PEDIDOS, formula);
  
  return records.map(r => ({
    id: r.id,
    tabelaOrigem: TABLES.PEDIDOS,
    solicitante: r.fields.solicitante,
    produto: r.fields.produto,
    valor: r.fields.valor,
    data: r.fields.data,
    site: r.fields.site,
    status: r.fields.status,
    area: r.fields.area,
    data_retirada: r.fields.data_retirada,
    tipo: 'COMPRA'
  }));
};

// Atualiza status de um pedido
export const atualizarStatusPedido = async (recordId, novoStatus) => {
  return await updateRecord(TABLES.PEDIDOS, recordId, { status: novoStatus });
};
