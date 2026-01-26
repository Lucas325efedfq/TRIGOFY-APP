# Estrutura Visual do Projeto Refatorado

## 🏗️ Arquitetura em Camadas

```
┌─────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                │
│                      (Components)                        │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Layout     │  │    Pages     │  │      UI      │  │
│  │              │  │              │  │              │  │
│  │  - Header    │  │  - Login     │  │  - Toast     │  │
│  │  - Navigation│  │  - Home      │  │  - ProductCard│ │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    CAMADA DE LÓGICA                      │
│                   (Hooks & Utils)                        │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐                     │
│  │    Hooks     │  │    Utils     │                     │
│  │              │  │              │                     │
│  │  - useToast  │  │  - formatters│                     │
│  │  - useTheme  │  │  - validators│                     │
│  └──────────────┘  └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  CAMADA DE SERVIÇOS                      │
│                     (Services)                           │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pedidos    │  │   Doações    │  │Cancelamentos │  │
│  │   Service    │  │   Service    │  │   Service    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                            ↓                             │
│                  ┌──────────────────┐                    │
│                  │    Airtable      │                    │
│                  │    Service       │                    │
│                  └──────────────────┘                    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  CAMADA DE CONFIGURAÇÃO                  │
│                  (Config & Constants)                    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐                     │
│  │   Config     │  │  Constants   │                     │
│  │              │  │              │                     │
│  │  - airtable  │  │  - roles     │                     │
│  │              │  │  - status    │                     │
│  └──────────────┘  └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    API EXTERNA                           │
│                    (Airtable)                            │
└─────────────────────────────────────────────────────────┘
```

## 📂 Fluxo de Dados

```
Usuário Interage
      ↓
Componente de UI
      ↓
Hook Customizado (se necessário)
      ↓
Serviço Específico
      ↓
Airtable Service (genérico)
      ↓
API do Airtable
      ↓
Resposta
      ↓
Atualização do Estado
      ↓
Re-renderização da UI
```

## 🔄 Exemplo de Fluxo: Criar Pedido

```
1. Usuário clica em "Enviar Pedido"
   └─> PedidosPage.js

2. Componente chama função do serviço
   └─> pedidosService.criarPedidosEmLote()

3. Serviço formata dados
   └─> Usa formatters.js para CPF e data

4. Serviço chama API genérica
   └─> airtableService.createRecord()

5. API faz requisição HTTP
   └─> fetch() para Airtable

6. Resposta é processada
   └─> Retorna para o componente

7. Componente atualiza estado
   └─> useState() atualiza lista

8. UI é re-renderizada
   └─> Usuário vê confirmação

9. Toast é exibido
   └─> useToast() mostra mensagem
```

## 🎨 Separação de Responsabilidades

### Components (UI)
- **Responsabilidade:** Renderizar interface
- **Não deve:** Fazer chamadas diretas à API
- **Deve:** Usar hooks e serviços

### Hooks
- **Responsabilidade:** Lógica reutilizável
- **Não deve:** Fazer chamadas à API
- **Deve:** Gerenciar estado e efeitos

### Services
- **Responsabilidade:** Comunicação com API
- **Não deve:** Manipular UI
- **Deve:** Retornar dados formatados

### Utils
- **Responsabilidade:** Funções auxiliares
- **Não deve:** Ter estado
- **Deve:** Ser puras (mesma entrada = mesma saída)

### Config/Constants
- **Responsabilidade:** Valores fixos
- **Não deve:** Ter lógica
- **Deve:** Ser facilmente modificável

## 📊 Comparação Visual

### ANTES (Monolítico)
```
page.js (1597 linhas)
├─ Configurações
├─ Estados
├─ Funções de API
├─ Validações
├─ Formatações
├─ Componentes UI
├─ Lógica de negócio
└─ Tudo misturado!
```

### DEPOIS (Modular)
```
src/
├─ config/          → Configurações isoladas
├─ constants/       → Valores fixos
├─ utils/           → Funções auxiliares
├─ hooks/           → Lógica reutilizável
├─ services/        → Comunicação API
└─ components/      → UI organizada
   ├─ layout/       → Estrutura
   ├─ pages/        → Telas
   └─ ui/           → Componentes
```

## 🎯 Benefícios Visuais

```
Antes: 😵 Um arquivo gigante
Depois: 😊 Múltiplos arquivos organizados

Antes: 🔍 Difícil de encontrar código
Depois: 📍 Fácil localização

Antes: 🤝 Conflitos em equipe
Depois: 👥 Trabalho paralelo

Antes: 🐛 Bugs difíceis de rastrear
Depois: 🎯 Debugging simplificado

Antes: 📈 Difícil de escalar
Depois: 🚀 Crescimento sustentável
```

## 🔧 Manutenção Simplificada

### Cenário: Adicionar novo campo no pedido

**ANTES:**
1. Procurar no arquivo de 1597 linhas
2. Modificar em múltiplos lugares
3. Risco de quebrar outras funcionalidades

**DEPOIS:**
1. Abrir `pedidosService.js`
2. Adicionar campo na função específica
3. Mudança isolada e segura

### Cenário: Mudar cor do tema

**ANTES:**
1. Procurar todas as classes CSS no código
2. Modificar manualmente cada uma
3. Risco de inconsistência

**DEPOIS:**
1. Abrir `useTheme.js`
2. Modificar variável de cor
3. Mudança propagada automaticamente

## ✅ Conclusão

A refatoração transforma um código difícil de manter em uma estrutura profissional, escalável e fácil de entender.
