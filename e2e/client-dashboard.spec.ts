import { test, expect } from '@playwright/test';

test.describe('Client Dashboard Flow', () => {
  test('client login and dashboard navigation', async ({ page }) => {
    // Start from homepage
    await page.goto('/');

    // Check homepage loads correctly
    await expect(page.locator('h1')).toContainText('VPVET');
    await expect(page.locator('.inline-flex:has-text("Diagnóstico por Imagem Veterinária")')).toBeVisible();

    // Click on Consultar Resultados tab
    await page.click('text=Consultar Resultados');

    // Wait for the tab to be active and form to be visible
    await expect(page.locator('text=Consulta de Resultados de Exames')).toBeVisible();
    await expect(page.locator('input#cpf')).toBeVisible();
    await expect(page.locator('input#code')).toBeVisible();

    // Fill in client credentials
    await page.fill('input#cpf', '123.456.789-00');
    await page.fill('input#code', 'TEST123');

    // Click login button
    await page.click('button:has-text("Consultar Resultado")');

    // Wait for navigation to client dashboard
    await page.waitForURL('**/client-dashboard', { timeout: 10000 });

    // Verify client dashboard loaded
    await expect(page.locator('h1:has-text("Bem-vindo")')).toBeVisible();
    await expect(page.locator('text=Área do Tutor')).toBeVisible();

    // Check sidebar navigation is present
    await expect(page.locator('nav >> text=Início')).toBeVisible();
    await expect(page.locator('nav >> text=Meus Pets')).toBeVisible();
    await expect(page.locator('nav >> text=Consultas')).toBeVisible();
    await expect(page.locator('nav >> text=Exames')).toBeVisible();
    await expect(page.locator('nav >> text=Histórico')).toBeVisible();
    await expect(page.locator('nav >> text=Meus Dados')).toBeVisible();

    // Check dashboard stats
    await expect(page.locator('text=Total de Pets')).toBeVisible();
    await expect(page.locator('text=Consultas')).toBeVisible();
    await expect(page.locator('text=Exames')).toBeVisible();
    await expect(page.locator('text=Histórico')).toBeVisible();

    // Verify user info in sidebar
    await expect(page.locator('text=João Silva')).toBeVisible();
    await expect(page.locator('text=joao.silva@email.com')).toBeVisible();
  });

  test('navigate to Meus Pets page', async ({ page }) => {
    // Start from homepage and login
    await page.goto('/');
    await page.click('text=Consultar Resultados');
    await page.fill('input#cpf', '123.456.789-00');
    await page.fill('input#code', 'TEST123');
    await page.click('button:has-text("Consultar Resultado")');
    await page.waitForURL('**/client-dashboard');

    // Navigate to Meus Pets
    await page.click('nav >> text=Meus Pets');
    await page.waitForURL('**/client-dashboard/pets');

    // Verify Meus Pets page
    await expect(page.locator('h1:has-text("Meus Pets")')).toBeVisible();
    await expect(page.locator('text=Total de Pets')).toBeVisible();

    // Check for mock pets
    await expect(page.locator('text=Rex')).toBeVisible();
    await expect(page.locator('text=Luna')).toBeVisible();
    await expect(page.locator('text=Golden Retriever')).toBeVisible();
    await expect(page.locator('text=Siamese')).toBeVisible();

    // Verify pet cards have proper structure
    await expect(page.locator('text=Consultas')).first().toBeVisible();
    await expect(page.locator('text=Exames')).first().toBeVisible();
  });

  test('navigate to Exames page', async ({ page }) => {
    // Start from homepage and login
    await page.goto('/');
    await page.click('text=Consultar Resultados');
    await page.fill('input#cpf', '123.456.789-00');
    await page.fill('input#code', 'TEST123');
    await page.click('button:has-text("Consultar Resultado")');
    await page.waitForURL('**/client-dashboard');

    // Navigate to Exames
    await page.click('nav >> text=Exames');
    await page.waitForURL('**/client-dashboard/exames');

    // Verify Exames page
    await expect(page.locator('h1:has-text("Exames")')).toBeVisible();
    await expect(page.locator('text=1 de 1 exames')).toBeVisible();

    // Check for mock exam data
    await expect(page.locator('text=Rex')).toBeVisible();
    await expect(page.locator('text=Ultrassonografia Abdominal')).toBeVisible();
    await expect(page.locator('text=Dr. Saulo Vital Paz')).toBeVisible();

    // Check filter functionality
    await expect(page.locator('text=Filtrar Exames')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
  });

  test('navigate to Consultas page', async ({ page }) => {
    // Start from homepage and login
    await page.goto('/');
    await page.click('text=Consultar Resultados');
    await page.fill('input#cpf', '123.456.789-00');
    await page.fill('input#code', 'TEST123');
    await page.click('button:has-text("Consultar Resultado")');
    await page.waitForURL('**/client-dashboard');

    // Navigate to Consultas
    await page.click('nav >> text=Consultas');
    await page.waitForURL('**/client-dashboard/consultas');

    // Verify Consultas page
    await expect(page.locator('h1:has-text("Consultas")')).toBeVisible();
    await expect(page.locator('text=Próximas Consultas')).toBeVisible();
    await expect(page.locator('text=Consultas Realizadas')).toBeVisible();

    // Check stats display
    await expect(page.locator('text=Pets Atendidos')).toBeVisible();
  });

  test('navigate to Histórico page', async ({ page }) => {
    // Start from homepage and login
    await page.goto('/');
    await page.click('text=Consultar Resultados');
    await page.fill('input#cpf', '123.456.789-00');
    await page.fill('input#code', 'TEST123');
    await page.click('button:has-text("Consultar Resultado")');
    await page.waitForURL('**/client-dashboard');

    // Navigate to Histórico
    await page.click('nav >> text=Histórico');
    await page.waitForURL('**/client-dashboard/historico');

    // Verify Histórico page
    await expect(page.locator('h1:has-text("Histórico Médico")')).toBeVisible();
    await expect(page.locator('text=Adicionar Documento')).toBeVisible();

    // Check stats display
    await expect(page.locator('text=Total de Documentos')).toBeVisible();
    await expect(page.locator('text=Imagens')).toBeVisible();
    await expect(page.locator('text=PDFs')).toBeVisible();
    await expect(page.locator('text=Categorias')).toBeVisible();

    // Verify upload functionality is present
    await expect(page.locator('text=Nenhum documento no histórico')).toBeVisible();
  });

  test('navigate to Meus Dados page', async ({ page }) => {
    // Start from homepage and login
    await page.goto('/');
    await page.click('text=Consultar Resultados');
    await page.fill('input#cpf', '123.456.789-00');
    await page.fill('input#code', 'TEST123');
    await page.click('button:has-text("Consultar Resultado")');
    await page.waitForURL('**/client-dashboard');

    // Navigate to Meus Dados
    await page.click('nav >> text=Meus Dados');
    await page.waitForURL('**/client-dashboard/meus-dados');

    // Verify Meus Dados page
    await expect(page.locator('h1:has-text("Meus Dados")')).toBeVisible();
    await expect(page.locator('text=João Silva')).toBeVisible();
    await expect(page.locator('text=Tutor de 2 pets')).toBeVisible();

    // Check personal information section
    await expect(page.locator('text=Informações Pessoais')).toBeVisible();
    await expect(page.locator('text=Nome Completo')).toBeVisible();
    await expect(page.locator('text=CPF')).toBeVisible();
    await expect(page.locator('text=E-mail')).toBeVisible();
    await expect(page.locator('text=Telefone')).toBeVisible();

    // Check security settings
    await expect(page.locator('text=Segurança')).toBeVisible();
    await expect(page.locator('text=Alterar Senha')).toBeVisible();
  });

  test('client logout functionality', async ({ page }) => {
    // Start from homepage and login
    await page.goto('/');
    await page.click('text=Consultar Resultados');
    await page.fill('input#cpf', '123.456.789-00');
    await page.fill('input#code', 'TEST123');
    await page.click('button:has-text("Consultar Resultado")');
    await page.waitForURL('**/client-dashboard');

    // Verify we're logged in
    await expect(page.locator('text=João Silva')).toBeVisible();

    // Click logout button
    await page.click('button:has-text("Sair")');

    // Should redirect to homepage
    await page.waitForURL('**/');
    await expect(page.locator('h1')).toContainText('VPVET');
    await expect(page.locator('text=Clínicas Parceiras')).toBeVisible();
    await expect(page.locator('text=Consultar Resultados')).toBeVisible();

    // Try to access client dashboard directly
    await page.goto('/client-dashboard');

    // Should redirect back to homepage (not authenticated)
    await page.waitForURL('**/');
    await expect(page.locator('text=Clínicas Parceiras')).toBeVisible();
  });

  test('mobile responsive navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Start from homepage and login
    await page.goto('/');
    await page.click('text=Consultar Resultados');
    await page.fill('input#cpf', '123.456.789-00');
    await page.fill('input#code', 'TEST123');
    await page.click('button:has-text("Consultar Resultado")');
    await page.waitForURL('**/client-dashboard');

    // On mobile, sidebar should be hidden by default
    await expect(page.locator('.fixed.inset-y-0.left-0')).not.toBeVisible();

    // Click hamburger menu to open sidebar
    await page.click('button:has(svg)');

    // Sidebar should now be visible
    await expect(page.locator('nav >> text=Meus Pets')).toBeVisible();
    await expect(page.locator('nav >> text=Consultas')).toBeVisible();

    // Click on overlay to close sidebar
    await page.click('.fixed.inset-0.z-40.bg-gray-600');

    // Sidebar should be hidden again
    await expect(page.locator('.fixed.inset-y-0.left-0')).not.toBeVisible();
  });
});