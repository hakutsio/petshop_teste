const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000/agendamentos.html'; 

const TEST_DATE = '2026-10-25'; 
const TEST_TIME_INSERT = '14:00';
const TEST_SERVICE_INSERT = 'Tosa ' + Date.now(); 
const TEST_SERVICE_UPDATE = 'Vacina ' + Date.now(); 
const TEST_OBS = 'Observacao ' + Date.now();

test.beforeEach(async ({ page }) => {
    page.on('dialog', async dialog => {
        await dialog.accept(); 
    });
});

test.describe('Testes de Presença de Elementos na página Agendamentos', () => {

    test('T1: Deve verificar o título da página e navegação ativa', async ({ page }) => {
        await page.goto(BASE_URL);
        await expect(page.locator('h1')).toHaveText('Gerenciar Agendamentos');
        
        const navLink = page.locator('nav a:has-text("Agendamentos")');
        await expect(navLink).toHaveClass(/active/);
    });

    test('T2: Deve verificar a presença dos campos de Data e Serviço', async ({ page }) => {
        await page.goto(BASE_URL);
        await expect(page.locator('#data')).toBeVisible();
        await expect(page.locator('#hora')).toBeVisible();
        await expect(page.locator('#servico')).toBeVisible();
        await expect(page.locator('#cliente_id')).toBeVisible();
        await expect(page.locator('#pet_id')).toBeVisible();
        await expect(page.locator('#observacoes')).toBeVisible();

        await expect(page.locator('form#agendamentoForm button[type="submit"]')).toBeVisible();
    });

    test('T3: Deve verificar a seção de busca e cabeçalho da tabela', async ({ page }) => {
        await page.goto(BASE_URL);

        const searchInput = page.locator('#searchInput');
        await expect(searchInput).toHaveAttribute('placeholder', 'Buscar por serviço ou observações');
        await expect(page.locator('#searchBtn')).toHaveText('Buscar');
        await expect(page.locator('#refreshBtn')).toHaveText('Atualizar lista');
        
        const tableHeader = page.locator('#agendamentosTable thead');
        await expect(tableHeader.locator('th:has-text("ID Cliente")')).toBeVisible();
        await expect(tableHeader.locator('th:has-text("ID Pet")')).toBeVisible();
        await expect(tableHeader.locator('th:has-text("Serviço")')).toBeVisible();
        
        await expect(page.getByRole('columnheader', { name: 'Ações', exact: true })).toBeVisible();
    });
});

test.describe('Testes de Carregamento de Dados', () => {

    test('T4: Deve carregar dados na tabela de agendamentos', async ({ page }) => {
        await page.goto(BASE_URL);

        const firstRow = page.locator('#agendamentosTable tbody tr:nth-child(1)');

        await expect(firstRow).toBeVisible();
        
        const firstCellText = await firstRow.locator('td:nth-child(1)').innerText();
        await expect(firstCellText.length).toBeGreaterThan(0);
    });
    
    test('T5: Deve exibir botões de Ações na linha de agendamento', async ({ page }) => {
        await page.goto(BASE_URL);

        const firstRow = page.locator('#agendamentosTable tbody tr:nth-child(1)');
        await expect(firstRow).toBeVisible();

        const editButton = firstRow.locator('td button:has-text("Editar")');
        await expect(editButton).toBeVisible();
        
        const deleteButton = firstRow.locator('td button:has-text("Excluir")');
        await expect(deleteButton).toBeVisible();
    });
});

test.describe('Testes de Inserção, Alteração e Exclusão (CRUD)', () => {
    
    test('T6: - Deve Inserir um Agendamento, Alterar o Serviço e Excluir no final', async ({ page }) => {
        await page.goto(BASE_URL);

        await page.locator('#data').fill(TEST_DATE);
        await page.locator('#hora').fill(TEST_TIME_INSERT);
        await page.locator('#servico').fill(TEST_SERVICE_INSERT);
        await page.locator('#cliente_id').fill('1'); 
        await page.locator('#pet_id').fill('1'); 
        await page.locator('#observacoes').fill('Agendamento para Inserir-Alterar-Excluir');
        
        await page.locator('#agendamentoForm button[type="submit"]:has-text("Salvar")').click();

        const insertedRow = page.locator(`#agendamentosTable tbody tr:has-text("${TEST_SERVICE_INSERT}")`);
        await expect(insertedRow).toBeVisible({ timeout: 10000 }); 

        await insertedRow.locator('button:has-text("Editar")').click();
        
        await page.locator('#servico').fill(TEST_SERVICE_UPDATE);
        await page.locator('#observacoes').fill('Serviço Alterado com Sucesso!');

        await page.locator('#agendamentoForm button[type="submit"]:has-text("Salvar")').click();
        
        const updatedRow = page.locator(`#agendamentosTable tbody tr:has-text("${TEST_SERVICE_UPDATE}")`);
        await expect(updatedRow).toBeVisible({ timeout: 10000 });
        await expect(updatedRow.locator('td:has-text("Serviço Alterado com Sucesso!")')).toBeVisible();
        
        await updatedRow.locator('button:has-text("Excluir")').click();
        
        await expect(updatedRow).not.toBeVisible({ timeout: 5000 });
    });


    test('T7: - Deve Inserir um Agendamento e verificar o sucesso antes de excluir', async ({ page }) => {
        await page.goto(BASE_URL);

        await page.locator('#data').fill('2026-11-20');
        await page.locator('#hora').fill('09:30');
        await page.locator('#servico').fill(TEST_OBS);
        await page.locator('#cliente_id').fill('2'); 
        await page.locator('#pet_id').fill('2'); 
        await page.locator('#agendamentoForm button[type="submit"]:has-text("Salvar")').click();

        const newRow = page.locator(`#agendamentosTable tbody tr:has-text("${TEST_OBS}")`);
        await expect(newRow).toBeVisible({ timeout: 10000 }); 
        
        await expect(newRow.locator('td:nth-child(2)')).toHaveText('2026-11-20');
        await expect(newRow.locator('td:nth-child(3)')).toHaveText('09:30');
        
        await newRow.locator('button:has-text("Excluir")').click();
        
        await expect(newRow).not.toBeVisible({ timeout: 5000 });
    });
});

test.describe('Testes de Funcionalidade de Busca', () => {

    const TEST_SEARCH_SERVICE = 'Consulta ' + Date.now();

    test('T8: - Deve Inserir, Buscar e depois Excluir o registro', async ({ page }) => {
        await page.goto(BASE_URL);

        await page.locator('#data').fill('2026-12-01');
        await page.locator('#hora').fill('10:00');
        await page.locator('#servico').fill(TEST_SEARCH_SERVICE);
        await page.locator('#cliente_id').fill('3'); 
        await page.locator('#pet_id').fill('3'); 
        await page.locator('#agendamentoForm button[type="submit"]:has-text("Salvar")').click();

        let targetRow = page.locator(`#agendamentosTable tbody tr:has-text("${TEST_SEARCH_SERVICE}")`);
        await expect(targetRow).toBeVisible({ timeout: 10000 }); 

        await page.locator('#searchInput').fill(TEST_SEARCH_SERVICE);
        await page.locator('#searchBtn').click();

        await expect(page.locator(`#agendamentosTable tbody tr`)).toHaveCount(1);
        await expect(targetRow).toBeVisible();
        
        await page.locator('#refreshBtn').click();

        await targetRow.locator('button:has-text("Excluir")').click();
        
        await expect(targetRow).not.toBeVisible({ timeout: 5000 });
    });
});