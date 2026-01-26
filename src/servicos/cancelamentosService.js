import { createRecord } from './airtableService';
import { TABELAS } from '../configuracao/airtable';

export const enviarCancelamento = async (dados) => {
  // 1. Validação: Garante que os dados chegaram até aqui
  if (!dados.solicitante) throw new Error("Usuário não identificado.");
  if (!dados.produto) throw new Error("Produto não informado.");
  if (!dados.motivo) throw new Error("Motivo não informado.");

  // 2. Montagem do pacote para o Airtable
  // IMPORTANTE: A parte da esquerda (antes dos dois pontos) deve ser IGUAL ao nome da coluna no Airtable
  const payload = {
    "solicitante": dados.solicitante,
    "cpf": dados.cpf ? dados.cpf.replace(/\D/g, '') : '',
    "nome_completo": dados.nome,
    "telefone": dados.telefone,
    "area": dados.area,
    
    // Tentei usar o nome mais comum. Se der erro, verifique se sua coluna no Airtable se chama "Produto" ou "produto_cancelar"
    "produto_cancelar": dados.produto, 
    
    "quantidade": dados.quantidade ? String(dados.quantidade) : "0",
    "unidade_medida": dados.unidade,
    "motivo_cancelamento": dados.motivo,
    "data": new Date().toISOString().split('T')[0],
    "status": "PENDENTE"
  };

  try {
    const resposta = await createRecord(TABELAS.CANCELAMENTOS, payload);
    return resposta;
  } catch (error) {
    console.error("Erro ao enviar cancelamento:", error);
    throw error;
  }
};