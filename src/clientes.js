let clientes = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '11999999999' },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '11988888888' },
  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', telefone: '11977777777' }
];

function listarClientes() {
  return module.exports.clientes || [];
}

function buscarClientePorId(id) {
  return module.exports.clientes.find(cliente => cliente.id === id);
}

function validarEmail(email) {
  const regex = /^[^@]+@[^@]+\.[^@]+$/;
  return regex.test(email);
}

function adicionarCliente(novoCliente) {
  if (!novoCliente.nome || !novoCliente.email) {
    throw new Error('Nome e email são obrigatórios');
  }
  if (!validarEmail(novoCliente.email)) {
    throw new Error('Email inválido');
  }
  const id = module.exports.clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
  const clienteComId = { id, ...novoCliente };
  module.exports.clientes.push(clienteComId);
  return clienteComId;
}

function atualizarCliente(id, dadosAtualizados) {
  if (!dadosAtualizados) {
    throw new Error("Os dados para atualização não podem ser nulos ou indefinidos.");
  }

  if (id === undefined || id === null) {
    throw new Error("O ID do cliente é obrigatório para a atualização.");
  }

  if (dadosAtualizados.email && !validarEmail(dadosAtualizados.email)) {
    throw new Error('Email inválido');
  }

  const index = module.exports.clientes.findIndex(cliente => cliente.id === id);
  if (index === -1) {
    throw new Error('Cliente não encontrado');
  }

  module.exports.clientes[index] = { ...module.exports.clientes[index], ...dadosAtualizados };
  return module.exports.clientes[index];
}

function removerCliente(id) {
  const index = module.exports.clientes.findIndex(cliente => cliente.id === id);

  if (index === -1) {
    throw new Error('Cliente não encontrado');
  }
  module.exports.clientes.splice(index, 1);
  
  return { message: 'Cliente removido com sucesso' };
}

function buscarClientePorEmail(email) {
  return module.exports.clientes.find(cliente => cliente.email === email);
}

function formatarTelefone(telefone) {
  const numeros = telefone.replace(/\D/g, '');
  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }
  return telefone;
}

module.exports = {
  listarClientes,
  buscarClientePorId,
  validarEmail,
  adicionarCliente,
  atualizarCliente,
  removerCliente,
  buscarClientePorEmail,
  formatarTelefone,
  clientes
};
