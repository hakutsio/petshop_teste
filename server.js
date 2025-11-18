
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    especie TEXT,
    raca TEXT,
    idade INTEGER,
    cliente_id INTEGER,
    FOREIGN KEY(cliente_id) REFERENCES clientes(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    hora TEXT NOT NULL,
    servico TEXT NOT NULL,
    cliente_id INTEGER,
    pet_id INTEGER,
    observacoes TEXT,
    FOREIGN KEY(cliente_id) REFERENCES clientes(id),
    FOREIGN KEY(pet_id) REFERENCES pets(id)
  )`);
});

app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'frontend')));

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}


app.use('/', express.static(path.join(__dirname, 'frontend')));

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

app.get('/api/pets', async (req, res) => {
    app.use(express.json());
  try {
    const q = req.query.q;
    if (q) {
      const rows = await all('SELECT * FROM pets WHERE nome LIKE ? OR especie LIKE ? OR raca LIKE ?', [`%${q}%`, `%${q}%`, `%${q}%`]);
      return res.json(rows);
    }
    const rows = await all('SELECT * FROM pets');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar pets' });
  }
});

app.get('/api/pets/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await get('SELECT * FROM pets WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Pet não encontrado' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pet' });
  }
});

app.post('/api/pets', async (req, res) => {
  try {
    const { nome, especie, raca, idade, cliente_id } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome do pet é obrigatório' });
    const result = await run('INSERT INTO pets (nome, especie, raca, idade, cliente_id) VALUES (?, ?, ?, ?, ?)', [nome, especie || null, raca || null, idade || null, cliente_id || null]);
    const created = await get('SELECT * FROM pets WHERE id = ?', [result.id]);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pet' });
  }
});

app.put('/api/pets/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, especie, raca, idade, cliente_id } = req.body;
    const exist = await get('SELECT * FROM pets WHERE id = ?', [id]);
    if (!exist) return res.status(404).json({ error: 'Pet não encontrado' });
    await run('UPDATE pets SET nome = ?, especie = ?, raca = ?, idade = ?, cliente_id = ? WHERE id = ?', [nome || exist.nome, especie || exist.especie, raca || exist.raca, idade || exist.idade, cliente_id || exist.cliente_id, id]);
    const updated = await get('SELECT * FROM pets WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar pet' });
  }
});

app.delete('/api/pets/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const exist = await get('SELECT * FROM pets WHERE id = ?', [id]);
    if (!exist) return res.status(404).json({ error: 'Pet não encontrado' });
    await run('DELETE FROM pets WHERE id = ?', [id]);
    res.json({ message: 'Pet removido com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover pet' });
  }
});

app.get('/api/agendamentos', async (req, res) => {
  try {
    const q = req.query.q;
    if (q) {
      const rows = await all('SELECT * FROM agendamentos WHERE servico LIKE ? OR observacoes LIKE ?', [`%${q}%`, `%${q}%`]);
      return res.json(rows);
    }
    const rows = await all('SELECT * FROM agendamentos');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar agendamentos' });
  }
});

app.get('/api/agendamentos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await get('SELECT * FROM agendamentos WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar agendamento' });
  }
});

app.post('/api/agendamentos', async (req, res) => {
  try {
    const { data, hora, servico, cliente_id, pet_id, observacoes } = req.body;
    if (!data || !hora || !servico) return res.status(400).json({ error: 'Data, hora e serviço são obrigatórios' });
    const result = await run('INSERT INTO agendamentos (data, hora, servico, cliente_id, pet_id, observacoes) VALUES (?, ?, ?, ?, ?, ?)', [data, hora, servico, cliente_id || null, pet_id || null, observacoes || null]);
    const created = await get('SELECT * FROM agendamentos WHERE id = ?', [result.id]);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

app.put('/api/agendamentos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { data, hora, servico, cliente_id, pet_id, observacoes } = req.body;
    const exist = await get('SELECT * FROM agendamentos WHERE id = ?', [id]);
    if (!exist) return res.status(404).json({ error: 'Agendamento não encontrado' });
    await run('UPDATE agendamentos SET data = ?, hora = ?, servico = ?, cliente_id = ?, pet_id = ?, observacoes = ? WHERE id = ?', [data || exist.data, hora || exist.hora, servico || exist.servico, cliente_id || exist.cliente_id, pet_id || exist.pet_id, observacoes || exist.observacoes, id]);
    const updated = await get('SELECT * FROM agendamentos WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
});

app.delete('/api/agendamentos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const exist = await get('SELECT * FROM agendamentos WHERE id = ?', [id]);
    if (!exist) return res.status(404).json({ error: 'Agendamento não encontrado' });
    await run('DELETE FROM agendamentos WHERE id = ?', [id]);
    res.json({ message: 'Agendamento removido com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover agendamento' });
  }
});

app.get('/api/clientes', async (req, res) => {
  try {
    const q = req.query.q;
    const email = req.query.email;
    if (email) {
      const row = await get('SELECT * FROM clientes WHERE email = ?', [email]);
      return res.json(row || null);
    }
    if (q) {
      const rows = await all('SELECT * FROM clientes WHERE nome LIKE ? OR email LIKE ?', [`%${q}%`, `%${q}%`]);
      return res.json(rows);
    }
    const rows = await all('SELECT * FROM clientes');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
});

app.get('/api/clientes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await get('SELECT * FROM clientes WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

app.post('/api/clientes', async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    if (!nome || !email) return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    if (!/^([^@\s]+)@([^@\s]+)\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    const result = await run('INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)', [nome, email, telefone || null]);
    const created = await get('SELECT * FROM clientes WHERE id = ?', [result.id]);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    if (err && err.message && err.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

app.put('/api/clientes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, email, telefone } = req.body;
    const exist = await get('SELECT * FROM clientes WHERE id = ?', [id]);
    if (!exist) return res.status(404).json({ error: 'Cliente não encontrado' });
    if (email && !/^([^@\s]+)@([^@\s]+)\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    await run('UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?', [nome || exist.nome, email || exist.email, telefone || exist.telefone, id]);
    const updated = await get('SELECT * FROM clientes WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error(err);
    if (err && err.message && err.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
});

app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const exist = await get('SELECT * FROM clientes WHERE id = ?', [id]);
    if (!exist) return res.status(404).json({ error: 'Cliente não encontrado' });
    await run('DELETE FROM clientes WHERE id = ?', [id]);
    res.json({ message: 'Cliente removido com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover cliente' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
