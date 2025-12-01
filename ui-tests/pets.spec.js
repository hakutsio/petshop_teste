const { test, expect } = require('@playwright/test');

const PAGE_URL = 'http://localhost:3000/pets.html'; 

const TEST_PET_NAME_BASE = 'Satanas '; 
const TEST_PET_NAME_T9 = TEST_PET_NAME_BASE + 'juca ' + Date.now();
const TEST_PET_NAME_T10 = TEST_PET_NAME_BASE + 'mario ' + Date.now();
const TEST_PET_RACE = 'Bulldog';
const TEST_CLIENT_ID = '1'; 

test.beforeEach(async ({ page }) => {
    page.on('dialog', async dialog => {
        console.log(`Dialogo encontrado com a mensagem: ${dialog.message()}`);
        await dialog.accept(); 
    });
});

test.describe('Testes de Gerenciamento de Pets', () => {
    
    test('T16: Deve inserir um novo pet e verificar seu carregamento, seguido pela exclusão com confirmação', async ({ page }) => {
        await page.goto(PAGE_URL);
        await page.locator('#nome').fill(TEST_PET_NAME_T9);
        await page.locator('#especie').fill('Cachorro');
        await page.locator('#raca').fill(TEST_PET_RACE);
        await page.locator('#idade').fill('3');
        await page.locator('#cliente_id').fill(TEST_CLIENT_ID);
        
        await page.locator('#petForm button[type="submit"]:has-text("Salvar")').click();
        
        const newPetRow = page.locator(`#petsTable tbody tr:has-text("${TEST_PET_NAME_T9}")`);
        
        await expect(newPetRow).toBeVisible({ timeout: 10000 }); 
        await expect(newPetRow.locator('td:has-text("Cachorro")')).toBeVisible();

        const deleteButton = newPetRow.locator(`button:has-text("Excluir")`);
        await deleteButton.click();
        
        await expect(newPetRow).not.toBeVisible({ timeout: 5000 });        
    });

    test('T17: Deve verificar o título da página e a presença do botão Salvar no formulário', async ({ page }) => {
        
        await page.goto(PAGE_URL);
        await expect(page.locator('h1')).toHaveText('Gerenciar Pets');
        await expect(page.locator('form#petForm button[type="submit"]:has-text("Salvar")')).toBeVisible();
    });

    test('T18: Deve verificar se o cabeçalho da tabela de pets e o campo de busca estão visíveis', async ({ page }) => {
        
        await page.goto(PAGE_URL);

        const tableHeader = page.locator('#petsTable thead');
        
        await expect(tableHeader.locator('th:has-text("Nome")')).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Ações', exact: true })).toBeVisible();
        await expect(page.locator('#searchInput')).toBeVisible();
    });
});