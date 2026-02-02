# Guia de Atualização do Airtable - TRIGOFY-APP

Para que os novos campos de "Área" e "Data de Retirada" funcionem corretamente nas solicitações de compras, você precisa adicionar duas novas colunas na sua tabela de **Pedidos** no Airtable.

### Tabela: Pedidos (ou o nome que você definiu para `TABLES.PEDIDOS`)

Adicione as seguintes colunas exatamente com estes nomes (letras minúsculas):

1.  **Coluna: `area`**
    *   **Tipo**: Single line text (Texto de linha única)
    *   **Descrição**: Armazena o setor ou área do solicitante.

2.  **Coluna: `data_retirada`**
    *   **Tipo**: Date (Data)
    *   **Formato**: Recomendado ISO (YYYY-MM-DD) ou o formato que você já utiliza, mas o nome da coluna deve ser `data_retirada`.

---

### Por que isso é necessário?
O aplicativo agora envia esses dois novos dados ao criar um pedido de compra. Se as colunas não existirem no Airtable, o serviço retornará um erro ao tentar salvar o pedido.

### Dica
Certifique-se de que não existam espaços extras antes ou depois dos nomes das colunas.

---

### Tabela: Pessoas (ou o nome que você definiu para `TABLES.PESSOAS`)

Para que o cadastro de pessoas salve a área corretamente, adicione esta coluna na tabela de **Pessoas**:

1.  **Coluna: `area`**
    *   **Tipo**: Single line text (Texto de linha única)
    *   **Descrição**: Armazena o setor ou área padrão do colaborador.

Com isso, ao cadastrar uma pessoa no Painel Admin, a área será salva e aparecerá automaticamente quando ela fizer uma solicitação de compra ou doação.

---

### Tabela: Usuários (ou o nome que você definiu para `TABLES.USUARIOS`)

Para que o bloqueio de CPF funcione, você precisa vincular cada login a um CPF. Adicione esta coluna na tabela de **Usuários**:

1.  **Coluna: `cpf`**
    *   **Tipo**: Single line text (Texto de linha única)
    *   **Descrição**: Armazena o CPF do usuário vinculado a esse login.

**Importante**: Para os usuários já existentes, você deve preencher manualmente o CPF na planilha do Airtable para que a trava comece a funcionar para eles. Novos usuários cadastrados pelo Painel Admin já terão esse campo preenchido automaticamente.

---

### Tabela: Doações (ou o nome que você definiu para `TABLES.DOACOES`)

Para suportar os novos campos obrigatórios do formulário de doações, certifique-se de que as seguintes colunas existam na sua tabela de Doações:

1.  **Coluna: `area_produto`**
    *   **Tipo**: Single line text
    *   **Opções sugeridas**: Lasagna, Pesagem, Cozinha Central, Pane, Massa, Molho, Qualidade, P&D, Estoque, Suprimentos, Meio Ambiente.

2.  **Coluna: `vencimento`**
    *   **Tipo**: Date (Data)

3.  **Coluna: `origem`**
    *   **Tipo**: Single line text
    *   **Opções sugeridas**: Insumo / Produto Fábrica, Produto Fora do Padrão, Produto Teste, Produto Distribuidora, Estoque de Contingência, Produto Varejo.

4.  **Coluna: `local_armazenamento`**
    *   **Tipo**: Single line text

5.  **Coluna: `porcionamento`**
    *   **Tipo**: Single line text

6.  **Coluna: `codigo_produto`**
    *   **Tipo**: Single line text

7.  **Coluna: `foto_etiqueta`**
    *   **Tipo**: Long text (Texto longo)
