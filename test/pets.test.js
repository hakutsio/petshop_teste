const { expect } = require('chai');
const sinon = require('sinon');

const moduloPets = require('../src/pets.js');

describe('Testes para o Módulo de Pets', () => {

    const estadoInicial = [
        { id: 1, nome: 'Rex', tipo: 'Cachorro', raca: 'Labrador', idade: 3 },
        { id: 2, nome: 'Satanas', tipo: 'Gato', raca: 'Siamês', idade: 2 },
        { id: 3, nome: 'Bob', tipo: 'Cachorro', raca: 'Bulldog', idade: 5 }
    ];

    beforeEach(() => {
        moduloPets.pets = [...estadoInicial];
    });
    
    afterEach(() => {
        sinon.restore();
    });

    describe('buscarTodosPets', () => {
        it('Deve retornar um array', () => {
            const resultado = moduloPets.buscarTodosPets();
            expect(resultado).to.be.an('array');
        });

        it('Deve retornar a lista completa com 3 pets', () => {
            const resultado = moduloPets.buscarTodosPets();

            expect(resultado).to.have.lengthOf(3);
            expect(resultado).to.deep.equal(estadoInicial);
        });

        it('Deve retornar um array vazio se a lista de pets for esvaziada', () => {
            moduloPets.pets.length = 0;
            const resultado = moduloPets.buscarTodosPets();

            expect(resultado).to.be.an('array');
            expect(resultado).to.have.lengthOf(0);
        });

        it('Deve retornar um array vazio se a lista de pets for nula (null)', () => {
            moduloPets.pets = null;
            const resultado = moduloPets.buscarTodosPets();

            expect(resultado).to.deep.equal([]);
        });

        it('Deve retornar um array vazio se a lista de pets for undefined (undefined)', () => {
            moduloPets.pets = undefined;
            const resultado = moduloPets.buscarTodosPets();
            
            expect(resultado).to.deep.equal([]);
        });
    });

    describe('buscarPetPorId', () => {
        it('Deve retornar o objeto correto do pet quando o ID existe', () => {
            const idParaBuscar = 2;
            const petEsperado = { id: 2, nome: 'Satanas', tipo: 'Gato', raca: 'Siamês', idade: 2 };
            const resultado = moduloPets.buscarPetPorId(idParaBuscar);

            expect(resultado).to.deep.equal(petEsperado);
        });

        it('Deve retornar undefined quando o ID não existe na lista', () => {
            const idInexistente = 999;
            const resultado = moduloPets.buscarPetPorId(idInexistente);

            expect(resultado).to.be.undefined;
        });

        it('Deve retornar undefined ao buscar com um ID de tipo diferente (string)', () => {
            const idString = '1';
            const resultado = moduloPets.buscarPetPorId(idString);

            expect(resultado).to.be.undefined;
        });

        it('Deve retornar undefined ao buscar com um ID nulo (null)', () => {
            const resultado = moduloPets.buscarPetPorId(null);
            expect(resultado).to.be.undefined;
        });

        it('Deve retornar undefined ao buscar com um ID undefined (undefined)', () => {
            const resultado = moduloPets.buscarPetPorId(undefined);
            expect(resultado).to.be.undefined;
        });
    });

    describe('adicionarPet', () => {
        it('Deve calcular o ID correto e tentar adicionar o pet ( Sinon )', () => {
            const dubleDoPush = sinon.stub(moduloPets.pets, 'push');
            const novoPet = { nome: 'Fido', tipo: 'Cachorro', raca: 'Vira-lata' };
            const resultado = moduloPets.adicionarPet(novoPet);

            expect(resultado.id).to.equal(4); 
            expect(dubleDoPush.calledOnce).to.be.true;

            const argumentoEnviadoParaOPush = dubleDoPush.getCall(0).args[0];
            expect(argumentoEnviadoParaOPush).to.deep.equal({
                id: 4,
                nome: 'Fido',
                tipo: 'Cachorro',
                raca: 'Vira-lata'
            });

            expect(moduloPets.pets).to.have.lengthOf(3);
        });

        it('Deve realmente adicionar o pet à lista', () => {
            const novoPet = { nome: 'Fido', tipo: 'Cachorro', raca: 'Vira-lata' };
            moduloPets.adicionarPet(novoPet);

            expect(moduloPets.pets).to.have.lengthOf(4);
            expect(moduloPets.pets[3].nome).to.equal('Fido');
        });

        it('Deve lançar um erro se o NOME estiver faltando no novo pet', () => {
            const petSemNome = {
                tipo: 'Cachorro',
                raca: 'Poodle'
            };
            const acaoDeAdicionar = () => moduloPets.adicionarPet(petSemNome);

            expect(acaoDeAdicionar).to.throw(Error, 'Nome e tipo são obrigatórios');
        });

        it('Deve lançar um erro se o TIPO estiver faltando no novo pet', () => {
            const petSemTipo = {
                nome: 'SemTipo',
                raca: 'Desconhecida'
            };
            const acaoDeAdicionar = () => moduloPets.adicionarPet(petSemTipo);

            expect(acaoDeAdicionar).to.throw(Error, 'Nome e tipo são obrigatórios');
        });

        it('Deve gerar o ID 1 ao adicionar o primeiro pet a uma lista vazia', () => {
            moduloPets.pets.length = 0; 
            const primeiroPet = { nome: 'Piu', tipo: 'Passaro', raca: 'Canario' };
            const resultado = moduloPets.adicionarPet(primeiroPet);

            expect(resultado.id).to.equal(1);
            expect(moduloPets.pets).to.have.lengthOf(1);
            expect(moduloPets.pets[0].nome).to.equal('Piu');
        });

        it('Deve lançar um erro se o objeto novoPet for nulo (null)', () => {
            const acaoDeAdicionar = () => moduloPets.adicionarPet(null);
            expect(acaoDeAdicionar).to.throw(Error, 'Nome e tipo são obrigatórios');
        });

        it('Deve lançar um erro se o objeto novoPet for indefinido (undefined)', () => {
            const acaoDeAdicionar = () => moduloPets.adicionarPet(undefined);
            expect(acaoDeAdicionar).to.throw(Error, 'Nome e tipo são obrigatórios');
        });
    });

    describe('atualizarPet', () => {
        it('Deve atualizar o nome e a idade de um pet existente', () => {
            const idParaAtualizar = 1; 
            const dadosNovos = {
                nome: 'Rex, o Sábio',
                idade: 4
            };
            const resultado = moduloPets.atualizarPet(idParaAtualizar, dadosNovos);

            expect(resultado.nome).to.equal('Rex, o Sábio');
            expect(resultado.idade).to.equal(4);
            expect(resultado.id).to.equal(1);
            expect(resultado.tipo).to.equal('Cachorro');
        });

        it('Deve refletir a atualização na lista principal de pets', () => {
            const idParaAtualizar = 3;
            const dadosNovos = { raca: 'Bulldog Francês' };

            moduloPets.atualizarPet(idParaAtualizar, dadosNovos);
            const petNaLista = moduloPets.buscarPetPorId(idParaAtualizar);
            expect(petNaLista.raca).to.equal('Bulldog Francês');
        });

        it('Deve lançar um erro se o ID do pet não for encontrado', () => {
            const idInexistente = 999;
            const dadosNovos = { nome: 'Fantasma' };
            const acaoDeAtualizar = () => moduloPets.atualizarPet(idInexistente, dadosNovos);

            expect(acaoDeAtualizar).to.throw(Error, 'Pet não encontrado');
        });

        it('Deve lançar um TypeError se os dados para atualização forem nulos (null)', () => {
            const idParaAtualizar = 1;
            const acaoDeAtualizar = () => moduloPets.atualizarPet(idParaAtualizar, null);
            expect(acaoDeAtualizar).to.throw(Error);
        });
    });

    describe('removerPet ( Sinon )', () => {
        it('Deve chamar findIndex e splice corretamente para remover um pet', () => {
            const idParaRemover = 2;
            const indiceEncontrado = 1;
            const dubleDoFindIndex = sinon.stub(moduloPets.pets, 'findIndex').returns(indiceEncontrado);
            const dubleDoSplice = sinon.stub(moduloPets.pets, 'splice');
            const resultado = moduloPets.removerPet(idParaRemover);

            expect(dubleDoFindIndex.calledOnce).to.be.true;
            expect(dubleDoSplice.calledOnce).to.be.true;
            expect(dubleDoSplice.calledWith(indiceEncontrado, 1)).to.be.true;
            expect(resultado).to.deep.equal({ message: 'Pet removido com sucesso' });
            expect(moduloPets.pets).to.have.lengthOf(3); 
        });

        it('Deve chamar findIndex e lançar erro se o pet não for encontrado (sem chamar splice)', () => {
            const idInexistente = 999;
            const dubleDoFindIndex = sinon.stub(moduloPets.pets, 'findIndex').returns(-1);
            const dubleDoSplice = sinon.stub(moduloPets.pets, 'splice');
            const acaoDeRemover = () => moduloPets.removerPet(idInexistente);

            expect(acaoDeRemover).to.throw(Error, 'Pet não encontrado');
            expect(dubleDoFindIndex.calledOnce).to.be.true;
            expect(dubleDoSplice.notCalled).to.be.true;
        });

        it('Deve remover um pet com sucesso e diminuir o tamanho da lista', () => {
            const idParaRemover = 1; 
            const tamanhoAntes = moduloPets.pets.length; 
            const resultado = moduloPets.removerPet(idParaRemover);

            expect(resultado).to.deep.equal({ message: 'Pet removido com sucesso' });
            expect(moduloPets.pets).to.have.lengthOf(tamanhoAntes - 1); 
            const buscaPeloIdRemovido = moduloPets.buscarPetPorId(idParaRemover);
            expect(buscaPeloIdRemovido).to.be.undefined;
        });

        it('Deve lançar um erro ao tentar remover um pet com ID inexistente (sem Sinon)', () => {
            const idInexistente = 999;
            const tamanhoAntes = moduloPets.pets.length;
            const acaoDeRemover = () => moduloPets.removerPet(idInexistente);

            expect(acaoDeRemover).to.throw(Error, 'Pet não encontrado');
            expect(moduloPets.pets).to.have.lengthOf(tamanhoAntes);
        });
    });

    describe('filtrarPetsPorTipo', () => {
        it('Deve retornar um array contendo apenas Cachorros', () => {
            const resultado = moduloPets.filtrarPetsPorTipo('Cachorro');
            
            expect(resultado).to.be.an('array');
            expect(resultado).to.have.lengthOf(2); 
            resultado.forEach(pet => {
                expect(pet.tipo).to.equal('Cachorro');
            });
            expect(resultado.some(pet => pet.id === 2)).to.be.false; 
        });

        it('Deve retornar um array contendo apenas Gatos', () => {
            const resultado = moduloPets.filtrarPetsPorTipo('Gato');
            
            expect(resultado).to.have.lengthOf(1);
            expect(resultado[0].id).to.equal(2); 
        });

        it('Deve retornar um array vazio se nenhum pet corresponder ao tipo', () => {
            const resultado = moduloPets.filtrarPetsPorTipo('Pássaro');
            
            expect(resultado).to.be.an('array');
            expect(resultado).to.have.lengthOf(0);
        });

        it('Deve retornar um array vazio ao filtrar uma lista de pets vazia', () => {
            moduloPets.pets.length = 0; 
            const resultado = moduloPets.filtrarPetsPorTipo('Cachorro');
            expect(resultado).to.deep.equal([]);
        });

        it('Deve retornar um array vazio ao filtrar por um tipo nulo (null)', () => {
            const resultado = moduloPets.filtrarPetsPorTipo(null);
            expect(resultado).to.deep.equal([]);
        });
    });

    describe('calcularIdadeEmMeses', () => {
        it('Deve retornar a idade correta em meses para um número inteiro positivo', () => {
            const resultado = moduloPets.calcularIdadeEmMeses(3); 
            expect(resultado).to.equal(36); 
        });

        it('Deve retornar 0 meses para 0 anos', () => {
            const resultado = moduloPets.calcularIdadeEmMeses(0);
            expect(resultado).to.equal(0);
        });

        it('Deve funcionar corretamente com números decimais (meio ano)', () => {
            const resultado = moduloPets.calcularIdadeEmMeses(0.5); 
            expect(resultado).to.equal(6);
        });

        it('Deve lançar um erro se a idade for um número negativo', () => {
            const acaoDeCalcular = () => moduloPets.calcularIdadeEmMeses(-1);
            expect(acaoDeCalcular).to.throw(Error, 'Idade deve ser um número positivo');
        });

        it('Deve lançar um erro se a idade não for um número (string)', () => {
            const acaoDeCalcular = () => moduloPets.calcularIdadeEmMeses('3');
            expect(acaoDeCalcular).to.throw(Error, 'Idade deve ser um número positivo');
        });

        it('Deve lançar um erro se a idade for nula (null)', () => {
            const acaoDeCalcular = () => moduloPets.calcularIdadeEmMeses(null);
            expect(acaoDeCalcular).to.throw(Error, 'Idade deve ser um número positivo');
        });

        it('Deve lançar um erro se a idade for indefinida (undefined)', () => {
            const acaoDeCalcular = () => moduloPets.calcularIdadeEmMeses(undefined);
            expect(acaoDeCalcular).to.throw(Error, 'Idade deve ser um número positivo');
        });
    });

    describe('Função: ehFilhote (usando expect)', () => {
        it('Deve retornar TRUE para uma idade menor que 1 (ex: 0.5)', () => {
            const resultado = moduloPets.ehFilhote(0.5);
            expect(resultado).to.be.true;
        });

        it('Deve retornar TRUE para uma idade igual a 0', () => {
            const resultado = moduloPets.ehFilhote(0);
            expect(resultado).to.be.true;
        });

        it('Deve retornar FALSE para uma idade igual a 1', () => {
            const resultado = moduloPets.ehFilhote(1);
            expect(resultado).to.be.false;
        });

        it('Deve retornar FALSE para uma idade maior que 1 (ex: 3)', () => {
            const resultado = moduloPets.ehFilhote(3);
            expect(resultado).to.be.false;
        });

        it('Deve retornar TRUE para uma idade negativa (conforme a lógica atual)', () => {
            const resultado = moduloPets.ehFilhote(-1);
            expect(resultado).to.be.true; 
        });
    });
});