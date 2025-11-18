 let apiBase = '/api/agendamentos';
    const usingLiveServer = (location.hostname === '127.0.0.1' || location.hostname === 'localhost') && location.port === '5500';
    if (usingLiveServer) {
      apiBase = 'http://localhost:3000/api/agendamentos';
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

    async function loadAgendamentos() {
      const res = await fetch(apiBase);
      const data = await parseJSONSafe(res);
      const tbody = document.querySelector('#agendamentosTable tbody');
      tbody.innerHTML = '';
      (data || []).forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${a.id}</td>
          <td>${a.data || ''}</td>
          <td>${a.hora || ''}</td>
          <td>${a.servico || ''}</td>
          <td>${a.cliente_id || ''}</td>
          <td>${a.pet_id || ''}</td>
          <td>${a.observacoes || ''}</td>
          <td>
            <button data-id="${a.id}" class="editBtn">Editar</button>
            <button data-id="${a.id}" class="delBtn">Excluir</button>
          </td>`;
        tbody.appendChild(tr);
      });
    }

    async function searchAgendamentos(q) {
      const res = await fetch(apiBase + '?q=' + encodeURIComponent(q));
      const data = await parseJSONSafe(res);
      const tbody = document.querySelector('#agendamentosTable tbody');
      tbody.innerHTML = '';
      (data || []).forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${a.id}</td>
          <td>${a.data || ''}</td>
          <td>${a.hora || ''}</td>
          <td>${a.servico || ''}</td>
          <td>${a.cliente_id || ''}</td>
          <td>${a.pet_id || ''}</td>
          <td>${a.observacoes || ''}</td>
          <td>
            <button data-id="${a.id}" class="editBtn">Editar</button>
            <button data-id="${a.id}" class="delBtn">Excluir</button>
          </td>`;
        tbody.appendChild(tr);
      });
    }

    async function saveAgendamento(event) {
      event.preventDefault();
      const id = document.getElementById('agendamentoId').value;
      const data = document.getElementById('data').value;
      const hora = document.getElementById('hora').value;
      const servico = document.getElementById('servico').value.trim();
      const cliente_id = document.getElementById('cliente_id').value.trim();
      const pet_id = document.getElementById('pet_id').value.trim();
      const observacoes = document.getElementById('observacoes').value.trim();
      const payload = { data, hora, servico, cliente_id: cliente_id ? Number(cliente_id) : null, pet_id: pet_id ? Number(pet_id) : null, observacoes };
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
        if (!res.ok) throw new Error((data && data.error) || ('Erro ao salvar agendamento (status ' + res.status + ')'));
        clearForm();
        loadAgendamentos();
      } catch (err) {
        alert('Erro: ' + (err.message || err));
        log('saveAgendamento error: ' + (err.message || err));
      }
    }

    function clearForm() {
      document.getElementById('agendamentoId').value = '';
      document.getElementById('data').value = '';
      document.getElementById('hora').value = '';
      document.getElementById('servico').value = '';
      document.getElementById('cliente_id').value = '';
      document.getElementById('pet_id').value = '';
      document.getElementById('observacoes').value = '';
    }

    async function editAgendamento(id) {
      const res = await fetch(apiBase + '/' + id);
      if (!res.ok) { alert('Agendamento não encontrado'); return; }
      const a = await parseJSONSafe(res);
      document.getElementById('agendamentoId').value = a.id;
      document.getElementById('data').value = a.data || '';
      document.getElementById('hora').value = a.hora || '';
      document.getElementById('servico').value = a.servico || '';
      document.getElementById('cliente_id').value = a.cliente_id || '';
      document.getElementById('pet_id').value = a.pet_id || '';
      document.getElementById('observacoes').value = a.observacoes || '';
      window.scrollTo(0,0);
    }

    async function deleteAgendamento(id) {
      if (!confirm('Confirma exclusão do agendamento ID ' + id + '?')) return;
      const res = await fetch(apiBase + '/' + id, { method: 'DELETE' });
      const data = await parseJSONSafe(res);
      if (!res.ok) { alert('Erro: ' + ((data && data.error) || 'Erro ao excluir')); return; }
      loadAgendamentos();
    }

    document.addEventListener('click', (e) => {
      if (e.target.matches('.editBtn')) {
        editAgendamento(e.target.dataset.id);
      }
      if (e.target.matches('.delBtn')) {
        deleteAgendamento(e.target.dataset.id);
      }
    });

    document.getElementById('agendamentoForm').addEventListener('submit', saveAgendamento);
    document.getElementById('clearBtn').addEventListener('click', clearForm);
    document.getElementById('searchBtn').addEventListener('click', () => searchAgendamentos(document.getElementById('searchInput').value.trim()));
    document.getElementById('refreshBtn').addEventListener('click', loadAgendamentos);

    loadAgendamentos();