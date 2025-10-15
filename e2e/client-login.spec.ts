import { test, expect } from '@playwright/test';

test.describe('Client Login and Dashboard', () => {
  test('client login from homepage and dashboard navigation', async ({ page }) => {
    // Start from homepage
    await page.goto('/');

    // Check homepage loads correctly with the new design
    await expect(page.locator('h1')).toContainText('VPVET');
    await expect(page.locator('p:has-text("Vital Paz Veterinária")').first()).toBeVisible();
    await expect(page.locator('.inline-flex:has-text("Diagnóstico por Imagem Veterinária")')).toBeVisible();

    // Click on Consultar Resultados tab
    await page.click('text=Consultar Resultados');

    // Wait for the tab to be active and form to be visible
    await expect(page.locator('text=CPF do Tutor')).toBeVisible();
    await expect(page.locator('text=Código de Acesso')).toBeVisible();

    // Fill in client credentials
    await page.fill('input#public-cpf', '123.456.789-00');
    await page.fill('input#public-code', 'TEST123');

    // Click login button
    await page.click('button:has-text("Consultar Resultado")');

    // Wait for navigation to client dashboard (this should happen automatically)
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

  test('navigate to Meus Pets page from dashboard', async ({ page }) => {
    // Login to client dashboard
    await page.goto('/');
    await page.click('text=Consultar Resultados');
    await page.fill('input#public-cpf', '123.456.789-00');
    await page.fill('input#public-code', 'TEST123');
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

  test('navigate to Exames page from dashboard', async ({ page }) => {
    // Login to client dashboard
    await page.goto('/');
    await page.click('text=Consultar Resultados');
    await page.fill('input#public-cpf', '123.456.789-00');
    await page.fill('input#public-code', 'TEST123');
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

  test('client logout functionality', async ({ page }) => {
    // Login to client dashboard
    await page.goto('/');
    await page.click('text=Consultar Resultados');
    await page.fill('input#public-cpf', '123.456.789-00');
    await page.fill('input#public-code', 'TEST123');
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
});