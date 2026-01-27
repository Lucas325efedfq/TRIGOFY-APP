/**
 * Serviço de Notificações do Trigofy
 * Gerencia alertas internos e integração com WhatsApp para aprovadores.
 */

// Configuração de contatos de aprovadores (Pode ser movido para o Airtable futuramente)
const CONTATOS_APROVADORES = {
  'VR': '5524999999999', // Exemplo: Substituir pelos números reais
  'RIO/SP': '5521999999999',
  'GERAL': '5524999999999'
};

/**
 * Gera um link de WhatsApp para notificar um aprovador
 */
export const enviarNotificacaoWhatsApp = (tipo, dados) => {
  const numero = CONTATOS_APROVADORES[dados.site] || CONTATOS_APROVADORES['GERAL'];
  
  let mensagem = '';
  if (tipo === 'PEDIDO') {
    mensagem = `🔔 *NOVO PEDIDO NO TRIGOFY*\n\n` +
               `👤 *Solicitante:* ${dados.solicitante}\n` +
               `📦 *Produto:* ${dados.produto}\n` +
               `📍 *Unidade:* ${dados.site}\n` +
               `💰 *Valor:* R$ ${dados.valor}\n\n` +
               `Acesse o app para aprovar!`;
  } else if (tipo === 'DOACAO') {
    mensagem = `🎁 *NOVA DOAÇÃO NO TRIGOFY*\n\n` +
               `👤 *Solicitante:* ${dados.solicitante}\n` +
               `📦 *Produto:* ${dados.produto}\n` +
               `🔢 *Qtd:* ${dados.quantidade} ${dados.unidade}\n` +
               `📝 *Motivo:* ${dados.motivo}\n\n` +
               `Acesse o app para aprovar!`;
  }

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  
  // Abre em uma nova aba
  window.open(url, '_blank');
};

/**
 * Verifica se existem solicitações pendentes para exibir alertas no app
 */
export const buscarPendenciasContagem = async (buscarPedidosPendentes, buscarDoacoesPendentes) => {
  try {
    const [pedidos, doacoes] = await Promise.all([
      buscarPedidosPendentes(),
      buscarDoacoesPendentes()
    ]);
    
    return pedidos.length + doacoes.length;
  } catch (error) {
    console.error("Erro ao buscar contagem de pendências:", error);
    return 0;
  }
};
