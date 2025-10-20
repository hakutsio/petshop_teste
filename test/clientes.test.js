const { assert } = require('chai');
const should = require('chai').should();
const moduloClientes = require('../src/clientes.js');

describe('Testes para o Módulo de Clientes', () => {
    const estadoInicial = [
        { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '11999999999' },
        { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '11988888888' },
        { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', telefone: '11977777777' }  
    ];

    beforeEach(() => {
        moduloClientes.clientes = [...estadoInicial];
    });

    describe('listarClientes (usando assert)', () => {

        it('Deve retornar um array', () => {
            const resultado = moduloClientes.listarClientes();
            assert.isArray(resultado, 'O resultado deveria ser um array');
        });

        it('Deve retornar a lista completa com 3 clientes (estado inicial)', () => {
            const resultado = moduloClientes.listarClientes();
            assert.lengthOf(resultado, 3, 'O array deveria ter 3 clientes');
        });

        it('Deve retornar o conteúdo exato dos clientes', () => {
            const resultado = moduloClientes.listarClientes();
            assert.deepStrictEqual(resultado, estadoInicial, 'O conteúdo do array deve ser idêntico');
        });

        it('Deve retornar um array vazio se a lista de clientes estiver vazia', () => {
            moduloClientes.clientes.length = 0;
            
            const resultado = moduloClientes.listarClientes();
            assert.deepStrictEqual(resultado, [], 'O array deveria estar vazio');
        });

        it('Deve retornar um array vazio se a lista de clientes for null', () => {
            moduloClientes.clientes = null;

            const resultado = moduloClientes.listarClientes();
            assert.deepStrictEqual(resultado, [], 'O array deveria ser vazio mesmo quando a fonte é null');
        });

        it('Deve retornar um array vazio se a lista de clientes for undefined', () => {
            moduloClientes.clientes = undefined;

            const resultado = moduloClientes.listarClientes();
            assert.deepStrictEqual(resultado, [], 'O array deveria ser vazio mesmo quando a fonte é undefined');
        });

    });

    describe('buscarClientePorId (usando assert)', () => {
        it('Deve retornar o objeto correto do cliente quando o ID existe', () => {
            const idParaBuscar = 2;
            const clienteEsperado = { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '11988888888' };
            const resultado = moduloClientes.buscarClientePorId(idParaBuscar);

            assert.deepStrictEqual(resultado, clienteEsperado, 'O cliente encontrado deve ser o correto');
        });

        it('Deve retornar undefined quando o ID não existe na lista', () => {
            const idParaBuscar = 999;
            const resultado = moduloClientes.buscarClientePorId(idParaBuscar);

            assert.isUndefined(resultado, 'O resultado deve ser undefined para um ID inexistente');
        });

        it('Deve retornar undefined ao procurar com um ID de tipo diferente (string)', () => {
            const idParaBuscar = '1';
            const resultado = moduloClientes.buscarClientePorId(idParaBuscar);

            assert.isUndefined(resultado, 'O resultado deve ser undefined ao buscar com tipo de dado errado');
        });

        it('Deve retornar undefined ao procurar por um ID nulo (null)', () => {
            const resultado = moduloClientes.buscarClientePorId(null);
            assert.isUndefined(resultado, 'Deve retornar undefined para um ID nulo');
        });

        it('Deve retornar undefined ao procurar por um ID undefined (undefined)', () => {
            const resultado = moduloClientes.buscarClientePorId(undefined);
            assert.isUndefined(resultado, 'Deve retornar undefined para um ID undefined');
        });
    });

    describe('adicionarCliente (usando assert)', () => {
        it('Deve adicionar um novo cliente com sucesso e gerar o ID correto (4)', () => {
            const novoCliente = {
                nome: 'Carlos Souza',
                email: 'carlos@email.com',
                telefone: '11966666666'
            };

            const resultado = moduloClientes.adicionarCliente(novoCliente);

            assert.strictEqual(resultado.id, 4, 'O ID gerado deve ser 4');
            assert.lengthOf(moduloClientes.clientes, 4, 'O tamanho da lista deve aumentar para 4');
            assert.deepStrictEqual(moduloClientes.clientes[3], resultado, 'O cliente adicionado deve ser o último na lista');
        });

        it('Deve gerar o ID 1 ao adicionar um cliente a uma lista vazia', () => {
            moduloClientes.clientes.length = 0;
            const primeiroCliente = {
                nome: 'Ana Lima',
                email: 'ana@email.com',
                telefone: '11955555555'
            };

            const resultado = moduloClientes.adicionarCliente(primeiroCliente);

            assert.strictEqual(resultado.id, 1, 'O ID do primeiro cliente deve ser 1');
            assert.lengthOf(moduloClientes.clientes, 1, 'A lista deve conter 1 cliente');
        });

        it('Deve lançar um erro se o email estiver faltando', () => {
            const clienteSemEmail = {
                nome: 'Cliente Fantasma'
            };

            const acaoDeAdicionar = () => moduloClientes.adicionarCliente(clienteSemEmail);

            assert.throws(acaoDeAdicionar, Error, 'Nome e email são obrigatórios');
        });

        it('Deve lançar um erro se o email for inválido', () => {
            const clienteComEmailInvalido = {
                nome: 'Cliente Incorreto',
                email: 'email-invalido.com' 
            };

            const acaoDeAdicionar = () => moduloClientes.adicionarCliente(clienteComEmailInvalido);

            assert.throws(acaoDeAdicionar, Error, 'Email inválido');
        });
    });

    describe('atualizarCliente (usando assert)', () => {

        it('Deve atualizar o nome e telefone de um cliente existente', () => {
            const idParaAtualizar = 1;
            const dadosNovos = {
                nome: 'João Silva Junior',
                telefone: '21912345678'
            };

            const resultado = moduloClientes.atualizarCliente(idParaAtualizar, dadosNovos);

            assert.strictEqual(resultado.nome, 'João Silva Junior');
            assert.strictEqual(resultado.telefone, '21912345678');
            assert.strictEqual(resultado.id, 1, 'O ID não deve ser alterado');
            assert.strictEqual(resultado.email, 'joao@email.com', 'O email não deve ser alterado');
        });

        it('Deve lançar um erro se o ID do cliente não for encontrado', () => {
            const idInexistente = 999;
            const dadosNovos = { nome: 'Fantasma' };
            const acaoDeAtualizar = () => moduloClientes.atualizarCliente(idInexistente, dadosNovos);

            assert.throws(acaoDeAtualizar, Error, 'Cliente não encontrado');
        });

        it('Deve lançar um erro se for fornecido um email inválido para atualização', () => {
            const idParaAtualizar = 2;
            const dadosComEmailInvalido = {
                email: 'email-invalido'
            };

            const acaoDeAtualizar = () => moduloClientes.atualizarCliente(idParaAtualizar, dadosComEmailInvalido);

            assert.throws(acaoDeAtualizar, Error, 'Email inválido');
        });

        it('Deve lançar um erro se o ID fornecido for nulo (null)', () => {
            const dadosNovos = { nome: 'Qualquer' };
            const acaoDeAtualizar = () => moduloClientes.atualizarCliente(null, dadosNovos);

            assert.throws(acaoDeAtualizar, Error, 'O ID do cliente é obrigatório para a atualização.');
        });

        it('Deve lançar um erro se os dados de atualização forem nulos (null)', () => {
            const idParaAtualizar = 1;
            const acaoDeAtualizar = () => moduloClientes.atualizarCliente(idParaAtualizar, null);
            
            assert.throws(acaoDeAtualizar, Error, "Os dados para atualização não podem ser nulos ou indefinidos.");
        });
    });

    describe('removerCliente (usando should)', () => {
        it('Deve remover um cliente com sucesso e diminuir o tamanho da lista', () => {
            const idParaRemover = 2;
            const tamanhoAntes = moduloClientes.clientes.length;
            const resultado = moduloClientes.removerCliente(idParaRemover);
            
            resultado.should.deep.equal({ message: 'Cliente removido com sucesso' });
            
            moduloClientes.clientes.should.have.lengthOf(tamanhoAntes - 1);

            const buscaPeloRemovido = moduloClientes.buscarClientePorId(idParaRemover);
            should.not.exist(buscaPeloRemovido, 'O cliente não deveria mais existir após a remoção');
        });

        it('Deve lançar um erro ao tentar remover um cliente com ID inexistente', () => {
            const idInexistente = 999;
            const tamanhoAntes = moduloClientes.clientes.length;

            const acaoDeRemover = () => moduloClientes.removerCliente(idInexistente);
            
            acaoDeRemover.should.throw(Error, 'Cliente não encontrado');
            moduloClientes.clientes.should.have.lengthOf(tamanhoAntes);
        });

        it('Deve lançar um erro de "não encontrado" ao tentar remover com ID nulo (null)', () => {
            (() => moduloClientes.removerCliente(null)).should.throw(Error, 'Cliente não encontrado');
        });

        it('Deve lançar um erro de "não encontrado" ao tentar remover com ID undefined (undefined)', () => {
            (() => moduloClientes.removerCliente(undefined)).should.throw(Error, 'Cliente não encontrado');
        });
    });

    describe('buscarClientePorEmail (usando should)', () => {
        it('Deve retornar o objeto correto do cliente quando o email existe', () => {
            const emailParaBuscar = 'maria@email.com';
            const clienteEsperado = { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '11988888888' };
            const resultado = moduloClientes.buscarClientePorEmail(emailParaBuscar);

            should.exist(resultado);
            resultado.should.deep.equal(clienteEsperado);
        });

        it('Deve retornar undefined quando o email não existe na lista', () => {
            const emailInexistente = 'fantasma@email.com';
            const resultado = moduloClientes.buscarClientePorEmail(emailInexistente);

            should.not.exist(resultado);
        });

        it('Deve ser case-sensitive e não encontrar um email com letras maiúsculas', () => {
            const emailComOutroCase = 'JOAO@email.com';
            const resultado = moduloClientes.buscarClientePorEmail(emailComOutroCase);

            should.not.exist(resultado, 'A busca deve ser case-sensitive');
        });

        it('Deve retornar undefined ao procurar por um email nulo (null)', () => {
            const resultado = moduloClientes.buscarClientePorEmail(null);
            should.not.exist(resultado);
        });

        it('Deve retornar undefined ao procurar por um email vazio', () => {
            const resultado = moduloClientes.buscarClientePorEmail('');
            should.not.exist(resultado);
        });
    });

    describe('formatarTelefone (usando should)', () => {
        it('Deve formatar corretamente um telefone de 11 dígitos sem formatação', () => {
            const telefoneOriginal = '47988776655';
            const telefoneFormatado = moduloClientes.formatarTelefone(telefoneOriginal);
            
            telefoneFormatado.should.equal('(47) 98877-6655');
        });

        it('Deve remover caracteres não numéricos e formatar um telefone de 11 dígitos', () => {
            const telefoneSujo = '(47) 9 1234-5678 xyz';
            const telefoneFormatado = moduloClientes.formatarTelefone(telefoneSujo);

            telefoneFormatado.should.equal('(47) 91234-5678');
        });

        it('Não deve formatar e deve retornar o original se tiver 10 dígitos (telefone fixo)', () => {
            const telefoneFixo = '4734338888';
            const resultado = moduloClientes.formatarTelefone(telefoneFixo);

            resultado.should.equal(telefoneFixo);
        });

        it('Não deve formatar e deve retornar o original se tiver mais de 11 dígitos', () => {
            const telefoneLongo = '5547988776655'; 
            const resultado = moduloClientes.formatarTelefone(telefoneLongo);

            resultado.should.equal(telefoneLongo);
        });

        it('Não deve formatar e deve retornar o original se for uma string vazia', () => {
            const telefoneVazio = '';
            const resultado = moduloClientes.formatarTelefone(telefoneVazio);
            
            resultado.should.equal(telefoneVazio);
        });

        it('Deve lançar um erro se a entrada for nula (null)', () => {
            const acaoDeFormatar = () => moduloClientes.formatarTelefone(null);
            acaoDeFormatar.should.throw(TypeError, "Cannot read properties of null (reading 'replace')");
        });

        it('Deve lançar um erro se a entrada for undefined (undefined)', () => {
            const acaoDeFormatar = () => moduloClientes.formatarTelefone(undefined);
            acaoDeFormatar.should.throw(TypeError, "Cannot read properties of undefined (reading 'replace')");
        });

        it('Deve lançar um erro se a entrada for um número em vez de string', () => {
            const acaoDeFormatar = () => moduloClientes.formatarTelefone(47988776655);
            acaoDeFormatar.should.throw(TypeError);
        });
    });
});