# Projeto Petshop - N2

Projeto simples de gerenciamento de petshop desenvolvido em Node.js com testes unitários, de API e integração.

## Descrição

Este projeto implementa funções básicas para gerenciar um petshop, incluindo:
- Cadastro e busca de pets
- Gerenciamento de serviços (banho, tosa, consultas)
- Cadastro de clientes
- Sistema de agendamentos
- Controle de produtos e estoque

## Estrutura do Projeto

```
petshop-project/
├── src/
│   ├── pets.js           # Funções para gerenciar pets
│   ├── servicos.js       # Funções para gerenciar serviços
│   ├── clientes.js       # Funções para gerenciar clientes
│   ├── agendamentos.js   # Funções para gerenciar agendamentos
│   └── produtos.js       # Funções para gerenciar produtos
├── test/
│   ├── pets.test.js
│   ├── servicos.test.js
│   ├── clientes.test.js
│   ├── agendamentos.test.js
│   └── produtos.test.js
├── package.json
└── README.md
```

## Tecnologias Utilizadas

- **Node.js** - Plataforma de desenvolvimento
- **Mocha** - Framework de testes
- **Chai** - Biblioteca de asserções (assert, expect, should)
- **Sinon** - Biblioteca para mocks, stubs e spies
- **Chai-http** - Plugin para testes de API

## Instalação

```bash
npm install
```

## Executar Testes

```bash
npm test
```

## Resumo dos Testes

O projeto contém **89 testes** distribuídos em 5 módulos:

### Módulo de Pets (20 testes)
- Testes de busca e filtragem de pets
- Validação de adição de pets
- Cálculo de idade em meses
- Verificação de filhotes
- Testes com Sinon (stubs e spies)

### Módulo de Serviços (17 testes)
- Listagem de serviços disponíveis
- Cálculo de preços com desconto
- Criação de agendamentos
- Cálculo de tempo total de serviços
- Testes com Sinon (mocks)

### Módulo de Clientes (18 testes)
- Cadastro e busca de clientes
- Validação de email
- Formatação de telefone
- Busca por email

### Módulo de Agendamentos (17 testes)
- Listagem e busca de agendamentos
- Marcação como concluído
- Cancelamento de agendamentos
- Filtros por status
- Verificação de disponibilidade

### Módulo de Produtos (17 testes)
- Listagem e busca de produtos
- Verificação de estoque
- Cálculo de valor total
- Filtros por categoria
- Atualização de estoque

## Tipos de Asserções Utilizadas

### Assert (5+ tipos diferentes)
- `assert.strictEqual()` - Comparação estrita
- `assert.deepEqual()` - Comparação profunda de objetos
- `assert.throws()` - Verificação de erros
- `assert.match()` - Verificação com regex
- `assert.notStrictEqual()` - Comparação de desigualdade

### Expect (5+ tipos diferentes)
- `.to.have.property()` - Verificação de propriedades
- `.to.be.a()` - Verificação de tipo
- `.to.have.lengthOf()` - Verificação de tamanho
- `.to.be.below()` / `.to.be.above()` - Comparações numéricas
- `.to.equal()` - Comparação de valores

### Should (5+ tipos diferentes)
- `.should.have.property()` - Verificação de propriedades
- `.should.be.a()` - Verificação de tipo
- `.should.be.empty` - Verificação de vazio
- `.should.be.true` / `.should.be.false` - Verificação booleana
- `.should.equal()` - Comparação de valores

## Testes com Sinon

O projeto inclui testes mockados/stubados de API usando Sinon:
- Stubs para simular retornos de funções
- Spies para verificar chamadas de funções
- Mocks para simular comportamentos complexos

## Autor

Projeto desenvolvido para a disciplina N2




--> projeto criado e estruturado (src/test)
--> funções implementadas com rema do petshop = FEITO
--> testes unitários 
    *5 asssers = FEITO
    *5 expect = FEITO
    *5 should diferentes = FEITO 
    *5 testes mokados/stubados de API com sinnon = feito 
    total de 20+20+15 testes = FEITO

--> criar pdf pptx com todos os asserts e expect que criamos explicado 
    deve conter explicação e foto mostrando onde ele foi utilizado no codigo

--> entregar pptx e pdf
--> criar novo arquivo de teste de API com chamadas reais ao 
    * implementar os endpoints disponiveis no site 

--> fazer o video explicando tudo linha por linha de cada teste
    * tempo medio de video 50 min kkkkkkk

--> arquivo de teste de integração 
    * testar endpoints 

--> utilizar o insominia para executar os testes de api jsonPlaceholder e integração my json server 
--> criar video explicativo 


npm run coverage --> para ver o relatório, se quiser vizualizar um mais formal olha na pasta coverage e executa com live server os .html 
npm run test --> para executar os testes e ver todos eles funcionarem 




## Novas Funcionalidades (new_features)

Este projeto foi estendido com novas funcionalidades para gerenciamento de produtos e serviços, utilizando um banco de dados SQLite e novos endpoints de API, com testes dedicados usando Chai-http.

### Estrutura da Pasta `new_features`

```
petshop-project/
├── new_features/          # Contém as novas funcionalidades
│   ├── api.js           # Define os novos endpoints da API
│   ├── database.js      # Configura e inicializa o banco de dados SQLite
│   ├── server.js        # Inicia o servidor Express e integra a nova API
│   └── api.test.js      # Testes de API para os novos endpoints usando Chai-http
└── ... (restante do projeto)
```

### Banco de Dados SQLite

Um banco de dados SQLite (`petshop.db`) é utilizado para persistir dados de produtos e serviços. Para fins de teste, um banco de dados em memória é empregado para garantir o isolamento e a limpeza entre as execuções dos testes.

**Tabelas Criadas:**

*   **`products`**: `id`, `name`, `price`, `stock`
*   **`services`**: `id`, `name`, `description`, `price`

### Endpoints da Nova API

Os seguintes endpoints estão disponíveis sob a rota `/api`:

*   **`POST /api/products`**
    *   **Descrição**: Adiciona um novo produto.
    *   **Corpo da Requisição**: `{ "name": "string", "price": "number", "stock": "number" }`
    *   **Respostas**: `201 Created` (sucesso), `400 Bad Request` (dados inválidos), `500 Internal Server Error`

*   **`GET /api/products`**
    *   **Descrição**: Lista todos os produtos.
    *   **Respostas**: `200 OK` com um array de produtos, `500 Internal Server Error`

*   **`POST /api/services`**
    *   **Descrição**: Adiciona um novo serviço.
    *   **Corpo da Requisição**: `{ "name": "string", "description": "string (opcional)", "price": "number" }`
    *   **Respostas**: `201 Created` (sucesso), `400 Bad Request` (dados inválidos), `500 Internal Server Error`

*   **`GET /api/services`**
    *   **Descrição**: Lista todos os serviços.
    *   **Respostas**: `200 OK` com um array de serviços, `500 Internal Server Error`

### Como Executar a Nova API

1.  Certifique-se de estar no diretório raiz do projeto (`petshop_teste`).
2.  Instale as dependências (se ainda não o fez): `npm install`
3.  Inicie o servidor:
    ```bash
    node new_features/server.js
    ```
    O servidor estará a escutar em `http://localhost:3000`.

### Como Executar os Novos Testes

1.  Certifique-se de estar no diretório raiz do projeto (`petshop_teste`).
2.  Execute o script de teste dedicado:
    ```bash
    npm run test:new_features
    ```
    Este comando executará os testes de API definidos em `new_features/api.test.js`.
