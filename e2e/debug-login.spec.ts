import { test, expect } from '@playwright/test';

test.describe('Debug Client Login', () => {
  test('debug login flow', async ({ page }) => {
    await page.goto('/');

    // Take screenshot of initial state
    await page.screenshot({ path: 'test-results/debug/01-initial-state.png' });

    // Click on Consultar Resultados tab
    await page.click('text=Consultar Resultados');
    await page.waitForTimeout(1000);

    // Take screenshot after clicking tab
    await page.screenshot({ path: 'test-results/debug/02-after-tab-click.png' });

    // Check if form is visible
    const cpfVisible = await page.locator('input#public-cpf').isVisible();
    const codeVisible = await page.locator('input#public-code').isVisible();

    console.log('CPF input visible:', cpfVisible);
    console.log('Code input visible:', codeVisible);

    // Try alternative selectors if primary ones don't work
    if (!cpfVisible) {
      const allInputs = await page.locator('input').count();
      console.log('Total inputs found:', allInputs);

      for (let i = 0; i < allInputs; i++) {
        const input = page.locator('input').nth(i);
        const placeholder = await input.getAttribute('placeholder');
        const id = await input.getAttribute('id');
        console.log(`Input ${i}: id="${id}", placeholder="${placeholder}"`);
      }
    }

    if (!cpfVisible || !codeVisible) {
      // Try to find inputs by placeholder
      const cpfInput = page.locator('input[placeholder*="CPF"]').first();
      const codeInput = page.locator('input[placeholder*="código"]').first();

      if (await cpfInput.isVisible()) {
        await cpfInput.fill('123.456.789-00');
      }
      if (await codeInput.isVisible()) {
        await codeInput.fill('TEST123');
      }
    } else {
      // Fill in client credentials
      await page.fill('input#public-cpf', '123.456.789-00');
      await page.fill('input#public-code', 'TEST123');
    }

    // Take screenshot before clicking login
    await page.screenshot({ path: 'test-results/debug/03-before-login.png' });

    // Find and click login button
    const buttons = await page.locator('button').count();
    console.log('Total buttons found:', buttons);

    for (let i = 0; i < buttons; i++) {
      const button = page.locator('button').nth(i);
      const text = await button.textContent();
      console.log(`Button ${i}: "${text}"`);
    }

    // Try different button selectors
    const loginButton = page.locator('button:has-text("Consultar Resultado")').first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
    } else {
      // Try alternative selectors
      await page.click('button[type="submit"]');
    }

    // Wait and take final screenshot
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/debug/04-after-login.png' });

    // Check current URL
    console.log('Current URL:', page.url());
  });
});