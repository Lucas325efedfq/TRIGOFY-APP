# Configuração de Notificações Automáticas (WhatsApp)

Para que as notificações cheguem **automaticamente** no celular dos aprovadores sem que ninguém precise clicar em "Enviar", você precisa de uma **API de WhatsApp**.

## Opções Recomendadas

1. **Z-API** (Muito usada no Brasil): Fácil de configurar, basta ler um QR Code.
2. **Evolution API**: Opção gratuita (Open Source) se você tiver um servidor.
3. **Meta Business API**: Oficial, mas mais complexa de configurar.

## Como Ativar no Código

No arquivo `src/servicos/notificacaoService.js`, você deve atualizar a função `enviarNotificacaoWhatsApp` com os dados da sua API:

```javascript
const response = await fetch('https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/send-text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: numero,
    message: mensagem
  })
});
```

## O que eu já fiz:
- O app já identifica quem é o aprovador.
- O app já monta a mensagem completa com nome, produto e valor.
- O app já dispara a função de envio assim que o botão "Finalizar" é clicado.
- O usuário não vê nada, o processo acontece em segundo plano.

**Para finalizar, você só precisa escolher um provedor de API e me passar o link/token ou você mesmo colar no arquivo mencionado!**
