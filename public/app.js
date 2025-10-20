document.getElementById('load-products').addEventListener('click', async () => {
  const list = document.getElementById('products');
  list.innerHTML = 'Carregando...';
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Erro ao buscar produtos');
    const data = await res.json();
    list.innerHTML = '';
    if (data.length === 0) list.innerHTML = '<li>(Nenhum produto)</li>';
    data.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.id} - ${p.name} - R$ ${p.price} - estoque: ${p.stock}`;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = `<li>Erro: ${err.message}</li>`;
  }
});
