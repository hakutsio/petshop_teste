const { expect } = require('chai');
const { 
    listarAgendamentos, 
    buscarAgendamentoPorId, 
    adicionarAgendamento,
    removerAgendamento,
    marcarComoConcluido,
    cancelarAgendamento,
    filtrarPorStatus, 
    verificarDisponibilidade,
    atualizarAgendamento } = require('../src/agendamentos.js');
let { agendamentos } = require('../src/agendamentos.js');

describe('Testando agendamentos', () => {

    const estadoInicial = [
        { id: 1, servicoId: 1, petId: 1, data: '2025-10-10', status: 'agendado' },
        { id: 2, servicoId: 2, petId: 2, data: '2025-10-11', status: 'concluido' },
        { id: 3, servicoId: 3, petId: 3, data: '2025-10-12', status: 'cancelado' }
    ];

    beforeEach(() => {
        agendamentos.length = 0;
        agendamentos.push(...estadoInicial);
    });

    describe('listarAgendamentos', () => {
        it('Deve retornar um array com 3 agendamentos', () => {
            const resultado = listarAgendamentos();
            expect(resultado).to.have.lengthOf(3);
            expect(resultado).to.deep.equal(estadoInicial);
        });
    
        it('Deve garantir que cada agendamento tenha uma chave correta', () => {
            const resultado = listarAgendamentos();
            const chaves = ['id', 'servicoId', 'petId', 'data', 'status'];
        
            const primeiroAgendamento = resultado[0];
            const segundoAgendamento = resultado[1];
            const terceiroAgendamento = resultado[2];
    
            console.log("chaves do primeiro");
            console.log(Object.keys(primeiroAgendamento));
            console.log("chaves do segundo");
            console.log(Object.keys(segundoAgendamento));
            console.log("chaves terceiro");
            console.log(Object.keys(terceiroAgendamento));
    
            expect(resultado[0]).to.have.all.keys(chaves);
            expect(resultado[1]).to.have.all.keys(chaves);
            expect(resultado[2]).to.have.all.keys(chaves);
        });
    
        it('Deve retornar um array vazio se não houver agendamentos', () => {
            agendamentos.length = 0;
            const resultado = listarAgendamentos();
    
            expect(resultado).to.be.an('array');
            expect(resultado).to.have.lengthOf(0);
        });
    });

    describe('buscarAgendamentoPorId', () => {
        it('Deve retornar o agendamento correto quando o ID existe (2)', () => {
            const idBuscar = 2;
            const agendamentoEsperado = { id:2, servicoId: 2, petId:2, data: '2025-10-11', status: 'concluido' };
            const resultado = buscarAgendamentoPorId(idBuscar);
            expect(resultado).to.deep.equal(agendamentoEsperado);
        });

        it('Deve retornar o agendamento correto quando o ID existe (3)', () => {
            const idBuscar = 3;
            const agendamentoEsperado = { id:3, servicoId: 3, petId:3, data: '2025-10-12', status: 'cancelado' };
            const resultado = buscarAgendamentoPorId(idBuscar);
            expect(resultado).to.deep.equal(agendamentoEsperado);
        });

        it('Deve retornar undefined quando o ID não existe', () => {
            const idBuscar = 999;
            const resultado = buscarAgendamentoPorId(idBuscar);
            expect(resultado).to.be.undefined;
        });

        it('Deve retornar undefined ao procurar com um ID de tipo diferente (string)', () => {
            const idBuscar = '1';
            const resultado = buscarAgendamentoPorId(idBuscar);
            expect(resultado).to.be.undefined;
        });

        it('Deve retornar undefined ao procurar por um ID null', () => {
            const resultado = buscarAgendamentoPorId(null);
            expect(resultado).to.be.undefined;
        });

        it('Deve retornar undefined ao procurar por um IS undefined ', () => {
            const resultado = buscarAgendamentoPorId(undefined);
            expect(resultado).to.be.undefined;
        });
    });

    describe('adicionarAgendamentos', () => {
        it('Deve adicionar um novo agendamento e retorná-lo com o ID correto (4)', () => {
            const newAgen = {
                servicoId: 4,
                petId: 4,
                data: '2025-11-01',
                status: 'agendado'  
            };

            const resultado = adicionarAgendamento(newAgen);

            expect(resultado.id).to.equal(4);
            expect(resultado.servicoId).to.equal(4);
            expect(resultado.status).to.equal('agendado');
            expect(agendamentos).to.have.lengthOf(4);
            expect(agendamentos[3]).to.deep.equal(resultado);

            console.log(agendamentos);
        });

        it('Deve gerar IDs sequenciais corretamente ao adicionar múltiplos agendamentos', () => {
            const priAgen = { servicoId: 4, petId: 4, data: '2025-11-01', status: 'agendado' };
            const resultado1 = adicionarAgendamento(priAgen);

            expect(resultado1.id).to.equal(4);
            expect(agendamentos).to.have.lengthOf(4);
            expect(agendamentos[3]).to.deep.equal(resultado1);

            const segAgen = { servicoId: 5, petId: 5, data: '2025-12-01', status: 'cancelado' };
            const resultado2 = adicionarAgendamento(segAgen);

            expect(resultado2.id).to.equal(5);
            expect(agendamentos).to.have.lengthOf(5);
            expect(agendamentos[4]).to.deep.equal(resultado2);
            
            console.log('Lista final com 5 agendamentos:');
            console.log(agendamentos);
        });

        it('Deve gerar o ID 1 ao adicionar um agendamento a uma lista vazia', () => {
            agendamentos.length = 0; 
            const primeiroAgendamento = { servicoId: 1, petId: 1, data: '2025-10-10', status: 'agendado' };
            const resultado = adicionarAgendamento(primeiroAgendamento);

            expect(resultado.id).to.equal(1);
            expect(agendamentos).to.have.lengthOf(1);
        });

        it('Deve lançar um erro ao tentar adicionar um valor nulo (null)', () => {
            const acaoDeAdicionar = () => adicionarAgendamento(null);
            expect(acaoDeAdicionar).to.throw(Error, "Dados do agendamento não podem ser nulos ou indefinidos.");
        });

        it('Deve lançar um erro ao tentar adicionar um valor indefinido (undefined)', () => {
            const acaoDeAdicionar = () => adicionarAgendamento(undefined);
            expect(acaoDeAdicionar).to.throw(Error, "Dados do agendamento não podem ser nulos ou indefinidos.");
        });
    });

    describe('atualizarAgendamento', () => {
        it('Deve atualizar corretamente as props de um agendamento existente (id:2)', () => {
            const idAtt = 2;
            const dadosNovos = {
                data: '2025-10-35',
                status: 'atendido'
            };

            const resultado = atualizarAgendamento(idAtt, dadosNovos);

            expect(resultado.data).to.equal('2025-10-35');
            expect(resultado.status).to.equal('atendido');
            expect(resultado.id).to.equal(2);
            expect(resultado.petId).to.equal(2);

            const agendamentoEspec = agendamentos.find(a => a.id === idAtt);
            expect(agendamentoEspec.status).to.equal('atendido');
        });

        it('Deve atualizar corretamente as props de um agendamento existente (id:3)', () => {
            const idAtt = 3;
            const dadosNovos = {
                data: '2023-10-35',
                status: 'teste3'
            };

            const resultado = atualizarAgendamento(idAtt, dadosNovos);

            expect(resultado.data).to.equal('2023-10-35');
            expect(resultado.status).to.equal('teste3');
            expect(resultado.id).to.equal(3);
            expect(resultado.petId).to.equal(3);

            const agendamentoEspec = agendamentos.find(a => a.id === idAtt);
            expect(agendamentoEspec.status).to.equal('teste3');
        });

        it('Deve lançar um erro ao tentar atualizar um agendamento com ID inexistente', () => {
            const idInexistente = 999;
            const dadosNovos = { status: 'perdido' };

            const acaoDeAtualizar = () => atualizarAgendamento(idInexistente, dadosNovos);

            expect(acaoDeAtualizar).to.throw(Error, 'Agendamento não encontrado');
        });

        it('Deve lançar um Error se os dadosAtualizados forem nulos (null)', () => {
            const acaoDeAtualizar = () => atualizarAgendamento(1, null);

            expect(acaoDeAtualizar).to.throw(Error, "Os dados para atualização não podem ser nulos ou indefinidos.");
        });

        it('Deve lançar um Error se os dadosAtualizados forem nulos (undefined)', () => {
            const acaoDeAtualizar = () => atualizarAgendamento(1, undefined);

            expect(acaoDeAtualizar).to.throw(Error, "Os dados para atualização não podem ser nulos ou indefinidos.");
        });

        it('Deve lançar um Error se os ID forem nulos (null)', () => {
            const dadosNovos = { status: 'perdido no limbo' };
            const acaoDeAtualizar = () => atualizarAgendamento(null, dadosNovos);

            expect(acaoDeAtualizar).to.throw(Error, "O ID do agendamento é obrigatório para a atualização.");
        });

        it('Deve lançar um Error se os ID forem undefined (undefined)', () => {
            const dadosNovos = { status: 'perdido no limbo' };
            const acaoDeAtualizar = () => atualizarAgendamento(undefined, dadosNovos);

            expect(acaoDeAtualizar).to.throw(Error, "O ID do agendamento é obrigatório para a atualização.");
        });
    });

    describe('removerAgendamento', () => {
        it('Deve remover um agendamento com sucesso quando o ID existe', () => {
            const idParaRemover = 1;
            const tamanhoAntes = agendamentos.length; 
            const resultado = removerAgendamento(idParaRemover);

            expect(resultado).to.deep.equal({ message: 'Agendamento removido com sucesso' });
            expect(agendamentos).to.have.lengthOf(tamanhoAntes - 1);

            const buscaPeloIdRemovido = agendamentos.find(a => a.id === idParaRemover);
            expect(buscaPeloIdRemovido).to.be.undefined;
        });

        it('Deve lançar um erro ao tentar remover um agendamento com ID inexistente', () => {
            const idInexistente = 999;
            const tamanhoAntes = agendamentos.length;
            const acaoDeRemover = () => removerAgendamento(idInexistente);

            expect(acaoDeRemover).to.throw(Error, 'Agendamento não encontrado');
            expect(agendamentos).to.have.lengthOf(tamanhoAntes);
        });

        it('Deve lançar um erro de "não encontrado" ao tentar remover com ID nulo (null)', () => {
            const acaoDeRemover = () => removerAgendamento(null);
            expect(acaoDeRemover).to.throw(Error, 'Agendamento não encontrado');
        });

        it('Deve lançar um erro de "não encontrado" ao tentar remover com ID undefined (undefined)', () => {
            const acaoDeRemover = () => removerAgendamento(undefined);
            expect(acaoDeRemover).to.throw(Error, 'Agendamento não encontrado');
        });
    });

    describe('marcarComoConcluido (Teste de Integração)', () => {
        it('Deve alterar o status de um agendamento existente para "concluido"', () => {
            const idParaConcluir = 1;
            const resultado = marcarComoConcluido(idParaConcluir);

            expect(resultado.status).to.equal('concluido');
            expect(resultado.id).to.equal(idParaConcluir);

            const agendamentoNaLista = buscarAgendamentoPorId(idParaConcluir);
            expect(agendamentoNaLista.status).to.equal('concluido');
        });

        it('Deve lançar um erro ao tentar concluir um agendamento com ID inexistente', () => {
            const idInexistente = 999;
            const acaoDeConcluir = () => marcarComoConcluido(idInexistente);

            expect(acaoDeConcluir).to.throw(Error, 'Agendamento não encontrado');
        });

        it('Deve funcionar corretamente mesmo que o agendamento já esteja "concluido"', () => {
            const idJaConcluido = 2; 
            const resultado = marcarComoConcluido(idJaConcluido);

            expect(resultado.status).to.equal('concluido');
        });

        it('Deve lançar um erro de "não encontrado" ao passar null como ID', () => {
            const acaoDeConcluir = () => marcarComoConcluido(null);
            expect(acaoDeConcluir).to.throw(Error, 'Agendamento não encontrado');
        });

        it('Deve lançar um erro de "não encontrado" ao passar undefined como ID', () => {
            const acaoDeConcluir = () => marcarComoConcluido(undefined);
            expect(acaoDeConcluir).to.throw(Error, 'Agendamento não encontrado');
        });
    });

    describe('cancelarAgendamento (Teste de Integração)', () => {
        it('Deve alterar o status de um agendamento "agendado" para "cancelado"', () => {
            const idParaCancelar = 1; 
            const resultado = cancelarAgendamento(idParaCancelar);

            expect(resultado.status).to.equal('cancelado');

            const agendamentoNaLista = buscarAgendamentoPorId(idParaCancelar);
            expect(agendamentoNaLista.status).to.equal('cancelado');
        });

        it('Deve lançar um erro ao tentar cancelar um agendamento com ID inexistente', () => {
            const idInexistente = 999;
            const acaoDeCancelar = () => cancelarAgendamento(idInexistente);
            expect(acaoDeCancelar).to.throw(Error, 'Agendamento não encontrado');
        });

        it('Deve lançar um erro específico ao tentar cancelar um agendamento já CONCLUÍDO', () => {
            const idConcluido = 2; 
            const acaoDeCancelar = () => cancelarAgendamento(idConcluido);
            
            expect(acaoDeCancelar).to.throw(Error, 'Não é possível cancelar agendamento concluído');
            
            const agendamentoNaLista = buscarAgendamentoPorId(idConcluido);
            expect(agendamentoNaLista.status).to.equal('concluido');
        });

        it('Deve lançar um erro de "não encontrado" ao passar null como ID', () => {
            const acaoDeCancelar = () => cancelarAgendamento(null);
            expect(acaoDeCancelar).to.throw(Error, 'Agendamento não encontrado');
        });

        it('Deve lançar um erro de "não encontrado" ao passar undefined como ID', () => {
            const acaoDeCancelar = () => cancelarAgendamento(undefined);
            expect(acaoDeCancelar).to.throw(Error, 'Agendamento não encontrado');
        });
    });

    describe('filtrarPorStatus', () => {
        it('Deve retornar um array com todos os agendamentos de um status específico ("agendado")', () => {
            const resultado = filtrarPorStatus('agendado');
            
            expect(resultado).to.be.an('array');
            expect(resultado).to.have.lengthOf(1);
            expect(resultado[0].id).to.equal(1); 
        });

        it('Deve retornar um array com todos os agendamentos de um status específico ("concluido")', () => {
            const resultado = filtrarPorStatus('concluido');
            
            expect(resultado).to.be.an('array');
            expect(resultado).to.have.lengthOf(1);
            expect(resultado[0].id).to.equal(2);
        });

        it('Deve retornar um array vazio se nenhum agendamento corresponder ao status', () => {
            const resultado = filtrarPorStatus('pendente');

            expect(resultado).to.be.an('array');
            expect(resultado).to.have.lengthOf(0);
        });

        it('Deve retornar um array vazio ao filtrar uma lista de agendamentos vazia', () => {
            agendamentos.length = 0; 
            const resultado = filtrarPorStatus('concluido');
            expect(resultado).to.deep.equal([]);
        });

        it('Deve retornar um array vazio ao filtrar por um status nulo (null)', () => {
            const resultado = filtrarPorStatus(null);
            expect(resultado).to.deep.equal([]);
        });

        it('Deve retornar um array vazio ao filtrar por um status undefined (undefined)', () => {
            const resultado = filtrarPorStatus(undefined);
            expect(resultado).to.deep.equal([]);
        });
    });

    describe('Função: verificarDisponibilidade', () => {

        it('Deve retornar TRUE se houver menos de 5 agendamentos "agendados" para a data', () => {
            const resultado = verificarDisponibilidade('2025-10-10');
            expect(resultado).to.be.true;
        });

        it('Deve retornar FALSE se houver 5 ou mais agendamentos "agendados" para a data', () => {
            adicionarAgendamento({ servicoId: 10, petId: 10, data: '2025-10-10', status: 'agendado' });
            adicionarAgendamento({ servicoId: 11, petId: 11, data: '2025-10-10', status: 'agendado' });
            adicionarAgendamento({ servicoId: 12, petId: 12, data: '2025-10-10', status: 'agendado' });
            adicionarAgendamento({ servicoId: 13, petId: 13, data: '2025-10-10', status: 'agendado' });
            
            const resultado = verificarDisponibilidade('2025-10-10');
            expect(resultado).to.be.false;
        });

        it('Deve ignorar agendamentos com status "concluido" ou "cancelado" na contagem', () => {
            adicionarAgendamento({ servicoId: 20, petId: 20, data: '2025-10-10', status: 'cancelado' });
            adicionarAgendamento({ servicoId: 21, petId: 21, data: '2025-10-10', status: 'concluido' });
            
            const resultado = verificarDisponibilidade('2025-10-10');
            expect(resultado).to.be.true;
        });

        it('Deve retornar TRUE para uma data onde não há nenhum agendamento', () => {
            const resultado = verificarDisponibilidade('2099-12-31');
            expect(resultado).to.be.true;
        });

        it('Deve retornar TRUE (disponível) ao passar null ou undefined como data', () => {
            const resultadoNull = verificarDisponibilidade(null);
            expect(resultadoNull).to.be.true;

            const resultadoUndefined = verificarDisponibilidade(undefined);
            expect(resultadoUndefined).to.be.true;
        });
    });
});



