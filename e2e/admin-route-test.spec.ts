import { test, expect } from '@playwright/test';

test.describe('Admin Route Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Saulo before each test
    await page.goto('/');
    await page.click('text=Clínicas Parceiras');
    await page.fill('input#partner-email', 'saulo@vpvet.com');
    await page.fill('input#partner-password', 'senha123');
    await page.click('button:has-text("Acessar Portal")');
    await page.waitForURL('**/dashboard');
  });

  test('direct navigation to admin routes', async ({ page }) => {
    const adminRoutes = [
      { path: '/admin', name: 'Admin Dashboard' },
      { path: '/admin/clinics', name: 'Manage Clinics' },
      { path: '/admin/users', name: 'Manage Users' },
      { path: '/admin/clients', name: 'Manage Clients' },
      { path: '/admin/uploads', name: 'Upload Exams' },
      { path: '/admin/analytics', name: 'Analytics' }
    ];

    for (const route of adminRoutes) {
      console.log(`Testing route: ${route.path}`);

      // Navigate to the admin route
      await page.goto(route.path);

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Take screenshot
      await page.screenshot({
        path: `admin-route-${route.path.replace(/\//g, '-')}.png`,
        fullPage: true
      });

      // Check if page loaded without errors
      const pageTitle = await page.title();
      console.log(`  - Page title: ${pageTitle}`);

      // Look for error indicators
      const hasError = await page.locator('text=404, text=Error, text=Not Found, text=Página não encontrada').count() > 0;
      const hasAdminContent = await page.locator('text=Painel, text=Gerenciar, text=Admin').count() > 0;

      if (hasError) {
        console.log(`  - ❌ ERROR: Page not found or error detected`);
      } else if (hasAdminContent) {
        console.log(`  - ✅ Admin page loaded successfully`);
      } else {
        console.log(`  - ⚠️  Page loaded but no admin content detected`);
      }

      // Check current URL
      const currentUrl = page.url();
      console.log(`  - Current URL: ${currentUrl}`);

      // Wait a bit before next test
      await page.waitForTimeout(1000);
    }
  });

  test('check admin dropdown actual href attributes', async ({ page }) => {
    // Find and click admin dropdown
    const adminDropdown = page.locator('button:has-text("Admin")');
    await expect(adminDropdown).toBeVisible();
    await adminDropdown.click();

    // Wait for dropdown to open
    await page.waitForTimeout(500);

    // Find all admin links
    const adminLinks = page.locator('a[href^="/admin"]');
    const linkCount = await adminLinks.count();

    console.log(`Found ${linkCount} admin links`);

    for (let i = 0; i < linkCount; i++) {
      const link = adminLinks.nth(i);
      const href = await link.getAttribute('href');
      const text = await link.textContent();

      console.log(`Link ${i + 1}: "${text}" -> ${href}`);

      // Test the link
      await link.click();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      console.log(`  - Navigated to: ${currentUrl}`);

      // Check if page loaded correctly
      const pageTitle = await page.title();
      console.log(`  - Page title: ${pageTitle}`);

      const hasError = await page.locator('text=404, text=Error, text=Not Found').count() > 0;
      if (hasError) {
        console.log(`  - ❌ ERROR: Page not found`);
      } else {
        console.log(`  - ✅ Page loaded successfully`);
      }

      // Go back to dashboard and reopen dropdown
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await adminDropdown.click();
      await page.waitForTimeout(500);
    }
  });
});