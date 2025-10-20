let pets = [
  { id: 1, nome: 'Rex', tipo: 'Cachorro', raca: 'Labrador', idade: 3 },
  { id: 2, nome: 'Mia', tipo: 'Gato', raca: 'Siamês', idade: 2 },
  { id: 3, nome: 'Bob', tipo: 'Cachorro', raca: 'Bulldog', idade: 5 }
];

function buscarTodosPets() {
  return module.exports.pets || [];
}

function buscarPetPorId(id) {
  return module.exports.pets.find(pet => pet.id === id);
}

function adicionarPet(novoPet) {
  if (!novoPet) {
    throw new Error('Nome e tipo são obrigatórios'); 
  }

  if (!novoPet.nome || !novoPet.tipo) {
    throw new Error('Nome e tipo são obrigatórios');
  }

  const id = module.exports.pets.length > 0 ? Math.max(...module.exports.pets.map(p => p.id)) + 1 : 1;
  const petComId = { id, ...novoPet };
  module.exports.pets.push(petComId);
  return petComId;
}

function atualizarPet(id, dadosAtualizados) {
  const index = module.exports.pets.findIndex(pet => pet.id === id);

  if (!dadosAtualizados) {
    throw new Error("Os dados para atualização não podem ser nulos ou indefinidos.");
  }

  if (index === -1) {
    throw new Error('Pet não encontrado');
  }
  module.exports.pets[index] = { ...module.exports.pets[index], ...dadosAtualizados };
  return module.exports.pets[index];
}

function removerPet(id) {
  const index = module.exports.pets.findIndex(pet => pet.id === id);
  if (index === -1) {
    throw new Error('Pet não encontrado');
  }
  module.exports.pets.splice(index, 1);
  return { message: 'Pet removido com sucesso' };
}

function filtrarPetsPorTipo(tipo) {
  return module.exports.pets.filter(pet => pet.tipo === tipo);
}

function calcularIdadeEmMeses(idadeAnos) {
  if (typeof idadeAnos !== 'number' || idadeAnos < 0) {
    throw new Error('Idade deve ser um número positivo');
  }
  return idadeAnos * 12;
}

function ehFilhote(idade) {
  return idade < 1;
}

module.exports = {
  buscarTodosPets,
  buscarPetPorId,
  adicionarPet,
  atualizarPet,
  removerPet,
  filtrarPetsPorTipo,
  calcularIdadeEmMeses,
  ehFilhote,
  pets
};