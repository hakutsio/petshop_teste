    let apiBase = '/api/clientes';
    const usingLiveServer = (location.hostname === '127.0.0.1' || location.hostname === 'localhost') && location.port === '5500';
    if (usingLiveServer) {
      apiBase = 'http://localhost:3000/api/clientes';
    }

    async function parseJSONSafe(res) {
      const text = await res.text();
      if (!text) return null;
      try {
        return JSON.parse(text);
      } catch (e) {
        log('parseJSONSafe: resposta não é JSON: ' + text);
        return { error: text };
      }
    }

    function log(msg) {
      try {
        const pre = document.getElementById('log');
        pre.textContent += new Date().toISOString() + ' - ' + msg + '\n';
        pre.scrollTop = pre.scrollHeight;
      } catch (e) {
        console.log('log error', e);
      }
      console.log(msg);
    }

    async function loadClients() {
      const res = await fetch(apiBase);
      const data = await parseJSONSafe(res);
      const tbody = document.querySelector('#clientesTable tbody');
      tbody.innerHTML = '';
  (data || []).forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.id}</td>
          <td>${c.nome}</td>
          <td>${c.email}</td>
          <td>${c.telefone || ''}</td>
          <td>
            <button data-id="${c.id}" class="editBtn">Editar</button>
            <button data-id="${c.id}" class="delBtn">Excluir</button>
          </td>`;
        tbody.appendChild(tr);
      });
    }

    async function searchClients(q) {
      const res = await fetch(apiBase + '?q=' + encodeURIComponent(q));
      const data = await parseJSONSafe(res);
      const tbody = document.querySelector('#clientesTable tbody');
      tbody.innerHTML = '';
  (data || []).forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.id}</td>
          <td>${c.nome}</td>
          <td>${c.email}</td>
          <td>${c.telefone || ''}</td>
          <td>
            <button data-id="${c.id}" class="editBtn">Editar</button>
            <button data-id="${c.id}" class="delBtn">Excluir</button>
          </td>`;
        tbody.appendChild(tr);
      });
    }

    async function saveClient(event) {
      event.preventDefault();
      const id = document.getElementById('clienteId').value;
      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const telefone = document.getElementById('telefone').value.trim();
      const payload = { nome, email, telefone };
      try {
        let url = id ? (apiBase + '/' + id) : apiBase;
        log('enviando ' + (id ? 'PUT' : 'POST') + ' para ' + url + ' payload: ' + JSON.stringify(payload));
        let res;
        if (id) {
          res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        } else {
          res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        }
        log('response status: ' + res.status + ' ' + res.statusText + ' from ' + res.url);
        try { log('response Allow header: ' + (res.headers.get('Allow') || 'none')); } catch(e){}
        const data = await parseJSONSafe(res);
        log('response body: ' + JSON.stringify(data));
        if (!res.ok) throw new Error((data && data.error) || ('Erro ao salvar cliente (status ' + res.status + ')'));
        clearForm();
        loadClients();
      } catch (err) {
        alert('Erro: ' + (err.message || err));
        log('saveClient error: ' + (err.message || err));
      }
    }

    function clearForm() {
      document.getElementById('clienteId').value = '';
      document.getElementById('nome').value = '';
      document.getElementById('email').value = '';
      document.getElementById('telefone').value = '';
    }

    async function editClient(id) {
      const res = await fetch(apiBase + '/' + id);
      if (!res.ok) { alert('Cliente não encontrado'); return; }
      const c = await parseJSONSafe(res);
      document.getElementById('clienteId').value = c.id;
      document.getElementById('nome').value = c.nome;
      document.getElementById('email').value = c.email;
      document.getElementById('telefone').value = c.telefone || '';
      window.scrollTo(0,0);
    }

    async function deleteClient(id) {
      if (!confirm('Confirma exclusão do cliente ID ' + id + '?')) return;
      const res = await fetch(apiBase + '/' + id, { method: 'DELETE' });
      const data = await parseJSONSafe(res);
      if (!res.ok) { alert('Erro: ' + ((data && data.error) || 'Erro ao excluir')); return; }
      loadClients();
    }

    document.addEventListener('click', (e) => {
      if (e.target.matches('.editBtn')) {
        editClient(e.target.dataset.id);
      }
      if (e.target.matches('.delBtn')) {
        deleteClient(e.target.dataset.id);
      }
    });

    document.getElementById('clienteForm').addEventListener('submit', saveClient);
    document.getElementById('clearBtn').addEventListener('click', clearForm);
    document.getElementById('searchBtn').addEventListener('click', () => searchClients(document.getElementById('searchInput').value.trim()));
    document.getElementById('refreshBtn').addEventListener('click', loadClients);

    loadClients();