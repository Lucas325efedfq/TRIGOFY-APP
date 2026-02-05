# Guia do Ambiente de Testes - TRIGOFY APP

Este ambiente foi configurado para permitir testes automatizados de unidade, componentes e ponta-a-ponta (E2E).

## Ferramentas Instaladas

1.  **Jest & React Testing Library**: Para testes de lógica e componentes React.
2.  **Playwright**: Para testes de fluxo completo no navegador (E2E).

## Como Executar os Testes

### 1. Testes de Unidade e Componentes (Jest)
Estes testes são rápidos e verificam partes isoladas do código.
```bash
pnpm test
```
Para rodar em modo "watch" (re-executa ao salvar arquivos):
```bash
pnpm test:watch
```

### 2. Testes de Fluxo Completo (Playwright)
Estes testes abrem o navegador e simulam o uso real do aplicativo.
```bash
pnpm test:e2e
```

## Estrutura de Arquivos
- `src/**/__tests__/*.test.js`: Local para testes de unidade/componentes.
- `tests-e2e/*.spec.js`: Local para testes de fluxo completo.
- `jest.config.mjs` & `jest.setup.js`: Configurações do Jest.
- `playwright.config.js`: Configuração do Playwright.

## Exemplo de Teste Criado
Foi criado um teste de exemplo para o componente `ProductCard` em `src/componentes/ui/__tests__/ProductCard.test.js` e um teste de login em `tests-e2e/login.spec.js`.
