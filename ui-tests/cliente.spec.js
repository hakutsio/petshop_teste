const { test, expect } = require('@playwright/test');

const CLIENTES_URL = 'http://localhost:3000/clientes.html'; 
const INDEX_URL = 'http://localhost:3000/index.html';

const TEST_CLIENTE_NAME = 'xunda  ' + Date.now();
const TEST_CLIENTE_EMAIL = 'xundinha' + Date.now() + '@teste.com';
const TEST_CLIENTE_TELEFONE = '991234567';

test.beforeEach(async ({ page }) => {
    page.on('dialog', async dialog => {
        console.log(`Dialogo de confirmação encontrado: ${dialog.message()}`);
        await dialog.accept(); 
    });
});

test.describe('Testes de Gerenciamento de Clientes', () => {

    test('T9: Deve verificar o título, navegação, campos e cabeçalhos da tabela usando seletores robustos', async ({ page }) => {
        
        await page.goto(CLIENTES_URL);

        await expect(page.locator('h1:has-text("Gerenciar Clientes")')).toBeVisible(); 
        await expect(page.locator('nav a:has-text("Clientes")')).toHaveClass(/active/);
        
        await expect(page.locator('button:has-text("Voltar")')).toBeVisible();

        await expect(page.locator('h2:has-text("Buscar")')).toBeVisible(); 
        
        await expect(page.locator('input[placeholder="Buscar por nome ou email"]')).toBeVisible();

        await expect(page.locator('button:has-text("Buscar")')).toBeVisible();
        await expect(page.locator('button:has-text("Atualizar lista")')).toBeVisible();

        await expect(page.locator('h2:has-text("Formulario de busca")')).toBeVisible();

        await expect(page.locator('text=Nome').locator('..').locator('input')).toBeVisible(); 
        await expect(page.locator('text=Email').locator('..').locator('input')).toBeVisible(); 
        await expect(page.locator('text=Telefone').locator('..').locator('input')).toBeVisible(); 
        
        await expect(page.locator('form button:has-text("Salvar")')).toBeVisible();
        await expect(page.locator('form button:has-text("Limpar")')).toBeVisible();

        await expect(page.locator('h2:has-text("Lista de Clientes")')).toBeVisible();
        
        const tableHeader = page.locator('table thead');
        await expect(tableHeader.locator('th:has-text("ID")')).toBeVisible();
        await expect(tableHeader.locator('th:has-text("Nome")')).toBeVisible();
        await expect(tableHeader.locator('th:has-text("Email")')).toBeVisible();
        await expect(tableHeader.locator('th:has-text("Telefone")')).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Ações', exact: true })).toBeVisible();
    });

    test('T10: Deve inserir um novo cliente, verificar a sua presença na lista e depois excluí-lo', async ({ page }) => {
        
        await page.goto(CLIENTES_URL);

        await page.locator('form #nome').fill(TEST_CLIENTE_NAME);
        await page.locator('form #email').fill(TEST_CLIENTE_EMAIL);
        await page.locator('form #telefone').fill(TEST_CLIENTE_TELEFONE);
        
        await page.locator('form button[type="submit"]:has-text("Salvar")').click();
        
        const newClientRow = page.locator(`table tbody tr:has-text("${TEST_CLIENTE_NAME}"):has-text("${TEST_CLIENTE_EMAIL}")`);
        
        await expect(newClientRow).toBeVisible({ timeout: 10000 }); 
        await expect(newClientRow.locator(`td:has-text("${TEST_CLIENTE_TELEFONE}")`)).toBeVisible();

        const deleteButton = newClientRow.locator(`button:has-text("Excluir")`);
        await deleteButton.click();
        
        await expect(newClientRow).not.toBeVisible({ timeout: 5000 });        
    });

    test('T11: Deve verificar se o botão "Voltar" redireciona para a página inicial (index.html)', async ({ page }) => {
        
        await page.goto(CLIENTES_URL);

        const voltarButton = page.locator('button:has-text("Voltar")');
        await expect(voltarButton).toBeVisible();
        await voltarButton.click();
        
        await expect(page).toHaveURL(INDEX_URL);
        
    });
});