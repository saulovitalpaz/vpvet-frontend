import { test, expect } from '@playwright/test';

test.describe('Admin Dropdown Menu Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Saulo before each test
    await page.goto('/');
    await page.click('text=Clínicas Parceiras');
    await page.fill('input#partner-email', 'saulo@vpvet.com');
    await page.fill('input#partner-password', 'senha123');
    await page.click('button:has-text("Acessar Portal")');
    await page.waitForURL('**/dashboard');
    await expect(page.locator('h1:has-text("Bem-vindo")')).toBeVisible();
  });

  test('identify and test admin dropdown menu links', async ({ page }) => {
    console.log('Looking for admin dropdown menu...');

    // Look for admin user dropdown/avatar (usually in top right)
    const adminDropdownSelectors = [
      '[data-testid="admin-dropdown"]',
      '[aria-label="admin menu"]',
      '[aria-label="user menu"]',
      'button[aria-haspopup="true"]',
      '.admin-dropdown',
      '.user-dropdown',
      'button:has-text("Admin")',
      'button:has-text("Administrador")',
      'button:has-text("Saulo")',
      'img[alt="avatar"]',
      '.avatar',
      '.user-avatar'
    ];

    let adminDropdown = null;
    for (const selector of adminDropdownSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          adminDropdown = element;
          console.log(`Found admin dropdown with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue trying other selectors
      }
    }

    if (!adminDropdown) {
      // Look for any button that might be a dropdown in the header
      const headerButtons = await page.locator('header button, .header button, nav button').all();
      for (const button of headerButtons) {
        const text = await button.textContent();
        if (text && (text.includes('Admin') || text.includes('Saulo') || text.includes('User') || text.includes('Menu'))) {
          adminDropdown = button;
          console.log(`Found potential admin dropdown button with text: ${text}`);
          break;
        }
      }
    }

    if (!adminDropdown) {
      console.log('Taking screenshot to debug the page layout...');
      await page.screenshot({ path: 'debug-dashboard.png', fullPage: true });

      // Log all visible buttons and links
      const allButtons = await page.locator('button, a[role="button"]').all();
      console.log(`Found ${allButtons.length} buttons on page`);

      for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
        try {
          const text = await allButtons[i].textContent();
          const isVisible = await allButtons[i].isVisible();
          console.log(`Button ${i}: "${text}" - Visible: ${isVisible}`);
        } catch (e) {
          console.log(`Button ${i}: Could not get text`);
        }
      }
    }

    expect(adminDropdown, 'Admin dropdown menu should be found').toBeTruthy();

    // Click the dropdown to open the menu
    await adminDropdown.click();

    // Wait for dropdown menu to appear
    await page.waitForTimeout(500);

    // Find all menu items in the dropdown
    const menuItems = await page.locator('[role="menuitem"], .dropdown-item, .menu-item, a[role="menuitem"]').all();
    console.log(`Found ${menuItems.length} menu items in admin dropdown`);

    if (menuItems.length === 0) {
      // Look for any links or buttons that appeared after clicking dropdown
      const dropdownLinks = await page.locator('a[href], button').all();
      console.log(`Found ${dropdownLinks.length} total clickable elements`);

      // Filter for those that are newly visible (likely in dropdown)
      const visibleLinks = [];
      for (const link of dropdownLinks) {
        try {
          const isVisible = await link.isVisible();
          const text = await link.textContent();
          if (isVisible && text && text.trim()) {
            visibleLinks.push({ element: link, text: text.trim() });
            console.log(`Visible link: "${text}"`);
          }
        } catch (e) {
          // Skip elements that can't be analyzed
        }
      }

      expect(visibleLinks.length, 'Admin dropdown should have menu items').toBeGreaterThan(0);

      // Test each visible link
      for (const { element, text } of visibleLinks) {
        console.log(`Testing admin menu item: "${text}"`);

        // Get href if it's a link
        const href = await element.getAttribute('href');
        console.log(`  - Link href: ${href}`);

        // Click the link
        await element.click();

        // Wait for navigation
        await page.waitForTimeout(1000);

        // Check current URL
        const currentUrl = page.url();
        console.log(`  - Navigated to: ${currentUrl}`);

        // Check if page loaded successfully or if there's an error
        const pageTitle = await page.title();
        console.log(`  - Page title: ${pageTitle}`);

        // Look for error messages
        const errorElements = await page.locator('text=404, text=Error, text=Not Found, text=Página não encontrada').all();
        if (errorElements.length > 0) {
          console.log(`  - ❌ ERROR: Page not found or error detected`);
        } else {
          console.log(`  - ✅ Page loaded successfully`);
        }

        // Take screenshot for documentation
        const screenshotName = `admin-page-${text.toLowerCase().replace(/\s+/g, '-')}.png`;
        await page.screenshot({ path: screenshotName, fullPage: true });

        // Go back to dashboard
        await page.goto('/dashboard');
        await page.waitForURL('**/dashboard');

        // Reopen dropdown
        await adminDropdown.click();
        await page.waitForTimeout(500);
      }
    } else {
      // Test properly structured menu items
      for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        const text = await item.textContent();
        console.log(`Testing menu item ${i + 1}: "${text}"`);

        // Get href if it's a link
        const href = await item.getAttribute('href');
        console.log(`  - Link href: ${href}`);

        // Click the menu item
        await item.click();

        // Wait for navigation
        await page.waitForTimeout(1000);

        // Check current URL
        const currentUrl = page.url();
        console.log(`  - Navigated to: ${currentUrl}`);

        // Check if page loaded successfully
        const pageTitle = await page.title();
        console.log(`  - Page title: ${pageTitle}`);

        // Look for error indicators
        const hasError = await page.locator('text=404, text=Error, text=Not Found').count() > 0;
        console.log(`  - ${hasError ? '❌ ERROR: Page not found' : '✅ Page loaded successfully'}`);

        // Take screenshot
        const screenshotName = `admin-menu-item-${i + 1}-${text.toLowerCase().replace(/\s+/g, '-')}.png`;
        await page.screenshot({ path: screenshotName, fullPage: true });

        // Go back to dashboard
        await page.goto('/dashboard');
        await page.waitForURL('**/dashboard');

        // Reopen dropdown
        await adminDropdown.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('document current dashboard structure', async ({ page }) => {
    // Take screenshot of dashboard
    await page.screenshot({ path: 'dashboard-overview.png', fullPage: true });

    // Log all navigation elements
    const navLinks = await page.locator('nav a, .navigation a, .sidebar a, .menu a').all();
    console.log(`Found ${navLinks.length} navigation links`);

    for (let i = 0; i < navLinks.length; i++) {
      try {
        const text = await navLinks[i].textContent();
        const href = await navLinks[i].getAttribute('href');
        const isVisible = await navLinks[i].isVisible();
        console.log(`Nav ${i}: "${text}" -> ${href} (Visible: ${isVisible})`);
      } catch (e) {
        console.log(`Nav ${i}: Could not analyze`);
      }
    }

    // Check for any admin-related elements
    const adminElements = await page.locator('[class*="admin"], [id*="admin"], text=Admin, text=Administrador').all();
    console.log(`Found ${adminElements.length} admin-related elements`);

    for (let i = 0; i < adminElements.length; i++) {
      try {
        const text = await adminElements[i].textContent();
        const isVisible = await adminElements[i].isVisible();
        console.log(`Admin Element ${i}: "${text}" (Visible: ${isVisible})`);
      } catch (e) {
        console.log(`Admin Element ${i}: Could not analyze`);
      }
    }
  });
});