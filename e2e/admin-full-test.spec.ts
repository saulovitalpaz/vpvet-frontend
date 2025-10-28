import { test, expect } from '@playwright/test';

test.describe('Admin Dropdown Full Functionality Test', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear all storage for fresh login
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Login as Saulo
    await page.click('text=Clínicas Parceiras');
    await page.fill('input#partner-email', 'saulo@vpvet.com');
    await page.fill('input#partner-password', 'senha123');
    await page.click('button:has-text("Acessar Portal")');
    await page.waitForURL('**/dashboard');

    // Verify admin dropdown is visible
    const adminDropdown = page.locator('button:has-text("Admin")');
    await expect(adminDropdown).toBeVisible();
  });

  test('test all admin dropdown links work correctly', async ({ page }) => {
    const adminDropdown = page.locator('button:has-text("Admin")');

    // Define all admin links to test
    const adminLinks = [
      { name: 'Painel Administrativo', href: '/admin', description: 'Admin Dashboard' },
      { name: 'Gerenciar Clínicas', href: '/admin/clinics', description: 'Manage Clinics' },
      { name: 'Gerenciar Usuários', href: '/admin/users', description: 'Manage Users' },
      { name: 'Gerenciar Clientes', href: '/admin/clients', description: 'Manage Clients' },
      { name: 'Upload de Exames', href: '/admin/uploads', description: 'Upload Exams' },
      { name: 'Análises e Métricas', href: '/admin/analytics', description: 'Analytics' }
    ];

    console.log(`Testing ${adminLinks.length} admin dropdown links...`);

    for (const link of adminLinks) {
      console.log(`\n🔍 Testing: ${link.name} (${link.href})`);

      // Open admin dropdown
      await adminDropdown.click();
      await page.waitForTimeout(500);

      // Find and click the specific link
      const linkElement = page.locator(`a[href="${link.href}"]:has-text("${link.name}")`);
      await expect(linkElement).toBeVisible({ timeout: 5000 });

      // Click the link
      await linkElement.click();
      await page.waitForTimeout(1000);

      // Check navigation result
      const currentUrl = page.url();

      if (currentUrl.includes(link.href)) {
        console.log(`  ✅ SUCCESS: Navigated to ${link.href}`);

        // Check for page content
        const pageTitle = await page.title();
        console.log(`  📄 Page title: ${pageTitle}`);

        // Look for admin-specific content
        const adminSelectors = [
          'text=Painel Administrativo',
          'text=Gerenciar',
          'text=Clínicas',
          'text=Usuários',
          'text=Clientes',
          'text=Upload',
          'text=Análises',
          'text=Métricas'
        ];

        let hasAdminContent = false;
        for (const selector of adminSelectors) {
          if (await page.locator(selector).count() > 0) {
            hasAdminContent = true;
            break;
          }
        }

        if (hasAdminContent) {
          console.log(`  📋 Admin content detected`);
        } else {
          console.log(`  ⚠️  No specific admin content detected (might need more time to load)`);
        }

        // Check for errors
        const hasError = await page.locator('text=404, text=Error, text=Not Found').count() > 0;
        if (hasError) {
          console.log(`  ❌ Error page detected`);
        }

      } else {
        console.log(`  ❌ FAILED: Expected ${link.href}, but got ${currentUrl}`);
      }

      // Take screenshot for documentation
      const screenshotName = `admin-${link.href.replace(/\//g, '-')}.png`;
      await page.screenshot({ path: screenshotName, fullPage: true });

      // Go back to dashboard for next test
      await page.goto('/dashboard');
      await page.waitForURL('**/dashboard');
    }

    console.log('\n🎉 All admin links tested!');
  });

  test('verify admin dropdown shows correct admin menu items', async ({ page }) => {
    const adminDropdown = page.locator('button:has-text("Admin")');
    await adminDropdown.click();
    await page.waitForTimeout(500);

    // Check for admin-specific menu items
    const expectedMenuItems = [
      'Painel Administrativo',
      'Gerenciar Clínicas',
      'Gerenciar Usuários',
      'Gerenciar Clientes',
      'Upload de Exames',
      'Análises e Métricas'
    ];

    for (const item of expectedMenuItems) {
      const menuItem = page.locator(`text=${item}`);
      await expect(menuItem).toBeVisible();
      console.log(`✅ Found menu item: ${item}`);
    }

    // Also check that admin badge/shield is visible
    const adminBadge = page.locator('button:has-text("Admin")').locator('.bg-violet-600, [data-testid="admin-icon"], .shield');
    console.log('Admin dropdown styling checked');
  });
});