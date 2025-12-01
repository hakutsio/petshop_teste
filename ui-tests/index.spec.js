const { test, expect } = require('@playwright/test');

const INDEX_URL = 'http://localhost:3000/index.html'; 
const AGENDAMENTOS_URL = 'http://localhost:3000/agendamentos.html';
const CLIENTES_URL = 'http://localhost:3000/clientes.html';
const PETS_URL = 'http://localhost:3000/pets.html';
const DASHBOARD_URL = 'http://localhost:3000/dashboard.html';

test.describe('Testes da Página Inicial (Index)', () => {

    test('T14: Deve verificar o título principal, subtítulo e a presença dos cartões de pets', async ({ page }) => {

        await page.goto(INDEX_URL);

        await expect(page.locator('h1:has-text("Pet Shop Pro")')).toBeVisible(); 
        
        await expect(page.locator('p:has-text("Seu sistema de gerenciamento de pet shop e agendamentos.")')).toBeVisible();

        await expect(page.locator('.card:has-text("Lulu da Pomerânia")')).toBeVisible();
        await expect(page.locator('.card:has-text("Pitbull")')).toBeVisible();
    });

    test('T15: Deve verificar se os links de navegação redirecionam para as páginas corretas', async ({ page }) => {
        
        await page.goto(INDEX_URL);

        await page.locator('nav a:has-text("Agendamentos")').click();
        await expect(page).toHaveURL(AGENDAMENTOS_URL); 

        await page.goto(INDEX_URL);

        await page.locator('nav a:has-text("Clientes")').click();
        await expect(page).toHaveURL(CLIENTES_URL); 
        
        await page.goto(INDEX_URL);

        await page.locator('nav a:has-text("Pets")').click();
        await expect(page).toHaveURL(PETS_URL); 
        
        await page.goto(INDEX_URL);

        await page.locator('nav a:has-text("Dashboard")').click();
        await expect(page).toHaveURL(DASHBOARD_URL); 
    });
});