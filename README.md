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

