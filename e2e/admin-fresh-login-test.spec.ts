import { test, expect } from '@playwright/test';

test.describe('Admin Routes Fresh Login Test', () => {
  test('fresh login and test admin dropdown', async ({ page, context }) => {
    // Clear all storage before starting
    await context.clearCookies();
    await context.clearPermissions();

    // Start fresh
    await page.goto('/');

    // Clear localStorage manually
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Navigate to partner login
    await page.click('text=Clínicas Parceiras');

    // Login with Saulo's account (fresh login)
    await page.fill('input#partner-email', 'saulo@vpvet.com');
    await page.fill('input#partner-password', 'senha123');
    await page.click('button:has-text("Acessar Portal")');

    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard');

    // Check if user is admin by looking for admin dropdown
    const adminDropdown = page.locator('button:has-text("Admin")');
    await expect(adminDropdown).toBeVisible({ timeout: 10000 });

    console.log('✅ Admin dropdown is visible - user is recognized as admin');

    // Click admin dropdown
    await adminDropdown.click();
    await page.waitForTimeout(500);

    // Test the first admin link
    const adminPanelLink = page.locator('a[href="/admin"]:has-text("Painel Administrativo")');
    await expect(adminPanelLink).toBeVisible();

    console.log('Clicking Painel Administrativo link...');
    await adminPanelLink.click();

    // Wait for navigation
    await page.waitForTimeout(2000);

    // Check current URL
    const currentUrl = page.url();
    console.log(`Current URL after clicking admin panel: ${currentUrl}`);

    // Check if we're on admin page or redirected back to dashboard
    if (currentUrl.includes('/admin')) {
      console.log('✅ SUCCESS: Admin route is working!');

      // Look for admin content
      const adminContent = await page.locator('text=Painel Administrativo, text=Admin, text=Gerenciar').count();
      if (adminContent > 0) {
        console.log('✅ Admin content is visible');
      } else {
        console.log('⚠️ Admin route loaded but no admin content detected');
      }
    } else {
      console.log('❌ FAILED: Still being redirected to dashboard');

      // Check for any error messages
      const errorMessages = await page.locator('text=Error, text=404, text=Not Found').all();
      if (errorMessages.length > 0) {
        console.log('Error messages found on page');
      }
    }

    // Take screenshot for debugging
    await page.screenshot({
      path: 'admin-test-result.png',
      fullPage: true
    });

    // Debug: Check user data in browser
    const userData = await page.evaluate(() => {
      const token = localStorage.getItem('token');
      return {
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 50) + '...' : 'none'
      };
    });

    console.log('Browser storage info:', userData);
  });
});