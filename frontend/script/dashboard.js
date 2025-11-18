 async function carregarClientes() {
    try {
      const res = await fetch("http://localhost:3000/api/clientes"); // Muda para tua API
      const dados = await res.json();

      // Preenche card
      document.getElementById("totalClientes").textContent = dados.length;

      // Preenche tabela
      const tbody = document.getElementById("tabelaClientes");
      tbody.innerHTML = "";

      dados.forEach(cliente => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${cliente.id}</td>
          <td>${cliente.nome}</td>
          <td>${cliente.email}</td>
          <td>${cliente.telefone}</td>
        `;
        tbody.appendChild(tr);
      });

    } catch (e) {
      console.error("Erro buscando clientes", e);
      document.getElementById("tabelaClientes").innerHTML = `
        <tr><td colspan="4" style="color:red;">Erro ao carregar dados.</td></tr>
      `;
    }
  }

  carregarClientes();