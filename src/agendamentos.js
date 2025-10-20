let agendamentos = [
  { id: 1, servicoId: 1, petId: 1, data: '2025-10-10', status: 'agendado' },
  { id: 2, servicoId: 2, petId: 2, data: '2025-10-11', status: 'concluido' },
  { id: 3, servicoId: 3, petId: 3, data: '2025-10-12', status: 'cancelado' }
];

function listarAgendamentos() {
  return agendamentos; 
}

function buscarAgendamentoPorId(id) {
  return agendamentos.find(agendamento => agendamento.id === id);
}

function adicionarAgendamento(novoAgendamento) {
  let proximoId;

  if (!novoAgendamento) {
    throw new Error("Dados do agendamento não podem ser nulos ou indefinidos.");
  }

  if (agendamentos.length > 0) {
    const todosOsIds = agendamentos.map(a => a.id);
    const maiorId = Math.max(...todosOsIds);
    proximoId = maiorId + 1;
  } else {
    proximoId = 1;
  }
  
  const agendamentoComId = { id: proximoId, ...novoAgendamento };
  agendamentos.push(agendamentoComId);
  return agendamentoComId;
}

function atualizarAgendamento(id, dadosAtualizados) {
  if (!dadosAtualizados) {
    throw new Error("Os dados para atualização não podem ser nulos ou indefinidos.");
  }

  if (id === undefined || id === null) {
    throw new Error("O ID do agendamento é obrigatório para a atualização.");
  }

  const index = agendamentos.findIndex(agendamento => agendamento.id === id);
  if (index === -1) {
    throw new Error('Agendamento não encontrado');
  }
  agendamentos[index] = { ...agendamentos[index], ...dadosAtualizados };
  return agendamentos[index];
}

function removerAgendamento(id) {
  const index = agendamentos.findIndex(agendamento => agendamento.id === id);
  
  if (index === -1) {
    throw new Error('Agendamento não encontrado');
  }
  agendamentos.splice(index, 1);
  
  return { message: 'Agendamento removido com sucesso' };
}

function marcarComoConcluido(id) {
  const agendamento = buscarAgendamentoPorId(id);
  if (!agendamento) {
    throw new Error('Agendamento não encontrado');
  }
  return atualizarAgendamento(id, { status: 'concluido' });
}

function cancelarAgendamento(id) {
  const agendamento = buscarAgendamentoPorId(id);
  if (!agendamento) {
    throw new Error('Agendamento não encontrado');
  }
  if (agendamento.status === 'concluido') {
    throw new Error('Não é possível cancelar agendamento concluído');
  }
  return atualizarAgendamento(id, { status: 'cancelado' });
}

function filtrarPorStatus(status) {
  return agendamentos.filter(agendamento => agendamento.status === status);
}

function verificarDisponibilidade(data) {
  const agendamentosNaData = agendamentos.filter(a => a.data === data && a.status === 'agendado');
  return agendamentosNaData.length < 5; 
}

module.exports = {
  listarAgendamentos,
  buscarAgendamentoPorId,
  adicionarAgendamento,
  atualizarAgendamento,
  removerAgendamento,
  marcarComoConcluido,
  cancelarAgendamento,
  filtrarPorStatus,
  verificarDisponibilidade,
  agendamentos
};
