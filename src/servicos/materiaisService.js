import { TABLES } from '../configuracao/airtable';
import { createRecord, fetchRecordsWithFilter } from './airtableService';
import { formatDateToISO } from '../utilitarios/formatters';

// Cria uma nova solicitação de materiais de escritório
export const criarSolicitacaoMateriais = async (materiaisData) => {
  const fields = {
    solicitante: materiaisData.solicitante,
    cpf: materiaisData.cpf,
    nome_completo: materiaisData.nome,
    telefone: materiaisData.telefone,
    area: materiaisData.area,
    motivo_solicitacao: materiaisData.motivo,
    nome_material: materiaisData.material.toUpperCase(),
    quantidade: Number(materiaisData.quantidade),
    prioridade: materiaisData.prioridade,
    especificacao: materiaisData.especificacao,
    data: formatDateToISO(),
    status: 'PENDENTE'
  };

  return await createRecord(TABLES.MATERIAIS, fields);
};

// Busca solicitações de materiais de um usuário específico para o histórico
export const buscarMateriaisUsuario = async (usuario) => {
  const formula = `{solicitante} = '${usuario}'`;
  const records = await fetchRecordsWithFilter(TABLES.MATERIAIS, formula);
  
  return records.map(r => ({
    id: r.id,
    produto: r.fields.nome_material,
    data: r.fields.data,
    status: r.fields.status || 'PENDENTE',
    tipo: 'MATERIAL',
    quantidade: r.fields.quantidade,
    detalhes: `Qtd: ${r.fields.quantidade} | Prioridade: ${r.fields.prioridade}`
  }));
};

// Busca solicitações de materiais pendentes para a aba de aprovações
export const buscarMateriaisPendentes = async () => {
  const formula = `{status} = 'PENDENTE'`;
  const records = await fetchRecordsWithFilter(TABLES.MATERIAIS, formula);
  
  return records.map(r => ({
    id: r.id,
    tabelaOrigem: TABLES.MATERIAIS,
    solicitante: r.fields.solicitante,
    produto: r.fields.nome_material,
    data: r.fields.data,
    status: r.fields.status,
    motivo: r.fields.motivo_solicitacao,
    area: r.fields.area,
    quantidade: r.fields.quantidade,
    prioridade: r.fields.prioridade,
    especificacao: r.fields.especificacao,
    tipo: 'MATERIAL'
  }));
};
