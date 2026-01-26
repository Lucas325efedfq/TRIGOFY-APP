import { TABLES } from '../configuracao/airtable';
import { createRecord } from './airtableService';
import { formatDateToISO, formatCPF } from '../utilitarios/formatters';

// Cria uma solicitação de cancelamento
export const criarCancelamento = async (cancelamentoData) => {
  const fields = {
    solicitante: cancelamentoData.solicitante,
    cpf: formatCPF(cancelamentoData.cpf),
    nome_completo: cancelamentoData.nomeCompleto,
    telefone: cancelamentoData.telefone,
    area: cancelamentoData.area,
    produto_cancelar: cancelamentoData.produto,
    quantidade: cancelamentoData.quantidade,
    unidade_medida: cancelamentoData.unidade,
    motivo_cancelamento: cancelamentoData.motivo,
    data: formatDateToISO(),
    status: 'PENDENTE'
  };

  return await createRecord(TABLES.CANCELAMENTOS, fields);
};
