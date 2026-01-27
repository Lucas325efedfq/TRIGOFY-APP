/**
 * Serviço de Integração com o Agente Triger (IA)
 * Este serviço gerencia o conhecimento e as respostas do agente inteligente do app.
 */

// Base de conhecimento estática sobre o app Trigofy
const CONHECIMENTO_APP = {
  nome: "Triger",
  descricao: "Agente de suporte inteligente do ecossistema Trigofy.",
  funcionalidades: [
    {
      nome: "Compras VR (Volta Redonda)",
      descricao: "Permite realizar pedidos de produtos disponíveis na unidade de Volta Redonda.",
      como_usar: "Acesse 'Compras VR' no menu, selecione os produtos e finalize o pedido informando seu CPF."
    },
    {
      nome: "Compras RIO/SP",
      descricao: "Permite realizar pedidos de produtos para as unidades do Rio de Janeiro ou São Paulo.",
      como_usar: "Acesse 'Compras RIO/SP' no menu, escolha a unidade e selecione os produtos."
    },
    {
      nome: "Doações",
      descricao: "Sistema para solicitar a doação de produtos que não serão mais utilizados.",
      como_usar: "Acesse 'Doações', preencha os dados do produto (nome, quantidade, motivo, vencimento) e envie para aprovação."
    },
    {
      nome: "Meu Histórico",
      descricao: "Visualização centralizada de todos os seus pedidos de compra e solicitações de doação.",
      como_usar: "Clique na aba 'Histórico' na barra de navegação inferior."
    },
    {
      nome: "Cancelamentos",
      descricao: "Permite solicitar o cancelamento de um pedido ou produto específico.",
      como_usar: "Acesse 'Cancelamentos' no menu principal e informe os detalhes do que deseja cancelar."
    },
    {
      nome: "Aprovação (Admin/Aprovador)",
      descricao: "Gestores podem aprovar ou reprovar solicitações de compras e doações.",
      como_usar: "Acesse 'Aprovar Pedidos' no menu principal (visível apenas para perfis autorizados)."
    }
  ],
  regras_negocio: [
    "O CPF é obrigatório para identificar o solicitante em novos pedidos.",
    "Pedidos de doação precisam de aprovação de um gestor.",
    "O status 'PENDENTE' significa que o pedido aguarda análise.",
    "O status 'APROVADO' significa que o pedido foi processado com sucesso.",
    "O status 'REPROVADO' indica que a solicitação não pôde ser atendida."
  ],
  contato_suporte: "Para problemas técnicos graves, contate o administrador do sistema."
};

/**
 * Gera uma resposta baseada na pergunta do usuário e no conhecimento do app.
 * Em um cenário real, isso chamaria uma API de LLM (como OpenAI).
 * Aqui implementamos uma lógica de busca semântica simples para simular o treinamento.
 */
export const perguntarAoTriger = async (pergunta) => {
  const p = pergunta.toLowerCase();
  
  // Simulação de delay de processamento da IA
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Lógica de resposta baseada em palavras-chave (Treinamento do Triger)
  if (p.includes("quem é") || p.includes("quem e voce") || p.includes("o que voce faz")) {
    return `Eu sou o ${CONHECIMENTO_APP.nome}, seu ${CONHECIMENTO_APP.descricao} Estou aqui para te ajudar a navegar no app, fazer pedidos, solicitar doações e tirar dúvidas sobre o sistema.`;
  }

  if (p.includes("compra") || p.includes("pedido") || p.includes("comprar")) {
    const vr = CONHECIMENTO_APP.funcionalidades[0];
    const riosp = CONHECIMENTO_APP.funcionalidades[1];
    return `Para fazer compras, você tem duas opções: ${vr.nome} (${vr.descricao}) ou ${riosp.nome} (${riosp.descricao}). Basta escolher a unidade no menu principal e selecionar os produtos desejados.`;
  }

  if (p.includes("doação") || p.includes("doacao") || p.includes("doar")) {
    const d = CONHECIMENTO_APP.funcionalidades[2];
    return `${d.nome}: ${d.descricao} Para usar: ${d.como_usar} Lembre-se que toda doação passa por um processo de aprovação.`;
  }

  if (p.includes("histórico") || p.includes("historico") || p.includes("meus pedidos")) {
    const h = CONHECIMENTO_APP.funcionalidades[3];
    return `Você pode ver tudo o que comprou ou doou na aba '${h.nome}'. ${h.como_usar}`;
  }

  if (p.includes("cancelar") || p.includes("cancelamento")) {
    const c = CONHECIMENTO_APP.funcionalidades[4];
    return `Se precisar cancelar algo, use a opção '${c.nome}'. ${c.como_usar}`;
  }

  if (p.includes("status") || p.includes("pendente") || p.includes("aprovado")) {
    return `Os pedidos podem ter 3 status: PENDENTE (aguardando análise), APROVADO (concluído) ou REPROVADO (não atendido). Você pode acompanhar isso no seu Histórico.`;
  }

  if (p.includes("cpf")) {
    return `O CPF é usado para identificar você no sistema de forma segura. Ele é necessário para finalizar qualquer novo pedido de compra.`;
  }

  if (p.includes("ajuda") || p.includes("socorro") || p.includes("duvida")) {
    return `Eu posso te ajudar com informações sobre: Compras, Doações, Histórico, Cancelamentos e Status de pedidos. O que exatamente você gostaria de saber?`;
  }

  // Resposta padrão caso não identifique o tema (IA agindo como suporte geral)
  return "Interessante sua pergunta! Como sou o agente Triger focado no app Trigofy, posso te ajudar melhor se você perguntar sobre compras, doações ou como usar as abas do aplicativo. Poderia reformular sua dúvida?";
};
