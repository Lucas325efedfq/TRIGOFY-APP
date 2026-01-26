# Guia de Migração - Trigofy App

Este guia explica como migrar do código monolítico para a versão refatorada.

## 🎯 Objetivo

Substituir o arquivo `page.js` monolítico (1597 linhas) pela versão modular e organizada, mantendo todas as funcionalidades.

## ⚠️ Antes de Começar

1. **Faça backup do código original**
2. **Teste em ambiente de desenvolvimento primeiro**
3. **Verifique se todas as dependências estão instaladas**

## 📋 Passo a Passo

### 1. Backup do Arquivo Original

```bash
cd /home/ubuntu/trigofy-app/src/app
cp page.js page-original-backup.js
```

### 2. Ativar a Versão Refatorada

```bash
# Renomear o arquivo refatorado para page.js
mv page.js page-old.js
mv page-refactored.js page.js
```

### 3. Instalar Dependências (se necessário)

```bash
cd /home/ubuntu/trigofy-app
npm install
```

### 4. Testar a Aplicação

```bash
npm run dev
```

Acesse `http://localhost:3000` e teste:

- ✅ Login funciona
- ✅ Menu principal carrega
- ✅ Tema claro/escuro funciona
- ✅ Navegação entre abas
- ✅ Notificações (toast) aparecem

### 5. Verificar Console de Erros

Abra o DevTools do navegador (F12) e verifique se há erros no console.

## 🔧 Resolução de Problemas

### Erro: "Cannot find module"

**Causa:** Caminho de importação incorreto

**Solução:** Verifique se todos os arquivos foram criados nos diretórios corretos

```bash
tree src -I 'node_modules' -L 3
```

### Erro: "X is not defined"

**Causa:** Variável ou função não exportada/importada

**Solução:** Verifique as exportações nos arquivos de serviço

### Erro de CORS ou Airtable

**Causa:** Problema com tokens ou configuração

**Solução:** Verifique o arquivo `src/config/airtable.js`

## 🎨 Personalizações Futuras

### Adicionar Nova Página

1. Crie o arquivo em `src/components/pages/`
2. Importe no `page.js`
3. Adicione a rota no switch de navegação

Exemplo:

```javascript
// src/components/pages/MinhaNovaPage.js
import React from 'react';

const MinhaNovaPage = ({ temaEscuro }) => {
  return (
    <div>
      <h1>Minha Nova Página</h1>
    </div>
  );
};

export default MinhaNovaPage;
```

### Adicionar Novo Serviço

1. Crie o arquivo em `src/services/`
2. Importe as funções do `airtableService.js`
3. Exporte as funções específicas

Exemplo:

```javascript
// src/services/meuNovoService.js
import { createRecord, TABLES } from './airtableService';

export const criarNovoRegistro = async (dados) => {
  return await createRecord(TABLES.MINHA_TABELA, dados);
};
```

### Adicionar Novo Hook

1. Crie o arquivo em `src/hooks/`
2. Use hooks do React (useState, useEffect, etc)
3. Retorne valores e funções úteis

Exemplo:

```javascript
// src/hooks/useMeuHook.js
import { useState } from 'react';

export const useMeuHook = () => {
  const [valor, setValor] = useState('');
  
  const atualizar = (novoValor) => {
    setValor(novoValor);
  };
  
  return { valor, atualizar };
};
```

## 📊 Checklist de Migração

### Funcionalidades Básicas
- [ ] Login/Logout
- [ ] Menu principal
- [ ] Tema claro/escuro
- [ ] Notificações toast
- [ ] Navegação entre abas

### Funcionalidades de Pedidos
- [ ] Listar produtos
- [ ] Selecionar produtos
- [ ] Enviar pedido
- [ ] Ver histórico
- [ ] Aprovar/Reprovar (admin)

### Funcionalidades de Doações
- [ ] Formulário de doação
- [ ] Enviar doação
- [ ] Upload de foto
- [ ] Listar doações pendentes

### Funcionalidades de Cancelamento
- [ ] Formulário de cancelamento
- [ ] Enviar cancelamento
- [ ] Validações

### Funcionalidades Admin
- [ ] Cadastrar usuários
- [ ] Cadastrar produtos
- [ ] Editar usuários
- [ ] Excluir produtos
- [ ] Alterar senha

## 🚀 Próximas Melhorias

Após a migração bem-sucedida, considere:

1. **Adicionar TypeScript** para type safety
2. **Implementar testes** com Jest e React Testing Library
3. **Adicionar loading states** em todas as operações assíncronas
4. **Implementar cache** para reduzir chamadas à API
5. **Adicionar error boundaries** para melhor tratamento de erros
6. **Otimizar imagens** com Next.js Image component
7. **Implementar PWA** para uso offline
8. **Adicionar analytics** para monitorar uso

## 📞 Suporte

Se encontrar problemas durante a migração:

1. Verifique os logs do console
2. Revise os arquivos de configuração
3. Consulte a documentação do Next.js
4. Verifique se todos os arquivos foram criados

## ✅ Conclusão

Após completar este guia, sua aplicação estará:

- ✅ Melhor organizada
- ✅ Mais fácil de manter
- ✅ Pronta para escalar
- ✅ Mais fácil de testar
- ✅ Melhor para trabalho em equipe

Boa sorte com a migração! 🎉
