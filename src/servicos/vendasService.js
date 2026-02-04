import { TABLES } from '../configuracao/airtable';
import { createRecord, fetchRecordsWithFilter } from './airtableService';
import { formatDateToISO } from '../utilitarios/formatters';

// Cria uma nova solicitação de venda
export const criarVenda = async (vendaData) => {
  const fields = {
    solicitante: vendaData.solicitante,
    cpf: vendaData.cpf,
    nome_completo: vendaData.nome,
    telefone: vendaData.telefone,
    area: vendaData.area,
    motivo: vendaData.motivo,
    produto: vendaData.produto.toUpperCase(),
    codigo_produto: vendaData.codigoProduto,
    quantidade: Number(vendaData.quantidade),
    unidade_medida: vendaData.unidade,
    porcionamento: vendaData.porcionamento,
    vencimento: vendaData.vencimento,
    origem: vendaData.origem,
    camara_armazenamento: vendaData.camara,
    valor_venda: vendaData.valorVenda,
    data: formatDateToISO(),
    status: 'PENDENTE'
  };

  return await createRecord(TABLES.VENDAS, fields);
};

// Busca vendas de um usuário específico
export const buscarVendasUsuario = async (usuario) => {
  const formula = `{solicitante} = '${usuario}'`;
  const records = await fetchRecordsWithFilter(TABLES.VENDAS, formula);
  
  return records.map(r => ({
    id: r.id,
    produto: r.fields.produto,
    data: r.fields.data,
    status: r.fields.status || 'PENDENTE',
    tipo: 'VENDA',
    quantidade: r.fields.quantidade,
    unidade: r.fields.unidade_medida,
    valor: r.fields.valor_venda
  }));
};
