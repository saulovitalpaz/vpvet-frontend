import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('partner login and navigate to public portal', async ({ page }) => {
    // Start from homepage
    await page.goto('/');

    // Check homepage loads correctly
    await expect(page.locator('h1')).toContainText('VPVET');
    await expect(page.locator('.inline-flex:has-text("Diagnóstico por Imagem Veterinária")')).toBeVisible();

    // Click on Clínicas Parceiras tab
    await page.click('text=Clínicas Parceiras');

    // Fill in partner credentials (test account)
    await page.fill('input#partner-email', 'saulo@vpvet.com');
    await page.fill('input#partner-password', 'senha123');

    // Click login button
    await page.click('button:has-text("Acessar Portal")');

    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard');

    // Verify dashboard loaded
    await expect(page.locator('h1:has-text("Bem-vindo")')).toBeVisible();
    await expect(page.locator('text=Dashboard').nth(1)).toBeVisible();

    // Check for sidebar navigation
    await expect(page.locator('nav >> text=Agenda')).toBeVisible();
    await expect(page.locator('nav >> text=Pacientes')).toBeVisible();
    await expect(page.locator('nav >> text=Consultas')).toBeVisible();

    // Look for Portal Público link in the dashboard
    const publicPortalLink = page.locator('a[href="/resultados"]:has-text("Portal Público")').first();
    await expect(publicPortalLink).toBeVisible();

    // Click on Portal Público link
    await publicPortalLink.click();

    // Verify navigation to resultados page
    await page.waitForURL('**/resultados');

    // Check public portal page loads correctly
    await expect(page.locator('h1')).toContainText('VPVET');
    await expect(page.locator('h3:has-text("Consulta de Resultados")')).toBeVisible();

    // Verify it's the public interface (no sidebar)
    await expect(page.locator('text=Agenda')).not.toBeVisible();
    await expect(page.locator('text=Pacientes')).not.toBeVisible();

    // Verify back to home link works
    await page.click('text=Voltar para início');
    await page.waitForURL('**/');
    await expect(page.locator('h1')).toContainText('VPVET');
  });

  test('public access from homepage', async ({ page }) => {
    // Start from homepage
    await page.goto('/');

    // Click on Consultar Resultados tab
    await page.click('text=Consultar Resultados');

    // Fill in test credentials for public access
    await page.fill('input#public-cpf', '123.456.789-00');
    await page.fill('input#public-code', 'TEST123');

    // Verify fields are filled correctly
    await expect(page.locator('input#public-cpf')).toHaveValue('123.456.789-00');
    await expect(page.locator('input#public-code')).toHaveValue('TEST123');

    // Check instructions are visible
    await expect(page.locator('text=O código de acesso é fornecido pela clínica veterinária')).toBeVisible();
  });

  test('direct navigation to resultados page', async ({ page }) => {
    // Navigate directly to resultados page
    await page.goto('/resultados');

    // Verify page loads without authentication
    await expect(page.locator('text=VPVET').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Consulta de Resultados")')).toBeVisible();

    // Verify it's public interface (no authentication required)
    await expect(page.locator('text=Voltar para início')).toBeVisible();

    // Verify form is present
    await expect(page.locator('input#cpf')).toBeVisible();
    await expect(page.locator('input#code')).toBeVisible();
  });

  test('protected routes require authentication', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');

    // Should redirect to homepage
    await page.waitForURL('**/');
    await expect(page.locator('h1')).toContainText('VPVET');
    await expect(page.locator('text=Clínicas Parceiras')).toBeVisible();
  });

  test('partner login with test accounts', async ({ page }) => {
    // Start from homepage
    await page.goto('/');

    // Click on Clínicas Parceiras tab
    await page.click('text=Clínicas Parceiras');

    // In development mode, test accounts should be visible
    if (process.env.NODE_ENV === 'development') {
      // Click to show test accounts
      await page.click('text=Mostrar contas de teste');

      // Verify test account buttons are visible
      await expect(page.locator('text=Dr. Saulo:')).toBeVisible();
      await expect(page.locator('text=Secretária:')).toBeVisible();

      // Click on Dr. Saulo test account
      await page.click('text=Dr. Saulo:');

      // Verify fields are filled
      await expect(page.locator('input#partner-email')).toHaveValue('saulo@vpvet.com');
      await expect(page.locator('input#partner-password')).toHaveValue('senha123');
    }
  });

  test('logout functionality redirects to homepage', async ({ page }) => {
    // Start from homepage
    await page.goto('/');

    // Click on Clínicas Parceiras tab
    await page.click('text=Clínicas Parceiras');

    // Fill in partner credentials (test account)
    await page.fill('input#partner-email', 'saulo@vpvet.com');
    await page.fill('input#partner-password', 'senha123');

    // Click login button
    await page.click('button:has-text("Acessar Portal")');

    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard');

    // Verify dashboard loaded
    await expect(page.locator('h1:has-text("Bem-vindo")')).toBeVisible();

    // Click on Sair (logout) button
    await page.click('button:has-text("Sair")');

    // Should redirect to homepage
    await page.waitForURL('**/');
    await expect(page.locator('h1')).toContainText('VPVET');
    await expect(page.locator('text=Clínicas Parceiras')).toBeVisible();

    // Verify user is logged out by trying to access protected route
    await page.goto('/dashboard');
    await page.waitForURL('**/');
    await expect(page.locator('text=Clínicas Parceiras')).toBeVisible();
  });
});