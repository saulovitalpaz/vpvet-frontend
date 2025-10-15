import { test, expect } from '@playwright/test';

test.describe('Simple Client Dashboard Test', () => {
  test('manual client session setup and navigation', async ({ page }) => {
    // Set up client session manually
    await page.goto('/');

    // Set localStorage to simulate logged-in client
    await page.addInitScript(() => {
      localStorage.setItem('clientData', JSON.stringify({
        tutor_cpf: '12345678900',
        tutor_name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 98765-4321'
      }));
      localStorage.setItem('clientSession', 'true');
    });

    // Go directly to client dashboard
    await page.goto('/client-dashboard');
    await page.waitForLoadState('networkidle');

    // Take screenshot to see if we're on the dashboard
    await page.screenshot({
      path: 'test-results/simple-dashboard.png',
      fullPage: true
    });

    // Check for basic dashboard elements
    const welcomeElements = [
      'text=João Silva',
      'text=Bem-vindo',
      'text=Dashboard',
      'text=Pets',
      'nav',
      'main'
    ];

    console.log('Checking dashboard elements...');
    for (const selector of welcomeElements) {
      try {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible();
        console.log(`${selector}: ${isVisible}`);
      } catch (e) {
        console.log(`${selector}: Error checking visibility`);
      }
    }

    // Try navigating through the client pages
    const clientPages = [
      '/client-dashboard',
      '/client-dashboard/pets',
      '/client-dashboard/consultas',
      '/client-dashboard/exames',
      '/client-dashboard/historico',
      '/client-dashboard/meus-dados'
    ];

    for (const pagePath of clientPages) {
      console.log(`Navigating to: ${pagePath}`);
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: `test-results/simple-${pagePath.replace(/\//g, '-')}.png`,
        fullPage: true
      });

      // Wait a bit between pages
      await page.waitForTimeout(1000);
    }
  });
});