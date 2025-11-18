    let apiBase = '/api/pets';
    const usingLiveServer = (location.hostname === '127.0.0.1' || location.hostname === 'localhost') && location.port === '5500';
    if (usingLiveServer) {
      apiBase = 'http://localhost:3000/api/pets';
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

    async function loadPets() {
      const res = await fetch(apiBase);
      const data = await parseJSONSafe(res);
      const tbody = document.querySelector('#petsTable tbody');
      tbody.innerHTML = '';
      (data || []).forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.id}</td>
          <td>${p.nome}</td>
          <td>${p.especie || ''}</td>
          <td>${p.raca || ''}</td>
          <td>${p.idade || ''}</td>
          <td>${p.cliente_id || ''}</td>
          <td>
            <button data-id="${p.id}" class="editBtn">Editar</button>
            <button data-id="${p.id}" class="delBtn">Excluir</button>
          </td>`;
        tbody.appendChild(tr);
      });
    }

    async function searchPets(q) {
      const res = await fetch(apiBase + '?q=' + encodeURIComponent(q));
      const data = await parseJSONSafe(res);
      const tbody = document.querySelector('#petsTable tbody');
      tbody.innerHTML = '';
      (data || []).forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.id}</td>
          <td>${p.nome}</td>
          <td>${p.especie || ''}</td>
          <td>${p.raca || ''}</td>
          <td>${p.idade || ''}</td>
          <td>${p.cliente_id || ''}</td>
          <td>
            <button data-id="${p.id}" class="editBtn">Editar</button>
            <button data-id="${p.id}" class="delBtn">Excluir</button>
          </td>`;
        tbody.appendChild(tr);
      });
    }

    async function savePet(event) {
      event.preventDefault();
      const id = document.getElementById('petId').value;
      const nome = document.getElementById('nome').value.trim();
      const especie = document.getElementById('especie').value.trim();
      const raca = document.getElementById('raca').value.trim();
      const idade = document.getElementById('idade').value.trim();
      const cliente_id = document.getElementById('cliente_id').value.trim();
      const payload = { nome, especie, raca, idade: idade ? Number(idade) : null, cliente_id: cliente_id ? Number(cliente_id) : null };
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
        if (!res.ok) throw new Error((data && data.error) || ('Erro ao salvar pet (status ' + res.status + ')'));
        clearForm();
        loadPets();
      } catch (err) {
        alert('Erro: ' + (err.message || err));
        log('savePet error: ' + (err.message || err));
      }
    }

    function clearForm() {
      document.getElementById('petId').value = '';
      document.getElementById('nome').value = '';
      document.getElementById('especie').value = '';
      document.getElementById('raca').value = '';
      document.getElementById('idade').value = '';
      document.getElementById('cliente_id').value = '';
    }

    async function editPet(id) {
      const res = await fetch(apiBase + '/' + id);
      if (!res.ok) { alert('Pet não encontrado'); return; }
      const p = await parseJSONSafe(res);
      document.getElementById('petId').value = p.id;
      document.getElementById('nome').value = p.nome;
      document.getElementById('especie').value = p.especie || '';
      document.getElementById('raca').value = p.raca || '';
      document.getElementById('idade').value = p.idade || '';
      document.getElementById('cliente_id').value = p.cliente_id || '';
      window.scrollTo(0,0);
    }

    async function deletePet(id) {
      if (!confirm('Confirma exclusão do pet ID ' + id + '?')) return;
      const res = await fetch(apiBase + '/' + id, { method: 'DELETE' });
      const data = await parseJSONSafe(res);
      if (!res.ok) { alert('Erro: ' + ((data && data.error) || 'Erro ao excluir')); return; }
      loadPets();
    }

    document.addEventListener('click', (e) => {
      if (e.target.matches('.editBtn')) {
        editPet(e.target.dataset.id);
      }
      if (e.target.matches('.delBtn')) {
        deletePet(e.target.dataset.id);
      }
    });

    document.getElementById('petForm').addEventListener('submit', savePet);
    document.getElementById('clearBtn').addEventListener('click', clearForm);
    document.getElementById('searchBtn').addEventListener('click', () => searchPets(document.getElementById('searchInput').value.trim()));
    document.getElementById('refreshBtn').addEventListener('click', loadPets);

    loadPets();