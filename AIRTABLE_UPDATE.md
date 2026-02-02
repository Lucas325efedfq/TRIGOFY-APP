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
