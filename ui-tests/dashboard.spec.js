const { test, expect } = require('@playwright/test');

const DASHBOARD_URL = 'http://localhost:3000/dashboard.html'; 
const CLIENTES_URL = 'http://localhost:3000/clientes.html';

const TEST_CLIENTE_NAME = 'Cliente tiao gaviao Dashboard ' + Date.now();
const TEST_CLIENTE_EMAIL = 'tiaozinho' + Date.now() + '@teste.com';
const TEST_CLIENTE_TELEFONE = '998877665';

let initialClientCount = 3;

test.beforeEach(async ({ page }) => {
    page.on('dialog', async dialog => {
        console.log(`Dialogo encontrado com a mensagem: ${dialog.message()}`);
        await dialog.accept(); 
    });
});

test.describe.configure({ mode: 'serial' });

test.describe('Fluxo de Clientes e Dashboard (CRUD Verification)', () => {

    test('T12: Deve obter a contagem inicial de clientes no Dashboard para referência', async ({ page }) => {
        
        await page.goto(DASHBOARD_URL);

        const totalClientsLocator = page.locator('#totalClientes');
        
        await expect(totalClientsLocator).toBeVisible({ timeout: 40000 }); 
        
        const countText = await totalClientsLocator.innerText();
        initialClientCount = parseInt(countText.replace(/\D/g, '').trim(), 10);
        
        await expect(initialClientCount).toBeGreaterThanOrEqual(0);
        
        console.log(`Contagem inicial de clientes: ${initialClientCount}`);
    });

    test('T13: Deve executar o fluxo completo de Adição e Exclusão, verificando o Dashboard', async ({ page }) => {
        
        await page.goto(CLIENTES_URL);

        await page.locator('form #nome').fill(TEST_CLIENTE_NAME);
        await page.locator('form #email').fill(TEST_CLIENTE_EMAIL);
        await page.locator('form #telefone').fill(TEST_CLIENTE_TELEFONE);
        
        const submitPromise = page.locator('form button[type="submit"]:has-text("Salvar")').click();
        await Promise.all([
            submitPromise,
            page.waitForLoadState('networkidle') 
        ]);
        
        const newClientRow = page.locator(`table tbody tr:has-text("${TEST_CLIENTE_NAME}")`);
        await expect(newClientRow).toBeVisible({ timeout: 45000 }); 
        
        await expect(page.locator('form #nome')).toHaveValue('');
        
        console.log(`-> Cliente '${TEST_CLIENTE_NAME}' adicionado com sucesso.`);

        await page.goto(DASHBOARD_URL);

        const totalClientsLocator = page.locator('#totalClientes');
        const expectedCount = initialClientCount + 1;

        await expect(totalClientsLocator).toHaveText(String(expectedCount), { timeout: 30000 }); 
        
        const newClientRowDashboard = page.locator(`#tabelaClientes tr:has-text("${TEST_CLIENTE_NAME}"):has-text("${TEST_CLIENTE_EMAIL}")`);
        await expect(newClientRowDashboard).toBeVisible({ timeout: 45000 }); 
        
        console.log(`-> Dashboard verificado: Contagem ${expectedCount} e cliente visível.`);

        await page.goto(CLIENTES_URL);

        const clientRowToDelete = page.locator(`table tbody tr:has-text("${TEST_CLIENTE_NAME}")`);
        await expect(clientRowToDelete).toBeVisible({ timeout: 45000 }); 

        const deleteButton = clientRowToDelete.locator(`button:has-text("Excluir")`);
        const deleteClickPromise = deleteButton.click();
        
        await Promise.all([
            deleteClickPromise,
            page.waitForLoadState('networkidle') 
        ]);
        
        await expect(clientRowToDelete).not.toBeVisible({ timeout: 45000 }); 
        
        console.log(`-> Cliente '${TEST_CLIENTE_NAME}' excluído com sucesso.`);

        await page.goto(DASHBOARD_URL);

        await expect(totalClientsLocator).toHaveText(String(initialClientCount), { timeout: 30000 }); 
        
        const deletedClientRowDashboard = page.locator(`#tabelaClientes tr:has-text("${TEST_CLIENTE_NAME}")`);
        await expect(deletedClientRowDashboard).not.toBeVisible({ timeout: 45000 }); 
        
        console.log(`-> Dashboard verificado: Contagem restaurada ${initialClientCount} e cliente ausente.`);
    });
});