import { TABLES } from '../configuracao/airtable';
import { createRecord, fetchRecordsWithFilter } from './airtableService';
import { formatDateToISO, truncateString } from '../utilitarios/formatters';

// Cria uma nova doação
export const criarDoacao = async (doacaoData) => {
  const fields = {
    solicitante: doacaoData.solicitante,
    produto: doacaoData.produto.toUpperCase(),
    codigo_produto: doacaoData.codigoProduto,
    area_solicitante: doacaoData.areaSolicitante,
    motivo: doacaoData.motivo,
    area_produto: doacaoData.areaProduto,
    vencimento: doacaoData.vencimento,
    origem: doacaoData.origem,
    data: formatDateToISO(),
    status: 'PENDENTE',
    local_armazenamento: doacaoData.localArmazenamento,
    quantidade_doacao: doacaoData.quantidade,
    unidade_medida: doacaoData.unidade,
    porcionamento: doacaoData.porcionamento,
    foto_etiqueta: doacaoData.foto ? truncateString(doacaoData.foto, 100000) : 'Sem foto'
  };

  return await createRecord(TABLES.DOACOES, fields);
};

// Busca doações pendentes
export const buscarDoacoesPendentes = async () => {
  const formula = `{status} = 'PENDENTE'`;
  const records = await fetchRecordsWithFilter(TABLES.DOACOES, formula);
  
  return records.map(r => ({
    id: r.id,
    tabelaOrigem: TABLES.DOACOES,
    solicitante: r.fields.solicitante,
    produto: r.fields.produto,
    codigo: r.fields.codigo_produto,
    area: r.fields.area_solicitante,
    motivo: r.fields.motivo,
    area_produto: r.fields.area_produto,
    vencimento: r.fields.vencimento,
    origem: r.fields.origem,
    data: r.fields.data,
    status: r.fields.status,
    tipo: 'DOACAO'
  }));
};

// Busca doações de um usuário específico
export const buscarDoacoesUsuario = async (usuario) => {
  const formula = `{solicitante} = '${usuario}'`;
  const records = await fetchRecordsWithFilter(TABLES.DOACOES, formula);
  
  return records.map(r => ({
    id: r.id,
    produto: r.fields.produto,
    data: r.fields.data,
    status: r.fields.status || 'PENDENTE',
    tipo: 'DOACAO',
    quantidade: r.fields.quantidade_doacao,
    unidade: r.fields.unidade_medida,
    motivo: r.fields.motivo
  }));
};
