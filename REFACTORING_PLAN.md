# Plano de Refatoração - Trigofy App

## Estrutura Atual
- **1 arquivo monolítico**: `src/app/page.js` (1597 linhas)
- Tudo em um único componente: configurações, estados, funções, UI

## Estrutura Proposta

### 1. Configurações e Constantes
**Arquivo**: `src/config/airtable.js`
- Tokens e IDs do Airtable
- Constantes de configuração

### 2. Hooks Customizados
**Diretório**: `src/hooks/`
- `useAuth.js` - Autenticação e login
- `useAirtable.js` - Operações com Airtable
- `useToast.js` - Sistema de notificações
- `useTheme.js` - Controle de tema claro/escuro

### 3. Serviços/API
**Diretório**: `src/services/`
- `airtableService.js` - Todas as chamadas à API do Airtable
- `pedidosService.js` - Lógica de pedidos
- `doacoesService.js` - Lógica de doações
- `cancelamentosService.js` - Lógica de cancelamentos

### 4. Componentes UI
**Diretório**: `src/components/`

#### Layout
- `Layout.js` - Container principal
- `Navigation.js` - Barra de navegação inferior
- `Header.js` - Cabeçalho com logo e controles
- `Toast.js` - Componente de notificação

#### Páginas/Abas
- `HomePage.js` - Tela inicial com menu
- `LoginPage.js` - Tela de login
- `PedidosPage.js` - Aba de pedidos/compras
- `DoacoesPage.js` - Aba de doações
- `CancelamentosPage.js` - Aba de cancelamentos
- `HistoricoPage.js` - Histórico de pedidos
- `AprovacoesPage.js` - Aprovar pedidos (admin)
- `AdminPage.js` - Painel administrativo
- `ChatPage.js` - Chat com Triger

#### Subcomponentes
- `ProductCard.js` - Card de produto
- `PedidoCard.js` - Card de pedido no histórico
- `UserForm.js` - Formulário de usuário
- `ProductForm.js` - Formulário de produto

### 5. Utilitários
**Diretório**: `src/utils/`
- `formatters.js` - Formatação de CPF, datas, etc
- `validators.js` - Validações de formulário

### 6. Tipos/Constantes
**Diretório**: `src/constants/`
- `status.js` - Status de pedidos
- `roles.js` - Funções de usuário

## Benefícios da Refatoração

1. **Manutenibilidade**: Código organizado e fácil de encontrar
2. **Reusabilidade**: Componentes podem ser reutilizados
3. **Testabilidade**: Funções isoladas são mais fáceis de testar
4. **Escalabilidade**: Adicionar novas features fica mais simples
5. **Colaboração**: Múltiplos desenvolvedores podem trabalhar simultaneamente
6. **Performance**: Possibilidade de otimizar componentes individualmente
