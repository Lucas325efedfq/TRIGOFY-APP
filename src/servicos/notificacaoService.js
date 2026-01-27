/**
 * Serviço de Notificações do Trigofy
 * Gerencia alertas internos e integração automática com WhatsApp para aprovadores.
 */

// Configuração de contatos de aprovadores
const CONTATOS_APROVADORES = {
  'VR': '5524999999999', // Substituir pelos números reais
  'RIO/SP': '5521999999999',
  'GERAL': '5524999999999'
};

/**
 * Envia uma notificação automática via API de WhatsApp
 * Nota: Requer uma instância de API (ex: Z-API, Evolution API, ou Meta Business API)
 */
export const enviarNotificacaoWhatsApp = async (tipo, dados) => {
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

  console.log(`[Automação] Enviando mensagem automática para ${numero}...`);

  try {
    /**
     * IMPLEMENTAÇÃO DE DISPARO AUTOMÁTICO
     * Para que o envio seja 100% automático sem abrir o WhatsApp do usuário,
     * você deve configurar uma instância de API. 
     * Abaixo está o modelo de chamada para uma API REST comum:
     */
    
    /* 
    const response = await fetch('SUA_URL_DA_API/send-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer SEU_TOKEN_DA_API'
      },
      body: JSON.stringify({
        phone: numero,
        message: mensagem
      })
    });

    if (!response.ok) throw new Error('Falha no disparo automático');
    console.log("✅ Notificação enviada automaticamente!");
    */

    // Por enquanto, como não temos a chave da API, mantemos o log para depuração
    // e o sistema está pronto para receber a URL e o Token.
    console.log("Mensagem que seria enviada:", mensagem);

  } catch (error) {
    console.error("❌ Erro ao enviar notificação automática:", error);
  }
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
