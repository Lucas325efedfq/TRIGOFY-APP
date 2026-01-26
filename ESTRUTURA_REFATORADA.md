# Estrutura Refatorada do Trigofy App

## 📁 Organização dos Arquivos

A aplicação foi reorganizada seguindo as melhores práticas de desenvolvimento React/Next.js, separando responsabilidades e facilitando a manutenção.

### **src/config/**
Configurações centralizadas da aplicação.

- `airtable.js` - Tokens, IDs de tabelas e funções auxiliares para API do Airtable

### **src/constants/**
Constantes e valores fixos utilizados em toda a aplicação.

- `roles.js` - Funções de usuário (ADMIN, USER) e sites (VR, RIO/SP)
- `status.js` - Status de pedidos (PENDENTE, APROVADO, REPROVADO) e tipos de solicitação

### **src/utils/**
Funções utilitárias reutilizáveis.

- `formatters.js` - Formatação de CPF, datas, valores monetários
- `validators.js` - Validações de formulários e campos

### **src/hooks/**
Hooks customizados do React para lógica reutilizável.

- `useToast.js` - Gerenciamento de notificações toast
- `useTheme.js` - Controle de tema claro/escuro com persistência

### **src/services/**
Camada de serviços para comunicação com APIs externas.

- `airtableService.js` - Operações CRUD genéricas no Airtable
- `pedidosService.js` - Lógica específica de pedidos/compras
- `doacoesService.js` - Lógica específica de doações
- `cancelamentosService.js` - Lógica específica de cancelamentos

### **src/components/**
Componentes React organizados por categoria.

#### **components/ui/**
Componentes de interface reutilizáveis.

- `Toast.js` - Componente de notificação
- `ProductCard.js` - Card de produto para seleção

#### **components/layout/**
Componentes de estrutura da aplicação.

- `Header.js` - Cabeçalho com logo, usuário e controles
- `Navigation.js` - Barra de navegação inferior

#### **components/pages/**
Páginas/telas principais da aplicação.

- `LoginPage.js` - Tela de autenticação
- `HomePage.js` - Menu principal com opções
- *(Outras páginas podem ser adicionadas aqui)*

### **src/app/**
Arquivos do Next.js App Router.

- `page.js` - **Arquivo original (1597 linhas)** - mantido como backup
- `page-refactored.js` - **Nova versão refatorada** - arquivo principal modular
- `layout.js` - Layout raiz do Next.js
- `globals.css` - Estilos globais

## 🔄 Como Usar a Versão Refatorada

### Opção 1: Testar sem substituir o original

Renomeie temporariamente o arquivo original e teste a versão refatorada:

```bash
cd /home/ubuntu/trigofy-app/src/app
mv page.js page-original-backup.js
mv page-refactored.js page.js
npm run dev
```

### Opção 2: Manter ambas versões

Você pode manter ambos arquivos e alternar entre eles conforme necessário.

## ✅ Benefícios da Refatoração

### 1. **Manutenibilidade**
- Código organizado em arquivos menores e focados
- Fácil localização de funcionalidades específicas
- Redução de complexidade cognitiva

### 2. **Reusabilidade**
- Componentes podem ser reutilizados em diferentes partes
- Hooks customizados compartilham lógica comum
- Serviços centralizados evitam duplicação

### 3. **Testabilidade**
- Funções isoladas são mais fáceis de testar
- Mocks podem ser criados para serviços
- Componentes podem ser testados individualmente

### 4. **Escalabilidade**
- Adicionar novas features é mais simples
- Estrutura clara para novos desenvolvedores
- Facilita trabalho em equipe

### 5. **Performance**
- Possibilidade de otimizar componentes individualmente
- Code splitting mais eficiente
- Lazy loading de componentes pesados

### 6. **Separação de Responsabilidades**
- UI separada da lógica de negócio
- Serviços isolados da apresentação
- Configurações centralizadas

## 📝 Próximos Passos

Para completar a refatoração, você pode:

1. **Criar as páginas restantes:**
   - `PedidosPage.js` - Tela de compras/pedidos
   - `DoacoesPage.js` - Tela de doações
   - `CancelamentosPage.js` - Tela de cancelamentos
   - `HistoricoPage.js` - Histórico de pedidos
   - `AprovacoesPage.js` - Aprovar pedidos (admin)
   - `AdminPage.js` - Painel administrativo
   - `ChatPage.js` - Chat com Triger

2. **Adicionar testes:**
   - Testes unitários para serviços
   - Testes de componentes
   - Testes de integração

3. **Melhorias adicionais:**
   - Adicionar TypeScript para type safety
   - Implementar error boundaries
   - Adicionar loading states
   - Implementar cache de dados

## 🎯 Comparação

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Linhas por arquivo** | 1597 | ~50-200 |
| **Arquivos** | 1 | 23+ |
| **Organização** | Monolítico | Modular |
| **Reusabilidade** | Baixa | Alta |
| **Manutenção** | Difícil | Fácil |
| **Colaboração** | Conflitos | Paralela |

## 🚀 Estrutura Final

```
src/
├── app/                    # Next.js App Router
│   ├── page.js            # Arquivo original (backup)
│   └── page-refactored.js # Nova versão modular
├── components/            # Componentes React
│   ├── layout/           # Estrutura da app
│   ├── pages/            # Páginas/telas
│   └── ui/               # Componentes reutilizáveis
├── config/               # Configurações
├── constants/            # Constantes
├── hooks/                # Hooks customizados
├── services/             # Camada de serviços
└── utils/                # Utilitários
```

Esta estrutura segue os padrões da indústria e facilita o crescimento sustentável da aplicação.
